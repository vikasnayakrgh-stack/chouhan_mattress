import type { Metadata, Viewport } from 'next'
import { poppins, inter, fontPreconnectHints, fontClassNames } from '@/lib/assets/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Chouhan Mattress | Premium Mattresses, Beds & Home Comfort',
    template: '%s | Chouhan Mattress',
  },
  description: 'Buy premium handcrafted mattresses, beds, sofas, pillows & home decor online at Chouhan Mattress. 100-night trial, free shipping, easy EMI & 10+ years warranty.',
  keywords: ['mattress', 'furniture', 'sofa', 'bed', 'pillow', 'chouhan mattress', 'sleep', 'orthopedic', 'memory foam', 'home decor'],
  authors: [{ name: 'Chouhan Mattress' }],
  creator: 'Chouhan Mattress',
  publisher: 'Chouhan Mattress',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.chouhanmattress.com',
    siteName: 'Chouhan Mattress',
    title: 'Chouhan Mattress | Premium Mattresses, Beds & Home Comfort',
    description: 'Buy premium handcrafted mattresses, beds, sofas, pillows & home decor online at Chouhan Mattress. 100-night trial, free shipping, easy EMI & 10+ years warranty.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Chouhan Mattress - Premium Comfort & Sleep',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chouhan Mattress | Premium Mattresses, Beds & Home Comfort',
    description: 'Buy premium handcrafted mattresses, beds, sofas, pillows & home decor online at Chouhan Mattress. 100-night trial, free shipping, easy EMI & 10+ years warranty.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A2E' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

import { CartProvider } from '@/context/CartContext'
import { Toaster } from 'sonner'
import { MobileBottomNav } from '@/components/library/MobileBottomNav'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fontClassNames}>
      <head>
        {fontPreconnectHints.map((hint, i) => (
          <link key={i} rel={hint.rel} href={hint.href} crossOrigin={hint.crossOrigin} />
        ))}
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-slate-950 focus:font-extrabold focus:rounded-lg focus:shadow-xl"
        >
          Skip to main content
        </a>
        <CartProvider>
          {children}
          <MobileBottomNav />
          <Toaster position="bottom-center" expand={false} richColors closeButton duration={3500} />
        </CartProvider>
      </body>
    </html>
  )
}