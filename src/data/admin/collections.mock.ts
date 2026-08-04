import type { Collection } from '@/features/catalog/types'

export const mockCollections: Collection[] = [
  { id: 'col-orthopedic', name: 'Orthopedic', slug: 'orthopedic', description: 'Doctor-recommended orthopedic sleep products.', status: 'active', productCount: 3, isAutomatic: false, createdAt: '2025-06-05' },
  { id: 'col-best-sellers', name: 'Best Sellers', slug: 'best-sellers', description: 'Our most loved products.', status: 'active', productCount: 5, isAutomatic: true, createdAt: '2025-06-05' },
  { id: 'col-new-arrivals', name: 'New Arrivals', slug: 'new-arrivals', description: 'Fresh additions to the catalog.', status: 'active', productCount: 3, isAutomatic: true, createdAt: '2025-06-05' },
  { id: 'col-offers', name: 'Offers', slug: 'offers', description: 'Products on limited-time offers.', status: 'active', productCount: 1, isAutomatic: false, createdAt: '2025-06-05' },
]
