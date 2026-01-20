export type Locale = 'en' | 'sq' | 'de';

export type Currency = 'EUR' | 'CHF';

export interface Barber {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface BarberProfile {
  id: string;
  barber_id: string;
  shop_name: string;
  slug: string;
  description: string | null;
  address: string;
  city: string;
  country: string;
  phone: string | null;
  currency: Currency;
  locale: Locale;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface ShopImage {
  id: string;
  profile_id: string;
  url: string;
  alt: string | null;
  order_index: number;
  created_at: string;
}

export interface Staff {
  id: string;
  barber_profile_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  profile_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface StaffAvailability {
  id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface BlockedSlot {
  id: string;
  staff_id: string;
  start_datetime: string;
  end_datetime: string;
  reason: string | null;
}

export interface Reservation {
  id: string;
  barber_profile_id: string;
  staff_id: string;
  service_id: string;
  customer_name: string;
  customer_phone: string;
  customer_note: string | null;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ShopWithProfile extends BarberProfile {
  images: ShopImage[];
  staff: Staff[];
  services: Service[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailableSlot {
  staffId: string;
  staffName: string;
  slots: TimeSlot[];
}
