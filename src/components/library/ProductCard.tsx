/**
 * Wakefit Clone - Product Card Component
 * Reusable, accessible product card with multiple variants
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ProductCardProps, Product, ProductBadge, ProductPrice } from '@/types';

export function ProductCard({
  className = '',
  product,
  variant = 'grid',
  showActions = true,
  showBadges = true,
  showRating = true,
  showWishlist = true,
  priority = false,
  onAddToCart,
  onToggleWishlist,
  onClick,
  isInWishlist = false,
  loading = false,
  'data-testid': testId,
}: ProductCardProps & { priority?: boolean }) {
  const currentPrice = typeof product.price === 'number' ? product.price : (product.price?.current || 0);
  const origPrice = product.originalPrice || (typeof product.price === 'object' ? product.price?.original : undefined);
  const priceUnit = typeof product.price === 'object' ? product.price?.unit : undefined;
  const currencySymbol = product.currency || (typeof product.price === 'object' && product.price?.currency) || '₹';
  const discountPercent = origPrice && origPrice > currentPrice
    ? Math.round(((origPrice - currentPrice) / origPrice) * 100)
    : (product.discount || 0);
  const ratingValue = typeof product.rating === 'number' ? product.rating : (product.rating?.value || 0);
  const reviewCountValue = product.reviewCount || (typeof product.rating === 'object' ? product.rating?.count : 0);
  const productLink = product.href || (product.slug ? `/products/${product.slug}` : '#');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!e.currentTarget.contains(e.target as Node)) return;
    onClick?.(product);
  };

  // Grid variant
  if (variant === 'grid') {
    return (
      <article
        className={cn(
          'group relative bg-white rounded-2xl border border-slate-200 overflow-hidden',
          'transition-all duration-300 hover:shadow-xl hover:border-amber-500/50 hover:-translate-y-1',
          loading && 'animate-pulse pointer-events-none',
          className
        )}
        data-testid={testId}
        onClick={handleClick}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <Link
            href={productLink}
            className="block h-full"
            onClick={(e) => e.stopPropagation()}
            aria-label={`View ${product.name}`}
          >
            <OptimizedImage
              src={product.primaryImage || product.images[0]}
              alt={product.alt || product.name}
              preset="productGrid"
              priority={priority}
              placeholder="blur"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              containerClassName="h-full"
            />
          </Link>

          {/* Badges */}
          {showBadges && product.badges && product.badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.badges.slice(0, 2).map((badge: any, index: number) => {
                const text = typeof badge === 'string' ? badge : badge?.text || '';
                const variant = typeof badge === 'string' ? 'primary' : badge?.variant || 'primary';
                return (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full shadow-xs',
                      variant === 'primary' && 'bg-amber-500 text-slate-950',
                      variant === 'secondary' && 'bg-slate-900 text-white',
                      variant === 'success' && 'bg-emerald-600 text-white',
                      variant === 'warning' && 'bg-amber-600 text-white',
                      variant === 'outline' && 'border border-amber-500 text-amber-600 bg-white/90'
                    )}
                  >
                    {text}
                  </motion.span>
                );
              })}
            </div>
          )}

          {/* Discount Badge */}
          {showBadges && discountPercent > 0 && !product.badges?.some((b: any) => (typeof b === 'string' ? b : b?.text || '').includes('%')) && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 right-3 inline-flex items-center px-2.5 py-1 text-xs font-extrabold text-white bg-rose-600 rounded-full shadow-md"
            >
              -{discountPercent}% OFF
            </motion.span>
          )}

          {/* Wishlist Button */}
          {showWishlist && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleWishlist}
              className={cn(
                'absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md',
                'transition-all duration-200 hover:bg-white',
                isInWishlist ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'
              )}
              aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={isInWishlist}
            >
              <svg
                className={cn('h-5 w-5', isInWishlist ? 'fill-current' : '')}
                fill={isInWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
          )}

          {/* Quick View / Add to Cart */}
          {showActions && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-amber-400"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </motion.button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-2 py-0.5 text-xs font-medium text-wakefit-gray bg-wakefit-gray/10 rounded mb-2"
            >
              {product.category}
            </motion.span>
          )}

          {/* Name */}
          <Link
            href={productLink}
            className="block"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-wakefit-dark mb-1 line-clamp-2 group-hover:text-wakefit-orange transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          {product.shortDesc && (
            <p className="text-sm text-wakefit-gray mb-2 line-clamp-1">{product.shortDesc}</p>
          )}

          {/* Rating */}
          {showRating && ratingValue > 0 && (
            <div className="flex items-center gap-1 mb-2" role="img" aria-label={`${ratingValue} out of 5 stars, ${reviewCountValue} reviews`}>
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn('h-4 w-4', i < Math.floor(ratingValue) ? 'text-yellow-400 fill-current' : 'text-brand-gray/30')}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              {reviewCountValue > 0 && (
                <span className="text-sm text-brand-gray ml-1">({reviewCountValue.toLocaleString()})</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-brand-dark">
              {currencySymbol}{currentPrice.toLocaleString()}
            </span>
            {origPrice && origPrice > currentPrice && (
              <span className="text-sm text-brand-gray line-through">
                {currencySymbol}{origPrice.toLocaleString()}
              </span>
            )}
            {priceUnit && (
              <span className="text-sm text-brand-gray">/{priceUnit}</span>
            )}
          </div>
        </div>
      </article>
    );
  }

  // List variant
  if (variant === 'list') {
    return (
      <motion.article
        className={cn(
          'group relative flex flex-col md:flex-row bg-white rounded-xl border border-wakefit-gray/20 overflow-hidden',
          'transition-all duration-300 hover:shadow-xl hover:border-wakefit-orange/30',
          loading && 'animate-pulse pointer-events-none',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
        data-testid={testId}
      >
        {/* Image */}
        <div className="relative md:w-64 aspect-square md:aspect-auto flex-shrink-0 overflow-hidden bg-wakefit-gray/50">
          <Link
            href={productLink}
            className="block h-full"
            onClick={(e) => e.stopPropagation()}
            aria-label={`View ${product.name}`}
          >
            <OptimizedImage
              src={product.primaryImage || product.images[0]}
              alt={product.alt || product.name}
              preset="productList"
              placeholder="blur"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              containerClassName="h-full"
            />
          </Link>

          {showBadges && product.badges && product.badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.badges.slice(0, 2).map((badge: any, index: number) => {
                const text = typeof badge === 'string' ? badge : badge?.text || '';
                const variant = typeof badge === 'string' ? 'primary' : badge?.variant || 'primary';
                return (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full',
                      variant === 'primary' && 'bg-wakefit-orange text-white',
                      variant === 'secondary' && 'bg-wakefit-dark text-white',
                      variant === 'success' && 'bg-green-600 text-white',
                      variant === 'warning' && 'bg-yellow-500 text-white',
                      variant === 'outline' && 'border-2 border-wakefit-orange text-wakefit-orange bg-transparent'
                    )}
                  >
                    {text}
                  </motion.span>
                );
              })}
            </div>
          )}

          {showWishlist && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleWishlist}
              className={cn(
                'absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md',
                'transition-all duration-200 hover:bg-white',
                isInWishlist ? 'text-wakefit-orange' : 'text-wakefit-gray hover:text-wakefit-orange'
              )}
              aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={isInWishlist}
            >
              <svg
                className={cn('h-5 w-5', isInWishlist ? 'fill-current' : '')}
                fill={isInWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col p-4 md:p-6 flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              {product.category && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block px-2 py-0.5 text-xs font-medium text-wakefit-gray bg-wakefit-gray/10 rounded mb-2"
                >
                  {product.category}
                </motion.span>
              )}

              <Link
                href={productLink}
                className="block"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg md:text-xl font-semibold text-wakefit-dark mb-2 line-clamp-2 group-hover:text-wakefit-orange transition-colors">
                  {product.name}
                </h3>
              </Link>

              {product.shortDesc && (
                <p className="text-wakefit-gray mb-4 line-clamp-2">{product.shortDesc}</p>
              )}

              {showRating && ratingValue > 0 && (
                <div className="flex items-center gap-2 mb-4" role="img" aria-label={`${ratingValue} out of 5 stars, ${reviewCountValue} reviews`}>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={cn('h-4 w-4', i < Math.floor(ratingValue) ? 'text-yellow-400 fill-current' : 'text-brand-gray/30')}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  {reviewCountValue > 0 && (
                    <span className="text-sm text-brand-gray">({reviewCountValue.toLocaleString()} reviews)</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-4 md:w-48">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-brand-dark">
                  {currencySymbol}{currentPrice.toLocaleString()}
                </span>
                {origPrice && origPrice > currentPrice && (
                  <span className="text-lg text-brand-gray line-through">
                    {currencySymbol}{origPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {showActions && (
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={handleAddToCart}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    Add to Cart
                  </Button>
                  {onToggleWishlist && (
                    <Button
                      variant={isInWishlist ? 'secondary' : 'outline'}
                      size="md"
                      fullWidth
                      onClick={handleToggleWishlist}
                      leftIcon={
                        <svg className={cn('h-4 w-4', isInWishlist ? 'fill-current' : '')} fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      }
                      aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                      aria-pressed={isInWishlist}
                    >
                      {isInWishlist ? 'Saved' : 'Save'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Featured variant (larger, more details)
  if (variant === 'featured') {
    return (
      <motion.article
        className={cn(
          'group relative bg-white rounded-2xl border border-wakefit-gray/20 overflow-hidden',
          'transition-all duration-300 hover:shadow-2xl hover:border-wakefit-orange/30',
          loading && 'animate-pulse pointer-events-none',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
        data-testid={testId}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-wakefit-gray/50">
          <Link
            href={productLink}
            className="block h-full"
            onClick={(e) => e.stopPropagation()}
            aria-label={`View ${product.name}`}
          >
            <OptimizedImage
              src={product.primaryImage || product.images[0]}
              alt={product.alt || product.name}
              preset="featured"
              placeholder="blur"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              containerClassName="h-full"
            />
          </Link>

          {showBadges && product.badges && product.badges.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              {product.badges.map((badge, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg',
                    badge.variant === 'primary' && 'bg-wakefit-orange text-white shadow-lg',
                    badge.variant === 'secondary' && 'bg-wakefit-dark text-white shadow-lg',
                    badge.variant === 'success' && 'bg-green-600 text-white shadow-lg',
                    badge.variant === 'warning' && 'bg-yellow-500 text-white shadow-lg',
                    badge.variant === 'outline' && 'border-2 border-wakefit-orange text-wakefit-orange bg-transparent'
                  )}
                >
                  {badge.text}
                </motion.span>
              ))}
            </div>
          )}

          {showWishlist && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleWishlist}
              className={cn(
                'absolute top-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur-sm shadow-lg',
                'transition-all duration-200 hover:bg-white hover:shadow-xl',
                isInWishlist ? 'text-wakefit-orange' : 'text-wakefit-gray hover:text-wakefit-orange'
              )}
              aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={isInWishlist}
            >
              <svg
                className={cn('h-6 w-6', isInWishlist ? 'fill-current' : '')}
                fill={isInWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
          )}
        </div>

        <div className="p-6">
          {product.category && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-3 py-1 text-sm font-medium text-wakefit-gray bg-wakefit-gray/10 rounded-full mb-3"
            >
              {product.category}
            </motion.span>
          )}

          <Link
            href={productLink}
            className="block"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-wakefit-dark mb-3 line-clamp-2 group-hover:text-wakefit-orange transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.shortDesc && (
            <p className="text-wakefit-gray mb-4 line-clamp-3">{product.shortDesc}</p>
          )}

          {product.description && (
            <p className="text-wakefit-gray/80 mb-4 line-clamp-2 text-sm">{product.description}</p>
          )}

          {showRating && ratingValue > 0 && (
            <div className="flex items-center gap-3 mb-4" role="img" aria-label={`${ratingValue} out of 5 stars, ${reviewCountValue} reviews`}>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={cn('h-5 w-5', i < Math.floor(ratingValue) ? 'text-yellow-400 fill-current' : 'text-brand-gray/30')}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {reviewCountValue > 0 && (
                <span className="text-sm text-brand-gray">({reviewCountValue.toLocaleString()} reviews)</span>
              )}
            </div>
          )}

          {/* Specifications preview */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mb-4 p-4 bg-brand-gray/10 rounded-xl">
              <h4 className="text-sm font-semibold text-brand-dark mb-2">Key Features</h4>
              <ul className="grid grid-cols-2 gap-2 text-sm text-brand-gray">
                {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                  <li key={key} className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-brand-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium text-brand-dark">{key}:</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brand-dark">
                {currencySymbol}{currentPrice.toLocaleString()}
              </span>
              {origPrice && origPrice > currentPrice && (
                <span className="text-lg text-brand-gray line-through">
                  {currencySymbol}{origPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2 py-1 text-sm font-bold text-white bg-red-500 rounded-full">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {showActions && (
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth={true}
                  onClick={handleAddToCart}
                  className="flex-1"
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to Cart
                </Button>
                {onToggleWishlist && (
                  <Button
                    variant={isInWishlist ? 'secondary' : 'outline'}
                    size="lg"
                    fullWidth={true}
                    onClick={handleToggleWishlist}
                    leftIcon={
                      <svg className={cn('h-5 w-5', isInWishlist ? 'fill-current' : '')} fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    }
                    aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                    aria-pressed={isInWishlist}
                  >
                    {isInWishlist ? 'Saved' : 'Save'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.article>
    );
  }

  // Compact variant (for mini cart, recently viewed, etc.)
  return (
    <motion.article
      className={cn(
        'group relative flex items-center gap-3 bg-white rounded-lg border border-wakefit-gray/20 p-2',
        'transition-all duration-200 hover:shadow-md hover:border-wakefit-orange/30',
        loading && 'animate-pulse pointer-events-none',
        className
      )}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      data-testid={testId}
    >
      <Link
        href={productLink}
        className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-wakefit-gray/50"
        onClick={(e) => e.stopPropagation()}
        aria-label={`View ${product.name}`}
      >
        <OptimizedImage
          src={product.primaryImage || product.images[0]}
          alt={product.alt || product.name}
          preset="thumbnail"
          placeholder="blur"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          containerClassName="h-full"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-brand-dark truncate group-hover:text-brand-primary transition-colors">
          {product.name}
        </h4>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-sm font-semibold text-brand-dark">
            {currencySymbol}{currentPrice.toLocaleString()}
          </span>
          {origPrice && origPrice > currentPrice && (
            <span className="text-xs text-brand-gray line-through">
              {currencySymbol}{origPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {showWishlist && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleWishlist}
          className={cn(
            'p-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm',
            'transition-all duration-200 hover:bg-white',
            isInWishlist ? 'text-wakefit-orange' : 'text-wakefit-gray hover:text-wakefit-orange'
          )}
          aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isInWishlist}
        >
          <svg
            className={cn('h-5 w-5', isInWishlist ? 'fill-current' : '')}
            fill={isInWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </motion.button>
      )}
    </motion.article>
  );
}

export default ProductCard;