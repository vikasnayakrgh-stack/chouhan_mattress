import type { ICollectionRepository } from '@/repositories/types'
import type { Collection } from '@/features/catalog/types'
import { supabaseMappers } from './mappers'

export class SupabaseCollectionRepository implements ICollectionRepository {
  async getAll(): Promise<Collection[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('collections').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((r) => supabaseMappers.rowToCollection(r as Record<string, unknown>))
  }

  async getById(id: string): Promise<Collection | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('collections').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    if (!data) return null
    return supabaseMappers.rowToCollection(data as Record<string, unknown>)
  }

  async getBySlug(slug: string): Promise<Collection | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('collections').select('*').eq('slug', slug).maybeSingle()
    if (error) throw error
    if (!data) return null
    return supabaseMappers.rowToCollection(data as Record<string, unknown>)
  }

  async create(collection: Omit<Collection, 'id' | 'createdAt' | 'productCount'>): Promise<Collection> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
      .from('collections')
      .insert({
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        status: collection.status,
        is_automatic: collection.isAutomatic,
      })
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToCollection(data as Record<string, unknown>)
  }

  async update(id: string, updates: Partial<Collection>): Promise<Collection | null> {
    const sb = supabaseMappers.getClient()
    const patch: Record<string, unknown> = {}
    if (updates.name !== undefined) patch.name = updates.name
    if (updates.slug !== undefined) patch.slug = updates.slug
    if (updates.description !== undefined) patch.description = updates.description
    if (updates.status !== undefined) patch.status = updates.status
    if (updates.isAutomatic !== undefined) patch.is_automatic = updates.isAutomatic
    const { data, error } = await sb.from('collections').update(patch).eq('id', id).select().single()
    if (error) throw error
    return supabaseMappers.rowToCollection(data as Record<string, unknown>)
  }

  async delete(id: string): Promise<boolean> {
    const sb = supabaseMappers.getClient()
    const { error } = await sb.from('collections').delete().eq('id', id)
    if (error) throw error
    return true
  }
}
