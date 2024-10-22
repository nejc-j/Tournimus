import React from 'react';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Poppins } from 'next/font/google';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Tournimus',
  description: 'A tournament organization platform.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={poppins.className}>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <NextTopLoader color="#FFB800" />
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
