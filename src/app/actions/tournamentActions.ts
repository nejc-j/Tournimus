'use server';

import { revalidatePath } from 'next/cache';
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
    });

    revalidatePath('/'); // Revalidate the home page (or any relevant path)
    console.log('gg');

    return newTournament;
  } catch (error) {
    console.error('Error creating tournament:', error);
    throw new Error('Internal Server Error');
  }
}
