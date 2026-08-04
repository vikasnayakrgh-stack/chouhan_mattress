import type { IDiscountRepository } from '@/repositories/types'
import type { Discount } from '@/features/discounts/types'
import { mockDiscounts } from '@/data/admin/discounts.mock'

let discounts: Discount[] = mockDiscounts.map((d) => ({ ...d }))

export class MockDiscountRepository implements IDiscountRepository {
  async getAll(): Promise<Discount[]> {
    return [...discounts]
  }

  async getById(id: string): Promise<Discount | null> {
    return discounts.find((d) => d.id === id) ?? null
  }

  async getByCode(code: string): Promise<Discount | null> {
    const q = code.trim().toUpperCase()
    return discounts.find((d) => d.code.toUpperCase() === q) ?? null
  }

  async create(discount: Discount): Promise<Discount> {
    discounts = [discount, ...discounts]
    return discount
  }

  async update(id: string, updates: Partial<Discount>): Promise<Discount | null> {
    const idx = discounts.findIndex((d) => d.id === id)
    if (idx === -1) return null
    discounts[idx] = { ...discounts[idx], ...updates, updatedAt: new Date().toISOString() }
    return discounts[idx]
  }

  async remove(id: string): Promise<boolean> {
    const before = discounts.length
    discounts = discounts.filter((d) => d.id !== id)
    return discounts.length < before
  }
}
