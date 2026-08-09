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
          className="mb-10 text-left"
        >
          <h2
            id="categories-heading"
            className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-heading"
          >
            Shop By Categories
          </h2>
          <div className="w-16 h-1 bg-amber-500 rounded-full mt-2" />
        </motion.div>

        {/* Categories Bento Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
          className="grid gap-6 grid-cols-1 md:grid-cols-4 grid-rows-auto"
          role="list"
        >
          {items.map((item, index) => {
            // Assign specific grid styles based on index for a bento box layout
            let gridSpan = "md:col-span-1";
            let imageHeight = "h-48";

            if (index === 0) {
              gridSpan = "md:col-span-2 md:row-span-2";
              imageHeight = "h-72 md:h-[320px]";
            } else if (index === 3) {
              gridSpan = "md:col-span-2 md:row-span-1";
              imageHeight = "h-48 md:h-[135px]";
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={gridSpan}
                role="listitem"
              >
                <Link
                  href={item.href}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all duration-300 block h-full flex flex-col justify-between"
                >
                  <div className={cn("relative w-full overflow-hidden flex-1", imageHeight)}>
                    <OptimizedImage
                      src={item.image}
                      alt={item.alt || item.name}
                      preset="productGrid"
                      placeholder="blur"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      containerClassName="h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="p-6 bg-white border-t border-slate-50 flex-shrink-0">
                    <h3 className="font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors text-base">{item.name}</h3>
                    <div className="mt-2 h-1 w-12 bg-amber-500 rounded-full group-hover:w-20 transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Sale Banner - Luxury Overhaul */}
        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-20 relative overflow-hidden rounded-3xl border border-amber-500/30 bg-[#0B132B] shadow-2xl"
          >
            {/* Ambient Gold Radial Spotlight Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/25 via-slate-900/60 to-slate-950 pointer-events-none" />

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative min-h-[380px] md:min-h-[460px] flex items-center justify-center p-8 sm:p-12 md:p-16 text-center">
              <div className="max-w-3xl mx-auto flex flex-col items-center">
                {/* Badge */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-extrabold uppercase tracking-widest mb-6 backdrop-blur-md shadow-inner"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ✦ ROYAL FESTIVAL OFFER — LIMITED TIME
                </motion.div>

                {/* Headline */}
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight font-heading">
                  <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                    {cta.title}
                  </span>
                </h2>

                {/* Description */}
                <p
                  className="text-base sm:text-xl text-slate-300 mb-8 max-w-2xl font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: cta.description }}
                />

                {/* Glassmorphism Countdown Timer */}
                <div className="grid grid-cols-4 gap-3 sm:gap-6 mb-10 w-full max-w-md">
                  <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl">
                    <span className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                      {String(cta.countdown?.days || 0).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Days</span>
                  </div>
                  <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl">
                    <span className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                      {String(cta.countdown?.hours || 0).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Hours</span>
                  </div>
                  <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl">
                    <span className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                      {String(cta.countdown?.minutes || 0).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Mins</span>
                  </div>
                  <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl">
                    <span className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                      {String(cta.countdown?.seconds || 0).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Secs</span>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <Link
                  href={cta.ctaLink}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-extrabold text-base rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 group border border-amber-300/40"
                >
                  <span>{cta.ctaText}</span>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default CategoriesSection;