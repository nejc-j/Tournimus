'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from './ui/button';
import LanguageSwitcher from './LanguageSwitcher';

function Header() {
  return (
    <div className="w-full bg-primary bg-opacity-70 backdrop-blur-md top-0 left-0 right-0 z-50 drop-shadow-md fixed">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-[15px]">
        <Link href="/dashboard" className="logo flex items-center">
          <Image src="/logo.svg" alt="logo" width={160} height={100} />
        </Link>
        <Button className="ml-auto" variant="outline">
          Prijava / Registracija
        </Button>
        <LanguageSwitcher />
      </div>
    </div>
  );
}

export default Header;
