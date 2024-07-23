import React from 'react';
import { Tournament } from '@prisma/client';
import TournamentCard from './TournamentCard';

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
              startTime={tournament.startTime}
              locationName={tournament.locationName}
              street={tournament.street}
              city={tournament.city}
              zipCode={tournament.zipCode}
              numberOfCourts={tournament.numberOfCourts}
              matchDuration={tournament.matchDuration}
              breakDuration={tournament.breakDuration}
              organizerId={tournament.organizerId}
              createdAt={tournament.createdAt}
              updatedAt={tournament.updatedAt}
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
