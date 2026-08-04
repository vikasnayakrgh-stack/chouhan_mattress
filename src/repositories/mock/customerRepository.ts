import type { ICustomerRepository } from '@/repositories/types'
import type { Customer, CustomerAddress, CustomerNote } from '@/features/customers/types'
import { mockCustomers } from '@/data/admin/customers.mock'

let customers: Customer[] = mockCustomers.map((c) => ({
  ...c,
  addresses: c.addresses.map((a) => ({ ...a })),
  notes: c.notes.map((n) => ({ ...n })),
}))

function find(customerId: string): Customer | undefined {
  return customers.find((c) => c.id === customerId)
}

export class MockCustomerRepository implements ICustomerRepository {
  async getAll(): Promise<Customer[]> {
    return [...customers]
  }

  async getById(id: string): Promise<Customer | null> {
    return find(id) ?? null
  }

  async addNote(customerId: string, content: string, author: string): Promise<CustomerNote | null> {
    const c = find(customerId)
    if (!c) return null
    const note: CustomerNote = {
      id: `note-${Date.now()}`,
      content,
      author,
      createdAt: new Date().toISOString(),
    }
    c.notes = [note, ...c.notes]
    return note
  }

  async updateNote(customerId: string, noteId: string, content: string): Promise<CustomerNote | null> {
    const c = find(customerId)
    if (!c) return null
    const idx = c.notes.findIndex((n) => n.id === noteId)
    if (idx === -1) return null
    c.notes[idx] = { ...c.notes[idx], content, updatedAt: new Date().toISOString() }
    return c.notes[idx]
  }

  async deleteNote(customerId: string, noteId: string): Promise<boolean> {
    const c = find(customerId)
    if (!c) return false
    const before = c.notes.length
    c.notes = c.notes.filter((n) => n.id !== noteId)
    return c.notes.length < before
  }

  async addAddress(customerId: string, address: Omit<CustomerAddress, 'id'>): Promise<CustomerAddress | null> {
    const c = find(customerId)
    if (!c) return null
    const addr: CustomerAddress = { ...address, id: `addr-${Date.now()}` }
    if (addr.isDefaultShipping) c.addresses.forEach((a) => (a.isDefaultShipping = false))
    if (addr.isDefaultBilling) c.addresses.forEach((a) => (a.isDefaultBilling = false))
    c.addresses = [...c.addresses, addr]
    return addr
  }

  async updateAddress(
    customerId: string,
    addressId: string,
    updates: Partial<Omit<CustomerAddress, 'id'>>
  ): Promise<CustomerAddress | null> {
    const c = find(customerId)
    if (!c) return null
    const idx = c.addresses.findIndex((a) => a.id === addressId)
    if (idx === -1) return null
    if (updates.isDefaultShipping) c.addresses.forEach((a) => (a.isDefaultShipping = false))
    if (updates.isDefaultBilling) c.addresses.forEach((a) => (a.isDefaultBilling = false))
    c.addresses[idx] = { ...c.addresses[idx], ...updates }
    return c.addresses[idx]
  }

  async deleteAddress(customerId: string, addressId: string): Promise<boolean> {
    const c = find(customerId)
    if (!c) return false
    const before = c.addresses.length
    c.addresses = c.addresses.filter((a) => a.id !== addressId)
    return c.addresses.length < before
  }

  async setDefaultAddress(customerId: string, addressId: string, kind: 'shipping' | 'billing'): Promise<boolean> {
    const c = find(customerId)
    if (!c) return false
    const target = c.addresses.find((a) => a.id === addressId)
    if (!target) return false
    c.addresses.forEach((a) => {
      if (kind === 'shipping') a.isDefaultShipping = a.id === addressId
      else a.isDefaultBilling = a.id === addressId
    })
    return true
  }
}
