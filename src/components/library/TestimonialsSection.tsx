/**
 * Chouhan Mattress - Testimonials Section Component
 * Customer reviews and social proof for the homepage
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  product: string;
  content: string;
  verified: boolean;
  helpful: number;
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  recommendPercentage: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  summary: ReviewSummary;
  className?: string;
}

const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClass = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(sizeClass, star <= rating ? 'text-amber-400' : 'text-gray-200')}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const avatarColors = [
  'bg-orange-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-teal-500',
];

export function TestimonialsSection({
  testimonials,
  summary,
  className,
}: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleTestimonials = testimonials.slice(0, 6);

  return (
    <section
      className={cn('py-20 bg-white overflow-hidden', className)}
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-extrabold rounded-full mb-4 tracking-widest uppercase">
            ✦ VERIFIED SLEEP REVIEWS
          </span>
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight font-heading"
          >
            Loved by{' '}
            <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent">
              {summary.totalReviews.toLocaleString()}+
            </span>{' '}
            Happy Sleepers
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Real stories from real customers who transformed their homes and sleep quality with Chouhan Mattress.
          </p>

          {/* Summary Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 p-6 rounded-3xl bg-slate-900 text-white max-w-3xl mx-auto shadow-xl border border-amber-500/20">
            <div className="flex items-center gap-3">
              <StarRating rating={Math.round(summary.averageRating)} size="lg" />
              <div>
                <span className="text-2xl font-extrabold text-amber-400 font-mono">{summary.averageRating}</span>
                <span className="text-slate-400 text-xs font-bold"> / 5.0 Rating</span>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-800 hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-extrabold text-amber-400 font-mono">
                {summary.recommendPercentage}%
              </div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">Would Recommend</div>
            </div>
            <div className="w-px h-10 bg-slate-800 hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-extrabold text-amber-400 font-mono">
                {summary.totalReviews.toLocaleString()}+
              </div>
              <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">Verified Reviews</div>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="relative bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              {/* Quote Mark */}
              <div
                className="absolute top-5 right-7 text-6xl font-serif text-slate-100 leading-none select-none pointer-events-none"
                aria-hidden="true"
              >
                ”
              </div>

              {/* Rating & Verified Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <StarRating rating={testimonial.rating} size="md" />
                {testimonial.verified && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-xs">
                    <svg
                      className="w-3.5 h-3.5 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified Buyer
                  </span>
                )}
              </div>

              {/* Content */}
              <p className="text-slate-700 text-sm leading-relaxed font-medium flex-1 mb-5 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Product Chip */}
              <div className="mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-bold rounded-full">
                  📦 {testimonial.product}
                </span>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                <div
                  className="w-11 h-11 rounded-full bg-slate-900 text-amber-400 border border-amber-500/40 flex items-center justify-center text-sm font-extrabold flex-shrink-0 shadow-md"
                  aria-hidden="true"
                >
                  {testimonial.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 text-sm truncate">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <svg
                      className="w-3 h-3 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {testimonial.location}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {new Date(testimonial.date).toLocaleDateString('en-IN', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-14"
        >
          <a
            href="/reviews"
            className="inline-flex items-center gap-2 text-amber-700 font-extrabold border-2 border-amber-500 rounded-2xl px-10 py-3.5 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
          >
            Read All 12,500+ Reviews
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
