import type { ICMSRepository } from '@/repositories/types'
import type {
  HeroContent,
  BannerContent,
  FAQContent,
  ContentSection,
  SEOContent,
  PageSEO,
} from '@/features/cms/types'
import { supabaseMappers } from './mappers'

const DEFAULT_HERO: HeroContent = {
  id: 'default',
  headline: 'Sleep Better, Live Better',
  subheadline: 'Premium mattresses by Chouhan Mattress',
  description: '',
  ctas: [{ label: 'Shop Now', href: '/products', variant: 'primary' }],
  backgroundImage: '',
  badges: [],
  countdownEnabled: false,
  status: 'published',
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
}

const DEFAULT_SEO: SEOContent = {
  id: 'default',
  titleTemplate: '%s | Chouhan Mattress',
  defaultTitle: 'Chouhan Mattress — Premium Sleep Solutions',
  metaDescription: 'Premium quality mattresses with 100-night trial and 7-year warranty.',
  ogImage: '',
  robotsIndex: true,
  sitemapEnabled: true,
  canonicalBase: 'https://chouhanmattress.com',
  pages: [],
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
}

export class SupabaseCMSRepository implements ICMSRepository {
  async getHero(): Promise<HeroContent> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('cms_content').select('*').eq('type', 'hero').eq('status', 'active').maybeSingle()
    if (error || !data) return DEFAULT_HERO
    const content = (data as Record<string, unknown>).content as Record<string, unknown> | undefined
    return {
      ...DEFAULT_HERO,
      id: String((data as Record<string, unknown>).id),
      headline: String(content?.headline ?? DEFAULT_HERO.headline),
      subheadline: String(content?.subheadline ?? DEFAULT_HERO.subheadline),
      description: String(content?.description ?? ''),
      ctas: (content?.ctas as HeroContent['ctas']) ?? DEFAULT_HERO.ctas,
      backgroundImage: String(content?.backgroundImage ?? ''),
      mobileBackgroundImage: content?.mobileBackgroundImage ? String(content.mobileBackgroundImage) : undefined,
      badges: (content?.badges as string[]) ?? [],
      countdownEnabled: Boolean(content?.countdownEnabled ?? false),
      countdownEndsAt: content?.countdownEndsAt ? String(content.countdownEndsAt) : undefined,
      countdownLabel: content?.countdownLabel ? String(content.countdownLabel) : undefined,
      status: String((data as Record<string, unknown>).status ?? 'published') as HeroContent['status'],
      updatedAt: String((data as Record<string, unknown>).updated_at ?? new Date().toISOString()),
      updatedBy: String(content?.updatedBy ?? 'system'),
    }
  }

  async updateHero(updates: Partial<HeroContent>, actor: string): Promise<HeroContent> {
    const sb = supabaseMappers.getClient()
    const current = await this.getHero()
    const merged = { ...current, ...updates, updatedAt: new Date().toISOString(), updatedBy: actor }
    const { data, error } = await sb
      .from('cms_content')
      .upsert({
        type: 'hero',
        key: 'home_hero',
        title: merged.headline,
        content: {
          headline: merged.headline,
          subheadline: merged.subheadline,
          description: merged.description,
          ctas: merged.ctas,
          backgroundImage: merged.backgroundImage,
          mobileBackgroundImage: merged.mobileBackgroundImage,
          badges: merged.badges,
          countdownEnabled: merged.countdownEnabled,
          countdownEndsAt: merged.countdownEndsAt,
          countdownLabel: merged.countdownLabel,
          updatedBy: actor,
        },
        status: merged.status,
      }, { onConflict: 'key' })
      .select()
      .single()
    if (error) throw error
    return merged
  }

  async getBanners(): Promise<BannerContent[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('cms_content').select('*').eq('type', 'banner').order('order', { ascending: true })
    if (error || !data) return []
    return (data as Record<string, unknown>[]).map((r) => supabaseMappers.rowToBanner(r))
  }

  async createBanner(banner: Omit<BannerContent, 'id' | 'updatedAt'>): Promise<BannerContent> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
      .from('cms_content')
      .insert({
        type: 'banner',
        key: `banner_${Date.now()}`,
        title: banner.title,
        content: {
          title: banner.title,
          subtitle: banner.subtitle,
          image: banner.image,
          ctaLabel: banner.ctaLabel,
          ctaHref: banner.ctaHref,
          position: banner.position,
          startDate: banner.startDate,
          endDate: banner.endDate,
        },
        status: banner.status,
      })
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToBanner(data as Record<string, unknown>)
  }

  async updateBanner(id: string, updates: Partial<BannerContent>, actor: string): Promise<BannerContent | null> {
    const sb = supabaseMappers.getClient()
    const { data: existing } = await sb.from('cms_content').select('content').eq('id', id).maybeSingle()
    const existingContent = ((existing as Record<string, unknown>)?.content ?? {}) as Record<string, unknown>
    const merged = { ...existingContent, ...updates }
    const { data, error } = await sb
      .from('cms_content')
      .update({ content: merged, status: updates.status ?? merged.status, title: updates.title ?? merged.title })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToBanner(data as Record<string, unknown>)
  }

  async deleteBanner(id: string): Promise<boolean> {
    const sb = supabaseMappers.getClient()
    const { error } = await sb.from('cms_content').delete().eq('id', id)
    if (error) throw error
    return true
  }

  async getFAQs(): Promise<FAQContent[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('cms_content').select('*').eq('type', 'faq').order('order', { ascending: true })
    if (error || !data) return []
    return (data as Record<string, unknown>[]).map((r) => supabaseMappers.rowToFAQ(r))
  }

  async createFAQ(faq: Omit<FAQContent, 'id' | 'updatedAt'>): Promise<FAQContent> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
      .from('cms_content')
      .insert({
        type: 'faq',
        key: `faq_${Date.now()}`,
        title: faq.question,
        content: { question: faq.question, answer: faq.answer, category: faq.category },
        status: faq.status,
      })
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToFAQ(data as Record<string, unknown>)
  }

  async updateFAQ(id: string, updates: Partial<FAQContent>, actor: string): Promise<FAQContent | null> {
    const sb = supabaseMappers.getClient()
    const { data: existing } = await sb.from('cms_content').select('content').eq('id', id).maybeSingle()
    const existingContent = ((existing as Record<string, unknown>)?.content ?? {}) as Record<string, unknown>
    const merged = { ...existingContent, ...updates }
    const { data, error } = await sb
      .from('cms_content')
      .update({ content: merged, status: updates.status ?? merged.status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToFAQ(data as Record<string, unknown>)
  }

  async deleteFAQ(id: string): Promise<boolean> {
    const sb = supabaseMappers.getClient()
    const { error } = await sb.from('cms_content').delete().eq('id', id)
    if (error) throw error
    return true
  }

  async reorderFAQs(orderedIds: string[]): Promise<FAQContent[]> {
    const sb = supabaseMappers.getClient()
    for (let i = 0; i < orderedIds.length; i++) {
      await sb.from('cms_content').update({ order: i }).eq('id', orderedIds[i])
    }
    return this.getFAQs()
  }

  async getSections(): Promise<ContentSection[]> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('cms_content').select('*').eq('type', 'section').order('order', { ascending: true })
    if (error || !data) return []
    return (data as Record<string, unknown>[]).map((r) => supabaseMappers.rowToSection(r))
  }

  async updateSection(id: string, updates: Partial<ContentSection>, actor: string): Promise<ContentSection | null> {
    const sb = supabaseMappers.getClient()
    const { data: existing } = await sb.from('cms_content').select('content').eq('id', id).maybeSingle()
    const existingContent = ((existing as Record<string, unknown>)?.content ?? {}) as Record<string, unknown>
    const merged = { ...existingContent, ...updates }
    const { data, error } = await sb
      .from('cms_content')
      .update({ content: merged, status: updates.status ?? merged.status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return supabaseMappers.rowToSection(data as Record<string, unknown>)
  }

  async getSEO(): Promise<SEOContent> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('cms_content').select('*').eq('type', 'page').eq('key', 'seo_settings').maybeSingle()
    if (error || !data) return DEFAULT_SEO
    const content = (data as Record<string, unknown>).content as Record<string, unknown> | undefined
    return { ...DEFAULT_SEO, ...content, id: String((data as Record<string, unknown>).id) }
  }

  async updateSEO(updates: Partial<Omit<SEOContent, 'pages'>>, actor: string): Promise<SEOContent> {
    const sb = supabaseMappers.getClient()
    const current = await this.getSEO()
    const merged = { ...current, ...updates, updatedAt: new Date().toISOString(), updatedBy: actor }
    await sb.from('cms_content').upsert({
      type: 'page',
      key: 'seo_settings',
      title: 'SEO Settings',
      content: merged,
      status: 'active',
    }, { onConflict: 'key' })
    return merged
  }

  async updatePageSEO(pageId: string, updates: Partial<PageSEO>): Promise<PageSEO | null> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('seo_pages').update({
      title: updates.title,
      description: updates.description,
      og_image: updates.ogImage,
      no_index: updates.noIndex,
    }).eq('id', pageId).select().single()
    if (error) throw error
    return {
      id: String(data.id),
      path: String(data.path),
      title: String(data.title ?? ''),
      description: String(data.description ?? ''),
      ogImage: data.og_image ? String(data.og_image) : undefined,
      noIndex: Boolean(data.no_index),
      updatedAt: String(data.updated_at),
    }
  }
}
