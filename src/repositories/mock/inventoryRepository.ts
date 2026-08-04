import type { IInventoryRepository } from '@/repositories/types'
import type { InventoryItem, StockAdjustment } from '@/features/inventory/types'
import { getInventoryStatus } from '@/features/inventory/types'
import { mockProducts } from '@/data/admin/products.mock'

function buildInventory(): InventoryItem[] {
  return mockProducts.flatMap((p) =>
    p.variants.map((v) => ({
      id: `inv-${v.sku.toLowerCase()}`,
      productId: p.id,
      productName: p.name,
      variantId: v.id,
      sku: v.sku,
      variantLabel: Object.values(v.optionValues).join(' / '),
      stock: v.stock,
      lowStockThreshold: v.lowStockThreshold,
      status: getInventoryStatus(v.stock, v.lowStockThreshold),
      reserved: Math.min(v.stock, 2),
      incoming: v.stock === 0 ? 20 : 0,
      updatedAt: p.updatedAt,
    }))
  )
}

let inventory: InventoryItem[] = buildInventory()
const adjustments: StockAdjustment[] = []

export class MockInventoryRepository implements IInventoryRepository {
  async getAll(): Promise<InventoryItem[]> {
    return [...inventory]
  }

  async getBySku(sku: string): Promise<InventoryItem | null> {
    return inventory.find((i) => i.sku === sku) ?? null
  }

  async adjustStock(adjustment: Omit<StockAdjustment, 'id' | 'createdAt'>): Promise<InventoryItem | null> {
    const idx = inventory.findIndex((i) => i.id === adjustment.inventoryItemId)
    if (idx === -1) return null
    const newStock = Math.max(0, inventory[idx].stock + adjustment.delta)
    inventory[idx] = {
      ...inventory[idx],
      stock: newStock,
      status: getInventoryStatus(newStock, inventory[idx].lowStockThreshold),
      updatedAt: new Date().toISOString(),
    }
    adjustments.push({
      ...adjustment,
      id: `adj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    })
    return inventory[idx]
  }
}
