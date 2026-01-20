'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Scissors } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/browse', label: t.nav.browse },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
          <Scissors className="h-6 w-6 text-primary" />
          <span>BarberSpotlight</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          
          {isLoggedIn ? (
            <Button asChild variant="default" size="sm" className="hidden md:inline-flex">
              <Link href="/dashboard">{t.nav.dashboard}</Link>
            </Button>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">{t.nav.login}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">{t.nav.register}</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-2" />
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {t.nav.dashboard}
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {t.nav.login}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {t.nav.register}
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
