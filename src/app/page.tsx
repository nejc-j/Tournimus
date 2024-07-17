import React from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import TournamentList from '../components/TournamentList';
import { Button } from '../components/ui/button';
import { Tournament } from '../types';
import SearchBar from '../components/ui/searchbar';

async function getTournaments(searchTerm?: string): Promise<Tournament[]> {
  const res = await fetch('http://localhost:3000/tournaments.json', {
    cache: 'no-store',
  });
  const allTournaments = await res.json();

  if (searchTerm) {
    return allTournaments.filter((tournament: Tournament) =>
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }
  return allTournaments;
}

interface HomeProps {
  searchParams: { search?: string };
}

async function Home({ searchParams }: HomeProps) {
  const t = await getTranslations('Home');
  const searchTerm = searchParams.search || '';
  const tournaments = await getTournaments(searchTerm);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 m-0">
      <div className="relative w-full h-[300px] md:h-[500px] top-0 left-0">
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
          <Button>{t('button_create_tournament')}</Button>
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto flex-grow p-4">
        <div className="text-left">
          <h2 className="text-white text-3xl font-semibold mb-4 italic">
            TRENUTNI TURNIRJI
          </h2>
          <SearchBar initialSearchTerm={searchTerm} />
          <div className="inline-block">
            <h3 className="text-tertiary text-xl font-semibold mb-1">
              PRIHAJAJOČI
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
