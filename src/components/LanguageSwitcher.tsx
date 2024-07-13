'use client';

import { useState, useTransition, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';

import { getUserLocale, setUserLocale } from '../services/locale';
import { Locale } from '../config';

function LanguageSwitcher() {
  const [, startTransition] = useTransition();
  const [selectedLocale, setSelectedLocale] = useState<Locale>('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchLocale = async () => {
      const locale = await getUserLocale();
      setSelectedLocale(locale as Locale);
    };

    fetchLocale();
  }, []);

  const handleLocaleChange = (value: string) => {
    const locale = value as Locale;

    startTransition(() => {
      setUserLocale(locale); // Assume this function can handle the async update
      setSelectedLocale(locale);
    });
  };

  const localeToFlagSrc = {
    sl: '/slo-flag.svg',
    en: '/english-flag.svg',
    de: '/german-flag.svg',
  };

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-2 border-none"
        >
          <Image
            src={localeToFlagSrc[selectedLocale]}
            alt={`${selectedLocale} flag`}
            width={20}
            height={20}
            quality={100}
            priority
          />
          <ChevronDown
            className={`icon-transition ${isOpen ? 'icon-open' : ''}`}
            size={20}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Jeziki</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => handleLocaleChange('sl')}>
          <Image
            src="/slo-flag.svg"
            alt="Slovenian flag"
            width={20}
            height={20}
            quality={100}
            priority
            className="mr-2"
          />
          Slovenščina
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleLocaleChange('en')}>
          <Image
            src="/english-flag.svg"
            alt="English flag"
            width={20}
            height={20}
            quality={100}
            priority
            className="mr-2"
          />
          English
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleLocaleChange('de')}>
          <Image
            src="/german-flag.svg"
            alt="German flag"
            width={20}
            height={20}
            quality={100}
            priority
            className="mr-2"
          />
          German
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
