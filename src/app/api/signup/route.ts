import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '../../../../lib/prisma'; // Ensure the correct path

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Log the received request body
    console.log('Received signup request:', { email, password });

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 },
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Save the new user to the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log('User created:', user);

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in signup route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
