'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/context';
import { DashboardSidebar } from '../dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, User, Users } from 'lucide-react';
import type { Staff, StaffAvailability } from '@/lib/types';

interface StaffWithAvailability extends Staff {
  availability: StaffAvailability[];
}

interface StaffClientProps {
  staff: StaffWithAvailability[];
  profileId: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function StaffClient({ staff, profileId }: StaffClientProps) {
  const { t } = useLocale();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffWithAvailability | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [availability, setAvailability] = useState<{ day: number; start: string; end: string }[]>([
    { day: 1, start: '09:00', end: '17:00' },
    { day: 2, start: '09:00', end: '17:00' },
    { day: 3, start: '09:00', end: '17:00' },
    { day: 4, start: '09:00', end: '17:00' },
    { day: 5, start: '09:00', end: '17:00' },
  ]);

  function resetForm() {
    setName('');
    setEmail('');
    setPhone('');
    setIsActive(true);
    setAvailability([
      { day: 1, start: '09:00', end: '17:00' },
      { day: 2, start: '09:00', end: '17:00' },
      { day: 3, start: '09:00', end: '17:00' },
      { day: 4, start: '09:00', end: '17:00' },
      { day: 5, start: '09:00', end: '17:00' },
    ]);
    setEditingStaff(null);
  }

  function openEditDialog(member: StaffWithAvailability) {
    setEditingStaff(member);
    setName(member.name);
    setEmail(member.email || '');
    setPhone(member.phone || '');
    setIsActive(member.is_active);
    setAvailability(
      member.availability.map(a => ({
        day: a.day_of_week,
        start: a.start_time,
        end: a.end_time,
      }))
    );
    setIsDialogOpen(true);
  }

  function toggleDay(day: number) {
    const exists = availability.find(a => a.day === day);
    if (exists) {
      setAvailability(availability.filter(a => a.day !== day));
    } else {
      setAvailability([...availability, { day, start: '09:00', end: '17:00' }].sort((a, b) => a.day - b.day));
    }
  }

  function updateDayTime(day: number, field: 'start' | 'end', value: string) {
    setAvailability(availability.map(a => 
      a.day === day ? { ...a, [field]: value } : a
    ));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingStaff ? `/api/staff/${editingStaff.id}` : '/api/staff';
      const method = editingStaff ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          name,
          email: email || null,
          phone: phone || null,
          isActive,
          availability,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      toast.success(editingStaff ? 'Staff updated' : 'Staff added');
      setIsDialogOpen(false);
      resetForm();
      router.refresh();
    } catch {
      toast.error('Failed to save staff');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      const response = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      
      toast.success('Staff deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete staff');
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <DashboardSidebar />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">{t.dashboard.staff.title}</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t.dashboard.staff.addStaff}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingStaff ? t.dashboard.staff.editStaff : t.dashboard.staff.addStaff}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t.dashboard.staff.name}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="active">{t.dashboard.staff.active}</Label>
                </div>
                
                <div>
                  <Label className="mb-2 block">{t.dashboard.staff.availability}</Label>
                  <div className="space-y-2">
                    {DAYS.map((day, index) => {
                      const dayAvail = availability.find(a => a.day === index);
                      return (
                        <div key={day} className="flex items-center gap-2">
                          <Switch
                            checked={!!dayAvail}
                            onCheckedChange={() => toggleDay(index)}
                          />
                          <span className="w-24 text-sm">{day}</span>
                          {dayAvail && (
                            <>
                              <Input
                                type="time"
                                value={dayAvail.start}
                                onChange={(e) => updateDayTime(index, 'start', e.target.value)}
                                className="w-28"
                              />
                              <span>-</span>
                              <Input
                                type="time"
                                value={dayAvail.end}
                                onChange={(e) => updateDayTime(index, 'end', e.target.value)}
                                className="w-28"
                              />
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t.common.cancel}
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t.common.loading : t.common.save}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {staff.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No staff members yet. Add your first staff member!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.profile_image_url || undefined} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        {member.email && (
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          member.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(member)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  
                  {member.availability.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2">{t.dashboard.staff.availability}</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {member.availability.map((a) => (
                          <div key={a.id} className="flex justify-between">
                            <span>{DAYS[a.day_of_week]}</span>
                            <span>{a.start_time} - {a.end_time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
