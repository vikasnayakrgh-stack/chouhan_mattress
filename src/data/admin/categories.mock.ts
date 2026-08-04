import type { Category } from '@/features/catalog/types'

export const mockCategories: Category[] = [
  { id: 'cat-mattresses', name: 'Mattresses', slug: 'mattresses', description: 'All mattress types — memory foam, coir, spring and more.', parentId: null, status: 'active', productCount: 5, position: 0, createdAt: '2025-06-01' },
  { id: 'cat-pillows', name: 'Pillows', slug: 'pillows', description: 'Memory foam, cervical and fiber pillows.', parentId: null, status: 'active', productCount: 2, position: 1, createdAt: '2025-06-01' },
  { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', description: 'Bed bases, toppers and sleep accessories.', parentId: null, status: 'active', productCount: 1, position: 2, createdAt: '2025-06-01' },
  { id: 'cat-protectors', name: 'Protectors', slug: 'protectors', description: 'Waterproof and cooling mattress protectors.', parentId: null, status: 'active', productCount: 2, position: 3, createdAt: '2025-06-01' },
]
