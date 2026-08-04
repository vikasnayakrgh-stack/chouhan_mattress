import type {
  AnalyticsOverview,
  SalesReport,
  TrafficReport,
  ConversionReport,
  CustomerReport,
  ProductReport,
  AnalyticsFilters,
  SalesDataPoint,
  TrafficDataPoint,
  ConversionDataPoint,
  CustomerDataPoint,
  ProductPerformance,
} from '@/features/analytics/types'
import {
  mockSalesSeries,
  mockTrafficSeries,
  mockConversionSeries,
  mockCustomerSeries,
  mockSalesByCategory,
  mockSalesByPayment,
  mockTrafficBySource,
  mockTrafficByDevice,
  mockFunnel,
  mockCustomersByCity,
  mockAcquisitionChannels,
  mockProductPerformance,
} from '@/data/admin/analytics.mock'

function sliceByPreset<T extends { date: string }>(data: T[], preset: AnalyticsFilters['preset']): T[] {
  const days = preset === 'last_7_days' ? 7 : preset === 'last_30_days' ? 30 : preset === 'last_90_days' ? 90 : 365
  return data.slice(-days)
}

export class MockAnalyticsRepository {
  async getOverview(filters: AnalyticsFilters): Promise<AnalyticsOverview> {
    const sales = sliceByPreset(mockSalesSeries, filters.preset)
    const traffic = sliceByPreset(mockTrafficSeries, filters.preset)
    const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0)
    const totalOrders = sales.reduce((sum, s) => sum + s.orders, 0)
    const totalSessions = traffic.reduce((sum, s) => sum + s.sessions, 0)
    return {
      revenue: totalRevenue,
      revenueGrowth: 12.5,
      orders: totalOrders,
      ordersGrowth: 8.3,
      sessions: totalSessions,
      sessionsGrowth: 5.2,
      conversionRate: totalOrders / totalSessions,
      conversionGrowth: 2.1,
    }
  }

  async getSalesReport(filters: AnalyticsFilters): Promise<SalesReport> {
    const series = sliceByPreset(mockSalesSeries, filters.preset)
    const totalRevenue = series.reduce((sum, s) => sum + s.revenue, 0)
    const totalOrders = series.reduce((sum, s) => sum + s.orders, 0)
    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      revenueGrowth: 12.5,
      ordersGrowth: 8.3,
      aovGrowth: 3.8,
      series,
      byCategory: [...mockSalesByCategory],
      byPaymentMethod: [...mockSalesByPayment],
    }
  }

  async getTrafficReport(filters: AnalyticsFilters): Promise<TrafficReport> {
    const series = sliceByPreset(mockTrafficSeries, filters.preset)
    const totalSessions = series.reduce((sum, s) => sum + s.sessions, 0)
    const totalUsers = series.reduce((sum, s) => sum + s.users, 0)
    const totalPageViews = series.reduce((sum, s) => sum + s.pageViews, 0)
    return {
      totalSessions,
      totalUsers,
      totalPageViews,
      bounceRate: 0.42,
      avgSessionDuration: 185,
      sessionsGrowth: 5.2,
      series,
      bySource: [...mockTrafficBySource],
      byDevice: [...mockTrafficByDevice],
    }
  }

  async getConversionReport(filters: AnalyticsFilters): Promise<ConversionReport> {
    const series = sliceByPreset(mockConversionSeries, filters.preset)
    const avgConversion = series.reduce((sum, s) => sum + s.conversionRate, 0) / (series.length || 1)
    return {
      conversionRate: avgConversion,
      conversionGrowth: 2.1,
      cartAbandonmentRate: 0.68,
      checkoutCompletionRate: 0.72,
      series,
      funnel: [...mockFunnel],
    }
  }

  async getCustomerReport(filters: AnalyticsFilters): Promise<CustomerReport> {
    const series = sliceByPreset(mockCustomerSeries, filters.preset)
    const totalNew = series.reduce((sum, s) => sum + s.newCustomers, 0)
    const totalReturning = series.reduce((sum, s) => sum + s.returningCustomers, 0)
    const total = totalNew + totalReturning
    return {
      totalCustomers: total,
      newCustomers: totalNew,
      returningRate: total > 0 ? totalReturning / total : 0,
      customerGrowth: 15.7,
      ltv: 24500,
      series,
      byCity: [...mockCustomersByCity],
      acquisitionChannels: [...mockAcquisitionChannels],
    }
  }

  async getProductReport(): Promise<ProductReport> {
    return {
      topProducts: mockProductPerformance.map((p) => ({ ...p })),
      totalUnitsSold: mockProductPerformance.reduce((sum, p) => sum + p.unitsSold, 0),
      unitsGrowth: 9.4,
      bestCategory: 'Mattresses',
    }
  }
}

export const analyticsRepository = new MockAnalyticsRepository()