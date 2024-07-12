import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../../lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { message: 'Verification token is missing.' },
      { status: 400 },
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
    };
    const { email } = decoded;

    console.log('Decoded email from token:', email);

    await prisma.user.update({
      where: { email },
      data: { verified: true },
    });

    console.log('Email verified for:', email);

    // Construct the absolute URL for redirection
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/auth/signin?verified=1`;

    // Redirect to the sign-in page with a success message
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    const err = error as Error; // Type assertion
    console.error('Error verifying email:', err.message);
    // Log the exact error message for debugging
    return NextResponse.json(
      { message: 'Invalid or expired token.', error: err.message },
      { status: 400 },
    );
  }
}
