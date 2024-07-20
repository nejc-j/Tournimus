// src/schemas.ts
import { z } from 'zod';

export const GeneralInfoSchema = z.object({
  tournamentName: z
    .string()
    .min(2, { message: 'Tournament name must be at least 2 characters.' }),
  presenter: z.string(),
});

export const LocationTimeSchema = z.object({
  locationName: z
    .string()
    .min(2, { message: 'Location name must be at least 2 characters.' }),
  street: z.string().min(1, { message: 'Street and number are required.' }),
  city: z.string().min(1, { message: 'City is required.' }),
  zipCode: z.string().min(1, { message: 'Zip code is required.' }),
  numberOfCourts: z.coerce
    .number()
    .min(1, { message: 'There must be at least one court.' }),
  startTime: z.date(),
  matchDuration: z.coerce
    .number()
    .min(1, { message: 'Match duration must be at least 1 minute.' }),
  breakDuration: z.coerce
    .number()
    .min(1, { message: 'Break duration must be at least 1 minute.' }),
});

export const ParticipantsSchema = z.object({
  participants: z.array(
    z.object({
      id: z.number(),
      name: z.string().min(1, { message: 'Participant name is required.' }),
    }),
  ),
});
