import type { IDashboardRepository } from '@/repositories/types'
import type { DashboardStats } from '@/features/admin/types'
import { mockDashboardStats } from '@/data/admin/dashboard.mock'

export class MockDashboardRepository implements IDashboardRepository {
  async getStats(): Promise<DashboardStats> {
    return mockDashboardStats
  }
}
