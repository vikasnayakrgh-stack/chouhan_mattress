# AGENTS.md - Master Rules & Execution Roadmap for Chouhan Mattress

## 🚨 MANDATORY PROJECT DIRECTIVES & RULES

1. **Brand Identity**: The platform is built for **Chouhan Mattress** (Direct-to-Consumer Premium Mattress & Home Comfort Brand).
   - Inspiration benchmark: **Wakefit** (for UX rigor, engineering discipline, information architecture, performance, and trust signals).
   - Core value callouts: 100-Night Free Trial, 10-Year Warranty, Ergonomic Spine Support, Factory Direct Prices, Free Shipping & Installation.
   - Primary Accent: `#F26522` (Chouhan Orange). Dark: `#121212`. Fonts: `Poppins` (headings/UI), `Inter` (body).

2. **Architecture Standards**:
   - Framework: Next.js 14 App Router, TypeScript (Strict), Tailwind CSS.
   - Design System: All styles must use design tokens (`design-tokens.ts`, `globals.css`, Tailwind theme classes).
   - Asset Optimization: All images must use `OptimizedImage` or `src/lib/assets/` CDN utilities. No raw `<img>` tags.
   - Verification Requirement: EVERY phase or major change MUST be validated by running `npm run build` with 0 compilation/type errors before declaring success.

3. **Non-Negotiable Engineering Rules**:
   - **Build Gate**: `npm run build` after EVERY phase. Exit code 0 is the only acceptable state.
   - **No `any` TypeScript**: All types fully declared. Use interfaces from `src/types/index.ts`.
   - **No inline styles**: Only Tailwind classes and design token CSS variables.
   - **Mobile-First**: All components built mobile-first, scaled to desktop.
   - **Accessibility**: Every interactive element needs `aria-label`, keyboard navigation, and focus management.
   - **Component colocation**: Phase-specific components live in their own subdirectory (e.g., `src/components/plp/`, `src/components/pdp/`).

---

## 🗺️ MASTER EXECUTION ROADMAP

### PHASE 1: Reusable Ecommerce Framework & Homepage Foundation (STATUS: COMPLETED ✅)
- Design Token Architecture & CSS Variable Tokens.
- Multi-Provider CDN Asset Pipeline & Responsive Image Utilities.
- Reusable UI Primitives (`Button`, `Input`, `OptimizedImage`, `Skeleton`, `Layout`, `Animation`, `Accessibility`).
- Enterprise Component Library (`Header`, `Navigation`, `Footer`, `Hero`, `Banner`, `CategoriesSection`, `WhyWakefitSection`, `TopSellingProductsSection`, `ProductCard`, `ProductGrid`, `Collection`, `Cart`, `Search`).
- Production Build Verification (Next.js 14 Build Passed 100% Clean).

---

### PHASE 2: Product Experience & Catalog System (PLP & PDP) (STATUS: COMPLETED ✅)
- **2A — Homepage Assembly**: Wire all Phase 1 components in `src/app/page.tsx` with real data from `src/data/`.
- **Product Listing Page (PLP)** (`/products`, `/category/[slug]`):
  - Multi-facet sidebar filters (Category, Subcategory, Price slider, Size, Thickness, Firmness, Material, Discount, Stock).
  - Dynamic sorting & Layout switcher (3-Col Grid, 4-Col Grid, List View).
  - Active filter chips with "Clear All", Breadcrumb navigation, URL query parameter syncing.
  - Infinite scroll / Accessible Pagination.
- **Product Detail Page (PDP)** (`/product/[id]`):
  - Multi-image zoom gallery & Lightbox viewer.
  - Variant Selector (Size: Single/Double/Queen/King, Thickness: 6"/8"/10", Firmness scale).
  - **Custom Mattress Dimension Calculator**: Interactive Custom Length x Width in inches with dynamic pricing formula.
  - Pincode delivery & serviceability checker (Estimated delivery date, free shipping, cash-on-delivery availability).
  - Product Specifications & Feature Tabs (Overview, Material & Tech, Care Instructions, Warranty Details).
  - Verified Buyer Reviews & Rating Breakdown (Star distribution, photo reviews, filter by rating).
  - Accordion Product FAQs & Sticky Add-To-Cart Bar on scroll.
  - Related Bestsellers & Cross-sell recommendations.

---

### PHASE 3: Cart, Checkout & User Account Workflows (STATUS: COMPLETED ✅)
- **Interactive Cart System**:
  - Slide-over Cart Drawer & Full Cart Page (`/cart`).
  - Dynamic cart item management (quantity updates, variant changes, item removal).
  - Free shipping progress bar, promo code validation & discount calculation, order summary breakdown (Subtotal, GST, Delivery, Savings).
  - Cart state persisted via `CartContext` + `localStorage`.
- **Multi-Step Checkout Flow** (`/checkout`):
  - Step 1: Delivery Address Management (Pincode auto-lookup, saved addresses picker, guest checkout option).
  - Step 2: Delivery & Shipping Options (Standard Free Delivery, Express Delivery, Scheduled Slot).
  - Step 3: Payment Method Selection (Mock UPI, Credit/Debit Cards, Net Banking, EMI Options, Cash on Delivery).
  - Step 4: Order Confirmation & Receipt Page (`/order-confirmation/[orderId]`) with order tracking status timeline.
- **User Account Dashboard** (`/account`):
  - Profile Management, Order History & Live Order Tracking, Wishlist Manager, Saved Addresses, Customer Support & Return Requests.

---

### PHASE 4: Commerce Enhancements & Interactive Tools (STATUS: COMPLETED ✅)
- **Interactive Mattress Finder / Sleep Selector Wizard** (`/mattress-selector`):
  - Step-by-step interactive questionnaire (Sleeping posture, body weight, back pain issues, firmness preference, budget) recommending the exact ideal mattress.
- **Pincode Delivery & Serviceability Checker System**:
  - Global pincode lookup modal, delivery SLA calculation engine, exchange offer calculator.
- **Comparison Tool** (`/compare`):
  - Side-by-side product feature comparison matrix (Firmness, Thickness, Layers, Trial, Price).
  - Floating CompareBar showing queued products.
- **Customer Reviews & Social Proof Portal**:
  - Dedicated customer reviews page, photo/video review submission form, verified badge verification system.

---

### PHASE 5: Production Readiness, SEO & Launch (STATUS: COMPLETED ✅)
- **SEO & Structured Data Architecture**:
  - Dynamic OpenGraph & Twitter Cards, Schema.org Product / BreadcrumbList / FAQPage JSON-LD markup.
  - Automatic `sitemap.xml` and `robots.txt` generation.
- **Performance & Core Web Vitals Optimization**:
  - LCP < 2.5s: Hero image preload, priority flags on above-fold images.
  - CLS < 0.1: Aspect ratio reserved on all `<OptimizedImage>` components.
  - Bundle < 150kB first load JS: Dynamic imports for Cart, Search, Lightbox modals.
- **Accessibility & Compliance (WCAG 2.1 AA)**:
  - Full keyboard navigation, screen reader ARIA labels, focus trap modals, color contrast compliance.
- **End-to-End Testing & Build Validation**:
  - Production build execution, Lighthouse ≥ 90 on mobile, cross-browser Chrome/Safari/Firefox, responsive from 375px–1920px.

---

### PHASE 6: Conversion Rate Optimization, Mobile UX & Desktop Overhaul (STATUS: COMPLETED ✅)
- **Mobile-First UX Overhaul (5 High-Conversion Mobile Features)**:
  - **Native Bottom-Sheet Variant Selector (`VariantBottomSheet.tsx`)**: Slide-up drawer for mobile size/thickness selection with spring physics (`vaul` / Framer Motion).
  - **Mobile Catalog Filter Bottom Sheet (`FilterSidebar.tsx`)**: Mobile filter drawer refactored into a native slide-up bottom sheet with top drag handle and active filter counter badge.
  - **Interactive Visual Mattress Size Guide (`/size-guide`)**: Visual bed top-view simulator with occupant silhouettes (1 Adult, 2 Adults, 2 Adults + Child) and live dimension callouts.
  - **Sonner Mobile Cart Toasts (`layout.tsx` & `CartContext.tsx`)**: Mobile bottom-center rich toast notifications displaying product thumbnail, price, and direct "View Cart" CTA.
  - **Swipable Mobile Product Comparison (`/compare`)**: Touch-swipe product card matrix for mobile viewports with sticky feature rows.
- **Desktop-First Experience Overhaul (5 High-Impact Desktop Features)**:
  - **Luxury 3-Column Desktop Mega Menu Header (`Header.tsx`)**: Animated 3-column dropdown on hovering category items (Subcategories, Sizes, Bestseller Spotlight Card) with 100% solid opaque dark navy backdrop (`#0B132B`).
  - **Desktop Product Quick View Modal (`QuickViewModal.tsx` & `ProductCard.tsx`)**: Eye icon button on desktop card hover opening instant specs & size selection modal without page transition.
  - **Sticky Right-Rail Buy Box on Desktop PDP (`src/app/product/[id]/page.tsx`)**: Sticky right column on desktop PDP (`lg:sticky lg:top-24 lg:self-start`) keeping purchase options visible while scrolling long reviews and specs.
  - **Floating Desktop Utility Cluster (`FloatingDesktopTools.tsx`)**: WhatsApp Live Support button & Back-to-Top scroll button in the bottom-right corner, dynamically shifting UP (`bottom-20`) on PDP when sticky buy bar is active to prevent button collisions.
  - **Desktop Parallax Hero Carousel (`Hero.tsx`)**: Auto-sliding hero controls with desktop hover pause, slide counter badge (`01 / 04`), and smooth arrow controls.
- **21st.dev Component Registry Integrations**:
  - **Interactive Bento Grid Categories (`CategoriesSection.tsx`)**: Flagship categories (e.g. Mattresses) occupy a large 2x2 featured grid block, accessories occupy a wide 2x1 block, creating an animated structural layout.
  - **Border-Beam Shiny Buttons (`Button.tsx`)**: `'shiny'` button variant with Framer Motion infinitely looping gradient sweep effect.
  - **Reveal-on-Hover Spec Product Cards (`ProductCard.tsx`)**: Desktop hover drawer revealing mattress firmness, warranty, and trial period.
- **PDP Interactive Magnifying Lens Widget (`ImageGallery.tsx`)**:
  - PDP image gallery interactive 140px circular magnifying lens with refraction glare & cursor/touch tracking.
- **Global Mobile Navigation Fix (`MobileBottomNav.tsx` & `layout.tsx`)**:
  - Mounted `MobileBottomNav` globally in `RootLayout` with admin route exclusion (`pathname?.startsWith('/admin')`) so mobile bottom navigation is 100% persistent across catalog and category pages.
- **Site Infrastructure & Dedicated Static Pages**:
  - Created 16 dedicated pages: `/about`, `/careers`, `/press`, `/blog`, `/sustainability`, `/contact`, `/faqs`, `/shipping`, `/returns`, `/warranty`, `/size-guide`, `/privacy`, `/terms`, `/cookies`, `/cancellation`, `/grievance`.
  - Dedicated Legacy Product Catch-All Route Guard (`src/app/[...legacyProduct]/page.tsx`) with custom branded 404 page.
