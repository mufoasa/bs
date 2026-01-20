'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/context';
import { useDashboard } from './dashboard-context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';
import {
  Scissors,
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Menu,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'overview' as const },
  { href: '/dashboard/reservations', icon: Calendar, labelKey: 'reservations' as const },
  { href: '/dashboard/services', icon: Briefcase, labelKey: 'services' as const },
  { href: '/dashboard/staff', icon: Users, labelKey: 'staff' as const },
  { href: '/dashboard/settings', icon: Settings, labelKey: 'settings' as const },
];

export function DashboardSidebar() {
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useDashboard();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('Logout failed');
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Scissors className="h-5 w-5 text-primary" />
          <span>BarberSpotlight</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {t.dashboard.nav[item.labelKey]}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t space-y-2">
        <Link
          href={`/shop/${profile.slug}`}
          target="_blank"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          View Public Page
        </Link>
        <div className="flex items-center justify-between">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t.nav.logout}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 border-b bg-background p-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Scissors className="h-5 w-5 text-primary" />
          <span>BarberSpotlight</span>
        </Link>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <SidebarContent />
      </aside>
    </>
  );
}
