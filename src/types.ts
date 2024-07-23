// types/index.ts

import { Prisma } from '@prisma/client';

// Define a type that includes the participants and results relation for matches
const matchWithDetails = Prisma.validator<Prisma.MatchArgs>()({
  include: {
    participants: true,
    results: true,
  },
});

export type MatchWithDetails = Prisma.MatchGetPayload<typeof matchWithDetails>;

// Define a type that includes the matches relation for tournaments
const tournamentWithMatches = Prisma.validator<Prisma.TournamentArgs>()({
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
  },
});

export type ExtendedTournament = Prisma.TournamentGetPayload<
  typeof tournamentWithMatches
>;
