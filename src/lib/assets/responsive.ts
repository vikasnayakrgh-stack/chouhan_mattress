/**
 * Responsive Image Sizing & Lazy Loading Configuration
 * Handles srcset/sizes generation, lazy loading boundaries, and priority loading
 */

import { getOptimizedImageUrl, generateSrcSet, generateSizes, type ImageTransformations } from './cdn';

/**
 * Breakpoint definitions matching Tailwind CSS
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Standard image width breakpoints for responsive images
 */
export const IMAGE_WIDTHS = {
  // Mobile-first breakpoints
  mobile: [320, 480, 640],
  tablet: [640, 768, 1024],
  desktop: [1024, 1280, 1536, 1920],
  // Full range for hero images
  hero: [640, 1024, 1280, 1920, 2560, 3840],
  // Product images
  product: [320, 480, 640, 800, 960, 1280],
  // Thumbnails
  thumbnail: [80, 160, 240, 320],
  // Avatars
  avatar: [32, 48, 64, 96, 128],
} as const;

/**
 * Layout types for Next.js Image
 */
export type ImageLayout = 'fixed' | 'intrinsic' | 'responsive' | 'fill';

/**
 * Responsive image configuration
 */
export interface ResponsiveImageConfig {
  // Layout mode
  layout: ImageLayout;
  // Base dimensions (for fixed/intrinsic)
  width?: number;
  height?: number;
  // Aspect ratio (for responsive/fill)
  aspectRatio?: string; // e.g., '16/9', '4/3', '1/1'
  // Sizes attribute
  sizes?: string;
  // Custom widths for srcset
  widths?: readonly number[] | number[];
  // Breakpoint-based sizes
  breakpointSizes?: Record<Breakpoint, string>;
  // Priority loading (above-fold)
  priority?: boolean;
  // Placeholder
  placeholder?: 'blur' | 'lqip' | 'empty';
  // Blur data URL
  blurDataUrl?: string;
  // Loading strategy
  loading?: 'lazy' | 'eager';
  // Quality
  quality?: number;
  // Transformations
  transformations?: ImageTransformations;
}

/**
 * Predefined responsive configurations for common layouts
 */
export const RESPONSIVE_PRESETS: Record<string, ResponsiveImageConfig> = {
  // Full-width hero banner
  hero: {
    layout: 'responsive',
    aspectRatio: '16/9',
    sizes: '100vw',
    widths: IMAGE_WIDTHS.hero,
    priority: true,
    loading: 'eager',
    placeholder: 'blur',
    quality: 85,
    transformations: { crop: 'fill', gravity: 'auto', format: 'auto' },
  },
  // Hero with text overlay (taller)
  heroTall: {
    layout: 'responsive',
    aspectRatio: '21/10',
    sizes: '100vw',
    widths: IMAGE_WIDTHS.hero,
    priority: true,
    loading: 'eager',
    placeholder: 'blur',
    quality: 85,
    transformations: { crop: 'fill', gravity: 'center', format: 'auto' },
  },
  // Product grid (4 cols desktop, 2 tablet, 1 mobile)
  productGrid: {
    layout: 'responsive',
    aspectRatio: '1/1',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw',
    widths: IMAGE_WIDTHS.product,
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 80,
    transformations: { crop: 'fill', gravity: 'center', format: 'auto' },
  },
  // Category grid (6 cols desktop)
  categoryGrid: {
    layout: 'responsive',
    aspectRatio: '4/3',
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw',
    widths: [160, 240, 320, 400, 480],
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 75,
    transformations: { crop: 'fill', gravity: 'auto', format: 'auto' },
  },
  // Thumbnail (fixed small)
  thumbnail: {
    layout: 'fixed',
    width: 80,
    height: 80,
    sizes: '80px',
    widths: IMAGE_WIDTHS.thumbnail,
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 70,
    transformations: { crop: 'fill', gravity: 'center', format: 'auto', radius: 8 },
  },
  // Avatar (circular)
  avatar: {
    layout: 'fixed',
    width: 48,
    height: 48,
    sizes: '48px',
    widths: IMAGE_WIDTHS.avatar,
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 80,
    transformations: { crop: 'thumb', gravity: 'face', radius: 'max', format: 'auto' },
  },
  // Full-width banner
  banner: {
    layout: 'responsive',
    aspectRatio: '21/9',
    sizes: '100vw',
    widths: IMAGE_WIDTHS.hero,
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 80,
    transformations: { crop: 'fill', gravity: 'center', format: 'auto' },
  },
  // Half-width (side by side)
  half: {
    layout: 'responsive',
    aspectRatio: '4/3',
    sizes: '(max-width: 768px) 100vw, 50vw',
    widths: IMAGE_WIDTHS.product,
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 80,
    transformations: { crop: 'fill', gravity: 'center', format: 'auto' },
  },
  // Third-width (3 columns)
  third: {
    layout: 'responsive',
    aspectRatio: '4/3',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    widths: [320, 480, 640, 800],
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 80,
    transformations: { crop: 'fill', gravity: 'center', format: 'auto' },
  },
  // Quarter-width (4 columns)
  quarter: {
    layout: 'responsive',
    aspectRatio: '1/1',
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
    widths: [240, 320, 400, 480],
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 75,
    transformations: { crop: 'fill', gravity: 'center', format: 'auto' },
  },
  // Fill container (parent has relative positioning)
  fill: {
    layout: 'fill',
    aspectRatio: '16/9',
    sizes: '100vw',
    widths: IMAGE_WIDTHS.hero,
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 80,
    transformations: { crop: 'fill', gravity: 'center', format: 'auto' },
  },
  // Intrinsic (maintains aspect ratio, scales down)
  intrinsic: {
    layout: 'intrinsic',
    aspectRatio: '4/3',
    sizes: '100vw',
    widths: IMAGE_WIDTHS.product,
    priority: false,
    loading: 'lazy',
    placeholder: 'blur',
    quality: 80,
    transformations: { crop: 'fill', gravity: 'center', format: 'auto' },
  },
};

/**
 * Get a responsive preset by name
 */
export function getResponsivePreset(name: keyof typeof RESPONSIVE_PRESETS): ResponsiveImageConfig {
  return RESPONSIVE_PRESETS[name] || RESPONSIVE_PRESETS.productGrid;
}

/**
 * Generate complete Next.js Image props from responsive config
 */
export function generateImageProps(
  src: string,
  config: ResponsiveImageConfig,
  alt: string = ''
): React.ComponentProps<'img'> & { 
  src: string;
  alt: string;
  loader?: (props: { src: string; width: number; quality?: number }) => string;
  layout?: ImageLayout;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'lqip' | 'empty';
  blurDataUrl?: string;
  loading?: 'lazy' | 'eager';
  quality?: number;
  style?: React.CSSProperties;
} {
  const { 
    layout, 
    width, 
    height, 
    aspectRatio, 
    sizes, 
    widths, 
    breakpointSizes,
    priority = false,
    placeholder = 'blur',
    blurDataUrl,
    loading = 'lazy',
    quality,
    transformations = {},
  } = config;
  
  // Generate srcset if widths provided
  let srcSet: string | undefined;
  if (widths && widths.length > 0) {
    srcSet = generateSrcSet(src, widths, transformations);
  }
  
  // Generate sizes from breakpoints if provided
  let finalSizes = sizes;
  if (breakpointSizes && !sizes) {
    finalSizes = Object.entries(breakpointSizes)
      .map(([bp, size]) => `(max-width: ${BREAKPOINTS[bp as Breakpoint]}px) ${size}`)
      .join(', ') + `, ${Object.values(breakpointSizes).pop()}`;
  }
  
  // Calculate dimensions from aspect ratio if not provided
  let finalWidth = width;
  let finalHeight = height;
  
  if (aspectRatio && !width && !height) {
    const [w, h] = aspectRatio.split('/').map(Number);
    if (layout === 'responsive' || layout === 'fill') {
      // For responsive, use a reasonable base width
      finalWidth = widths?.[1] || 800;
      finalHeight = Math.round(finalWidth * h / w);
    } else {
      finalWidth = 800;
      finalHeight = Math.round(finalWidth * h / w);
    }
  }
  
  // Generate blur data URL if not provided and placeholder is blur
  let finalBlurDataUrl = blurDataUrl;
  if (placeholder === 'blur' && !finalBlurDataUrl) {
    // This would be generated server-side ideally
    // For now, use a minimal placeholder
    finalBlurDataUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDEwIDEwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTU1Ii8+PC9zdmc+';
  }
  
  // Build style object for fill layout
  let style: React.CSSProperties | undefined;
  if (layout === 'fill') {
    style = {
      objectFit: 'cover',
      objectPosition: 'center',
      width: '100%',
      height: '100%',
    };
  }
  
  return {
    src,
    alt,
    layout,
    width: finalWidth,
    height: finalHeight,
    sizes: finalSizes,
    priority,
    placeholder,
    blurDataUrl: finalBlurDataUrl,
    loading,
    quality: quality || 80,
    style,
    // Custom loader function (would be set in next.config.js)
    // loader: imageKitLoader,
  };
}

/**
 * Lazy loading boundary configuration
 */
export interface LazyLoadConfig {
  // Root margin for IntersectionObserver (how early to start loading)
  rootMargin: string;
  // Threshold for triggering load
  threshold: number | number[];
  // Whether to use native lazy loading
  native: boolean;
  // Fallback for browsers without IntersectionObserver
  fallback: 'eager' | 'lazy';
}

/**
 * Default lazy loading configuration
 */
export const DEFAULT_LAZY_LOAD_CONFIG: LazyLoadConfig = {
  rootMargin: '200px', // Start loading 200px before viewport
  threshold: 0.01,
  native: true,
  fallback: 'lazy',
};

/**
 * Lazy loading configs for different image types
 */
export const LAZY_LOAD_PRESETS: Record<string, LazyLoadConfig> = {
  // Hero/above-fold - load eagerly
  eager: {
    rootMargin: '0px',
    threshold: 1,
    native: false,
    fallback: 'eager',
  },
  // Standard lazy loading
  standard: {
    rootMargin: '200px',
    threshold: 0.01,
    native: true,
    fallback: 'lazy',
  },
  // Aggressive lazy loading (further from viewport)
  aggressive: {
    rootMargin: '500px',
    threshold: 0.01,
    native: true,
    fallback: 'lazy',
  },
  // Conservative (only when near viewport)
  conservative: {
    rootMargin: '50px',
    threshold: 0.1,
    native: true,
    fallback: 'lazy',
  },
};

/**
 * Check if element is in viewport (for priority detection)
 */
export function isInViewport(
  element: HTMLElement,
  offset: number = 0
): boolean {
  if (typeof window === 'undefined') return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  );
}

/**
 * Check if element is above fold (in initial viewport)
 */
export function isResponsiveAboveFold(
  element: HTMLElement,
  threshold: number = 100
): boolean {
  if (typeof window === 'undefined') return false;
  
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight + threshold && rect.bottom > -threshold;
}

/**
 * Create IntersectionObserver for lazy loading
 */
export function createResponsiveLazyLoadObserver(
  callback: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void,
  config: Partial<LazyLoadConfig> = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;
  
  const { rootMargin, threshold } = { ...DEFAULT_LAZY_LOAD_CONFIG, ...config };
  
  return new IntersectionObserver(callback, {
    rootMargin,
    threshold,
  });
}

/**
 * Priority image detection - finds images that should load eagerly
 */
export function detectPriorityImages(
  container: HTMLElement = document.body,
  selector: string = 'img[data-priority], img[loading="eager"]'
): HTMLElement[] {
  if (typeof window === 'undefined') return [];
  
  const images = container.querySelectorAll<HTMLImageElement>(selector);
  return Array.from(images).filter(img => isResponsiveAboveFold(img));
}

/**
 * Generate preload links for critical images
 */
export function generatePreloadLinks(
  images: Array<{ src: string; as: 'image'; type?: string; sizes?: string }>
): string[] {
  return images.map(img => {
    let link = `<link rel="preload" href="${img.src}" as="${img.as}"`;
    if (img.type) link += ` type="${img.type}"`;
    if (img.sizes) link += ` sizes="${img.sizes}"`;
    link += ' />';
    return link;
  });
}

/**
 * Responsive image component props generator
 * Use this in components to get consistent image props
 */
export function useResponsiveImage(
  src: string,
  preset: keyof typeof RESPONSIVE_PRESETS = 'productGrid',
  overrides: Partial<ResponsiveImageConfig> = {}
) {
  const config = { ...RESPONSIVE_PRESETS[preset], ...overrides };
  return generateImageProps(src, config);
}

/**
 * Picture element sources generator for art direction
 */
export interface PictureSource {
  media: string;
  srcset: string;
  sizes?: string;
  type?: string;
}

export function generatePictureSources(
  src: string,
  breakpoints: Array<{ media: string; widths: readonly number[] | number[]; transformations?: ImageTransformations }>
): PictureSource[] {
  return breakpoints.map(bp => ({
    media: bp.media,
    srcset: generateSrcSet(src, bp.widths, bp.transformations),
    type: bp.transformations?.format === 'avif' ? 'image/avif' : 
          bp.transformations?.format === 'webp' ? 'image/webp' : undefined,
  }));
}

/**
 * Art direction configuration for picture element
 */
export const ART_DIRECTION_PRESETS: Record<string, Array<{ media: string; widths: number[]; transformations?: ImageTransformations }>> = {
  hero: [
    { media: '(max-width: 640px)', widths: [640, 750], transformations: { crop: 'fill', gravity: 'center', aspectRatio: '4/3' } },
    { media: '(max-width: 1024px)', widths: [1024, 1280], transformations: { crop: 'fill', gravity: 'center', aspectRatio: '16/9' } },
    { media: '(min-width: 1025px)', widths: [1920, 2560, 3840], transformations: { crop: 'fill', gravity: 'center', aspectRatio: '21/9' } },
  ],
  product: [
    { media: '(max-width: 640px)', widths: [320, 480, 640], transformations: { crop: 'fill', gravity: 'center', aspectRatio: '1/1' } },
    { media: '(max-width: 1024px)', widths: [640, 800], transformations: { crop: 'fill', gravity: 'center', aspectRatio: '4/3' } },
    { media: '(min-width: 1025px)', widths: [960, 1280], transformations: { crop: 'fill', gravity: 'center', aspectRatio: '1/1' } },
  ],
};

export default {
  BREAKPOINTS,
  IMAGE_WIDTHS,
  RESPONSIVE_PRESETS,
  getResponsivePreset,
  generateImageProps,
  DEFAULT_LAZY_LOAD_CONFIG,
  LAZY_LOAD_PRESETS,
  isInViewport,
  isResponsiveAboveFold,
  createResponsiveLazyLoadObserver,
  detectPriorityImages,
  generatePreloadLinks,
  useResponsiveImage,
  generatePictureSources,
  ART_DIRECTION_PRESETS,
};