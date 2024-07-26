'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { signIn, signOut } from '@/auth/helpers';

interface SignInOutButtonProps {
  isSignedIn: boolean;
}

export default function SignInOutButton({ isSignedIn }: SignInOutButtonProps) {
  if (isSignedIn) {
    return (
      <Button onClick={async () => signOut()} className="mt-8">
        Sign Out
      </Button>
    );
  }
  return <Button onClick={async () => signIn()}>Sign In</Button>;
}
