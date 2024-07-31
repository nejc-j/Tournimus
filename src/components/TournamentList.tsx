import React from 'react';
import { useTranslations } from 'next-intl';
import { Tournament } from '@prisma/client';
import TournamentCard from './TournamentCard';

interface TournamentListProps {
  tournaments?: Tournament[];
}

function TournamentList({ tournaments }: TournamentListProps) {
  const t = useTranslations('TournamentList');
  return (
    <div>
      {tournaments && tournaments.length === 0 ? (
        <p className="text-left text-gray-500"> {t('no_tournaments')}</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments?.map((tournament) => (
            <div key={tournament.id} className="flex justify-center">
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md">
                <TournamentCard
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
              </div>
            </div>
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
