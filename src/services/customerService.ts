import { getRepositories } from '@/repositories'
import type { Customer, CustomerAddress, CustomerNote, CustomerStatus } from '@/features/customers/types'
import type { Order } from '@/features/orders/types'
import type { Return } from '@/features/returns/types'

export interface CustomerFilters {
  search?: string
  status?: CustomerStatus | 'all'
}

export interface CustomerLifetimeValue {
  totalSpend: number
  orderCount: number
  averageOrderValue: number
  firstOrderDate: string | null
  lastOrderDate: string | null
}

export interface CustomerWithDetails {
  customer: Customer
  orders: Order[]
  returns: Return[]
  lifetimeValue: CustomerLifetimeValue
}

export const customerService = {
  async getAll(): Promise<Customer[]> {
    return getRepositories().customers.getAll()
  },

  async getById(id: string): Promise<Customer | null> {
    return getRepositories().customers.getById(id)
  },

  async getCustomerWithDetails(id: string): Promise<CustomerWithDetails | null> {
    const repo = getRepositories()
    const customer = await repo.customers.getById(id)
    if (!customer) return null
    const orders = (await repo.orders.getByCustomer(id)).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const returns = (await repo.returns.getByCustomer(id)).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const validOrders = orders.filter((o) => o.status !== 'cancelled')
    const totalSpend = validOrders.reduce((s, o) => s + o.total, 0)
    const orderCount = validOrders.length
    const sortedAsc = [...orders].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    return {
      customer,
      orders,
      returns,
      lifetimeValue: {
        totalSpend,
        orderCount,
        averageOrderValue: orderCount > 0 ? Math.round(totalSpend / orderCount) : 0,
        firstOrderDate: sortedAsc[0]?.createdAt ?? null,
        lastOrderDate: sortedAsc[sortedAsc.length - 1]?.createdAt ?? null,
      },
    }
  },

  async search(filters: CustomerFilters): Promise<Customer[]> {
    let customers = await getRepositories().customers.getAll()
    if (filters.search) {
      const q = filters.search.toLowerCase()
      customers = customers.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
      )
    }
    if (filters.status && filters.status !== 'all') {
      customers = customers.filter((c) => c.status === filters.status)
    }
    return customers
  },

  async addNote(customerId: string, content: string, author = 'Admin'): Promise<CustomerNote | null> {
    return getRepositories().customers.addNote(customerId, content, author)
  },

  async updateNote(customerId: string, noteId: string, content: string): Promise<CustomerNote | null> {
    return getRepositories().customers.updateNote(customerId, noteId, content)
  },

  async deleteNote(customerId: string, noteId: string): Promise<CustomerNote | null> {
      return getRepositories().customers.deleteNote(customerId, noteId)
    },

  async addAddress(customerId: string, address: Omit<CustomerAddress, 'id'>): Promise<CustomerAddress | null> {
    return getRepositories().customers.addAddress(customerId, address)
  },

  async updateAddress(
    customerId: string,
    addressId: string,
    updates: Partial<Omit<CustomerAddress, 'id'>>
  ): Promise<CustomerAddress | null> {
    return getRepositories().customers.updateAddress(customerId, addressId, updates)
  },

  async deleteAddress(customerId: string, addressId: string): Promise<boolean> {
    return getRepositories().customers.deleteAddress(customerId, addressId)
  },

  async setDefaultAddress(customerId: string, addressId: string, kind: 'shipping' | 'billing'): Promise<boolean> {
    return getRepositories().customers.setDefaultAddress(customerId, addressId, kind)
  },
}
