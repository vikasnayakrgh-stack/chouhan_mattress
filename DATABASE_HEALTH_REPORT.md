# Database Health & PostgreSQL / Supabase Schema Audit Report

**Date:** 2026-08-03  
**Auditor:** Staff Backend & PostgreSQL/Supabase Architect  
**Target Migrations:** `supabase/migrations/0001` through `0004`  
**Database Project Ref:** `hcfcpkldxegalkrwngog`  

---

## Executive Summary

This report evaluates the health, performance, normalization, security, and transaction safety of the PostgreSQL database schema for Chouhan Mattress (Wakefit clone).

The schema comprises 17 tables across two phase migrations (`0001_init_admin_schema_fixed.sql` and `0004_phase_b_extensions.sql`), featuring custom Enum types, Row Level Security (RLS) policies, and `set_updated_at()` trigger automation. 

While the schema provides a solid foundational model, key architectural bottlenecks exist—specifically around **denormalized JSONB columns**, **missing composite indexes for complex filtering**, **lapses in audit timestamps**, and **client-driven multi-table mutations lacking database-level transactions**.

---

## 1. Schema Quality & Foreign Key Inventory

| Table Name | Primary Key | Foreign Key Constraints | Soft Delete Strategy | Audit Timestamps | RLS Enabled |
|------------|-------------|-------------------------|----------------------|------------------|-------------|
| `staff` | `id` (uuid) | None (`auth_user_id` uuid unique) | `status` check (`active`,`invited`,`disabled`) | `created_at`, `updated_at` | ✅ Yes |
| `categories` | `id` (uuid) | `parent_id` ➔ `categories(id)` ON DELETE SET NULL | `status` enum (`active`,`inactive`) | `created_at` (❌ Missing `updated_at`) | ✅ Yes |
| `collections` | `id` (uuid) | None | `status` enum (`active`,`inactive`) | `created_at` (❌ Missing `updated_at`) | ✅ Yes |
| `products` | `id` (uuid) | `category_id` ➔ `categories(id)` ON DELETE SET NULL | `status` enum (`active`,`draft`,`archived`) | `created_at`, `updated_at` | ✅ Yes |
| `product_variants` | `id` (uuid) | `product_id` ➔ `products(id)` ON DELETE CASCADE | `status` check (`active`,`inactive`) | ❌ Neither | ✅ Yes |
| `customers` | `id` (uuid) | None | `status` enum (`active`,`inactive`,`blocked`) | `created_at` (❌ Missing `updated_at`) | ✅ Yes |
| `orders` | `id` (uuid) | `customer_id` ➔ `customers(id)` ON DELETE SET NULL | Enum (`cancelled`) | `created_at`, `updated_at` | ✅ Yes |
| `returns` | `id` (uuid) | `order_id` ➔ `orders(id)` SET NULL<br>`customer_id` ➔ `customers(id)` SET NULL | Enum (`rejected`) | `created_at`, `updated_at` | ✅ Yes |
| `discounts` | `id` (uuid) | None | Enum (`disabled`,`expired`) | `created_at`, `updated_at` | ✅ Yes |
| `inventory` | `id` (uuid) | `product_id` ➔ `products(id)` CASCADE<br>`variant_id` ➔ `product_variants(id)` CASCADE | Enum (`out_of_stock`) | `updated_at` (❌ Missing `created_at`) | ✅ Yes |
| `stock_adjustments` | `id` (uuid) | `inventory_item_id` ➔ `inventory(id)` SET NULL | N/A | `created_at` | ✅ Yes |
| `audit_logs` | `id` (uuid) | `actor_id` ➔ `staff(id)` ON DELETE SET NULL | N/A | `created_at` | ✅ Yes |
| `cms_content` | `id` (uuid) | None | Status check (`active`,`inactive`,`archived`) | `created_at`, `updated_at` | ✅ Yes |
| `seo_pages` | `id` (uuid) | None (loose `entity_id`) | N/A | `created_at`, `updated_at` | ✅ Yes |
| `app_settings` | `id` (uuid) | None | N/A | `created_at`, `updated_at` | ✅ Yes |
| `reviews` | `id` (uuid) | `product_id` ➔ `products(id)` CASCADE<br>`customer_id` ➔ `customers(id)` CASCADE<br>`order_id` ➔ `orders(id)` SET NULL | Enum (`rejected`,`spam`) | `created_at`, `updated_at` | ✅ Yes |
| `analytics_snapshots` | `id` (uuid) | None | N/A | `created_at`, `updated_at` | ✅ Yes |

---

## 2. Analysis of Denormalization & JSONB Storage

The schema heavily relies on JSONB columns to simplify TypeScript serialization:
- `products.collection_ids` (array of collection UUIDs)
- `products.tags`, `products.images`, `products.options`, `products.seo`, `products.mattress_attributes`
- `customers.addresses`, `customers.notes`
- `orders.items`, `orders.shipping_address`, `orders.billing_address`, `orders.timeline`, `orders.refunds`
- `returns.items`, `returns.timeline`, `returns.images`

### Risk & Trade-off Analysis:
1. **`orders.items` (JSONB) vs `order_items` Table**:
   - *Current Risk*: Prevents Foreign Key enforcement between ordered line items and `product_variants(id)`. If a variant price or SKU changes, historical line item data in JSON remains intact, but database cannot prevent invalid variant IDs from being inserted.
   - *Recommendation*: Retain embedded JSONB for historical immutable line items, but validate `variant_id` at service level or consider a dedicated `order_items` join table for high-scale relational querying.

2. **`products.collection_ids` (JSONB) vs `product_collections` Join Table**:
   - *Current Risk*: Filtering products by collection requires `collection_ids @> '"<uuid>"'::jsonb`, which cannot utilize standard B-Tree FK indexes and requires GIN indexing.
   - *Recommendation*: Add GIN index `idx_products_collection_ids` on `products USING gin(collection_ids)`.

---

## 3. Composite Index Audit & Performance Optimization

Existing migrations include single-column B-Tree indexes (`idx_products_category`, `idx_orders_customer`, etc.). However, high-frequency admin queries filter and sort on multiple columns simultaneously.

### Recommended New Composite Indexes (SQL Fixes)

```sql
-- 1. Product Listing & Filter Optimization (Category + Status + Created)
CREATE INDEX IF NOT EXISTS idx_products_cat_status_created 
ON products(category_id, status, created_at DESC);

-- 2. Product Search by Name/Code Fuzzy Search (pg_trgm)
CREATE INDEX IF NOT EXISTS idx_products_name_trgm 
ON products USING gin(name gin_trgm_ops);

-- 3. Order Management Filtering (Status + Created)
CREATE INDEX IF NOT EXISTS idx_orders_status_created 
ON orders(status, created_at DESC);

-- 4. Customer Order History Lookup
CREATE INDEX IF NOT EXISTS idx_orders_customer_created 
ON orders(customer_id, created_at DESC);

-- 5. Product Reviews Moderation & PLP Display
CREATE INDEX IF NOT EXISTS idx_reviews_product_status 
ON reviews(product_id, status, created_at DESC);

-- 6. Dynamic Coupon Code Validation
CREATE INDEX IF NOT EXISTS idx_discounts_code_status 
ON discounts(code, status);

-- 7. GIN Index for JSONB Collection Queries
CREATE INDEX IF NOT EXISTS idx_products_collection_ids_gin 
ON products USING gin(collection_ids);
```

---

## 4. Audit Timestamp & Trigger Remediation

To fix missing `updated_at` columns and triggers across `categories`, `collections`, and `customers`:

```sql
-- Add missing updated_at columns
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE collections ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS trg_categories_updated ON categories;
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_collections_updated ON collections;
CREATE TRIGGER trg_collections_updated BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_customers_updated ON customers;
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_variants_updated ON product_variants;
CREATE TRIGGER trg_variants_updated BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

## 5. Transaction Safety & Stored Procedures (RPC)

Currently, creating an order requires two HTTP requests from the server (upserting customer, inserting order). If the second call fails, an orphaned customer is created without an order.

### Recommended PostgreSQL Stored Procedure for Atomic Order Creation

```sql
CREATE OR REPLACE FUNCTION create_order_transaction(
  p_order_number text,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_items jsonb,
  p_subtotal numeric,
  p_discount numeric,
  p_shipping_fee numeric,
  p_tax numeric,
  p_total numeric,
  p_shipping_address jsonb,
  p_billing_address jsonb
) RETURNS jsonb AS $$
DECLARE
  v_customer_id uuid;
  v_order_id uuid;
  v_result jsonb;
BEGIN
  -- 1. Upsert Customer
  INSERT INTO customers (name, phone, email, addresses, created_at, updated_at)
  VALUES (p_customer_name, p_customer_phone, p_customer_email, jsonb_build_array(p_shipping_address), now(), now())
  ON CONFLICT (phone) DO UPDATE 
    SET name = EXCLUDED.name,
        email = COALESCE(EXCLUDED.email, customers.email),
        updated_at = now()
  RETURNING id INTO v_customer_id;

  -- 2. Insert Order
  INSERT INTO orders (
    order_number, customer_id, customer_name, customer_phone, customer_email,
    items, subtotal, discount, shipping_fee, tax, total,
    shipping_address, billing_address, status, payment_status, created_at, updated_at
  ) VALUES (
    p_order_number, v_customer_id, p_customer_name, p_customer_phone, p_customer_email,
    p_items, p_subtotal, p_discount, p_shipping_fee, p_tax, p_total,
    p_shipping_address, p_billing_address, 'new', 'pending', now(), now()
  ) RETURNING id INTO v_order_id;

  -- 3. Return Combined Payload
  v_result := jsonb_build_object(
    'order_id', v_order_id,
    'customer_id', v_customer_id,
    'order_number', p_order_number
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 6. Summary of Action Items

1. **Apply Migration 0005**: Deploy the composite index SQL and audit trigger fixes above.
2. **Soft Delete Standardization**: Enforce `status != 'archived'` in `SupabaseProductRepository.getAll()` and `search()`.
3. **RPC Migration**: Upgrade `src/app/api/checkout/create-order/route.ts` to call `rpc('create_order_transaction', ...)` for 100% transactional guarantees.
