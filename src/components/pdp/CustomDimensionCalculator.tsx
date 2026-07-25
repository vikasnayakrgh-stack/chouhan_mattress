/**
 * Chouhan Mattress - Custom Mattress Dimension Calculator Component
 * Allows customers to input custom length x width in inches with dynamic pricing formula
 */

'use client';

import React, { useState } from 'react';
import { RulerIcon, CheckIcon, InfoIcon } from 'lucide-react';
import { CustomDimension } from '@/types/pdp';
import { cn } from '@/lib/utils';

interface CustomDimensionCalculatorProps {
  basePrice?: number;
  onApplyCustomSize: (dimension: CustomDimension, calculatedPrice: number) => void;
  onClose?: () => void;
  className?: string;
}

// Formula: Price = (Length * Width * ThicknessFactor * RateMultiplier)
const DENSITY_RATE = 1.45; // rate per sq inch

const THICKNESS_FACTORS: Record<number, number> = {
  6: 1.0,
  8: 1.25,
  10: 1.5,
};

export function CustomDimensionCalculator({
  basePrice = 5000,
  onApplyCustomSize,
  onClose,
  className,
}: CustomDimensionCalculatorProps) {
  const [length, setLength] = useState<number>(72);
  const [width, setWidth] = useState<number>(60);
  const [thickness, setThickness] = useState<number>(8);

  // Dynamic Price Calculation
  const calculatedPrice = Math.round(
    (length * width * (THICKNESS_FACTORS[thickness] || 1.2) * DENSITY_RATE) + 1200
  );
  const calculatedOriginalPrice = Math.round(calculatedPrice * 1.8);

  const handleApply = () => {
    onApplyCustomSize(
      { lengthInches: length, widthInches: width, thickness },
      calculatedPrice
    );
  };

  return (
    <div
      className={cn(
        'p-5 bg-gradient-to-br from-orange-50/60 to-amber-50/40 rounded-2xl border-2 border-orange-200 shadow-sm space-y-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F26522] text-white flex items-center justify-center">
            <RulerIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Custom Size Calculator</h3>
            <p className="text-xs text-gray-500">Get a mattress handcrafted to your exact bed frame dimensions</p>
          </div>
        </div>
      </div>

      {/* ─── Dimension Inputs Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Length Input */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Length (Inches): <span className="text-[#F26522]">{length}"</span>
          </label>
          <input
            type="number"
            min={60}
            max={90}
            value={length}
            onChange={(e) => setLength(Math.max(60, Math.min(90, Number(e.target.value))))}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
          />
          <input
            type="range"
            min={60}
            max={90}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full mt-2 accent-[#F26522] cursor-pointer"
          />
        </div>

        {/* Width Input */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Width (Inches): <span className="text-[#F26522]">{width}"</span>
          </label>
          <input
            type="number"
            min={30}
            max={84}
            value={width}
            onChange={(e) => setWidth(Math.max(30, Math.min(84, Number(e.target.value))))}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
          />
          <input
            type="range"
            min={30}
            max={84}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full mt-2 accent-[#F26522] cursor-pointer"
          />
        </div>
      </div>

      {/* Thickness selector */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Thickness:
        </label>
        <div className="flex gap-2">
          {[6, 8, 10].map((th) => (
            <button
              key={th}
              onClick={() => setThickness(th)}
              className={cn(
                'flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all',
                thickness === th
                  ? 'bg-[#F26522] text-white border-[#F26522]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              )}
            >
              {th} Inch
            </button>
          ))}
        </div>
      </div>

      {/* Calculated Result Box */}
      <div className="pt-3 border-t border-orange-200/60 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-500 block">Custom Calculated Price:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">
              ₹{calculatedPrice.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 line-through">
              ₹{calculatedOriginalPrice.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-green-700 font-semibold block mt-0.5">
            Dimensions: {length}" (L) x {width}" (W) x {thickness}" (H)
          </span>
        </div>

        <button
          onClick={handleApply}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#F26522] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#d85519] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
        >
          <CheckIcon className="w-4 h-4 stroke-[3]" />
          <span>Apply Custom Size</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 bg-white/60 p-2 rounded-lg border border-orange-100">
        <InfoIcon className="w-3.5 h-3.5 text-[#F26522] flex-shrink-0" />
        <span>Custom sized mattresses are non-returnable but covered under full 10-year warranty.</span>
      </div>
    </div>
  );
}

export default CustomDimensionCalculator;
