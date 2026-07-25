/**
 * Wakefit Clone - Top Selling Products Section Component
 * Reusable product grid with section header
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProductGrid } from './ProductGrid';
import { cn } from '@/lib/utils';
import { BaseComponentProps } from '@/types';

interface TopSellingProductsSectionProps extends BaseComponentProps {
  products: any[];
  headline: string;
  subheadline: string;
  showViewAll?: boolean;
  viewAllHref?: string;
  viewAllText?: string;
}

export function TopSellingProductsSection({
  className = '',
  products,
  headline,
  subheadline,
  showViewAll = false,
  viewAllHref,
  viewAllText = 'View All Favorites',
  'data-testid': testId,
}: TopSellingProductsSectionProps) {
  return (
    <section
      className={cn('py-20 bg-wakefit-gray/30', className)}
      data-testid={testId}
      aria-labelledby="top-selling-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h2
            id="top-selling-heading"
            className="text-3xl md:text-4xl font-bold text-wakefit-dark mb-4"
            dangerouslySetInnerHTML={{ __html: headline }}
          />
          <p className="text-lg md:text-xl text-wakefit-gray max-w-2xl mx-auto">
            {subheadline}
          </p>
        </motion.div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          columns={4}
          gap="md"
          variant="grid"
          showActions={true}
          showBadges={true}
          showRating={true}
          onAddToCart={(product) => console.log('Add to cart:', product.name)}
          onToggleWishlist={(product) => console.log('Toggle wishlist:', product.name)}
          onProductClick={(product) => console.log('Product click:', product.name)}
          data-testid={`${testId}-grid`}
        />

        {/* View All Link */}
        {showViewAll && viewAllHref && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
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
      </div>
    </section>
  );
}

export default TopSellingProductsSection;