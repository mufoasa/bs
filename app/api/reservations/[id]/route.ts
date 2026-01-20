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
    const { status } = await request.json();

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Verify the reservation belongs to this barber's profile
    const reservations = await sql`
      SELECT id FROM reservations 
      WHERE id = ${id} AND barber_profile_id = ${barber.profile.id}
    `;

    if (reservations.length === 0) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    await sql`
      UPDATE reservations 
      SET status = ${status}, updated_at = NOW() 
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}
