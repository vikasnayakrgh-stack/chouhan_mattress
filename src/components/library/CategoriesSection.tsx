/**
 * Wakefit Clone - Categories Section Component
 * Reusable category grid with CTA banner
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';
import { BaseComponentProps, CategoryItem } from '@/types';

interface CategoriesSectionData {
  headline: string;
  subheadline?: string;
  description?: string;
  items: CategoryItem[];
  cta?: {
    title: string;
    description: string;
    backgroundImage: string;
    countdown?: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };
    ctaText: string;
    ctaLink: string;
  };
}

interface CategoriesSectionProps extends BaseComponentProps {
  data: CategoriesSectionData;
}

export function CategoriesSection({
  className = '',
  data,
  'data-testid': testId,
}: CategoriesSectionProps) {
  const { headline, subheadline, description, items, cta } = data;

  return (
    <section
      className={cn('py-20 bg-white', className)}
      data-testid={testId}
      aria-labelledby="categories-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2
            id="categories-heading"
            className="text-3xl md:text-4xl font-bold text-wakefit-dark mb-4"
            dangerouslySetInnerHTML={{ __html: headline }}
          />
          {subheadline && (
            <p className="text-lg md:text-xl text-wakefit-gray max-w-2xl mx-auto mb-4" dangerouslySetInnerHTML={{ __html: subheadline }} />
          )}
          {description && (
            <p className="text-wakefit-gray max-w-3xl mx-auto">{description}</p>
          )}
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          role="list"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              role="listitem"
            >
              <Link
                href={item.href}
                className="group relative overflow-hidden rounded-xl border border-brand-gray/20 bg-white hover:border-brand-primary/50 transition-all duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <OptimizedImage
                    src={item.image}
                    alt={item.alt || item.name}
                    preset="productGrid"
                    placeholder="blur"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    containerClassName="h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/30 pointer-events-none" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 font-semibold text-brand-dark">{item.name}</h3>
                  <div className="mt-3 h-1 w-16 bg-[#F26522] rounded-full group-hover:w-24 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Banner */}
        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-16 relative overflow-hidden rounded-xl border border-wakefit-gray/20 bg-white"
          >
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
              <OptimizedImage
                src={cta.backgroundImage}
                alt="Home Sweet Home Sale"
                preset="hero"
                placeholder="blur"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-end pb-10">
                <div className="container mx-auto px-4 w-full max-w-4xl">
                  <div className="text-white text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wakefit-orange/90 text-sm font-semibold mb-4">
                      Sale Ends In
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                      {cta.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-6 max-w-2xl" dangerouslySetInnerHTML={{ __html: cta.description }} />
                    <div className="flex items-center gap-4 mb-8 justify-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Days:</span>
                        <span className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg font-mono text-xl font-bold">
                          {cta.countdown?.days || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Hours:</span>
                        <span className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg font-mono text-xl font-bold">
                          {cta.countdown?.hours || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Minutes:</span>
                        <span className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg font-mono text-xl font-bold">
                          {cta.countdown?.minutes || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Seconds:</span>
                        <span className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg font-mono text-xl font-bold">
                          {cta.countdown?.seconds || 0}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={cta.ctaLink}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-wakefit-orange text-white font-semibold rounded-lg hover:bg-wakefit-orange/90 transition-colors"
                    >
                      {cta.ctaText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default CategoriesSection;