# Architecture Decision Record (ADR-001): Next.js 15 App Router Architecture for Chouhan Mattress Administrative & Commerce Platform

**Status:** APPROVED FOR IMPLEMENTATION  
**Date:** August 3, 2026  
**Target Environment:** Next.js 15 App Router (Node.js runtime), Supabase PostgreSQL, Vercel Serverless  
**Scope:** Architecture finalization for all 16 business & administrative modules  
**Reviewers:** Principal Solution Architect, Next.js 15 App Router Specialist, Enterprise Systems Architect  

---

## 1. Context & Architectural Overview

The Chouhan Mattress e-commerce platform comprises 16 core administrative and commerce modules:
1. **Dashboard**
2. **Products**
3. **Categories**
4. **Collections**
5. **Inventory**
6. **Customers**
7. **Orders**
8. **Returns**
9. **Reviews**
10. **Discounts**
11. **CMS (Hero, Banners, FAQs)**
12. **SEO**
13. **Settings**
14. **Analytics**
15. **Staff**
16. **Audit Logs**

During technical discovery, an initial proposal suggested adopting an **API-first architecture** across all administrative modules—requiring all UI views to fetch data via dedicated client-side API routes (`/api/admin/...`).

### The Evaluation Benchmark (Architectural Options)

For every module, three core Next.js 15 data fetching and mutation patterns were evaluated:

- **Option A (Server-First Read Path):** `Server Component -> Service -> Repository -> Supabase`  
  *Characteristics:* Direct asynchronous server execution, zero client JavaScript bundle overhead for data fetching, parallel `Promise.all` data resolution, native React Suspense streaming, direct server-side caching via `fetch` cache tags or React `cache()`.

- **Option B (Client-First API Path):** `Client Component -> API Route -> Service -> Repository -> Supabase`  
  *Characteristics:* Browser `useEffect`/SWR data fetching over HTTP, JSON serialization/deserialization over network, client bundle JavaScript footprint, manual `Cache-Control` header management, network waterfall risks. Necessary for public client APIs, third-party integrations, and webhooks.

- **Option C (Server Action Mutation Path):** `Server Actions -> Service -> Repository -> Supabase`  
  *Characteristics:* Type-safe RPC-style mutations, zero client bundle mutation code, built-in CSRF protection, seamless integration with React 19 `useActionState` and `useTransition`, automatic path/tag revalidation (`revalidatePath`/`revalidateTag`), embedded RBAC validation, and audit logging.

---

## 2. Decision & Executive Rationale

### **Primary Architecture Decision: Hybrid Architecture (Server-First Admin UI + Dedicated Public/Integration APIs)**

1. **Read Paths for Internal Admin UI (16/16 Modules):** Adopt **Option A (Server Components)** as the default standard.  
2. **Mutation Paths for Admin UI (14/16 Modules):** Adopt **Option C (Server Actions)** as the default standard for forms, status transitions, stock adjustments, and administrative state updates.
3. **Selective API Routes (Option B):** Retain or build **Option B API Routes ONLY** for:
   - **Public Unauthenticated Endpoints:** E.g., `/api/checkout/create-order`, `/api/checkout/validate-discount`, `/api/products` (public catalog search).
   - **External Third-Party Webhooks & Integrations:** E.g., `/api/webhooks/razorpay`, `/api/v1/inventory/sync` (ERP/WMS integration), `/api/v1/orders/export`.
   - **Client-Side Real-Time Polling/SWR:** E.g., dynamic live notification feeds or customer-facing live order tracking widgets.

---

## 3. Comparative Architectural Trade-Off Analysis

| Architectural Metric | Option A (Server Components) | Option B (Client + API Routes) | Option C (Server Actions) |
| :--- | :--- | :--- | :--- |
| **Waterfall Risk** | **Zero** — Server-side parallel `Promise.all` fetching. | **High** — `useEffect` dynamic import & HTTP fetch cascades. | **Zero** — Immediate RPC invocation. |
| **Client JS Bundle** | **0 KB** for data fetching & rendering logic. | **+15-30 KB** per page for client fetch & state management. | **0 KB** boilerplate (only bound form handler). |
| **Caching Strategy** | **Native** Next.js cache tags (`revalidateTag`). | **Manual** HTTP headers (`Cache-Control`, ETag). | **Native** revalidation triggering (`revalidatePath`). |
| **Authentication / RBAC** | **Middleware + Server Context** (Zero client exposure). | **Middleware + Manual Route Handlers** (Duplicated). | **Embedded RBAC Guard** (`requireAdminRole`). |
| **Audit Logging** | Integrated at Service level. | Requires log wrappers in every API handler. | **Integrated directly** (`logSecurityEvent`). |
| **CSRF Protection** | Native. | Requires anti-CSRF header validation. | **Built-in** via POST header verification. |
| **Developer Ergonomics** | Simple direct TS service calls. | Multi-file schema DTOs + Zod serializations. | Direct import & invocation. |

---

## 4. Module-by-Module Architectural Decision Matrix

Below is the definitive classification for all 16 business modules:

| # | Business Module | Read Architecture | Write Architecture | Selective Option B APIs? | Architectural Justification & Next.js 15 Alignment |
|---|---|---|---|---|---|
| **1** | **Dashboard** | **Option A** (Server Component) | **Option C** (Server Action) | ❌ None (Admin UI) | Read-heavy aggregate analytics. RSC streams KPIs and chart datasets via Suspense without client waterfalls. |
| **2** | **Products** | **Option A** (Server Component) | **Option C** (Server Action) | ✅ `/api/products` (Public Catalog Search) | Product catalog listing & details are read-heavy. Mutations (create/archive/duplicate) use Server Actions. Public catalog needs API for consumer search. |
| **3** | **Categories** | **Option A** (Server Component) | **Option C** (Server Action) | ❌ None (Admin UI) | Taxonomy trees are static and read-heavy. RSC renders category hierarchy; Server Actions handle reordering and mutations. |
| **4** | **Collections** | **Option A** (Server Component) | **Option C** (Server Action) | ❌ None (Admin UI) | Curated collection lists render server-side. Server Actions modify product mappings and layout ordering. |
| **5** | **Inventory** | **Option A** (Server Component) | **Option C** (Server Action) | ✅ `/api/v1/inventory/sync` (WMS/ERP) | Stock management requires instant data freshness. RSC streams stock tables; Server Actions (`adminAdjustStockAction`) handle mutations. ERP requires API route. |
| **6** | **Customers** | **Option A** (Server Component) | **Option C** (Server Action) | ❌ None (Admin UI) | Customer profiles & order timelines are read-heavy. Notes/address modifications use Server Actions with audit logs. |
| **7** | **Orders** | **Option A** (Server Component) | **Option C** (Server Action) | ✅ `/api/checkout/create-order`, `/api/webhooks/razorpay` | Complex workflow. Order management uses RSC; status changes and refunds use Server Actions. Checkout & webhooks require Option B API routes. |
| **8** | **Returns** | **Option A** (Server Component) | **Option C** (Server Action) | ❌ None (Admin UI) | Inspection logs and return status management. RSC renders return details; Server Actions handle status approvals and refund triggers. |
| **9** | **Reviews** | **Option A** (Server Component) | **Option C** (Server Action) | ✅ `/api/reviews` (Public Review Submission) | Review moderation uses RSC for fast listing. Moderation actions (approve/flag) use Server Actions. Customer review submission requires public API route. |
| **10** | **Discounts** | **Option A** (Server Component) | **Option C** (Server Action) | ✅ `/api/checkout/validate-discount` | Promotional rule management. RSC lists promo rules; Server Actions manage lifecycle. Cart checkout needs public validation API. |
| **11** | **CMS (Banners/Hero/FAQs)** | **Option A** (Server Component) | **Option C** (Server Action) | ❌ None (Admin UI) | Storefront content management. RSC renders content list; Server Actions save slides, hero sections, and FAQ items. |
| **12** | **SEO** | **Option A** (Server Component) | **Option C** (Server Action) | ❌ None (Admin UI) | Page metadata management. Read via RSC; metadata updates and sitemap flag modifications via Server Actions. |
| **13** | **Settings** | **Option A** (Server Component) | **Option C** (Server Action) | ❌ None (Admin UI) | Store configuration. Read settings via RSC; toggle maintenance mode, payment gateways, and tax rules via Server Actions. |
| **14** | **Analytics** | **Option A** (Server Component) | **Option C** (Server Action - Export) | ❌ None (Admin UI) | Read-only analytics aggregated from Supabase views. RSC handles heavy data fetching; client wrapper components render Recharts. CSV export via Action. |
| **15** | **Staff** | **Option A** (Server Component) | **Option C** (Server Action) | ❌ None (Admin UI) | Administrative user management. RSC lists staff profiles; invites, role updates, and access revocations executed via Server Actions with strict RBAC. |
| **16** | **Audit Logs** | **Option A** (Server Component) | **Option C** (Server Action - Export) | ❌ None (Admin UI) | Read-only security event history. RSC streams paginated log views; CSV export via Server Action. System events automatically written during Server Actions. |

---

## 5. Security & RBAC Enforcement

Under Next.js 15 App Router architecture:
1. **Route Guarding:** `src/middleware.ts` enforces JWT authentication and preliminary role checking on all `/admin/*` and `/api/admin/*` routes.
2. **Action-Level Defense-in-Depth:** Every Server Action in `src/app/admin/actions.ts` explicitly invokes `requireAdminRole(token, allowedRoles)` to enforce granular permissions before executing domain services.
3. **Audit Logging:** Server Actions automatically call `logSecurityEvent()` upon success or failure, ensuring compliance and security monitoring without manual boilerplate.

---

## 6. Implementation Guidelines & Next Steps

1. **Refactor Read Views:** Convert all administrative pages in `src/app/admin/*` from Client Components (`'use client'` with `useEffect`) to Server Components.
2. **Isolate Client Interactivity:** Extract form inputs, modal dialogs, date pickers, and interactive datatables into isolated client leaf components.
3. **Standardize Mutations:** Route all admin mutation workflows through centralized Server Actions in `src/app/admin/actions.ts`.
4. **Implement Cache Invalidation:** Call `revalidatePath('/admin/<module>')` or `revalidateTag('<module-tag>')` inside Server Actions following successful mutations.