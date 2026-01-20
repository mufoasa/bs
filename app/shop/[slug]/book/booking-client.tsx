'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useLocale } from '@/lib/i18n/context';
import { formatPrice } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Check, Clock, User, CalendarIcon } from 'lucide-react';
import type { BarberProfile, Staff, Service, StaffAvailability } from '@/lib/types';

interface StaffWithAvailability extends Staff {
  availability: StaffAvailability[];
}

interface ShopBookingData extends BarberProfile {
  staff: StaffWithAvailability[];
  services: Service[];
}

interface BookingClientProps {
  shop: ShopBookingData;
}

type BookingStep = 'service' | 'staff' | 'datetime' | 'details' | 'confirmation';

export function BookingClient({ shop }: BookingClientProps) {
  const { t, locale } = useLocale();
  const [step, setStep] = useState<BookingStep>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffWithAvailability | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const availableTimeSlots = generateTimeSlots(selectedStaff, selectedDate, selectedService);

  function generateTimeSlots(
    staff: StaffWithAvailability | null,
    date: Date | undefined,
    service: Service | null
  ): string[] {
    if (!staff || !date || !service) return [];
    
    const dayOfWeek = date.getDay();
    const availability = staff.availability.find(a => a.day_of_week === dayOfWeek);
    
    if (!availability) return [];
    
    const slots: string[] = [];
    const [startHour, startMin] = availability.start_time.split(':').map(Number);
    const [endHour, endMin] = availability.end_time.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      slots.push(timeStr);
      
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour += 1;
      }
    }
    
    return slots;
  }

  async function handleSubmit() {
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime) {
      return;
    }

    setIsSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const startDatetime = new Date(selectedDate);
      startDatetime.setHours(hours, minutes, 0, 0);
      
      const endDatetime = new Date(startDatetime);
      endDatetime.setMinutes(endDatetime.getMinutes() + selectedService.duration_minutes);

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: shop.id,
          staffId: selectedStaff.id,
          serviceId: selectedService.id,
          customerName,
          customerPhone,
          customerNote: customerNote || null,
          startDatetime: startDatetime.toISOString(),
          endDatetime: endDatetime.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      setBookingConfirmed(true);
      setStep('confirmation');
      toast.success(t.booking.success.title);
    } catch {
      toast.error(t.common.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (bookingConfirmed) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-xl">
            <Card>
              <CardContent className="pt-8 pb-6 text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2">{t.booking.success.title}</h1>
                <p className="text-muted-foreground mb-6">{t.booking.success.message}</p>
                
                <div className="bg-muted rounded-lg p-4 text-left mb-6">
                  <h3 className="font-semibold mb-3">{t.booking.success.details}</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>{t.booking.selectService}:</strong> {selectedService?.name}</p>
                    <p><strong>{t.dashboard.reservations.staff}:</strong> {selectedStaff?.name}</p>
                    <p><strong>{t.booking.selectDate}:</strong> {selectedDate?.toLocaleDateString()}</p>
                    <p><strong>{t.booking.selectTime}:</strong> {selectedTime}</p>
                  </div>
                </div>
                
                <Button asChild>
                  <Link href={`/shop/${shop.slug}`}>{t.common.back}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-6">
            <Link href={`/shop/${shop.slug}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              {t.common.back}
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-2">{t.booking.title}</h1>
          <p className="text-muted-foreground mb-8">{shop.shop_name}</p>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {(['service', 'staff', 'datetime', 'details'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s ? 'bg-primary text-primary-foreground' : 
                    (['service', 'staff', 'datetime', 'details'].indexOf(step) > i) ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </div>
                {i < 3 && <div className="w-8 h-0.5 bg-muted" />}
              </div>
            ))}
          </div>

          {/* Step 1: Service Selection */}
          {step === 'service' && (
            <Card>
              <CardHeader>
                <CardTitle>{t.booking.selectService}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedService?.id}
                  onValueChange={(value) => {
                    const service = shop.services.find(s => s.id === value);
                    setSelectedService(service || null);
                  }}
                >
                  <div className="grid gap-3">
                    {shop.services.map((service) => (
                      <Label
                        key={service.id}
                        htmlFor={service.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                          selectedService?.id === service.id ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={service.id} id={service.id} />
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{service.duration_minutes} {t.shop.duration}</span>
                            </div>
                          </div>
                        </div>
                        <span className="font-bold">
                          {formatPrice(service.price, shop.currency, locale)}
                        </span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setStep('staff')} disabled={!selectedService}>
                    {t.common.next}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Staff Selection */}
          {step === 'staff' && (
            <Card>
              <CardHeader>
                <CardTitle>{t.booking.selectStaff}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedStaff?.id}
                  onValueChange={(value) => {
                    const staff = shop.staff.find(s => s.id === value);
                    setSelectedStaff(staff || null);
                  }}
                >
                  <div className="grid gap-3">
                    {shop.staff.map((member) => (
                      <Label
                        key={member.id}
                        htmlFor={`staff-${member.id}`}
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                          selectedStaff?.id === member.id ? 'border-primary bg-primary/5' : ''
                        }`}
                      >
                        <RadioGroupItem value={member.id} id={`staff-${member.id}`} />
                        <Avatar>
                          <AvatarImage src={member.avatar_url || undefined} />
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          {member.role && (
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          )}
                        </div>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep('service')}>
                    {t.common.back}
                  </Button>
                  <Button onClick={() => setStep('datetime')} disabled={!selectedStaff}>
                    {t.common.next}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Date & Time Selection */}
          {step === 'datetime' && (
            <Card>
              <CardHeader>
                <CardTitle>{t.booking.selectDate} & {t.booking.selectTime}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Label className="mb-3 block">{t.booking.selectDate}</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <Label className="mb-3 block">{t.booking.selectTime}</Label>
                    {selectedDate ? (
                      availableTimeSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {availableTimeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">{t.booking.noSlots}</p>
                      )
                    ) : (
                      <p className="text-muted-foreground">Select a date first</p>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep('staff')}>
                    {t.common.back}
                  </Button>
                  <Button onClick={() => setStep('details')} disabled={!selectedDate || !selectedTime}>
                    {t.common.next}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Customer Details */}
          {step === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle>{t.booking.yourDetails}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t.booking.name}</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t.booking.phone}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">{t.booking.notes}</Label>
                    <Textarea
                      id="notes"
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="mt-6 bg-muted rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.booking.selectService}</span>
                      <span>{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.dashboard.reservations.staff}</span>
                      <span>{selectedStaff?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.booking.selectDate}</span>
                      <span>{selectedDate?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.booking.selectTime}</span>
                      <span>{selectedTime}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(selectedService?.price || 0, shop.currency, locale)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep('datetime')}>
                    {t.common.back}
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!customerName || !customerPhone || isSubmitting}
                  >
                    {isSubmitting ? t.common.loading : t.booking.confirm}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
