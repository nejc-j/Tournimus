import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { message: 'Verification token is missing' },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid verification token' },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
      },
    });

    // Correct the redirect URL if necessary
    return NextResponse.redirect('http://localhost:3000/api/auth/signin');
  } catch (error) {
    console.error('Error in verification route:', error);

    // Capture the error message and stack trace
    const errorMessage = error.message || 'An unexpected error occurred';
    const errorStack = error.stack || '';

    return NextResponse.json(
      {
        message: 'Internal server error',
        error: errorMessage,
        stack: errorStack,
      },
      { status: 500 },
    );
  }
}
