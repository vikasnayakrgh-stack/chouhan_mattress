import type { ICategoryRepository } from '@/repositories/types'
import type { Category } from '@/features/catalog/types'
import { supabaseMappers } from './mappers'

export class SupabaseCategoryRepository implements ICategoryRepository {
  async getAll(): Promise<Category[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
      .from('categories')
      .select('*')
      .order('position', { ascending: true })
    if (error) throw error
    return (data ?? []).map((r) => supabaseMappers.rowToCategory(r as Record<string, unknown>))
  }

  async getById(id: string): Promise<Category | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('categories').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    if (!data) return null
    return supabaseMappers.rowToCategory(data as Record<string, unknown>)
  }

  async getBySlug(slug: string): Promise<Category | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('categories').select('*').eq('slug', slug).maybeSingle()
    if (error) throw error
    if (!data) return null
    return supabaseMappers.rowToCategory(data as Record<string, unknown>)
  }

  async create(category: Omit<Category, 'id' | 'createdAt' | 'productCount'>): Promise<Category> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
      .from('categories')
      .insert({
        name: category.name,
        slug: category.slug,
        description: category.description,
        parent_id: category.parentId,
        status: category.status,
        position: category.position,
      })
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToCategory(data as Record<string, unknown>)
  }

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const sb = supabaseMappers.getClient()
    const patch: Record<string, unknown> = {}
    if (updates.name !== undefined) patch.name = updates.name
    if (updates.slug !== undefined) patch.slug = updates.slug
    if (updates.description !== undefined) patch.description = updates.description
    if (updates.parentId !== undefined) patch.parent_id = updates.parentId
    if (updates.status !== undefined) patch.status = updates.status
    if (updates.position !== undefined) patch.position = updates.position
    const { data, error } = await sb.from('categories').update(patch).eq('id', id).select().single()
    if (error) throw error
    return supabaseMappers.rowToCategory(data as Record<string, unknown>)
  }

  async delete(id: string): Promise<boolean> {
    const sb = supabaseMappers.getClient()
    const { error } = await sb.from('categories').delete().eq('id', id)
    if (error) throw error
    return true
  }
}
