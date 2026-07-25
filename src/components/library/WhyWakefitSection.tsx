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
      className={cn('py-20 bg-white', className)}
      data-testid={testId}
      aria-labelledby="why-choose-us-heading"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            id="why-wakefit-heading"
            className="text-3xl md:text-4xl font-bold text-wakefit-dark mb-4"
          >
            {headline}
          </h2>
          <p className="text-lg md:text-xl text-wakefit-gray max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: subheadline }} />
          <p className="text-wakefit-gray mt-6 max-w-3xl mx-auto">{description}</p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-wakefit-orange/10 text-wakefit-orange">
                {iconComponents[feature.icon as keyof typeof iconComponents] || feature.icon}
              </div>
              <h3 className="font-semibold text-wakefit-dark">{feature.title}</h3>
              <p className="text-wakefit-gray text-sm">{feature.description}</p>
              {feature.highlight && (
                <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-wakefit-orange/10 text-wakefit-orange">
                  {feature.highlight}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <p className="text-4xl md:text-5xl font-bold text-brand-dark">{stat.value}</p>
              <p className="text-brand-gray text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const WhyWakefitSection = WhyChooseUsSection;
export default WhyChooseUsSection;