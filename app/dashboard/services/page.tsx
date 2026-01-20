import { sql } from '@/lib/db';
import { getCurrentBarber } from '@/lib/auth';
import { ServicesClient } from './services-client';
import type { Service } from '@/lib/types';

async function getServices(profileId: string): Promise<Service[]> {
  const services = await sql`
    SELECT * FROM services WHERE barber_profile_id = ${profileId} ORDER BY name
  `;
  return services as Service[];
}

export default async function ServicesPage() {
  const barber = await getCurrentBarber();
  if (!barber?.profile) return null;

  const services = await getServices(barber.profile.id);

  return <ServicesClient services={services} currency={barber.profile.currency} profileId={barber.profile.id} />;
}
