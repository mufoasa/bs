import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import { BookingClient } from './booking-client';
import type { BarberProfile, Staff, Service, StaffAvailability } from '@/lib/types';

interface StaffWithAvailability extends Staff {
  availability: StaffAvailability[];
}

interface ShopBookingData extends BarberProfile {
  staff: StaffWithAvailability[];
  services: Service[];
}

async function getShopBookingData(slug: string): Promise<ShopBookingData | null> {
  const profiles = await sql`
    SELECT * FROM barber_profiles WHERE slug = ${slug}
  `;
  
  if (profiles.length === 0) {
    return null;
  }
  
  const profile = profiles[0] as BarberProfile;
  
  const [staffRows, services] = await Promise.all([
    sql`SELECT * FROM staff WHERE barber_profile_id = ${profile.id} AND is_active = true`,
    sql`SELECT * FROM services WHERE barber_profile_id = ${profile.id} AND is_active = true ORDER BY name`,
  ]);
  
  const staff = await Promise.all(
    (staffRows as Staff[]).map(async (s) => {
      const availability = await sql`
        SELECT * FROM staff_availability WHERE staff_id = ${s.id}
      `;
      return { ...s, availability: availability as StaffAvailability[] };
    })
  );
  
  return {
    ...profile,
    staff,
    services: services as Service[],
  };
}

interface BookingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { slug } = await params;
  const shop = await getShopBookingData(slug);
  
  if (!shop) {
    notFound();
  }
  
  return <BookingClient shop={shop} />;
}
