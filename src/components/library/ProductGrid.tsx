/**
 * Wakefit Clone - Product Grid Component
 * Reusable, accessible product grid with multiple layouts and loading states
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ProductGridProps, Product } from '@/types';

export function ProductGrid({
  className = '',
  products = [],
  columns = 4,
  gap = 'md',
  variant = 'grid',
  showActions = true,
  showBadges = true,
  showRating = true,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  loading = false,
  error = null,
  emptyMessage = 'No products found',
  emptyAction,
  loadMore,
  'data-testid': testId,
}: ProductGridProps) {
  // Responsive column classes
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-3',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8',
    xl: 'gap-8 md:gap-10',
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
        aria-label="Products loading"
        data-testid={testId}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} variant={variant} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-16 px-4 text-center',
          className
        )}
        role="alert"
        data-testid={testId}
      >
        <svg className="h-12 w-12 text-wakefit-gray/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-semibold text-wakefit-dark mb-2">{error}</h3>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-16 px-4 text-center',
          className
        )}
        data-testid={testId}
      >
        <svg className="h-16 w-16 text-wakefit-gray/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 className="text-lg font-semibold text-wakefit-dark mb-2">{emptyMessage}</h3>
        {emptyAction && (
          <div className="mt-4">{emptyAction}</div>
        )}
      </div>
    );
  }

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className={cn(
        'grid',
        columnClasses[columns as keyof typeof columnClasses],
        gapClasses[gap as keyof typeof gapClasses],
        className
      )}
      role="list"
      aria-label="Products"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      data-testid={testId}
    >
      {products.map((product, index) => (
        <motion.div key={product.id} variants={itemVariants} role="listitem">
          <ProductCard
            product={product}
            variant={variant}
            priority={index < 4}
            showActions={showActions}
            showBadges={showBadges}
            showRating={showRating}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            onClick={onProductClick}
            data-testid={`${testId}-product-${index}`}
          />
        </motion.div>
      ))}

      {/* Load More */}
      {loadMore && loadMore.hasMore && (
        <motion.div
          className="col-span-full flex justify-center py-8"
          variants={itemVariants}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore.onLoadMore}
            disabled={loadMore.loading}
            isLoading={loadMore.loading}
            aria-label={loadMore.loading ? 'Loading more products' : 'Load more products'}
          >
            {loadMore.loading ? 'Loading...' : 'Load More Products'}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Skeleton for Product Card
function ProductCardSkeleton({ variant = 'grid' }: { variant: 'grid' | 'list' | 'featured' | 'compact' | 'masonry' }) {
  if (variant === 'list') {
    return (
      <div className="flex flex-col md:flex-row bg-white rounded-xl border border-wakefit-gray/20 overflow-hidden animate-pulse">
        <div className="md:w-64 aspect-square bg-wakefit-gray/20" />
        <div className="flex-1 p-4 md:p-6 space-y-4">
          <div className="h-4 w-24 bg-wakefit-gray/20 rounded" />
          <div className="h-6 w-3/4 bg-wakefit-gray/20 rounded" />
          <div className="h-4 w-1/2 bg-wakefit-gray/20 rounded" />
          <div className="h-4 w-5/6 bg-wakefit-gray/20 rounded" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-wakefit-gray/20 rounded" />
            <div className="h-4 w-4 bg-wakefit-gray/20 rounded" />
            <div className="h-4 w-4 bg-wakefit-gray/20 rounded" />
            <div className="h-4 w-4 bg-wakefit-gray/20 rounded" />
            <div className="h-4 w-4 bg-wakefit-gray/20 rounded" />
          </div>
          <div className="h-8 w-32 bg-wakefit-gray/20 rounded" />
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="bg-white rounded-2xl border border-wakefit-gray/20 overflow-hidden animate-pulse">
        <div className="aspect-[4/3] bg-wakefit-gray/20" />
        <div className="p-6 space-y-4">
          <div className="h-6 w-32 bg-wakefit-gray/20 rounded-full" />
          <div className="h-8 w-3/4 bg-wakefit-gray/20 rounded" />
          <div className="h-6 w-1/2 bg-wakefit-gray/20 rounded" />
          <div className="h-6 w-2/3 bg-wakefit-gray/20 rounded" />
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 bg-wakefit-gray/20 rounded" />
            <div className="h-5 w-5 bg-wakefit-gray/20 rounded" />
            <div className="h-5 w-5 bg-wakefit-gray/20 rounded" />
            <div className="h-5 w-5 bg-wakefit-gray/20 rounded" />
            <div className="h-5 w-5 bg-wakefit-gray/20 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-20 bg-wakefit-gray/20 rounded-xl" />
            <div className="h-20 bg-wakefit-gray/20 rounded-xl" />
            <div className="h-20 bg-wakefit-gray/20 rounded-xl" />
            <div className="h-20 bg-wakefit-gray/20 rounded-xl" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-wakefit-gray/20 rounded-lg" />
            <div className="h-12 w-12 bg-wakefit-gray/20 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 bg-white rounded-lg border border-wakefit-gray/20 p-2 animate-pulse">
        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-wakefit-gray/20" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 w-3/4 bg-wakefit-gray/20 rounded" />
          <div className="h-5 w-24 bg-wakefit-gray/20 rounded" />
        </div>
        <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-wakefit-gray/20" />
      </div>
    );
  }

  // Default grid variant
  return (
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
  );
}

export default ProductGrid;