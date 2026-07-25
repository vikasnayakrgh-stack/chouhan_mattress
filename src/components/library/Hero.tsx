/**
 * Wakefit Clone - Hero Component
 * Reusable hero section with countdown, CTAs, badges, animations
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';
import { HeroProps, CtaButton, Badge, CountdownData, BaseComponentProps } from '@/types';

export function Hero({
  className = '',
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundPosition = 'center',
  ctaPrimary,
  ctaSecondary,
  badges = [],
  countdown,
  showArrow = false,
  arrowLabel = 'Scroll to explore',
  overlay,
  height = 'standard',
  'data-testid': testId,
}: HeroProps) {
  const [countdownTime, setCountdownTime] = useState<CountdownData | null>(countdown || null);

  // Countdown timer
  useEffect(() => {
    if (!countdown) return;
    setCountdownTime(countdown);

    const interval = setInterval(() => {
      setCountdownTime(prev => {
        if (!prev) return null;
        let { days, hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        if (hours < 0) {
          hours = 23;
          days -= 1;
        }
        if (days < 0) return null;
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown?.days, countdown?.hours, countdown?.minutes, countdown?.seconds]);

  const heightStyles = {
    standard: 'min-h-[600px] md:min-h-[700px] lg:min-h-[800px]',
    tall: 'min-h-[700px] md:min-h-[850px] lg:min-h-[950px]',
    full: 'min-h-screen',
  };

  const containerHeight = {
    standard: 'h-[600px] md:h-[700px] lg:h-[800px]',
    tall: 'h-[700px] md:h-[850px] lg:h-[950px]',
    full: 'h-screen',
  };

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        heightStyles[height],
        className
      )}
      data-testid={testId}
      aria-labelledby="hero-title"
    >
      {/* Background Image */}
      {backgroundImage && (
        <OptimizedImage
          src={backgroundImage}
          alt=""
          preset={height === 'tall' ? 'heroTall' : 'hero'}
          priority={true}
          placeholder="blur"
          className={cn(
            'absolute inset-0 w-full h-full object-cover',
            containerHeight[height]
          )}
          containerClassName="absolute inset-0"
          style={{ objectPosition: backgroundPosition }}
          aria-hidden="true"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" aria-hidden="true" />

      {/* Custom Overlay */}
      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="container mx-auto max-w-6xl w-full">
            <div className="max-w-3xl animate-slide-up">{overlay}</div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={cn('relative z-10 flex items-end', containerHeight[height])}>
        <div className="container mx-auto px-4 pb-12 md:pb-16 lg:pb-20 w-full">
          <div className="max-w-3xl animate-slide-up">
            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6" role="list" aria-label="Badges">
                {badges.map((badge, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full',
                      badge.variant === 'primary' && 'bg-wakefit-orange text-white',
                      badge.variant === 'secondary' && 'bg-wakefit-dark text-white',
                      badge.variant === 'success' && 'bg-green-600 text-white',
                      badge.variant === 'warning' && 'bg-yellow-500 text-white',
                      badge.variant === 'outline' && 'border-2 border-wakefit-orange text-wakefit-orange bg-transparent'
                    )}
                    role="listitem"
                  >
                    {badge.text}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Countdown */}
            {countdownTime && (
              <div className="flex items-center gap-4 mb-6" role="timer" aria-label="Sale countdown">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-wakefit-orange/90 rounded-full backdrop-blur">
                  Sale Ends In
                </span>
                <div className="flex items-center gap-1">
                  {[
                    { value: countdownTime.days, label: 'Days' },
                    { value: countdownTime.hours, label: 'Hours' },
                    { value: countdownTime.minutes, label: 'Mins' },
                    { value: countdownTime.seconds, label: 'Secs' },
                  ].map(({ value, label }, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-1"
                    >
                      <span className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white bg-black/60 rounded-lg backdrop-blur font-mono">
                        {String(value).padStart(2, '0')}
                      </span>
                      <span className="text-xs text-white/70 hidden sm:block">{label}</span>
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Title */}
            <h1
              id="hero-title"
              className={cn(
                'font-bold tracking-tight mb-4',
                height === 'full' ? 'text-5xl md:text-7xl lg:text-8xl' : 'text-4xl md:text-6xl lg:text-7xl'
              )}
            >
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}

            {/* Description */}
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-white/70 mb-8 max-w-xl"
              >
                {description}
              </motion.p>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              {ctaPrimary && (
                <Link
                  href={ctaPrimary.href}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg',
                    'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    ctaPrimary.variant === 'primary'
                      ? 'bg-wakefit-orange text-white hover:bg-wakefit-orange/90 focus:ring-wakefit-orange/50 shadow-lg hover:shadow-xl'
                      : ctaPrimary.variant === 'secondary'
                      ? 'bg-wakefit-dark text-white hover:bg-wakefit-dark/90 focus:ring-wakefit-dark/50'
                      : ctaPrimary.variant === 'outline'
                      ? 'border-2 border-white text-white hover:bg-white/10 focus:ring-white/50'
                      : 'bg-white text-wakefit-dark hover:bg-white/90 focus:ring-white/50'
                  )}
                >
                  {ctaPrimary.text}
                  {ctaPrimary.icon && <span aria-hidden="true">{ctaPrimary.icon}</span>}
                </Link>
              )}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg',
                    'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    ctaSecondary.variant === 'primary'
                      ? 'bg-wakefit-orange text-white hover:bg-wakefit-orange/90 focus:ring-wakefit-orange/50'
                      : ctaSecondary.variant === 'secondary'
                      ? 'bg-wakefit-dark text-white hover:bg-wakefit-dark/90 focus:ring-wakefit-dark/50'
                      : ctaSecondary.variant === 'outline'
                      ? 'border-2 border-white text-white hover:bg-white/10 focus:ring-white/50'
                      : 'bg-white text-wakefit-dark hover:bg-white/90 focus:ring-white/50'
                  )}
                >
                  {ctaSecondary.text}
                  {ctaSecondary.icon && <span aria-hidden="true">{ctaSecondary.icon}</span>}
                </Link>
              )}
            </motion.div>

            {/* Scroll Arrow */}
            {showArrow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                aria-hidden="true"
              >
                <motion.button
                  className="flex flex-col items-center gap-1 p-2 text-white/70 hover:text-white transition-colors"
                  aria-label={arrowLabel}
                  whileHover={{ y: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xs font-medium">{arrowLabel}</span>
                  <svg
                    className="h-6 w-6 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;