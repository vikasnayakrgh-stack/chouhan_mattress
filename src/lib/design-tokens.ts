/**
 * Wakefit Design Tokens
 * Platform-agnostic design tokens extracted from the Wakefit audit.
 * Usable in CSS, JavaScript, TypeScript, React Native, and other platforms.
 * 
 * Based on Phase 1 audit findings:
 * - Primary: #FF6B00 (Wakefit Orange)
 * - Headings: Poppins, Body: Inter
 * - Base radius: 12px (0.75rem)
 * - Standard transition: 300ms
 * - 6 breakpoints (sm through 2xl)
 * - Max container: 1400px
 * - Fluid typography with clamp()
 */

// ============================================================================
// SPACING SCALE (0-32rem)
// Based on 4px base unit (0.25rem), scaling up to 32rem (512px)
// ============================================================================

export const spacing = {
  // Base unit: 4px = 0.25rem
  '0': '0',
  '1': '0.25rem',   // 4px
  '2': '0.5rem',    // 8px
  '3': '0.75rem',   // 12px
  '4': '1rem',      // 16px
  '5': '1.25rem',   // 20px
  '6': '1.5rem',    // 24px
  '7': '1.75rem',   // 28px
  '8': '2rem',      // 32px
  '9': '2.25rem',   // 36px
  '10': '2.5rem',   // 40px
  '11': '2.75rem',  // 44px
  '12': '3rem',     // 48px
  '14': '3.5rem',   // 56px
  '16': '4rem',     // 64px
  '20': '5rem',     // 80px
  '24': '6rem',     // 96px
  '28': '7rem',     // 112px
  '32': '8rem',     // 128px
  '36': '9rem',     // 144px
  '40': '10rem',    // 160px
  '44': '11rem',    // 176px
  '48': '12rem',    // 192px
  '52': '13rem',    // 208px
  '56': '14rem',    // 224px
  '60': '15rem',    // 240px
  '64': '16rem',    // 256px
  '72': '18rem',    // 288px
  '80': '20rem',    // 320px
  '88': '22rem',    // 352px
  '96': '24rem',    // 384px
  '104': '26rem',   // 416px
  '112': '28rem',   // 448px
  '128': '32rem',   // 512px
} as const;

export type SpacingToken = keyof typeof spacing;

// ============================================================================
// FONT SCALE (display-xl through overline with clamp values)
// Fluid typography using clamp(min, preferred, max) for responsive scaling
// Font families: Poppins for headings, Inter for body
// ============================================================================

export const fontFamilies = {
  heading: 'Poppins, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
  mono: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
} as const;

export type FontFamilyToken = keyof typeof fontFamilies;

export const fontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

export type FontWeightToken = keyof typeof fontWeights;

export const fontSizes = {
  // Display sizes - for hero sections, major headlines
  'display-xl': {
    fontSize: 'clamp(3.5rem, 8vw, 6rem)',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    fontWeight: fontWeights.extrabold,
  },
  'display-lg': {
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    lineHeight: '1.15',
    letterSpacing: '-0.01em',
    fontWeight: fontWeights.extrabold,
  },
  'display-md': {
    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
    lineHeight: '1.2',
    letterSpacing: '-0.01em',
    fontWeight: fontWeights.bold,
  },
  'display-sm': {
    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
    lineHeight: '1.25',
    letterSpacing: '0',
    fontWeight: fontWeights.bold,
  },
  
  // Heading sizes - for section headers, card titles
  'heading-xl': {
    fontSize: 'clamp(1.875rem, 2.5vw, 2.25rem)',
    lineHeight: '1.3',
    letterSpacing: '0',
    fontWeight: fontWeights.bold,
  },
  'heading-lg': {
    fontSize: 'clamp(1.5rem, 2vw, 1.875rem)',
    lineHeight: '1.35',
    letterSpacing: '0',
    fontWeight: fontWeights.bold,
  },
  'heading-md': {
    fontSize: 'clamp(1.25rem, 1.5vw, 1.5rem)',
    lineHeight: '1.4',
    letterSpacing: '0',
    fontWeight: fontWeights.semibold,
  },
  'heading-sm': {
    fontSize: 'clamp(1.125rem, 1.25vw, 1.25rem)',
    lineHeight: '1.45',
    letterSpacing: '0',
    fontWeight: fontWeights.semibold,
  },
  
  // Body sizes - for paragraphs, content
  'body-lg': {
    fontSize: '1.125rem',
    lineHeight: '1.6',
    letterSpacing: '0',
    fontWeight: fontWeights.normal,
  },
  'body-md': {
    fontSize: '1rem',
    lineHeight: '1.6',
    letterSpacing: '0',
    fontWeight: fontWeights.normal,
  },
  'body-sm': {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    letterSpacing: '0',
    fontWeight: fontWeights.normal,
  },
  
  // Small utility sizes
  'caption': {
    fontSize: '0.75rem',
    lineHeight: '1.5',
    letterSpacing: '0.02em',
    fontWeight: fontWeights.medium,
  },
  'overline': {
    fontSize: '0.75rem',
    lineHeight: '1.5',
    letterSpacing: '0.1em',
    fontWeight: fontWeights.semibold,
    textTransform: 'uppercase',
  },
} as const;

export type FontSizeToken = keyof typeof fontSizes;

// ============================================================================
// COLOR PALETTE
// Primitive tokens (raw color values) + Semantic tokens (meaning-based aliases)
// Supports both light and dark modes
// ============================================================================

// Primitive color palette (raw values)
export const colorsPrimitive = {
  // Wakefit Brand Colors
  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    950: '#431407',
  },
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },
  // Semantic neutrals
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Wakefit specific brand colors (direct values)
  wakefit: {
    orange: '#FF6B00',
    'orange-light': '#FF8C33',
    'orange-dark': '#E65A00',
    blue: '#0066CC',
    'blue-light': '#338FFF',
    'blue-dark': '#0052A3',
    green: '#00A651',
    'green-light': '#33C973',
    'green-dark': '#008541',
    gray: '#6B7280',
    'gray-light': '#9CA3AF',
    'gray-dark': '#374151',
    black: '#111827',
    white: '#FFFFFF',
    cream: '#FDF8F3',
    beige: '#F5F0EB',
  },
} as const;

export type ColorPrimitiveToken = keyof typeof colorsPrimitive;

// Light mode semantic tokens
export const colorsLight = {
  // Background layers
  background: {
    primary: colorsPrimitive.white,
    secondary: colorsPrimitive.wakefit.cream,
    tertiary: colorsPrimitive.wakefit.beige,
    inverse: colorsPrimitive.wakefit.black,
  },
  
  // Foreground/text layers
  foreground: {
    primary: colorsPrimitive.wakefit.black,
    secondary: colorsPrimitive.wakefit['gray-dark'],
    tertiary: colorsPrimitive.wakefit.gray,
    inverse: colorsPrimitive.white,
    muted: colorsPrimitive.wakefit['gray-light'],
  },
  
  // Primary brand color
  primary: {
    DEFAULT: colorsPrimitive.wakefit.orange,
    light: colorsPrimitive.wakefit['orange-light'],
    dark: colorsPrimitive.wakefit['orange-dark'],
    foreground: colorsPrimitive.white,
    subtle: colorsPrimitive.orange[50],
    muted: colorsPrimitive.orange[100],
  },
  
  // Secondary brand color
  secondary: {
    DEFAULT: colorsPrimitive.wakefit.blue,
    light: colorsPrimitive.wakefit['blue-light'],
    dark: colorsPrimitive.wakefit['blue-dark'],
    foreground: colorsPrimitive.white,
    subtle: colorsPrimitive.blue[50],
    muted: colorsPrimitive.blue[100],
  },
  
  // Success/positive
  success: {
    DEFAULT: colorsPrimitive.wakefit.green,
    light: colorsPrimitive.wakefit['green-light'],
    dark: colorsPrimitive.wakefit['green-dark'],
    foreground: colorsPrimitive.white,
    subtle: colorsPrimitive.green[50],
    muted: colorsPrimitive.green[100],
  },
  
  // Warning/caution
  warning: {
    DEFAULT: colorsPrimitive.orange[500],
    light: colorsPrimitive.orange[400],
    dark: colorsPrimitive.orange[600],
    foreground: colorsPrimitive.white,
    subtle: colorsPrimitive.orange[50],
    muted: colorsPrimitive.orange[100],
  },
  
  // Error/destructive
  danger: {
    DEFAULT: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    foreground: colorsPrimitive.white,
    subtle: '#FEF2F2',
    muted: '#FEE2E2',
  },
  
  // Neutral/UI colors
  neutral: {
    50: colorsPrimitive.gray[50],
    100: colorsPrimitive.gray[100],
    200: colorsPrimitive.gray[200],
    300: colorsPrimitive.gray[300],
    400: colorsPrimitive.gray[400],
    500: colorsPrimitive.gray[500],
    600: colorsPrimitive.gray[600],
    700: colorsPrimitive.gray[700],
    800: colorsPrimitive.gray[800],
    900: colorsPrimitive.gray[900],
    950: colorsPrimitive.gray[950],
  },
  
  // Border/divider colors
  border: {
    DEFAULT: colorsPrimitive.gray[200],
    light: colorsPrimitive.gray[100],
    dark: colorsPrimitive.gray[300],
    focus: colorsPrimitive.wakefit.orange,
    error: '#EF4444',
  },
  
  // Interactive states
  interactive: {
    hover: colorsPrimitive.gray[100],
    active: colorsPrimitive.gray[200],
    focus: colorsPrimitive.orange[200],
    disabled: colorsPrimitive.gray[100],
  },
  
  // Overlay/backdrop
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

// Dark mode semantic tokens
export const colorsDark = {
  // Background layers
  background: {
    primary: colorsPrimitive.wakefit.black,
    secondary: colorsPrimitive.gray[900],
    tertiary: colorsPrimitive.gray[800],
    inverse: colorsPrimitive.white,
  },
  
  // Foreground/text layers
  foreground: {
    primary: colorsPrimitive.white,
    secondary: colorsPrimitive.gray[300],
    tertiary: colorsPrimitive.gray[400],
    inverse: colorsPrimitive.wakefit.black,
    muted: colorsPrimitive.gray[500],
  },
  
  // Primary brand color
  primary: {
    DEFAULT: colorsPrimitive.wakefit['orange-light'],
    light: colorsPrimitive.wakefit.orange,
    dark: colorsPrimitive.wakefit['orange-dark'],
    foreground: colorsPrimitive.wakefit.black,
    subtle: colorsPrimitive.orange[900],
    muted: colorsPrimitive.orange[800],
  },
  
  // Secondary brand color
  secondary: {
    DEFAULT: colorsPrimitive.wakefit['blue-light'],
    light: colorsPrimitive.wakefit.blue,
    dark: colorsPrimitive.wakefit['blue-dark'],
    foreground: colorsPrimitive.white,
    subtle: colorsPrimitive.blue[900],
    muted: colorsPrimitive.blue[800],
  },
  
  // Success/positive
  success: {
    DEFAULT: colorsPrimitive.wakefit['green-light'],
    light: colorsPrimitive.wakefit.green,
    dark: colorsPrimitive.wakefit['green-dark'],
    foreground: colorsPrimitive.wakefit.black,
    subtle: colorsPrimitive.green[900],
    muted: colorsPrimitive.green[800],
  },
  
  // Warning/caution
  warning: {
    DEFAULT: colorsPrimitive.orange[400],
    light: colorsPrimitive.orange[300],
    dark: colorsPrimitive.orange[500],
    foreground: colorsPrimitive.wakefit.black,
    subtle: colorsPrimitive.orange[900],
    muted: colorsPrimitive.orange[800],
  },
  
  // Error/destructive
  danger: {
    DEFAULT: '#F87171',
    light: '#FCA5A5',
    dark: '#EF4444',
    foreground: colorsPrimitive.white,
    subtle: '#7F1D1D',
    muted: '#991B1B',
  },
  
  // Neutral/UI colors
  neutral: {
    50: colorsPrimitive.gray[50],
    100: colorsPrimitive.gray[100],
    200: colorsPrimitive.gray[200],
    300: colorsPrimitive.gray[300],
    400: colorsPrimitive.gray[400],
    500: colorsPrimitive.gray[500],
    600: colorsPrimitive.gray[600],
    700: colorsPrimitive.gray[700],
    800: colorsPrimitive.gray[800],
    900: colorsPrimitive.gray[900],
    950: colorsPrimitive.gray[950],
  },
  
  // Border/divider colors
  border: {
    DEFAULT: colorsPrimitive.gray[700],
    light: colorsPrimitive.gray[800],
    dark: colorsPrimitive.gray[600],
    focus: colorsPrimitive.wakefit['orange-light'],
    error: '#F87171',
  },
  
  // Interactive states
  interactive: {
    hover: colorsPrimitive.gray[800],
    active: colorsPrimitive.gray[700],
    focus: colorsPrimitive.orange[800],
    disabled: colorsPrimitive.gray[800],
  },
  
  // Overlay/backdrop
  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(255, 255, 255, 0.3)',
  },
} as const;

// Combined color tokens for easy access
export const colors = {
  primitive: colorsPrimitive,
  light: colorsLight,
  dark: colorsDark,
} as const;

export type ColorsLight = typeof colorsLight;
export type ColorsDark = typeof colorsDark;

// ============================================================================
// BORDER RADIUS
// Base: 12px (0.75rem), scale from sm to 2xl + full
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.625rem',  // 10px
  lg: '0.75rem',   // 12px (base)
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem',   // 32px
  full: '9999px',
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;

// ============================================================================
// SHADOW SYSTEM (5 levels + special shadows)
// ============================================================================

export const shadows = {
  // Elevation levels
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Component-specific shadows
  card: '0 2px 8px 0 rgb(0 0 0 / 0.08), 0 1px 3px 0 rgb(0 0 0 / 0.05)',
  'card-hover': '0 12px 24px -8px rgb(0 0 0 / 0.12), 0 4px 12px -4px rgb(0 0 0 / 0.08)',
  float: '0 20px 40px -12px rgb(0 0 0 / 0.15)',
  
  // Brand glow shadows
  glow: '0 0 0 1px rgb(255 107 0 / 0.1), 0 4px 12px 0 rgb(255 107 0 / 0.15)',
  'glow-lg': '0 0 0 1px rgb(255 107 0 / 0.1), 0 12px 28px 0 rgb(255 107 0 / 0.2)',
  'glow-blue': '0 0 0 1px rgb(0 102 204 / 0.1), 0 4px 12px 0 rgb(0 102 204 / 0.15)',
  'glow-green': '0 0 0 1px rgb(0 166 81 / 0.1), 0 4px 12px 0 rgb(0 166 81 / 0.15)',
  
  // Focus ring
  focus: '0 0 0 3px rgb(255 107 0 / 0.3)',
  'focus-blue': '0 0 0 3px rgb(0 102 204 / 0.3)',
} as const;

export type ShadowToken = keyof typeof shadows;

// ============================================================================
// ANIMATION DURATIONS
// Standard durations for consistent motion
// ============================================================================

export const durations = {
  instant: '0ms',
  fast: '150ms',
  normal: '300ms',   // Standard transition
  slow: '500ms',
  slower: '700ms',
  carousel: '400ms',  // Carousel/slider transitions
  modal: '200ms',     // Modal enter/exit
  tooltip: '100ms',   // Tooltip show/hide
  dropdown: '150ms',  // Dropdown animations
} as const;

export type DurationToken = keyof typeof durations;

// ============================================================================
// EASING FUNCTIONS
// Standard easings + spring/bounce for delightful motion
// ============================================================================

export const easings = {
  // Standard Material-style easings
  linear: 'linear',
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',     // ease-in-out
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',        // ease-out
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',         // ease-in
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',    // ease-in-out
  
  // Expressive easings
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',  // Spring/bounce
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bouncy
  snappy: 'cubic-bezier(0.2, 0, 0, 1)',         // Quick, responsive
  gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Gentle ease
  
  // Entrance/exit specific
  enter: 'cubic-bezier(0, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

export type EasingToken = keyof typeof easings;

// ============================================================================
// Z-INDEX LAYERS
// Organized layering system for consistent stacking
// ============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
  tooltipHover: 900,
  max: 9999,
} as const;

export type ZIndexToken = keyof typeof zIndex;

// ============================================================================
// BREAKPOINTS (6 breakpoints: sm through 2xl)
// Mobile-first responsive breakpoints
// ============================================================================

export const breakpoints = {
  sm: '640px',   // Small tablets, large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Desktop
  '2xl': '1400px', // Large desktop
  '3xl': '1600px', // Extra large desktop
} as const;

export type BreakpointToken = keyof typeof breakpoints;

// Media query helpers for JS/TS usage
export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  '3xl': `@media (min-width: ${breakpoints['3xl']})`,
  
  // Max-width queries (for desktop-first approach)
  'max-sm': `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  'max-md': `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  'max-lg': `@media (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  'max-xl': `@media (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
  'max-2xl': `@media (max-width: ${parseInt(breakpoints['2xl']) - 1}px)`,
  
  // Reduced motion
  reduceMotion: '@media (prefers-reduced-motion: reduce)',
  
  // Dark mode
  dark: '@media (prefers-color-scheme: dark)',
  
  // High contrast
  highContrast: '@media (prefers-contrast: high)',
  
  // Print
  print: '@media print',
} as const;

export type MediaQueryToken = keyof typeof mediaQueries;

// ============================================================================
// CONTAINER WIDTHS
// Max-width constraints for content containers
// ============================================================================

export const containers = {
  none: 'none',
  xs: '20rem',      // 320px
  sm: '24rem',      // 384px
  md: '28rem',      // 448px
  lg: '32rem',      // 512px
  xl: '36rem',      // 576px
  '2xl': '42rem',   // 672px
  '3xl': '48rem',   // 768px
  '4xl': '56rem',   // 896px
  '5xl': '64rem',   // 1024px
  '6xl': '72rem',   // 1152px
  '7xl': '80rem',   // 1280px
  full: '100%',
  // Wakefit specific
  wakefit: '87.5rem', // 1400px - max container from audit
  screen: '100vw',
} as const;

export type ContainerToken = keyof typeof containers;

// ============================================================================
// OPACITY VALUES
// Standard opacity scale for overlays, disabled states, etc.
// ============================================================================

export const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  25: '0.25',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  75: '0.75',
  80: '0.8',
  90: '0.9',
  95: '0.95',
  100: '1',
} as const;

export type OpacityToken = keyof typeof opacity;

// ============================================================================
// BLUR VALUES
// Backdrop blur and filter blur values
// ============================================================================

export const blur = {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
} as const;

export type BlurToken = keyof typeof blur;

// ============================================================================
// TRANSITION PROPERTIES
// Common transition property combinations
// ============================================================================

export const transitions = {
  all: 'all',
  colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
  opacity: 'opacity',
  shadow: 'box-shadow',
  transform: 'transform',
  'transform-opacity': 'transform, opacity',
  'colors-opacity': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity',
  'colors-shadow': 'color, background-color, border-color, text-decoration-color, fill, stroke, box-shadow',
} as const;

export type TransitionToken = keyof typeof transitions;

// ============================================================================
// COMPOSITE DESIGN TOKENS OBJECT
// Single export for easy importing
// ============================================================================

export const designTokens = {
  spacing,
  fontFamilies,
  fontWeights,
  fontSizes,
  colors,
  borderRadius,
  shadows,
  durations,
  easings,
  zIndex,
  breakpoints,
  mediaQueries,
  containers,
  opacity,
  blur,
  transitions,
} as const;

export type DesignTokens = typeof designTokens;

// ============================================================================
// UTILITY FUNCTIONS
// Helper functions for working with tokens in JS/TS
// ============================================================================

/**
 * Get a spacing value by token name
 */
export function getSpacing(token: SpacingToken): string {
  return spacing[token];
}

/**
 * Get a font size config by token name
 */
export function getFontSize(token: FontSizeToken): typeof fontSizes[FontSizeToken] {
  return fontSizes[token];
}

/**
 * Get a color value by path (e.g., 'primary.DEFAULT', 'neutral.500')
 */
export function getColor(path: string, mode: 'light' | 'dark' = 'light'): string {
  const keys = path.split('.');
  let obj: any = mode === 'light' ? colorsLight : colorsDark;
  
  for (const key of keys) {
    obj = obj?.[key];
    if (obj === undefined) break;
  }
  
  return obj ?? colorsPrimitive.wakefit.orange;
}

/**
 * Get a shadow value by token name
 */
export function getShadow(token: ShadowToken): string {
  return shadows[token];
}

/**
 * Get a breakpoint value by token name
 */
export function getBreakpoint(token: BreakpointToken): string {
  return breakpoints[token];
}

/**
 * Get a container max-width by token name
 */
export function getContainer(token: ContainerToken): string {
  return containers[token];
}

/**
 * Get a duration value by token name
 */
export function getDuration(token: DurationToken): string {
  return durations[token];
}

/**
 * Get an easing value by token name
 */
export function getEasing(token: EasingToken): string {
  return easings[token];
}

/**
 * Get a z-index value by token name
 */
export function getZIndex(token: ZIndexToken): number | string {
  return zIndex[token];
}

/**
 * Get a border radius value by token name
 */
export function getBorderRadius(token: BorderRadiusToken): string {
  return borderRadius[token];
}

/**
 * Create a CSS custom property name from a token path
 */
export function toCSSVar(path: string, prefix = 'wakefit'): string {
  return `--${prefix}-${path.replace(/\./g, '-')}`;
}

/**
 * Create a media query string from a breakpoint token
 */
export function mediaQuery(breakpoint: BreakpointToken, type: 'min' | 'max' = 'min'): string {
  const value = breakpoints[breakpoint];
  return `@media (${type}-width: ${value})`;
}

/**
 * Get fluid font size CSS clamp value
 */
export function getFluidFontSize(token: FontSizeToken): string {
  const config = fontSizes[token];
  return config.fontSize;
}

export default designTokens;