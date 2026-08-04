import type { IOrderRepository } from '@/repositories/types'
import type { Order, OrderStatus, Refund } from '@/features/orders/types'
import { mockOrders } from '@/data/admin/orders.mock'

let orders: Order[] = mockOrders.map((o) => ({ ...o }))

export class MockOrderRepository implements IOrderRepository {
  async getAll(): Promise<Order[]> {
    return [...orders]
  }

  async getById(id: string): Promise<Order | null> {
    return orders.find((o) => o.id === id || o.orderNumber === id) ?? null
  }

  async getByCustomer(customerId: string): Promise<Order[]> {
    return orders.filter((o) => o.customerId === customerId)
  }

  async updateStatus(id: string, status: OrderStatus, adminNote?: string): Promise<Order | null> {
    const idx = orders.findIndex((o) => o.id === id)
    if (idx === -1) return null
    orders[idx] = {
      ...orders[idx],
      status,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...orders[idx].timeline,
        {
          id: `tl-${Date.now()}`,
          status,
          title: `Order ${status}`,
          description: adminNote,
          timestamp: new Date().toISOString(),
          actor: 'Admin',
        },
      ],
    }
    return orders[idx]
  }

  async addTracking(id: string, trackingNumber: string, carrier: string): Promise<Order | null> {
    const idx = orders.findIndex((o) => o.id === id)
    if (idx === -1) return null
    orders[idx] = {
      ...orders[idx],
      trackingNumber,
      carrier,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...orders[idx].timeline,
        {
          id: `tl-${Date.now()}`,
          status: 'shipped',
          title: 'Tracking added',
          description: `${trackingNumber} via ${carrier}`,
          timestamp: new Date().toISOString(),
          actor: 'Admin',
        },
      ],
    }
    return orders[idx]
  }

  async addRefund(id: string, refund: Omit<Refund, 'id' | 'createdAt'>): Promise<Order | null> {
    const idx = orders.findIndex((o) => o.id === id)
    if (idx === -1) return null
    const newRefund: Refund = {
      ...refund,
      id: `ref-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    orders[idx] = {
      ...orders[idx],
      paymentStatus: 'refunded',
      refunds: [...(orders[idx].refunds ?? []), newRefund],
      updatedAt: new Date().toISOString(),
      timeline: [
        ...orders[idx].timeline,
        {
          id: `tl-${Date.now()}`,
          status: 'payment',
          title: `Refund ${refund.type} initiated`,
          description: `₹${refund.amount.toLocaleString('en-IN')} — ${refund.reason}`,
          timestamp: new Date().toISOString(),
          actor: 'Admin',
        },
      ],
    }
    return orders[idx]
  }
}
