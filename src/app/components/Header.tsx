'use client';

import React from 'react';
import Image from 'next/image';

import Link from 'next/link';

function Header() {
  return (
    <div className="w-full bg-primary white bg-opacity-70 backdrop-blur-md  top-0 left-0 right-0 z-50  drop-shadow-md fixed  ">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-[15px] z-1000">
        <Link href="/dashboard" className="logo">
          <Image src="/logo.svg" alt="logo" width={160} height={100} />
        </Link>
      </div>
    </div>
  );
}

export default Header;
