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

    // Creating participants concurrently

    // Generating matches with the correct parameters
    await generateMatches(
      newTournament.id,
      locationTime.startTime,
      locationTime.matchDuration,
      locationTime.breakDuration,
      newTournament.participants,
    );

    // Revalidate the home page (or any relevant path)
    revalidatePath('/');

    return newTournament;
  } catch (error) {
    console.error('Error creating tournament:', error);
    throw new Error('Internal Server Error');
  }
}

async function generateMatches(
  tournamentId: string,
  startTime: string,
  matchDuration: number,
  breakDuration: number,
  participants: Participant[],
) {
  const startTimeDate = new Date(startTime);

  console.log(
    tournamentId,
    startTime,
    matchDuration,
    breakDuration,
    participants,
  );

  for (let i = 0; i < participants.length; i += 2) {
    if (i + 1 >= participants.length) break;

    const matchStartTime = new Date(
      startTimeDate.getTime() +
        (matchDuration + breakDuration) * (i / 2) * 60000,
    );

    const match = await prisma.match.create({
      data: {
        startTime: matchStartTime,
        tournamentId,
        participants: {
          connect: [{ id: participants[i].id }, { id: participants[i + 1].id }],
        },
      },
    });

    await prisma.result.createMany({
      data: [
        {
          matchId: match.id,
          participantId: participants[i].id,
          score: 0,
        },
        {
          matchId: match.id,
          participantId: participants[i + 1].id,
          score: 0,
        },
      ],
    });
  }
}
