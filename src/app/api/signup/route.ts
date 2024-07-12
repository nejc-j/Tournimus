import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';
import { sendVerificationEmail } from '../../../../lib/email';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('Received signup request:', { email, password });

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verified: false,
      },
    });

    const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    console.log('Generated token:', token);

    await sendVerificationEmail(email, token);

    console.log('User created and verification email sent:', user);

    return NextResponse.json({
      message: 'Verification email sent. Please check your inbox.',
    });
  } catch (error) {
    console.error('Error in signup route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
