'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/context';
import { DashboardSidebar } from '../dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { BarberProfile, Currency, Locale } from '@/lib/types';

interface SettingsClientProps {
  profile: BarberProfile;
}

export function SettingsClient({ profile }: SettingsClientProps) {
  const { t } = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shopName, setShopName] = useState(profile.shop_name);
  const [description, setDescription] = useState(profile.description || '');
  const [address, setAddress] = useState(profile.address);
  const [city, setCity] = useState(profile.city);
  const [country, setCountry] = useState(profile.country);
  const [phone, setPhone] = useState(profile.phone || '');
  const [currency, setCurrency] = useState<Currency>(profile.currency);
  const [locale, setLocale] = useState<Locale>(profile.locale);
  const [timezone, setTimezone] = useState(profile.timezone);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopName,
          description: description || null,
          address,
          city,
          country,
          phone: phone || null,
          currency,
          locale,
          timezone,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      toast.success(t.dashboard.settings.saved);
      router.refresh();
    } catch {
      toast.error(t.common.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <DashboardSidebar />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">{t.dashboard.settings.title}</h1>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{t.dashboard.settings.shopInfo}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="shopName">{t.dashboard.settings.shopName}</Label>
                <Input
                  id="shopName"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">{t.dashboard.settings.description}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="address">{t.dashboard.settings.address}</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">{t.dashboard.settings.city}</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">{t.dashboard.settings.country}</Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">{t.dashboard.settings.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">{t.dashboard.settings.currency}</Label>
                  <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="CHF">Swiss Franc (CHF)</SelectItem>
                      <SelectItem value="MKD">Macedonian Denar (MKD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="locale">{t.dashboard.settings.locale}</Label>
                  <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sq">Shqip</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="timezone">{t.dashboard.settings.timezone}</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Berlin">Europe/Berlin (CET)</SelectItem>
                    <SelectItem value="Europe/Zurich">Europe/Zurich (CET)</SelectItem>
                    <SelectItem value="Europe/Tirane">Europe/Tirane (CET)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t.common.loading : t.common.save}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
