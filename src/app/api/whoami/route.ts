import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const GET = auth(async ({ auth: authUser }) => {
  return NextResponse.json({ user: authUser?.user?.name });
});
