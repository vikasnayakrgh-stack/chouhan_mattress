/**
 * Chouhan Mattress - Sticky Floating Add-to-Cart Bar for PDP
 * Appears at the bottom of the screen on scroll for conversion optimization
 */

'use client';

import React, { useState, useEffect } from 'react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ShoppingCartIcon, ZapIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StickyAddToCartBarProps {
  productName: string;
  thumbnail: string;
  selectedSize: string;
  selectedThickness: string;
  price: number;
  originalPrice?: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
  className?: string;
}

export function StickyAddToCartBar({
  productName,
  thumbnail,
  selectedSize,
  selectedThickness,
  price,
  originalPrice,
  onAddToCart,
  onBuyNow,
  className,
}: StickyAddToCartBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 400px
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl py-3 px-4 transition-transform duration-300 transform translate-y-0',
        className
      )}
      role="region"
      aria-label="Quick add to cart"
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Left Info: Thumbnail + Name + Variant */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 hidden sm:block">
            <OptimizedImage
              src={thumbnail}
              alt={productName}
              preset="thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate max-w-[200px] sm:max-w-[300px]">
              {productName}
            </h4>
            <div className="text-[11px] text-gray-500 font-medium truncate">
              {selectedSize} • {selectedThickness}
            </div>
          </div>
        </div>

        {/* Right CTA Actions: Price + Add to Cart + Buy Now */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden xs:block">
            <div className="text-lg font-extrabold text-gray-900 leading-tight">
              ₹{price.toLocaleString()}
            </div>
            {originalPrice && (
              <div className="text-xs text-gray-400 line-through">
                ₹{originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAddToCart}
              className="px-4 sm:px-6 py-2.5 bg-gray-900 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-1.5 focus-visible:outline-none"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Cart</span>
            </button>

            <button
              onClick={onBuyNow}
              className="px-4 sm:px-6 py-2.5 bg-[#F26522] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#d85519] transition-colors flex items-center gap-1.5 focus-visible:outline-none shadow-sm"
            >
              <ZapIcon className="w-4 h-4 fill-white" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StickyAddToCartBar;
