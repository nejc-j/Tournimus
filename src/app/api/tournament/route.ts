// app/api/tournament/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const {
      name,
      numberOfCourts,
      startTime,
      matchDuration,
      breakDuration,
      participants,
      locationName,
      street,
      city,
      zipCode,
      organizerId,
    } = await request.json();

    const newTournament = await prisma.tournament.create({
      data: {
        name,
        numberOfCourts,
        startTime: new Date(startTime),
        matchDuration,
        breakDuration,
        locationName,
        street,
        city,
        zipCode,
        organizerId,
        participants: {
          create: participants.map((participant: { name: string }) => ({
            name: participant.name,
          })),
        },
      },
    });

    return NextResponse.json(newTournament, { status: 201 });
  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
