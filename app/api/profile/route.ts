import { sql } from '@/lib/db';
import { getCurrentBarber } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  try {
    const barber = await getCurrentBarber();
    if (!barber?.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { shopName, description, address, city, country, phone, currency, locale, timezone } = await request.json();

    await sql`
      UPDATE barber_profiles 
      SET 
        shop_name = ${shopName},
        description = ${description},
        address = ${address},
        city = ${city},
        country = ${country},
        phone = ${phone},
        currency = ${currency},
        locale = ${locale},
        timezone = ${timezone},
        updated_at = NOW()
      WHERE id = ${barber.profile.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
