import type { IDiscountRepository } from '@/repositories/types'
import type { Discount } from '@/features/discounts/types'
import { supabaseMappers } from './mappers'

export class SupabaseDiscountRepository implements IDiscountRepository {
  async getAll(): Promise<Discount[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('discounts').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((r) => supabaseMappers.rowToDiscount(r as Record<string, unknown>))
  }

  async getById(id: string): Promise<Discount | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('discounts').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? supabaseMappers.rowToDiscount(data as Record<string, unknown>) : null
  }

  async getByCode(code: string): Promise<Discount | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('discounts').select('*').ilike('code', code.trim()).maybeSingle()
    if (error) throw error
    return data ? supabaseMappers.rowToDiscount(data as Record<string, unknown>) : null
  }

  async create(discount: Discount): Promise<Discount> {
    const sb = supabaseMappers.getClient()
    const { id, condition, rule, createdAt, updatedAt, ...rest } = discount
    const { data, error } = await sb
      .from('discounts')
      .insert({ ...rest, condition, rule })
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToDiscount(data as Record<string, unknown>)
  }

  async update(id: string, updates: Partial<Discount>): Promise<Discount | null> {
    const sb = supabaseMappers.getClient()
    const { condition, rule, ...rest } = updates
    const patch: Record<string, unknown> = { ...rest }
    if (condition) patch.condition = condition
    if (rule) patch.rule = rule
    const { data, error } = await sb
      .from('discounts')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToDiscount(data as Record<string, unknown>)
  }

  async remove(id: string): Promise<boolean> {
    const sb = supabaseMappers.getClient()
    const { error } = await sb.from('discounts').delete().eq('id', id)
    if (error) throw error
    return true
  }
}
