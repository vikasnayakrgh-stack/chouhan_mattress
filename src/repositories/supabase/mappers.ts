import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { ProductWithVariants, ProductVariant } from '@/features/products/types'
import type { Order, OrderStatus, Refund } from '@/features/orders/types'
import type { Customer, CustomerAddress, CustomerNote } from '@/features/customers/types'
import type { Return, ReturnStatus } from '@/features/returns/types'
import type { Discount } from '@/features/discounts/types'

/**
 * Supabase-backed repositories for the Chouhan Mattress admin panel.
 *
 * Every repository here implements the SAME interface as the mock versions
 * (see @/repositories/types). Swapping the app from mock → Supabase requires
 * zero UI changes: flip `getRepository()` (in ./index.ts) to build these
 * instead of the Mock* classes when NEXT_PUBLIC_DATA_SOURCE=supabase.
 *
 * Row shape === domain type via JSON columns, so mapping is serialize/deserialize.
 */

function getClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  }
  return createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } })
}

// ── Product mapping ──────────────────────────────────────────────────────────
function rowToProduct(row: Record<string, unknown>): ProductWithVariants {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    slug: String(row.slug ?? ''),
    productCode: String(row.product_code ?? ''),
    shortDescription: String(row.short_description ?? ''),
    description: String(row.description ?? ''),
    brand: String(row.brand ?? 'Chouhan'),
    categoryId: String(row.category_id ?? ''),
    categoryName: String(row.category_name ?? ''),
    collectionIds: (row.collection_ids as string[]) ?? [],
    tags: (row.tags as string[]) ?? [],
    status: (row.status as ProductWithVariants['status']) ?? 'draft',
    images: (row.images as ProductWithVariants['images']) ?? [],
    options: (row.options as ProductWithVariants['options']) ?? [],
    mattressAttributes: (row.mattress_attributes as ProductWithVariants['mattressAttributes']) ?? undefined,
    seo: (row.seo as ProductWithVariants['seo']) ?? { title: '', metaDescription: '', urlSlug: '' },
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    variants: (row.variants as ProductVariant[]) ?? [],
  }
}

function variantRowToVariant(row: Record<string, unknown>): ProductVariant {
  return {
    id: String(row.id),
    productId: String(row.product_id),
    sku: String(row.sku),
    optionValues: (row.option_values as Record<string, string>) ?? {},
    dimensions: row.dimensions ? String(row.dimensions) : undefined,
    mrp: Number(row.mrp ?? 0),
    sellingPrice: Number(row.selling_price ?? 0),
    discountPercent: Number(row.discount_percent ?? 0),
    stock: Number(row.stock ?? 0),
    lowStockThreshold: Number(row.low_stock_threshold ?? 5),
    status: (row.status as ProductVariant['status']) ?? 'active',
  }
}

// ── Order mapping ────────────────────────────────────────────────────────────
function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    orderNumber: String(row.order_number ?? ''),
    customerId: String(row.customer_id ?? ''),
    customerName: String(row.customer_name ?? ''),
    customerEmail: String(row.customer_email ?? ''),
    customerPhone: String(row.customer_phone ?? ''),
    items: (row.items as Order['items']) ?? [],
    subtotal: Number(row.subtotal ?? 0),
    discount: Number(row.discount ?? 0),
    shippingFee: Number(row.shipping_fee ?? 0),
    tax: Number(row.tax ?? 0),
    total: Number(row.total ?? 0),
    status: (row.status as OrderStatus) ?? 'new',
    paymentStatus: (row.payment_status as Order['paymentStatus']) ?? 'pending',
    paymentMethod: String(row.payment_method ?? ''),
    fulfillmentStatus: (row.fulfillment_status as Order['fulfillmentStatus']) ?? 'unfulfilled',
    shippingAddress: (row.shipping_address as Order['shippingAddress']) ?? {
      name: '', phone: '', line1: '', city: '', state: '', pincode: '', country: 'India',
    },
    billingAddress: (row.billing_address as Order['billingAddress']) ?? {
      name: '', phone: '', line1: '', city: '', state: '', pincode: '', country: 'India',
    },
    timeline: (row.timeline as Order['timeline']) ?? [],
    refunds: (row.refunds as Refund[]) ?? [],
    trackingNumber: row.tracking_number ? String(row.tracking_number) : undefined,
    carrier: row.carrier ? String(row.carrier) : undefined,
    notes: row.notes ? String(row.notes) : undefined,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  }
}

// ── Customer mapping ─────────────────────────────────────────────────────────
function rowToCustomer(row: Record<string, unknown>): Customer {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    email: row.email ? String(row.email) : '',
    phone: row.phone ? String(row.phone) : '',
    city: String(row.city ?? ''),
    state: String(row.state ?? ''),
    status: (row.status as Customer['status']) ?? 'active',
    ordersCount: Number(row.orders_count ?? 0),
    totalSpend: Number(row.total_spend ?? 0),
    lastOrderDate: row.last_order_date ? String(row.last_order_date) : null,
    addresses: (row.addresses as CustomerAddress[]) ?? [],
    notes: (row.notes as CustomerNote[]) ?? [],
    createdAt: String(row.created_at ?? new Date().toISOString()),
  }
}

// ── Return mapping ───────────────────────────────────────────────────────────
function rowToReturn(row: Record<string, unknown>): Return {
  return {
    id: String(row.id),
    returnNumber: String(row.return_number ?? ''),
    orderId: String(row.order_id ?? ''),
    orderNumber: String(row.order_number ?? ''),
    customerId: String(row.customer_id ?? ''),
    customerName: String(row.customer_name ?? ''),
    customerPhone: String(row.customer_phone ?? ''),
    items: (row.items as Return['items']) ?? [],
    reason: (row.reason as Return['reason']),
    reasonNote: row.reason_note ? String(row.reason_note) : undefined,
    resolution: (row.resolution as Return['resolution']) ?? 'refund',
    status: (row.status as ReturnStatus) ?? 'requested',
    refundAmount: Number(row.refund_amount ?? 0),
    images: (row.images as string[]) ?? [],
    timeline: (row.timeline as Return['timeline']) ?? [],
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  }
}

// ── Discount mapping ─────────────────────────────────────────────────────────
function rowToDiscount(row: Record<string, unknown>): Discount {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    code: String(row.code ?? ''),
    description: row.description ? String(row.description) : undefined,
    type: (row.type as Discount['type']),
    value: Number(row.value ?? 0),
    condition: (row.condition as Discount['condition']) ?? {},
    rule: (row.rule as Discount['rule']) ?? undefined,
    status: (row.status as Discount['status']) ?? 'active',
    startDate: String(row.start_date ?? new Date().toISOString()),
    endDate: row.end_date ? String(row.end_date) : null,
    usageLimit: row.usage_limit != null ? Number(row.usage_limit) : null,
    usageCount: Number(row.usage_count ?? 0),
    perCustomerLimit: row.per_customer_limit != null ? Number(row.per_customer_limit) : null,
    stackable: Boolean(row.stackable),
    oncePerCustomer: Boolean(row.once_per_customer),
    revenueImpacted: Number(row.revenue_impacted ?? 0),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  }
}

// ── Category mapping ─────────────────────────────────────────────────────────
import type { Category, Collection } from '@/features/catalog/types'
import type { InventoryItem } from '@/features/inventory/types'
import type { BannerContent, FAQContent, ContentSection } from '@/features/cms/types'

function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    slug: String(row.slug ?? ''),
    description: String(row.description ?? ''),
    parentId: row.parent_id ? String(row.parent_id) : null,
    status: (row.status as Category['status']) ?? 'active',
    productCount: Number(row.product_count ?? 0),
    position: Number(row.position ?? 0),
    createdAt: String(row.created_at ?? new Date().toISOString()),
  }
}

function rowToCollection(row: Record<string, unknown>): Collection {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    slug: String(row.slug ?? ''),
    description: String(row.description ?? ''),
    status: (row.status as Collection['status']) ?? 'active',
    productCount: Number(row.product_count ?? 0),
    isAutomatic: Boolean(row.is_automatic ?? false),
    createdAt: String(row.created_at ?? new Date().toISOString()),
  }
}

function rowToInventory(row: Record<string, unknown>): InventoryItem {
  const product = row.product as Record<string, unknown> | null
  return {
    id: String(row.id),
    productId: String(row.product_id ?? ''),
    productName: String(product?.name ?? ''),
    variantId: String(row.variant_id ?? ''),
    sku: String(row.sku ?? ''),
    variantLabel: String(row.variant_label ?? ''),
    stock: Number(row.stock ?? 0),
    lowStockThreshold: Number(row.low_stock_threshold ?? 5),
    status: (row.status as InventoryItem['status']) ?? 'in_stock',
    reserved: Number(row.reserved ?? 0),
    incoming: Number(row.incoming ?? 0),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  }
}

function rowToBanner(row: Record<string, unknown>): BannerContent {
  const content = (row.content ?? {}) as Record<string, unknown>
  return {
    id: String(row.id),
    title: String(content.title ?? row.title ?? ''),
    subtitle: content.subtitle ? String(content.subtitle) : undefined,
    image: String(content.image ?? ''),
    ctaLabel: String(content.ctaLabel ?? ''),
    ctaHref: String(content.ctaHref ?? ''),
    position: (content.position as BannerContent['position']) ?? 'homepage_top',
    startDate: content.startDate ? String(content.startDate) : undefined,
    endDate: content.endDate ? String(content.endDate) : undefined,
    status: String(row.status ?? 'draft') as BannerContent['status'],
    order: Number(content.order ?? 0),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    updatedBy: String(content.updatedBy ?? 'system'),
  }
}

function rowToFAQ(row: Record<string, unknown>): FAQContent {
  const content = (row.content ?? {}) as Record<string, unknown>
  return {
    id: String(row.id),
    question: String(content.question ?? row.title ?? ''),
    answer: String(content.answer ?? ''),
    category: (content.category as FAQContent['category']) ?? 'orders',
    order: Number(content.order ?? 0),
    status: String(row.status ?? 'published') as FAQContent['status'],
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    updatedBy: String(content.updatedBy ?? 'system'),
  }
}

function rowToSection(row: Record<string, unknown>): ContentSection {
  const content = (row.content ?? {}) as Record<string, unknown>
  return {
    id: String(row.id),
    key: String(content.key ?? row.key ?? ''),
    title: String(content.title ?? row.title ?? ''),
    subtitle: content.subtitle ? String(content.subtitle) : undefined,
    type: (content.type as ContentSection['type']) ?? 'custom',
    enabled: Boolean(content.enabled ?? true),
    order: Number(content.order ?? 0),
    status: String(row.status ?? 'published') as ContentSection['status'],
    itemCount: content.itemCount ? Number(content.itemCount) : undefined,
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    updatedBy: String(content.updatedBy ?? 'system'),
  }
}

export const supabaseMappers = {
  rowToProduct,
  variantRowToVariant,
  rowToOrder,
  rowToCustomer,
  rowToReturn,
  rowToDiscount,
  rowToCategory,
  rowToCollection,
  rowToInventory,
  rowToBanner,
  rowToFAQ,
  rowToSection,
  getClient,
}
