import React from "react"
import { redirect } from 'next/navigation';
import { getCurrentBarber } from '@/lib/auth';
import { DashboardProvider } from './dashboard-context';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const barber = await getCurrentBarber();
  
  if (!barber) {
    redirect('/login');
  }

  if (!barber.profile) {
    redirect('/login');
  }

  return (
    <DashboardProvider barber={barber} profile={barber.profile}>
      {children}
    </DashboardProvider>
  );
}
