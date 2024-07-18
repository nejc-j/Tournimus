import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clock4, MapPin } from 'lucide-react';
import { Tournament } from '../../../types';

async function getTournament(id: string): Promise<Tournament | null> {
  const res = await fetch('http://localhost:3000/tournaments.json', {
    cache: 'no-store',
  });
  const tournaments: Tournament[] = await res.json();
  return tournaments.find((t) => t.id === id) || null;
}

interface TournamentPageProps {
  params: { id: string };
}

export default async function TournamentPage({ params }: TournamentPageProps) {
  const tournament = await getTournament(params.id);

  if (!tournament) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {tournament.image && (
          <div className="relative h-64 w-full">
            <Image
              src={tournament.image}
              alt={`${tournament.name} banner`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-primary mb-4">
            {tournament.name}
          </h1>
          <div className="flex items-center text-primary mb-2">
            <Calendar className="text-tertiary mr-2" size="20" />
            <p className="text-lg">{tournament.date}</p>
          </div>
          <div className="flex items-center text-primary mb-2">
            <Clock4 className="text-tertiary mr-2" size="20" />
            <p className="text-lg">{tournament.time}</p>
          </div>
          <div className="flex items-start text-primary mb-4">
            <MapPin className="text-tertiary mr-2 flex-none" size="20" />
            <p className="text-lg font-semibold">{tournament.location}</p>
          </div>
          {/* Add more details as needed */}
        </div>
      </div>
    </div>
  );
}
