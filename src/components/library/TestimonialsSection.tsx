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
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
            Customer Stories
          </span>
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Loved by{' '}
            <span className="text-[#F26522]">{summary.totalReviews.toLocaleString()}+</span>{' '}
            Happy Customers
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Real stories from real customers who transformed their homes and sleep quality with
            Chouhan Mattress.
          </p>

          {/* Summary Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(summary.averageRating)} size="md" />
              <span className="text-2xl font-bold text-gray-900">{summary.averageRating}</span>
              <span className="text-gray-400 text-sm">/ 5</span>
            </div>
            <div className="w-px h-8 bg-gray-200 hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {summary.recommendPercentage}%
              </div>
              <div className="text-xs text-gray-400">Would recommend</div>
            </div>
            <div className="w-px h-8 bg-gray-200 hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {summary.totalReviews.toLocaleString()}+
              </div>
              <div className="text-xs text-gray-400">Verified reviews</div>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Quote Mark */}
              <div
                className="absolute top-5 right-6 text-5xl font-serif text-gray-100 leading-none select-none"
                aria-hidden="true"
              >
                "
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <StarRating rating={testimonial.rating} />
                {testimonial.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    <svg
                      className="w-3 h-3"
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
                    Verified
                  </span>
                )}
              </div>

              {/* Content */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">
                "{testimonial.content}"
              </p>

              {/* Product */}
              <div className="text-xs text-[#F26522] font-medium mb-4 truncate">
                📦 {testimonial.product}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0',
                    avatarColors[index % avatarColors.length]
                  )}
                  aria-hidden="true"
                >
                  {testimonial.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 text-sm truncate">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
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
                <div className="ml-auto text-xs text-gray-300">
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
          className="text-center mt-12"
        >
          <a
            href="/reviews"
            className="inline-flex items-center gap-2 text-[#F26522] font-semibold border-2 border-[#F26522] rounded-xl px-8 py-3 hover:bg-[#F26522] hover:text-white transition-all duration-200"
          >
            Read All Reviews
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
                strokeWidth={2}
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
