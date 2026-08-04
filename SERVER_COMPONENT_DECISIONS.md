# SERVER COMPONENT DECISIONS — PHASE B2

**Project:** Chouhan Mattress (Commerce Engine v1.0)  
**Status:** LOCKED  
**Date:** February 2026  
**Architect:** Next.js 15 App Router Expert  

---

## 1. Next.js 15 Server Component Strategy

To maximize performance, SEO, and initial page load speed while reducing client-side JavaScript bundle sizes:

1. **Top-Level Route Pages are Server Components by Default:**
   * Remove `'use client'` directive from top-level route files ([`src/app/page.tsx`](file:///c:/Users/Arti/wakefit-clone/src/app/page.tsx), [`src/app/products/page.tsx`](file:///c:/Users/Arti/wakefit-clone/src/app/products/page.tsx), [`src/app/product/[id]/page.tsx`](file:///c:/Users/Arti/wakefit-clone/src/app/product/[id]/page.tsx), [`src/app/admin/*`](file:///c:/Users/Arti/wakefit-clone/src/app/admin)).
   * Direct invocation of domain services (`productService.getById()`, `orderService.getAll()`) inside async Server Component pages.

2. **Client Component Extraction (Interactive Islands):**
   * Extract interactive elements (carousels, drawers, buy boxes, tab switches, dynamic custom dimension calculators) into isolated Client Components marked with `'use client'`.
   * Pass initial server-fetched data as props to Client Component islands.

3. **Dynamic Metadata Generation:**
   * Server Component routes export `generateMetadata({ params })` to fetch product names, OpenGraph images, and JSON-LD schema dynamically.

---

## 2. Page Decomposition Matrix

| Route Path | Page Component Type | Extracted Client Islands | Server Data Fetching |
|---|---|---|---|
| `/` (Homepage) | Server Component | `HeroBannerCarousel`, `SleepAssistantModal` | `cmsService.getHomepageData()` |
| `/products` (PLP) | Server Component | `FilterSidebar`, `ProductGridItem` | `catalogService.getProducts(filters)` |
| `/product/[id]` (PDP) | Server Component | `ImageGallery`, `DimensionCalculator`, `AddToCartBox` | `productService.getById(id)` |
| `/admin/dashboard` | Server Component | `DateRangePicker`, `MetricCardAnimation` | `dashboardService.getStats()` |
| `/admin/products` | Server Component | `ProductTable`, `AddProductDialog` | `productService.getAll()` |
| `/admin/orders` | Server Component | `OrderTable`, `StatusUpdateDropdown` | `orderService.getAll()` |
| `/admin/inventory` | Server Component | `StockAdjustmentModal` | `inventoryService.getAll()` |
