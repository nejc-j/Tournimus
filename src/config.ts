export type Locale = (typeof locales)[number];

export const locales = ['sl', 'en', 'de'] as const;
export const defaultLocale: Locale = 'sl';
