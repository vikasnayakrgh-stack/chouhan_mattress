import type {
  HeroContent,
  BannerContent,
  FAQContent,
  ContentSection,
  SEOContent,
  PageSEO,
} from '@/features/cms/types'
import { mockHero, mockBanners, mockFAQs, mockSections, mockSEO } from '@/data/admin/cms.mock'

let hero: HeroContent = { ...mockHero }
let banners: BannerContent[] = mockBanners.map((b) => ({ ...b }))
let faqs: FAQContent[] = mockFAQs.map((f) => ({ ...f }))
let sections: ContentSection[] = mockSections.map((s) => ({ ...s }))
let seo: SEOContent = { ...mockSEO, pages: mockSEO.pages.map((p) => ({ ...p })) }

export class MockCmsRepository {
  async getHero(): Promise<HeroContent> {
    return { ...hero }
  }

  async updateHero(updates: Partial<HeroContent>, actor: string): Promise<HeroContent> {
    hero = { ...hero, ...updates, updatedAt: new Date().toISOString(), updatedBy: actor }
    return { ...hero }
  }

  async getBanners(): Promise<BannerContent[]> {
    return banners.map((b) => ({ ...b }))
  }

  async getBannerById(id: string): Promise<BannerContent | null> {
    const b = banners.find((x) => x.id === id)
    return b ? { ...b } : null
  }

  async createBanner(banner: Omit<BannerContent, 'id' | 'updatedAt'>): Promise<BannerContent> {
    const created: BannerContent = { ...banner, id: `ban-${Date.now()}`, updatedAt: new Date().toISOString() }
    banners = [...banners, created]
    return { ...created }
  }

  async updateBanner(id: string, updates: Partial<BannerContent>, actor: string): Promise<BannerContent | null> {
    const idx = banners.findIndex((b) => b.id === id)
    if (idx === -1) return null
    banners[idx] = { ...banners[idx], ...updates, updatedAt: new Date().toISOString(), updatedBy: actor }
    return { ...banners[idx] }
  }

  async deleteBanner(id: string): Promise<boolean> {
    const before = banners.length
    banners = banners.filter((b) => b.id !== id)
    return banners.length < before
  }

  async getFAQs(): Promise<FAQContent[]> {
    return faqs.map((f) => ({ ...f })).sort((a, b) => a.order - b.order)
  }

  async createFAQ(faq: Omit<FAQContent, 'id' | 'updatedAt'>): Promise<FAQContent> {
    const created: FAQContent = { ...faq, id: `faq-${Date.now()}`, updatedAt: new Date().toISOString() }
    faqs = [...faqs, created]
    return { ...created }
  }

  async updateFAQ(id: string, updates: Partial<FAQContent>, actor: string): Promise<FAQContent | null> {
    const idx = faqs.findIndex((f) => f.id === id)
    if (idx === -1) return null
    faqs[idx] = { ...faqs[idx], ...updates, updatedAt: new Date().toISOString(), updatedBy: actor }
    return { ...faqs[idx] }
  }

  async deleteFAQ(id: string): Promise<boolean> {
    const before = faqs.length
    faqs = faqs.filter((f) => f.id !== id)
    return faqs.length < before
  }

  async reorderFAQs(orderedIds: string[]): Promise<FAQContent[]> {
    faqs = faqs.map((f) => {
      const order = orderedIds.indexOf(f.id)
      return order === -1 ? f : { ...f, order: order + 1 }
    })
    return this.getFAQs()
  }

  async getSections(): Promise<ContentSection[]> {
    return sections.map((s) => ({ ...s })).sort((a, b) => a.order - b.order)
  }

  async updateSection(id: string, updates: Partial<ContentSection>, actor: string): Promise<ContentSection | null> {
    const idx = sections.findIndex((s) => s.id === id)
    if (idx === -1) return null
    sections[idx] = { ...sections[idx], ...updates, updatedAt: new Date().toISOString(), updatedBy: actor }
    return { ...sections[idx] }
  }

  async getSEO(): Promise<SEOContent> {
    return { ...seo, pages: seo.pages.map((p) => ({ ...p })) }
  }

  async updateSEO(updates: Partial<Omit<SEOContent, 'pages'>>, actor: string): Promise<SEOContent> {
    seo = { ...seo, ...updates, updatedAt: new Date().toISOString(), updatedBy: actor }
    return this.getSEO()
  }

  async updatePageSEO(pageId: string, updates: Partial<PageSEO>): Promise<PageSEO | null> {
    const idx = seo.pages.findIndex((p) => p.id === pageId)
    if (idx === -1) return null
    seo.pages[idx] = { ...seo.pages[idx], ...updates, updatedAt: new Date().toISOString() }
    return { ...seo.pages[idx] }
  }
}

export const cmsRepository = new MockCmsRepository()
