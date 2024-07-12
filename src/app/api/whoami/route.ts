import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const GET = auth(async ({ auth }) => {
  return NextResponse.json({ user: auth?.user?.name });
});
