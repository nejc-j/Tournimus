'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button'; // Adjust the import path based on your project structure
import { signOut } from '@/auth/helpers';

export default function AuthButton() {
  const t = useTranslations('AuthButton');
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  return session?.user ? (
    <>
      <Button
        onClick={() => router.push('/dashboard')}
        variant="outline" // Use the variant prop to apply the appropriate styles
        size="icon" // Use the size prop to apply the appropriate size
      >
        <User className="text-current" />
      </Button>
      <Button
        onClick={handleSignOut}
        variant="borderDestructive" // Use the variant prop to apply the appropriate styles
        size="default" // Use the size prop to apply the appropriate size
      >
        {t('sign_out')}
      </Button>
    </>
  ) : (
    <Button
      onClick={() => router.push('/login')} // Direct to the custom login page
      variant="outline" // Use the variant prop to apply the appropriate styles
      size="default" // Use the size prop to apply the appropriate size
    >
      {t('sign_in')}
    </Button>
  );
}
