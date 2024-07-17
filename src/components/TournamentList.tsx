import React from 'react';
import TournamentCard from './TournamentCard';
import { Tournament } from '../types';

interface TournamentListProps {
  tournaments?: Tournament[];
}

function TournamentList({ tournaments = [] }: TournamentListProps) {
  if (tournaments.length === 0) {
    return <p>No tournaments available</p>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {tournaments.map((tournament) => (
        <TournamentCard
          key={tournament.name}
          name={tournament.name}
          date={tournament.date}
          time={tournament.time}
          location={tournament.location}
          image={tournament.image}
        />
      ))}
    </div>
  );
}

TournamentList.defaultProps = {
  tournaments: [],
};

export default TournamentList;
