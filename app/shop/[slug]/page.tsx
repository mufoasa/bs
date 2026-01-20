import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ShopClient } from './shop-client';
import type { BarberProfile, ShopImage, Staff, Service } from '@/lib/types';

interface ShopWithDetails extends BarberProfile {
  images: ShopImage[];
  staff: Staff[];
  services: Service[];
}

async function getShop(slug: string): Promise<ShopWithDetails | null> {
  const profiles = await sql`
    SELECT * FROM barber_profiles WHERE slug = ${slug}
  `;
  
  if (profiles.length === 0) {
    return null;
  }
  
  const profile = profiles[0] as BarberProfile;
  
  const [images, staff, services] = await Promise.all([
    sql`SELECT * FROM shop_images WHERE barber_profile_id = ${profile.id} ORDER BY display_order`,
    sql`SELECT * FROM staff WHERE barber_profile_id = ${profile.id} AND is_active = true`,
    sql`SELECT * FROM services WHERE barber_profile_id = ${profile.id} AND is_active = true ORDER BY name`,
  ]);
  
  return {
    ...profile,
    images: images as ShopImage[],
    staff: staff as Staff[],
    services: services as Service[],
  };
}

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params;
  const shop = await getShop(slug);
  
  if (!shop) {
    notFound();
  }
  
  return <ShopClient shop={shop} />;
}
