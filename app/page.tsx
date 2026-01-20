import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useLocale } from '@/lib/i18n/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Calendar, Search, Settings, ArrowRight, Star, Users, Clock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Loading from './loading';

export default function LandingPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
                {t.landing.hero.title}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                {t.landing.hero.subtitle}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/browse">
                    {t.landing.hero.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">{t.nav.register}</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              {t.landing.features.title}
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              The easiest way to discover great barbershops and book your next appointment
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t.landing.features.booking.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {t.landing.features.booking.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t.landing.features.discovery.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {t.landing.features.discovery.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t.landing.features.management.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {t.landing.features.management.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground mt-1">Barbershops</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold">10K+</div>
                <div className="text-sm text-muted-foreground mt-1">Bookings</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold">4.9</div>
                <div className="text-sm text-muted-foreground mt-1">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">Online Booking</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to grow your barbershop?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join hundreds of barbershops already using BarberSpotlight to manage their business.
              </p>
              <Button asChild size="lg">
                <Link href="/register">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function generateMetadata({ params }) {
  return {
    title: 'BarberSpotlight',
    description: 'Discover great barbershops and book your next appointment.',
  };
}
