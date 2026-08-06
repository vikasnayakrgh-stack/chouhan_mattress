import type { IProductRepository } from '@/repositories/types'
import type { ProductWithVariants, ProductVariant } from '@/features/products/types'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { supabaseMappers } from './mappers'

export class SupabaseProductRepository implements IProductRepository {
  private client: SupabaseClient

  constructor(accessToken?: string) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    this.client = createClient(url, key, {
      global: {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      },
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }

  async getAll(): Promise<ProductWithVariants[]> {
    const { data, error } = await this.client
      .from('products')
      .select('*, variants:product_variants(*)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((r) => {
      const p = supabaseMappers.rowToProduct(r as Record<string, unknown>)
      p.variants = ((r as Record<string, unknown>).variants as unknown[] ?? []).map((v) =>
        supabaseMappers.variantRowToVariant(v as Record<string, unknown>),
      )
      return p
    })
  }

  async getById(id: string): Promise<ProductWithVariants | null> {
    const { data, error } = await this.client
      .from('products')
      .select('*, variants:product_variants(*)')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    const p = supabaseMappers.rowToProduct(data as Record<string, unknown>)
    p.variants = ((data as Record<string, unknown>).variants as unknown[] ?? []).map((v) =>
      supabaseMappers.variantRowToVariant(v as Record<string, unknown>),
    )
    return p
  }

  async getBySlug(slug: string): Promise<ProductWithVariants | null> {
    const { data, error } = await this.client
      .from('products')
      .select('*, variants:product_variants(*)')
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    const p = supabaseMappers.rowToProduct(data as Record<string, unknown>)
    p.variants = ((data as Record<string, unknown>).variants as unknown[] ?? []).map((v) =>
      supabaseMappers.variantRowToVariant(v as Record<string, unknown>),
    )
    return p
  }

  async search(filters: {
    categoryId?: string
    status?: string
    stock?: string
    query?: string
    page?: number
    pageSize?: number
  }): Promise<{ products: ProductWithVariants[]; total: number }> {
    let query = this.client.from('products').select('*, variants:product_variants(*)', { count: 'exact' })
    if (filters.categoryId) query = query.eq('category_id', filters.categoryId)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.query) query = query.ilike('name', `%${filters.query}%`)
    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? 20
    query = query.range((page - 1) * pageSize, page * pageSize - 1)
    const { data, error, count } = await query.order('created_at', { ascending: false })
    if (error) throw error
    const products = (data ?? []).map((r) => {
      const p = supabaseMappers.rowToProduct(r as Record<string, unknown>)
      p.variants = ((r as Record<string, unknown>).variants as unknown[] ?? []).map((v) =>
        supabaseMappers.variantRowToVariant(v as Record<string, unknown>),
      )
      return p
    })
    return { products, total: count ?? 0 }
  }

  async create(product: ProductWithVariants): Promise<ProductWithVariants> {
    const { id, variants, createdAt, updatedAt, ...rest } = product
    const { data, error } = await this.client
      .from('products')
      .insert({
        ...rest,
        collection_ids: product.collectionIds,
        mattress_attributes: product.mattressAttributes,
      })
      .select()
      .single()
    if (error) throw error
    const created = supabaseMappers.rowToProduct(data as Record<string, unknown>)
    if (variants?.length) {
      const { error: vErr } = await this.client
        .from('product_variants')
        .insert(variants.map((v) => ({ ...v, product_id: data.id })))
      if (vErr) throw vErr
      created.variants = variants
    }
    return created
  }

  async update(id: string, updates: Partial<ProductWithVariants>): Promise<ProductWithVariants | null> {
    const { variants, collectionIds, mattressAttributes, ...rest } = updates
    const patch: Record<string, unknown> = { ...rest }
    if (collectionIds) patch.collection_ids = collectionIds
    if (mattressAttributes) patch.mattress_attributes = mattressAttributes
    const { data, error } = await this.client
      .from('products')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToProduct(data as Record<string, unknown>)
  }

  async archive(id: string): Promise<boolean> {
    const { error } = await this.client.from('products').update({ status: 'archived' }).eq('id', id)
    if (error) throw error
    return true
  }

  async duplicate(id: string): Promise<ProductWithVariants | null> {
    const src = await this.getById(id)
    if (!src) return null
    const copy: ProductWithVariants = {
      ...src,
      id: '',
      name: `${src.name} (Copy)`,
      slug: `${src.slug}-copy`,
      status: 'draft',
      variants: src.variants.map((v) => ({ ...v, id: '', sku: `${v.sku}-copy` })),
    }
    return this.create(copy)
  }

  async getVariants(productId: string): Promise<ProductVariant[]> {
    const { data, error } = await this.client
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
    if (error) throw error
    return (data ?? []).map((v) => supabaseMappers.variantRowToVariant(v as Record<string, unknown>))
  }
}
