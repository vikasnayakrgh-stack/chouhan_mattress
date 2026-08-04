/**
 * Chouhan Mattress - Top Selling Products Section Component
 * Fully functional product grid with Cart & Wishlist actions
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProductGrid } from './ProductGrid';
import { cn } from '@/lib/utils';
import { BaseComponentProps } from '@/types';
import { useCart } from '@/context/CartContext';

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
  const { addItem, openDrawer } = useCart();

  const handleAddToCart = (product: any) => {
    addItem({
      productId: String(product.id),
      name: product.name,
      price: typeof product.price === 'number' ? product.price : (product.price?.current || 0),
      originalPrice: product.originalPrice,
      quantity: 1,
      image: product.primaryImage || product.image || (product.images && product.images[0]) || '',
      category: product.category || product.type || 'mattresses',
    });
    openDrawer();
  };

  const handleToggleWishlist = (product: any) => {
    // Navigate to wishlist or trigger toast notification
    window.location.href = '/wishlist';
  };

  const handleProductClick = (product: any) => {
    const targetUrl = product.href || `/products/${product.slug || product.id}`;
    window.location.href = targetUrl;
  };

  return (
    <section
      className={cn('py-16 bg-gray-50/60', className)}
      data-testid={testId}
      aria-labelledby="top-selling-heading"
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
            id="top-selling-heading"
            className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight"
            dangerouslySetInnerHTML={{ __html: headline }}
          />
          <div className="w-16 h-1 bg-[#3B0764] rounded-full mt-2 mb-3" />
          <p className="text-base text-gray-600 max-w-2xl">
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
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onProductClick={handleProductClick}
          data-testid={`${testId}-grid`}
        />

        {/* View All Link */}
        {showViewAll && viewAllHref && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-12 text-center"
          >
            <a
              href={viewAllHref}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3B0764] text-white font-bold text-sm rounded-xl hover:bg-purple-900 hover:shadow-lg transition-all"
            >
              {viewAllText}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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