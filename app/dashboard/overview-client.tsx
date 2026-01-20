'use client';

import { useLocale } from '@/lib/i18n/context';
import { useDashboard } from './dashboard-context';
import { DashboardSidebar } from './dashboard-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Briefcase, Users, Clock } from 'lucide-react';

interface DashboardStats {
  todayBookings: number;
  totalServices: number;
  activeStaff: number;
  pendingBookings: number;
}

export function DashboardOverviewClient({ stats }: { stats: DashboardStats }) {
  const { t } = useLocale();
  const { profile } = useDashboard();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <DashboardSidebar />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">{t.dashboard.overview.title}</h1>
          <p className="text-muted-foreground">
            {t.dashboard.welcome}, {profile.shop_name}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t.dashboard.overview.todayBookings}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t.dashboard.overview.totalServices}
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t.dashboard.overview.activeStaff}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeStaff}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t.dashboard.overview.pendingBookings}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
