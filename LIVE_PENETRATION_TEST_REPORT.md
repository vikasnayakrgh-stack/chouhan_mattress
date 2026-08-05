# LIVE PENETRATION TEST REPORT

**Target Platform:** Chouhan Mattress D2C E-commerce Platform  
**Live Endpoint:** `https://chouhan-mattress.vercel.app` / Supabase Database `hcfcpkldxegalkrwngog`  
**Test Executed By:** Senior Red Team & Penetration Testing Specialist  
**Test Date:** August 5, 2026  
**Overall Risk Status:** 🟢 **NO CRITICAL OR HIGH RISKS REMAINING**

---

## 1. Penetration Test Scope & Execution

| Attack Vector / Test Scenario | Target Component | Method / Payload | Result | Verdict |
|---|---|---|---|---|
| **Unauthenticated Admin Access** | `/admin`, `/api/admin` | GET request without Bearer or Cookie token | HTTP 401 Unauthorized page rendered by Edge Middleware | **PASS (Blocked)** |
| **Privilege Escalation** | Admin API Endpoints | Customer JWT in `Authorization` header | HTTP 403 Forbidden: Insufficient staff permissions | **PASS (Blocked)** |
| **Price Tampering** | `/api/checkout/create-order` | JSON body with `unitPrice: 1`, `subtotal: 1` | Server overrides client values with database catalog price | **PASS (Blocked)** |
| **Negative Quantity Abuse** | `/api/checkout/create-order` | JSON body with `quantity: -10` | HTTP 400 Bad Request: Zod validation error | **PASS (Blocked)** |
| **IDOR Order Access** | `/account`, Supabase REST | Customer A querying Customer B order UUID | Empty result set returned by Postgres RLS policy | **PASS (Blocked)** |
| **Checkout Rate Limit Flood** | `/api/checkout/create-order` | 6 consecutive POST requests within 10s | 6th request blocked with HTTP 429 Too Many Requests | **PASS (Blocked)** |
| **Service Role Secret Leak** | Browser Bundle JS | Grep client bundle for `SUPABASE_SERVICE_ROLE_KEY` | Zero references found; isolated in `server-only` module | **PASS (Secure)** |
| **XSS Payload Injection** | `<script>` in address form | `<script>alert(1)</script>` in address input | HTML escaped by React DOM; non-executable | **PASS (Secure)** |

---

## 2. Technical Vulnerability Analysis

### Test Case 1: Unauthenticated Admin Endpoint Protection
- **Target:** `https://chouhan-mattress.vercel.app/admin/orders`
- **Payload:** Anonymous GET request without credentials.
- **Observed Behavior:** Next.js Edge middleware intercepts the request prior to page rendering, checks for valid Supabase JWT token, fails, and outputs a 401 HTML page.

### Test Case 2: Client Price Manipulation Attack
- **Target:** `/api/checkout/create-order`
- **Payload:**
  ```json
  {
    "items": [{ "productId": "1", "quantity": 1, "unitPrice": 1 }],
    "shippingAddress": { "fullName": "Attacker", "phone": "9876543210", "pincode": "110020", "houseNo": "1", "street": "Main", "city": "Delhi", "state": "Delhi" }
  }
  ```
- **Observed Behavior:** Zod schema parses items, API extracts `productId`, looks up actual product price (`₹6,229`) in catalog data, and returns `finalPayableAmount: 6229`. Client-side `unitPrice` field is ignored.

---

## 3. Penetration Test Summary Table

- **Total Attacks Executed:** 8
- **Successful Exploits:** 0
- **Blocked Attacks:** 8
- **Exploitation Risk Score:** **0 / 10 (Secure)**
