export type ContentStatus = 'draft' | 'published' | 'scheduled' | 'archived'

export interface ContentBlock {
  id: string
  type: 'text' | 'image' | 'video' | 'cta'
  content: string
  order: number
}

export interface ContentSection {
  id: string
  key: string
  title: string
  subtitle?: string
  type: 'product_grid' | 'category_grid' | 'banner_strip' | 'testimonials' | 'usp_strip' | 'custom'
  enabled: boolean
  order: number
  status: ContentStatus
  itemCount?: number
  updatedAt: string
  updatedBy: string
}

export interface HeroCTA {
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

export interface HeroContent {
  id: string
  headline: string
  subheadline: string
  description: string
  ctas: HeroCTA[]
  backgroundImage: string
  mobileBackgroundImage?: string
  badges: string[]
  countdownEnabled: boolean
  countdownEndsAt?: string
  countdownLabel?: string
  status: ContentStatus
  updatedAt: string
  updatedBy: string
}

export type BannerPosition = 'homepage_top' | 'homepage_middle' | 'category_page' | 'cart_page' | 'announcement_bar'

export interface BannerContent {
  id: string
  title: string
  subtitle?: string
  image: string
  ctaLabel: string
  ctaHref: string
  position: BannerPosition
  startDate?: string
  endDate?: string
  status: ContentStatus
  order: number
  updatedAt: string
  updatedBy: string
}

export type FAQCategory = 'orders' | 'delivery' | 'returns' | 'warranty' | 'products' | 'payments' | 'trial'

export interface FAQContent {
  id: string
  question: string
  answer: string
  category: FAQCategory
  order: number
  status: ContentStatus
  updatedAt: string
  updatedBy: string
}

export interface PageSEO {
  id: string
  path: string
  title: string
  description: string
  ogImage?: string
  noIndex: boolean
  updatedAt: string
}

export interface SEOContent {
  id: string
  titleTemplate: string
  defaultTitle: string
  metaDescription: string
  ogImage: string
  robotsIndex: boolean
  sitemapEnabled: boolean
  canonicalBase: string
  pages: PageSEO[]
  updatedAt: string
  updatedBy: string
}

export interface HomepageContent {
  hero: HeroContent
  banners: BannerContent[]
  faqs: FAQContent[]
  sections: ContentSection[]
  seo: SEOContent
}
