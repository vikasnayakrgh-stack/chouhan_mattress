import type { ICollectionRepository } from '@/repositories/types'
import type { Collection } from '@/features/catalog/types'
import { mockCollections } from '@/data/admin/collections.mock'

export class MockCollectionRepository implements ICollectionRepository {
  async getAll(): Promise<Collection[]> {
    return [...mockCollections]
  }

  async getById(id: string): Promise<Collection | null> {
    return mockCollections.find((c) => c.id === id) ?? null
  }

  async getBySlug(slug: string): Promise<Collection | null> {
    return mockCollections.find((c) => c.slug === slug) ?? null
  }

  async create(collection: Omit<Collection, 'id' | 'createdAt' | 'productCount'>): Promise<Collection> {
    const newCollection: Collection = {
      ...collection,
      id: `col-${Date.now()}`,
      createdAt: new Date().toISOString(),
      productCount: 0,
    }
    mockCollections.push(newCollection)
    return newCollection
  }

  async update(id: string, updates: Partial<Collection>): Promise<Collection | null> {
    const idx = mockCollections.findIndex((c) => c.id === id)
    if (idx === -1) return null
    mockCollections[idx] = { ...mockCollections[idx], ...updates }
    return mockCollections[idx]
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockCollections.findIndex((c) => c.id === id)
    if (idx === -1) return false
    mockCollections.splice(idx, 1)
    return true
  }
}