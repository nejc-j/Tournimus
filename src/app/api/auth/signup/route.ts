/* import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const existingUser = await prisma.user.findUnique({ where: { username } });

  if (existingUser) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 },
    );
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  return NextResponse.json(user);
}
 */
