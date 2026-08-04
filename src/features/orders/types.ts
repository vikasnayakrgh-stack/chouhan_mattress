export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'

export type PaymentStatus = 'paid' | 'pending' | 'cod' | 'failed' | 'refunded'

export type FulfillmentStatus = 'unfulfilled' | 'partially_fulfilled' | 'fulfilled'

export interface Address {
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  variantId: string
  sku: string
  variantLabel: string // "Queen / 6 inch"
  quantity: number
  mrp: number
  sellingPrice: number
  total: number
  image?: string
}

export interface OrderTimelineEvent {
  id: string
  status: OrderStatus | 'payment' | 'note'
  title: string
  description?: string
  timestamp: string
  actor?: string
}

export interface Refund {
  id: string
  amount: number
  reason: string
  type: 'full' | 'partial'
  status: 'initiated' | 'processed'
  createdAt: string
  actor?: string
}

export interface Order {
  id: string
  orderNumber: string // e.g. "CM-1042"
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  discount: number
  shippingFee: number
  tax: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  fulfillmentStatus: FulfillmentStatus
  shippingAddress: Address
  billingAddress: Address
  timeline: OrderTimelineEvent[]
  trackingNumber?: string
  carrier?: string
  refunds?: Refund[]
  notes?: string
  createdAt: string
  updatedAt: string
}
