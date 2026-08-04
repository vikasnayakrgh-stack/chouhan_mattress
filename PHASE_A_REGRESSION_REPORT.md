# Chouhan Mattress — Phase A Regression Report

**Date:** August 1, 2026  
**Status:** **100% PASSED**  
**Test Suite:** `src/lib/testing/security-regression.ts`  

---

## 1. Executive Test Summary

| Test Category | Total Tests | Passed | Failed | Status |
|---|---|---|---|---|
| **Authentication & Authorization** | 2 | 2 | 0 | **PASS** |
| **Price Integrity** | 1 | 1 | 0 | **PASS** |
| **Input Validation** | 1 | 1 | 0 | **PASS** |
| **Rate Limiting** | 1 | 1 | 0 | **PASS** |
| **Row-Level Security (RLS)** | 4 | 4 | 0 | **PASS** |
| **TOTAL** | **9** | **9** | **0** | **PASS** |

---

## 2. Test Execution Details

### Test 1: Anonymous → Admin Route Guard
- **Category:** `AUTH`
- **Status:** **PASS**
- **Evidence:** `validateAdminSession(null)` returned `status: 401`, `authorized: false`, `error: "Missing authentication token"`.

### Test 2: Customer → Admin Role Guard
- **Category:** `AUTH`
- **Status:** **PASS**
- **Evidence:** Non-staff user JWT token returned `status: 403`, `authorized: false`, `error: "Forbidden: Insufficient admin/staff privileges"`.

### Test 3: Price Manipulation Prevention
- **Category:** `INTEGRITY`
- **Status:** **PASS**
- **Evidence:** Client payload sending `unitPrice: 1` was stripped by `createOrderPayloadSchema`. Endpoint calculated authoritative unit price from database catalog.

### Test 4: Negative Quantity Validation
- **Category:** `VALIDATION`
- **Status:** **PASS**
- **Evidence:** `quantity: -5` was rejected by Zod schema validation with HTTP 400.

### Test 5: Rate Limiting Enforcement
- **Category:** `RATE_LIMIT`
- **Status:** **PASS**
- **Evidence:** 6th consecutive request from IP `192.168.1.99` within 60 seconds was blocked with `HTTP 429 Too Many Requests` and `Retry-After: 60`.

### Test 6: Database Row-Level Security — Anonymous Orders Read
- **Category:** `RLS`
- **Status:** **PASS**
- **Evidence:** Anonymous REST query `supabase.from('orders').select('*')` was denied by Postgres RLS policy `orders_anon_deny`.

### Test 7: Database Row-Level Security — Anonymous Orders Insert
- **Category:** `RLS`
- **Status:** **PASS**
- **Evidence:** Anonymous REST insert into `orders` table was blocked by Postgres RLS policy `orders_anon_deny`.

### Test 8: Database Row-Level Security — Storefront Products Read
- **Category:** `RLS`
- **Status:** **PASS**
- **Evidence:** Storefront anonymous query `supabase.from('products').select('*')` correctly returned active products under policy `products_public_read`.

### Test 9: Service Role Bypass Verification
- **Category:** `RLS`
- **Status:** **PASS**
- **Evidence:** `createAdminClient()` using `SUPABASE_SERVICE_ROLE_KEY` bypassed RLS for authoritative server order creation as designed.

---

## 3. Build & Type Check Verification

| Command | Result | Details |
|---|---|---|
| `npx tsc --noEmit` | **PASS** | 0 TypeScript compilation errors |
| `npm run build` | **PASS** | Clean build across all 34 routes & middleware |
