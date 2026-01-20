import { sql } from '@/lib/db';
import { getCurrentBarber } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const barber = await getCurrentBarber();
    if (!barber?.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profileId, name, email, phone, isActive, availability } = await request.json();

    if (profileId !== barber.profile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [newStaff] = await sql`
      INSERT INTO staff (barber_profile_id, name, email, phone, is_active)
      VALUES (${profileId}, ${name}, ${email || null}, ${phone || null}, ${isActive})
      RETURNING id
    `;

    // Add availability
    for (const avail of availability) {
      await sql`
        INSERT INTO staff_availability (staff_id, day_of_week, start_time, end_time)
        VALUES (${newStaff.id}, ${avail.day}, ${avail.start}, ${avail.end})
      `;
    }

    return NextResponse.json({ success: true, id: newStaff.id });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}
