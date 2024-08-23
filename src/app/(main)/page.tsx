import React from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { PrismaClient, Tournament } from '@prisma/client';
import TournamentList from '../../components/TournamentList';
import { Button } from '../../components/ui/button';
import SearchBar from '../../components/ui/searchbar';

const prisma = new PrismaClient();

async function getTournaments(searchTerm?: string): Promise<Tournament[]> {
  const allTournaments = await prisma.tournament.findMany({
    where: {
      name: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
      numberOfCourts: true,
      startTime: true,
      matchDuration: true,
      breakDuration: true,
      locationName: true,
      street: true,
      city: true,
      zipCode: true,
      organizerId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Transform data to match the Tournament type if necessary
  return allTournaments.map((tournament) => ({
    ...tournament,
    startTime: new Date(tournament.startTime),
    createdAt: new Date(tournament.createdAt),
    updatedAt: new Date(tournament.updatedAt),
  }));
}

interface HomeProps {
  searchParams: { search?: string };
}

async function Home({ searchParams }: HomeProps) {
  const t = await getTranslations('Home');
  const tSearchBar = await getTranslations('SearchBar');
  const searchTerm = searchParams.search || '';
  const tournaments = await getTournaments(searchTerm);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 m-0">
      <div className="relative w-full h-[500px] md:h-[500px] top-0 left-0">
        <Image
          src="/background-stadium.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
          <div className="max-w-6xl mx-auto text-center p-4 flex flex-col gap-10">
            <h1 className="text-white text-3xl md:text-5xl font-semibold">
              {t('welcome_message')}
            </h1>
            <p>{t('welcome_description')}</p>
          </div>
          <Link href="/create-tournament">
            <Button>{t('button_create_tournament')}</Button>
          </Link>
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto flex-grow p-4">
        <div className="text-left">
          <h2 className="text-white text-3xl font-semibold mt-4 mb-4 italic">
            {t('current_tournaments')}
          </h2>
          <SearchBar
            initialSearchTerm={searchTerm}
            placeholder={tSearchBar('tournament_search')}
          />
          <div className="inline-block">
            <h3 className="text-tertiary text-xl font-semibold mb-1">
              {t('upcoming')}
            </h3>
            <div className="border-b-4 border-tertiary w-full rounded-full mb-4" />
          </div>
        </div>
        <TournamentList tournaments={tournaments} />
      </div>
    </main>
  );
}

export default Home;
