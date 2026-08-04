import type { Review, ReviewStatus } from '@/features/reviews/types'
import { mockReviews } from '@/data/admin/reviews.mock'

let reviews: Review[] = mockReviews.map((r) => ({ ...r }))

export class MockReviewRepository {
  async getAll(): Promise<Review[]> {
    return reviews.map((r) => ({ ...r }))
  }

  async getById(id: string): Promise<Review | null> {
    const r = reviews.find((x) => x.id === id)
    return r ? { ...r } : null
  }

  async updateStatus(id: string, status: ReviewStatus): Promise<Review | null> {
    const idx = reviews.findIndex((r) => r.id === id)
    if (idx === -1) return null
    reviews[idx] = { ...reviews[idx], status, updatedAt: new Date().toISOString() }
    return { ...reviews[idx] }
  }

  async bulkUpdateStatus(ids: string[], status: ReviewStatus): Promise<number> {
    let count = 0
    reviews = reviews.map((r) => {
      if (ids.includes(r.id)) {
        count += 1
        return { ...r, status, updatedAt: new Date().toISOString() }
      }
      return r
    })
    return count
  }

  async setFeatured(id: string, featured: boolean): Promise<Review | null> {
    const idx = reviews.findIndex((r) => r.id === id)
    if (idx === -1) return null
    reviews[idx] = { ...reviews[idx], featured, updatedAt: new Date().toISOString() }
    return { ...reviews[idx] }
  }

  async bulkSetFeatured(ids: string[], featured: boolean): Promise<number> {
    let count = 0
    reviews = reviews.map((r) => {
      if (ids.includes(r.id)) {
        count += 1
        return { ...r, featured, updatedAt: new Date().toISOString() }
      }
      return r
    })
    return count
  }

  async addResponse(id: string, content: string, author: string): Promise<Review | null> {
    const idx = reviews.findIndex((r) => r.id === id)
    if (idx === -1) return null
    reviews[idx] = {
      ...reviews[idx],
      response: { content, author, respondedAt: new Date().toISOString() },
      updatedAt: new Date().toISOString(),
    }
    return { ...reviews[idx] }
  }

  async deleteResponse(id: string): Promise<Review | null> {
    const idx = reviews.findIndex((r) => r.id === id)
    if (idx === -1) return null
    const { response: _drop, ...rest } = reviews[idx]
    reviews[idx] = { ...rest, updatedAt: new Date().toISOString() }
    return { ...reviews[idx] }
  }

  async delete(id: string): Promise<boolean> {
    const idx = reviews.findIndex((r) => r.id === id)
    if (idx === -1) return false
    reviews.splice(idx, 1)
    return true
  }
}

export const reviewRepository = new MockReviewRepository()