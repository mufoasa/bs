import { sql } from '@/lib/db';
import { getCurrentBarber } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const barber = await getCurrentBarber();
    if (!barber?.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profileId, name, description, durationMinutes, price, isActive } = await request.json();

    if (profileId !== barber.profile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [newService] = await sql`
      INSERT INTO services (barber_profile_id, name, description, duration_minutes, price, is_active)
      VALUES (${profileId}, ${name}, ${description}, ${durationMinutes}, ${price}, ${isActive})
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: newService.id });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
