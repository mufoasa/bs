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
    const { name, description, durationMinutes, price, isActive } = await request.json();

    // Verify service belongs to this profile
    const services = await sql`
      SELECT id FROM services WHERE id = ${id} AND barber_profile_id = ${barber.profile.id}
    `;

    if (services.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    await sql`
      UPDATE services 
      SET name = ${name}, description = ${description}, duration_minutes = ${durationMinutes}, 
          price = ${price}, is_active = ${isActive}
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const barber = await getCurrentBarber();
    if (!barber?.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify service belongs to this profile
    const services = await sql`
      SELECT id FROM services WHERE id = ${id} AND barber_profile_id = ${barber.profile.id}
    `;

    if (services.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    await sql`DELETE FROM services WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
