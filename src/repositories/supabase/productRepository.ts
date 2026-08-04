import type { IProductRepository } from '@/repositories/types'
import type { ProductWithVariants, ProductVariant } from '@/features/products/types'
import { supabaseMappers } from './mappers'

export class SupabaseProductRepository implements IProductRepository {
  async getAll(): Promise<ProductWithVariants[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
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
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
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
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
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
    const sb = supabaseMappers.getClient()
    let query = sb.from('products').select('*, variants:product_variants(*)', { count: 'exact' })
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
    const sb = supabaseMappers.getClient()
    const { id, variants, createdAt, updatedAt, ...rest } = product
    const { data, error } = await sb
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
      const { error: vErr } = await sb
        .from('product_variants')
        .insert(variants.map((v) => ({ ...v, product_id: data.id })))
      if (vErr) throw vErr
      created.variants = variants
    }
    return created
  }

  async update(id: string, updates: Partial<ProductWithVariants>): Promise<ProductWithVariants | null> {
    const sb = supabaseMappers.getClient()
    const { variants, collectionIds, mattressAttributes, ...rest } = updates
    const patch: Record<string, unknown> = { ...rest }
    if (collectionIds) patch.collection_ids = collectionIds
    if (mattressAttributes) patch.mattress_attributes = mattressAttributes
    const { data, error } = await sb
      .from('products')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToProduct(data as Record<string, unknown>)
  }

  async archive(id: string): Promise<boolean> {
    const sb = supabaseMappers.getClient()
    const { error } = await sb.from('products').update({ status: 'archived' }).eq('id', id)
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
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
    if (error) throw error
    return (data ?? []).map((v) => supabaseMappers.variantRowToVariant(v as Record<string, unknown>))
  }
}
