'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { signIn, signOut } from '@/auth/helpers';

interface SignInOutButtonProps {
  isSignedIn: boolean;
}

export default function SignInOutButton({ isSignedIn }: SignInOutButtonProps) {
  const t = useTranslations('SignInOutButton');
  if (isSignedIn) {
    return (
      <Button onClick={async () => signOut()} className="mt-8">
        {t('sign_out')}
      </Button>
    );
  }
  return <Button onClick={async () => signIn()}>{t('sign_in')}</Button>;
}
