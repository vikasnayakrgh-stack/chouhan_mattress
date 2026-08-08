/**
 * Chouhan Mattress - Category Specific PLP Page (/category/[slug])
 * Renders pre-filtered products for a category (mattresses, sofas, beds, etc.)
 */

'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

function CategoryPageContent() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  // Get category info from categoriesData
  const categoryMeta = (categoriesData as Record<string, any>)[slug] || {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: `Browse our premium collection of ${slug}.`,
  };

  const DEFAULT_FILTER_STATE: FilterState = useMemo(() => ({
    category: [slug],
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
  }), [slug]);

  // ─── State ───
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [sortOption, setSortOption] = useState<SortOption>('bestselling');
  const [layout, setLayout] = useState<ViewLayout>('grid-4');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [currentSlug, setCurrentSlug] = useState<string>(slug);

  // Synchronous State Reset on Route Slug Change (React 19 / Next.js 15 instant navigation pattern)
  if (currentSlug !== slug) {
    setCurrentSlug(slug);
    setFilterState({
      category: [slug],
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
    });
    setCurrentPage(1);
  }

  const itemsPerPage = 8;

  // Facets
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
      if (p.category === slug && p.subcategory) {
        counts[p.subcategory] = (counts[p.subcategory] || 0) + 1;
      }
    });
    return Object.keys(counts).map((sub) => ({
      label: sub.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      value: sub,
      count: counts[sub],
    }));
  }, [slug]);

  const availableSizes: FilterOption[] = useMemo(() => {
    const set = new Set<string>();
    productsData.forEach((p) => {
      if (p.category === slug) {
        p.variants?.forEach((v: any) => {
          if (v.size) set.add(v.size);
        });
      }
    });
    return Array.from(set).map((sz) => ({ label: sz, value: sz }));
  }, [slug]);

  const availableThicknesses: FilterOption[] = useMemo(() => {
    const set = new Set<string>();
    productsData.forEach((p) => {
      if (p.category === slug) {
        p.thickness?.forEach((t: string) => set.add(t));
      }
    });
    return Array.from(set).map((th) => ({ label: th, value: th }));
  }, [slug]);

  const availableFirmnesses: FilterOption[] = useMemo(() => {
    const set = new Set<string>();
    productsData.forEach((p) => {
      if (p.category === slug && p.firmness) {
        set.add(p.firmness);
      }
    });
    return Array.from(set).map((f) => ({ label: f, value: f }));
  }, [slug]);

  const availableMaterials: FilterOption[] = useMemo(() => {
    const set = new Set<string>();
    productsData.forEach((p) => {
      if (p.category === slug && p.material) {
        set.add(p.material);
      }
    });
    return Array.from(set).map((m) => ({ label: m, value: m }));
  }, [slug]);

  // Filtering
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

      // Price range
      if (
        p.price < filterState.priceRange[0] ||
        p.price > filterState.priceRange[1]
      ) {
        return false;
      }

      // Size
      if (filterState.size.length > 0) {
        const hasSize = p.variants?.some((v: any) =>
          filterState.size.includes(v.size)
        );
        if (!hasSize) return false;
      }

      // Thickness
      if (filterState.thickness.length > 0) {
        const hasThickness = p.thickness?.some((t: string) =>
          filterState.thickness.includes(t)
        );
        if (!hasThickness) return false;
      }

      // Firmness
      if (
        filterState.firmness.length > 0 &&
        (!p.firmness || !filterState.firmness.includes(p.firmness))
      ) {
        return false;
      }

      // Material
      if (
        filterState.material.length > 0 &&
        (!p.material || !filterState.material.includes(p.material))
      ) {
        return false;
      }

      // Discount
      if (filterState.minDiscount > 0 && p.discount < filterState.minDiscount) {
        return false;
      }

      // Rating
      if (filterState.minRating > 0 && p.rating < filterState.minRating) {
        return false;
      }

      // In Stock
      if (filterState.inStockOnly && !p.inStock) {
        return false;
      }

      return true;
    });
  }, [filterState]);

  // Sorting
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
    (filterState.category.length > 1 ? filterState.category.length - 1 : 0) +
    filterState.subcategory.length +
    filterState.size.length +
    filterState.thickness.length +
    filterState.firmness.length +
    filterState.material.length +
    (filterState.minDiscount > 0 ? 1 : 0) +
    (filterState.minRating > 0 ? 1 : 0) +
    (filterState.inStockOnly ? 1 : 0);

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

      <main id="main-content" className="flex-1 pb-20">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs
            items={[
              { label: 'Products', href: '/products' },
              { label: categoryMeta.name, isCurrent: true },
            ]}
          />

          <PLPHeader
            title={categoryMeta.name}
            description={categoryMeta.description}
            totalProducts={sortedProducts.length}
            currentSort={sortOption}
            onSortChange={setSortOption}
            currentLayout={layout}
            onLayoutChange={setLayout}
            onOpenMobileFilters={() => setMobileFilterOpen(true)}
            activeFilterCount={activeCount}
          />

          <FilterChips
            filterState={filterState}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={() => handleFilterChange(DEFAULT_FILTER_STATE)}
          />

          <div className="flex gap-8 items-start">
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
                    data-testid="category-product-grid"
                  />

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
                <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 rounded-full bg-orange-100 text-[#F26522] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    🔍
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No matching products in {categoryMeta.name}
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                    Try adjusting your filters or price range.
                  </p>
                  <button
                    onClick={() => handleFilterChange(DEFAULT_FILTER_STATE)}
                    className="px-6 py-2.5 bg-[#F26522] text-white font-semibold text-sm rounded-xl hover:bg-[#d85519] transition-colors"
                  >
                    Reset Filters
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

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading Category...</div>}>
      <CategoryPageContent />
    </Suspense>
  );
}
