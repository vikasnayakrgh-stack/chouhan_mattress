export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export interface InventoryItem {
  id: string
  productId: string
  productName: string
  variantId: string
  sku: string
  variantLabel: string
  stock: number
  lowStockThreshold: number
  status: InventoryStatus
  reserved: number
  incoming: number
  updatedAt: string
}

export interface StockAdjustment {
  id: string
  inventoryItemId: string
  sku: string
  delta: number
  reason: string
  note?: string
  adjustedBy: string
  createdAt: string
}

export function getInventoryStatus(stock: number, threshold: number): InventoryStatus {
  if (stock === 0) return 'out_of_stock'
  if (stock <= threshold) return 'low_stock'
  return 'in_stock'
}
