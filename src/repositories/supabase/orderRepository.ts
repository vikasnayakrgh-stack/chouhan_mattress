import type { IOrderRepository } from '@/repositories/types'
import type { Order, OrderStatus, Refund } from '@/features/orders/types'
import { supabaseMappers } from './mappers'

export class SupabaseOrderRepository implements IOrderRepository {
  async getAll(): Promise<Order[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((r) => supabaseMappers.rowToOrder(r as Record<string, unknown>))
  }

  async getById(id: string): Promise<Order | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('orders').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? supabaseMappers.rowToOrder(data as Record<string, unknown>) : null
  }

  async getByCustomer(customerId: string): Promise<Order[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
      .from('orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((r) => supabaseMappers.rowToOrder(r as Record<string, unknown>))
  }

  async updateStatus(id: string, status: OrderStatus, adminNote?: string): Promise<Order | null> {
    const sb = supabaseMappers.getClient()
    const { data: curRow, error: curErr } = await sb.from('orders').select('*').eq('id', id).single()
    if (curErr) throw curErr
    const cur = supabaseMappers.rowToOrder(curRow as Record<string, unknown>)
    const timeline = [
      ...cur.timeline,
      {
        id: `evt-${Date.now()}`,
        status,
        title: `Status changed to ${status}`,
        description: adminNote,
        timestamp: new Date().toISOString(),
        actor: 'admin',
      },
    ]
    const { data, error } = await sb
      .from('orders')
      .update({ status, timeline, notes: adminNote ? `${cur.notes ?? ''}\n${adminNote}` : cur.notes })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToOrder(data as Record<string, unknown>)
  }

  async addTracking(id: string, trackingNumber: string, carrier: string): Promise<Order | null> {
    const sb = supabaseMappers.getClient()
    const { data: curRow, error: curErr } = await sb.from('orders').select('*').eq('id', id).single()
    if (curErr) throw curErr
    const cur = supabaseMappers.rowToOrder(curRow as Record<string, unknown>)
    const timeline = [
      ...cur.timeline,
      {
        id: `evt-${Date.now()}`,
        status: 'shipped' as const,
        title: `Tracking added: ${carrier}`,
        description: trackingNumber,
        timestamp: new Date().toISOString(),
        actor: 'admin',
      },
    ]
    const { data, error } = await sb
      .from('orders')
      .update({ tracking_number: trackingNumber, carrier, fulfillment_status: 'fulfilled', timeline })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToOrder(data as Record<string, unknown>)
  }

  async addRefund(
    id: string,
    refund: Omit<Refund, 'id' | 'createdAt'>,
  ): Promise<Order | null> {
    const sb = supabaseMappers.getClient()
    const { data: curRow, error: curErr } = await sb.from('orders').select('*').eq('id', id).single()
    if (curErr) throw curErr
    const cur = supabaseMappers.rowToOrder(curRow as Record<string, unknown>)
    const newRefund: Refund = { ...refund, id: `ref-${Date.now()}`, createdAt: new Date().toISOString() }
    const refunds = [...(cur.refunds ?? []), newRefund]
    const { data, error } = await sb
      .from('orders')
      .update({ refunds, payment_status: 'refunded' })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToOrder(data as Record<string, unknown>)
  }
}
