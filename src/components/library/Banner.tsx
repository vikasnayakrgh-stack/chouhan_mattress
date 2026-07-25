/**
 * Wakefit Clone - Banner Component
 * Reusable promotional banner with CTA, badge, and overlay options
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';
import { BannerProps, BaseComponentProps } from '@/types';

export function Banner({
  className = '',
  title,
  subtitle,
  backgroundImage,
  backgroundPosition = 'center',
  ctaText,
  ctaHref,
  ctaVariant = 'primary',
  badgeText,
  badgeVariant = 'primary',
  showOverlay = true,
  overlayColor = 'from-black/60 via-black/40 to-transparent',
  overlayOpacity = 1,
  height = 'auto',
  alignment = 'center',
  'data-testid': testId,
}: BannerProps) {
  const heightStyles: Record<string, string> = {
    auto: 'min-h-[300px] md:min-h-[400px] lg:min-h-[500px]',
    full: 'min-h-screen',
    half: 'min-h-[50vh] md:min-h-[60vh]',
  };

  const alignmentStyles: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  const justifyStyles: Record<string, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        heightStyles[height] || `min-h-[${height}]`,
        className
      )}
      data-testid={testId}
      aria-labelledby="banner-title"
    >
      {/* Background Image */}
      {backgroundImage && (
        <OptimizedImage
          src={backgroundImage}
          alt=""
          preset="hero"
          priority={false}
          placeholder="blur"
          className="absolute inset-0 w-full h-full object-cover"
          containerClassName="absolute inset-0"
          style={{ objectPosition: backgroundPosition }}
          aria-hidden="true"
        />
      )}

      {/* Overlay */}
      {showOverlay && (
        <div
          className={cn('absolute inset-0 bg-gradient-to-r', overlayColor)}
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-10 flex h-full px-4',
          alignmentStyles[alignment] || 'items-center text-center',
          justifyStyles[alignment] || 'justify-center'
        )}
      >
        <div className="container mx-auto max-w-4xl w-full animate-slide-up">
          {/* Badge */}
          {badgeText && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full mb-4',
                badgeVariant === 'primary' && 'bg-wakefit-orange text-white',
                badgeVariant === 'secondary' && 'bg-wakefit-dark text-white',
                badgeVariant === 'success' && 'bg-green-600 text-white',
                badgeVariant === 'warning' && 'bg-yellow-500 text-white',
                badgeVariant === 'outline' && 'border-2 border-white text-white bg-transparent'
              )}
              role="status"
            >
              {badgeText}
            </motion.span>
          )}

          {/* Title */}
          <h2
            id="banner-title"
            className={cn(
              'font-bold tracking-tight mb-4',
              alignment === 'center' ? 'mx-auto max-w-2xl' : 'max-w-xl'
            )}
          >
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className={cn(
                'text-lg md:text-xl text-white/90 mb-8',
                alignment === 'center' ? 'mx-auto max-w-2xl' : 'max-w-xl'
              )}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA */}
          {ctaText && ctaHref && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Link
                href={ctaHref}
                className={cn(
                  'inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg',
                  'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  ctaVariant === 'primary'
                    ? 'bg-wakefit-orange text-white hover:bg-wakefit-orange/90 focus:ring-wakefit-orange/50 shadow-lg hover:shadow-xl'
                    : ctaVariant === 'secondary'
                    ? 'bg-wakefit-dark text-white hover:bg-wakefit-dark/90 focus:ring-wakefit-dark/50'
                    : ctaVariant === 'outline'
                    ? 'border-2 border-white text-white hover:bg-white/10 focus:ring-white/50'
                    : 'bg-white text-wakefit-dark hover:bg-white/90 focus:ring-white/50'
                )}
              >
                {ctaText}
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// Need to import motion for the badge
import { motion } from 'framer-motion';

export default Banner;