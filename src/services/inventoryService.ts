import { getRepositories } from '@/repositories'
import type { InventoryItem, InventoryStatus, StockAdjustment } from '@/features/inventory/types'

export interface InventoryFilters {
  search?: string
  status?: InventoryStatus | 'all'
}

export const inventoryService = {
  async getAll(): Promise<InventoryItem[]> {
    return getRepositories().inventory.getAll()
  },

  async search(filters: InventoryFilters): Promise<InventoryItem[]> {
    let items = await getRepositories().inventory.getAll()
    if (filters.search) {
      const q = filters.search.toLowerCase()
      items = items.filter(
        (i) => i.sku.toLowerCase().includes(q) || i.productName.toLowerCase().includes(q)
      )
    }
    if (filters.status && filters.status !== 'all') {
      items = items.filter((i) => i.status === filters.status)
    }
    return items
  },

  async adjustStock(adjustment: Omit<StockAdjustment, 'id' | 'createdAt'>): Promise<InventoryItem | null> {
    return getRepositories().inventory.adjustStock(adjustment)
  },
}
