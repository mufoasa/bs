import type { Currency, Locale } from '@/lib/types';

export function formatPrice(amount: number, currency: Currency, locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    sq: 'sq-AL',
    de: 'de-CH',
  };

  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export const currencies: { value: Currency; label: string }[] = [
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'CHF', label: 'Swiss Franc (CHF)' },
   { value: 'MKD', label: 'Macedonian Denar (MKD)' },
];
