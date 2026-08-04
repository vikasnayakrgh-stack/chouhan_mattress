import type { IInventoryRepository } from '@/repositories/types'
import type { InventoryItem, StockAdjustment } from '@/features/inventory/types'
import { getInventoryStatus } from '@/features/inventory/types'
import { supabaseMappers } from './mappers'

export class SupabaseInventoryRepository implements IInventoryRepository {
  async getAll(): Promise<InventoryItem[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
      .from('inventory')
      .select('*, product:products(name)')
      .order('updated_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((r) => supabaseMappers.rowToInventory(r as Record<string, unknown>))
  }

  async getBySku(sku: string): Promise<InventoryItem | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
      .from('inventory')
      .select('*, product:products(name)')
      .eq('sku', sku)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    return supabaseMappers.rowToInventory(data as Record<string, unknown>)
  }

  async adjustStock(adjustment: Omit<StockAdjustment, 'id' | 'createdAt'>): Promise<InventoryItem | null> {
    const sb = supabaseMappers.getClient()
    // Fetch current stock
    const { data: inv, error: fetchErr } = await sb
      .from('inventory')
      .select('*')
      .eq('sku', adjustment.sku)
      .maybeSingle()
    if (fetchErr) throw fetchErr
    if (!inv) return null

    const newStock = Math.max(0, (inv.stock as number) + adjustment.delta)
    const status = getInventoryStatus(newStock, (inv.low_stock_threshold as number) ?? 5)
    const { data: updated, error: updErr } = await sb
      .from('inventory')
      .update({ stock: newStock, status })
      .eq('id', inv.id)
      .select('*, product:products(name)')
      .single()
    if (updErr) throw updErr

    // Insert adjustment log
    const { error: adjErr } = await sb.from('stock_adjustments').insert({
      inventory_item_id: inv.id,
      sku: adjustment.sku,
      delta: adjustment.delta,
      reason: adjustment.reason,
      note: adjustment.note ?? null,
      adjusted_by: adjustment.adjustedBy,
    })
    if (adjErr) throw adjErr

    return supabaseMappers.rowToInventory(updated as Record<string, unknown>)
  }
}
