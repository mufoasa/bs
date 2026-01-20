'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/context';
import { DashboardSidebar } from '../dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Calendar, Phone, User, Clock, Scissors } from 'lucide-react';
import type { Reservation, Currency } from '@/lib/types';

interface ReservationWithDetails extends Reservation {
  service_name: string;
  staff_name: string;
}

interface ReservationsClientProps {
  reservations: ReservationWithDetails[];
  currency: Currency;
}

export function ReservationsClient({ reservations, currency }: ReservationsClientProps) {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Filter reservations based on date
  const upcomingReservations = reservations.filter(
    r => new Date(r.reservation_date) >= today && r.status !== 'cancelled'
  );
  const pastReservations = reservations.filter(
    r => new Date(r.reservation_date) < today || r.status === 'cancelled'
  );

  async function updateStatus(id: string, status: 'confirmed' | 'cancelled' | 'completed') {
    setIsUpdating(id);
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update');
      
      toast.success('Reservation updated');
      router.refresh();
    } catch {
      toast.error('Failed to update reservation');
    } finally {
      setIsUpdating(null);
    }
  }

  function formatDate(date: string | Date) {
    let d: Date;

    if (typeof date === 'string') {
      const [year, month, day] = date.split('-').map(Number);
      d = new Date(year, month - 1, day);
    } else {
      d = date;
    }

    return d.toLocaleDateString(
      locale === 'de' ? 'de-DE' : locale === 'sq' ? 'sq-AL' : 'en-US',
      { weekday: 'short', month: 'short', day: 'numeric' }
    );
  }

  function formatTime(timeStr: string) {
    // timeStr is in HH:MM:SS format
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0);
    return d.toLocaleTimeString(
      locale === 'de' ? 'de-DE' : locale === 'sq' ? 'sq-AL' : 'en-US',
      { hour: '2-digit', minute: '2-digit' }
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  function ReservationCard({ reservation }: { reservation: ReservationWithDetails }) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            {/* Header with status */}
            <div className="flex items-center justify-between">
              <Badge className={statusColors[reservation.status]}>
                {reservation.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(reservation.reservation_date)}
              </span>
            </div>

            {/* Customer info */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{reservation.customer_name}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{reservation.customer_phone}</span>
            </div>

            {/* Service & Staff */}
            <div className="flex items-center gap-2">
              <Scissors className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{reservation.service_name} with {reservation.staff_name}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
              </span>
            </div>

            {/* Notes */}
            {reservation.customer_note && (
              <p className="text-sm text-muted-foreground italic">
                "{reservation.customer_note}"
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-2">
              {reservation.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => updateStatus(reservation.id, 'confirmed')}
                    disabled={isUpdating === reservation.id}
                  >
                    {t.dashboard.reservations.confirm}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateStatus(reservation.id, 'cancelled')}
                    disabled={isUpdating === reservation.id}
                  >
                    {t.dashboard.reservations.cancel}
                  </Button>
                </>
              )}
              {reservation.status === 'confirmed' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => updateStatus(reservation.id, 'completed')}
                    disabled={isUpdating === reservation.id}
                  >
                    {t.dashboard.reservations.complete}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateStatus(reservation.id, 'cancelled')}
                    disabled={isUpdating === reservation.id}
                  >
                    {t.dashboard.reservations.cancel}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  function ReservationList({ items }: { items: ReservationWithDetails[] }) {
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t.dashboard.reservations.noReservations}</p>
        </div>
      );
    }

    return (
      <div className="p-4">
        {items.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <DashboardSidebar />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{t.dashboard.reservations.title}</h1>
        </div>

        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="upcoming">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger 
                  value="upcoming" 
                  className="flex-1 md:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  {t.dashboard.reservations.upcoming} ({upcomingReservations.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="past"
                  className="flex-1 md:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  {t.dashboard.reservations.past} ({pastReservations.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="m-0">
                <ReservationList items={upcomingReservations} />
              </TabsContent>
              <TabsContent value="past" className="m-0">
                <ReservationList items={pastReservations} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
