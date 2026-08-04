/**
 * Chouhan Mattress — Hero Banner
 * Layout inspired by approved furniture-sale reference (badge + headline + offer card + trust bar)
 * LOCKED to Chouhan Design System: solid saffron #F59E0B, no gradients/glassmorphism.
 * Trust claims render as "Terms Apply" placeholders (owner-pending per Business_Claims_Verification).
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  Truck,
  CreditCard,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';

type ChouhanBannerProps = {
  className?: string;
  backgroundImage?: string;
  badgeText?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  offerTrial?: string;
  offerPrice?: string;
  offerCta?: string;
  offerCtaHref?: string;
};

// 5 trust signals — all owner-pending → rendered with "* Terms Apply" link
const TRUST_ITEMS = [
  { icon: ShieldCheck, label: '100 Nights Trial', href: '/policies/trial' },
  { icon: Award, label: '10 Year Warranty', href: '/policies/warranty' },
  { icon: Truck, label: 'Free Delivery', href: '/policies/shipping' },
  { icon: CreditCard, label: '0% EMI', href: '/policies/emi' },
  { icon: MapPin, label: 'Made in Raipur', href: '/about' },
] as const;

export function ChouhanBanner({
  className = '',
  backgroundImage = '/images/hero_mattress.png',
  badgeText = 'NEW ARRIVALS',
  title = 'Sleep Better. Save Smart.',
  subtitle = 'Orthopedic, Memory Foam, Latex & Custom Sizes — honest prices, no fake MRP.',
  ctaText = 'Shop Mattresses',
  ctaHref = '/products',
  offerTrial = '100 Nights Sleep Trial',
  offerPrice = 'STARTING @ ₹8,999',
  offerCta = 'Explore Range',
  offerCtaHref = '/products',
}: ChouhanBannerProps) {
  return (
    <section
      className={cn('relative w-full overflow-hidden bg-[#0F172A]', className)}
      aria-labelledby="chouhan-banner-title"
    >
      {/* Background lifestyle image */}
      {backgroundImage && (
        <OptimizedImage
          src={backgroundImage}
          alt=""
          preset="hero"
          priority
          placeholder="blur"
          className="absolute inset-0 w-full h-full object-cover"
          containerClassName="absolute inset-0"
          aria-hidden="true"
        />
      )}

      {/* Solid dark overlay (no gradient per design system) */}
      <div className="absolute inset-0 bg-[#0F172A]/70" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          {/* Left: emotional + logical hook */}
          <div className="animate-slide-up">
            {badgeText && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full mb-4 bg-[#F59E0B] text-[#0F172A]"
                role="status"
              >
                {badgeText}
              </motion.span>
            )}

            <h1
              id="chouhan-banner-title"
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
            >
              {title}
            </h1>

            <p className="text-base md:text-lg text-white/85 mb-6 max-w-xl">
              {subtitle}
            </p>

            {ctaText && ctaHref && (
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold rounded-lg bg-[#F59E0B] text-[#0F172A] hover:bg-[#F59E0B]/90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/50 shadow-lg hover:shadow-xl"
              >
                {ctaText}
                <ArrowRight className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </Link>
            )}
          </div>

          {/* Right: offer card (solid surface, no glass) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-xl border border-white/10 bg-[#0F172A]/80 p-6 backdrop-blur-0"
          >
            <div className="flex items-center gap-2 text-[#F59E0B] mb-3">
              <ShieldCheck className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              <span className="text-sm font-semibold">{offerTrial}*</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{offerPrice}*</p>
            <p className="text-xs text-white/60 mb-4">
              *Terms &amp; conditions apply. Policy pending owner approval.
            </p>
            <Link
              href={offerCtaHref}
              className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 text-sm font-semibold rounded-lg border-2 border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/50"
            >
              {offerCta}
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom trust bar (dark translucent strip) */}
      <div className="relative z-10 border-t border-white/10 bg-[#0F172A]/85">
        <ul className="container mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 text-white/90 hover:text-[#F59E0B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/50 rounded"
                  title={`${item.label} — Terms Apply`}
                >
                  <Icon className="h-5 w-5 shrink-0 text-[#F59E0B]" strokeWidth={2} aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium">
                    {item.label}
                    <span className="text-[#F59E0B]" aria-hidden="true"> *</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default ChouhanBanner;
