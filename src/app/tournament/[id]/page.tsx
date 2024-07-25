import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clock4, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ExtendedTournament, MatchWithDetails } from '../../../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Participant } from '@prisma/client';

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

  if (!tournament) {
    notFound();
  }

  const isMatchLive = (startTime: Date, matchDuration: number): boolean => {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + matchDuration * 60000);
    const now = new Date();
    return now >= start && now <= end;
  };

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

      <div className="max-w-6xl mx-auto p-4 w-full">
        <h2 className="text-2xl font-bold mb-4">Groups</h2>
        {tournament.groups.map((group) => (
          <div key={group.id} className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
            <ul className="list-disc list-inside">
              {group.participants.map((participant: Participant) => (
                <li key={participant.id} className="ml-4">
                  {participant.name}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h2 className="text-2xl font-bold mb-4">Matches</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Match</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournament.matches.map(
              (match: MatchWithDetails, index: number) => (
                <TableRow key={match.id}>
                  <TableCell className="font-semibold w-[10px]">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {match.participants.map(
                      (participant: Participant, pIndex: number) => (
                        <div key={participant.id}>
                          {participant.name}
                          {pIndex === 0 && <span> vs </span>}
                        </div>
                      ),
                    )}
                  </TableCell>
                  <TableCell>
                    {match.results.map((result, rIndex) => (
                      <div key={rIndex}>
                        {result.participantId === match.participants[0].id
                          ? result.score
                          : ''}
                        {result.participantId === match.participants[1].id
                          ? result.score
                          : ''}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {new Date(match.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    {isMatchLive(match.startTime, tournament.matchDuration)
                      ? 'Live'
                      : 'Upcoming'}
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
