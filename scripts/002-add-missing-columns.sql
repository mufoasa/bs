-- Add missing columns to barber_profiles table
ALTER TABLE barber_profiles 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS locale VARCHAR(10) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'Europe/Berlin';

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_barber_profiles_slug ON barber_profiles(slug);
