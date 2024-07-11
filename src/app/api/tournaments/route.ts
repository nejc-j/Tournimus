import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        location: true,
        organizer: true,
        participants: true,
      },
    });
    return NextResponse.json({ tournaments });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 },
    );
  }
}
