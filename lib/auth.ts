import { cookies } from 'next/headers';
import { sql } from '@/lib/db';
import type { Barber, BarberProfile } from '@/lib/types';

const SESSION_COOKIE = 'barber_session';

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export async function createSession(barberId: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE, `${sessionId}:${barberId}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  
  return sessionId;
}

export async function getSession(): Promise<{ barberId: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  
  if (!sessionCookie?.value) {
    return null;
  }
  
  const [, barberId] = sessionCookie.value.split(':');
  if (!barberId) {
    return null;
  }
  
  return { barberId };
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentBarber(): Promise<(Barber & { profile: BarberProfile | null }) | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }
  
  const barbers = await sql`
    SELECT b.*, bp.id as profile_id, bp.shop_name, bp.slug, bp.description, 
           bp.address, bp.city, bp.country, bp.phone, bp.currency, bp.locale, bp.timezone
    FROM barbers b
    LEFT JOIN barber_profiles bp ON b.id = bp.barber_id
    WHERE b.id = ${session.barberId}
  `;
  
  if (barbers.length === 0) {
    return null;
  }
  
  const barber = barbers[0];
  return {
    id: barber.id,
    email: barber.email,
    password_hash: barber.password_hash,
    created_at: barber.created_at,
    profile: barber.profile_id ? {
      id: barber.profile_id,
      barber_id: barber.id,
      shop_name: barber.shop_name,
      slug: barber.slug,
      description: barber.description,
      address: barber.address,
      city: barber.city,
      country: barber.country,
      phone: barber.phone,
      currency: barber.currency,
      locale: barber.locale,
      timezone: barber.timezone,
      created_at: barber.created_at,
      updated_at: barber.updated_at,
    } : null,
  };
}
