import type { ProductWithVariants, ProductVariant } from '@/features/products/types'
import type { Order, OrderStatus, Refund } from '@/features/orders/types'
import type { Customer, CustomerAddress, CustomerNote } from '@/features/customers/types'
import type { Return, ReturnStatus } from '@/features/returns/types'
import type { Discount } from '@/features/discounts/types'
import type { Category, Collection } from '@/features/catalog/types'
import type { InventoryItem, StockAdjustment } from '@/features/inventory/types'
import type { DashboardStats } from '@/features/admin/types'
import type {
  HeroContent,
  BannerContent,
  FAQContent,
  ContentSection,
  SEOContent,
  PageSEO,
} from '@/features/cms/types'
import type { Review, ReviewStatus } from '@/features/reviews/types'
import type { AllSettings, SettingsSection } from '@/features/settings/types'
import type {
  AnalyticsOverview,
  SalesReport,
  TrafficReport,
  ConversionReport,
  CustomerReport,
  ProductReport,
  AnalyticsFilters,
} from '@/features/analytics/types'
import type { AuditLog, AuditFilters } from '@/features/audit/types'
import type { AdminUser, AdminRole } from '@/features/staff/types'
import type { Integration } from '@/features/integrations/types'
import type { CustomerProfile } from '@/repositories/supabase/customerTypes'
import type { CustomerAddress as CustomerAddressType } from '@/repositories/supabase/customerTypes'
import type { Cart, CartItem } from '@/repositories/supabase/customerTypes'
import type { Wishlist } from '@/repositories/supabase/customerTypes'

export interface IProductRepository {
  getAll(): Promise<ProductWithVariants[]>
  getById(id: string): Promise<ProductWithVariants | null>
  getBySlug(slug: string): Promise<ProductWithVariants | null>
  search(filters: {
    categoryId?: string
    status?: string
    stock?: string
    query?: string
    page?: number
    pageSize?: number
  }): Promise<{ products: ProductWithVariants[]; total: number }>
  create(product: ProductWithVariants): Promise<ProductWithVariants>
  update(id: string, updates: Partial<ProductWithVariants>): Promise<ProductWithVariants | null>;
  archive(id: string): Promise<boolean>
  duplicate(id: string): Promise<ProductWithVariants | null>
  getVariants(productId: string): Promise<ProductVariant[]>
}

export interface IOrderRepository {
  getAll(): Promise<Order[]>
  getById(id: string): Promise<Order | null>
  getByCustomer(customerId: string): Promise<Order[]>
  updateStatus(id: string, status: OrderStatus, adminNote?: string): Promise<Order | null>
  addTracking(id: string, trackingNumber: string, carrier: string): Promise<Order | null>
  addRefund(id: string, refund: Omit<Refund, 'id' | 'createdAt'>): Promise<Order | null>
}

export interface ICustomerRepository {
  getAll(): Promise<Customer[]>
  getById(id: string): Promise<Customer | null>
  addNote(customerId: string, content: string, author: string): Promise<CustomerNote | null>
  updateNote(customerId: string, noteId: string, content: string): Promise<CustomerNote | null>
  deleteNote(customerId: string, noteId: string): Promise<CustomerNote | null>
  addAddress(customerId: string, address: Omit<CustomerAddress, 'id'>): Promise<CustomerAddress | null>
  updateAddress(customerId: string, addressId: string, updates: Partial<Omit<CustomerAddress, 'id'>>): Promise<CustomerAddress | null>
  deleteAddress(customerId: string, addressId: string): Promise<boolean>
  setDefaultAddress(customerId: string, addressId: string, kind: 'shipping' | 'billing'): Promise<boolean>
}

// New customer-facing repository interfaces
export interface ICustomerProfileRepository {
  getById(id: string): Promise<CustomerProfile | null>
  upsert(profile: CustomerProfile): Promise<CustomerProfile>
}

export interface ICustomerAddressRepository {
  getByCustomerId(customerId: string): Promise<CustomerAddressType[]>
  getById(id: string): Promise<CustomerAddressType | null>
  create(address: Omit<CustomerAddressType, 'id' | 'created_at' | 'updated_at'>): Promise<CustomerAddressType>
  update(id: string, address: Partial<CustomerAddressType>): Promise<CustomerAddressType>
  delete(id: string): Promise<void>
  setDefault(customerId: string, addressId: string, type: 'shipping' | 'billing'): Promise<void>
}

export interface ICartRepository {
  getByCustomerId(customerId: string): Promise<Cart | null>
  upsert(cart: Cart): Promise<Cart>
  clear(customerId: string): Promise<void>
  addItem(customerId: string, item: Omit<CartItem, 'id'>): Promise<Cart>
  updateItem(customerId: string, itemId: string, quantity: number): Promise<Cart>
  removeItem(customerId: string, itemId: string): Promise<Cart>
  applyCoupon(customerId: string, couponCode: string | null): Promise<Cart>
}

export interface IWishlistRepository {
  getByCustomerId(customerId: string): Promise<Wishlist | null>
  upsert(wishlist: Wishlist): Promise<Wishlist>
  addProduct(customerId: string, productId: string): Promise<Wishlist>
  removeProduct(customerId: string, productId: string): Promise<Wishlist>
  clear(customerId: string): Promise<void>
  isInWishlist(customerId: string, productId: string): Promise<boolean>
}

export interface IReturnRepository {
  getAll(): Promise<Return[]>
  getById(id: string): Promise<Return | null>
  getByOrderId(orderId: string): Promise<Return[]>
  getByCustomerId(customerId: string): Promise<Return[]>
  getByCustomer(customerId: string): Promise<Return[]>
  updateStatus(id: string, status: ReturnStatus, actor: string): Promise<Return | null>
  delete(id: string): Promise<boolean>
}

export interface IDiscountRepository {
  getAll(): Promise<Discount[]>
  getById(id: string): Promise<Discount | null>
  getByCode(code: string): Promise<Discount | null>
  create(discount: Discount): Promise<Discount>
  update(id: string, updates: Partial<Discount>): Promise<Discount | null>
  remove(id: string): Promise<boolean>
}

export interface ICategoryRepository {
  getAll(): Promise<Category[]>
  getById(id: string): Promise<Category | null>
  getBySlug(slug: string): Promise<Category | null>
  create(category: Omit<Category, 'id' | 'createdAt' | 'productCount'>): Promise<Category>
  update(id: string, updates: Partial<Category>): Promise<Category | null>
  delete(id: string): Promise<boolean>
}

export interface ICollectionRepository {
  getAll(): Promise<Collection[]>
  getById(id: string): Promise<Collection | null>
  getBySlug(slug: string): Promise<Collection | null>
  create(collection: Omit<Collection, 'id' | 'createdAt' | 'productCount'>): Promise<Collection>
  update(id: string, updates: Partial<Collection>): Promise<Collection | null>
  delete(id: string): Promise<boolean>
}

export interface IInventoryRepository {
  getAll(): Promise<InventoryItem[]>
  getBySku(sku: string): Promise<InventoryItem | null>
  adjustStock(adjustment: Omit<StockAdjustment, 'id' | 'createdAt'>): Promise<InventoryItem | null>
}

export interface IDashboardRepository {
  getStats(): Promise<DashboardStats>
}

export interface ICMSRepository {
  getHero(): Promise<HeroContent>
  updateHero(updates: Partial<HeroContent>, actor: string): Promise<HeroContent>
  getBanners(): Promise<BannerContent[]>
  createBanner(banner: Omit<BannerContent, 'id' | 'updatedAt'>): Promise<BannerContent>
  updateBanner(id: string, updates: Partial<BannerContent>, actor: string): Promise<BannerContent | null>
  deleteBanner(id: string): Promise<boolean>
  getFAQs(): Promise<FAQContent[]>
  createFAQ(faq: Omit<FAQContent, 'id' | 'updatedAt'>): Promise<FAQContent>
  updateFAQ(id: string, updates: Partial<FAQContent>, actor: string): Promise<FAQContent | null>
  deleteFAQ(id: string): Promise<boolean>
  reorderFAQs(orderedIds: string[]): Promise<FAQContent[]>
  getSections(): Promise<ContentSection[]>
  updateSection(id: string, updates: Partial<ContentSection>, actor: string): Promise<ContentSection | null>
  getSEO(): Promise<SEOContent>
  updateSEO(updates: Partial<Omit<SEOContent, 'pages'>>, actor: string): Promise<SEOContent>
  updatePageSEO(pageId: string, updates: Partial<PageSEO>): Promise<PageSEO | null>
}

export interface IReviewRepository {
  getAll(): Promise<Review[]>
  getById(id: string): Promise<Review | null>
  updateStatus(id: string, status: ReviewStatus): Promise<Review | null>
  bulkUpdateStatus(ids: string[], status: ReviewStatus): Promise<number>
  setFeatured(id: string, featured: boolean): Promise<Review | null>
  bulkSetFeatured(ids: string[], featured: boolean): Promise<number>
  addResponse(id: string, content: string, author: string): Promise<Review | null>
  deleteResponse(id: string): Promise<Review | null>
  delete(id: string): Promise<boolean>
}

export interface ISettingsRepository {
  getAll(): Promise<AllSettings>
  updateSection<K extends SettingsSection>(section: K, values: AllSettings[K]): Promise<AllSettings[K]>
}

export interface IStaffRepository {
  getAll(): Promise<AdminUser[]>
  getById(id: string): Promise<AdminUser | null>
  invite(email: string, name: string, role: AdminRole, invitedBy: string): Promise<AdminUser>
  update(id: string, updates: Partial<AdminUser>): Promise<AdminUser | null>
  setStatus(id: string, status: 'active' | 'invited' | 'suspended'): Promise<AdminUser | null>
  resendInvite(email: string): Promise<{ id: string; email: string; role: AdminRole; invitedBy: string; invitedAt: string; expiresAt: string; status: 'pending' | 'accepted' | 'expired' } | null>
  getInvitations(): Promise<{ id: string; email: string; role: AdminRole; invitedBy: string; invitedAt: string; expiresAt: string; status: 'pending' | 'accepted' | 'expired' }[]>
  getRolePermissions(): Promise<{ role: AdminRole; label: string; description: string; permissions: string[] }[]>
  getActivity(userId: string): Promise<{ id: string; userId: string; action: string; timestamp: string }[]>
}

export interface IAnalyticsRepository {
  getOverview(filters: AnalyticsFilters): Promise<AnalyticsOverview>
  getSalesReport(filters: AnalyticsFilters): Promise<SalesReport>
  getTrafficReport(filters: AnalyticsFilters): Promise<TrafficReport>
  getConversionReport(filters: AnalyticsFilters): Promise<ConversionReport>
  getCustomerReport(filters: AnalyticsFilters): Promise<CustomerReport>
  getProductReport(): Promise<ProductReport>
}

export interface IAuditRepository {
  getAll(filters?: AuditFilters): Promise<AuditLog[]>
}

export interface IIntegrationRepository {
  getAll(): Promise<Integration[]>
  getById(id: string): Promise<Integration | null>
  setStatus(id: string, status: Integration['status']): Promise<Integration | null>
  rotateKey(integrationId: string, keyId: string): Promise<Integration | null>
}
