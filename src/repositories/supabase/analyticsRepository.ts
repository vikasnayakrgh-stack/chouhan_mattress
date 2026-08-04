import type { IAnalyticsRepository } from '@/repositories/types'
import type {
  AnalyticsFilters,
  AnalyticsOverview,
  SalesReport,
  TrafficReport,
  ConversionReport,
  CustomerReport,
  ProductReport,
  SalesDataPoint,
  TrafficDataPoint,
  ConversionDataPoint,
  CustomerDataPoint,
  ProductPerformance,
} from '@/features/analytics/types'
import { supabaseMappers } from './mappers'

function presetDays(preset: string): number {
  switch (preset) {
    case 'last_7_days': return 7
    case 'last_30_days': return 30
    case 'last_90_days': return 90
    case 'this_year': return 365
    default: return 30
  }
}

function growth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

export class SupabaseAnalyticsRepository implements IAnalyticsRepository {
  async getOverview(filters: AnalyticsFilters): Promise<AnalyticsOverview> {
    const days = presetDays(filters.preset)
    const sales = await this.getSalesSeries(days * 2)
    const cur = sales.slice(-days)
    const prev = sales.slice(-(days * 2), -days)
    const revenue = cur.reduce((s, p) => s + p.revenue, 0)
    const prevRevenue = prev.reduce((s, p) => s + p.revenue, 0)
    const orders = cur.reduce((s, p) => s + p.orders, 0)
    const prevOrders = prev.reduce((s, p) => s + p.orders, 0)
    return {
      revenue,
      revenueGrowth: growth(revenue, prevRevenue),
      orders,
      ordersGrowth: growth(orders, prevOrders),
      sessions: 0,
      sessionsGrowth: 0,
      conversionRate: 0,
      conversionGrowth: 0,
    }
  }

  async getSalesReport(filters: AnalyticsFilters): Promise<SalesReport> {
    const days = presetDays(filters.preset)
    const sales = await this.getSalesSeries(days * 2)
    const cur = sales.slice(-days)
    const prev = sales.slice(-(days * 2), -days)
    const totalRevenue = cur.reduce((s, p) => s + p.revenue, 0)
    const prevRevenue = prev.reduce((s, p) => s + p.revenue, 0)
    const totalOrders = cur.reduce((s, p) => s + p.orders, 0)
    const prevOrders = prev.reduce((s, p) => s + p.orders, 0)
    const aov = totalOrders ? Math.round(totalRevenue / totalOrders) : 0
    const prevAov = prevOrders ? Math.round(prevRevenue / prevOrders) : 0
    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: aov,
      revenueGrowth: growth(totalRevenue, prevRevenue),
      ordersGrowth: growth(totalOrders, prevOrders),
      aovGrowth: growth(aov, prevAov),
      series: cur,
      byCategory: [],
      byPaymentMethod: [],
    }
  }

  async getTrafficReport(_filters: AnalyticsFilters): Promise<TrafficReport> {
    return {
      totalSessions: 0,
      totalUsers: 0,
      totalPageViews: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      sessionsGrowth: 0,
      series: [],
      bySource: [],
      byDevice: [],
    }
  }

  async getConversionReport(_filters: AnalyticsFilters): Promise<ConversionReport> {
    return {
      conversionRate: 0,
      conversionGrowth: 0,
      cartAbandonmentRate: 0,
      checkoutCompletionRate: 0,
      series: [],
      funnel: [],
    }
  }

  async getCustomerReport(_filters: AnalyticsFilters): Promise<CustomerReport> {
    const sb = supabaseMappers.getClient()
    const { count } = await sb.from('customers').select('id', { count: 'exact' })
    return {
      totalCustomers: count ?? 0,
      newCustomers: 0,
      returningRate: 0,
      customerGrowth: 0,
      ltv: 0,
      series: [],
      byCity: [],
      acquisitionChannels: [],
    }
  }

  async getProductReport(): Promise<ProductReport> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb
      .from('order_items')
      .select('product_id, product:products(name), quantity, total')
    if (error || !data) return { topProducts: [], totalUnitsSold: 0, unitsGrowth: 0, bestCategory: '' }

    const map = new Map<string, ProductPerformance>()
    for (const row of data as Record<string, unknown>[]) {
      const pid = String(row.product_id)
      const product = row.product as Record<string, unknown> | null
      const qty = Number(row.quantity ?? 0)
      const total = Number(row.total ?? 0)
      const existing = map.get(pid)
      if (existing) {
        existing.unitsSold += qty
        existing.revenue += total
      } else {
        map.set(pid, {
          productId: pid,
          productName: String(product?.name ?? ''),
          unitsSold: qty,
          revenue: total,
          views: 0,
          conversionRate: 0,
          returnRate: 0,
        })
      }
    }
    const topProducts = Array.from(map.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10)
    return {
      topProducts,
      totalUnitsSold: topProducts.reduce((s, p) => s + p.unitsSold, 0),
      unitsGrowth: 0,
      bestCategory: '',
    }
  }

  private async getSalesSeries(days: number): Promise<SalesDataPoint[]> {
    const sb = supabaseMappers.getClient()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const { data, error } = await sb
      .from('orders')
      .select('total, created_at')
      .gte('created_at', startDate.toISOString())
    if (error || !data) return []

    const dayMap = new Map<string, { revenue: number; orders: number }>()
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dayMap.set(d.toISOString().slice(0, 10), { revenue: 0, orders: 0 })
    }
    for (const row of data as Record<string, unknown>[]) {
      const date = String(row.created_at ?? '').slice(0, 10)
      if (dayMap.has(date)) {
        const entry = dayMap.get(date)!
        entry.revenue += Number(row.total ?? 0)
        entry.orders += 1
      }
    }
    return Array.from(dayMap.entries()).map(([date, v]) => ({
      date,
      revenue: v.revenue,
      orders: v.orders,
      aov: v.orders > 0 ? Math.round(v.revenue / v.orders) : 0,
    }))
  }
}
