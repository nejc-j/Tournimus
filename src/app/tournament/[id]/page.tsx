import React from 'react';
import { notFound } from 'next/navigation';
import { Calendar, Clock4, MapPin } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { ExtendedTournament, GroupWithParticipants } from '../../../types';
import GroupSwitcher from '../../../components/GroupSwitcher';
import MatchesTable from '../../../components/MatchesTable';

async function getTournament(id: string): Promise<ExtendedTournament | null> {
  const res = await fetch(`http://localhost:3000/api/tournament/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

interface TournamentPageProps {
  params: { id: string };
}

export default async function TournamentPage({ params }: TournamentPageProps) {
  const tournament = await getTournament(params.id);
  console.log(tournament);

  if (!tournament) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-0 m-0">
      <div className="relative w-full h-[300px] md:h-[500px] top-0 left-0">
        <Image
          src="/background-stadium.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="max-w-6xl mx-auto">
          <Card className="bg-primary/60 backdrop-blur-md p-6 text-white border-none mt-[100px]">
            <h1>{tournament.name}</h1>
            <div className="flex items-center text-white mb-2">
              <Calendar className="text-tertiary mr-2" size="16" />
              <p className="text-xs sm:text-sm">
                {new Date(tournament.startTime).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center text-white mb-2">
              <Clock4 className="text-tertiary mr-2" size="16" />
              <p className="text-xs sm:text-sm">
                {new Date(tournament.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex items-start text-white">
              <MapPin className="text-tertiary mr-2 flex-none" size="16" />
              <p className="font-semibold text-xs sm:text-sm">
                {tournament.locationName}, {tournament.city}
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 w-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 md:pr-2">
          <Card className="bg-white/5 backdrop-blur-md p-6 text-white border-none ">
            <h2 className="text-2xl font-bold mb-4">Matches</h2>
            <MatchesTable
              matches={tournament.matches}
              matchDuration={tournament.matchDuration}
            />
          </Card>
        </div>
        <div className="w-full md:w-1/2 md:pl-2">
          <Card className="bg-white/5 backdrop-blur-md p-6 text-white border-none ">
            <GroupSwitcher
              groups={tournament.groups as GroupWithParticipants[]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
