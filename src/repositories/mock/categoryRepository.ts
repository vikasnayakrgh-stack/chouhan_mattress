import type { ICategoryRepository } from '@/repositories/types'
import type { Category } from '@/features/catalog/types'
import { mockCategories } from '@/data/admin/categories.mock'

export class MockCategoryRepository implements ICategoryRepository {
  async getAll(): Promise<Category[]> {
    return [...mockCategories]
  }

  async getById(id: string): Promise<Category | null> {
    return mockCategories.find((c) => c.id === id) ?? null
  }

  async getBySlug(slug: string): Promise<Category | null> {
    return mockCategories.find((c) => c.slug === slug) ?? null
  }

  async create(category: Omit<Category, 'id' | 'createdAt' | 'productCount'>): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      productCount: 0,
    }
    mockCategories.push(newCategory)
    return newCategory
  }

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const idx = mockCategories.findIndex((c) => c.id === id)
    if (idx === -1) return null
    mockCategories[idx] = { ...mockCategories[idx], ...updates }
    return mockCategories[idx]
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockCategories.findIndex((c) => c.id === id)
    if (idx === -1) return false
    mockCategories.splice(idx, 1)
    return true
  }
}