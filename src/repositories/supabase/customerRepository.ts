import type { ICustomerRepository } from '@/repositories/types'
import type { Customer, CustomerAddress, CustomerNote } from '@/features/customers/types'
import { supabaseMappers } from './mappers'

export class SupabaseCustomerRepository implements ICustomerRepository {
  async getAll(): Promise<Customer[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('customers').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((r) => supabaseMappers.rowToCustomer(r as Record<string, unknown>))
  }

  async getById(id: string): Promise<Customer | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('customers').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? supabaseMappers.rowToCustomer(data as Record<string, unknown>) : null
  }

  private async patchJsonArray(
    id: string,
    column: 'addresses' | 'notes',
    mutator: (arr: unknown[]) => unknown[],
  ): Promise<Customer | null> {
    const sb = supabaseMappers.getClient()
    const { data: curRow, error: curErr } = await sb.from('customers').select('*').eq('id', id).single()
    if (curErr) throw curErr
    const cur = supabaseMappers.rowToCustomer(curRow as Record<string, unknown>)
    const next = mutator((cur[column] as unknown[]) ?? [])
    const { data, error } = await sb
      .from('customers')
      .update({ [column]: next })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToCustomer(data as Record<string, unknown>)
  }

  async addNote(customerId: string, content: string, author: string): Promise<CustomerNote | null> {
    const note: CustomerNote = {
      id: `note-${Date.now()}`,
      content,
      author,
      createdAt: new Date().toISOString(),
    }
    const updated = await this.patchJsonArray(customerId, 'notes', (arr) => [...arr, note])
    return updated?.notes.find((n) => n.id === note.id) ?? null
  }

  async updateNote(customerId: string, noteId: string, content: string): Promise<CustomerNote | null> {
    await this.patchJsonArray(customerId, 'notes', (arr) =>
      (arr as CustomerNote[]).map((n) =>
        n.id === noteId ? { ...n, content, updatedAt: new Date().toISOString() } : n,
      ),
    )
    return (await this.getById(customerId))?.notes.find((n) => n.id === noteId) ?? null
  }

  async deleteNote(customerId: string, noteId: string): Promise<boolean> {
    await this.patchJsonArray(customerId, 'notes', (arr) =>
      (arr as CustomerNote[]).filter((n) => n.id !== noteId),
    )
    return true
  }

  async addAddress(
    customerId: string,
    address: Omit<CustomerAddress, 'id'>,
  ): Promise<CustomerAddress | null> {
    const newAddr: CustomerAddress = { ...address, id: `addr-${Date.now()}` }
    const updated = await this.patchJsonArray(customerId, 'addresses', (arr) => [...arr, newAddr])
    return updated?.addresses.find((a) => a.id === newAddr.id) ?? null
  }

  async updateAddress(
    customerId: string,
    addressId: string,
    updates: Partial<Omit<CustomerAddress, 'id'>>,
  ): Promise<CustomerAddress | null> {
    await this.patchJsonArray(customerId, 'addresses', (arr) =>
      (arr as CustomerAddress[]).map((a) => (a.id === addressId ? { ...a, ...updates } : a)),
    )
    return (await this.getById(customerId))?.addresses.find((a) => a.id === addressId) ?? null
  }

  async deleteAddress(customerId: string, addressId: string): Promise<boolean> {
    await this.patchJsonArray(customerId, 'addresses', (arr) =>
      (arr as CustomerAddress[]).filter((a) => a.id !== addressId),
    )
    return true
  }

  async setDefaultAddress(
    customerId: string,
    addressId: string,
    kind: 'shipping' | 'billing',
  ): Promise<boolean> {
    const flag = kind === 'shipping' ? 'isDefaultShipping' : 'isDefaultBilling'
    await this.patchJsonArray(customerId, 'addresses', (arr) =>
      (arr as CustomerAddress[]).map((a) => ({ ...a, [flag]: a.id === addressId })),
    )
    return true
  }
}
