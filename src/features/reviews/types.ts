export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged'
export type ReviewSource = 'website' | 'amazon' | 'flipkart' | 'google' | 'whatsapp'

export interface ReviewResponse {
  content: string
  author: string
  respondedAt: string
}

export interface Review {
  id: string
  productId: string
  productName: string
  productSlug: string
  customerId?: string
  customerName: string
  customerEmail: string
  customerCity: string
  rating: 1 | 2 | 3 | 4 | 5
  title: string
  content: string
  images: string[]
  verifiedPurchase: boolean
  featured: boolean
  helpfulCount: number
  source: ReviewSource
  status: ReviewStatus
  response?: ReviewResponse
  createdAt: string
  updatedAt: string
}

export interface ReviewFilters {
  search?: string
  status?: ReviewStatus | 'all'
  productId?: string | 'all'
  rating?: number | 'all'
  source?: ReviewSource | 'all'
  dateFrom?: string
  dateTo?: string
}

export interface ReviewStats {
  total: number
  pending: number
  approved: number
  rejected: number
  averageRating: number
}
