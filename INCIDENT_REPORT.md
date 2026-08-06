# INCIDENT REPORT
## Chouhan Mattress E-commerce Platform - Security Verification Findings
**Incident ID:** SEC-2026-0805-001  
**Classification:** CRITICAL - Missing Authentication & Authorization Controls  
**Report Date:** August 5, 2026  
**Reported By:** Automated Security Verification Sprint  
**Status:** OPEN - Remediation Required

---

## INCIDENT SUMMARY

During the P0 Production Security Verification Sprint against the live deployment at https://chouhan-mattress.vercel.app, **three critical security incidents** were identified that prevent the application from being considered production-ready. These incidents represent fundamental gaps in authentication and authorization controls.

---

## INCIDENT 1: Complete Absence of Customer Authentication Flow

### Details
- **Severity:** CRITICAL (CVSS 9.1)
- **Component:** Customer Portal (`/signup`, `/login`, `/register`, `/account/*`)
- **Discovery:** All authentication routes return HTTP 404 Not Found
- **Impact:** Zero customer self-service capability; no user data isolation possible

### Technical Root Cause
The Next.js App Router is missing route handlers for:
- `src/app/signup/page.tsx` - Customer registration
- `src/app/login/page.tsx` - Customer login  
- `src/app/register/page.tsx` - Alternative registration
- `src/app/account/orders/page.tsx` - Order history
- `src/app/account/profile/page.tsx` - Profile management
- `src/app/account/address/page.tsx` - Address book
- `src/app/returns/page.tsx` - Returns management

### Evidence
```bash
curl -s -o /dev/null -w "%{http_code}" https://chouhan-mattress.vercel.app/signup    # 404
curl -s -o /dev/null -w "%{http_code}" https://chouhan-mattress.vercel.app/login     # 404
curl -s -o /dev/null -w "%{http_code}" https://chouhan-mattress.vercel.app/register  # 404
curl -s -o /dev/null -w "%{http_code}" https://chouhan-mattress.vercel.app/account/orders  # 404
```

### Business Impact
- Customers cannot create accounts
- No order history access
- No profile/address management
- No returns processing
- Cart/Wishlist/Checkout show shared demo data only
- **Revenue impact:** Complete inability to process authenticated orders

### Remediation Required
1. Implement Supabase Auth registration flow (email/password + OAuth)
2. Implement customer login flow with JWT token management
3. Create all missing customer portal routes with auth guards
4. Integrate with existing Supabase RLS policies
5. Test cross-user data isolation with minimum 2 test accounts

### Estimated Effort: 2-3 sprints
### Target Completion: Sprint 2

---

## INCIDENT 2: Unauthenticated Access to User-Specific Features

### Details
- **Severity:** CRITICAL (CVSS 7.5)
- **Component:** `/wishlist`, `/cart`, `/checkout`
- **Discovery:** Routes render without authentication, displaying shared demo data
- **Impact:** Privacy violation; no user data isolation; business logic untestable

### Technical Root Cause
Client components (`/wishlist`, `/cart`, `/checkout`) use local/demo state instead of:
1. Checking authentication status via Supabase
2. Fetching user-specific data from Supabase (RLS-protected tables)
3. Redirecting to login when unauthenticated

### Evidence
```bash
# Direct access shows data without auth
curl -s https://chouhan-mattress.vercel.app/wishlist  # Shows "3 Saved" items
curl -s https://chouhan-mattress.vercel.app/cart     # Shows "2 Items"
curl -s https://chouhan-mattress.vercel.app/checkout # Shows Step 1 of 3
```

### Current Implementation Issues
- `/wishlist/page.tsx` - Uses hardcoded demo data
- `/cart/page.tsx` - Uses hardcoded demo data  
- `/checkout/page.tsx` - No auth guard, proceeds to shipping address

### Business Impact
- **Privacy:** All visitors see identical wishlist/cart contents
- **Security:** No session isolation; potential for data leakage when auth added
- **UX:** Misleading - users think they have accounts when they don't
- **Compliance:** Violates data minimization principles

### Remediation Required
1. Add auth check at top of each page (Server Component or middleware)
2. Redirect to `/login` with `redirectTo` parameter when unauthenticated
3. Fetch user-specific data via Supabase client (RLS will enforce isolation)
4. Implement server-side cart/wishlist persistence (currently client-only)
5. Add loading states during auth verification

### Estimated Effort: 1 sprint (parallel with Incident 1)
### Target Completion: Sprint 1-2

---

## INCIDENT 3: Server Actions Missing Critical Security Controls

### Details
- **Severity:** HIGH (CVSS 7.1 combined)
- **Component:** `src/app/admin/actions.ts` (10 admin Server Actions)
- **Discovery:** Code review reveals missing CSRF, replay protection, rate limiting

### Technical Root Cause
Server Actions implemented with authentication/authorization but missing:
1. **CSRF Protection** - No token validation on mutating actions
2. **Replay Protection** - No nonce/timestamp validation
3. **Rate Limiting** - No request throttling per user/action

### Affected Actions
| Action | Risk Without CSRF | Risk Without Replay | Risk Without Rate Limit |
|--------|-------------------|---------------------|------------------------|
| `adminUpdateOrderStatusAction` | Status manipulation | Duplicate status changes | DoS on order management |
| `adminInitiateRefundAction` | **Unauthorized refunds** | **Duplicate refunds** | Refund abuse |
| `adminAdjustStockAction` | Inventory manipulation | Duplicate adjustments | Stock DoS |
| `adminCreateDiscountAction` | Discount abuse | Duplicate discounts | Coupon spam |
| `adminUpdateDiscountAction` | Discount manipulation | Replay updates | - |
| `adminDeleteDiscountAction` | Discount deletion | Replay deletions | - |
| `adminApproveReturnAction` | Return fraud | Duplicate approvals | - |
| `adminRejectReturnAction` | Return rejection | Duplicate rejections | - |
| `adminCreateBannerAction` | Content injection | Duplicate banners | - |
| `adminUpdateContentAction` | Content manipulation | Replay updates | - |

### Evidence (Code Review)
```typescript
// src/app/admin/actions.ts - Typical action pattern
export async function adminInitiateRefundAction(orderId: string, amount: number, token: string) {
  const { user, role } = await requireAdminRole(token, ['manager', 'admin', 'owner'])
  // NO CSRF token check
  // NO nonce/timestamp validation
  // NO rate limiting
  const result = await orderService.initiateRefund(orderId, amount, user.id)
  await logSecurityEvent({ action: 'REFUND_INITIATED', ... })
  return result
}
```

### Business Impact
- **Financial:** Unauthorized refunds via CSRF
- **Operational:** Duplicate operations via replay
- **Availability:** DoS via unlimited requests
- **Compliance:** Missing standard security controls

### Remediation Required
1. **CSRF Protection:** Implement double-submit cookie pattern or Next.js built-in
   - Generate CSRF token per session
   - Validate on all mutating Server Actions
2. **Replay Protection:** Add per-request nonce
   - Generate nonce with 5-minute TTL
   - Store in session/Redis, validate and consume on each action
3. **Rate Limiting:** Implement sliding window limiter
   - 10 requests/minute per user per action
   - Return 429 with retry-after header
4. **Input Validation:** Add Zod schemas at action boundary

### Estimated Effort: 1 sprint
### Target Completion: Sprint 2-3

---

## ADDITIONAL HIGH-SEVERITY FINDINGS (Not Blocking but Required)

### INCIDENT 4: Overly Permissive Content Security Policy
- **Severity:** HIGH (CVSS 6.1)
- **Finding:** `script-src 'unsafe-eval' 'unsafe-inline'`, `style-src 'unsafe-inline'`
- **Remediation:** Remove unsafe directives; use nonces/hashes

### INCIDENT 5: Missing Security Headers
- **Severity:** HIGH (CVSS 5.3)
- **Missing:** HSTS, Referrer-Policy, Permissions-Policy, Vary: Cookie, X-Content-Type-Options
- **Remediation:** Add via `next.config.js` headers()

### INCIDENT 6: Admin Cookie Security
- **Severity:** MEDIUM (CVSS 4.0)
- **Finding:** `SameSite=Lax`, set via `document.cookie` (not HttpOnly)
- **Remediation:** `SameSite=Strict`, set via HTTP response header

### INCIDENT 7: Potential Cache Leakage via Vercel Edge Cache (Phase 6)
- **Severity:** HIGH (CVSS 6.5)
- **Component:** Vercel Edge Cache / React Server Components
- **Discovery:** `Vary` header missing `Cookie`/`Authorization` for RSC payloads
- **Impact:** User A's RSC payload (potentially containing order data, addresses, etc.) could be cached and served to User B

### Technical Root Cause
Vercel edge cache uses `Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch` but **does not include `Cookie` or `Authorization`**. When React Server Components fetch user-specific data (orders, addresses, wishlist), the resulting RSC payload is cached at the edge. If two users request the same page (e.g., `/account/orders`) with different authentication states, they could receive the same cached payload containing the first user's data.

### Evidence
```bash
# From curl -I https://chouhan-mattress.vercel.app/account
Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch
# Missing: Cookie, Authorization
```

### Code Analysis
- Supabase client uses `autoRefreshToken: true`, `persistSession: true`
- `sb-access-token` cookie with `max-age=3600` (1 hour)
- Refresh tokens in `localStorage` with silent refresh
- RSC payloads for authenticated pages likely include user data

### Business Impact
- **Data leakage:** Order history, addresses, wishlist visible to wrong user
- **Compliance:** GDPR/privacy violation
- **Trust:** Critical for e-commerce

### Remediation Required
1. **Option A - Exclude user-specific pages from edge cache:** Add `Cache-Control: private, no-cache, no-store, must-revalidate` for authenticated routes via middleware
2. **Option B - Vary by auth state:** Modify Next.js config to include `Cookie` in `Vary` header for dynamic routes
3. **Option C - Use `unstable_noStore()`** in Server Components that fetch user data
4. **Verify with 2+ test accounts** after auth implementation

### Estimated Effort: 0.5 sprint
### Target Completion: Sprint 2 (parallel with auth)

---

## INCIDENT TIMELINE

| Date | Event |
|------|-------|
| 2026-08-05 18:40 | Security verification sprint initiated |
| 2026-08-05 18:41 | Phase 1: Customer auth routes return 404 |
| 2026-08-05 18:42 | Phase 1: Wishlist/cart/checkout accessible without auth |
| 2026-08-05 18:45 | Phase 3: No REST API layer discovered |
| 2026-08-05 19:13 | Phase 5: RLS verified on orders/products tables |
| 2026-08-05 19:23 | Phase 4: Server Actions missing CSRF/replay/rate-limit |
| 2026-08-05 19:25 | Phase 9: CSP and security headers analyzed |
| 2026-08-05 19:30 | All reports generated |

---

## ROOT CAUSE ANALYSIS

### Primary Root Cause
**Incomplete feature implementation** - The customer authentication and portal features were not implemented despite admin panel being functional. The application was deployed with:
- ✅ Admin panel (complete with auth, RBAC, Server Actions)
- ✅ Storefront (product catalog, public pages)
- ❌ Customer authentication (registration, login)
- ❌ Customer portal (orders, profile, address, returns)
- ❌ User-specific features (cart, wishlist, checkout)

### Contributing Factors
1. **No end-to-end testing** - Auth flow never validated in CI/CD
2. **Missing feature flags** - No `NEXT_PUBLIC_DATA_SOURCE` guard on customer routes
3. **Incomplete migration** - Local development used mock data; production deployment missed auth implementation
4. **No security gate** - Deployment pipeline lacks security verification step

---

## REGRESSION TEST PLAN

After remediation, the following tests must pass:

### Test Case TC-SEC-001: Customer Registration & Login
1. Navigate to `/signup`
2. Register with valid email/password
3. Verify email confirmation (if enabled)
4. Navigate to `/login`
5. Login with credentials
6. Verify redirect to `/account`
7. Verify session cookie set (`sb-access-token`)

### Test Case TC-SEC-002: Cross-User Data Isolation
1. Create Customer A account
2. Create Customer B account
3. Login as Customer A → Add item to wishlist
4. Login as Customer B → Verify wishlist empty
5. Repeat for cart, orders, addresses

### Test Case TC-SEC-003: Auth Guards on User Features
1. Anonymous → `/wishlist` → Redirect to `/login?redirectTo=/wishlist`
2. Anonymous → `/cart` → Redirect to `/login?redirectTo=/cart`
3. Anonymous → `/checkout` → Redirect to `/login?redirectTo=/checkout`
4. Anonymous → `/account/orders` → Redirect to `/login`

### Test Case TC-SEC-004: Server Action Security
1. Login as admin
2. Capture valid CSRF token
3. Submit action without CSRF → 403
4. Submit action with replayed nonce → 403
5. Exceed rate limit → 429

### Test Case TC-SEC-005: RLS Enforcement
1. Login as Customer A
2. Direct Supabase query: `SELECT * FROM orders WHERE customer_id = 'customer-b-id'`
3. Verify 0 rows returned
4. Repeat for cart_items, wishlist_items, addresses, returns

---

## RESPONSIBLE PARTIES

| Role | Responsibility |
|------|----------------|
| **Frontend Lead** | Implement customer auth routes, auth guards |
| **Backend Lead** | Server Action security controls (CSRF, replay, rate limit) |
| **DevOps** | Security headers in `next.config.js`, CI/CD security gate |
| **Security Engineer** | Retest verification, RLS audit with real accounts |
| **Product Owner** | Prioritize auth implementation in sprint planning |

---

## COMMUNICATION PLAN

| Audience | Message | Channel | Timing |
|----------|---------|---------|--------|
| Engineering Team | Critical auth gaps block production | Slack #security-alerts | Immediate |
| Product Owner | 2-3 sprint delay for auth implementation | Email + Sprint Planning | Today |
| Leadership | Security verification results, timeline | Executive Summary | EOD |
| Customers | N/A (pre-production) | N/A | N/A |

---

## TRACKING

| Metric | Target |
|--------|--------|
| **Incident Resolution** | All CRITICAL resolved before production |
| **Retest Pass Rate** | 100% of regression tests |
| **Security Gate** | Added to deployment pipeline |
| **Documentation** | Updated runbooks for auth flows |

---

## APPENDIX: RELATED ARTIFACTS

| Document | Location |
|----------|----------|
| Production Security Verification Report | `PRODUCTION_SECURITY_VERIFICATION_REPORT.md` |
| Live Penetration Test Report | `LIVE_PENETRATION_TEST_REPORT.md` |
| Authorization Matrix | `AUTHORIZATION_MATRIX.md` |
| API Security Matrix | `API_SECURITY_MATRIX.md` |
| RLS Runtime Verification | `RLS_RUNTIME_VERIFICATION.md` |
| RLS Test Script | `src/lib/testing/verify_rls.ts` |
| Middleware (Auth) | `src/middleware.ts` |
| Server Actions | `src/app/admin/actions.ts` |
| Admin Login | `src/app/admin/login/page.tsx` |

---

## SIGN-OFF

| Role | Name | Status | Date |
|------|------|--------|------|
| Security Engineer | Automated Verification Sprint | **REPORTED** | 2026-08-05 |
| Engineering Lead | - | ⏳ **ACKNOWLEDGED** | - |
| Product Owner | - | ⏳ **ACKNOWLEDGED** | - |
| Security Lead | - | ⏳ **REVIEW** | - |

**Next Review:** Sprint 1 Planning (Incident 1 & 2 remediation start)
**Final Closure:** After all regression tests pass on staging environment