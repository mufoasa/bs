import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LocaleProvider } from '@/lib/i18n/context'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'BarberSpotlight - Find Your Perfect Barber',
  description: 'Discover and book appointments at the best barbershops near you. Easy online booking for customers, powerful management tools for barbers.',
  keywords: ['barber', 'barbershop', 'haircut', 'booking', 'appointment', 'salon'],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <LocaleProvider>
          {children}
          <Toaster />
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  )
}
