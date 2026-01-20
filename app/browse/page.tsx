import { sql } from '@/lib/db';
import { BrowseClient } from './browse-client';
import type { BarberProfile, ShopImage } from '@/lib/types';

interface ShopWithImage extends BarberProfile {
  image_url: string | null;
}

async function getShops(): Promise<ShopWithImage[]> {
  const shops = await sql`
    SELECT 
      bp.*,
      (SELECT image_url FROM shop_images si WHERE si.barber_profile_id = bp.id ORDER BY display_order LIMIT 1) as image_url
    FROM barber_profiles bp
    WHERE bp.is_active = true
    ORDER BY bp.created_at DESC
  `;
  
  return shops as ShopWithImage[];
}

export default async function BrowsePage() {
  const shops = await getShops();
  
  return <BrowseClient shops={shops} />;
}
