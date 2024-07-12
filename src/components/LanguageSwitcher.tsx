'use client';

import { useTransition } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { setUserLocale } from '../services/locale';
import { Locale } from '../config';

function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (value: string) => {
    const locale = value as Locale;

    startTransition(() => {
      setUserLocale(locale); // Assume this function can handle the async update
      // Optionally, improve user feedback by not reloading and using Next.js router
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Jeziki</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => handleLocaleChange('sl')}>
          Slovenščina
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleLocaleChange('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleLocaleChange('de')}>
          German
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
