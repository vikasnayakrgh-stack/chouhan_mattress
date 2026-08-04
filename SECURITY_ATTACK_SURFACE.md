# Chouhan Mattress — Security Attack Surface Map

**Date:** 2026-07-31  
**Auditor:** Principal Application Security Engineer  
**Project:** wakefit-clone (Chouhan Mattress)  
**Stack:** Next.js 14.2.0 (App Router), React 19.2.8, TypeScript 5.4.0, Supabase (PostgreSQL), Tailwind CSS 3.4.14

---

## 1. Framework & Architecture Overview

| Component | Version | Notes |
|-----------|---------|-------|
| Next.js | 14.2.0 | App Router (no Pages Router) |
| React | 19.2.8 | Latest major version |
| TypeScript | 5.4.0 | Strict mode enabled |
| Supabase JS | 2.110.9 | PostgreSQL client |
| Tailwind CSS | 3.4.14 | Utility-first CSS |
| Zod | 3.22.0 | Schema validation |
| Radix UI | Multiple | Accessible primitives |
| Framer Motion / Motion | 11.0.0 / 12.42.2 | Animation libraries |

**Architecture Pattern:** Repository + Service Layer + Client Components calling Supabase directly

---

## 2. Trust Boundary / Data Flow Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER BROWSER (Untrusted)                         │
│  • localStorage (cart, coupons)                                            │
│  • React Client Components ('use client')                                  │
│  • Supabase anon key (exposed to browser)                                  │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ HTTPS / Supabase Realtime
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND (Semi-Trusted)                          │
│  • Server Components (RSC)                                                 │
│  • Client Components with 'use client'                                     │
│  • Middleware: NOT IMPLEMENTED ❌                                          │
│  • API Routes: NOT IMPLEMENTED ❌                                          │
│  • Server Actions: NOT IMPLEMENTED ❌                                      │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ Supabase Client (anon key) / Server Client (service_role)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION / AUTHORIZATION LAYER                      │
│  ⚠️ NO MIDDLEWARE - No route protection                                    │
│  ⚠️ NO SERVER-SIDE AUTH CHECKS in admin pages                              │
│  ⚠️ AdminContext only manages UI state (sidebar, selection)                │
│  ⚠️ Staff roles defined in mock data but NEVER enforced                    │
│  ✅ Supabase RLS policies exist (is_staff() helper)                        │
│  ✅ Service-role key only in server-side functions                         │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ RLS-enforced queries
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUPABASE / POSTGRESQL (Trusted)                          │
│  • 13 tables with RLS ENABLED                                              │
│  • Tables: staff, categories, collections, products, product_variants,     │
│            customers, orders, returns, discounts, inventory,               │
│            stock_adjustments, audit_logs                                   │
│  • Enums: 15 custom types (product_status, order_status, etc.)             │
│  • Indexes: 16 indexes for query performance                               │
│  • Triggers: 4 updated_at triggers                                         │
│  • RLS Policies: is_staff() for authenticated, false for anon              │
│  • Service Role: BYPASSES RLS (server migrations/admin)                    │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ External integrations
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   PAYMENT / STORAGE / EXTERNAL SERVICES                     │
│  ⚠️ NO PAYMENT INTEGRATION IMPLEMENTED                                     │
│  ⚠️ NO RAZORPAY/STRIPE WEBHOOKS                                            │
│  ✅ ImageKit for images (configured in next.config.mjs)                    │
│  ⚠️ No Cloudinary, no email service, no SMS                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Attack Surface Inventory

### 3.1 Frontend Routes (Public)
| Route | Type | Auth Required | Notes |
|-------|------|---------------|-------|
| `/` | Page | No | Homepage with Hero, categories, products |
| `/products` | Page | No | Product listing |
| `/product/[id]` | Page | No | Product detail with variant selector |
| `/category/[slug]` | Page | No | Category listing |
| `/cart` | Page | No | Cart drawer (client state) |
| `/checkout` | Page | No | **CRITICAL** - Full client-side checkout |
| `/compare` | Page | No | Product comparison |
| `/mattress-selector` | Page | No | Quiz/finder |
| `/reviews` | Page | No | Reviews |
| `/wishlist` | Page | No | Wishlist |
| `/account` | Page | **Should be** | No auth implementation |
| `/order-confirmation/[orderId]` | Page | No | Mock order confirmation |

### 3.2 Admin Routes (Protected - But Not Actually)
| Route | Type | Auth Required | Current Protection |
|-------|------|---------------|-------------------|
| `/admin` | Page | Yes (Super Admin) | **NONE** - Client component only |
| `/admin/products` | Page | Yes | **NONE** |
| `/admin/products/new` | Page | Yes | **NONE** |
| `/admin/products/[id]` | Page | Yes | **NONE** |
| `/admin/categories` | Page | Yes | **NONE** |
| `/admin/collections` | Page | Yes | **NONE** |
| `/admin/inventory` | Page | Yes | **NONE** |
| `/admin/orders` | Page | Yes | **NONE** |
| `/admin/orders/[id]` | Page | Yes | **NONE** |
| `/admin/returns` | Page | Yes | **NONE** |
| `/admin/returns/[id]` | Page | Yes | **NONE** |
| `/admin/customers` | Page | Yes | **NONE** |
| `/admin/customers/[id]` | Page | Yes | **NONE** |
| `/admin/reviews` | Page | Yes | **NONE** |
| `/admin/discounts` | Page | Yes | **NONE** |
| `/admin/discounts/new` | Page | Yes | **NONE** |
| `/admin/discounts/[id]` | Page | Yes | **NONE** |
| `/admin/content` | Page | Yes | **NONE** |
| `/admin/content/*` | Pages | Yes | **NONE** |
| `/admin/analytics` | Page | Yes | **NONE** |
| `/admin/settings` | Page | Yes | **NONE** |

### 3.3 Data Access Layer (No API Routes)

| Layer | Implementation | Trust Level |
|-------|---------------|-------------|
| **Client Supabase** | `src/lib/supabase/client.ts` → `createClient(anon)` | Browser (Untrusted) |
| **Server Supabase** | `src/lib/supabase.ts` → `createServerClient(service_role)` | Server (Trusted) |
| **Repository Factory** | `src/repositories/mock/index.ts` → switches mock/supabase | Both |
| **Mock Repositories** | In-memory arrays with full CRUD | Dev only |
| **Supabase Repositories** | Direct Supabase queries with anon key | Browser + RLS |
| **Services** | `src/services/*.ts` → business logic | Both |

---

## 4. Critical Trust Boundary Crossings

| # | Boundary | Direction | Risk | Mitigation Status |
|---|----------|-----------|------|-------------------|
| 1 | Browser → Supabase (anon) | Outbound | **HIGH** - All admin ops use anon key | RLS only |
| 2 | Browser → localStorage | Local | **MEDIUM** - Cart, coupons, no sensitive data | None needed |
| 3 | Browser → CMS content | Inbound | **HIGH** - `dangerouslySetInnerHTML` ×4 | ❌ No sanitization |
| 4 | Client → Server (no middleware) | Inbound | **CRITICAL** - No route protection | ❌ Missing |
| 5 | Service Role → Database | Internal | **LOW** - Server-only, bypasses RLS | ✅ Correct |
| 6 | Checkout → Order Creation | Internal | **CRITICAL** - Client calculates totals | ❌ No server validation |

---

## 5. Key Security Gaps Summary

| Gap | Severity | Location | Impact |
|-----|----------|----------|--------|
| **No Authentication** | CRITICAL | Entire app | Anyone accesses admin |
| **No Authorization** | CRITICAL | Admin pages | Role escalation possible |
| **No Middleware** | CRITICAL | Missing | No route protection |
| **Client-side Pricing** | CRITICAL | CartContext, Checkout | Price manipulation |
| **No Payment Integration** | CRITICAL | Checkout | Fake orders |
| **dangerouslySetInnerHTML ×4** | HIGH | CMS components | XSS via CMS |
| **No API Routes** | HIGH | Architecture | No server validation layer |
| **No Rate Limiting** | HIGH | All endpoints | Brute force, abuse |
| **No CSRF Protection** | MEDIUM | Forms | CSRF attacks |
| **Console Logs in Prod** | LOW | Multiple files | Info leakage |

---

## 6. File References for Deep Dive

```
Security-Critical Files:
├── src/lib/supabase.ts                 # Server client (service_role)
├── src/lib/supabase/client.ts          # Browser client (anon)
├── src/repositories/mock/index.ts      # Repository factory
├── src/repositories/supabase/mappers.ts # Supabase client (anon)
├── src/context/AdminContext.tsx         # UI state only
├── src/context/CartContext.tsx          # Client-side pricing ⚠️
├── src/app/checkout/page.tsx            # Client-side checkout ⚠️
├── src/app/admin/layout.tsx             # No auth guard
├── src/components/library/Hero.tsx      # dangerouslySetInnerHTML
├── src/components/library/TopSellingProductsSection.tsx  # dangerouslySetInnerHTML
├── src/components/library/WhyWakefitSection.tsx          # dangerouslySetInnerHTML
├── src/components/library/CategoriesSection.tsx          # dangerouslySetInnerHTML
├── supabase/migrations/0001_init_admin_schema_fixed.sql  # RLS policies
├── src/services/orderService.ts         # No payment verification
├── src/services/productService.ts       # Business logic
└── .env.local                           # Contains real credentials (gitignored)
```

---

## 7. Recommended Immediate Architecture Changes

1. **Add Next.js Middleware** (`src/middleware.ts`) for route protection
2. **Create API Routes** for all mutations (orders, products, admin actions)
3. **Implement Supabase Auth** with server-side session validation
4. **Move Pricing Calculation** to Server Actions / API Routes
5. **Add Payment Integration** (Razorpay/Stripe) with webhook verification
6. **Sanitize CMS Content** before `dangerouslySetInnerHTML`
6. **Add Rate Limiting** on auth/checkout endpoints
7. **Add Security Headers** via next.config.mjs

---

*This attack surface map is the foundation for the full security audit. Each numbered boundary crossing should be traced to its code implementation and validated.*