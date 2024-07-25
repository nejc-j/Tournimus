// app/api/tournaments/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { ExtendedTournament } from '../../../../types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const tournament: ExtendedTournament | null =
      await prisma.tournament.findUnique({
        where: { id },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              // Add other fields as needed
            },
          },
          matches: {
            include: {
              participants: true,
              results: true,
            },
          },
          organizer: true,
          groups: {
            include: {
              participants: true,
            },
          },
        },
      });

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tournament' },
      { status: 500 },
    );
  }
}
