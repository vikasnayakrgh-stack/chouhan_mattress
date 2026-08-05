# AUTHORIZATION MATRIX & API SECURITY MATRIX

## 1. System Authorization Matrix (RBAC)

| Role / Identity | Storefront (`/`) | Customer Dashboard (`/account`) | Admin Pages (`/admin/*`) | Admin APIs (`/api/admin/*`) | Checkout (`/api/checkout/*`) |
|---|---|---|---|---|---|
| **Anonymous** | 🟢 ALLOW | 🔴 REDIRECT (Auth Form) | 🔴 DENY (401) | 🔴 DENY (401) | 🟢 ALLOW (Authoritative) |
| **Customer** | 🟢 ALLOW | 🟢 ALLOW (Own Data Only) | 🔴 DENY (403) | 🔴 DENY (403) | 🟢 ALLOW (Authoritative) |
| **Staff / Viewer** | 🟢 ALLOW | 🟢 ALLOW | 🟢 ALLOW (Read Only) | 🟢 ALLOW (Read Only) | 🟢 ALLOW |
| **Manager / Admin** | 🟢 ALLOW | 🟢 ALLOW | 🟢 ALLOW (Full Access) | 🟢 ALLOW (Full Access) | 🟢 ALLOW |
| **Owner** | 🟢 ALLOW | 🟢 ALLOW | 🟢 ALLOW (Full Access) | 🟢 ALLOW (Full Access) | 🟢 ALLOW |

---

## 2. API Security & Validation Matrix

| Endpoint | HTTP Method | Access Level | Rate Limit | Input Schema | Authorization Mechanism |
|---|---|---|---|---|---|
| `/api/checkout/create-order` | POST | Public | 5 req / min / IP | `createOrderPayloadSchema` (Zod) | Server-Authoritative Calculation |
| `/api/admin/products` | GET / POST | Staff | 30 req / min / IP | `productSchema` (Zod) | Edge Middleware + `requireAdminRole` |
| `/api/admin/orders` | GET / PATCH | Staff | 30 req / min / IP | `orderStatusSchema` (Zod) | Edge Middleware + `requireAdminRole` |
| `/api/admin/customers` | GET | Staff | 30 req / min / IP | None (Read) | Edge Middleware + `requireAdminRole` |
| `/api/admin/returns` | GET / PATCH | Staff | 30 req / min / IP | `returnStatusSchema` (Zod) | Edge Middleware + `requireAdminRole` |

---

## 3. RLS Runtime Policy Verification Matrix

| Database Table | Role | Operation | RLS Policy Name | Status | Policy Behavior |
|---|---|---|---|---|---|
| `orders` | Anonymous | SELECT | `orders_anon_deny` | **PASS** | Returns empty array (`USING (false)`) |
| `orders` | Customer | SELECT | `orders_customer_select` | **PASS** | Returns records where `user_id = auth.uid()` |
| `orders` | Staff | ALL | `orders_staff_access` | **PASS** | Full CRUD granted if `is_staff()` is true |
| `customers` | Anonymous | SELECT | `customers_anon_deny` | **PASS** | Returns empty array (`USING (false)`) |
| `customers` | Customer | SELECT / UPDATE | `customers_self_select` | **PASS** | Allows access where `auth_user_id = auth.uid()` |
| `products` | Public | SELECT | `products_public_read` | **PASS** | Allows SELECT where `status = 'active'` |
| `products` | Staff | ALL | `products_staff_write` | **PASS** | Full CRUD granted if `is_staff()` is true |
