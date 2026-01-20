'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useLocale } from '@/lib/i18n/context';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Search, MapPin, Store } from 'lucide-react';
import type { BarberProfile } from '@/lib/types';

interface ShopWithImage extends BarberProfile {
  image_url: string | null;
}

interface BrowseClientProps {
  shops: ShopWithImage[];
}

export function BrowseClient({ shops }: BrowseClientProps) {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShops = shops.filter((shop) => {
    const query = searchQuery.toLowerCase();
    return (
      shop.shop_name.toLowerCase().includes(query) ||
      shop.city.toLowerCase().includes(query) ||
      shop.country.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 py-12 md:py-16">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              {t.browse.title}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {t.browse.subtitle}
            </p>
            
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t.browse.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>
        </section>

        {/* Shop Grid */}
        <section className="py-12">
          <div className="container">
            {filteredShops.length === 0 ? (
              <div className="text-center py-12">
                <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t.browse.noResults}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredShops.map((shop) => (
                  <Card key={shop.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {shop.image_url ? (
                        <img
                          src={shop.image_url || "/placeholder.svg"}
                          alt={shop.shop_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Store className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-1">{shop.shop_name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>{shop.city}, {shop.country}</span>
                      </div>
                      {shop.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {shop.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{shop.currency}</Badge>
                        <Button asChild size="sm">
                          <Link href={`/shop/${shop.slug}`}>{t.browse.viewShop}</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
