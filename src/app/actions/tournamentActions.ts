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
