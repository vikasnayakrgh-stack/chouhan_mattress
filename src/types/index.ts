/**
 * Wakefit Clone - Global Type Definitions
 * Shared types used across all reusable components
 */

import React from 'react';

/**
 * Base props that all components accept
 */
export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
  id?: string;
}

/**
 * Component size variants
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Color variants for themed components
 */
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'outline'
  | 'ghost'
  | 'link';

/**
 * Responsive value type - can be a single value or object with breakpoints
 */
export type ResponsiveValue<T> = T | {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

/**
 * Flexible alignment
 */
export type Alignment = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

/**
 * Flexible justify
 */
export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

/**
 * Spacing scale
 */
export type Spacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64;

/**
 * Button types
 */
export interface ButtonProps extends BaseComponentProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant;
  size?: ComponentSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Card component types
 */
export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: Spacing | ResponsiveValue<Spacing>;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export interface CardHeaderProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  avatar?: React.ReactNode;
  children?: React.ReactNode;
}

export interface CardBodyProps extends BaseComponentProps {
  children: React.ReactNode;
}

export interface CardFooterProps extends BaseComponentProps {
  children: React.ReactNode;
  divider?: boolean;
}

/**
 * Badge/Tag types
 */
export interface BadgeProps extends BaseComponentProps {
  variant?: ColorVariant;
  size?: ComponentSize;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  children: React.ReactNode;
}

/**
 * Product types
 */
export interface Product {
  id: string | number;
  name: string;
  slug: string;
  shortDesc?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  images: string[];
  thumbnail?: string;
  badges?: Array<{
    text: string;
    variant: ColorVariant;
  }>;
  inStock?: boolean;
  stockCount?: number;
  sku?: string;
  category?: string;
  subCategory?: string;
  attributes?: Record<string, string | number>;
  isInWishlist?: boolean;
  isInCart?: boolean;
  quantity?: number;
}

export interface ProductCardProps extends BaseComponentProps {
  product: any;
  variant?: 'grid' | 'list' | 'featured' | 'compact';
  showActions?: boolean;
  showWishlist?: boolean;
  showBadges?: boolean;
  showRating?: boolean;
  showQuickView?: boolean;
  showCompare?: boolean;
  priority?: boolean;
  isInWishlist?: boolean;
  loading?: boolean;
  onAddToCart?: (product: any, variant?: any) => void;
  onToggleWishlist?: (product: any) => void;
  onQuickView?: (product: any) => void;
  onCompare?: (product: any) => void;
  onClick?: (product: any) => void;
}

/**
 * Product Grid types
 */
export interface ProductGridProps extends BaseComponentProps {
  products: Product[];
  columns?: ResponsiveValue<number>;
  gap?: Spacing | ResponsiveValue<Spacing>;
  variant?: 'grid' | 'list' | 'masonry';
  showActions?: boolean;
  showWishlist?: boolean;
  showQuickView?: boolean;
  showCompare?: boolean;
  loading?: boolean;
  loadingCount?: number;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onCompare?: (product: Product) => void;
  'data-testid'?: string;
}

/**
 * Category/Collection types
 */
export interface CategoryItem {
  name: string;
  slug: string;
  href: string;
  image: string;
  alt: string;
  count: string;
  color: string; // gradient string like "from-orange-400 to-orange-600"
}

export interface CollectionData {
  headline: string;
  subheadline?: string;
  description?: string;
  items: CategoryItem[];
  cta?: {
    title: string;
    description: string;
    backgroundImage: string;
    countdown?: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };
    ctaText: string;
    ctaLink: string;
  };
}

export interface CollectionProps extends BaseComponentProps {
  data: CollectionData;
  renderItem?: (item: CategoryItem, index: number) => React.ReactNode;
}

/**
 * Hero/Banner types
 */
export interface HeroProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  ctaPrimary?: {
    text: string;
    href: string;
    variant?: ColorVariant;
  };
  ctaSecondary?: {
    text: string;
    href: string;
    variant?: ColorVariant;
  };
  badges?: Array<{
    text: string;
    variant: ColorVariant;
  }>;
  countdown?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    label?: string;
  };
  showArrow?: boolean;
  height?: 'auto' | 'full' | 'half' | number;
  overlay?: React.ReactNode;
}

export interface BannerProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaVariant?: ColorVariant;
  badgeText?: string;
  badgeVariant?: ColorVariant;
  showOverlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  height?: 'auto' | 'full' | 'half' | number;
}

/**
 * Navigation types
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavItem[];
  megaMenu?: {
    columns: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
  };
}

export interface NavigationProps extends BaseComponentProps {
  items: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'tabs' | 'underline';
  collapsed?: boolean;
  onItemClick?: (item: NavItem) => void;
  activeItem?: string;
}

/**
 * Header types
 */
export interface HeaderProps extends BaseComponentProps {
  brandName: string;
  brandLink: string;
  brandLogo?: React.ReactNode;
  navItems: NavItem[];
  showSearch?: boolean;
  showCart?: boolean;
  showAccount?: boolean;
  showWishlist?: boolean;
  showCompare?: boolean;
  cartItemCount?: number;
  wishlistItemCount?: number;
  compareItemCount?: number;
  onToggleSearch?: () => void;
  onToggleCart?: () => void;
  onToggleAccount?: () => void;
  onToggleWishlist?: () => void;
  onToggleCompare?: () => void;
  onToggleMenu?: () => void;
  isMenuOpen?: boolean;
  sticky?: boolean;
  transparent?: boolean;
}

/**
 * Footer types
 */
export interface FooterNavSection {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface FooterSocialLink {
  platform: string;
  href: string;
  icon: React.ReactNode;
  label?: string;
}

export interface FooterProps extends BaseComponentProps {
  brandName: string;
  brandDescription?: string;
  brandLogo?: React.ReactNode;
  navSections: FooterNavSection[];
  socialLinks: FooterSocialLink[];
  newsletter?: {
    placeholder?: string;
    buttonText?: string;
    onSubmit?: (email: string) => void;
    disclaimer?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
    hours?: string;
  };
  paymentMethods?: React.ReactNode[];
  certifications?: React.ReactNode[];
  showCopyright?: boolean;
  copyrightText?: string;
  legalLinks?: Array<{ label: string; href: string }>;
}

/**
 * Search types
 */
export interface SearchProps extends BaseComponentProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: (value: string) => void;
  showClearButton?: boolean;
  showSearchButton?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  suggestions?: Array<{ label: string; href: string; type: 'product' | 'category' | 'query' }>;
  recentSearches?: string[];
  onRecentSearchClick?: (query: string) => void;
}

/**
 * Cart types
 */
export interface CartItem {
  id: string;
  productId: string | number;
  name: string;
  slug: string;
  image: string;
  alt: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxQuantity?: number;
  attributes?: Record<string, string>;
  inStock: boolean;
}

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
  onRemoveItem: (itemId: string | number) => void;
  onUpdateQuantity: (itemId: string | number, quantity: number) => void;
  onCheckout: () => void;
  onContinueShopping?: () => void;
  showCoupon?: boolean;
  couponPlaceholder?: string;
  onApplyCoupon?: (code: string) => void;
  couponCode?: string;
  couponError?: string;
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}

/**
 * Toast/Notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastProps extends BaseComponentProps {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Modal/Dialog types
 */
export interface ModalProps extends BaseComponentProps {
  open: boolean;
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

/**
 * Dropdown/Select types
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  group?: string;
}

export interface SelectProps extends BaseComponentProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  grouped?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
}

/**
 * Tabs types
 */
export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
  content: React.ReactNode;
}

export interface TabsProps extends BaseComponentProps {
  items: TabItem[];
  defaultActive?: string;
  variant?: 'line' | 'enclosed' | 'soft' | 'pills';
  orientation?: 'horizontal' | 'vertical';
  onChange?: (id: string) => void;
  fullWidth?: boolean;
}

/**
 * Accordion types
 */
export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends BaseComponentProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  variant?: 'default' | 'bordered' | 'separated';
  onChange?: (openIds: string[]) => void;
}

/**
 * Tooltip types
 */
export interface TooltipProps extends BaseComponentProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  delay?: number;
  offset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Pagination types
 */
export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
}

/**
 * Breadcrumb types
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  collapsible?: boolean;
}

/**
 * Form field types
 */
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}

export interface InputProps extends BaseComponentProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  size?: ComponentSize;
  fullWidth?: boolean;
}

export interface TextareaProps extends BaseComponentProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: ComponentSize;
  fullWidth?: boolean;
  minRows?: number;
  maxRows?: number;
}

export interface CheckboxProps extends BaseComponentProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
  size?: ComponentSize;
}

export interface RadioProps extends BaseComponentProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: ComponentSize;
}

export interface SwitchProps extends BaseComponentProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: ComponentSize;
  color?: ColorVariant;
}

/**
 * Rating types
 */
export interface RatingProps extends BaseComponentProps {
  value: number;
  max?: number;
  size?: ComponentSize;
  interactive?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
  precision?: 'full' | 'half' | 'exact';
  color?: ColorVariant;
}

/**
 * Skeleton/Loading types
 */
export interface SkeletonProps extends BaseComponentProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'product';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  count?: number;
}

/**
 * Icon types
 */
export interface IconProps extends BaseComponentProps {
  size?: ComponentSize | number;
  color?: ColorVariant | string;
  strokeWidth?: number;
}

/**
 * Divider types
 */
export interface DividerProps extends BaseComponentProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: number;
  color?: ColorVariant | string;
  label?: string;
  labelPosition?: 'start' | 'center' | 'end';
}

/**
 * Avatar types
 */
export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt: string;
  name?: string;
  size?: ComponentSize | number;
  shape?: 'circle' | 'square' | 'rounded';
  fallbackColor?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
  statusPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

/**
 * Chip/Tag types
 */
export interface ChipProps extends BaseComponentProps {
  label: string;
  variant?: ColorVariant;
  size?: ComponentSize;
  icon?: React.ReactNode;
  avatar?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  clickable?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Stepper types
 */
export interface StepperStep {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  completed?: boolean;
  active?: boolean;
  error?: boolean;
  disabled?: boolean;
}

export interface StepperProps extends BaseComponentProps {
  steps: StepperStep[];
  currentStep: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'numbered' | 'icon';
  onStepClick?: (stepId: string) => void;
  connector?: boolean;
}

/**
 * Table types
 */
export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  sticky?: boolean;
}

export interface TableProps<T = Record<string, unknown>> extends BaseComponentProps {
  columns: TableColumn<T>[];
  data: T[];
  keyAccessor: keyof T | ((row: T) => string);
  sortable?: boolean;
  defaultSort?: { key: string; direction: 'asc' | 'desc' };
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selected: string[]) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  loading?: boolean;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

/**
 * Tree/Folder types
 */
export interface TreeNode<T = Record<string, unknown>> {
  id: string;
  label: string;
  children?: TreeNode<T>[];
  data?: T;
  icon?: React.ReactNode;
  disabled?: boolean;
  expanded?: boolean;
  selected?: boolean;
}

export interface TreeProps<T = Record<string, unknown>> extends BaseComponentProps {
  nodes: TreeNode<T>[];
  onSelect?: (node: TreeNode<T>) => void;
  onExpand?: (node: TreeNode<T>, expanded: boolean) => void;
  multiSelect?: boolean;
  selectedIds?: string[];
  expandedIds?: string[];
  showIcons?: boolean;
  indentSize?: number;
}

/**
 * Color palette for theming
 */
export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface ThemeColors {
  primary: ColorPalette;
  secondary: ColorPalette;
  success: ColorPalette;
  warning: ColorPalette;
  danger: ColorPalette;
  info: ColorPalette;
  neutral: ColorPalette;
  background: ColorPalette;
  foreground: ColorPalette;
}

/**
 * Breakpoint definitions
 */
export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

/**
 * Spacing scale
 */
export interface SpacingScale {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  64: string;
}

/**
 * Typography scale
 */
export interface TypographyScale {
  fontFamily: {
    sans: string;
    mono: string;
    display: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

/**
 * Shadow scale
 */
export interface ShadowScale {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

/**
 * Border radius scale
 */
export interface BorderRadiusScale {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

/**
 * Z-index scale
 */
export interface ZIndexScale {
  hide: number;
  auto: string;
  base: number;
  dropdown: number;
  sticky: number;
  banner: number;
  overlay: number;
  modal: number;
  popover: number;
  toast: number;
  tooltip: number;
  max: number;
}

/**
 * Transition scale
 */
export interface TransitionScale {
  fast: string;
  normal: string;
  slow: string;
  easings: {
    linear: string;
    in: string;
    out: string;
    inOut: string;
  };
}

/**
 * Complete design tokens
 */
export interface DesignTokens {
  colors: ThemeColors;
  breakpoints: Breakpoints;
  spacing: SpacingScale;
  typography: TypographyScale;
  shadows: ShadowScale;
  borderRadius: BorderRadiusScale;
  zIndex: ZIndexScale;
  transitions: TransitionScale;
}

/**
 * Utility type for extracting component props
 */
export type ComponentProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & BaseComponentProps;

/**
 * Utility type for forward ref components
 */
export type ForwardRefComponent<T extends React.ElementType, P = {}> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P & ComponentProps<T>> & React.RefAttributes<React.ElementRef<T>>
>;

/**
 * Event handler types
 */
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void;
export type ChangeHandler<T = string> = (value: T, event?: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
export type SubmitHandler<T = Record<string, unknown>> = (data: T, event: React.FormEvent<HTMLFormElement>) => void;
export type KeyboardHandler = (event: React.KeyboardEvent<HTMLElement>) => void;
export type FocusHandler = (event: React.FocusEvent<HTMLElement>) => void;
export type BlurHandler = (event: React.FocusEvent<HTMLElement>) => void;

/**
 * Animation variants for Framer Motion
 */
export interface AnimationVariants {
  hidden?: Record<string, unknown>;
  visible?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  hover?: Record<string, unknown>;
  tap?: Record<string, unknown>;
  focus?: Record<string, unknown>;
}

export interface TransitionConfig {
  duration?: number;
  delay?: number;
  ease?: string | number[];
  type?: 'spring' | 'tween' | 'inertia';
  stiffness?: number;
  damping?: number;
  mass?: number;
}

/**
 * Media query helpers
 */
export type MediaQuery = 
  | '(max-width: 640px)'
  | '(min-width: 641px) and (max-width: 1024px)'
  | '(min-width: 1025px) and (max-width: 1280px)'
  | '(min-width: 1281px) and (max-width: 1536px)'
  | '(min-width: 1537px)';

/**
 * CSS-in-JS style object
 */
export type StyleObject = React.CSSProperties;

/**
 * Class name utility type
 */
export type ClassNameValue = string | number | boolean | undefined | null | ClassNameValue[] | Record<string, boolean | undefined | null>;

/**
 * Generic render prop type
 */
export type RenderProp<T> = (props: T) => React.ReactNode;

/**
 * Component slot types for compound components
 */
export interface SlotProps {
  children?: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

/**
 * Polymorphic component props
 */
export type PolymorphicComponentProps<T extends React.ElementType, P = {}> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof P> & P;

/**
 * Theme context type
 */
export interface ThemeContextValue {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
  colors: ThemeColors;
  tokens: DesignTokens;
}

/**
 * Locale context type
 */
export interface LocaleContextValue {
  locale: string;
  setLocale: (locale: string) => void;
  locales: string[];
  direction: 'ltr' | 'rtl';
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  t: (key: string, params?: Record<string, unknown>) => string;
}