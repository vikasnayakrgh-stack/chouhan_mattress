export type CategoryStatus = 'active' | 'inactive'
export type CollectionStatus = 'active' | 'inactive'

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  parentId: string | null
  status: CategoryStatus
  productCount: number
  position: number
  createdAt: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string
  status: CollectionStatus
  productCount: number
  isAutomatic: boolean
  createdAt: string
}
