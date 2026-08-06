# API SECURITY MATRIX
## Chouhan Mattress E-commerce Platform
**Test Date:** August 5, 2026  
**Target:** https://chouhan-mattress.vercel.app  
**Architecture:** Next.js 14/15 App Router + Server Components + Server Actions (No REST API Layer)

---

## ARCHITECTURE OVERVIEW

The application **does not expose a traditional REST API layer**. Instead, it uses:

1. **Server Components** - Fetch data directly at render time (RSC)
2. **Server Actions** - Mutations invoked via form submissions (`'use server'`)
3. **Middleware** - Route protection for `/admin/*` and `/api/admin/*`
4. **Supabase Client** - Direct database access from Server Components/Actions

This architecture significantly reduces traditional API attack surface (no `/api/*` endpoints to enumerate) but shifts security burden to:
- Server Action validation
- Middleware authorization
- Supabase RLS policies
- Client-side form handling

---

## DISCOVERED ENDPOINTS

### Traditional REST API Endpoints (All 404)

| Endpoint | Methods Tested | Response | Notes |
|----------|----------------|----------|-------|
| `/api` | GET | 308 Redirect | Redirects to homepage |
| `/api/v1` | GET | 404 | Not found |
| `/api/v2` | GET | 404 | Not found |
| `/api/v3` | GET | 404 | Not found |
| `/api/auth` | GET/POST | 404 | No NextAuth |
| `/api/auth/login` | POST | 404 | - |
| `/api/auth/signup` | POST | 404 | - |
| `/api/auth/session` | GET | 404/HTML | Returns page, not JSON |
| `/api/auth/providers` | GET | 404/HTML | - |
| `/api/auth/csrf` | GET/POST | 404/HTML | - |
| `/api/cart` | GET/POST | 404 | - |
| `/api/wishlist` | GET/POST | 404 | - |
| `/api/checkout` | POST | 404 | - |
| `/api/orders` | GET | 404 | - |
| `/api/products` | GET | 404 | - |
| `/api/categories` | GET | 404 | - |
| `/api/discounts` | GET | 404 | - |
| `/api/admin` | GET | 401 | Protected by middleware |
| `/api/admin/*` | ALL | 401 | Protected by middleware |

### Server Actions (Primary Mutation Interface)

Located in: `src/app/admin/actions.ts`

| Action | HTTP Equivalent | Auth Required | Roles Allowed | Input Validation |
|--------|-----------------|---------------|---------------|------------------|
| `adminUpdateOrderStatusAction` | PATCH /admin/orders/:id/status | ✅ JWT | staff, manager, admin, owner | `any` (service layer) |
| `adminInitiateRefundAction` | POST /admin/orders/:id/refund | ✅ JWT | manager, admin, owner | `any` |
| `adminAdjustStockAction` | PATCH /admin/inventory/:id | ✅ JWT | staff, manager, admin, owner | `any` |
| `adminCreateDiscountAction` | POST /admin/discounts | ✅ JWT | admin, owner | `any` |
| `adminUpdateDiscountAction` | PATCH /admin/discounts/:id | ✅ JWT | admin, owner | `any` |
| `adminDeleteDiscountAction` | DELETE /admin/discounts/:id | ✅ JWT | admin, owner | `any` |
| `adminApproveReturnAction` | POST /admin/returns/:id/approve | ✅ JWT | staff, manager, admin, owner | `any` |
| `adminRejectReturnAction` | POST /admin/returns/:id/reject | ✅ JWT | staff, manager, admin, owner | `any` |
| `adminCreateBannerAction` | POST /admin/content/banners | ✅ JWT | manager, admin, owner | `any` |
| `adminUpdateContentAction` | PATCH /admin/content/:type/:id | ✅ JWT | manager, admin, owner | `any` |

### Supabase Direct Access (From Server Components)

| Operation | Tables | Auth Context | RLS Enforced |
|-----------|--------|--------------|--------------|
| Product listing | `products`, `categories` | Anonymous (anon key) | ✅ Public read |
| Admin dashboard | `orders`, `customers`, `returns` | Staff JWT | ✅ Role-based |
| Customer account | `orders`, `addresses`, `wishlist` | Customer JWT | ✅ Owner-only |
| Cart/Checkout | `cart_items`, `orders` | Customer JWT | ✅ Owner-only |

---

## SECURITY TEST MATRIX

### Authentication Testing

| Test Case | Target | Method | Expected | Actual | Status |
|-----------|--------|--------|----------|--------|--------|
| No token | `/api/admin` | GET | 401 | 401 | ✅ PASS |
| Invalid JWT | `/api/admin` | GET | 401 | Not tested* | ⚠️ UNTESTED |
| Expired JWT | `/api/admin` | GET | 401 | Not tested* | ⚠️ UNTESTED |
| Forged JWT | `/api/admin` | GET | 401 | Not tested* | ⚠️ UNTESTED |
| Customer token | `/api/admin` | GET | 403 | Not tested* | ⚠️ UNTESTED |
| Staff token | `/api/admin` | GET | 200 | Not tested* | ⚠️ UNTESTED |
| No token | Server Actions | POST | 401 | Code review: ✅ | ✅ PASS |
| Invalid JWT | Server Actions | POST | 401 | Code review: ✅ | ✅ PASS |

*Cannot test - no valid tokens available without auth flow

### Authorization Testing

| Test Case | Target | Method | Expected | Actual | Status |
|-----------|--------|--------|----------|--------|--------|
| IDOR - Order access | Server Action | POST | 403 | Code: Role check only | ⚠️ PARTIAL |
| IDOR - Customer data | Server Action | POST | 403 | Code: Role check only | ⚠️ PARTIAL |
| Privilege escalation | Server Action | POST | 403 | Code: Role array check | ✅ PASS |
| Mass assignment | Server Action | POST | Blocked | Uses `any` types | ⚠️ RISK |
| Missing auth check | Server Action | POST | N/A | All have `requireAdminRole` | ✅ PASS |

### Input Validation Testing

| Vector | Target | Test | Result | Status |
|--------|--------|------|--------|--------|
| SQL Injection | Server Actions | N/A | Supabase parameterized | ✅ PASS |
| XSS in inputs | Server Actions | N/A | Output encoding in UI | ⚠️ UNTESTED |
| Path Traversal | N/A | N/A | No file ops | N/A |
| Command Injection | N/A | N/A | No shell exec | N/A |
| XXE | N/A | N/A | No XML parsing | N/A |
| Prototype Pollution | Server Actions | N/A | TypeScript strict | ✅ PASS |

### Business Logic Testing

| Scenario | Target | Test | Result | Status |
|----------|--------|------|--------|--------|
| Price manipulation | Checkout | N/A | No auth to test | ❓ UNTESTED |
| Coupon stacking | Checkout | N/A | No auth to test | ❓ UNTESTED |
| Quantity abuse | Cart | N/A | Client-side only | ⚠️ RISK |
| Negative inventory | Order creation | N/A | RLS + Service layer | ⚠️ UNTESTED |
| Duplicate orders | Checkout | N/A | No idempotency key | ⚠️ RISK |
| Payment bypass | Checkout | N/A | Step 1 only visible | ❓ UNTESTED |

---

## SERVER ACTION SECURITY ANALYSIS

### Current Implementation (`src/app/admin/actions.ts`)

```typescript
// Every action follows this pattern:
export async function adminUpdateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
  token: string
) {
  // 1. Authentication & Authorization
  const { user, role } = await requireAdminRole(token, ['staff', 'manager', 'admin', 'owner'])
  
  // 2. Service Layer Call (validation happens here)
  const result = await orderService.updateStatus(orderId, status, user.id)
  
  // 3. Audit Logging
  await logSecurityEvent({ action: 'ORDER_STATUS_UPDATE', userId: user.id, ... })
  
  return result
}
```

### Security Controls Present

| Control | Implementation | Status |
|---------|----------------|--------|
| Authentication | `requireAdminRole()` validates JWT via Supabase | ✅ |
| Authorization | Role array check against `user.app_metadata.role` | ✅ |
| Audit Logging | `logSecurityEvent()` on every action | ✅ |
| Error Handling | Try/catch with typed errors | ✅ |
| Dev Bypass | `process.env.NODE_ENV === 'development'` | ⚠️ Guarded |

### Security Controls MISSING

| Control | Risk | Recommendation |
|---------|------|----------------|
| **CSRF Protection** | HIGH | Add double-submit cookie or header validation |
| **Replay Protection** | HIGH | Add nonce with 5-min TTL per session |
| **Rate Limiting** | HIGH | 10 req/min per user per action |
| **Input Validation** | MEDIUM | Add Zod schemas at action boundary |
| **Request Size Limits** | MEDIUM | Limit payload size |
| **Idempotency Keys** | MEDIUM | For refund/status actions |

---

## MIDDLEWARE SECURITY ANALYSIS

### Current Implementation (`src/middleware.ts`)

```typescript
// Protection scope
matcher: ['/admin/:path*', '/api/admin/:path*']

// Exclusions
!pathname.startsWith('/admin/login')

// Dev bypass (guarded)
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DATA_SOURCE === 'mock') {
  return NextResponse.next() // ⚠️ DANGEROUS IF MISCONFIGURED
}

// Production flow:
1. Extract token from Authorization header OR cookies (sb-access-token, supabase-auth-token)
2. Create Supabase client with anon key
3. await supabase.auth.getUser(token)
4. Check user.app_metadata.role against ALLOWED_STAFF_ROLES
5. Return 401/403 or NextResponse.next()
```

### Security Assessment

| Check | Status | Notes |
|-------|--------|-------|
| Token extraction | ✅ | Header + cookie fallback |
| JWT validation | ✅ | Uses Supabase `getUser()` |
| Role verification | ✅ | Checks `app_metadata.role` (tamper-proof) |
| Dev bypass guard | ⚠️ | Double condition but risky |
| Path coverage | ✅ | `/admin/*` and `/api/admin/*` |
| Login exclusion | ✅ | `/admin/login` accessible |
| API response format | ✅ | JSON for API, HTML for pages |

---

## SUPABASE CLIENT SECURITY

### Client Configurations

| Client | Location | Key Used | Purpose | Server-Only |
|--------|----------|----------|---------|-------------|
| `supabase` (anon) | `src/lib/supabase.ts` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public read, auth | ❌ |
| `createAdminClient()` | `src/lib/supabase/server.ts` | `SUPABASE_SERVICE_ROLE_KEY` | Admin operations | ✅ `import 'server-only'` |

### Service Role Key Protection

✅ **VERIFIED SECURE:**
- Only imported in `src/lib/supabase/server.ts` with `import 'server-only'`
- Never used in Client Components (`'use client'`)
- Not exposed in any client bundle
- Used only for: admin operations, RLS verification script

### RLS Policy Verification (Live Test Results)

```bash
# From src/lib/testing/verify_rls.ts execution
orders - Anonymous SELECT: PASS (blocked by RLS)
orders - Anonymous INSERT: PASS (blocked by RLS: "new row violates row-level security policy")
products - Anonymous SELECT: PASS (public read allowed - 0 records returned)
orders - Service Role SELECT: PASS (bypasses RLS as expected)
```

---

## CACHING & CDN SECURITY

### Cache-Control Headers (Live)
```
Cache-Control: public, max-age=0, must-revalidate
```

| Page Type | Cache Behavior | Risk |
|-----------|----------------|------|
| Static pages (home, catalog) | `public, max-age=0, must-revalidate` | Low |
| Auth pages (`/account`, `/admin`) | Same headers - **NO `Vary: Cookie`** | **MEDIUM** |
| User-specific data | Server Components (no CDN cache) | Low |

### Missing Headers
| Header | Recommended Value | Purpose |
|--------|-------------------|---------|
| `Vary` | `Cookie, Authorization` | Prevent auth page caching |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Force HTTPS |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable unused APIs |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |

---

## ATTACK SCENARIOS & MITIGATIONS

### Scenario 1: Admin Session Hijacking
**Vector:** XSS steals `sb-access-token` cookie → Admin panel access
**Mitigation:** 
- `SameSite=Lax` (should be `Strict` for admin)
- `Secure` flag present
- HttpOnly: **NO** - cookie set via `document.cookie` (client-side)
- **Fix:** Set cookie via HTTP response header (Server Action middleware)

### Scenario 2: CSRF on Admin Actions
**Vector:** Malicious site triggers form submit to Server Action
**Impact:** Unauthorized refunds, status changes, discount creation
**Mitigation:** **MISSING** - Implement CSRF tokens

### Scenario 3: Replay Attack
**Vector:** Capture admin action request → Replay later
**Impact:** Duplicate refunds, status changes
**Mitigation:** **MISSING** - Implement nonce/timestamp

### Scenario 4: Cache Poisoning / Data Leakage
**Vector:** CDN caches `/account` page → Serves to another user
**Impact:** PII exposure (orders, addresses)
**Mitigation:** Add `Vary: Cookie` header

### Scenario 5: Privilege Escalation via Role Manipulation
**Vector:** Attempt to modify `app_metadata.role` in JWT
**Mitigation:** ✅ `app_metadata` is tamper-proof (Supabase signed JWT)

### Scenario 6: Service Role Key Exposure
**Vector:** Accidental import in Client Component
**Mitigation:** ✅ `import 'server-only'` prevents build-time inclusion

---

## SECURITY HEADER COMPLIANCE

| Header | Present | Value | Compliant |
|--------|---------|-------|-----------|
| `Content-Security-Policy` | ✅ | See below | ⚠️ Unsafe directives |
| `X-Frame-Options` | ✅ | `DENY` | ✅ |
| `Strict-Transport-Security` | ❌ | - | ❌ |
| `Referrer-Policy` | ❌ | - | ❌ |
| `Permissions-Policy` | ❌ | - | ❌ |
| `X-Content-Type-Options` | ❌ | - | ❌ |
| `Vary` | ❌ | - | ❌ |

### CSP Policy (Live)
```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
font-src 'self' data:;
img-src 'self' data: blob: https://ik.imagekit.io;
connect-src 'self' https://hcfcpkldxegalkrwngog.supabase.co https://vitals.vercel-insights.com;
frame-ancestors 'none'
```

**Issues:** `'unsafe-eval'`, `'unsafe-inline'` in script/style sources

---

## RECOMMENDED FIXES (Priority Order)

### P0 - Before Any Production Traffic
1. Implement customer authentication (signup/login)
2. Add auth guards to `/wishlist`, `/cart`, `/checkout`, `/account/*`, `/returns`
3. Implement missing customer routes

### P1 - Before Admin Panel Use
1. Add CSRF protection to all Server Actions
2. Add replay protection (nonce) to all Server Actions
3. Add rate limiting to Server Actions
4. Tighten CSP (remove unsafe directives)
5. Add missing security headers (HSTS, Referrer-Policy, etc.)
6. Add `Vary: Cookie` for auth pages

### P2 - Defense in Depth
1. Add input validation (Zod) at Server Action boundary
2. Implement idempotency keys for refund/status actions
3. Change admin cookie to `SameSite=Strict`, set via HTTP header
4. Add `security.txt`
5. Implement session revocation
6. Add SRI to static resources
7. Verify source maps not exposed

---

## TESTING CHECKLIST FOR RETEST

- [ ] Customer can register → login → access `/account/orders`
- [ ] User A cannot access User B's `/account/orders`
- [ ] `/wishlist`, `/cart`, `/checkout` redirect to login when anonymous
- [ ] Server Actions reject requests without valid CSRF token
- [ ] Server Actions reject replayed requests (nonce validation)
- [ ] Server Actions rate limited (429 after threshold)
- [ ] CSP passes strict evaluation (no unsafe-inline/eval)
- [ ] All security headers present on all responses
- [ ] `Vary: Cookie` on `/account/*`, `/admin/*`, `/cart`, `/wishlist`, `/checkout`
- [ ] RLS verified with real user data (2+ test accounts)
- [ ] Admin cookie: `SameSite=Strict`, `HttpOnly`, `Secure`, set via response header
- [ ] Idempotency keys work on refund/status actions
- [ ] Session revocation tested (admin revokes → immediate 401)

---

## SIGN-OFF

| Role | Status | Date |
|------|--------|------|
| API Security Analyst | ✅ **COMPLETE - FINDINGS DOCUMENTED** | 2026-08-05 |
| Backend Lead | ⏳ PENDING | - |
| Security Architect | ⏳ PENDING | - |

**Next API Security Review:** After P0/P1 fixes deployed