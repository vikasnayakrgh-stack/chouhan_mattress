import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  productCount: z.number().int().nonnegative().default(0),
  position: z.number().int().nonnegative().default(0),
  createdAt: z.string().datetime().optional(),
});

export const categoryCreateSchema = categorySchema.omit({ id: true, createdAt: true, productCount: true });
export const categoryUpdateSchema = categorySchema.partial();

export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;