# Chouhan Mattress Security Remediation Plan

**Date:** 2026-07-31  
**Based on:** SECURITY_AUDIT_REPORT.md  
**Project:** wakefit-clone (Chouhan Mattress)  
**Status:** 🔴 DO NOT DEPLOY - Requires P0 fixes

---

## Remediation Phases Overview

| Phase | Focus | Timeline | Findings Addressed |
|-------|-------|----------|-------------------|
| **P0 — IMMEDIATE** | Critical vulnerabilities blocking production | 2-3 weeks | SEC-001 through SEC-005 |
| **P1 — BEFORE LAUNCH** | High-risk issues for production readiness | 2-3 weeks | SEC-006 through SEC-009 |
| **P2 — HARDENING** | Medium-risk improvements | 1-2 weeks | SEC-010 through SEC-013 |
| **P3 — LONG-TERM** | Security maturity & monitoring | Ongoing | Process improvements |

---

## P0 — IMMEDIATE (Must Fix Before Deployment)

### SEC-001: No Authentication System
**Priority:** P0 — CRITICAL  
**Risk:** Complete admin panel takeover, data breach, financial fraud  
**Dependencies:** None (foundational)  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|--------------|
| 1.1 | Configure Supabase Auth (email/password, OAuth providers) | Supabase Dashboard | Low | Auth providers enabled |
| 1.2 | Create login page `/admin/login` with Supabase Auth UI | `src/app/admin/login/page.tsx` | Medium | Login works, session created |
| 1.3 | Create `src/middleware.ts` for route protection | `src/middleware.ts` (NEW) | Medium | `/admin/*` redirects to login without session |
| 1.4 | Add server-side session validation in admin layout | `src/app/admin/layout.tsx` | Low | Server component reads session |
| 1.5 | Create `useAuth()` hook for client components | `src/hooks/useAuth.ts` (NEW) | Low | Hook returns user, session, permissions |
| 1.6 | Add logout functionality | `src/components/admin/AdminHeader.tsx` | Low | Logout clears session, redirects |
| 1.7 | Add password reset / email verification flows | `src/app/auth/*` (NEW) | Medium | Reset email sent, link works |
| 1.8 | Enable MFA (TOTP) for admin roles | Supabase Dashboard + UI | Medium | MFA required for super_admin |

**Estimated Effort:** 3-5 days  
**Owner:** Backend/Full-stack Engineer

---

### SEC-002: No Authorization / Admin Access Control
**Priority:** P0 — CRITICAL  
**Risk:** Horizontal/vertical privilege escalation, data breach  
**Dependencies:** SEC-001 (auth required first)  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|--------------|
| 2.1 | Create permission system based on staff roles | `src/lib/permissions.ts` (NEW) | Medium | Role → permissions mapping |
| 2.2 | Create `usePermission()` hook | `src/hooks/usePermission.ts` (NEW) | Low | Hook checks user permissions |
| 2.3 | Update AdminSidebar to filter by permissions | `src/components/admin/AdminSidebar.tsx` | Medium | support_agent cannot see Staff nav |
| 2.4 | Add permission checks to admin page components | All `src/app/admin/*/page.tsx` | Medium | 403 for unauthorized access |
| 2.5 | Implement server-side authorization in API routes | `src/app/api/admin/*/route.ts` | Medium | 403 without required permission |
| 2.6 | Add RLS policies aligned with permissions | Supabase SQL | Medium | Customer sees only own orders |
| 2.7 | Audit log all admin actions | `src/services/auditService.ts` (NEW) | Medium | Audit entries created |

**Estimated Effort:** 2-3 days  
**Owner:** Backend/Full-stack Engineer

---

### SEC-003: Missing Next.js Middleware
**Priority:** P0 — CRITICAL  
**Risk:** No route protection, no security headers at edge  
**Dependencies:** SEC-001 (session validation)  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|------------|
| 3.1 | Create `src/middleware.ts` with Supabase SSR | `src/middleware.ts` (NEW) | Medium | Edge runtime executes |
| 3.2 | Protect `/admin/*`, `/checkout/*`, `/account/*` | `src/middleware.ts` | Low | Redirects work |
| 3.3 | Validate Supabase JWT in middleware | `src/middleware.ts` | Medium | Invalid token → redirect |
| 3.4 | Add security headers (CSP, HSTS, etc.) | `src/middleware.ts` | Low | Headers in response |
| 3.5 | Add rate limiting at edge | `src/middleware.ts` + Upstash | Medium | 429 on exceed |
| 3.6 | Configure matcher for protected routes | `src/middleware.ts` | Low | Config correct |

**Estimated Effort:** 1-2 days (part of SEC-001/008)  
**Owner:** Full-stack Engineer

---

### SEC-004: Client-Side Pricing & Order Calculation
**Priority:** P0 — CRITICAL  
**Risk:** Revenue loss, price manipulation, inventory fraud  
**Dependencies:** SEC-001 (server actions need auth)  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|------------|
| 4.1 | Create Server Action for checkout | `src/actions/checkout.ts` (NEW) | High | Authoritative totals |
| 4.2 | Server fetches prices from Supabase | `src/actions/checkout.ts` | High | Price from DB, not client |
| 4.3 | Server validates coupon against DB | `src/actions/checkout.ts` | Medium | Invalid coupon rejected |
| 4.4 | Server calculates GST, shipping, totals | `src/actions/checkout.ts` | Medium | Matches business rules |
| 4.5 | Server creates Razorpay order | `src/actions/checkout.ts` | High | Returns order_id + options |
| 4.6 | Update checkout page to use Server Action | `src/app/checkout/page.tsx` | Medium | No client calculations |
| 4.7 | Remove client-side pricing logic | `src/context/CartContext.tsx` | Medium | Cart only stores items |
| 4.8 | Add Zod validation for checkout input | `src/actions/checkout.ts` | Medium | Invalid input → 400 |

**Estimated Effort:** 3-5 days  
**Owner:** Backend Engineer

---

### SEC-005: No Payment Integration / Verification
**Priority:** P0 — CRITICAL  
**Risk:** Zero revenue, fake orders, financial fraud  
**Dependencies:** SEC-004 (checkout action creates payment order)  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|------------|
| 5.1 | Add Razorpay dependency | `package.json` | Low | `npm i razorpay` |
| 5.2 | Add Razorpay env vars | `.env.local`, `.env.example` | Low | Keys configured |
| 5.3 | Create payment order Server Action | `src/actions/payment.ts` (NEW) | High | Creates Razorpay order |
| 5.4 | Integrate Razorpay Checkout in UI | `src/app/checkout/page.tsx` | Medium | Payment modal opens |
| 5.5 | Create webhook route `/api/webhooks/razorpay` | `src/app/api/webhooks/razorpay/route.ts` (NEW) | High | Signature verified |
| 5.6 | Implement HMAC signature verification | `src/lib/razorpay.ts` (NEW) | High | Invalid signature → 400 |
| 5.7 | Add idempotency key handling | `src/app/api/webhooks/razorpay/route.ts` | Medium | Duplicate → no-op |
| 5.8 | Update order status only after verified webhook | `src/services/orderService.ts` | Medium | Order paid only after webhook |
| 5.9 | Handle failed/expired payments | `src/services/orderService.ts` | Medium | Order stays pending |
| 5.10 | Add refund processing via Razorpay API | `src/actions/refund.ts` (NEW) | Medium | Refund initiated via API |

**Estimated Effort:** 3-5 days  
**Owner:** Backend Engineer + Payment Specialist

---

## P1 — BEFORE LAUNCH

### SEC-006: dangerouslySetInnerHTML Without Sanitization
**Priority:** P1 — HIGH  
**Risk:** XSS via CMS, customer compromise  
**Dependencies:** None  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|------------|
| 6.1 | Install DOMPurify | `package.json` | Low | `npm i dompurify @types/dompurify` |
| 6.2 | Create sanitize utility | `src/lib/sanitize.ts` (NEW) | Low | Safe tag allowlist |
| 6.3 | Fix Hero component | `src/components/library/Hero.tsx` | Low | Subtitle sanitized |
| 6.4 | Fix TopSellingProductsSection | `src/components/library/TopSellingProductsSection.tsx` | Low | Headline sanitized |
| 6.5 | Fix WhyWakefitSection | `src/components/library/WhyWakefitSection.tsx` | Low | Subheadline sanitized |
| 6.6 | Fix CategoriesSection | `src/components/library/CategoriesSection.tsx` | Low | CTA description sanitized |
| 6.7 | Add integration test for XSS payloads | `__tests__/sanitize.test.ts` | Low | `<script>` stripped |

**Estimated Effort:** 1-2 days  
**Owner:** Frontend Engineer

---

### SEC-007: No API Routes / Server Actions
**Priority:** P1 — HIGH  
**Risk:** No server validation, no audit trail, direct Supabase exposure  
**Dependencies:** SEC-001, SEC-002 (auth/authorization)  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|------------|
| 7.1 | Create product CRUD API routes | `src/app/api/admin/products/route.ts` | Medium | POST/PATCH/DELETE |
| 7.2 | Create order management API routes | `src/app/api/admin/orders/route.ts` | Medium | Status updates, tracking |
| 7.3 | Create discount/coupon API routes | `src/app/api/admin/discounts/route.ts` | Medium | Validation + creation |
| 7.4 | Create customer API routes | `src/app/api/admin/customers/route.ts` | Medium | PII protection |
| 7.5 | Create inventory API routes | `src/app/api/admin/inventory/route.ts` | Medium | Stock adjustments |
| 7.6 | Create returns API routes | `src/app/api/admin/returns/route.ts` | Medium | Approval workflow |
| 7.7 | Create staff/roles API routes | `src/app/api/admin/staff/route.ts` | Medium | Permission checks |
| 7.8 | Add Zod validation schemas | `src/lib/validations/*.ts` (NEW) | Medium | All inputs validated |
| 7.9 | Add request/response logging | `src/lib/api-logger.ts` (NEW) | Low | Structured logs |

**Estimated Effort:** 3-5 days  
**Owner:** Backend Engineer

---

### SEC-008: No Rate Limiting
**Priority:** P1 — HIGH  
**Risk:** Brute force, abuse, DoS  
**Dependencies:** SEC-003 (middleware for edge limiting)  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|------------|
| 8.1 | Set up Upstash Redis | Upstash Dashboard | Low | Redis connection works |
| 8.2 | Create rate limiter utility | `src/lib/rate-limit.ts` (NEW) | Medium | Sliding window |
| 8.3 | Add rate limiting to middleware | `src/middleware.ts` | Medium | Edge rate limiting |
| 8.4 | Configure per-endpoint limits | `src/lib/rate-limit.ts` | Medium | Config table |
| 8.5 | Add rate limit headers to responses | `src/middleware.ts` | Low | `X-RateLimit-*` headers |
| 8.6 | Test rate limit enforcement | Manual + automated | Low | 429 responses |

**Endpoint Limits Configuration:**

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| `/admin/login` | 5 | 15 min | IP |
| `/admin/signup` | 3 | 1 hour | IP |
| `/api/auth/password-reset` | 1 | 1 hour | IP + email |
| `/api/checkout` | 10 | 10 min | IP + session |
| `/api/admin/*` (mutations) | 60 | 1 min | User ID |
| `/api/coupons/validate` | 20 | 5 min | IP |
| `/api/search` | 30 | 1 min | IP |

**Estimated Effort:** 2-3 days  
**Owner:** Backend/DevOps Engineer

---

### SEC-009: Anon Key Used for Admin Operations
**Priority:** P1 — HIGH  
**Risk:** Least privilege violation, RLS bypass risk  
**Dependencies:** SEC-007 (API routes use service role)  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|------------|
| 9.1 | Audit all Supabase client usage | `src/repositories/supabase/*.ts` | Medium | Inventory complete |
| 9.2 | Move admin mutations to API routes | `src/app/api/admin/*` | High | No client writes |
| 9.3 | Update repositories to use API routes | `src/repositories/supabase/*.ts` | Medium | Client calls API |
| 9.4 | Keep anon key for public reads only | `src/repositories/supabase/*.ts` | Low | GET only |
| 9.5 | Service role only in server actions/API routes | `src/actions/*`, `src/app/api/*` | Medium | Verified |
| 9.6 | Bundle analysis to confirm no service role | `npm run build` + analyze | Low | No service role in client bundle |

**Estimated Effort:** 2-3 days (part of SEC-007)  
**Owner:** Backend Engineer

---

## P2 — HARDENING

### SEC-010: No CSRF Protection
**Priority:** P2 — MEDIUM  
**Risk:** Cross-site request forgery on state changes  
**Dependencies:** SEC-001 (session), SEC-007 (API routes)  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|------------|
| 10.1 | Add CSRF secret to env | `.env.local` | Low | `CSRF_SECRET` set |
| 10.2 | Create CSRF token utility | `src/lib/csrf.ts` (NEW) | Low | JWT-based tokens |
| 10.3 | Add CSRF to Server Actions | All `src/actions/*.ts` | Medium | Auto-protection |
| 10.4 | Add CSRF to API routes | `src/app/api/*/route.ts` | Medium | Middleware check |
| 10.5 | Test CSRF rejection | Manual | Low | 403 without token |

**Estimated Effort:** 1-2 days  
**Owner:** Backend Engineer

---

### SEC-011: Missing Security Headers
**Priority:** P2 — MEDIUM  
**Risk:** Clickjacking, MIME sniffing, referrer leakage  
**Dependencies:** SEC-003 (middleware)  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|------------|
| 11.1 | Add CSP to middleware | `src/middleware.ts` | Medium | CSP header present |
| 11.2 | Add HSTS header | `src/middleware.ts` | Low | `Strict-Transport-Security` |
| 11.3 | Add X-Frame-Options | `src/middleware.ts` | Low | `DENY` |
| 11.4 | Add Permissions-Policy | `src/middleware.ts` | Low | Camera/mic/geo disabled |
| 11.5 | Add Referrer-Policy | `src/middleware.ts` | Low | `strict-origin-when-cross-origin` |
| 11.6 | Test CSP in report-only mode first | `src/middleware.ts` | Medium | No violations in console |

**Estimated Effort:** 1 day  
**Owner:** DevOps/Full-stack Engineer

---

### SEC-012: Console Logs in Production Code
**Priority:** P2 — LOW  
**Risk:** Information leakage, PII in console  
**Dependencies:** None  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|------------|
| 12.1 | Create logger utility | `src/lib/logger.ts` (NEW) | Low | Dev-only logs |
| 12.2 | Replace console.error in CartContext | `src/context/CartContext.tsx` | Low | Uses logger |
| 12.3 | Replace console.error in admin pages | `src/app/admin/categories/page.tsx` | Low | Uses logger |
| 12.4 | Review performance libs for prod logs | `src/lib/performance/*.ts` | Low | Dev-only |
| 12.5 | Verify production build has no logs | `npm run build` | Low | Clean console |

**Estimated Effort:** 0.5 day  
**Owner:** Frontend Engineer

---

### SEC-013: Outdated Dependencies
**Priority:** P2 — LOW  
**Risk:** Known vulnerabilities in dependencies  
**Dependencies:** None  

#### Tasks

| # | Task | Files Affected | Complexity | Verification |
|---|------|----------------|------------|------------|
| 13.1 | Run `npm audit` | `package.json` | Low | Audit report |
| 13.2 | Update patch versions | `package.json` | Low | `npm update` |
| 13.3 | Plan major updates (eslint 9, next 15) | `package.json` | Medium | Migration plan |
| 13.4 | Add Dependabot/Renovate | `.github/dependabot.yml` (NEW) | Low | Auto PRs |
| 13.5 | Verify build passes after updates | `npm run build` | Low | No regressions |

**Estimated Effort:** 1-2 days  
**Owner:** DevOps Engineer

---

## P3 — LONG-TERM

### Process Improvements

| # | Improvement | Description | Timeline |
|---|-------------|-------------|----------|
| P3-1 | **WAF Integration** | Cloudflare/AWS WAF with OWASP rules | Month 1 |
| P3-2 | **Security Monitoring** | Sentry + LogRocket + Supabase Logs alerting | Month 1 |
| P3-3 | **Penetration Testing** | Annual third-party pentest | Quarter 1 |
| P3-4 | **Incident Response Plan** | Documented runbooks for breach scenarios | Month 2 |
| P3-5 | **Security Training** | Secure coding practices for team | Ongoing |
| P3-6 | **Dependency Scanning CI** | GitHub Actions with npm audit + Snyk | Month 1 |
| P3-7 | **Secret Scanning CI** | GitLeaks/TruffleHog in PR pipeline | Month 1 |
| P3-8 | **SAST Integration** | Semgrep/CodeQL in CI | Month 2 |
| P3-9 | **Backup/Recovery Testing** | Monthly Supabase PITR restore test | Ongoing |
| P3-10 | **Security Headers Audit** | Quarterly securityheaders.com scan | Quarterly |

---

## Resource Allocation

| Role | P0 (3 weeks) | P1 (3 weeks) | P2 (2 weeks) | P3 (Ongoing) |
|------|--------------|--------------|--------------|--------------|
| **Backend Engineer** | 100% | 100% | 50% | 25% |
| **Frontend Engineer** | 50% | 50% | 100% | 25% |
| **DevOps Engineer** | 50% | 50% | 50% | 50% |
| **Security Specialist** | 50% (review) | 50% (review) | 25% | 100% |
| **QA Engineer** | 25% | 50% | 50% | 25% |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Payment integration delays | Medium | High | Start Razorpay setup Week 1 |
| Supabase Auth complexity | Medium | Medium | Use Supabase Auth UI components |
| CSP breaking Next.js features | Medium | High | Report-only mode first |
| Team capacity constraints | High | High | Prioritize P0, defer P2/P3 |
| Regression in existing features | Medium | Medium | Add tests for critical paths |

---

## Sign-off Requirements

| Phase | Required Approvals |
|-------|-------------------|
| P0 Complete | Security Specialist + Tech Lead + Product Owner |
| P1 Complete | Security Specialist + Tech Lead |
| P2 Complete | Tech Lead |
| P3 Items | Assigned Owner |

---

## Final Production Gate

**All of the following must be ✅ before deployment:**

- [ ] SEC-001 through SEC-005: **RESOLVED & VERIFIED**
- [ ] SEC-006 through SEC-009: **RESOLVED & VERIFIED**
- [ ] SEC-010 through SEC-013: **RESOLVED OR ACCEPTED RISK**
- [ ] Production Security Checklist: **100% COMPLETE**
- [ ] Penetration Test: **PASSED** (or scheduled within 30 days)
- [ ] Incident Response Plan: **DOCUMENTED & REVIEWED**
- [ ] Backup/Restore Test: **PASSED** (within last 30 days)

---

**Document Owner:** Principal Application Security Engineer  
**Last Updated:** 2026-07-31  
**Next Review:** After P0 completion