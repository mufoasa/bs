import { sql } from '@/lib/db';
import { getCurrentBarber } from '@/lib/auth';
import { DashboardOverviewClient } from './overview-client';

interface DashboardStats {
  todayBookings: number;
  totalServices: number;
  activeStaff: number;
  pendingBookings: number;
}

async function getDashboardStats(profileId: string): Promise<DashboardStats> {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format

  const [todayBookingsResult, servicesResult, staffResult, pendingResult] = await Promise.all([
    sql`
      SELECT COUNT(*) as count FROM reservations 
      WHERE barber_profile_id = ${profileId} 
      AND reservation_date = ${todayStr}
    `,
    sql`SELECT COUNT(*) as count FROM services WHERE barber_profile_id = ${profileId} AND is_active = true`,
    sql`SELECT COUNT(*) as count FROM staff WHERE barber_profile_id = ${profileId} AND is_active = true`,
    sql`SELECT COUNT(*) as count FROM reservations WHERE barber_profile_id = ${profileId} AND status = 'pending'`,
  ]);

  return {
    todayBookings: Number(todayBookingsResult[0]?.count || 0),
    totalServices: Number(servicesResult[0]?.count || 0),
    activeStaff: Number(staffResult[0]?.count || 0),
    pendingBookings: Number(pendingResult[0]?.count || 0),
  };
}

export default async function DashboardPage() {
  const barber = await getCurrentBarber();
  if (!barber?.profile) return null;

  const stats = await getDashboardStats(barber.profile.id);

  return <DashboardOverviewClient stats={stats} />;
}
