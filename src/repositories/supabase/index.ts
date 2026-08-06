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

import { SupabaseProductRepository } from './productRepository'
import { SupabaseOrderRepository } from './orderRepository'
import { SupabaseCustomerRepository } from './customerRepository'
import { SupabaseReturnRepository } from './returnRepository'
import { SupabaseDiscountRepository } from './discountRepository'
import { SupabaseCategoryRepository } from './categoryRepository'
import { SupabaseCollectionRepository } from './collectionRepository'
import { SupabaseInventoryRepository } from './inventoryRepository'
import { SupabaseDashboardRepository } from './dashboardRepository'
import { SupabaseCMSRepository } from './cmsRepository'
import { SupabaseReviewRepository } from './reviewRepository'
import { SupabaseSettingsRepository } from './settingsRepository'
import { SupabaseStaffRepository } from './staffRepository'
import { SupabaseAnalyticsRepository } from './analyticsRepository'
import { SupabaseAuditRepository } from './auditRepository'
import { SupabaseIntegrationRepository } from './integrationRepository'

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

export function getRepositories(accessToken?: string): Repositories {
  return {
    products: new SupabaseProductRepository(accessToken),
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
