import { getCurrentBarber } from '@/lib/auth';
import { SettingsClient } from './settings-client';

export default async function SettingsPage() {
  const barber = await getCurrentBarber();
  if (!barber?.profile) return null;

  return <SettingsClient profile={barber.profile} />;
}
