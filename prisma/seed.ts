// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: 'vinojko@gmail.com',
      password: 'slusalka', // In a real-world scenario, never store passwords in plain text
      name: 'Vinojko',
    },
  });

  // Realistic place data for tournaments
  const tournamentLocations = [
    {
      name: 'Central Park Open',
      locationName: 'Central Park',
      street: 'Central Park West',
      city: 'New York',
      zipCode: '10024',
    },
    {
      name: 'Golden Gate Tennis Championship',
      locationName: 'Golden Gate Park',
      street: '100 John F Kennedy Dr',
      city: 'San Francisco',
      zipCode: '94118',
    },
    {
      name: 'Hyde Park Tournament',
      locationName: 'Hyde Park',
      street: 'Serpentine Rd',
      city: 'London',
      zipCode: 'W2 2UH',
    },
    {
      name: 'Roland Garros Juniors',
      locationName: 'Stade Roland Garros',
      street: '2 Avenue Gordon Bennett',
      city: 'Paris',
      zipCode: '75016',
    },
    {
      name: 'Sydney Open',
      locationName: 'Sydney Olympic Park',
      street: 'Olympic Blvd',
      city: 'Sydney',
      zipCode: '2127',
    },
    {
      name: 'Tokyo Tennis Cup',
      locationName: 'Ariake Tennis Park',
      street: '2-2-22 Oumi',
      city: 'Tokyo',
      zipCode: '135-0064',
    },
  ];

  // Create 6 tournaments with realistic data
  for (const location of tournamentLocations) {
    await prisma.tournament.create({
      data: {
        name: location.name,
        numberOfCourts: 5,
        startTime: new Date(),
        matchDuration: 60,
        breakDuration: 15,
        locationName: location.locationName,
        street: location.street,
        city: location.city,
        zipCode: location.zipCode,
        organizer: { connect: { id: user.id } }, // Connect the tournament to the created user
      },
    });
  }

  console.log('Seed data created successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
