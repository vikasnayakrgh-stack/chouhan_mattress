export type AdminRole = 'owner' | 'admin' | 'manager' | 'staff' | 'viewer'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
  avatarUrl?: string
  lastLoginAt: string
}

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'archive'
  | 'login'
  | 'export'
  | 'stock_adjust'

export interface AuditLog {
  id: string
  actorId: string
  actorName: string
  action: AuditAction
  entityType: string
  entityId: string
  description: string
  createdAt: string
}

export interface DashboardKPIs {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  totalCustomers: number
  pendingOrders: number
  lowStockCount: number
  outOfStockCount: number
  returnsCount: number
  salesTrend: number // percent vs previous period
  ordersTrend: number
  aovTrend: number
  customersTrend: number
}

export interface SalesPoint {
  date: string
  sales: number
  orders: number
}

export interface TopProduct {
  productId: string
  name: string
  unitsSold: number
  revenue: number
}

export interface LowStockAlert {
  sku: string
  productName: string
  variantLabel: string
  stock: number
  threshold: number
}

export interface OrderStatusSlice {
  status: string
  count: number
}

export interface DashboardStats {
  kpis: DashboardKPIs
  salesOverTime: SalesPoint[]
  topProducts: TopProduct[]
  lowStockAlerts: LowStockAlert[]
  orderStatusDistribution: OrderStatusSlice[]
}
