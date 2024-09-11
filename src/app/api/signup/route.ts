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
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
      body {
      font-family: Arial, sans-serif;
      background-color: #05132A; /* primary color */
      padding: 0;
      margin: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      text-align: center;
      margin-bottom: 20px;
    }
    .email-header h1 {
      font-size: 24px;
      margin: 0;
      color: #05132A; /* primary color */
    }
    .email-content {
      font-size: 16px;
      color: #333;
    }
    .email-content p {
      margin: 10px 0;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      color: #ffffff;
      background-color: #0094FF; /* tertiary color */
      text-decoration: none;
      border-radius: 4px;
    }
    .btn:hover {
      background-color: #0162D4; /* quinary color */
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #999;
    }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="email-content">
          <p>Hi there,</p>
          <p>Thank you for registering with our service. Please click the button below to verify your email address and activate your account.</p>
          <a href="${verificationLink}" class="btn">Verify Email</a>
          <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify your email',
      html: htmlContent,
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
