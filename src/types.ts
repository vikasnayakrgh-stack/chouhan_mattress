/**
 * Wakefit Clone - Shared Type Definitions
 * Centralized types for all reusable components
 */

// ============================================
// Base/UI Types
// ============================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon';

export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}

// ============================================
// Navigation Types
// ============================================

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  badge?: string;
  external?: boolean;
}

export interface HeaderProps extends BaseComponentProps {
  brandName: string;
  brandLink: string;
  logo?: React.ReactNode;
  navItems: NavItem[];
  showCart?: boolean;
  cartItemCount?: number;
  showSearch?: boolean;
  showAccount?: boolean;
  showWishlist?: boolean;
  onToggleCart?: () => void;
  onToggleSearch?: () => void;
  onToggleMenu?: () => void;
  isMenuOpen?: boolean;
  isScrolled?: boolean;
}

export interface NavigationProps extends BaseComponentProps {
  items: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  collapsed?: boolean;
  onItemClick?: (item: NavItem) => void;
  activeHref?: string;
}

export interface MobileMenuProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  showCart?: boolean;
  cartItemCount?: number;
  onToggleCart?: () => void;
}

// ============================================
// Hero/Banner Types
// ============================================

export interface CtaButton {
  text: string;
  href: string;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
}

export interface Badge {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'outline';
}

export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  label?: string;
}

export interface HeroProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage: string;
  backgroundPosition?: string;
  ctaPrimary?: CtaButton;
  ctaSecondary?: CtaButton;
  badges?: Badge[];
  countdown?: CountdownData;
  showArrow?: boolean;
  arrowLabel?: string;
  overlay?: React.ReactNode;
  height?: 'standard' | 'tall' | 'full';
}

export interface BannerProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  backgroundPosition?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaVariant?: ButtonVariant;
  badgeText?: string;
  badgeVariant?: Badge['variant'];
  showOverlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  height?: number | string;
  alignment?: 'left' | 'center' | 'right';
}

// ============================================
// Product Types
// ============================================

export interface ProductBadge {
  text: string;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'outline';
}

export interface ProductRating {
  value: number;
  count: number;
  max?: number;
}

export interface ProductPrice {
  current: number;
  original?: number;
  currency?: string;
  discountPercent?: number;
  unit?: string;
}

export interface Product {
  id: string | number;
  name: string;
  slug: string;
  shortDescription?: string;
  shortDesc?: string;
  description?: string;
  images: string[];
  primaryImage: string;
  alt?: string;
  price: ProductPrice | number;
  originalPrice?: number;
  discount?: number;
  href?: string;
  category?: string;
  currency?: string;
  reviewCount?: number;
  rating?: ProductRating | number;
  badges?: ProductBadge[];
  categories?: string[];
  brand?: string;
  inStock?: boolean;
  stockCount?: number;
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  seo?: ProductSeo;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: ProductPrice;
  attributes: Record<string, string>;
  inStock: boolean;
  images?: string[];
}

export interface ProductSeo {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
  maxQuantity?: number;
  originalPrice?: number;
  image?: string;
  attributes?: Record<string, string>;
}

export interface ProductCardProps extends BaseComponentProps {
  product: Product;
  variant?: 'grid' | 'list' | 'featured' | 'compact' | 'masonry';
  showActions?: boolean;
  showBadges?: boolean;
  showRating?: boolean;
  showWishlist?: boolean;
  onAddToCart?: (product: Product, variant?: ProductVariant) => void;
  onToggleWishlist?: (product: Product) => void;
  onClick?: (product: Product) => void;
  isInWishlist?: boolean;
  loading?: boolean;
}

export interface ProductGridProps extends BaseComponentProps {
  products: Product[];
  columns?: 1 | 2 | 3 | 4 | 5;
  gap?: 'sm' | 'md' | 'lg';
  variant?: 'grid' | 'list' | 'masonry';
  showActions?: boolean;
  showBadges?: boolean;
  showRating?: boolean;
  onAddToCart?: (product: Product, variant?: ProductVariant) => void;
  onToggleWishlist?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  loadMore?: {
    hasMore: boolean;
    onLoadMore: () => void;
    loading: boolean;
  };
}

export interface CategoryItem {
  id?: string;
  name: string;
  href: string;
  image: string;
  alt?: string;
  count?: string;
  color?: string;
  description?: string;
}

export interface CollectionProps<T = any> extends BaseComponentProps {
  items: T[];
  title?: string;
  subtitle?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  showViewAll?: boolean;
  viewAllHref?: string;
  viewAllText?: string;
  loading?: boolean;
}

// ============================================
// Cart Types
// ============================================

export interface CartSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
  currency: string;
}

export interface CartProps extends BaseComponentProps {
  items: CartItem[];
  summary: CartSummary;
  showCoupon?: boolean;
  couponPlaceholder?: string;
  onApplyCoupon?: (code: string) => void;
  onRemoveItem?: (itemId: string | number, variantId?: string) => void;
  onUpdateQuantity?: (itemId: string | number, quantity: number, variantId?: string) => void;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  checkoutDisabled?: boolean;
  checkoutText?: string;
  emptyCartMessage?: string;
  emptyCartAction?: {
    text: string;
    href: string;
  };
}

export interface CartDrawerProps extends CartProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'right' | 'left';
  showOverlay?: boolean;
  children?: React.ReactNode;
}

// ============================================
// Footer Types
// ============================================

export interface FooterNavSection {
  title: string;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: React.ReactNode;
  label?: string;
}

export type FooterSocialLink = SocialLink;

export interface NewsletterConfig {
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => void | Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  disclaimer?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

export interface FooterProps extends BaseComponentProps {
  brandName: string;
  brandDescription?: string;
  logo?: React.ReactNode;
  navSections: FooterNavSection[];
  socialLinks: SocialLink[];
  newsletter?: NewsletterConfig;
  contactInfo?: ContactInfo;
  certifications?: any[];
  showCopyright?: boolean;
  copyrightText?: string;
  legalLinks?: Array<{
    label: string;
    href: string;
  }>;
  paymentMethods?: Array<{
    name: string;
    icon: React.ReactNode;
  }>;
}

// ============================================
// Search Types
// ============================================

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'query';
  image?: string;
  href?: string;
  count?: number;
}

export interface SearchProps extends BaseComponentProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  suggestions?: SearchSuggestion[];
  showClearButton?: boolean;
  showSearchButton?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  debounceMs?: number;
  minCharsForSuggestions?: number;
}

export interface SearchModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  popularSearches?: string[];
  trendingProducts?: Product[];
  categories?: NavItem[];
}

// ============================================
// Section/Layout Types
// ============================================

export interface SectionProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  description?: string;
  alignment?: 'left' | 'center' | 'right';
  background?: 'default' | 'muted' | 'primary' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export interface ContainerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

export interface GridProps extends BaseComponentProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  columnsMd?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  columnsLg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  as?: React.ElementType;
}

// ============================================
// Animation/Transition Types
// ============================================

export interface TransitionProps extends BaseComponentProps {
  children: React.ReactNode;
  enter?: string;
  exit?: string;
  duration?: number;
  delay?: number;
  easing?: string;
}

export interface ScrollRevealProps extends BaseComponentProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'none';
  delay?: number;
  duration?: number;
}

// ============================================
// Form Types
// ============================================

export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface InputProps extends FormFieldProps, React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps extends FormFieldProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
}

export interface CheckboxProps extends FormFieldProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
}

export interface RadioGroupProps extends FormFieldProps {
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

// ============================================
// Notification/Toast Types
// ============================================

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

export interface ToastProps extends BaseComponentProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export interface ToastContainerProps extends BaseComponentProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxVisible?: number;
}

// ============================================
// Modal/Dialog Types
// ============================================

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export interface DrawerProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'right' | 'left' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

// ============================================
// Skeleton/Loading Types
// ============================================

export interface SkeletonProps extends BaseComponentProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'product' | 'button';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  count?: number;
}

// ============================================
// SEO/Meta Types
// ============================================

export interface MetaTags {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
  structuredData?: Record<string, unknown>;
}

// ============================================
// API/Config Types
// ============================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, string | string[]>;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  currency: {
    code: string;
    symbol: string;
    locale: string;
  };
  features: {
    wishlist: boolean;
    compare: boolean;
    reviews: boolean;
    recentlyViewed: boolean;
  };
}