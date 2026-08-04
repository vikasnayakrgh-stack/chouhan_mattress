import { getRepositories } from '@/repositories'
import type { DashboardStats } from '@/features/admin/types'
import type { Order } from '@/features/orders/types'

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    return getRepositories().dashboard.getStats()
  },

  async getRecentOrders(limit = 5): Promise<Order[]> {
    const orders = await getRepositories().orders.getAll()
    return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit)
  },
}
