'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Barber, BarberProfile } from '@/lib/types';

interface DashboardContextType {
  barber: Barber;
  profile: BarberProfile;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({
  children,
  barber,
  profile,
}: {
  children: ReactNode;
  barber: Barber;
  profile: BarberProfile;
}) {
  return (
    <DashboardContext.Provider value={{ barber, profile }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
