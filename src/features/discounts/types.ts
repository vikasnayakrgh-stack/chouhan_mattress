export type DiscountType = 'percentage' | 'fixed' | 'buy_x_get_y' | 'free_shipping'

export type DiscountStatus = 'active' | 'scheduled' | 'expired' | 'disabled'

export type CustomerGroup = 'all' | 'first_order' | 'returning' | 'vip'

export interface DiscountCondition {
  minOrderValue?: number
  categoryIds?: string[]
  productIds?: string[]
  customerGroup?: CustomerGroup
}

export interface DiscountRule {
  buyQuantity?: number
  getQuantity?: number
  freeShippingThreshold?: number
}

export interface Discount {
  id: string
  name: string
  code: string
  description?: string
  type: DiscountType
  value: number // percentage (0-100) or fixed ₹ amount; 0 for free_shipping/bxgy
  condition: DiscountCondition
  rule?: DiscountRule
  status: DiscountStatus
  startDate: string
  endDate: string | null
  usageLimit: number | null
  usageCount: number
  perCustomerLimit: number | null
  stackable: boolean
  oncePerCustomer: boolean
  revenueImpacted: number
  createdAt: string
  updatedAt: string
}

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  percentage: 'Percentage',
  fixed: 'Fixed Amount',
  buy_x_get_y: 'Buy X Get Y',
  free_shipping: 'Free Shipping',
}
