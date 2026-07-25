/**
 * Chouhan Mattress - PLP (Product Listing Page) Types
 */

import { Product } from '@/types';

export type SortOption =
  | 'bestselling'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'discount-desc'
  | 'newest';

export type ViewLayout = 'grid-3' | 'grid-4' | 'list';

export interface FilterState {
  category: string[];
  subcategory: string[];
  priceRange: [number, number]; // [min, max]
  size: string[];
  thickness: string[];
  firmness: string[];
  material: string[];
  minDiscount: number; // 0, 10, 30, 50 etc.
  inStockOnly: boolean;
  minRating: number; // 0, 3, 4, 4.5
  searchQuery: string;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  id: keyof FilterState;
  title: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio' | 'range' | 'rating';
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface PLPHeaderProps {
  title: string;
  description?: string;
  totalProducts: number;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  currentLayout: ViewLayout;
  onLayoutChange: (layout: ViewLayout) => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

export interface FilterSidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  onResetFilters: () => void;
  availableCategories: FilterOption[];
  availableSubcategories: FilterOption[];
  priceBounds: [number, number];
  availableSizes: FilterOption[];
  availableThicknesses: FilterOption[];
  availableFirmnesses: FilterOption[];
  availableMaterials: FilterOption[];
}

export interface FilterChipsProps {
  filterState: FilterState;
  onRemoveFilter: (key: keyof FilterState, value?: string | number | boolean) => void;
  onClearAll: () => void;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}
