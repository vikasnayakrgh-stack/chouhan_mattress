# Chouhan Mattress — API Inventory

**Date:** August 1, 2026  
**Phase:** B — Production Backend  

---

## Active API Routes

| # | Endpoint | Methods | Auth | Rate Limit | Validation | Status |
|---|----------|---------|------|------------|------------|--------|
| 1 | `/api/admin/products` | GET, POST, PATCH, DELETE | ✅ Admin JWT | ✅ 100/15min | ✅ Zod | ✅ Complete |
| 2 | `/api/checkout/create-order` | POST | ❌ Public | ✅ Sliding window | ✅ Server-side | ✅ Complete (Phase A) |

## Required API Routes (Not Yet Created)

| # | Endpoint | Methods | Priority | Module |
|---|----------|---------|----------|--------|
| 3 | `/api/admin/dashboard` | GET | P1 | Dashboard |
| 4 | `/api/admin/orders` | GET, PATCH | P1 | Orders |
| 5 | `/api/admin/orders/[id]` | GET, PATCH | P1 | Orders |
| 6 | `/api/admin/customers` | GET | P1 | Customers |
| 7 | `/api/admin/customers/[id]` | GET, PATCH | P1 | Customers |
| 8 | `/api/admin/categories` | GET, POST, PATCH, DELETE | P1 | Catalog |
| 9 | `/api/admin/collections` | GET, POST, PATCH, DELETE | P1 | Catalog |
| 10 | `/api/admin/inventory` | GET, PATCH | P1 | Inventory |
| 11 | `/api/admin/returns` | GET, PATCH | P2 | Returns |
| 12 | `/api/admin/discounts` | GET, POST, PATCH, DELETE | P2 | Discounts |
| 13 | `/api/admin/reviews` | GET, PATCH | P2 | Reviews |
| 14 | `/api/admin/cms/hero` | GET, PATCH | P2 | CMS |
| 15 | `/api/admin/cms/banners` | GET, POST, PATCH, DELETE | P2 | CMS |
| 16 | `/api/admin/cms/faqs` | GET, POST, PATCH, DELETE | P2 | CMS |
| 17 | `/api/admin/cms/sections` | GET, PATCH | P2 | CMS |
| 18 | `/api/admin/cms/seo` | GET, PATCH | P2 | CMS |
| 19 | `/api/admin/settings` | GET, PATCH | P2 | Settings |
| 20 | `/api/admin/staff` | GET, POST, PATCH | P2 | Staff |
| 21 | `/api/admin/analytics/overview` | GET | P3 | Analytics |
| 22 | `/api/admin/analytics/sales` | GET | P3 | Analytics |
| 23 | `/api/admin/analytics/traffic` | GET | P3 | Analytics |
| 24 | `/api/admin/audit` | GET | P3 | Audit |
| 25 | `/api/admin/integrations` | GET, PATCH | P3 | Integrations |

## API Response Standard

All API routes follow this format:

```json
{
  "success": true,
  "data": {} | [],
  "error": null
}
```

Error format:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Security Standards

Every admin API route must:
1. ✅ Validate admin session via `validateAdminSession()`
2. ✅ Rate limit via `checkRateLimit()`
3. ✅ Log via `logSecurityEvent()`
4. ✅ Validate input via Zod schemas
5. ✅ Return standardized JSON response
6. ✅ Use correct HTTP status codes (200, 201, 400, 403, 404, 429, 500)
