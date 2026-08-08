/**
 * Chouhan Mattress - Mobile Native Bottom-Sheet Variant Selector
 * Slide-up bottom drawer for mobile PDP size, thickness, and variant selection
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ShoppingBagIcon, CheckIcon, SparklesIcon } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ProductVariantOption {
  id: string;
  size: string;
  dimensions?: string;
  price: number;
  originalPrice?: number;
  stock?: number;
}

interface VariantBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImage: string;
  variants: ProductVariantOption[];
  selectedVariant: ProductVariantOption;
  onSelectVariant: (v: ProductVariantOption) => void;
  thicknesses?: string[];
  selectedThickness?: string;
  onSelectThickness?: (t: string) => void;
  onAddToCart: () => void;
}

export function VariantBottomSheet({
  isOpen,
  onClose,
  productName,
  productImage,
  variants,
  selectedVariant,
  onSelectVariant,
  thicknesses = ['6 Inch', '8 Inch'],
  selectedThickness = '8 Inch',
  onSelectThickness,
  onAddToCart,
}: VariantBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
        />

        {/* Drawer Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl p-6 shadow-2xl z-10 border-t border-slate-100 max-h-[85vh] overflow-y-auto"
        >
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100"
          >
            <XIcon className="w-5 h-5" />
          </button>

          {/* Product Header */}
          <div className="flex gap-4 items-center pb-4 border-b border-slate-100 mb-5">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
              <OptimizedImage src={productImage} alt={productName} preset="thumbnail" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-amber-600 tracking-wider">Select Options</span>
              <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{productName}</h3>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-black text-slate-900">₹{selectedVariant.price.toLocaleString('en-IN')}</span>
                {selectedVariant.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">₹{selectedVariant.originalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>
            </div>
          </div>

          {/* Size Pills */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Mattress Size</label>
            <div className="grid grid-cols-2 gap-2.5">
              {variants.map((v) => {
                const isSelected = v.id === selectedVariant.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => onSelectVariant(v)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                      <span>{v.size}</span>
                      {isSelected && <CheckIcon className="w-4 h-4 text-amber-600" />}
                    </div>
                    {v.dimensions && <div className="text-[11px] text-slate-500 mt-0.5">{v.dimensions}</div>}
                    <div className="text-xs text-amber-600 font-extrabold mt-1">₹{v.price.toLocaleString('en-IN')}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thickness Options */}
          {thicknesses.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Mattress Thickness</label>
              <div className="flex gap-3">
                {thicknesses.map((th) => {
                  const isSelected = th === selectedThickness;
                  return (
                    <button
                      key={th}
                      onClick={() => onSelectThickness && onSelectThickness(th)}
                      className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold text-center transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-slate-950 ring-2 ring-amber-500/30'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {th}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add To Cart CTA Button */}
          <button
            onClick={() => {
              onAddToCart();
              onClose();
            }}
            className="w-full h-12 bg-amber-500 text-slate-950 font-black text-sm rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            <span>Confirm & Add to Cart • ₹{selectedVariant.price.toLocaleString('en-IN')}</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
