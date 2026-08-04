import type { IReviewRepository } from '@/repositories/types'
import type { Review, ReviewStatus } from '@/features/reviews/types'
import { supabaseMappers } from './mappers'

export class SupabaseReviewRepository implements IReviewRepository {
  async getAll(): Promise<Review[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
      .from('reviews')
      .select('*, product:products(name)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((r) => this.mapRow(r as Record<string, unknown>))
  }

  async getById(id: string): Promise<Review | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('reviews').select('*, product:products(name)').eq('id', id).maybeSingle()
    if (error) throw error
    if (!data) return null
    return this.mapRow(data as Record<string, unknown>)
  }

  async updateStatus(id: string, status: ReviewStatus): Promise<Review | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('reviews').update({ status }).eq('id', id).select('*, product:products(name)').single()
    if (error) throw error
    return this.mapRow(data as Record<string, unknown>)
  }

  async bulkUpdateStatus(ids: string[], status: ReviewStatus): Promise<number> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('reviews').update({ status }).in('id', ids).select('id')
    if (error) throw error
    return data?.length ?? 0
  }

  async setFeatured(id: string, featured: boolean): Promise<Review | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('reviews').update({ is_featured: featured }).eq('id', id).select('*, product:products(name)').single()
    if (error) throw error
    return this.mapRow(data as Record<string, unknown>)
  }

  async bulkSetFeatured(ids: string[], featured: boolean): Promise<number> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('reviews').update({ is_featured: featured }).in('id', ids).select('id')
    if (error) throw error
    return data?.length ?? 0
  }

  async addResponse(id: string, content: string, author: string): Promise<Review | null> {
    const sb = supabaseMappers.getClient()
    const responseData = JSON.stringify({ content, author, respondedAt: new Date().toISOString() })
    const { data, error } = await sb.from('reviews').update({
      response: responseData,
    }).eq('id', id).select('*, product:products(name)').single()
    if (error) throw error
    return this.mapRow(data as Record<string, unknown>)
  }

  async deleteResponse(id: string): Promise<Review | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('reviews').update({
      response: null,
    }).eq('id', id).select('*, product:products(name)').single()
    if (error) throw error
    return this.mapRow(data as Record<string, unknown>)
  }

  async delete(id: string): Promise<boolean> {
    const sb = supabaseMappers.getClient()
    const { error } = await sb.from('reviews').delete().eq('id', id)
    if (error) throw error
    return true
  }

  private mapRow(row: Record<string, unknown>): Review {
    const product = row.product as Record<string, unknown> | null
    const rawResponse = row.response
    let response: Review['response']
    if (rawResponse && typeof rawResponse === 'string') {
      try {
        const parsed = JSON.parse(rawResponse) as { content: string; author: string; respondedAt: string }
        response = { content: parsed.content, author: parsed.author, respondedAt: parsed.respondedAt }
      } catch {
        response = undefined
      }
    } else if (rawResponse && typeof rawResponse === 'object') {
      const r = rawResponse as Record<string, unknown>
      response = { content: String(r.content ?? ''), author: String(r.author ?? ''), respondedAt: String(r.respondedAt ?? '') }
    } else {
      response = undefined
    }
    return {
      id: String(row.id),
      productId: String(row.product_id ?? ''),
      productName: String(product?.name ?? ''),
      productSlug: String((product as Record<string, unknown> | null)?.slug ?? ''),
      customerId: row.customer_id ? String(row.customer_id) : undefined,
      customerName: String(row.customer_name ?? ''),
      customerEmail: String(row.customer_email ?? ''),
      customerCity: String(row.customer_city ?? ''),
      rating: (Number(row.rating ?? 5)) as 1 | 2 | 3 | 4 | 5,
      title: String(row.title ?? ''),
      content: String(row.content ?? ''),
      images: (row.images as string[]) ?? [],
      verifiedPurchase: Boolean(row.verified_purchase ?? row.verified ?? false),
      featured: Boolean(row.is_featured ?? false),
      helpfulCount: Number(row.helpful_count ?? 0),
      source: String(row.source ?? 'website') as Review['source'],
      status: String(row.status ?? 'pending') as ReviewStatus,
      response,
      createdAt: String(row.created_at ?? new Date().toISOString()),
      updatedAt: String(row.updated_at ?? new Date().toISOString()),
    }
  }
}
