import Image from 'next/image';

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
      </div>
    </main>
  );
}
