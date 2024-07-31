/* eslint-disable @typescript-eslint/no-use-before-define */

'use server';

import { revalidatePath } from 'next/cache';
import { Participant } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { auth } from '@/auth';

export async function createTournament(formData: any) {
  const session = await auth();
  const organizerId = session?.user?.id;

  if (!organizerId) {
    throw new Error('Unauthorized');
  }

  try {
    const { generalInfo, locationTime, participants } = formData;

    // Creating the tournament and storing the result
    const newTournament = await prisma.tournament.create({
      data: {
        name: generalInfo.tournamentName,
        numberOfCourts: locationTime.numberOfCourts,
        startTime: new Date(locationTime.startTime),
        matchDuration: locationTime.matchDuration,
        breakDuration: locationTime.breakDuration,
        locationName: locationTime.locationName,
        street: locationTime.street,
        city: locationTime.city,
        zipCode: locationTime.zipCode,
        organizerId,
        participants: {
          create: participants.participants.map(
            (participant: { name: string }) => ({
              name: participant.name,
            }),
          ),
        },
      },
      include: {
        participants: true, // This will return participants with their IDs
      },
    });

    // Assign participants to groups and create group matches
    const groupSize = 4; // Example group size
    await assignParticipantsToGroups(
      newTournament.id,
      newTournament.participants,
      groupSize,
    );
    await generateGroupStageMatches(
      newTournament.id,
      locationTime.startTime,
      locationTime.matchDuration,
      locationTime.breakDuration,
    );

    // Revalidate the home page (or any relevant path)
    revalidatePath('/');

    return newTournament;
  } catch (error) {
    console.error('Error creating tournament:', error);
    throw new Error('Internal Server Error');
  }
}

async function assignParticipantsToGroups(
  tournamentId: string,
  participants: Participant[],
  groupSize: number,
) {
  const shuffledParticipants = participants.sort(() => 0.5 - Math.random());

  await Promise.all(
    Array(Math.ceil(shuffledParticipants.length / groupSize))
      .fill(null)
      .map((_, groupIndex) => {
        const groupParticipants = shuffledParticipants.slice(
          groupIndex * groupSize,
          (groupIndex + 1) * groupSize,
        );

        return prisma.group
          .create({
            data: {
              name: `Group ${String.fromCharCode(65 + groupIndex)}`, // A, B, C, etc.
              tournamentId,
              participants: {
                connect: groupParticipants.map((p) => ({ id: p.id })),
              },
            },
          })
          .then((group) =>
            prisma.participant.updateMany({
              where: { id: { in: groupParticipants.map((p) => p.id) } },
              data: { groupId: group.id },
            }),
          );
      }),
  );
}

async function generateGroupStageMatches(
  tournamentId: string,
  startTime: string,
  matchDuration: number,
  breakDuration: number,
) {
  const groups = await prisma.group.findMany({
    where: { tournamentId },
    include: { participants: true },
  });

  const startTimeDate = new Date(startTime);

  await Promise.all(
    groups.flatMap((group) =>
      group.participants.flatMap((participant, i) =>
        group.participants.slice(i + 1).map((opponent, j) => {
          const matchStartTime = new Date(
            startTimeDate.getTime() +
              (matchDuration + breakDuration) * (i + j) * 60000,
          );

          return prisma.match
            .create({
              data: {
                startTime: matchStartTime,
                tournamentId,
                participants: {
                  connect: [{ id: participant.id }, { id: opponent.id }],
                },
              },
            })
            .then((match) =>
              prisma.result.createMany({
                data: [
                  {
                    matchId: match.id,
                    participantId: participant.id,
                    score: 0,
                  },
                  {
                    matchId: match.id,
                    participantId: opponent.id,
                    score: 0,
                  },
                ],
              }),
            );
        }),
      ),
    ),
  );
}

export async function updateMatchResult(
  matchId: string,
  results: { participantId: string; score: number }[],
) {
  try {
    const updatedResults = await Promise.all(
      results.map((result) =>
        prisma.result.update({
          where: {
            matchId_participantId: {
              matchId,
              participantId: result.participantId,
            },
          },
          data: {
            score: result.score,
          },
        }),
      ),
    );

    return updatedResults;
  } catch (error) {
    console.error('Error updating match result:', error);
    throw new Error('Internal Server Error');
  }
}

export async function updateMatchResultAction(
  matchId: string,
  results: { participantId: string; score: number }[],
) {
  try {
    const updatedResults = await Promise.all(
      results.map((result) =>
        prisma.result.update({
          where: {
            matchId_participantId: {
              matchId,
              participantId: result.participantId,
            },
          },
          data: {
            score: result.score,
          },
        }),
      ),
    );

    // Revalidate the tournament page
    revalidatePath('/tournament/[id]');

    return { success: true, results: updatedResults };
  } catch (error) {
    console.error('Error updating match result:', error);
    return { success: false, error: 'Failed to update match result' };
  }
}

export async function endMatchAndCalculatePoints(matchId: string) {
  try {
    // Fetch the match with its results and participants
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        results: true,
        participants: true,
        tournament: true,
      },
    });

    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status === 'FINISHED') {
      throw new Error('Match is already finished');
    }

    // Sort results by score in descending order
    const sortedResults = match.results.sort((a, b) => b.score - a.score);

    // Determine the outcome
    if (sortedResults[0].score === sortedResults[1].score) {
      // It's a draw
      await Promise.all(
        sortedResults.map((result) =>
          prisma.participant.update({
            where: { id: result.participantId },
            data: { points: { increment: 1 } }, // 1 point for a draw
          }),
        ),
      );
    } else {
      // There's a winner
      await prisma.participant.update({
        where: { id: sortedResults[0].participantId },
        data: { points: { increment: 3 } }, // 3 points for a win
      });
      // The loser gets 0 points, so no update needed
    }

    // Mark the match as finished and points calculated
    await prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'FINISHED',
        pointsCalculated: true,
      },
    });

    // Revalidate the tournament page
    revalidatePath(`/tournament/${match.tournamentId}`);

    return {
      success: true,
      message: 'Match ended and points calculated successfully',
    };
  } catch (error) {
    console.error('Error ending match and calculating points:', error);
    return {
      success: false,
      error: 'Failed to end match and calculate points',
    };
  }
}
