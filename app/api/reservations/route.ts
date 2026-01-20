import { sql } from '@/lib/db';
import { getCurrentBarber } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const barber = await getCurrentBarber();
    if (!barber?.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      staffId,
      serviceId,
      customerName,
      customerPhone,
      customerNote,
      startDatetime,
      endDatetime,
    } = body;

    if (!staffId || !serviceId || !customerName || !customerPhone || !startDatetime || !endDatetime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const startDate = new Date(startDatetime);
    const endDate = new Date(endDatetime);

    const reservationDate = [
      startDate.getFullYear(),
      String(startDate.getMonth() + 1).padStart(2, '0'),
      String(startDate.getDate()).padStart(2, '0'),
    ].join('-');

    const startTime = startDate.toTimeString().split(' ')[0];
    const endTime = endDate.toTimeString().split(' ')[0];

    const [newReservation] = await sql`
      INSERT INTO reservations (
        barber_profile_id,
        staff_id,
        service_id,
        customer_name,
        customer_phone,
        customer_note,
        reservation_date,
        start_time,
        end_time,
        status
      ) VALUES (
        ${barber.profile.id},
        ${staffId},
        ${serviceId},
        ${customerName},
        ${customerPhone},
        ${customerNote || null},
        ${reservationDate},
        ${startTime},
        ${endTime},
        'pending'
      )
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: newReservation.id });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
