/**
 * Wakefit Clone - Collection Component
 * Generic list wrapper for rendering collections of items
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CollectionProps, Product } from '@/types';

export function Collection<T = Product>({
  className = '',
  items = [],
  title,
  subtitle,
  renderItem,
  columns = 4,
  gap = 'md',
  showViewAll = false,
  viewAllHref,
  viewAllText = 'View All',
  loading = false,
  'data-testid': testId,
}: CollectionProps<T>) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2xl:grid-cols-6',
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-3',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8',
    xl: 'gap-8 md:gap-10',
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <div
        className={cn(
          'grid',
          columnClasses[columns as keyof typeof columnClasses],
          gapClasses[gap as keyof typeof gapClasses],
          className
        )}
        role="list"
        aria-label={`${title || 'Items'} loading`}
        data-testid={testId}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div key={index} variants={itemVariants} role="listitem">
            <div className="bg-white rounded-xl border border-wakefit-gray/20 overflow-hidden animate-pulse">
              <div className="aspect-square bg-wakefit-gray/20" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-20 bg-wakefit-gray/20 rounded-full" />
                <div className="h-5 w-3/4 bg-wakefit-gray/20 rounded" />
                <div className="h-4 w-1/2 bg-wakefit-gray/20 rounded" />
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 bg-wakefit-gray/20 rounded" />
                  <div className="h-4 w-4 bg-wakefit-gray/20 rounded" />
                  <div className="h-4 w-4 bg-wakefit-gray/20 rounded" />
                  <div className="h-4 w-4 bg-wakefit-gray/20 rounded" />
                  <div className="h-4 w-4 bg-wakefit-gray/20 rounded" />
                </div>
                <div className="h-7 w-24 bg-wakefit-gray/20 rounded" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <section className={cn('w-full', className)} data-testid={testId} aria-labelledby={title ? 'collection-title' : undefined}>
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          {title && (
            <h2 id="collection-title" className="text-3xl md:text-4xl font-bold text-wakefit-dark mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-wakefit-gray max-w-2xl">{subtitle}</p>
          )}
          {showViewAll && viewAllHref && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <a
                href={viewAllHref}
                className="inline-flex items-center gap-1.5 text-wakefit-orange font-semibold hover:underline transition-colors"
              >
                {viewAllText}
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>
          )}
        </motion.div>
      )}

      <motion.div
        className={cn(
          'grid',
          columnClasses[columns as keyof typeof columnClasses],
          gapClasses[gap as keyof typeof gapClasses]
        )}
        role="list"
        aria-label={title || 'Items'}
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.div key={index} variants={itemVariants} role="listitem">
            {renderItem(item, index)}
          </motion.div>
        ))}
      </motion.div>

      {showViewAll && viewAllHref && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <a
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 px-6 py-3 text-wakefit-orange font-semibold border-2 border-wakefit-orange rounded-lg hover:bg-wakefit-orange hover:text-white transition-all"
          >
            {viewAllText}
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      )}
    </section>
  );
}

export default Collection;