import { getRepositories } from '@/repositories'
import type { Category, Collection } from '@/features/catalog/types'

export const catalogService = {
  async getCategories(): Promise<Category[]> {
    const { categories } = getRepositories()
    return categories.getAll()
  },

  async getCategoryById(id: string): Promise<Category | null> {
    const { categories } = getRepositories()
    return categories.getById(id)
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { categories } = getRepositories()
    const all = await categories.getAll()
    return all.find(c => c.slug === slug) ?? null
  },

  async createCategory(category: Omit<Category, 'id' | 'createdAt' | 'productCount'>): Promise<Category> {
    const { categories } = getRepositories()
    return categories.create(category)
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const { categories } = getRepositories()
    return categories.update(id, updates)
  },

  async deleteCategory(id: string): Promise<boolean> {
    const { categories } = getRepositories()
    return categories.delete(id)
  },

  async getCollections(): Promise<Collection[]> {
    const { collections } = getRepositories()
    return collections.getAll()
  },

  async getCollectionById(id: string): Promise<Collection | null> {
    const { collections } = getRepositories()
    return collections.getById(id)
  },
}