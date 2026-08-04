import { getRepositories } from '@/repositories'
import type {
  HeroContent,
  BannerContent,
  FAQContent,
  ContentSection,
  SEOContent,
  PageSEO,
  HomepageContent,
  ContentStatus,
  FAQCategory,
} from '@/features/cms/types'

export const cmsService = {
  async getHomepageContent(): Promise<HomepageContent> {
    const [hero, banners, faqs, sections, seo] = await Promise.all([
      getRepositories().cms.getHero(),
      getRepositories().cms.getBanners(),
      getRepositories().cms.getFAQs(),
      getRepositories().cms.getSections(),
      getRepositories().cms.getSEO(),
    ])
    return { hero, banners, faqs, sections, seo }
  },

  async getHero(): Promise<HeroContent> {
    return getRepositories().cms.getHero()
  },

  async updateHero(updates: Partial<HeroContent>, actor = 'Admin'): Promise<HeroContent> {
    return getRepositories().cms.updateHero(updates, actor)
  },

  async getBanners(): Promise<BannerContent[]> {
    return getRepositories().cms.getBanners()
  },

  async createBanner(banner: Omit<BannerContent, 'id' | 'updatedAt'>): Promise<BannerContent> {
    return getRepositories().cms.createBanner(banner)
  },

  async updateBanner(id: string, updates: Partial<BannerContent>, actor = 'Admin'): Promise<BannerContent | null> {
    return getRepositories().cms.updateBanner(id, updates, actor)
  },

  async deleteBanner(id: string): Promise<boolean> {
    return getRepositories().cms.deleteBanner(id)
  },

  async publishBanner(id: string, actor = 'Admin'): Promise<BannerContent | null> {
    return getRepositories().cms.updateBanner(id, { status: 'published' }, actor)
  },

  async scheduleBanner(id: string, startDate: string, endDate: string, actor = 'Admin'): Promise<BannerContent | null> {
    return getRepositories().cms.updateBanner(id, { status: 'scheduled', startDate, endDate }, actor)
  },

  async getFAQs(category?: FAQCategory | 'all', search?: string): Promise<FAQContent[]> {
    let faqs = await getRepositories().cms.getFAQs()
    if (category && category !== 'all') faqs = faqs.filter((f) => f.category === category)
    if (search) {
      const q = search.toLowerCase()
      faqs = faqs.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
    }
    return faqs
  },

  async createFAQ(faq: Omit<FAQContent, 'id' | 'updatedAt'>): Promise<FAQContent> {
    return getRepositories().cms.createFAQ(faq)
  },

  async updateFAQ(id: string, updates: Partial<FAQContent>, actor = 'Admin'): Promise<FAQContent | null> {
    return getRepositories().cms.updateFAQ(id, updates, actor)
  },

  async deleteFAQ(id: string): Promise<boolean> {
    return getRepositories().cms.deleteFAQ(id)
  },

  async reorderFAQs(orderedIds: string[]): Promise<FAQContent[]> {
    return getRepositories().cms.reorderFAQs(orderedIds)
  },

  async getSections(): Promise<ContentSection[]> {
    return getRepositories().cms.getSections()
  },

  async toggleSection(id: string, enabled: boolean, actor = 'Admin'): Promise<ContentSection | null> {
    return getRepositories().cms.updateSection(id, { enabled, status: enabled ? 'published' : 'draft' }, actor)
  },

  async getSEO(): Promise<SEOContent> {
    return getRepositories().cms.getSEO()
  },

  async updateSEO(updates: Partial<Omit<SEOContent, 'pages'>>, actor = 'Admin'): Promise<SEOContent> {
    return getRepositories().cms.updateSEO(updates, actor)
  },

  async updatePageSEO(pageId: string, updates: Partial<PageSEO>): Promise<PageSEO | null> {
    return getRepositories().cms.updatePageSEO(pageId, updates)
  },

  statusLabel(status: ContentStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1)
  },
}
