import { sql } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

function generateSlug(shopName: string): string {
  return shopName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function POST(request: Request) {
  try {
    const { email, password, shopName, city } = await request.json();

    if (!email || !password || !shopName || !city) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await sql`
      SELECT id FROM barbers WHERE email = ${email.toLowerCase()}
    `;

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    
    // Generate unique slug
    let slug = generateSlug(shopName);
    const existingSlugs = await sql`
      SELECT slug FROM barber_profiles WHERE slug LIKE ${slug + '%'}
    `;
    
    if (existingSlugs.length > 0) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Create barber account and get the generated ID
    const [newBarber] = await sql`
      INSERT INTO barbers (email, password_hash)
      VALUES (${email.toLowerCase()}, ${passwordHash})
      RETURNING id
    `;

    // Create barber profile
    await sql`
      INSERT INTO barber_profiles (
        barber_id, shop_name, slug, address, city, country, currency, locale, timezone
      ) VALUES (
        ${newBarber.id}, ${shopName}, ${slug}, '', ${city}, '', 'EUR', 'en', 'Europe/Berlin'
      )
    `;

    await createSession(newBarber.id.toString());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
