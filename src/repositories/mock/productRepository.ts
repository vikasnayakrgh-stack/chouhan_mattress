import type { IProductRepository } from '@/repositories/types'
import type { ProductWithVariants, ProductVariant } from '@/features/products/types'
import { mockProducts } from '@/data/admin/products.mock'

let products: ProductWithVariants[] = mockProducts.map((p) => ({ ...p }))

export class MockProductRepository implements IProductRepository {
  async getAll(): Promise<ProductWithVariants[]> {
    return [...products]
  }

  async getById(id: string): Promise<ProductWithVariants | null> {
    return products.find((p) => p.id === id) ?? null
  }

  async getBySlug(slug: string): Promise<ProductWithVariants | null> {
    return products.find((p) => p.slug === slug) ?? null
  }

  async search(filters: {
    categoryId?: string
    status?: string
    stock?: string
    query?: string
    page?: number
    pageSize?: number
  }): Promise<{ products: ProductWithVariants[]; total: number }> {
    let filtered = [...products]

    if (filters.categoryId) {
      filtered = filtered.filter(p => p.categoryId === filters.categoryId)
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status)
    }
    if (filters.query) {
      const q = filters.query.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.productCode.toLowerCase().includes(q) ||
        p.variants.some(v => v.sku.toLowerCase().includes(q))
      )
    }

    const total = filtered.length
    const page = filters.page || 0
    const pageSize = filters.pageSize || 20
    const start = page * pageSize
    const end = start + pageSize

    return {
      products: filtered.slice(start, end),
      total,
    }
  }

  async create(product: ProductWithVariants): Promise<ProductWithVariants> {
    products = [product, ...products]
    return product
  }

  async update(id: string, updates: Partial<ProductWithVariants>): Promise<ProductWithVariants | null> {
    const idx = products.findIndex((p) => p.id === id)
    if (idx === -1) return null
    products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() }
    return products[idx]
  }

  async archive(id: string): Promise<boolean> {
    const idx = products.findIndex((p) => p.id === id)
    if (idx === -1) return false
    products[idx] = { ...products[idx], status: 'archived' }
    return true
  }

  async duplicate(id: string): Promise<ProductWithVariants | null> {
    const original = products.find((p) => p.id === id)
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
    products = [copy, ...products]
    return copy
  }

  async getVariants(productId: string): Promise<ProductVariant[]> {
    return products.find((p) => p.id === productId)?.variants ?? []
  }
}