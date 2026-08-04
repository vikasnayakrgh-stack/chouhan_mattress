import { getRepositories } from '@/repositories'
import type { Order, OrderStatus, PaymentStatus, Refund } from '@/features/orders/types'

export interface OrderFilters {
  search?: string
  status?: OrderStatus | 'all'
  paymentStatus?: PaymentStatus | 'all'
}

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  new: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
}

export const orderService = {
  async getAll(): Promise<Order[]> {
    return getRepositories().orders.getAll()
  },

  async getById(id: string): Promise<Order | null> {
    return getRepositories().orders.getById(id)
  },

  async getByCustomer(customerId: string): Promise<Order[]> {
    return getRepositories().orders.getByCustomer(customerId)
  },

  async search(filters: OrderFilters): Promise<Order[]> {
    let orders = await getRepositories().orders.getAll()
    if (filters.search) {
      const q = filters.search.toLowerCase()
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
      )
    }
    if (filters.status && filters.status !== 'all') {
      orders = orders.filter((o) => o.status === filters.status)
    }
    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      orders = orders.filter((o) => o.paymentStatus === filters.paymentStatus)
    }
    return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  getValidTransitions(currentStatus: OrderStatus): OrderStatus[] {
    return TRANSITIONS[currentStatus] ?? []
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    return getRepositories().orders.updateStatus(id, status)
  },

  async updateOrderStatus(id: string, newStatus: OrderStatus, adminNote?: string): Promise<Order | null> {
    return getRepositories().orders.updateStatus(id, newStatus, adminNote)
  },

  async addTracking(id: string, trackingNumber: string, carrier: string): Promise<Order | null> {
    return getRepositories().orders.addTracking(id, trackingNumber, carrier)
  },

  async initiateRefund(id: string, amount: number, reason: string): Promise<Order | null> {
    const order = await getRepositories().orders.getById(id)
    if (!order) return null
    const refund: Omit<Refund, 'id' | 'createdAt'> = {
      amount,
      reason,
      type: amount >= order.total ? 'full' : 'partial',
      status: 'initiated',
      actor: 'Admin',
    }
    return getRepositories().orders.addRefund(id, refund)
  },
}
