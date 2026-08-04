# Chouhan Mattress — Production Security Checklist

**Date:** August 1, 2026  
**Project:** Chouhan Mattress D2C E-commerce  
**Stack:** Next.js 14.2.25, React 19.2.8, TypeScript, Supabase PostgreSQL  

---

## 🔴 Pre-Deployment Gate — ALL Must Be ✅

### Critical Vulnerabilities
- [x] **No Critical vulnerabilities** — SEC-001 (Admin Auth), SEC-002 (Client Pricing) FIXED
- [x] **No unresolved High vulnerabilities** — SEC-003 (Service Role Exposure) FIXED

### Secrets & Key Management
- [x] **No secrets exposed client-side** — `NEXT_PUBLIC_*` vars audit clean (only URL + anon key)
- [x] **Service-role key server-only** — `import 'server-only'` in `src/lib/supabase/server.ts` and `src/lib/supabase.ts`
- [x] **Service-role key never in browser bundle** — `createAdminClient` removed from `client.ts`
- [x] **No hardcoded credentials** — grep scan clean
- [x] **No secrets in Git history** — `git log --all -p` confirmed 0 exposures
- [x] **`.env.local` gitignored** — `.gitignore` contains `.env*.local`

### Database & Supabase Security
- [x] **All sensitive tables have RLS enabled** — 13 tables verified
- [x] **RLS policies enforce least privilege** — `is_staff()` for admin, `auth.uid()` for customer ownership
- [x] **Anonymous users blocked from admin tables** — `false` policy for `anon` role
- [x] **Customer orders ownership-checked** — `user_id = auth.uid()` policy in `0002_customer_rls_policies.sql`
- [x] **Comprehensive RLS migration applied** — `0003_comprehensive_rls_policies.sql`

### Authentication & Authorization
- [x] **Admin routes protected by middleware** — `src/middleware.ts` intercepts `/admin/*` and `/api/admin/*`
- [x] **JWT validation at edge** — `auth.getUser(token)` in middleware
- [x] **Role-based access control** — `app_metadata.role` checked against staff roles
- [x] **Server-side session validation** — `validateAdminSession()` in `adminAuth.ts`
- [x] **Unauthorized access returns 403** — Non-staff users blocked

### API & Server Actions
- [x] **Admin endpoints server-authorized** — Middleware + `requireAdminRole()` guard
- [x] **Checkout API server-authoritative** — `/api/checkout/create-order` calculates all totals
- [x] **Client-supplied prices ignored** — Only SKU IDs + quantities accepted
- [x] **Input validated server-side** — Zod schemas on checkout API
- [x] **Rate limiting enabled** — Sliding window limiter on order endpoint (5 req/min)
- [x] **Security audit logging** — JSON logger with PII & secret redaction

### Business Logic
- [x] **Prices calculated server-side** — Server fetches from DB, not client
- [x] **Coupons validated server-side** — Server checks against database
- [x] **GST calculated server-side** — 18% GST computed in API route
- [x] **Shipping calculated server-side** — Server computes based on subtotal threshold

### Frontend Security
- [ ] **dangerouslySetInnerHTML sanitized** — ⚠️ DOMPurify NOT yet integrated (4 components)
- [x] **No client-side secrets** — Service role not in browser bundle
- [ ] **CSP configured** — ⚠️ Headers added in middleware but CSP not fully tuned
- [x] **X-Frame-Options: DENY** — Set in middleware
- [x] **X-Content-Type-Options: nosniff** — Set in middleware
- [x] **Referrer-Policy** — Set in middleware

### Dependencies
- [x] **Next.js patched** — Upgraded from 14.2.0 to 14.2.25
- [x] **npm audit clean** — No critical vulnerabilities
- [x] **No suspicious packages** — All deps from verified sources

### Infrastructure & Configuration
- [x] **Middleware configured** — `src/middleware.ts` with route matcher
- [x] **Security headers in middleware** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [x] **Image config secured** — ImageKit loader, no wildcard remote patterns
- [x] **TypeScript strict mode** — `"strict": true` in tsconfig.json
- [x] **Production build passes** — `npm run build` exit 0, 34 routes

### Logging & Error Handling
- [x] **Security logger with redaction** — `security-logger.ts` redacts PII & secrets
- [x] **No stack traces to users** — Error responses sanitized
- [ ] **Console logs removed** — ⚠️ Some `console.error` remain in production code

### Testing
- [x] **Security regression suite** — 9-point automated test in `security-regression.ts`
- [x] **RLS verification script** — `verify_rls.ts` tests policy enforcement
- [x] **Build verification** — 0 TypeScript errors, 0 lint errors

---

## 🟡 Pre-Payment-Activation Gate

### Payment Integration (NOT YET IMPLEMENTED)
- [ ] **Razorpay/Stripe SDK installed** — No payment dependency in package.json
- [ ] **Server-generated payment orders** — Must use `finalPayableAmount` from checkout API
- [ ] **Webhook endpoint created** — `/api/webhooks/razorpay/route.ts` missing
- [ ] **HMAC signature verification** — Must verify `X-Razorpay-Signature`
- [ ] **Idempotency protection** — Must deduplicate webhook event IDs
- [ ] **Payment-to-order mapping** — Must verify amount + currency match
- [ ] **Order status updates only via webhook** — Never trust client `payment_success`
- [ ] **Failed payment handling** — Order stays `pending` on failure
- [ ] **Refund processing via API** — Server-side refund with audit logging

---

## 🟢 Post-Launch Hardening (P2/P3)

### Remaining P2 Items
- [ ] **DOMPurify integration** — Sanitize 4 `dangerouslySetInnerHTML` usages
- [ ] **Full CSP with nonces** — Content-Security-Policy tuned for Next.js
- [ ] **CSRF tokens on forms** — Server Actions auto-protect, custom forms need tokens
- [ ] **Remove console logs** — Replace with `logger` utility (dev-only)
- [ ] **Error boundaries** — Add `error.tsx` per route segment
- [ ] **Unit/integration tests** — Add Jest + React Testing Library
- [ ] **E2E tests** — Add Playwright for critical paths

### P3 Long-Term
- [ ] **WAF integration** — Cloudflare/AWS WAF with OWASP rules
- [ ] **Security monitoring** — Sentry + Supabase Logs alerting
- [ ] **Penetration testing** — Annual third-party pentest
- [ ] **Incident response plan** — Documented runbooks
- [ ] **Backup/restore testing** — Monthly Supabase PITR restore test
- [ ] **Dependency scanning CI** — Dependabot/Renovate
- [ ] **Secret scanning CI** — GitLeaks/TruffleHog in PR pipeline
- [ ] **SAST integration** — Semgrep/CodeQL in CI

---

## Final Deployment Verdict

| Category | Status |
|----------|--------|
| Critical Vulnerabilities | ✅ RESOLVED |
| High Vulnerabilities | ✅ RESOLVED |
| Auth & Authorization | ✅ VERIFIED |
| Database/RLS | ✅ VERIFIED |
| API Security | ✅ VERIFIED |
| Business Logic | ✅ VERIFIED |
| Payment Security | ⚠️ NOT YET TESTABLE (no integration) |
| Frontend Security | 🟡 PARTIAL (DOMPurify pending) |
| Dependencies | ✅ VERIFIED |
| Infrastructure | ✅ VERIFIED |

### Verdict: 🟡 PRODUCTION READY AFTER SPECIFIED FIXES

**The application is safe to deploy for:**
- Admin panel operations (auth-protected)
- Product browsing (public, RLS-enforced)
- Cart and checkout flow (server-authoritative pricing)

**NOT safe for:**
- Live payment processing (Razorpay/Stripe not integrated)
- CMS content rendering (DOMPurify not yet integrated)

**Minimum before accepting real orders:**
1. Integrate Razorpay with webhook verification
2. Add DOMPurify to 4 CMS components
3. Complete P2 hardening items

---

**Last Updated:** August 1, 2026  
**Auditor:** Principal Application Security Engineer  
**Next Review:** After P1/P2 completion or pre-launch