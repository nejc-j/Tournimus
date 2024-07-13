import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import { prisma } from '../../../../lib/prisma';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (process.env.NODE_ENV !== 'production') {
      console.log('Received signup request:', { email, password });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('User already exists:', email);
      }
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 10);
    const verificationToken = randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
      },
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('User created:', user);
    }

    const verificationLink = `${process.env.NEXTAUTH_URL}/api/verify?token=${verificationToken}`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });

    return NextResponse.json({
      message: 'User created. Please verify your email.',
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error in signup route:', error);
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
