'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useLocale } from '@/lib/i18n/context';
import { formatPrice } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Link from 'next/link';
import { MapPin, Phone, Clock, Store, User } from 'lucide-react';
import type { BarberProfile, ShopImage, Staff, Service } from '@/lib/types';

interface ShopWithDetails extends BarberProfile {
  images: ShopImage[];
  staff: Staff[];
  services: Service[];
}

interface ShopClientProps {
  shop: ShopWithDetails;
}

export function ShopClient({ shop }: ShopClientProps) {
  const { t, locale } = useLocale();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero / Gallery */}
        <section className="bg-muted">
          {shop.images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {shop.images.map((image) => (
                  <CarouselItem key={image.id}>
                    <div className="aspect-[21/9] md:aspect-[3/1]">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.alt || shop.shop_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {shop.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="aspect-[21/9] md:aspect-[3/1] flex items-center justify-center">
              <Store className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </section>

        {/* Shop Info */}
        <section className="py-8 border-b">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{shop.shop_name}</h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{shop.address}, {shop.city}, {shop.country}</span>
                </div>
                {shop.phone && (
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{shop.phone}</span>
                  </div>
                )}
              </div>
              <Button asChild size="lg">
                <Link href={`/shop/${shop.slug}/book`}>{t.shop.bookNow}</Link>
              </Button>
            </div>
            {shop.description && (
              <div className="mt-6">
                <h2 className="font-semibold text-lg mb-2">{t.shop.about}</h2>
                <p className="text-muted-foreground">{shop.description}</p>
              </div>
            )}
          </div>
        </section>

        {/* Services */}
        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">{t.shop.services}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shop.services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{service.name}</h3>
                      <span className="font-bold text-primary">
                        {formatPrice(service.price, shop.currency, locale)}
                      </span>
                    </div>
                    {service.description && (
                      <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration_minutes} {t.shop.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {shop.services.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No services available</p>
            )}
          </div>
        </section>

        {/* Staff */}
        {shop.staff.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container">
              <h2 className="text-2xl font-bold mb-6">{t.shop.staff}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {shop.staff.map((member) => (
                  <Card key={member.id} className="text-center">
                    <CardContent className="pt-6">
                      <Avatar className="h-20 w-20 mx-auto mb-4">
                        <AvatarImage src={member.avatar_url || undefined} alt={member.name} />
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold">{member.name}</h3>
                      {member.role && (
                        <Badge variant="secondary" className="mt-2">{member.role}</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Book CTA */}
        <section className="py-12">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to book?</h2>
            <p className="text-muted-foreground mb-6">Choose your service and pick a time that works for you.</p>
            <Button asChild size="lg">
              <Link href={`/shop/${shop.slug}/book`}>{t.shop.bookNow}</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
