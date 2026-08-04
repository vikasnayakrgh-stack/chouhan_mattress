import { z } from 'zod';

export const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url('Image URL must be a valid URL'),
  alt: z.string().min(1, 'Alt text is required'),
  position: z.number().int().nonnegative('Position must be a non-negative integer'),
  isThumbnail: z.boolean().optional(),
});

export const productOptionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Option name is required'),
  values: z.array(z.string().min(1, 'Option value is required')).min(1, 'At least one option value is required'),
});

export const productVariantSchema = z.object({
  id: z.string().optional(),
  productId: z.string().optional(), // will be set by server
  sku: z.string().min(1, 'SKU is required'),
  optionValues: z.record(z.string(), z.string().min(1, 'Option value is required')),
  dimensions: z.string().optional(),
  mrp: z.number().positive('MRP must be positive'),
  sellingPrice: z.number().positive('Selling price must be positive'),
  discountPercent: z.number().min(0).max(100, 'Discount percent must be between 0 and 100'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
  lowStockThreshold: z.number().int().nonnegative('Low stock threshold must be non-negative'),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const mattressAttributesSchema = z.object({
  type: z.string().min(1, 'Mattress type is required'),
  material: z.string().min(1, 'Material is required'),
  firmness: z.enum(['Soft', 'Medium', 'Medium-Firm', 'Firm']),
  thicknessOptions: z.array(z.string().min(1, 'Thickness option is required')).min(1, 'At least one thickness option is required'),
  warrantyYears: z.number().int().nonnegative('Warranty years must be non-negative'),
  trialDays: z.number().int().nonnegative('Trial days must be non-negative'),
  reversible: z.boolean(),
  sleepingPosition: z.array(z.string().min(1, 'Sleeping position is required')).min(1, 'At least one sleeping position is required'),
  constructionLayers: z.array(z.string().min(1, 'Construction layer is required')).min(1, 'At least one construction layer is required'),
});

export const productSeoSchema = z.object({
  title: z.string().min(1, 'SEO title is required').max(60),
  metaDescription: z.string().min(1, 'Meta description is required').max(160),
  urlSlug: z.string().min(1, 'URL slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'URL slug must be lowercase with hyphens'),
  ogImage: z.string().url('OG image must be a valid URL').optional(),
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Product name is required').max(200),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  productCode: z.string().min(1, 'Product code is required'),
  shortDescription: z.string().max(500),
  description: z.string(),
  brand: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category ID is required'),
  categoryName: z.string().min(1, 'Category name is required'),
  collectionIds: z.array(z.string().min(1, 'Collection ID is required')).optional(),
  tags: z.array(z.string().min(1, 'Tag is required')).optional(),
  status: z.enum(['active', 'draft', 'archived']).default('draft'),
  images: z.array(productImageSchema).min(1, 'At least one product image is required'),
  options: z.array(productOptionSchema).min(1, 'At least one product option is required'),
  mattressAttributes: mattressAttributesSchema.optional(),
  seo: productSeoSchema,
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const productCreateSchema = productSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const productUpdateSchema = productSchema.partial();

export type ProductInput = z.infer<typeof productSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;