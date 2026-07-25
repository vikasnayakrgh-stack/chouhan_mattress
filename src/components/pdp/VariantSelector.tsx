/**
 * Chouhan Mattress - Variant Selector Component for PDP
 * Size picker (Single, Double, Queen, King, Custom), thickness selector & price calculator trigger
 */

'use client';

import React from 'react';
import { ProductVariantOption } from '@/types/pdp';
import { cn } from '@/lib/utils';
import { CheckIcon, RulerIcon } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariantOption[];
  selectedVariant: ProductVariantOption;
  onSelectVariant: (variant: ProductVariantOption) => void;
  availableThicknesses?: string[];
  selectedThickness?: string;
  onSelectThickness?: (thickness: string) => void;
  isCustomSelected: boolean;
  onToggleCustom: () => void;
  className?: string;
}

const SIZE_DESCRIPTIONS: Record<string, string> = {
  Single: '36" x 75" (1 Person)',
  Double: '48" x 78" (1-2 Persons)',
  Queen: '60" x 78" (2 Persons)',
  King: '72" x 78" (2 Adults + Child)',
};

export function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
  availableThicknesses = ['6 Inch', '8 Inch', '10 Inch'],
  selectedThickness = '8 Inch',
  onSelectThickness,
  isCustomSelected,
  onToggleCustom,
  className,
}: VariantSelectorProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* ─── 1. Size Selection ─── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <span>Select Size:</span>
            <span className="text-[#F26522] font-semibold">
              {isCustomSelected ? 'Custom Size' : selectedVariant.size}
            </span>
          </label>

          <button
            onClick={onToggleCustom}
            className="text-xs text-[#F26522] font-semibold flex items-center gap-1 hover:underline focus-visible:outline-none"
          >
            <RulerIcon className="w-3.5 h-3.5" />
            <span>Need Custom Size?</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {variants.map((v) => {
            const isSelected = !isCustomSelected && selectedVariant.size === v.size;
            return (
              <button
                key={v.id}
                onClick={() => {
                  if (isCustomSelected) onToggleCustom();
                  onSelectVariant(v);
                }}
                className={cn(
                  'relative p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]',
                  isSelected
                    ? 'border-[#F26522] bg-orange-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#F26522] text-white flex items-center justify-center">
                    <CheckIcon className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div>
                  <div className="font-bold text-gray-900 text-sm">{v.size}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {v.dimensions || SIZE_DESCRIPTIONS[v.size || ''] || ''}
                  </div>
                </div>
                <div className="mt-2 text-sm font-extrabold text-gray-900">
                  ₹{v.price.toLocaleString()}
                </div>
              </button>
            );
          })}

          {/* Custom Size Button */}
          <button
            onClick={onToggleCustom}
            className={cn(
              'relative p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]',
              isCustomSelected
                ? 'border-[#F26522] bg-orange-50/50 shadow-xs'
                : 'border-dashed border-gray-300 hover:border-[#F26522] bg-gray-50/50'
            )}
          >
            {isCustomSelected && (
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#F26522] text-white flex items-center justify-center">
                <CheckIcon className="w-3 h-3 stroke-[3]" />
              </div>
            )}
            <div>
              <div className="font-bold text-gray-900 text-sm flex items-center gap-1">
                <span>Custom Size</span>
                <span className="text-[10px] bg-orange-100 text-[#F26522] px-1.5 py-0.5 rounded font-bold">
                  NEW
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Enter L x W in inches</div>
            </div>
            <div className="mt-2 text-xs font-bold text-[#F26522]">Calculate Price →</div>
          </button>
        </div>
      </div>

      {/* ─── 2. Thickness Selection ─── */}
      {availableThicknesses.length > 0 && (
        <div>
          <label className="text-sm font-bold text-gray-900 block mb-2.5">
            Select Thickness:{' '}
            <span className="text-[#F26522] font-semibold">{selectedThickness}</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {availableThicknesses.map((th) => {
              const isSelected = selectedThickness === th;
              return (
                <button
                  key={th}
                  onClick={() => onSelectThickness?.(th)}
                  className={cn(
                    'px-4 py-2 text-xs md:text-sm font-semibold rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]',
                    isSelected
                      ? 'border-[#F26522] bg-[#F26522] text-white shadow-xs'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                  )}
                >
                  {th}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default VariantSelector;
