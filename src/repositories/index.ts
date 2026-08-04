import type {
  IProductRepository,
  IOrderRepository,
  ICustomerRepository,
  IReturnRepository,
  IDiscountRepository,
  ICategoryRepository,
  ICollectionRepository,
  IInventoryRepository,
  IDashboardRepository,
  ICMSRepository,
  IReviewRepository,
  ISettingsRepository,
  IStaffRepository,
  IAnalyticsRepository,
  IAuditRepository,
  IIntegrationRepository,
} from '@/repositories/types'

// Mock repositories (no server-only, works in client components)
import { MockProductRepository } from '@/repositories/mock/productRepository'
import { MockOrderRepository } from '@/repositories/mock/orderRepository'
import { MockCustomerRepository } from '@/repositories/mock/customerRepository'
import { MockReturnRepository } from '@/repositories/mock/returnRepository'
import { MockDiscountRepository } from '@/repositories/mock/discountRepository'
import { MockCategoryRepository } from '@/repositories/mock/categoryRepository'
import { MockCollectionRepository } from '@/repositories/mock/collectionRepository'
import { MockInventoryRepository } from '@/repositories/mock/inventoryRepository'
import { MockDashboardRepository } from '@/repositories/mock/dashboardRepository'
import { MockCmsRepository } from '@/repositories/mock/cmsRepository'
import { MockReviewRepository } from '@/repositories/mock/reviewRepository'
import { MockSettingsRepository } from '@/repositories/mock/settingsRepository'
import { MockStaffRepository } from '@/repositories/mock/staffRepository'
import { MockAnalyticsRepository } from '@/repositories/mock/analyticsRepository'
import { MockAuditRepository } from '@/repositories/mock/auditRepository'
import { MockIntegrationRepository } from '@/repositories/mock/integrationRepository'

// Supabase repositories (server-only, only for server components)
import { SupabaseProductRepository } from '@/repositories/supabase/productRepository'
import { SupabaseOrderRepository } from '@/repositories/supabase/orderRepository'
import { SupabaseCustomerRepository } from '@/repositories/supabase/customerRepository'
import { SupabaseReturnRepository } from '@/repositories/supabase/returnRepository'
import { SupabaseDiscountRepository } from '@/repositories/supabase/discountRepository'
import { SupabaseCategoryRepository } from '@/repositories/supabase/categoryRepository'
import { SupabaseCollectionRepository } from '@/repositories/supabase/collectionRepository'
import { SupabaseInventoryRepository } from '@/repositories/supabase/inventoryRepository'
import { SupabaseDashboardRepository } from '@/repositories/supabase/dashboardRepository'
import { SupabaseCMSRepository } from '@/repositories/supabase/cmsRepository'
import { SupabaseReviewRepository } from '@/repositories/supabase/reviewRepository'
import { SupabaseSettingsRepository } from '@/repositories/supabase/settingsRepository'
import { SupabaseStaffRepository } from '@/repositories/supabase/staffRepository'
import { SupabaseAnalyticsRepository } from '@/repositories/supabase/analyticsRepository'
import { SupabaseAuditRepository } from '@/repositories/supabase/auditRepository'
import { SupabaseIntegrationRepository } from '@/repositories/supabase/integrationRepository'

export interface Repositories {
  products: IProductRepository
  orders: IOrderRepository
  customers: ICustomerRepository
  returns: IReturnRepository
  discounts: IDiscountRepository
  categories: ICategoryRepository
  collections: ICollectionRepository
  inventory: IInventoryRepository
  dashboard: IDashboardRepository
  cms: ICMSRepository
  reviews: IReviewRepository
  settings: ISettingsRepository
  staff: IStaffRepository
  analytics: IAnalyticsRepository
  audit: IAuditRepository
  integrations: IIntegrationRepository
}

let cached: Repositories | null = null

function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_DATA_SOURCE === 'mock'
}

export function getRepositories(): Repositories {
  if (cached) return cached
  
  if (isMockMode()) {
    cached = {
      products: new MockProductRepository(),
      orders: new MockOrderRepository(),
      customers: new MockCustomerRepository(),
      returns: new MockReturnRepository(),
      discounts: new MockDiscountRepository(),
      categories: new MockCategoryRepository(),
      collections: new MockCollectionRepository(),
      inventory: new MockInventoryRepository(),
      dashboard: new MockDashboardRepository(),
      cms: new MockCmsRepository(),
      reviews: new MockReviewRepository(),
      settings: new MockSettingsRepository(),
      staff: new MockStaffRepository(),
      analytics: new MockAnalyticsRepository(),
      audit: new MockAuditRepository(),
      integrations: new MockIntegrationRepository(),
    }
  } else {
    cached = {
      products: new SupabaseProductRepository(),
      orders: new SupabaseOrderRepository(),
      customers: new SupabaseCustomerRepository(),
      returns: new SupabaseReturnRepository(),
      discounts: new SupabaseDiscountRepository(),
      categories: new SupabaseCategoryRepository(),
      collections: new SupabaseCollectionRepository(),
      inventory: new SupabaseInventoryRepository(),
      dashboard: new SupabaseDashboardRepository(),
      cms: new SupabaseCMSRepository(),
      reviews: new SupabaseReviewRepository(),
      settings: new SupabaseSettingsRepository(),
      staff: new SupabaseStaffRepository(),
      analytics: new SupabaseAnalyticsRepository(),
      audit: new SupabaseAuditRepository(),
      integrations: new SupabaseIntegrationRepository(),
    }
  }
  return cached
}

// Re-export types for convenience
export type { 
  IProductRepository,
  IOrderRepository,
  ICustomerRepository,
  IReturnRepository,
  IDiscountRepository,
  ICategoryRepository,
  ICollectionRepository,
  IInventoryRepository,
  IDashboardRepository,
  ICMSRepository,
  IReviewRepository,
  ISettingsRepository,
  IStaffRepository,
  IAnalyticsRepository,
  IAuditRepository,
  IIntegrationRepository,
} from '@/repositories/types'