/**
 * Chouhan Mattress - Product Listing Page (PLP)
 * Full product catalog with multi-facet filters, sorting, search param sync, and grid switching
 */

'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { ProductGrid } from '@/components/library/ProductGrid';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Breadcrumbs } from '@/components/plp/Breadcrumbs';
import { PLPHeader } from '@/components/plp/PLPHeader';
import { FilterChips } from '@/components/plp/FilterChips';
import { FilterSidebar } from '@/components/plp/FilterSidebar';
import { Pagination } from '@/components/plp/Pagination';

import { FilterState, SortOption, ViewLayout, FilterOption } from '@/types/plp';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import footerData from '@/data/footer.json';
import navigationData from '@/data/navigation.json';

const NAV_ITEMS = navigationData.primary.map((item) => ({
  label: item.label,
  href: item.href,
  children: [] as { label: string; href: string }[],
}));

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

const DEFAULT_FILTER_STATE: FilterState = {
  category: [],
  subcategory: [],
  priceRange: [0, 100000],
  size: [],
  thickness: [],
  firmness: [],
  material: [],
  minDiscount: 0,
  inStockOnly: false,
  minRating: 0,
  searchQuery: '',
};

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ─── State ───
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [sortOption, setSortOption] = useState<SortOption>('bestselling');
  const [layout, setLayout] = useState<ViewLayout>('grid-4');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const itemsPerPage = 8;

  // ─── Synchronize initial URL SearchParams ───
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const sizeParam = searchParams.get('size');
    const sortParam = searchParams.get('sort') as SortOption;

    setFilterState({
      ...DEFAULT_FILTER_STATE,
      category: categoryParam ? categoryParam.split(',') : [],
      subcategory: subcategoryParam ? subcategoryParam.split(',') : [],
      priceRange: [
        minPriceParam ? Number(minPriceParam) : 0,
        maxPriceParam ? Number(maxPriceParam) : 100000,
      ],
      size: sizeParam ? sizeParam.split(',') : [],
    });

    if (sortParam) setSortOption(sortParam);
  }, [searchParams]);

  // ─── Compute Available Facets from Products Data ───
  const availableCategories: FilterOption[] = useMemo(() => {
    const counts: Record<string, number> = {};
    productsData.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.keys(counts).map((cat) => ({
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: cat,
      count: counts[cat],
    }));
  }, []);

  const availableSubcategories: FilterOption[] = useMemo(() => {
    const counts: Record<string, number> = {};
    productsData.forEach((p) => {
      if (p.subcategory) {
        counts[p.subcategory] = (counts[p.subcategory] || 0) + 1;
      }
    });
    return Object.keys(counts).map((sub) => ({
      label: sub.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      value: sub,
      count: counts[sub],
    }));
  }, []);

  const availableSizes: FilterOption[] = useMemo(() => {
    const set = new Set<string>();
    productsData.forEach((p) => {
      p.variants?.forEach((v: any) => {
        if (v.size) set.add(v.size);
      });
    });
    return Array.from(set).map((sz) => ({ label: sz, value: sz }));
  }, []);

  const availableThicknesses: FilterOption[] = useMemo(() => {
    const set = new Set<string>();
    productsData.forEach((p) => {
      p.thickness?.forEach((t: string) => set.add(t));
    });
    return Array.from(set).map((th) => ({ label: th, value: th }));
  }, []);

  const availableFirmnesses: FilterOption[] = useMemo(() => {
    const set = new Set<string>();
    productsData.forEach((p) => {
      if (p.firmness) set.add(p.firmness);
    });
    return Array.from(set).map((f) => ({ label: f, value: f }));
  }, []);

  const availableMaterials: FilterOption[] = useMemo(() => {
    const set = new Set<string>();
    productsData.forEach((p) => {
      if (p.material) set.add(p.material);
    });
    return Array.from(set).map((m) => ({ label: m, value: m }));
  }, []);

  // ─── Filter & Sort Logic ───
  const filteredProducts = useMemo(() => {
    return productsData.filter((p) => {
      // Category filter
      if (
        filterState.category.length > 0 &&
        !filterState.category.includes(p.category)
      ) {
        return false;
      }

      // Subcategory filter
      if (
        filterState.subcategory.length > 0 &&
        (!p.subcategory || !filterState.subcategory.includes(p.subcategory))
      ) {
        return false;
      }

      // Price range filter
      if (
        p.price < filterState.priceRange[0] ||
        p.price > filterState.priceRange[1]
      ) {
        return false;
      }

      // Size filter
      if (filterState.size.length > 0) {
        const hasSize = p.variants?.some((v: any) =>
          filterState.size.includes(v.size)
        );
        if (!hasSize) return false;
      }

      // Thickness filter
      if (filterState.thickness.length > 0) {
        const hasThickness = p.thickness?.some((t: string) =>
          filterState.thickness.includes(t)
        );
        if (!hasThickness) return false;
      }

      // Firmness filter
      if (
        filterState.firmness.length > 0 &&
        (!p.firmness || !filterState.firmness.includes(p.firmness))
      ) {
        return false;
      }

      // Material filter
      if (
        filterState.material.length > 0 &&
        (!p.material || !filterState.material.includes(p.material))
      ) {
        return false;
      }

      // Discount filter
      if (filterState.minDiscount > 0 && p.discount < filterState.minDiscount) {
        return false;
      }

      // Rating filter
      if (filterState.minRating > 0 && p.rating < filterState.minRating) {
        return false;
      }

      // In stock filter
      if (filterState.inStockOnly && !p.inStock) {
        return false;
      }

      return true;
    });
  }, [filterState]);

  const sortedProducts = useMemo(() => {
    const productsCopy = [...filteredProducts];

    switch (sortOption) {
      case 'price-asc':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return productsCopy.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return productsCopy.sort((a, b) => b.rating - a.rating);
      case 'discount-desc':
        return productsCopy.sort((a, b) => b.discount - a.discount);
      case 'newest':
        return productsCopy.sort((a, b) => Number(b.id) - Number(a.id));
      case 'bestselling':
      default:
        return productsCopy.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [filteredProducts, sortOption]);

  // ─── Pagination ───
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilterState(newFilters);
    setCurrentPage(1);
  };

  const handleRemoveFilter = (
    key: keyof FilterState,
    value?: string | number | boolean
  ) => {
    if (key === 'priceRange') {
      handleFilterChange({ ...filterState, priceRange: [0, 100000] });
    } else if (key === 'minDiscount' || key === 'minRating') {
      handleFilterChange({ ...filterState, [key]: 0 });
    } else if (key === 'inStockOnly') {
      handleFilterChange({ ...filterState, inStockOnly: false });
    } else if (Array.isArray(filterState[key]) && typeof value === 'string') {
      const list = filterState[key] as string[];
      handleFilterChange({
        ...filterState,
        [key]: list.filter((item) => item !== value),
      });
    }
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

  // Mapped products for ProductGrid component
  const gridProducts = paginatedProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    primaryImage: p.thumbnail || p.images[0],
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    discount: p.discount,
    rating: p.rating,
    reviewCount: p.reviewCount,
    thumbnail: p.thumbnail,
    images: p.images,
    href: `/product/${p.id}`,
    badges: p.badges?.map((b: string) => ({
      text: b,
      variant: b.includes('%') ? ('warning' as const) : ('primary' as const),
    })),
    inStock: p.inStock,
    category: p.category,
    delivery: p.delivery,
  }));

  const gridColumns = layout === 'grid-3' ? 3 : layout === 'grid-4' ? 4 : 1;
  const gridVariant = layout === 'list' ? 'list' : 'grid';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CartDrawer />
      <SearchModal />

      <Header
        brandName="Chouhan Mattress"
        brandLink="/"
        navItems={NAV_ITEMS}
        showCart
        showSearch
        showAccount
        showWishlist
        data-testid="main-header"
      />

      <main id="main-content" className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'All Products', isCurrent: true },
            ]}
          />

          {/* PLP Header */}
          <PLPHeader
            title="All Products Catalog"
            description="Discover Chouhan Mattress's collection of handcrafted mattresses, wooden beds, ergonomic sofas, and sleep accessories."
            totalProducts={sortedProducts.length}
            currentSort={sortOption}
            onSortChange={setSortOption}
            currentLayout={layout}
            onLayoutChange={setLayout}
            onOpenMobileFilters={() => setMobileFilterOpen(true)}
            activeFilterCount={activeCount}
          />

          {/* Active Filter Chips */}
          <FilterChips
            filterState={filterState}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={() => handleFilterChange(DEFAULT_FILTER_STATE)}
          />

          {/* Main Layout Grid */}
          <div className="flex gap-8 items-start">
            {/* Desktop Filter Sidebar */}
            <FilterSidebar
              isOpenMobile={mobileFilterOpen}
              onCloseMobile={() => setMobileFilterOpen(false)}
              filterState={filterState}
              onFilterChange={handleFilterChange}
              onResetFilters={() => handleFilterChange(DEFAULT_FILTER_STATE)}
              availableCategories={availableCategories}
              availableSubcategories={availableSubcategories}
              priceBounds={[0, 100000]}
              availableSizes={availableSizes}
              availableThicknesses={availableThicknesses}
              availableFirmnesses={availableFirmnesses}
              availableMaterials={availableMaterials}
            />

            {/* Product Listing Grid Area */}
            <div className="flex-1 min-w-0">
              {gridProducts.length > 0 ? (
                <>
                  <ProductGrid
                    products={gridProducts}
                    columns={gridColumns}
                    gap="md"
                    variant={gridVariant}
                    showActions={true}
                    showBadges={true}
                    showRating={true}
                    data-testid="plp-product-grid"
                  />

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    totalItems={sortedProducts.length}
                    itemsPerPage={itemsPerPage}
                  />
                </>
              ) : (
                /* Empty Filter Result State */
                <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 rounded-full bg-orange-100 text-[#F26522] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    🔍
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No matching products found
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                    Try adjusting your filters or price range to find what you are looking for.
                  </p>
                  <button
                    onClick={() => handleFilterChange(DEFAULT_FILTER_STATE)}
                    className="px-6 py-2.5 bg-[#F26522] text-white font-semibold text-sm rounded-xl hover:bg-[#d85519] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer
        brandName="Chouhan Mattress"
        brandDescription={footerData.company.description}
        navSections={FOOTER_NAV_SECTIONS}
        socialLinks={footerData.social.map((s) => ({
          platform: s.platform,
          href: s.href,
          label: s.platform,
          icon: <span className="sr-only">{s.platform}</span>,
        }))}
        newsletter={{
          placeholder: 'Enter your email',
          buttonText: 'Subscribe',
        }}
        contactInfo={{
          phone: footerData.company.phone,
          email: footerData.company.email,
          address: footerData.company.address,
          hours: footerData.company.hours,
        }}
        legalLinks={footerData.links.policies}
        showCopyright
        copyrightText={`© ${new Date().getFullYear()} Chouhan Mattress Private Limited. CIN: ${footerData.company.cin}`}
        data-testid="main-footer"
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading Products Catalog...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
