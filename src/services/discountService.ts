import { getRepositories } from '@/repositories'
import type { Discount, DiscountStatus, DiscountType } from '@/features/discounts/types'

export interface DiscountFilters {
  search?: string
  status?: DiscountStatus | 'all'
  type?: DiscountType | 'all'
}

export interface DiscountDraft {
  name: string
  code: string
  description?: string
  type: DiscountType
  value: number
  minOrderValue?: number
  categoryIds?: string[]
  productIds?: string[]
  customerGroup?: Discount['condition']['customerGroup']
  startDate: string
  endDate: string | null
  usageLimit: number | null
  perCustomerLimit: number | null
  stackable: boolean
  oncePerCustomer: boolean
}

function computeStatus(startDate: string, endDate: string | null): DiscountStatus {
  const today = new Date().toISOString().slice(0, 10)
  if (startDate > today) return 'scheduled'
  if (endDate && endDate < today) return 'expired'
  return 'active'
}

export const discountService = {
  async getAll(): Promise<Discount[]> {
    return getRepositories().discounts.getAll()
  },

  async getById(id: string): Promise<Discount | null> {
    return getRepositories().discounts.getById(id)
  },

  async getByCode(code: string): Promise<Discount | null> {
    const repos = getRepositories()
    if (typeof repos.discounts.getByCode === 'function') {
      return repos.discounts.getByCode(code)
    }
    const discounts = await repos.discounts.getAll()
    const q = code.trim().toUpperCase()
    return discounts.find((d) => d.code.toUpperCase() === q) ?? null
  },

  async validateCoupon(
    code: string,
    subtotal: number
  ): Promise<{ valid: boolean; discountAmount: number; discount?: Discount; message?: string }> {
    const discount = await this.getByCode(code)
    if (!discount) {
      return { valid: false, discountAmount: 0, message: `Invalid coupon code: ${code}` }
    }
    if (discount.status !== 'active') {
      return { valid: false, discountAmount: 0, message: `Coupon ${code} is currently ${discount.status}` }
    }
    if (discount.condition?.minOrderValue && subtotal < discount.condition.minOrderValue) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum order value of ₹${discount.condition.minOrderValue} required for coupon ${code}`,
      }
    }
    let discountAmount = 0
    if (discount.type === 'percentage') {
      discountAmount = Math.round((subtotal * discount.value) / 100)
    } else if (discount.type === 'fixed') {
      discountAmount = Math.min(discount.value, subtotal)
    }
    return { valid: true, discountAmount, discount }
  },

  async search(filters: DiscountFilters): Promise<Discount[]> {
    let discounts = await getRepositories().discounts.getAll()
    if (filters.search) {
      const q = filters.search.toLowerCase()
      discounts = discounts.filter(
        (d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)
      )
    }
    if (filters.status && filters.status !== 'all') {
      discounts = discounts.filter((d) => d.status === filters.status)
    }
    if (filters.type && filters.type !== 'all') {
      discounts = discounts.filter((d) => d.type === filters.type)
    }
    return discounts.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async create(draft: DiscountDraft): Promise<Discount> {
    const now = new Date().toISOString()
    const discount: Discount = {
      id: `disc-${Date.now()}`,
      name: draft.name,
      code: draft.code.toUpperCase(),
      description: draft.description,
      type: draft.type,
      value: draft.value,
      condition: {
        minOrderValue: draft.minOrderValue,
        categoryIds: draft.categoryIds,
        productIds: draft.productIds,
        customerGroup: draft.customerGroup ?? 'all',
      },
      status: computeStatus(draft.startDate, draft.endDate),
      startDate: draft.startDate,
      endDate: draft.endDate,
      usageLimit: draft.usageLimit,
      usageCount: 0,
      perCustomerLimit: draft.perCustomerLimit,
      stackable: draft.stackable,
      oncePerCustomer: draft.oncePerCustomer,
      revenueImpacted: 0,
      createdAt: now,
      updatedAt: now,
    }
    return getRepositories().discounts.create(discount)
  },

  async update(id: string, updates: Partial<Discount>): Promise<Discount | null> {
    return getRepositories().discounts.update(id, updates)
  },

  async remove(id: string): Promise<boolean> {
    return getRepositories().discounts.remove(id)
  },

  async toggleStatus(id: string): Promise<Discount | null> {
    const d = await getRepositories().discounts.getById(id)
    if (!d) return null
    const next: DiscountStatus = d.status === 'disabled' ? computeStatus(d.startDate, d.endDate) : 'disabled'
    return getRepositories().discounts.update(id, { status: next })
  },
}
