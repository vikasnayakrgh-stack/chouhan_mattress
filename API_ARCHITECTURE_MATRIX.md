# API Architecture Matrix & Endpoint Specification

**Project:** Chouhan Mattress Administrative & Commerce Platform  
**Framework:** Next.js 15 App Router  
**Target Scope:** Comprehensive Architectural Review & Specification for all 16 Business Modules  
**Document Version:** 1.0.0  

---

## 1. Executive Strategy & Selection Criteria

Under Next.js 15 App Router best practices, API Routes (`src/app/api/.../route.ts`) are **not** required for internal administrative user interfaces. Instead, internal admin data flows leverage **Server Components (Option A)** for reads and **Server Actions (Option C)** for mutations.

API Routes (**Option B**) are reserved strictly for:
1. **Public Unauthenticated Storefront Endpoints:** E.g., checkout order creation, promo code validation, catalog search.
2. **Third-Party External Webhooks:** E.g., Razorpay payment callbacks.
3. **Automated Integrations:** E.g., Warehouse Management System (WMS) inventory synchronization.
4. **Public Storefront Client APIs:** E.g., storefront customer review submission.

---

## 2. Complete 16-Module API Architecture Matrix

| # | Business Module | Read Strategy | Write Strategy | Option B API Route Needed? | API Route Justification & Next.js 15 Rationale |
|---|---|---|---|---|---|
| **1** | **Dashboard** | **Option A** (RSC) | **Option C** (Server Action) | ❌ **REJECTED** for Admin UI | Internal admin dashboard data is fetched via Server Components directly calling `dashboardService.getStats()`. Creating `/api/admin/dashboard` adds network hops and waterfalls. |
| **2** | **Products** | **Option A** (RSC) | **Option C** (Server Action) | ✅ **SELECTED** (`/api/products`) | Admin management uses RSC & Server Actions. Option B public API `/api/products` is required for storefront client-side search, category filtering, and mobile app clients. |
| **3** | **Categories** | **Option A** (RSC) | **Option C** (Server Action) | ❌ **REJECTED** for Admin UI | Admin taxonomy management uses RSC and Server Actions. Storefront taxonomy is pre-rendered via Server Components. |
| **4** | **Collections** | **Option A** (RSC) | **Option C** (Server Action) | ❌ **REJECTED** for Admin UI | Admin collection curation uses RSC and Server Actions. Storefront landing pages render collections directly via RSC. |
| **5** | **Inventory** | **Option A** (RSC) | **Option C** (Server Action) | ✅ **SELECTED** (`/api/v1/inventory/sync`) | Admin stock adjustments use Server Action `adminAdjustStockAction`. Option B API route is required for external WMS/ERP machine-to-machine sync. |
| **6** | **Customers** | **Option A** (RSC) | **Option C** (Server Action) | ❌ **REJECTED** for Admin UI | Customer admin management uses RSC and Server Actions. Customer profile edits on storefront use customer auth Server Actions. |
| **7** | **Orders** | **Option A** (RSC) | **Option C** (Server Action) | ✅ **SELECTED** (`/api/checkout/create-order`, `/api/webhooks/razorpay`) | Admin order management uses RSC and Server Actions (`adminUpdateOrderStatusAction`, `adminInitiateRefundAction`). Storefront checkout and Razorpay webhooks require Option B API routes. |
| **8** | **Returns** | **Option A** (RSC) | **Option C** (Server Action) | ❌ **REJECTED** for Admin UI | Admin return management uses RSC and Server Actions (`adminUpdateReturnStatusAction`). Customer return requests use storefront customer Server Actions. |
| **9** | **Reviews** | **Option A** (RSC) | **Option C** (Server Action) | ✅ **SELECTED** (`/api/reviews`) | Admin review moderation uses RSC and Server Actions. Public e-commerce submission of reviews requires an Option B API route. |
| **10** | **Discounts** | **Option A** (RSC) | **Option C** (Server Action) | ✅ **SELECTED** (`/api/checkout/validate-discount`) | Admin discount creation uses Server Action `adminCreateDiscountAction`. Checkout cart coupon validation requires a fast Option B API route. |
| **11** | **CMS** | **Option A** (RSC) | **Option C** (Server Action) | ❌ **REJECTED** for Admin UI | Admin content editing uses RSC and Server Actions. Storefront reads CMS content directly via RSC. |
| **12** | **SEO** | **Option A** (RSC) | **Option C** (Server Action) | ❌ **REJECTED** for Admin UI | SEO metadata editing uses RSC and Server Actions. Sitemap and robots headers generated via `sitemap.ts` and `robots.ts`. |
| **13** | **Settings** | **Option A** (RSC) | **Option C** (Server Action) | ❌ **REJECTED** for Admin UI | Store configuration management uses RSC and Server Actions. Settings are cached on the server. |
| **14** | **Analytics** | **Option A** (RSC) | **Option C** (Server Action - Export) | ❌ **REJECTED** for Admin UI | Analytics aggregation rendered via RSC streaming. CSV reports generated via Server Action export. |
| **15** | **Staff** | **Option A** (RSC) | **Option C** (Server Action) | ❌ **REJECTED** for Admin UI | Staff management, role assignment, and invitations use RSC and Server Actions with strict RBAC. |
| **16** | **Audit Logs** | **Option A** (RSC) | **Option C** (Server Action - Export) | ❌ **REJECTED** for Admin UI | Audit log streaming rendered via RSC. CSV log downloads triggered via Server Action. System events automatically logged in backend. |

---

## 3. Option B Endpoint Detailed Specifications

### 1. Checkout Create Order Endpoint
- **Route Path:** `/api/checkout/create-order`
- **HTTP Method:** `POST`
- **Access Level:** Public (Unauthenticated Storefront / Guest Checkout)
- **Rate Limit:** 10 requests / minute per IP
- **Request Body Schema:**
  ```json
  {
    "items": [{ "variantId": "string", "quantity": 1 }],
    "shippingAddress": { "line1": "string", "city": "string", "postalCode": "string" },
    "paymentMethod": "razorpay" | "cod",
    "discountCode": "string?"
  }
  ```
- **Response Format:**
  ```json
  {
    "success": true,
    "data": { "orderId": "ORD-98214", "razorpayOrderId": "order_Kz1298...", "amount": 2499900 }
  }
  ```
- **Cache Control:** `no-store, max-age=0`

---

### 2. Discount Validation Endpoint
- **Route Path:** `/api/checkout/validate-discount`
- **HTTP Method:** `POST`
- **Access Level:** Public (Storefront Cart)
- **Rate Limit:** 20 requests / minute per IP
- **Request Body Schema:**
  ```json
  {
    "code": "WAKEFIT10",
    "cartSubtotal": 15000,
    "itemVariantIds": ["var-1", "var-2"]
  }
  ```
- **Response Format:**
  ```json
  {
    "success": true,
    "data": { "valid": true, "code": "WAKEFIT10", "discountAmount": 1500, "discountType": "percentage" }
  }
  ```

---

### 3. Razorpay Payment Webhook Endpoint
- **Route Path:** `/api/webhooks/razorpay`
- **HTTP Method:** `POST`
- **Access Level:** Third-Party Webhook (Razorpay Server)
- **Auth Guard:** Signature Verification via `x-razorpay-signature` header & HMAC-SHA256 secret.
- **Request Body:** Razorpay Payload (`payment.captured`, `payment.failed`, `refund.processed`)
- **Response:** `{ "status": "ok" }`
- **Side Effects:** Triggers `orderService.updateOrderStatus()` and writes to `AuditRepository`.

---

### 4. WMS Inventory Synchronization Endpoint
- **Route Path:** `/api/v1/inventory/sync`
- **HTTP Method:** `POST`
- **Access Level:** Machine-to-Machine Machine Integration (API Key / Bearer Service Token)
- **Auth Guard:** `Authorization: Bearer wms_sec_key_...`
- **Request Body Schema:**
  ```json
  {
    "warehouseId": "wh-main",
    "adjustments": [
      { "sku": "WF-MAT-KING-01", "newQuantity": 150, "reason": "ERP_SYNC" }
    ]
  }
  ```
- **Response:** `{ "success": true, "processedCount": 1 }`

---

### 5. Public Product Search API Endpoint
- **Route Path:** `/api/products`
- **HTTP Method:** `GET`
- **Access Level:** Public Storefront Search & Autocomplete
- **Query Parameters:** `q=string`, `category=string`, `minPrice=number`, `maxPrice=number`, `limit=number`
- **Cache Control:** `public, s-maxage=300, stale-while-revalidate=600`

---

### 6. Public Review Submission Endpoint
- **Route Path:** `/api/reviews`
- **HTTP Method:** `POST`
- **Access Level:** Authenticated Customer Storefront API
- **Auth Guard:** Customer Session Verification (`requireCustomerAuth`)
- **Request Body Schema:**
  ```json
  {
    "productId": "prod-101",
    "rating": 5,
    "title": "Extremely Comfortable",
    "comment": "Best mattress I have purchased in years."
  }
  ```
- **Response:** `{ "success": true, "message": "Review submitted for moderation" }`

---

## 4. Security & RBAC Enforcement Matrix

| Architectural Access Layer | Enforcement Mechanism | Failure Response | Audit Log Triggered? |
| :--- | :--- | :--- | :--- |
| **Admin UI Page Load (RSC)** | `src/middleware.ts` JWT Cookie Check | HTTP 307 Redirect to `/login` | Yes (`UNAUTHORIZED_ADMIN_ACCESS`) |
| **Admin Server Action (Option C)** | `requireAdminRole(token, ['owner','admin',...])` inside Action | Throws `UnauthorizedError` | Yes (`logSecurityEvent`) |
| **Public API Route (Option B)** | IP Rate Limiting + Schema Validation (`Zod`) | HTTP 400 Bad Request / 429 Too Many Requests | No (Unless Malformed Attack) |
| **Webhook API Route (Option B)** | Cryptographic Signature Check (`HMAC-SHA256`) | HTTP 401 Unauthorized | Yes (`WEBHOOK_SIGNATURE_FAILURE`) |
| **WMS Machine API Route (Option B)** | Machine Token Validation (`Bearer wms_sec_...`) | HTTP 403 Forbidden | Yes (`MACHINE_AUTH_FAILURE`) |

---

## 5. Client-Side `useEffect` Refactoring Blueprint

### The Anti-Pattern (Legacy Client-Side Fetch Waterfall)
```tsx
// BEFORE: Client Component doing fetch waterfalls (Anti-Pattern)
'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard') // Endpoint may not exist, network waterfall
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
  }, [])

  if (loading) return <Skeleton />
  return <div>{stats.totalSales}</div>
}
```

### The Solution (Next.js 15 Server Component Standard)
```tsx
// AFTER: Next.js 15 Server Component (Option A - Preferred)
import { Suspense } from 'react'
import { dashboardService } from '@/services/dashboardService'
import { DashboardView } from './dashboard-view'
import { Skeleton } from '@/components/admin'

export default async function AdminDashboardPage() {
  // Directly call service on server - ZERO client fetch, ZERO waterfall
  const stats = await dashboardService.getStats()

  return (
    <Suspense fallback={<Skeleton />}>
      <DashboardView stats={stats} />
    </Suspense>
  )
}
```

### Server Action Refactoring Blueprint (Option C Standard)
```tsx
// Server Action definition in src/app/admin/actions.ts
'use server'

import { requireAdminRole } from '@/lib/auth/adminAuth'
import { productService } from '@/services/productService'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function adminArchiveProductAction(token: string, productId: string) {
  await requireAdminRole(token, ['owner', 'admin', 'manager'])
  await productService.archive(productId)
  revalidateTag('products-list')
  revalidatePath('/admin/products')
  return { success: true }
}
```
