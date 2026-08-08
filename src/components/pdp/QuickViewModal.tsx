/**
 * Chouhan Mattress - Desktop Product Quick View Modal
 * High-speed desktop preview modal for inspecting product specs & adding to cart without page transition
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ShoppingCartIcon, StarIcon, ShieldCheckIcon, TruckIcon, RotateCcwIcon, ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useCart } from '@/context/CartContext';
import { ProductVariantOption } from '@/types/pdp';

export interface QuickViewProduct {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  thumbnail: string;
  description?: string;
  thickness?: string[];
  firmness?: string;
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_VARIANTS: ProductVariantOption[] = [
  { id: 'qv-1', size: 'Single', dimensions: '36x75 in', price: 0.8, stock: 50 },
  { id: 'qv-2', size: 'Double', dimensions: '48x78 in', price: 0.9, stock: 65 },
  { id: 'qv-3', size: 'Queen', dimensions: '60x78 in', price: 1.0, stock: 100 },
  { id: 'qv-4', size: 'King', dimensions: '72x78 in', price: 1.15, stock: 80 },
];

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(2); // Default Queen
  const [selectedThickness, setSelectedThickness] = useState<string>('8 Inch');

  if (!isOpen || !product) return null;

  const basePrice = product.price;
  const baseOriginalPrice = product.originalPrice || Math.round(product.price * 1.8);
  const sizeMultiplier = DEFAULT_VARIANTS[selectedSizeIndex]?.price || 1.0;

  const currentPrice = Math.round(basePrice * sizeMultiplier);
  const currentOriginalPrice = Math.round(baseOriginalPrice * sizeMultiplier);
  const discountPercent = Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100);

  const handleAddToCart = () => {
    addItem({
      productId: String(product.id),
      name: product.name,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      quantity: 1,
      image: product.thumbnail,
      size: DEFAULT_VARIANTS[selectedSizeIndex]?.size,
      thickness: selectedThickness,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-slate-200 grid md:grid-cols-2 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-900 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <XIcon className="w-5 h-5" />
          </button>

          {/* Left Column: Image Preview */}
          <div className="bg-slate-50 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-100 relative">
            <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Quick View
            </span>

            <div className="w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden shadow-md bg-white border border-slate-200/80 relative">
              <OptimizedImage
                src={product.thumbnail}
                alt={product.name}
                preset="productGrid"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Badges */}
            <div className="flex gap-4 mt-6 text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-1"><ShieldCheckIcon className="w-4 h-4 text-emerald-600" /> 10-Yr Warranty</span>
              <span className="flex items-center gap-1"><RotateCcwIcon className="w-4 h-4 text-amber-600" /> 100-Night Trial</span>
            </div>
          </div>

          {/* Right Column: Specs & Cart Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200 font-extrabold text-xs">
                    <StarIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {product.rating}
                  </span>
                  {product.reviewCount && <span className="text-xs text-slate-400 font-medium">({product.reviewCount} verified reviews)</span>}
                </div>
              )}

              {/* Title */}
              <h2 className="text-lg md:text-xl font-bold text-slate-900 font-heading line-clamp-2">{product.name}</h2>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 my-3">
                <span className="text-2xl font-black text-slate-900">₹{currentPrice.toLocaleString('en-IN')}</span>
                <span className="text-xs text-slate-400 line-through">₹{currentOriginalPrice.toLocaleString('en-IN')}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{discountPercent}% OFF</span>
              </div>

              {/* Size Pills */}
              <div className="mb-4">
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">Select Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {DEFAULT_VARIANTS.map((v, idx) => {
                    const isSelected = idx === selectedSizeIndex;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedSizeIndex(idx)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 text-slate-950 font-bold ring-1 ring-amber-500/40'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs">{v.size} ({v.dimensions})</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Thickness Pills */}
              <div className="mb-6">
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">Thickness</label>
                <div className="flex gap-2">
                  {(product.thickness || ['6 Inch', '8 Inch']).map((th) => {
                    const isSelected = th === selectedThickness;
                    return (
                      <button
                        key={th}
                        onClick={() => setSelectedThickness(th)}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 text-slate-950 ring-1 ring-amber-500/40'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {th}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs md:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 cursor-pointer"
              >
                <ShoppingCartIcon className="w-4 h-4" />
                <span>Add to Cart • ₹{currentPrice.toLocaleString('en-IN')}</span>
              </button>

              <Link
                href={`/product/${product.id}`}
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Full Product Specifications</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default QuickViewModal;
