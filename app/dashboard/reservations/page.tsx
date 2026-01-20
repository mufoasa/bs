import { sql } from '@/lib/db';
import { getCurrentBarber } from '@/lib/auth';
import { ReservationsClient } from './reservations-client';
import type { Reservation, Service, Staff } from '@/lib/types';

interface ReservationWithDetails extends Reservation {
  service_name: string;
  staff_name: string;
}

async function getReservations(profileId: string): Promise<ReservationWithDetails[]> {
  const reservations = await sql`
    SELECT 
      r.*,
      s.name as service_name,
      st.name as staff_name
    FROM reservations r
    JOIN services s ON r.service_id = s.id
    JOIN staff st ON r.staff_id = st.id
    WHERE r.barber_profile_id = ${profileId}
    ORDER BY r.reservation_date DESC, r.start_time DESC
  `;
  
  return reservations as ReservationWithDetails[];
}

export default async function ReservationsPage() {
  const barber = await getCurrentBarber();
  if (!barber?.profile) return null;

  const reservations = await getReservations(barber.profile.id);

  return <ReservationsClient reservations={reservations} currency={barber.profile.currency} />;
}
