import React from 'react';
import TournamentCard from './TournamentCard';
import { Tournament } from '../types';

interface TournamentListProps {
  tournaments?: Tournament[];
}

function TournamentList({ tournaments }: TournamentListProps) {
  return (
    <div>
      {tournaments && tournaments.length === 0 ? (
        <p className="text-left text-gray-500">No tournaments found</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments?.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              id={tournament.id}
              name={tournament.name}
              date={tournament.date}
              time={tournament.time}
              location={tournament.location}
              image={tournament.image}
            />
          ))}
        </div>
      )}
    </div>
  );
}

TournamentList.defaultProps = {
  tournaments: [],
};

export default TournamentList;
