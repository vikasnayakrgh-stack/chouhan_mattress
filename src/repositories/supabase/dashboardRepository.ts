import type { IDashboardRepository } from '@/repositories/types'
import type { DashboardStats, DashboardKPIs, SalesPoint, TopProduct, LowStockAlert, OrderStatusSlice } from '@/features/admin/types'
import { supabaseMappers } from './mappers'

export class SupabaseDashboardRepository implements IDashboardRepository {
  async getStats(): Promise<DashboardStats> {
    const sb = supabaseMappers.getClient()

    const [orders, products, customers, lowStock] = await Promise.all([
      sb.from('orders').select('total, status, created_at'),
      sb.from('products').select('id, name'),
      sb.from('customers').select('id', { count: 'exact' }),
      sb.from('inventory').select('sku, product:products(name), variant_label, stock, low_stock_threshold').lte('stock', 10),
    ])

    const orderData = orders.data ?? []
    const totalSales = orderData.reduce((s: number, o: Record<string, unknown>) => s + Number(o.total ?? 0), 0)
    const totalOrders = orderData.length
    const pendingOrders = orderData.filter((o: Record<string, unknown>) => o.status === 'new' || o.status === 'confirmed').length
    const lowStockAlerts: LowStockAlert[] = (lowStock.data ?? []).map((r: Record<string, unknown>) => {
      const product = r.product as Record<string, unknown> | null
      return {
        sku: String(r.sku ?? ''),
        productName: String(product?.name ?? ''),
        variantLabel: String(r.variant_label ?? ''),
        stock: Number(r.stock ?? 0),
        threshold: Number(r.low_stock_threshold ?? 5),
      }
    })

    // Order status distribution
    const statusMap = new Map<string, number>()
    for (const o of orderData) {
      const st = String((o as Record<string, unknown>).status ?? 'new')
      statusMap.set(st, (statusMap.get(st) ?? 0) + 1)
    }
    const orderStatusDistribution: OrderStatusSlice[] = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }))

    // Sales over time (last 14 days)
    const salesOverTime: SalesPoint[] = []
    for (let i = 13; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().slice(0, 10)
      const dayOrders = orderData.filter((o: Record<string, unknown>) =>
        String(o.created_at ?? '').slice(0, 10) === dateStr,
      )
      salesOverTime.push({
        date: dateStr,
        sales: dayOrders.reduce((s: number, o: Record<string, unknown>) => s + Number(o.total ?? 0), 0),
        orders: dayOrders.length,
      })
    }

    const kpis: DashboardKPIs = {
      totalSales,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0,
      totalCustomers: customers.count ?? 0,
      pendingOrders,
      lowStockCount: lowStockAlerts.filter((a) => a.stock > 0).length,
      outOfStockCount: lowStockAlerts.filter((a) => a.stock === 0).length,
      returnsCount: 0,
      salesTrend: 0,
      ordersTrend: 0,
      aovTrend: 0,
      customersTrend: 0,
    }

    return {
      kpis,
      salesOverTime,
      topProducts: [],
      lowStockAlerts,
      orderStatusDistribution,
    }
  }
}
