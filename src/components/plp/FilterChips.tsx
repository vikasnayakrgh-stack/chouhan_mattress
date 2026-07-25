/**
 * Chouhan Mattress - Active Filter Chips Component
 * Displays selected active filters with quick removal badges
 */

'use client';

import React from 'react';
import { XIcon, RotateCcwIcon } from 'lucide-react';
import { FilterChipsProps, FilterState } from '@/types/plp';
import { cn } from '@/lib/utils';

export function FilterChips({
  filterState,
  onRemoveFilter,
  onClearAll,
  className,
}: FilterChipsProps) {
  const chips: { key: keyof FilterState; label: string; value?: string | number | boolean }[] = [];

  // Category chips
  filterState.category.forEach((cat) => {
    chips.push({ key: 'category', label: `Category: ${cat}`, value: cat });
  });

  // Subcategory chips
  filterState.subcategory.forEach((sub) => {
    chips.push({ key: 'subcategory', label: `Subcategory: ${sub}`, value: sub });
  });

  // Size chips
  filterState.size.forEach((sz) => {
    chips.push({ key: 'size', label: `Size: ${sz}`, value: sz });
  });

  // Thickness chips
  filterState.thickness.forEach((th) => {
    chips.push({ key: 'thickness', label: `Thickness: ${th}`, value: th });
  });

  // Firmness chips
  filterState.firmness.forEach((f) => {
    chips.push({ key: 'firmness', label: `Firmness: ${f}`, value: f });
  });

  // Material chips
  filterState.material.forEach((m) => {
    chips.push({ key: 'material', label: `Material: ${m}`, value: m });
  });

  // Min Discount chip
  if (filterState.minDiscount > 0) {
    chips.push({ key: 'minDiscount', label: `${filterState.minDiscount}%+ OFF`, value: filterState.minDiscount });
  }

  // Min Rating chip
  if (filterState.minRating > 0) {
    chips.push({ key: 'minRating', label: `★ ${filterState.minRating} & above`, value: filterState.minRating });
  }

  // In Stock Only chip
  if (filterState.inStockOnly) {
    chips.push({ key: 'inStockOnly', label: 'In Stock Only', value: true });
  }

  // Price range chip (only if changed from default)
  if (filterState.priceRange[0] > 0 || filterState.priceRange[1] < 100000) {
    chips.push({
      key: 'priceRange',
      label: `Price: ₹${filterState.priceRange[0].toLocaleString()} - ₹${filterState.priceRange[1].toLocaleString()}`,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2 mb-6', className)}>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
        Active Filters:
      </span>

      {chips.map((chip, index) => (
        <span
          key={`${chip.key}-${chip.label}-${index}`}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-[#F26522] border border-orange-200 text-xs font-medium rounded-full shadow-xs"
        >
          {chip.label}
          <button
            onClick={() => onRemoveFilter(chip.key, chip.value)}
            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#F26522] hover:text-white transition-colors focus-visible:outline-none"
            aria-label={`Remove ${chip.label} filter`}
          >
            <XIcon className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 font-semibold px-2 py-1 transition-colors underline underline-offset-2 ml-1"
      >
        <RotateCcwIcon className="w-3 h-3" />
        Clear All
      </button>
    </div>
  );
}

export default FilterChips;
