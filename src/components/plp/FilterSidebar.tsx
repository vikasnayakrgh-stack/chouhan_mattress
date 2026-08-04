/**
 * Chouhan Mattress - Multi-facet Filter Sidebar Component
 * Desktop sticky sidebar & mobile slide-over filter drawer
 */

'use client';

import React, { useState } from 'react';
import {
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RotateCcwIcon,
  CheckIcon,
  StarIcon,
} from 'lucide-react';
import { FilterSidebarProps, FilterState } from '@/types/plp';
import { cn } from '@/lib/utils';

interface AccordionSectionProps {
  title: string;
  count?: number;
  isOpenDefault?: boolean;
  children: React.ReactNode;
}

function AccordionSection({
  title,
  count = 0,
  isOpenDefault = true,
  children,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="border-b border-slate-100 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left font-semibold text-sm text-slate-900 hover:text-amber-600 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {title}
          {count > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

export function FilterSidebar({
  isOpenMobile,
  onCloseMobile,
  filterState,
  onFilterChange,
  onResetFilters,
  availableCategories,
  availableSubcategories,
  priceBounds,
  availableSizes,
  availableThicknesses,
  availableFirmnesses,
  availableMaterials,
}: FilterSidebarProps) {
  const toggleArrayItem = (key: keyof FilterState, value: string) => {
    const currentList = (filterState[key] as string[]) || [];
    const isSelected = currentList.includes(value);
    const updatedList = isSelected
      ? currentList.filter((item) => item !== value)
      : [...currentList, value];

    onFilterChange({ ...filterState, [key]: updatedList });
  };

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({ ...filterState, priceRange: [min, max] });
  };

  const activeCount =
    filterState.category.length +
    filterState.subcategory.length +
    filterState.size.length +
    filterState.thickness.length +
    filterState.firmness.length +
    filterState.material.length +
    (filterState.minDiscount > 0 ? 1 : 0) +
    (filterState.minRating > 0 ? 1 : 0) +
    (filterState.inStockOnly ? 1 : 0);

  const sidebarContent = (
    <div className="divide-y divide-slate-100">
      {/* Sidebar Header */}
      <div className="pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg text-slate-900">Filter By</h2>
          {activeCount > 0 && (
            <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onResetFilters}
            className="text-xs text-amber-600 font-semibold hover:underline flex items-center gap-1"
          >
            <RotateCcwIcon className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      {/* ─── 1. Category Facet ─── */}
      {availableCategories.length > 0 && (
        <AccordionSection
          title="Category"
          count={filterState.category.length}
          isOpenDefault
        >
          {availableCategories.map((cat) => {
            const isChecked = filterState.category.includes(cat.value);
            return (
              <label
                key={cat.value}
                className="flex items-center justify-between text-sm text-slate-700 hover:text-slate-900 cursor-pointer group py-1"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                      isChecked
                        ? 'bg-amber-500 border-amber-500 text-slate-950'
                        : 'border-slate-300 group-hover:border-slate-400 bg-white'
                    )}
                  >
                    {isChecked && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={cn(isChecked && 'font-semibold text-amber-700')}>
                    {cat.label}
                  </span>
                </div>
                {cat.count !== undefined && (
                  <span className="text-xs text-slate-400">({cat.count})</span>
                )}
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayItem('category', cat.value)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </AccordionSection>
      )}

      {/* ─── 2. Subcategory Facet ─── */}
      {availableSubcategories.length > 0 && (
        <AccordionSection
          title="Subcategory"
          count={filterState.subcategory.length}
          isOpenDefault
        >
          {availableSubcategories.map((sub) => {
            const isChecked = filterState.subcategory.includes(sub.value);
            return (
              <label
                key={sub.value}
                className="flex items-center justify-between text-sm text-slate-700 hover:text-slate-900 cursor-pointer group py-1"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                      isChecked
                        ? 'bg-amber-500 border-amber-500 text-slate-950'
                        : 'border-slate-300 group-hover:border-slate-400 bg-white'
                    )}
                  >
                    {isChecked && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={cn(isChecked && 'font-semibold text-amber-700')}>
                    {sub.label}
                  </span>
                </div>
                {sub.count !== undefined && (
                  <span className="text-xs text-slate-400">({sub.count})</span>
                )}
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayItem('subcategory', sub.value)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </AccordionSection>
      )}

      {/* ─── 3. Price Range Slider ─── */}
      <AccordionSection title="Price Range" isOpenDefault>
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs text-slate-400 block">Min Price</span>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  value={filterState.priceRange[0]}
                  onChange={(e) =>
                    handlePriceChange(
                      Number(e.target.value),
                      filterState.priceRange[1]
                    )
                  }
                  className="w-24 pl-6 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
            <span className="text-slate-300 font-bold self-end pb-1.5">-</span>
            <div>
              <span className="text-xs text-slate-400 block">Max Price</span>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  value={filterState.priceRange[1]}
                  onChange={(e) =>
                    handlePriceChange(
                      filterState.priceRange[0],
                      Number(e.target.value)
                    )
                  }
                  className="w-24 pl-6 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <input
            type="range"
            min={priceBounds[0]}
            max={priceBounds[1]}
            step={500}
            value={filterState.priceRange[1]}
            onChange={(e) =>
              handlePriceChange(filterState.priceRange[0], Number(e.target.value))
            }
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </AccordionSection>

      {/* ─── 4. Size Filter ─── */}
      {availableSizes.length > 0 && (
        <AccordionSection title="Size" count={filterState.size.length} isOpenDefault>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {availableSizes.map((sz) => {
              const isChecked = filterState.size.includes(sz.value);
              return (
                <button
                  key={sz.value}
                  onClick={() => toggleArrayItem('size', sz.value)}
                  className={cn(
                    'px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all',
                    isChecked
                      ? 'bg-amber-50 border-amber-500 text-amber-700 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                  )}
                >
                  {sz.label}
                </button>
              );
            })}
          </div>
        </AccordionSection>
      )}

      {/* ─── 5. Thickness Filter ─── */}
      {availableThicknesses.length > 0 && (
        <AccordionSection
          title="Thickness"
          count={filterState.thickness.length}
          isOpenDefault
        >
          <div className="flex flex-wrap gap-2 pt-1">
            {availableThicknesses.map((th) => {
              const isChecked = filterState.thickness.includes(th.value);
              return (
                <button
                  key={th.value}
                  onClick={() => toggleArrayItem('thickness', th.value)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-xl border transition-all',
                    isChecked
                      ? 'bg-amber-50 border-amber-500 text-amber-700 font-semibold'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                  )}
                >
                  {th.label}
                </button>
              );
            })}
          </div>
        </AccordionSection>
      )}

      {/* ─── 6. Firmness Scale ─── */}
      {availableFirmnesses.length > 0 && (
        <AccordionSection
          title="Firmness"
          count={filterState.firmness.length}
          isOpenDefault
        >
          {availableFirmnesses.map((firm) => {
            const isChecked = filterState.firmness.includes(firm.value);
            return (
              <label
                key={firm.value}
                className="flex items-center justify-between text-sm text-slate-700 hover:text-slate-900 cursor-pointer py-1"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleArrayItem('firmness', firm.value)}
                    className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <span className={cn(isChecked && 'font-semibold text-amber-700')}>
                    {firm.label}
                  </span>
                </div>
              </label>
            );
          })}
        </AccordionSection>
      )}

      {/* ─── 7. Material ─── */}
      {availableMaterials.length > 0 && (
        <AccordionSection
          title="Material"
          count={filterState.material.length}
          isOpenDefault
        >
          {availableMaterials.map((mat) => {
            const isChecked = filterState.material.includes(mat.value);
            return (
              <label
                key={mat.value}
                className="flex items-center justify-between text-sm text-slate-700 hover:text-slate-900 cursor-pointer py-1"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleArrayItem('material', mat.value)}
                    className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <span className={cn(isChecked && 'font-semibold text-amber-700')}>
                    {mat.label}
                  </span>
                </div>
              </label>
            );
          })}
        </AccordionSection>
      )}

      {/* ─── 8. Min Discount ─── */}
      <AccordionSection title="Discount" isOpenDefault={false}>
        <div className="space-y-2 pt-1">
          {[0, 10, 30, 50].map((disc) => (
            <label
              key={disc}
              className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
            >
              <input
                type="radio"
                name="discount-filter"
                checked={filterState.minDiscount === disc}
                onChange={() => onFilterChange({ ...filterState, minDiscount: disc })}
                className="text-amber-500 focus:ring-amber-500"
              />
              <span>{disc === 0 ? 'All Discounts' : `${disc}% OFF or more`}</span>
            </label>
          ))}
        </div>
      </AccordionSection>

      {/* ─── 9. Minimum Rating ─── */}
      <AccordionSection title="Customer Rating" isOpenDefault={false}>
        <div className="space-y-2 pt-1">
          {[0, 4, 4.5].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
            >
              <input
                type="radio"
                name="rating-filter"
                checked={filterState.minRating === rating}
                onChange={() => onFilterChange({ ...filterState, minRating: rating })}
                className="text-amber-500 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1">
                {rating === 0 ? (
                  'All Ratings'
                ) : (
                  <>
                    <StarIcon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{rating}★ & above</span>
                  </>
                )}
              </span>
            </label>
          ))}
        </div>
      </AccordionSection>

      {/* ─── 10. Availability ─── */}
      <div className="py-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-semibold text-slate-900">In Stock Only</span>
          <input
            type="checkbox"
            checked={filterState.inStockOnly}
            onChange={(e) =>
              onFilterChange({ ...filterState, inStockOnly: e.target.checked })
            }
            className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
          />
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0 pr-6">
        <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl flex flex-col z-50">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <h2 className="font-bold text-lg">Filters</h2>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
                aria-label="Close filters"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5">{sidebarContent}</div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button
                onClick={onResetFilters}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-100"
              >
                Clear All
              </button>
              <button
                onClick={onCloseMobile}
                className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-bold text-sm rounded-xl hover:bg-amber-600"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FilterSidebar;

