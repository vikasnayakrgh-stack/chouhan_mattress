import { getRepositories } from '@/repositories'
import type {
  AnalyticsFilters,
  AnalyticsOverview,
  SalesReport,
  TrafficReport,
  ConversionReport,
  CustomerReport,
  ProductReport,
} from '@/features/analytics/types'

export const analyticsService = {
  async getOverview(filters: AnalyticsFilters): Promise<AnalyticsOverview> {
    return getRepositories().analytics.getOverview(filters)
  },

  async getSalesReport(filters: AnalyticsFilters): Promise<SalesReport> {
    return getRepositories().analytics.getSalesReport(filters)
  },

  async getTrafficReport(filters: AnalyticsFilters): Promise<TrafficReport> {
    return getRepositories().analytics.getTrafficReport(filters)
  },

  async getConversionReport(filters: AnalyticsFilters): Promise<ConversionReport> {
    return getRepositories().analytics.getConversionReport(filters)
  },

  async getCustomerReport(filters: AnalyticsFilters): Promise<CustomerReport> {
    return getRepositories().analytics.getCustomerReport(filters)
  },

  async getProductReport(): Promise<ProductReport> {
    return getRepositories().analytics.getProductReport()
  },
}
