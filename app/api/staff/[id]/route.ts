import { sql } from '@/lib/db';
import { getCurrentBarber } from '@/lib/auth';
import { NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const barber = await getCurrentBarber();
    if (!barber?.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, email, phone, isActive, availability } = await request.json();

    // Verify staff belongs to this profile
    const staffRows = await sql`
      SELECT id FROM staff WHERE id = ${id} AND barber_profile_id = ${barber.profile.id}
    `;

    if (staffRows.length === 0) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    await sql`
      UPDATE staff 
      SET name = ${name}, email = ${email}, phone = ${phone}, is_active = ${isActive}
      WHERE id = ${id}
    `;

    // Update availability - delete existing and re-add
    await sql`DELETE FROM staff_availability WHERE staff_id = ${id}`;
    
    for (const avail of availability) {
      await sql`
        INSERT INTO staff_availability (staff_id, day_of_week, start_time, end_time)
        VALUES (${id}, ${avail.day}, ${avail.start}, ${avail.end})
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const barber = await getCurrentBarber();
    if (!barber?.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify staff belongs to this profile
    const staffRows = await sql`
      SELECT id FROM staff WHERE id = ${id} AND barber_profile_id = ${barber.profile.id}
    `;

    if (staffRows.length === 0) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Delete availability first
    await sql`DELETE FROM staff_availability WHERE staff_id = ${id}`;
    await sql`DELETE FROM staff WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
}
