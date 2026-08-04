# Chouhan Mattress — Database Review

**Date:** August 1, 2026  
**Phase:** B — Production Backend  
**Database:** Supabase PostgreSQL (Project: hcfcpkldxegalkrwngog)  

---

## Schema Overview

### Tables Created (Migration 0001 + 0004)

| Table | RLS | FKs | Indexes | Purpose |
|-------|-----|-----|---------|---------|
| `staff` | ✅ | — | email, role, status | Admin users & authentication |
| `categories` | ✅ | parent_id | slug, parent_id, status | Product categories (hierarchical) |
| `collections` | ✅ | — | slug, status | Product collections |
| `products` | ✅ | category_id | slug, status, category_id | Products with variants |
| `product_variants` | ✅ | product_id | sku, product_id | Product variants with pricing/stock |
| `inventory` | ✅ | product_id, variant_id | sku, status | Real-time inventory |
| `orders` | ✅ | customer_id | customer_id, status, created_at | Customer orders |
| `order_items` | ✅ | order_id, product_id, variant_id | order_id | Order line items |
| `customers` | ✅ | — | email, phone | Customer profiles |
| `customer_addresses` | ✅ | customer_id | customer_id | Shipping/billing addresses |
| `returns` | ✅ | order_id, customer_id | order_id, status, return_number | Return requests |
| `discounts` | ✅ | — | code, status | Coupons & promotions |
| `cms_content` | ✅ | — | type, key, status | Hero, banners, FAQs, sections, SEO |
| `seo_pages` | ✅ | — | path | Per-page SEO metadata |
| `app_settings` | ✅ | — | key | Key-value app settings |
| `reviews` | ✅ | product_id | product_id, status | Customer reviews |
| `stock_adjustments` | ✅ | inventory_item_id | inventory_item_id, created_at | Inventory audit trail |
| `analytics_snapshots` | ✅ | — | date, metric | Daily analytics rollups |
| `audit_logs` | ✅ | — | actor_id, entity_type, created_at | Security audit trail |

---

## Foreign Key Analysis

| Child Table | FK Column | Parent Table | On Delete | Notes |
|-------------|-----------|--------------|-----------|-------|
| categories | parent_id | categories | SET NULL | Self-referential hierarchy |
| products | category_id | categories | SET NULL | — |
| product_variants | product_id | products | CASCADE | Variants die with product |
| inventory | product_id | products | CASCADE | — |
| inventory | variant_id | product_variants | SET NULL | — |
| order_items | order_id | orders | CASCADE | Items die with order |
| order_items | product_id | products | SET NULL | — |
| order_items | variant_id | product_variants | SET NULL | — |
| customer_addresses | customer_id | customers | CASCADE | — |
| returns | order_id | orders | CASCADE | — |
| returns | customer_id | customers | CASCADE | — |
| stock_adjustments | inventory_item_id | inventory | CASCADE | — |

✅ All FKs have appropriate cascade rules. No orphaned records possible.

---

## Index Analysis

### Existing Indexes (from migrations)

```sql
-- Critical indexes present:
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug) UNIQUE;
CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku) UNIQUE;
CREATE INDEX idx_inventory_sku ON inventory(sku) UNIQUE;
CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_returns_order_id ON returns(order_id);
CREATE INDEX idx_returns_status ON returns(status);
CREATE INDEX idx_cms_type_key ON cms_content(type, key) UNIQUE;
CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

### Recommended Additional Indexes

```sql
-- For dashboard queries (added in 0004):
CREATE INDEX idx_orders_total ON orders(total); -- for KPI aggregation
CREATE INDEX idx_inventory_stock ON inventory(stock); -- for low stock alerts
CREATE INDEX idx_customers_email ON customers(email); -- for login lookup
CREATE INDEX idx_reviews_product_status ON reviews(product_id, status); -- for moderation
CREATE INDEX idx_stock_adj_inventory ON stock_adjustments(inventory_item_id, created_at DESC); -- for history
```

---

## Constraint Analysis

### Check Constraints

```sql
-- Enum-like check constraints:
ALTER TABLE categories ADD CONSTRAINT chk_category_status CHECK (status IN ('active', 'inactive', 'archived'));
ALTER TABLE collections ADD CONSTRAINT chk_collection_status CHECK (status IN ('active', 'inactive', 'archived'));
ALTER TABLE products ADD CONSTRAINT chk_product_status CHECK (status IN ('active', 'draft', 'archived'));
ALTER TABLE inventory ADD CONSTRAINT chk_inventory_status CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock'));
ALTER TABLE orders ADD CONSTRAINT chk_order_status CHECK (status IN ('new', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'));
ALTER TABLE orders ADD CONSTRAINT chk_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled'));
ALTER TABLE returns ADD CONSTRAINT chk_return_status CHECK (status IN ('requested', 'approved', 'received', 'inspected', 'refunded', 'rejected'));
ALTER TABLE discounts ADD CONSTRAINT chk_discount_status CHECK (status IN ('active', 'scheduled', 'expired', 'disabled'));
ALTER TABLE reviews ADD CONSTRAINT chk_review_status CHECK (status IN ('pending', 'approved', 'rejected', 'flagged'));
ALTER TABLE reviews ADD CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE staff ADD CONSTRAINT chk_staff_role CHECK (role IN ('super_admin', 'catalog_manager', 'order_manager', 'inventory_manager', 'marketing_manager', 'support_agent', 'finance', 'developer'));
ALTER TABLE staff ADD CONSTRAINT chk_staff_status CHECK (status IN ('active', 'invited', 'suspended'));
```

✅ All status columns constrained to valid enum values.

### Unique Constraints

| Table | Column(s) | Purpose |
|-------|-----------|---------|
| staff | email | Unique admin login |
| categories | slug | Unique URL path |
| collections | slug | Unique URL path |
| products | slug | Unique URL path |
| product_variants | sku | Unique inventory identifier |
| inventory | sku | Unique inventory record |
| discounts | code | Unique coupon code |
| cms_content | (type, key) | Single hero, single SEO settings |
| app_settings | key | Single setting per section |

---

## Soft Delete Pattern

| Table | Soft Delete Column | Active Value |
|-------|-------------------|--------------|
| products | status = 'archived' | 'active' / 'draft' |
| categories | status = 'archived' | 'active' / 'inactive' |
| collections | status = 'archived' | 'active' / 'inactive' |
| orders | status = 'cancelled' | All others |
| returns | status = 'rejected' | All others |
| discounts | status = 'disabled' | All others |
| reviews | status = 'rejected' / 'flagged' | 'pending' / 'approved' |
| staff | status = 'suspended' | 'active' / 'invited' |

✅ Consistent soft-delete via status column. No `deleted_at` timestamp needed for audit trail.

---

## Audit Fields

| Table | Created By | Updated By | Created At | Updated At |
|-------|------------|------------|------------|------------|
| staff | ✅ invited_by | ✅ (via update) | ✅ | ✅ |
| categories | ❌ | ❌ | ✅ | ❌ |
| collections | ❌ | ❌ | ✅ | ❌ |
| products | ❌ | ❌ | ✅ | ✅ |
| product_variants | ❌ | ❌ | ✅ | ✅ |
| inventory | ❌ | ❌ | ❌ | ✅ |
| orders | ❌ | ❌ | ✅ | ✅ |
| customers | ❌ | ❌ | ✅ | ✅ |
| returns | ✅ actor (status change) | ❌ | ✅ | ✅ |
| discounts | ❌ | ❌ | ✅ | ✅ |
| cms_content | ✅ updated_by (in content JSON) | ✅ | ✅ | ✅ |
| seo_pages | ❌ | ❌ | ✅ | ✅ |
| app_settings | ❌ | ❌ | ✅ | ✅ |
| reviews | ❌ | ❌ | ✅ | ✅ |
| stock_adjustments | ✅ adjusted_by | ❌ | ✅ | ❌ |
| analytics_snapshots | ❌ | ❌ | ✅ | ❌ |
| audit_logs | ✅ actor_id | ❌ | ✅ | ❌ |

### Recommendation: Add Created By / Updated By

Add to tables missing audit fields:
```sql
ALTER TABLE categories ADD COLUMN created_by UUID REFERENCES staff(id);
ALTER TABLE categories ADD COLUMN updated_by UUID REFERENCES staff(id);
ALTER TABLE products ADD COLUMN created_by UUID REFERENCES staff(id);
ALTER TABLE products ADD COLUMN updated_by UUID REFERENCES staff(id);
-- etc.
```

---

## RLS Policy Coverage

| Table | Select | Insert | Update | Delete | Notes |
|-------|--------|--------|--------|--------|-------|
| staff | staff only | owner | owner | owner | Self-view allowed |
| categories | public (active) | staff | staff | owner | Public sees active only |
| collections | public (active) | staff | staff | owner | Public sees active only |
| products | public (active) | staff | staff | owner | Public sees active only |
| product_variants | public (via product) | staff | staff | owner | — |
| inventory | staff only | staff | staff | owner | Internal only |
| orders | customer (own) / staff | customer / staff | staff (status) | owner | Customer sees own |
| order_items | customer (own) / staff | staff | staff | owner | — |
| customers | customer (own) / staff | — | customer (own) / staff | owner | — |
| returns | customer (own) / staff | customer / staff | staff | owner | — |
| discounts | staff only | staff | staff | owner | Internal only |
| cms_content | public (published) / staff | staff | staff | owner | Public sees published |
| seo_pages | staff only | staff | staff | owner | Internal only |
| app_settings | staff only | staff | staff | owner | Internal only |
| reviews | public (approved) / staff | customer / staff | staff | owner | Public sees approved |
| stock_adjustments | staff only | staff | staff | owner | Internal only |
| analytics_snapshots | staff only | system | — | owner | Internal only |
| audit_logs | staff only | system | — | owner | Internal only |

✅ All tables have RLS enabled with appropriate policies.

---

## Data Quality Issues Found

1. **Missing `created_by`/`updated_by`** on 12 tables — cannot trace who created/updated records
2. **No `updated_at`** on `categories`, `collections`, `inventory` — cannot track last modification
3. **No `created_by`** on `discounts` — cannot trace coupon creator
4. **No cascade delete** on `order_items → products` (SET NULL correct, but product deleted leaves orphan variant)
5. **JSON columns in `cms_content`** — flexible but no schema validation

---

## Recommendations Priority

| Priority | Action | Effort |
|----------|--------|--------|
| P1 | Add `created_by`, `updated_by` to all core tables | Medium (migration + service updates) |
| P1 | Add `updated_at` trigger to tables missing it | Low (migration only) |
| P2 | Add unique constraint on `staff.email` (already exists) | — |
| P2 | Add partial index for `orders` where `status != 'cancelled'` | Low |
| P3 | Migrate `cms_content.content` JSON to structured columns | High (breaking change) |
| P3 | Add foreign key `analytics_snapshots.metric` enum check | Low |

---

## Verdict

**Database Score: 8.5/10**

Strengths: Full RLS coverage, proper FKs, correct cascade rules, comprehensive indexes, enum constraints via CHECK.

Gaps: Missing audit fields on most tables, no updated_at on some tables, JSON column in CMS limits queryability.

**Action Required:** P1 migrations before production launch.