import React from 'react';
import Link from 'next/link';
import { Calendar, Clock4, MapPin } from 'lucide-react';
import { Tournament } from '@prisma/client';

interface TournamentCardProps extends Tournament {}

// Utility function to truncate each word longer than a specified length
const truncateWords = (text: string, maxLength: number) => {
  return text
    .split(' ')
    .map((word) =>
      word.length > maxLength ? `${word.slice(0, maxLength)}...` : word,
    )
    .join(' ');
};

function TournamentCard({
  id,
  name,
  startTime,
  locationName,
  city,
  street,
  zipCode,
}: TournamentCardProps) {
  const maxLength = 15; // You can adjust the maximum length as needed

  return (
    <Link href={`/tournament/${id}`}>
      <div className="flex h-full border rounded-lg shadow-lg p-3 bg-white w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md hover:shadow-xl transition-transform duration-200 cursor-pointer transform hover:scale-103">
        <div className="flex-grow">
          <h2 className="text-base sm:text-lg font-semibold mb-3 text-primary overflow-hidden text-ellipsis">
            {truncateWords(name, maxLength)}
          </h2>
          <div className="flex items-center text-primary mb-0.5">
            <Calendar className="text-tertiary mr-2" size="16" />
            <p className="text-xs sm:text-sm">
              {new Date(startTime).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center text-primary mb-3">
            <Clock4 className="text-tertiary mr-2" size="16" />
            <p className="text-xs sm:text-sm">
              {new Date(startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex items-start text-primary">
            <MapPin className="text-tertiary mr-2 flex-none" size="16" />
            <p className="font-semibold text-xs sm:text-sm">
              {truncateWords(locationName, maxLength)},{' '}
              {truncateWords(street, maxLength)},{' '}
              {truncateWords(city, maxLength)},{' '}
              {truncateWords(zipCode, maxLength)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

TournamentCard.defaultProps = {
  image: '',
};

export default TournamentCard;
