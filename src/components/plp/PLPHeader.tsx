/**
 * Chouhan Mattress - PLP Header Component
 * Handles title, description, count, sort options, layout toggle, & mobile filter trigger
 */

'use client';

import React from 'react';
import {
  SlidersHorizontalIcon,
  Grid3X3Icon,
  LayoutGridIcon,
  ListIcon,
  ChevronDownIcon,
} from 'lucide-react';
import { PLPHeaderProps, SortOption, ViewLayout } from '@/types/plp';
import { cn } from '@/lib/utils';

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Popularity & Bestselling', value: 'bestselling' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Customer Rating', value: 'rating-desc' },
  { label: 'Highest Discount', value: 'discount-desc' },
  { label: 'Newest Arrivals', value: 'newest' },
];

export function PLPHeader({
  title,
  description,
  totalProducts,
  currentSort,
  onSortChange,
  currentLayout,
  onLayoutChange,
  onOpenMobileFilters,
  activeFilterCount,
}: PLPHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100 pb-6 mb-6">
      {/* Category Header Title */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize flex items-center gap-3">
          {title}
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'}
          </span>
        </h1>
        {description && <p className="text-sm text-gray-500 mt-1 max-w-3xl">{description}</p>}
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
        {/* Mobile Filter Button */}
        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors focus-visible:ring-2 focus-visible:ring-[#F26522]"
          aria-label="Open filter sidebar"
        >
          <SlidersHorizontalIcon className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#F26522] text-white text-xs flex items-center justify-center font-bold ml-1">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Total Count (Desktop) */}
        <div className="hidden lg:block text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{totalProducts}</span> results
        </div>

        {/* Right Controls: Sort & Layout */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="plp-sort-select" className="text-xs md:text-sm font-medium text-gray-600 hidden sm:inline">
              Sort By:
            </label>
            <div className="relative">
              <select
                id="plp-sort-select"
                value={currentSort}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-xs md:text-sm font-medium rounded-xl pl-3 pr-8 py-2 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F26522] focus:bg-white cursor-pointer transition-all"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Layout Switcher (Desktop) */}
          <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-xl gap-1 border border-gray-200" aria-label="Layout view switcher">
            <button
              onClick={() => onLayoutChange('grid-3')}
              className={cn(
                'p-1.5 rounded-lg text-gray-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F26522]',
                currentLayout === 'grid-3' && 'bg-white text-[#F26522] shadow-sm font-bold'
              )}
              title="3 Column Grid"
              aria-label="3 Column Grid"
            >
              <Grid3X3Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onLayoutChange('grid-4')}
              className={cn(
                'p-1.5 rounded-lg text-gray-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F26522]',
                currentLayout === 'grid-4' && 'bg-white text-[#F26522] shadow-sm font-bold'
              )}
              title="4 Column Grid"
              aria-label="4 Column Grid"
            >
              <LayoutGridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onLayoutChange('list')}
              className={cn(
                'p-1.5 rounded-lg text-gray-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F26522]',
                currentLayout === 'list' && 'bg-white text-[#F26522] shadow-sm font-bold'
              )}
              title="List View"
              aria-label="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PLPHeader;
