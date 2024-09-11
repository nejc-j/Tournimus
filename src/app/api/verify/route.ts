import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getBaseUrl } from '../../../utils/getBaseUrl';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const baseUrl = getBaseUrl();

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
    return NextResponse.redirect(`${baseUrl}/api/auth/signin`);
  } catch (error) {
    console.error('Error in verification route:', error);

    let errorMessage = 'An unexpected error occurred';
    let errorStack = '';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack || '';
    }

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
