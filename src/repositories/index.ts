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
  ICustomerProfileRepository,
  ICustomerAddressRepository,
  ICartRepository,
  IWishlistRepository,
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
// New customer-facing Supabase repositories
import { SupabaseCustomerProfileRepository } from '@/repositories/supabase/customerProfileRepository'
import { SupabaseCustomerAddressRepository } from '@/repositories/supabase/customerAddressRepository'
import { SupabaseCartRepository } from '@/repositories/supabase/cartRepository'
import { SupabaseWishlistRepository } from '@/repositories/supabase/wishlistRepository'

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
  // New customer-facing repositories
  customerProfiles: ICustomerProfileRepository
  customerAddresses: ICustomerAddressRepository
  carts: ICartRepository
  wishlists: IWishlistRepository
}

let cached: Repositories | null = null

function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_DATA_SOURCE === 'mock'
}

export function getRepositories(accessToken?: string): Repositories {
  // For production, always create new instances with accessToken if available
  if (accessToken) {
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
      // New customer-facing repositories
      customerProfiles: new SupabaseCustomerProfileRepository(accessToken),
      customerAddresses: new SupabaseCustomerAddressRepository(accessToken),
      carts: new SupabaseCartRepository(accessToken),
      wishlists: new SupabaseWishlistRepository(accessToken),
    }
  }

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
      // Mock implementations for new repos (return mock data)
      customerProfiles: {
        getById: async (id: string) => null,
        upsert: async (profile: any) => profile,
      } as any,
      customerAddresses: {
        getByCustomerId: async () => [],
        getById: async () => null,
        create: async (address: any) => ({ ...address, id: 'mock-id' }),
        update: async (id: string, address: any) => ({ ...address, id }),
        delete: async () => {},
        setDefault: async () => {},
      } as any,
      carts: {
        getByCustomerId: async () => null,
        upsert: async (cart: any) => cart,
        clear: async () => {},
        addItem: async (customerId: string, item: any) => ({ customer_id: customerId, items: [item] }),
        updateItem: async () => ({ items: [] }),
        removeItem: async () => ({ items: [] }),
        applyCoupon: async () => ({ applied_coupon_code: null }),
      } as any,
      wishlists: {
        getByCustomerId: async () => null,
        upsert: async (wishlist: any) => wishlist,
        addProduct: async () => ({ product_ids: [] }),
        removeProduct: async () => ({ product_ids: [] }),
        clear: async () => {},
        isInWishlist: async () => false,
      } as any,
    }
  } else {
    // For production without accessToken, we need a way to get the token
    // This will be called from server components that have access to the token
    throw new Error('getRepositories() requires accessToken in production mode. Call from a Server Component with auth context.')
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
  ICustomerProfileRepository,
  ICustomerAddressRepository,
  ICartRepository,
  IWishlistRepository,
} from '@/repositories/types'