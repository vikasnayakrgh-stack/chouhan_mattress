import type {
  SalesDataPoint,
  TrafficDataPoint,
  ConversionDataPoint,
  CustomerDataPoint,
  ProductPerformance,
} from '@/features/analytics/types'

/** Deterministic pseudo-random for stable mock data */
function seeded(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function dateStr(daysAgo: number): string {
  const d = new Date('2026-07-27T00:00:00+05:30')
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

const rand = seeded(42)

export const mockSalesSeries: SalesDataPoint[] = Array.from({ length: 90 }, (_, i) => {
  const daysAgo = 89 - i
  const weekend = new Date(dateStr(daysAgo)).getDay() % 6 === 0
  const base = 85000 + i * 600
  const revenue = Math.round(base + rand() * 45000 + (weekend ? 30000 : 0))
  const orders = Math.max(3, Math.round(revenue / (11000 + rand() * 4000)))
  return { date: dateStr(daysAgo), revenue, orders, aov: Math.round(revenue / orders) }
})

export const mockTrafficSeries: TrafficDataPoint[] = Array.from({ length: 90 }, (_, i) => {
  const daysAgo = 89 - i
  const sessions = Math.round(1200 + i * 8 + rand() * 600)
  return {
    date: dateStr(daysAgo),
    sessions,
    users: Math.round(sessions * (0.72 + rand() * 0.1)),
    pageViews: Math.round(sessions * (3.1 + rand() * 1.2)),
  }
})

export const mockConversionSeries: ConversionDataPoint[] = Array.from({ length: 90 }, (_, i) => {
  const daysAgo = 89 - i
  return {
    date: dateStr(daysAgo),
    conversionRate: Number((1.4 + rand() * 1.3).toFixed(2)),
    cartAbandonment: Number((58 + rand() * 14).toFixed(1)),
  }
})

export const mockCustomerSeries: CustomerDataPoint[] = Array.from({ length: 90 }, (_, i) => {
  const daysAgo = 89 - i
  return {
    date: dateStr(daysAgo),
    newCustomers: Math.round(6 + rand() * 14),
    returningCustomers: Math.round(2 + rand() * 6),
  }
})

export const mockSalesByCategory = [
  { category: 'Mattresses', revenue: 6845000 },
  { category: 'Pillows', revenue: 942000 },
  { category: 'Protectors', revenue: 318000 },
  { category: 'Bed Frames', revenue: 512000 },
  { category: 'Comforters', revenue: 226000 },
]

export const mockSalesByPayment = [
  { method: 'UPI (Razorpay)', revenue: 4120000, orders: 486 },
  { method: 'Cards (Razorpay)', revenue: 1980000, orders: 172 },
  { method: 'Net Banking', revenue: 645000, orders: 61 },
  { method: 'COD', revenue: 2098000, orders: 284 },
]

export const mockTrafficBySource = [
  { source: 'Organic Search', sessions: 48200, percentage: 38.4 },
  { source: 'Direct', sessions: 26400, percentage: 21.0 },
  { source: 'Google Ads', sessions: 21500, percentage: 17.1 },
  { source: 'Social (Meta)', sessions: 15800, percentage: 12.6 },
  { source: 'WhatsApp', sessions: 8300, percentage: 6.6 },
  { source: 'Referral', sessions: 5400, percentage: 4.3 },
]

export const mockTrafficByDevice = [
  { device: 'Mobile', sessions: 89200, percentage: 71.0 },
  { device: 'Desktop', sessions: 29800, percentage: 23.7 },
  { device: 'Tablet', sessions: 6600, percentage: 5.3 },
]

export const mockFunnel = [
  { stage: 'Sessions', count: 125600, rate: 100 },
  { stage: 'Product Views', count: 74200, rate: 59.1 },
  { stage: 'Add to Cart', count: 12480, rate: 9.9 },
  { stage: 'Checkout Started', count: 5230, rate: 4.2 },
  { stage: 'Orders Placed', count: 2412, rate: 1.9 },
]

export const mockCustomersByCity = [
  { city: 'Raipur', customers: 486 },
  { city: 'Bhilai', customers: 231 },
  { city: 'Durg', customers: 168 },
  { city: 'Bilaspur', customers: 142 },
  { city: 'Korba', customers: 87 },
  { city: 'Nagpur', customers: 64 },
  { city: 'Others', customers: 298 },
]

export const mockAcquisitionChannels = [
  { channel: 'Organic Search', customers: 512, cac: 0 },
  { channel: 'Google Ads', customers: 386, cac: 420 },
  { channel: 'Meta Ads', customers: 294, cac: 510 },
  { channel: 'WhatsApp Referral', customers: 168, cac: 95 },
  { channel: 'Offline / Showroom', customers: 116, cac: 260 },
]

export const mockProductPerformance: ProductPerformance[] = [
  { productId: 'prod-001', productName: 'OrthoSpine Pro Memory Foam Mattress', unitsSold: 342, revenue: 4275000, views: 28400, conversionRate: 1.2, returnRate: 2.1 },
  { productId: 'prod-002', productName: 'ComfortCloud Dual Comfort Mattress', unitsSold: 218, revenue: 2724000, views: 19200, conversionRate: 1.14, returnRate: 1.8 },
  { productId: 'prod-005', productName: 'PocketSpring Luxury Mattress', unitsSold: 96, revenue: 2112000, views: 11800, conversionRate: 0.81, returnRate: 1.0 },
  { productId: 'prod-003', productName: 'SpineGuard Coir Mattress', unitsSold: 154, revenue: 1078000, views: 12600, conversionRate: 1.22, returnRate: 2.6 },
  { productId: 'prod-004', productName: 'DreamRest Bonnell Spring Mattress', unitsSold: 121, revenue: 967900, views: 9800, conversionRate: 1.23, returnRate: 3.3 },
  { productId: 'prod-006', productName: 'CoolGel Memory Foam Pillow', unitsSold: 468, revenue: 604000, views: 15200, conversionRate: 3.08, returnRate: 1.5 },
  { productId: 'prod-007', productName: 'NeckSupport Cervical Pillow', unitsSold: 312, revenue: 402000, views: 10400, conversionRate: 3.0, returnRate: 2.2 },
  { productId: 'prod-008', productName: 'Premium Mattress Protector', unitsSold: 389, revenue: 318000, views: 8600, conversionRate: 4.52, returnRate: 0.8 },
]
