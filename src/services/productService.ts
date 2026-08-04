import { getRepositories } from '@/repositories'
import type { ProductWithVariants, ProductVariant, ProductOption, ProductStatus } from '@/features/products/types'

export interface ProductFilters {
  search?: string
  categoryId?: string
  status?: ProductStatus | 'all'
  stock?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  page?: number
  pageSize?: number
}

export type ProductSortKey = 'name' | 'createdAt' | 'updatedAt'

/** Cartesian product of option values → all variant combinations. */
export function generateVariantCombinations(options: ProductOption[]): Record<string, string>[] {
  const active = options.filter((o) => o.values.length > 0)
  if (active.length === 0) return []
  return active.reduce<Record<string, string>[]>(
    (acc, option) =>
      acc.flatMap((combo) => option.values.map((value) => ({ ...combo, [option.name]: value }))),
    [{}]
  )
}

const SIZE_DIMENSIONS: Record<string, string> = {
  Single: '7236',
  Double: '7248',
  Queen: '7260',
  King: '7272',
  'Single XL': '7536',
  'King XL': '7572',
  Standard: 'STD',
  Large: 'LG',
}

/** SKU pattern: CM-{PRODUCT_CODE}-{DIM_DIM}-{THICKNESS} */
export function generateSKU(productCode: string, optionValues: Record<string, string>): string {
  const parts = ['CM', productCode.toUpperCase()]
  const size = optionValues['Size']
  if (size) parts.push(SIZE_DIMENSIONS[size] ?? size.replace(/\s+/g, '').toUpperCase().slice(0, 6))
  const thickness = optionValues['Thickness']
  if (thickness) parts.push(thickness.replace(/[^0-9]/g, ''))
  return parts.join('-')
}

export function calcDiscountPercent(mrp: number, sellingPrice: number): number {
  if (mrp <= 0) return 0
  return Math.round(((mrp - sellingPrice) / mrp) * 100)
}

export function variantStockStatus(v: ProductVariant): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (v.stock === 0) return 'out_of_stock'
  if (v.stock <= v.lowStockThreshold) return 'low_stock'
  return 'in_stock'
}

export const productService = {
  async getAll(): Promise<ProductWithVariants[]> {
    return getRepositories().products.getAll()
  },

  async getById(id: string): Promise<ProductWithVariants | null> {
    return getRepositories().products.getById(id)
  },

  async search(filters: ProductFilters): Promise<{ products: ProductWithVariants[]; total: number }> {
    const repos = getRepositories()
    if (typeof repos.products.search === 'function') {
      return repos.products.search(filters)
    }
    // Fallback
    const products = await repos.products.getAll()
    return { products, total: products.length }
  },

  async create(product: ProductWithVariants): Promise<ProductWithVariants> {
    return getRepositories().products.create(product)
  },

  async update(id: string, updates: Partial<ProductWithVariants>): Promise<ProductWithVariants | null> {
    return getRepositories().products.update(id, updates)
  },

  async archive(id: string): Promise<boolean> {
    return getRepositories().products.archive(id)
  },

  async duplicate(id: string): Promise<ProductWithVariants | null> {
    const repos = getRepositories()
    if (typeof repos.products.duplicate === 'function') {
      return repos.products.duplicate(id)
    }
    // Fallback
    const original = await repos.products.getById(id)
    if (!original) return null
    const newId = `prod-${Date.now()}`
    const copy: ProductWithVariants = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy`,
      status: 'draft',
      variants: original.variants.map((v) => ({ ...v, id: `${v.id}-copy`, productId: newId, sku: `${v.sku}-C` })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return repos.products.create(copy)
  },

  generateVariantCombinations,
  generateSKU,
  calcDiscountPercent,
  variantStockStatus,
}