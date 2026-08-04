export type ComparisonPeriod = 'previous_period' | 'wow' | 'yoy'
export type DateRangePreset = 'last_7_days' | 'last_30_days' | 'last_90_days' | 'this_year'

export interface AnalyticsFilters {
  preset: DateRangePreset
  comparison: ComparisonPeriod
}

export interface TimeSeriesPoint {
  date: string
  value: number
}

export interface SalesDataPoint {
  date: string
  revenue: number
  orders: number
  aov: number
}

export interface SalesReport {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  revenueGrowth: number
  ordersGrowth: number
  aovGrowth: number
  series: SalesDataPoint[]
  byCategory: { category: string; revenue: number }[]
  byPaymentMethod: { method: string; revenue: number; orders: number }[]
}

export interface TrafficDataPoint {
  date: string
  sessions: number
  users: number
  pageViews: number
}

export interface TrafficReport {
  totalSessions: number
  totalUsers: number
  totalPageViews: number
  bounceRate: number
  avgSessionDuration: number
  sessionsGrowth: number
  series: TrafficDataPoint[]
  bySource: { source: string; sessions: number; percentage: number }[]
  byDevice: { device: string; sessions: number; percentage: number }[]
}

export interface ConversionDataPoint {
  date: string
  conversionRate: number
  cartAbandonment: number
}

export interface ConversionReport {
  conversionRate: number
  conversionGrowth: number
  cartAbandonmentRate: number
  checkoutCompletionRate: number
  series: ConversionDataPoint[]
  funnel: { stage: string; count: number; rate: number }[]
}

export interface CustomerDataPoint {
  date: string
  newCustomers: number
  returningCustomers: number
}

export interface CustomerReport {
  totalCustomers: number
  newCustomers: number
  returningRate: number
  customerGrowth: number
  ltv: number
  series: CustomerDataPoint[]
  byCity: { city: string; customers: number }[]
  acquisitionChannels: { channel: string; customers: number; cac: number }[]
}

export interface ProductPerformance {
  productId: string
  productName: string
  unitsSold: number
  revenue: number
  views: number
  conversionRate: number
  returnRate: number
}

export interface ProductReport {
  topProducts: ProductPerformance[]
  totalUnitsSold: number
  unitsGrowth: number
  bestCategory: string
}

export interface AnalyticsOverview {
  revenue: number
  revenueGrowth: number
  orders: number
  ordersGrowth: number
  sessions: number
  sessionsGrowth: number
  conversionRate: number
  conversionGrowth: number
}
