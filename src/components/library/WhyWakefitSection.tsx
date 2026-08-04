/**
 * Wakefit Clone - Why Wakefit Section Component
 * Reusable features and stats section
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BaseComponentProps } from '@/types';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

interface Stat {
  value: string;
  label: string;
}

interface WhyChooseUsSectionProps extends BaseComponentProps {
  data: {
    headline: string;
    subheadline: string;
    description: string;
    features: Feature[];
    stats: Stat[];
  };
}

const iconComponents: Record<string, React.ReactNode> = {
  Star: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  Truck: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0 2 2 0 00-4 0zm12 0a2 2 0 104 0 2 2 0 00-4 0z" /></svg>,
  Shield: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  RotateCcw: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Award: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Home: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Zap: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Check: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
};

export function WhyChooseUsSection({
  className = '',
  data,
  'data-testid': testId,
}: WhyChooseUsSectionProps) {
  const { headline, subheadline, description, features, stats } = data;

  return (
    <section
      className={cn('py-24 bg-gradient-to-b from-[#FAF9F6] via-white to-[#FAF9F6] border-t border-b border-slate-200/80 relative overflow-hidden', className)}
      data-testid={testId}
      aria-labelledby="why-chouhan-heading"
    >
      {/* Background Accent Grid */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-extrabold uppercase tracking-widest mb-3">
            ✦ THE SCIENCE OF ROYAL SLEEP
          </span>
          <h2
            id="why-chouhan-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight font-heading"
          >
            {headline}
          </h2>
          <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto font-medium" dangerouslySetInnerHTML={{ __html: subheadline }} />
          <p className="text-slate-600 mt-4 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">{description}</p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group flex flex-col items-center gap-5 text-center p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Subtle Card Highlight Bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-900 text-amber-400 border border-amber-500/30 shadow-md group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                {iconComponents[feature.icon as keyof typeof iconComponents] || feature.icon}
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">{feature.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">{feature.description}</p>
              {feature.highlight && (
                <span className="mt-auto inline-flex items-center gap-1.5 px-3.5 py-1 text-[11px] font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-300/80 shadow-xs">
                  {feature.highlight}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              className="p-8 rounded-3xl bg-[#0B132B] text-white shadow-xl border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 group"
            >
              <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-400 mb-2 font-mono tracking-tight group-hover:scale-105 transition-transform">{stat.value}</p>
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const WhyWakefitSection = WhyChooseUsSection;
export default WhyChooseUsSection;