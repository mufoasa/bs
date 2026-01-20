import { sql } from '@/lib/db';
import { getCurrentBarber } from '@/lib/auth';
import { StaffClient } from './staff-client';
import type { Staff, StaffAvailability } from '@/lib/types';

interface StaffWithAvailability extends Staff {
  availability: StaffAvailability[];
}

async function getStaff(profileId: string): Promise<StaffWithAvailability[]> {
  const staffRows = await sql`
    SELECT * FROM staff WHERE barber_profile_id = ${profileId} ORDER BY name
  `;
  
  const staff = await Promise.all(
    (staffRows as Staff[]).map(async (s) => {
      const availability = await sql`
        SELECT * FROM staff_availability WHERE staff_id = ${s.id} ORDER BY day_of_week
      `;
      return { ...s, availability: availability as StaffAvailability[] };
    })
  );
  
  return staff;
}

export default async function StaffPage() {
  const barber = await getCurrentBarber();
  if (!barber?.profile) return null;

  const staff = await getStaff(barber.profile.id);

  return <StaffClient staff={staff} profileId={barber.profile.id} />;
}
