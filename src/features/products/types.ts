export type ProductStatus = 'active' | 'draft' | 'archived'

export interface ProductImage {
  id: string
  url: string
  alt: string
  position: number
  isThumbnail: boolean
}

export interface ProductSEO {
  title: string
  metaDescription: string
  urlSlug: string
  ogImage?: string
}

export interface ProductOption {
  id: string
  name: string // e.g. "Size", "Thickness", "Firmness"
  values: string[]
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  optionValues: Record<string, string> // { Size: "Queen", Thickness: "6 inch" }
  dimensions?: string // e.g. "72x36"
  mrp: number
  sellingPrice: number
  discountPercent: number
  stock: number
  lowStockThreshold: number
  status: 'active' | 'inactive'
}

export interface MattressAttributes {
  type: string // Memory Foam, Coir, Spring, etc.
  material: string
  firmness: 'Soft' | 'Medium' | 'Medium-Firm' | 'Firm'
  thicknessOptions: string[]
  warrantyYears: number
  trialDays: number
  reversible: boolean
  sleepingPosition: string[]
  constructionLayers: string[]
}

export interface Product {
  id: string
  name: string
  slug: string
  productCode: string // used in SKU generation e.g. "ORTHO"
  shortDescription: string
  description: string
  brand: string
  categoryId: string
  categoryName: string
  collectionIds: string[]
  tags: string[]
  status: ProductStatus
  images: ProductImage[]
  options: ProductOption[]
  mattressAttributes?: MattressAttributes
  seo: ProductSEO
  createdAt: string
  updatedAt: string
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[]
}
