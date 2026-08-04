# Chouhan Mattress Admin Panel – Backend Blueprint v1

**Version:** 1.0  
**Date:** 2026-07-28  
**Status:** Planning Only – Implementation Guide

---

## 1. Database Schema

### Core Tables

#### `products`
**Purpose:** Store all product information  
**Main Columns:**
- `id` (uuid, pk)
- `name`, `slug`, `productCode` (string)
- `description`, `shortDescription` (text)
- `brand`, `status` (enum: active/draft/archived)
- `categoryId` (fk → categories)
- `collectionIds` (array)
- `tags` (array)
- `createdAt`, `updatedAt` (timestamp)

**Relationships:** One-to-many → `product_variants`, One-to-many → `inventory_items`

---

#### `product_variants`
**Purpose:** SKU-level product variants (size, color, etc.)  
**Main Columns:**
- `id` (uuid, pk)
- `productId` (fk → products)
- `sku` (string, unique)
- `optionValues` (jsonb: {Size: "Queen", Thickness: "6 inch"})
- `mrp`, `sellingPrice`, `discountPercent` (number)
- `dimensions` (string)
- `status` (enum: active/inactive)

**Relationships:** One-to-one → `inventory_items`

---

#### `inventory_items`
**Purpose:** Stock tracking per variant  
**Main Columns:**
- `id` (uuid, pk)
- `variantId` (fk → product_variants, unique)
- `productId` (fk → products)
- `sku` (string, unique)
- `stock`, `reserved`, `incoming` (number)
- `lowStockThreshold` (number)
- `status` (enum: in_stock/low_stock/out_of_stock)

**Relationships:** None (leaf node)

---

#### `categories`
**Purpose:** Product categorization with tree structure  
**Main Columns:**
- `id` (uuid, pk)
- `name`, `slug`, `description` (string)
- `parentId` (uuid, nullable → self)
- `status` (enum: active/inactive)
- `productCount` (number, computed)
- `position` (number for ordering)
- `createdAt` (timestamp)

**Relationships:** Self-referencing for hierarchy

---

#### `collections`
**Purpose:** Curated product groupings  
**Main Columns:**
- `id` (uuid, pk)
- `name`, `slug`, `description` (string)
- `status` (enum: active/inactive)
- `productCount` (number, computed)
- `isAutomatic` (boolean)
- `createdAt` (timestamp)

**Relationships:** Many-to-many via `collection_products` junction table

---

#### `orders`
**Purpose:** Customer orders  
**Main Columns:**
- `id` (uuid, pk)
- `orderNumber` (string, unique: "CM-1042")
- `customerId` (fk → customers)
- `customerName`, `customerEmail`, `customerPhone` (string)
- `items` (jsonb array)
- `subtotal`, `discount`, `shippingFee`, `tax`, `total` (number)
- `status` (enum: new/confirmed/processing/packed/shipped/delivered/cancelled/returned)
- `paymentStatus` (enum: paid/pending/cod/failed/refunded)
- `paymentMethod` (string)
- `fulfillmentStatus` (enum: unfulfilled/partially_fulfilled/fulfilled)
- `shippingAddress`, `billingAddress` (jsonb)
- `trackingNumber`, `carrier` (string, optional)
- `notes` (text, optional)
- `createdAt`, `updatedAt` (timestamp)

**Relationships:** One-to-many → `order_timeline`, One-to-many → `refunds`

---

#### `order_timeline`
**Purpose:** Order status history  
**Main Columns:**
- `id` (uuid, pk)
- `orderId` (fk → orders)
- `status` (enum: order statuses + payment + note)
- `title`, `description` (string)
- `timestamp` (timestamp)
- `actor` (string, optional)

---

#### `customers`
**Purpose:** Customer profiles  
**Main Columns:**
- `id` (uuid, pk)
- `name`, `email`, `phone` (string)
- `city`, `state` (string)
- `status` (enum: active/inactive/blocked)
- `ordersCount` (number, computed)
- `totalSpend` (number, computed)
- `lastOrderDate` (timestamp, nullable)
- `createdAt` (timestamp)

**Relationships:** One-to-many → `customer_addresses`, One-to-many → `customer_notes`

---

#### `customer_addresses`
**Purpose:** Customer shipping/billing addresses  
**Main Columns:**
- `id` (uuid, pk)
- `customerId` (fk → customers)
- `label`, `name`, `phone` (string)
- `line1`, `line2` (string)
- `city`, `state`, `pincode`, `country` (string)
- `isDefaultShipping`, `isDefaultBilling` (boolean)

---

#### `customer_notes`
**Purpose:** Internal customer notes  
**Main Columns:**
- `id` (uuid, pk)
- `customerId` (fk → customers)
- `content` (text)
- `author` (string)
- `createdAt`, `updatedAt` (timestamp)

---

#### `reviews`
**Purpose:** Product reviews  
**Main Columns:**
- `id` (uuid, pk)
- `productId` (fk → products)
- `customerId` (fk → customers)
- `customerName` (string, denormalized)
- `rating` (number: 1-5)
- `title`, `comment` (string)
- `status` (enum: pending/approved/rejected/spam)
- `images` (array of storage paths)
- `verifiedPurchase` (boolean)
- `createdAt` (timestamp)

---

#### `discounts`
**Purpose:** Coupons and promotional codes  
**Main Columns:**
- `id` (uuid, pk)
- `name`, `code`, `description` (string)
- `type` (enum: percentage/fixed/buy_x_get_y/free_shipping)
- `value` (number)
- `condition` (jsonb: minOrderValue, categoryIds, productIds, customerGroup)
- `rule` (jsonb: buyQuantity, getQuantity, freeShippingThreshold)
- `status` (enum: active/scheduled/expired/disabled)
- `startDate`, `endDate` (timestamp)
- `usageLimit`, `usageCount`, `perCustomerLimit` (number)
- `stackable`, `oncePerCustomer` (boolean)
- `revenueImpacted` (number, computed)
- `createdAt`, `updatedAt` (timestamp)

---

#### `returns`
**Purpose:** Return requests  
**Main Columns:**
- `id` (uuid, pk)
- `returnNumber` (string, unique: "RET-2001")
- `orderId` (fk → orders)
- `orderNumber` (string, denormalized)
- `customerId` (fk → customers)
- `customerName`, `customerPhone` (string, denormalized)
- `items` (jsonb array)
- `reason` (enum: damaged/defective/wrong_item/not_as_described/size_issue/comfort_issue/changed_mind/other)
- `reasonNote` (text, optional)
- `resolution` (enum: refund/replacement/store_credit)
- `status` (enum: requested/approved/received/inspected/refunded/rejected)
- `refundAmount` (number)
- `images` (array of storage paths)
- `createdAt`, `updatedAt` (timestamp)

---

#### `return_timeline`
**Purpose:** Return status history  
**Main Columns:**
- `id` (uuid, pk)
- `returnId` (fk → returns)
- `status` (enum: return statuses + note)
- `title`, `description` (string)
- `timestamp` (timestamp)
- `actor` (string, optional)

---

#### `staff`
**Purpose:** Admin users  
**Main Columns:**
- `id` (uuid, pk)
- `name`, `email`, `phone` (string)
- `role` (enum: super_admin/catalog_manager/order_manager/inventory_manager/marketing_manager/support_agent/finance/developer)
- `status` (enum: active/invited/suspended)
- `avatarInitials` (string)
- `lastLoginAt` (timestamp, nullable)
- `createdAt` (timestamp)
- `twoFactorEnabled` (boolean)

---

#### `invitations`
**Purpose:** Staff invitation tracking  
**Main Columns:**
- `id` (uuid, pk)
- `email` (string)
- `role` (enum: AdminRole)
- `invitedBy` (string)
- `invitedAt` (timestamp)
- `expiresAt` (timestamp)
- `status` (enum: pending/accepted/expired)

---

#### `staff_activities`
**Purpose:** Audit trail for staff actions  
**Main Columns:**
- `id` (uuid, pk)
- `userId` (fk → staff)
- `action` (string)
- `timestamp` (timestamp)

---

#### `audit_logs`
**Purpose:** System-wide audit log  
**Main Columns:**
- `id` (uuid, pk)
- `actorId` (string, fk to staff or customers)
- `actorName` (string)
- `action` (enum: create/update/delete/archive/login/export/stock_adjust)
- `entityType` (string)
- `entityId` (string)
- `description` (text)
- `createdAt` (timestamp)

---

#### `content_blocks`
**Purpose:** Reusable content blocks for homepage  
**Main Columns:**
- `id` (uuid, pk)
- `type` (enum: text/image/video/cta)
- `content` (text/jsonb)
- `order` (number)

---

#### `content_sections`
**Purpose:** Homepage sections  
**Main Columns:**
- `id` (uuid, pk)
- `key` (string, unique)
- `title`, `subtitle` (string)
- `type` (enum: product_grid/category_grid/banner_strip/testimonials/usp_strip/custom)
- `enabled` (boolean)
- `order` (number)
- `status` (enum: draft/published/scheduled/archived)
- `itemCount` (number, optional)
- `updatedAt`, `updatedBy` (timestamp/string)

---

#### `hero_content`
**Purpose:** Homepage hero section  
**Main Columns:**
- `id` (uuid, pk)
- `headline`, `subheadline`, `description` (string)
- `ctas` (jsonb array)
- `backgroundImage` (string/storage path)
- `mobileBackgroundImage` (string/storage path, optional)
- `badges` (array)
- `countdownEnabled` (boolean)
- `countdownEndsAt` (timestamp, optional)
- `countdownLabel` (string, optional)
- `status` (enum: draft/published/scheduled/archived)
- `updatedAt`, `updatedBy` (timestamp/string)

---

#### `banners`
**Purpose:** Homepage banners and promo banners  
**Main Columns:**
- `id` (uuid, pk)
- `title`, `subtitle` (string)
- `image` (string/storage path)
- `ctaLabel`, `ctaHref` (string)
- `position` (enum: homepage_top/homepage_middle/category_page/cart_page/announcement_bar)
- `startDate`, `endDate` (timestamp, optional)
- `status` (enum: draft/published/scheduled/archived)
- `order` (number)
- `updatedAt`, `updatedBy` (timestamp/string)

---

#### `faqs`
**Purpose:** FAQ content  
**Main Columns:**
- `id` (uuid, pk)
- `question`, `answer` (string)
- `category` (enum: orders/delivery/returns/warranty/products/payments/trial)
- `order` (number)
- `status` (enum: draft/published/scheduled/archived)
- `updatedAt`, `updatedBy` (timestamp/string)

---

#### `seo_settings`
**Purpose:** Global SEO configuration  
**Main Columns:**
- `id` (uuid, pk)
- `titleTemplate`, `defaultTitle` (string)
- `metaDescription` (string)
- `ogImage` (string/storage path)
- `robotsIndex` (boolean)
- `sitemapEnabled` (boolean)
- `canonicalBase` (string)
- `pages` (jsonb array)
- `updatedAt`, `updatedBy` (timestamp/string)

---

#### `analytics`
**Purpose:** Dashboard metrics (read-only materialized view)  
**Main Columns:**
- `date` (date, pk)
- `sales` (number)
- `orders` (number)
- `customers` (number)
- `products` (number)

---

## 2. Module Mapping

| Module | Database Tables |
|--------|-----------------|
| **Products** | products, product_variants, inventory_items |
| **Categories** | categories |
| **Collections** | collections, collection_products (junction) |
| **Inventory** | inventory_items, stock_adjustments (future) |
| **Orders** | orders, order_items (denormalized), order_timeline |
| **Returns** | returns, return_timeline |
| **Customers** | customers, customer_addresses, customer_notes |
| **Reviews** | reviews |
| **Discounts** | discounts |
| **Content/Homepage** | hero_content, banners, faqs, content_sections, content_blocks, seo_settings |
| **Staff & Roles** | staff, invitations, staff_activities |
| **Dashboard** | analytics (materialized view) |

---

## 3. CRUD Checklist

### Products
| Operation | Status | Notes |
|-----------|--------|-------|
| Create | ✅ | With variants |
| Read | ✅ | Single + list |
| Update | ✅ | Partial updates |
| Delete | ❌ | Only archive |
| Search | ✅ | Name, SKU, code |
| Filter | ✅ | Category, status, stock |
| Bulk Actions | ✅ | Archive |

### Categories
| Operation | Status | Notes |
|-----------|--------|-------|
| Create | ✅ | With parent |
| Read | ✅ | Tree structure |
| Update | ✅ | Name, description, position |
| Delete | ❌ | Not implemented |
| Search | ✅ | Name, slug |
| Filter | ❌ | Future enhancement |
| Bulk Actions | ❌ | Future enhancement |

### Orders
| Operation | Status | Notes |
|-----------|--------|-------|
| Create | ✅ | From checkout |
| Read | ✅ | Single + list |
| Update | ✅ | Status transitions |
| Delete | ❌ | Never |
| Search | ✅ | Order number |
| Filter | ✅ | Status, date range |
| Bulk Actions | ❌ | Future enhancement |

### Customers
| Operation | Status | Notes |
|-----------|--------|-------|
| Create | ✅ | Via signup |
| Read | ✅ | Single + list |
| Update | ✅ | Profile |
| Delete | ❌ | Only block |
| Search | ✅ | Name, email, phone |
| Filter | ✅ | Status, city |
| Bulk Actions | ❌ | Future enhancement |

### Inventory
| Operation | Status | Notes |
|-----------|--------|-------|
| Read | ✅ | Stock levels |
| Update | ❌ | Not implemented |
| Adjust | ❌ | Not implemented |
| Search | ✅ | SKU |
| Filter | ✅ | Stock status |

### Returns
| Operation | Status | Notes |
|-----------|--------|-------|
| Create | ✅ | From order |
| Read | ✅ | Single + list |
| Update | ✅ | Status transitions |
| Delete | ❌ | Never |
| Search | ✅ | Return number, order number |
| Filter | ✅ | Status, reason |
| Bulk Actions | ❌ | Future enhancement |

### Discounts
| Operation | Status | Notes |
|-----------|--------|-------|
| Create | ✅ | With conditions |
| Read | ✅ | Single + list |
| Update | ✅ | Status, values |
| Delete | ✅ | Remove |
| Search | ✅ | Code, name |
| Filter | ✅ | Status, type |
| Bulk Actions | ❌ | Future enhancement |

### Content
| Operation | Status | Notes |
|-----------|--------|-------|
| Hero | ✅ | Read/update |
| Banners | ✅ | Read/update |
| FAQs | ✅ | Read/update |
| SEO | ✅ | Read/update |

---

## 4. Authentication & Roles

### Role Definitions

| Role | Access Level |
|------|--------------|
| **Admin (Super Admin)** | Full access to all modules |
| **Manager** | Read/write products, orders, customers, inventory, discounts |
| **Staff** | Read-only access to most data, limited write |

### Permission Matrix (Simplified)

| Module | Admin | Manager | Staff |
|--------|-------|---------|-------|
| Products | CRUD | CRUD | READ |
| Orders | CRUD | CRUD | READ |
| Customers | CRUD | CRUD | READ |
| Inventory | CRUD | CRUD | READ |
| Discounts | CRUD | CRUD | READ |
| Content | CRUD | CRUD | READ |
| Staff | CRUD | READ | NONE |
| Settings | CRUD | READ | NONE |

---

## 5. File Storage

### Supabase Storage Buckets Required

| File Type | Bucket | Path Structure |
|-----------|--------|----------------|
| Product Images | `products` | `/products/{productId}/{variantId}/{uuid}-original.jpg` |
| Banner Images | `content` | `/banners/{uuid}-original.jpg` |
| Review Images | `reviews` | `/reviews/{reviewId}/{uuid}-original.jpg` |
| Hero Background | `content` | `/hero/{uuid}-original.jpg` |

### Storage Rules
- Public read access for product/banner/review images
- Authenticated write access only
- Image optimization via Supabase Edge Functions (future)

---

## 6. Integration Order

### Phase 1: Core Infrastructure
1. **Authentication** - Supabase auth, role-based middleware
2. **Categories** - Foundation for products
3. **Products** - Core entity with variants

### Phase 2: Sales Flow
4. **Inventory** - Stock tracking
5. **Customers** - Customer profiles
6. **Orders** - Order creation and status

### Phase 3: Support & Content
7. **Returns** - Return processing
8. **Reviews** - Product reviews
9. **Content** - Homepage builder

### Phase 4: Operations
10. **Discounts** - Coupons
11. **Staff** - User management
12. **Analytics** - Dashboard metrics
13. **Settings** - Global configuration

---

## 7. Risks

### 1. Client-Side Pagination
**Risk:** AdminDataTable uses client-side pagination; will break at scale  
**Mitigation:** Implement server-side pagination before 1000+ records

### 2. No Virtual Scrolling
**Risk:** Tables without virtualization will lag with large datasets  
**Mitigation:** Add react-virtual or TanStack Table virtualization

### 3. Missing Audit Trail
**Risk:** No comprehensive audit logging for critical operations  
**Mitigation:** Implement audit_logs table with triggers

### 4. No Bulk Operations
**Risk:** Manual processing of bulk actions will be slow  
**Mitigation:** Add bulk import/export, bulk status updates

### 5. Image Storage Strategy
**Risk:** No CDN optimization for images  
**Mitigation:** Use Supabase Storage with image optimization

### 6. Role Complexity
**Risk:** Simple role model may not scale for complex org structures  
**Mitigation:** Design for permission-based access from day one

### 7. Data Denormalization
**Risk:** Some data is denormalized (customerName in orders)  
**Mitigation:** Acceptable for read-heavy admin use cases

---

## 8. Next Steps

1. Set up Supabase project
2. Configure authentication with role claims
3. Create database schema using SQL migrations
4. Implement repository layer with Supabase client
5. Add RLS policies for role-based access
6. Set up Storage buckets
7. Configure real-time subscriptions for dashboard
8. Add tests for service layer

---

## Appendix: Type Definitions Reference

All types are defined in `/src/features/*/types.ts`:
- Products: `Product`, `ProductVariant`, `ProductWithVariants`
- Orders: `Order`, `OrderItem`, `OrderStatus`, `PaymentStatus`
- Customers: `Customer`, `CustomerAddress`, `CustomerNote`
- Reviews: `Review`, `ReviewStatus`
- Discounts: `Discount`, `DiscountType`, `DiscountStatus`
- Returns: `Return`, `ReturnStatus`, `ReturnReason`
- Catalog: `Category`, `Collection`
- Inventory: `InventoryItem`, `StockAdjustment`
- Staff: `AdminUser`, `AdminRole`, `Permission`
- CMS: `HeroContent`, `BannerContent`, `FAQContent`