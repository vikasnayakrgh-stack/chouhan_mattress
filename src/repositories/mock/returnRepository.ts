import type { IReturnRepository } from '@/repositories/types'
import type { Return, ReturnStatus } from '@/features/returns/types'
import { mockReturns } from '@/data/admin/returns.mock'

let returns: Return[] = mockReturns.map((r) => ({ ...r }))

export class MockReturnRepository implements IReturnRepository {
  async getAll(): Promise<Return[]> {
    return [...returns]
  }

  async getById(id: string): Promise<Return | null> {
    return returns.find((r) => r.id === id) ?? null
  }

  async getByOrderId(orderId: string): Promise<Return[]> {
    return returns.filter((r) => r.orderId === orderId)
  }

  async getByCustomerId(customerId: string): Promise<Return[]> {
    return returns.filter((r) => r.customerId === customerId)
  }

  async getByCustomer(customerId: string): Promise<Return[]> {
    return returns.filter((r) => r.customerId === customerId)
  }

  async updateStatus(id: string, status: ReturnStatus, actor: string): Promise<Return | null> {
    const idx = returns.findIndex((r) => r.id === id)
    if (idx === -1) return null

    const now = new Date().toISOString()
    returns[idx] = {
      ...returns[idx],
      status,
      updatedAt: now,
      timeline: [
        ...returns[idx].timeline,
        {
          id: `tl-${Date.now()}`,
          status,
          title: `Status changed to ${status}`,
          description: `Updated by ${actor}`,
          timestamp: now,
          actor,
        },
      ],
    }
    return returns[idx]
  }

  async delete(id: string): Promise<boolean> {
    const idx = returns.findIndex((r) => r.id === id)
    if (idx === -1) return false
    returns.splice(idx, 1)
    return true
  }
}