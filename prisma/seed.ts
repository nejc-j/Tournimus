import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  });

  // Create a location
  const location = await prisma.location.create({
    data: {
      name: 'Stadium A',
      address: '123 Main St, Anytown',
    },
  });

  // Create a tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: 'Summer Cup',
      representative: 'Alice Smith',
      logo: 'https://example.com/logo.png',
      numberOfParticipants: 16,
      mode: 'Knockout',
      location: {
        connect: { id: location.id },
      },
      eventTime: new Date('2024-08-01T10:00:00Z'),
      numberOfCourts: 4,
      startTime: new Date('2024-08-01T10:00:00Z'),
      matchDuration: 30, // in minutes
      breakDuration: 10, // in minutes
      scoringMethod: 'Points',
      organizer: {
        connect: { id: user.id },
      },
    },
  });

  console.log({ user, location, tournament });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
