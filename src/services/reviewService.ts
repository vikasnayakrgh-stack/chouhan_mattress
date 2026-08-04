import { getRepositories } from '@/repositories'
import type { Review, ReviewFilters, ReviewStats, ReviewStatus } from '@/features/reviews/types'

export const reviewService = {
  async getAll(filters: ReviewFilters = {}): Promise<Review[]> {
    let reviews = await getRepositories().reviews.getAll()

    if (filters.search) {
      const q = filters.search.toLowerCase()
      reviews = reviews.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.content.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q)
      )
    }
    if (filters.status && filters.status !== 'all') reviews = reviews.filter((r) => r.status === filters.status)
    if (filters.productId && filters.productId !== 'all') reviews = reviews.filter((r) => r.productId === filters.productId)
    if (filters.rating && filters.rating !== 'all') reviews = reviews.filter((r) => r.rating === filters.rating)
    if (filters.source && filters.source !== 'all') reviews = reviews.filter((r) => r.source === filters.source)
    if (filters.dateFrom) reviews = reviews.filter((r) => r.createdAt >= filters.dateFrom!)
    if (filters.dateTo) reviews = reviews.filter((r) => r.createdAt <= `${filters.dateTo}T23:59:59`)

    return reviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async getById(id: string): Promise<Review | null> {
    return getRepositories().reviews.getById(id)
  },

  async getStats(): Promise<ReviewStats> {
    const reviews = await getRepositories().reviews.getAll()
    const approved = reviews.filter((r) => r.status === 'approved')
    return {
      total: reviews.length,
      pending: reviews.filter((r) => r.status === 'pending').length,
      approved: approved.length,
      rejected: reviews.filter((r) => r.status === 'rejected').length,
      averageRating: approved.length
        ? Number((approved.reduce((sum, r) => sum + r.rating, 0) / approved.length).toFixed(1))
        : 0,
    }
  },

  async approve(id: string): Promise<Review | null> {
    return getRepositories().reviews.updateStatus(id, 'approved')
  },

  async reject(id: string): Promise<Review | null> {
    return getRepositories().reviews.updateStatus(id, 'rejected')
  },

  async flag(id: string): Promise<Review | null> {
    return getRepositories().reviews.updateStatus(id, 'flagged')
  },

  async setStatus(id: string, status: ReviewStatus): Promise<Review | null> {
    return getRepositories().reviews.updateStatus(id, status)
  },

  async bulkApprove(ids: string[]): Promise<number> {
    return getRepositories().reviews.bulkUpdateStatus(ids, 'approved')
  },

  async bulkReject(ids: string[]): Promise<number> {
    return getRepositories().reviews.bulkUpdateStatus(ids, 'rejected')
  },

  async bulkFeature(ids: string[]): Promise<number> {
    return getRepositories().reviews.bulkSetFeatured(ids, true)
  },

  async toggleFeatured(id: string, featured: boolean): Promise<Review | null> {
    return getRepositories().reviews.setFeatured(id, featured)
  },

  async respond(id: string, content: string, author = 'Chouhan Support'): Promise<Review | null> {
    return getRepositories().reviews.addResponse(id, content, author)
  },

  async deleteResponse(id: string): Promise<Review | null> {
    return getRepositories().reviews.deleteResponse(id)
  },
}
