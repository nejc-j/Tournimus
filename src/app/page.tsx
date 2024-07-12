import React from 'react';
import Image from 'next/image';
import { Button } from '../components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 m-0">
      {/* Background image container */}
      <div className="relative w-full h-[300px] md:h-[500px] top-0 left-0">
        <Image
          src="/background-stadium.png" // Replace with your image path
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
          <div className="max-w-6xl mx-auto text-center p-4 flex flex-col gap-10">
            <h1 className="text-white text-3xl md:text-5xl font-semibold">
              Enostavno upravljanje in spremljanje turnirjev
            </h1>
            <p>
              Dobrodošli v TOURNIMUS! Organizirajte svoje turnirje enostavno in
              hitro. Gledalci, preverite urnike, lokacije in vse podrobnosti o
              prihajajočih tekmah.
            </p>
          </div>
          <Button>Ustvari nov turnir</Button>
        </div>
      </div>
      {/* Page content container with max-width */}
      <div className="max-w-6xl mx-auto flex-grow p-4">
        {/* Your page content goes here */}
      </div>
    </main>
  );
}
