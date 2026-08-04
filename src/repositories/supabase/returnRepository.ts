import type { IReturnRepository } from '@/repositories/types'
import type { Return, ReturnStatus } from '@/features/returns/types'
import { supabaseMappers } from './mappers'

export class SupabaseReturnRepository implements IReturnRepository {
  async getAll(): Promise<Return[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('returns').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((r) => supabaseMappers.rowToReturn(r as Record<string, unknown>))
  }

  async getById(id: string): Promise<Return | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('returns').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? supabaseMappers.rowToReturn(data as Record<string, unknown>) : null
  }

  async getByOrderId(orderId: string): Promise<Return[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('returns').select('*').eq('order_id', orderId)
    if (error) throw error
    return (data ?? []).map((r) => supabaseMappers.rowToReturn(r as Record<string, unknown>))
  }

  async getByCustomerId(customerId: string): Promise<Return[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('returns').select('*').eq('customer_id', customerId)
    if (error) throw error
    return (data ?? []).map((r) => supabaseMappers.rowToReturn(r as Record<string, unknown>))
  }

  // Alias kept for compatibility with the interface's getByCustomer entry.
  async getByCustomer(customerId: string): Promise<Return[]> {
    return this.getByCustomerId(customerId)
  }

  async updateStatus(id: string, status: ReturnStatus, actor: string): Promise<Return | null> {
    const sb = supabaseMappers.getClient()
    const { data: curRow, error: curErr } = await sb.from('returns').select('*').eq('id', id).single()
    if (curErr) throw curErr
    const cur = supabaseMappers.rowToReturn(curRow as Record<string, unknown>)
    const timeline = [
      ...cur.timeline,
      {
        id: `evt-${Date.now()}`,
        status,
        title: `Status changed to ${status}`,
        timestamp: new Date().toISOString(),
        actor,
      },
    ]
    const { data, error } = await sb
      .from('returns')
      .update({ status, timeline })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToReturn(data as Record<string, unknown>)
  }

  async delete(id: string): Promise<boolean> {
    const sb = supabaseMappers.getClient()
    const { error } = await sb.from('returns').delete().eq('id', id)
    if (error) throw error
    return true
  }
}
