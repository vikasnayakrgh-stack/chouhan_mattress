import { getRepositories } from '@/repositories'
import type { Return, ReturnStatus, ReturnReason, ReturnFilters as ReturnFiltersType } from '@/features/returns/types'

const RETURN_TRANSITIONS: Record<ReturnStatus, ReturnStatus[]> = {
  requested: ['approved', 'rejected'],
  approved: ['received'],
  received: ['inspected'],
  inspected: ['refunded', 'rejected'],
  refunded: [],
  rejected: [],
}

export const returnService = {
  async getAll(filters: ReturnFiltersType = {}): Promise<Return[]> {
    const repo = getRepositories()
    let returns = await repo.returns.getAll()

    if (filters.search) {
      const q = filters.search.toLowerCase()
      returns = returns.filter(
        (r) =>
          r.returnNumber.toLowerCase().includes(q) ||
          r.orderNumber.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.customerPhone.includes(q)
      )
    }

    if (filters.status && filters.status !== 'all') {
      returns = returns.filter((r) => r.status === filters.status)
    }

    if (filters.reason && filters.reason !== 'all') {
      returns = returns.filter((r) => r.reason === filters.reason)
    }

    if (filters.dateFrom) {
      returns = returns.filter((r) => r.createdAt >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      returns = returns.filter((r) => r.createdAt <= filters.dateTo!)
    }

    return returns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async getById(id: string): Promise<Return | null> {
    const repo = getRepositories()
    return repo.returns.getById(id)
  },

  async getByOrderId(orderId: string): Promise<Return[]> {
    const repo = getRepositories()
    return repo.returns.getByOrderId(orderId)
  },

  async getByCustomerId(customerId: string): Promise<Return[]> {
    const repo = getRepositories()
    return repo.returns.getByCustomer(customerId)
  },

  getValidTransitions(currentStatus: ReturnStatus): ReturnStatus[] {
    return RETURN_TRANSITIONS[currentStatus] ?? []
  },

  async updateStatus(id: string, status: ReturnStatus, actor: string = 'Admin'): Promise<Return | null> {
    const repo = getRepositories()
    return repo.returns.updateStatus(id, status, actor)
  },

  async approve(id: string, actor: string = 'Admin'): Promise<Return | null> {
    return this.updateStatus(id, 'approved', actor)
  },

  async reject(id: string, actor: string = 'Admin'): Promise<Return | null> {
    return this.updateStatus(id, 'rejected', actor)
  },

  async markReceived(id: string, actor: string = 'Warehouse'): Promise<Return | null> {
    return this.updateStatus(id, 'received', actor)
  },

  async markInspected(id: string, actor: string = 'Quality'): Promise<Return | null> {
    return this.updateStatus(id, 'inspected', actor)
  },

  async processRefund(id: string, actor: string = 'Finance'): Promise<Return | null> {
    return this.updateStatus(id, 'refunded', actor)
  },

  async delete(id: string): Promise<boolean> {
    const repo = getRepositories()
    return repo.returns.delete(id)
  },
}
