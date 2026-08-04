# Mock Removal & Architectural Cutover Report

**Date:** 2026-08-03  
**Auditor:** Staff Backend & PostgreSQL/Supabase Architect  
**Target Repository:** `c:\Users\Arti\wakefit-clone`  
**Status:** Audit Complete & Repository Cutover Pathway Verified  

---

## Executive Summary

This audit evaluates the presence of hardcoded mock data, static JSON fallbacks, mock repository switches, and coupon constants across the Chouhan Mattress (Wakefit Clone) codebase. 

While the application features a well-designed **Repository-Service Pattern** (supporting dual implementations for mock and Supabase), several storefront pages and API routes bypass the repository/service layer and rely directly on static JSON files (`@/data/products.json`). 

This report provides an exhaustive inventory of all mock implementations, documents the production cutover strategy via `NEXT_PUBLIC_DATA_SOURCE=supabase`, and details recent code refactoring to enforce Supabase-first operations.

---

## 1. Inventory of Mock Switches, Fallbacks & Static Data

### 1.1 Environment Flag Switches (`NEXT_PUBLIC_DATA_SOURCE === 'mock'`)

| File Path | Function / Scope | Mock Behavior | Production Path (`NEXT_PUBLIC_DATA_SOURCE=supabase`) |
|-----------|------------------|---------------|-----------------------------------------------------|
| [`src/repositories/index.ts`](file:///c:/Users/Arti/wakefit-clone/src/repositories/index.ts#L77-L124) | `getRepositories()` factory | Instantiates 16 `Mock*Repository` instances | Instantiates 16 `Supabase*Repository` instances |
| [`src/lib/auth/adminAuth.ts`](file:///c:/Users/Arti/wakefit-clone/src/lib/auth/adminAuth.ts#L25-L33) | `validateAdminSession()` | Dev bypass: returns fake `dev-user` with `owner` role | Validates JWT token against Supabase Auth (`supabase.auth.getUser(token)`) |
| [`src/middleware.ts`](file:///c:/Users/Arti/wakefit-clone/src/middleware.ts#L13-L15) | Edge Route Middleware | Dev bypass: allows access to `/admin/*` and `/api/admin/*` without auth header | Enforces JWT token verification & `app_metadata.role` RBAC check |

---

### 1.2 Static JSON Data Files & In-Memory Fallbacks

| Static File Path | Size / Records | Active Consumer Files | Cutover Requirement |
|------------------|----------------|----------------------|---------------------|
| `src/data/products.json` | 10 products with variants | `src/app/api/checkout/create-order/route.ts`<br>`src/app/products/page.tsx`<br>`src/app/product/[id]/page.tsx`<br>`src/app/category/[slug]/page.tsx`<br>`src/app/compare/page.tsx`<br>`src/app/mattress-selector/page.tsx`<br>`src/app/account/page.tsx`<br>`src/app/cart/page.tsx`<br>`src/app/wishlist/page.tsx`<br>`src/app/sitemap.ts` | Replace static imports with `productService.getAll()`, `productService.getById()`, `productService.getBySlug()`. |
| `src/data/categories.json` | 6 category objects | `src/app/products/page.tsx`<br>`src/app/category/[slug]/page.tsx`<br>`src/components/library/Header.tsx` | Replace static imports with `catalogService.getAllCategories()`. |
| `src/data/navigation.json` | Primary nav & categories | Storefront Layout & Header | Move dynamic navigation items to CMS / App Settings repo. |
| `src/data/footer.json` | Footer link lists | Storefront Footer | Keep structural UI links or seed into `app_settings` DB table. |

---

### 1.3 Mock Repository Implementations (`src/repositories/mock/`)

The system contains 16 mock repository classes backed by in-memory arrays in `src/data/admin/*.mock.ts`:

1. [`MockProductRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/productRepository.ts) — backed by `src/data/admin/products.mock.ts`
2. [`MockOrderRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/orderRepository.ts) — backed by `src/data/admin/orders.mock.ts`
3. [`MockCustomerRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/customerRepository.ts) — backed by `src/data/admin/customers.mock.ts`
4. [`MockReturnRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/returnRepository.ts) — backed by `src/data/admin/returns.mock.ts`
5. [`MockDiscountRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/discountRepository.ts) — backed by `src/data/admin/discounts.mock.ts`
6. [`MockCategoryRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/categoryRepository.ts) — backed by `src/data/admin/categories.mock.ts`
7. [`MockCollectionRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/collectionRepository.ts) — backed by `src/data/admin/collections.mock.ts`
8. [`MockInventoryRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/inventoryRepository.ts) — backed by `src/data/admin/products.mock.ts`
9. [`MockDashboardRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/dashboardRepository.ts) — backed by `src/data/admin/dashboard.mock.ts`
10. [`MockCmsRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/cmsRepository.ts) — backed by `src/data/admin/cms.mock.ts`
11. [`MockReviewRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/reviewRepository.ts) — backed by `src/data/admin/reviews.mock.ts`
12. [`MockSettingsRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/settingsRepository.ts) — backed by `src/data/admin/settings.mock.ts`
13. [`MockStaffRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/staffRepository.ts) — backed by `src/data/admin/staff.mock.ts`
14. [`MockAnalyticsRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/analyticsRepository.ts) — backed by `src/data/admin/analytics.mock.ts`
15. [`MockAuditRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/auditRepository.ts) — backed by `src/data/admin/audit.mock.ts`
16. [`MockIntegrationRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/mock/integrationRepository.ts) — backed by `src/data/admin/integrations.mock.ts`

---

### 1.4 Hardcoded Coupon Arrays & Promotion Logic

Prior to refactoring:
- [`src/app/api/checkout/create-order/route.ts`](file:///c:/Users/Arti/wakefit-clone/src/app/api/checkout/create-order/route.ts#L10) contained a hardcoded coupon map:
  ```typescript
  const VALID_COUPONS: Record<string, number> = {
    HOME: 11,     // 11% off
    FIRST500: 500 // ₹500 flat discount
  }
  ```
- Storefront components (`src/components/cart/CartDrawer.tsx`) referenced static coupon codes (`'HOME'`, `'WELCOME10'`) directly in client state.

---

## 2. Refactoring & Backend Integration Completed

To eliminate hardcoded mock dependencies in production API routes, the following enhancements were executed:

1. **Dynamic Repository Coupon Lookup**:
   - Added `getByCode(code: string): Promise<Discount | null>` to [`IDiscountRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/types.ts#L85).
   - Implemented `getByCode` in [`SupabaseDiscountRepository`](file:///c:/Users/Arti/wakefit-clone/src/repositories/supabase/discountRepository.ts#L20) querying the Supabase `discounts` table via `.ilike('code', code)`.
   - Added `validateCoupon(code, subtotal)` to [`discountService`](file:///c:/Users/Arti/wakefit-clone/src/services/discountService.ts#L54) to enforce status checks, minimum order thresholds (`condition.minOrderValue`), and percentage vs fixed calculation.

2. **Authoritative Order Creation Refactoring**:
   - Refactored [`src/app/api/checkout/create-order/route.ts`](file:///c:/Users/Arti/wakefit-clone/src/app/api/checkout/create-order/route.ts#L75) to resolve products via `productService.getById(id)` and validate coupons via `discountService.validateCoupon(code, subtotal)`.
   - Maintained safe fallback to static JSON only when `NEXT_PUBLIC_DATA_SOURCE=mock` or during migration transition.

---

## 3. Production Cutover Protocol

To switch the environment entirely to live Supabase backend:

1. **Set Environment Variables in `.env.production`**:
   ```env
   NEXT_PUBLIC_DATA_SOURCE=supabase
   NEXT_PUBLIC_SUPABASE_URL=https://hcfcpkldxegalkrwngog.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Database Seeding**:
   Execute SQL migrations `0001_init_admin_schema_fixed.sql` through `0004_phase_b_extensions.sql` in Supabase SQL Editor to populate initial products, categories, collections, and discounts.

3. **Verification**:
   Run `npx tsc --noEmit` to ensure type safety across all repository calls.