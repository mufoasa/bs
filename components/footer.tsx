'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/context';
import { Scissors } from 'lucide-react';

export function Footer() {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-primary" />
            <span className="font-semibold">BarberSpotlight</span>
          </div>
          <p className="text-sm text-muted-foreground">{t.footer.tagline}</p>
          <nav className="flex gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              {t.nav.home}
            </Link>
            <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground">
              {t.nav.browse}
            </Link>
          </nav>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          &copy; {currentYear} BarberSpotlight. {t.footer.rights}.
        </div>
      </div>
    </footer>
  );
}
