/**
 * Image Optimization Defaults and Utilities
 * 
 * Wakefit uses: ImageKit CDN, native lazy loading, next/font with swap
 * This adds: WebP/AVIF support, blur placeholders, responsive images, 
 * service worker caching, edge caching headers, priority loading strategies
 */

import { ImageProps } from 'next/image';

/**
 * Supported image formats in order of preference
 */
export type ImageFormat = 'avif' | 'webp' | 'jpg' | 'png' | 'gif' | 'svg';

/**
 * Image quality presets
 */
export type ImageQuality = 'low' | 'medium' | 'high' | 'lossless' | number;

/**
 * Image priority levels for loading strategy
 */
export type ImagePriority = 'high' | 'low' | 'auto';

/**
 * Blur placeholder configuration
 */
export interface BlurPlaceholderConfig {
  /** Base64 encoded blur data URL */
  dataURL?: string;
  /** Width of blur placeholder */
  width?: number;
  /** Height of blur placeholder */
  height?: number;
  /** Blur intensity (1-100) */
  intensity?: number;
}

/**
 * Responsive image breakpoint configuration
 */
export interface ResponsiveBreakpoints {
  /** Mobile breakpoint (default: 640px) */
  mobile: number;
  /** Tablet breakpoint (default: 768px) */
  tablet: number;
  /** Desktop breakpoint (default: 1024px) */
  desktop: number;
  /** Large desktop breakpoint (default: 1280px) */
  large: number;
  /** Extra large breakpoint (default: 1536px) */
  xlarge: number;
}

/**
 * Image optimization configuration
 */
export interface ImageOptimizationConfig {
  /** Default formats to serve (in priority order) */
  formats: ImageFormat[];
  /** Default quality (1-100 or preset) */
  quality: ImageQuality;
  /** Default loading strategy */
  loading: 'lazy' | 'eager';
  /** Default priority */
  priority: ImagePriority;
  /** Blur placeholder configuration */
  blurPlaceholder: BlurPlaceholderConfig;
  /** Responsive breakpoints */
  breakpoints: ResponsiveBreakpoints;
  /** Enable AVIF support */
  avif: boolean;
  /** Enable WebP support */
  webp: boolean;
  /** Maximum image width */
  maxWidth: number;
  /** Maximum image height */
  maxHeight: number;
  /** Device sizes for srcset */
  deviceSizes: number[];
  /** Image sizes for srcset */
  imageSizes: number[];
  /** Minimum cache TTL (seconds) */
  minimumCacheTTL: number;
  /** Enable placeholder blur */
  placeholder: 'blur' | 'empty' | 'none';
  /** Enable lazy loading by default */
  lazyByDefault: boolean;
  /** LQIP (Low Quality Image Placeholder) threshold */
  lqipThreshold: number;
  /** ImageKit transformation parameters */
  imageKit?: ImageKitConfig;
}

/**
 * ImageKit CDN configuration (Wakefit's CDN)
 */
export interface ImageKitConfig {
  /** ImageKit URL endpoint */
  urlEndpoint: string;
  /** Public API key */
  publicKey: string;
  /** Authentication endpoint for signed URLs */
  authEndpoint?: string;
  /** Default transformation parameters */
  defaultTransformations: ImageKitTransformations;
  /** Path prefix for all images */
  pathPrefix?: string;
}

/**
 * ImageKit transformation parameters
 */
export interface ImageKitTransformations {
  /** Width in pixels */
  w?: number | 'auto';
  /** Height in pixels */
  h?: number | 'auto';
  /** Aspect ratio (w:h) */
  ar?: string;
  /** Quality (1-100) */
  q?: number | 'auto';
  /** Format */
  f?: ImageFormat | 'auto';
  /** Crop mode */
  c?: 'at_max' | 'at_least' | 'fill' | 'extract' | 'pad' | 'crop' | 'thumbnail';
  /** Focus area for crop */
  fo?: 'auto' | 'center' | 'top' | 'left' | 'bottom' | 'right' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'face' | 'faces';
  /** Background color for padding */
  bg?: string;
  /** Blur radius */
  bl?: number;
  /** Sharpen */
  sh?: number;
  /** Progressive JPEG */
  pr?: boolean;
  /** Lossless compression */
  lo?: boolean;
  /** Metadata stripping */
  st?: boolean;
  /** Overlay image */
  oi?: string;
  /** Overlay position */
  op?: string;
  /** Overlay width */
  ow?: number;
  /** Overlay height */
  oh?: number;
  /** Text overlay */
  tx?: string;
  /** Text color */
  tc?: string;
  /** Text size */
  ts?: number;
  /** Text font */
  tf?: string;
}

/**
 * Wakefit-specific image categories with optimized settings
 */
export type ImageCategory = 
  | 'hero'          // Large hero banners - high priority, high quality
  | 'product'       // Product images - medium priority, high quality
  | 'thumbnail'     // Small thumbnails - low priority, lower quality
  | 'category'      // Category banners - medium priority
  | 'logo'          // Logos - high priority, lossless
  | 'icon'          // Icons - low priority, SVG preferred
  | 'banner'        // Promotional banners - high priority
  | 'avatar'        // User avatars - low priority
  | 'gallery'       // Gallery images - lazy, medium quality
  | 'background';   // Background images - lazy, optimized

/**
 * Category-specific optimization presets
 */
export interface CategoryPreset {
  quality: ImageQuality;
  priority: ImagePriority;
  loading: 'lazy' | 'eager';
  formats: ImageFormat[];
  sizes: string; // CSS sizes attribute
  placeholder: 'blur' | 'empty';
  blurIntensity?: number;
  width?: number;
  height?: number;
  aspectRatio?: string;
}

/**
 * Default image optimization configuration for Wakefit
 */
export const defaultImageConfig: ImageOptimizationConfig = {
  formats: ['avif', 'webp', 'jpg'],
  quality: 85,
  loading: 'lazy',
  priority: 'auto',
  blurPlaceholder: {
    width: 10,
    height: 10,
    intensity: 20,
  },
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    large: 1280,
    xlarge: 1536,
  },
  avif: true,
  webp: true,
  maxWidth: 2560,
  maxHeight: 2560,
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 768, 1024, 1536],
  minimumCacheTTL: 31536000, // 1 year
  placeholder: 'blur',
  lazyByDefault: true,
  lqipThreshold: 5000, // bytes
  imageKit: {
    urlEndpoint: 'https://ik.imagekit.io/wakefit',
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
    defaultTransformations: {
      f: 'auto',
      q: 'auto',
      pr: true,
      st: true,
    },
  },
};

/**
 * Category-specific optimization presets
 */
export const categoryPresets: Record<ImageCategory, CategoryPreset> = {
  hero: {
    quality: 90,
    priority: 'high',
    loading: 'eager',
    formats: ['avif', 'webp', 'jpg'],
    sizes: '100vw',
    placeholder: 'blur',
    blurIntensity: 30,
    width: 1920,
    height: 1080,
    aspectRatio: '16/9',
  },
  product: {
    quality: 85,
    priority: 'high',
    loading: 'eager',
    formats: ['avif', 'webp', 'jpg'],
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    placeholder: 'blur',
    blurIntensity: 20,
    width: 800,
    height: 800,
    aspectRatio: '1/1',
  },
  thumbnail: {
    quality: 70,
    priority: 'low',
    loading: 'lazy',
    formats: ['webp', 'jpg'],
    sizes: '150px',
    placeholder: 'empty',
    width: 150,
    height: 150,
    aspectRatio: '1/1',
  },
  category: {
    quality: 80,
    priority: 'high',
    loading: 'eager',
    formats: ['avif', 'webp', 'jpg'],
    sizes: '(max-width: 768px) 100vw, 50vw',
    placeholder: 'blur',
    blurIntensity: 25,
    width: 600,
    height: 400,
    aspectRatio: '3/2',
  },
  logo: {
    quality: 'lossless',
    priority: 'high',
    loading: 'eager',
    formats: ['svg', 'webp', 'png'],
    sizes: 'auto',
    placeholder: 'empty',
    width: 200,
    height: 80,
  },
  icon: {
    quality: 'lossless',
    priority: 'low',
    loading: 'lazy',
    formats: ['svg', 'webp'],
    sizes: '24px',
    placeholder: 'empty',
    width: 24,
    height: 24,
  },
  banner: {
    quality: 85,
    priority: 'high',
    loading: 'eager',
    formats: ['avif', 'webp', 'jpg'],
    sizes: '100vw',
    placeholder: 'blur',
    blurIntensity: 25,
    width: 1440,
    height: 600,
    aspectRatio: '12/5',
  },
  avatar: {
    quality: 80,
    priority: 'low',
    loading: 'lazy',
    formats: ['webp', 'jpg'],
    sizes: '48px',
    placeholder: 'empty',
    width: 48,
    height: 48,
    aspectRatio: '1/1',
  },
  gallery: {
    quality: 80,
    priority: 'low',
    loading: 'lazy',
    formats: ['avif', 'webp', 'jpg'],
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    placeholder: 'blur',
    blurIntensity: 15,
    width: 800,
    height: 600,
    aspectRatio: '4/3',
  },
  background: {
    quality: 75,
    priority: 'low',
    loading: 'lazy',
    formats: ['avif', 'webp', 'jpg'],
    sizes: '100vw',
    placeholder: 'blur',
    blurIntensity: 40,
    width: 1920,
    height: 1080,
    aspectRatio: '16/9',
  },
};

/**
 * Generate Next.js Image component props for a category
 */
export function getImageProps(
  category: ImageCategory,
  src: string,
  alt: string,
  overrides: Partial<ImageProps> = {}
): ImageProps {
  const preset = categoryPresets[category];
  const config = defaultImageConfig;
  
  // Generate blur data URL if needed
  let blurDataURL: string | undefined;
  if (preset.placeholder === 'blur' && preset.blurIntensity) {
    blurDataURL = generateBlurDataURL(preset.width || 10, preset.height || 10, preset.blurIntensity);
  }
  
  // Build sizes attribute
  const sizes = preset.sizes;
  
  return {
    src,
    alt,
    width: preset.width,
    height: preset.height,
    quality: typeof preset.quality === 'number' ? preset.quality : 85,
    priority: preset.priority === 'high',
    loading: preset.loading,
    placeholder: preset.placeholder,
    blurDataURL,
    sizes,
    style: {
      aspectRatio: preset.aspectRatio,
      ...overrides.style,
    },
    ...overrides,
  };
}

/**
 * Generate a base64 blur data URL
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10,
  intensity: number = 20
): string {
  // Create a simple SVG blur placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <filter id="b" x="-${intensity}%" y="-${intensity}%" width="${100 + intensity * 2}%" height="${100 + intensity * 2}%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${intensity / 10}"/>
      </filter>
      <rect width="100%" height="100%" fill="#e5e7eb" filter="url(#b)"/>
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate responsive sizes attribute from breakpoints
 */
export function generateSizesAttribute(
  breakpoints: ResponsiveBreakpoints,
  columns: number = 1
): string {
  const { mobile, tablet, desktop, large, xlarge } = breakpoints;
  const colWidth = 100 / columns;
  
  return `
    (max-width: ${mobile}px) ${colWidth * columns}vw,
    (max-width: ${tablet}px) ${colWidth * Math.min(columns, 2)}vw,
    (max-width: ${desktop}px) ${colWidth * Math.min(columns, 3)}vw,
    (max-width: ${large}px) ${colWidth * Math.min(columns, 4)}vw,
    ${colWidth * Math.min(columns, 5)}vw
  `.replace(/\s+/g, ' ').trim();
}

/**
 * ImageKit URL builder with transformations
 */
export function buildImageKitURL(
  src: string,
  transformations: ImageKitTransformations = {},
  config: ImageKitConfig = defaultImageConfig.imageKit!
): string {
  const { urlEndpoint, defaultTransformations, pathPrefix = '' } = config;
  
  // Merge transformations with defaults
  const mergedTransformations = {
    ...defaultTransformations,
    ...transformations,
  };
  
  // Build transformation string
  const transformationParams = Object.entries(mergedTransformations)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}-${value}`)
    .join('/');
  
  const transformationString = transformationParams ? `tr:${transformationParams}/` : '';
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  const fullPath = pathPrefix ? `${pathPrefix}/${cleanSrc}` : cleanSrc;
  
  return `${urlEndpoint}/${transformationString}${fullPath}`;
}

/**
 * Generate srcset for responsive images using ImageKit
 */
export function generateImageKitSrcSet(
  src: string,
  widths: number[],
  transformations: ImageKitTransformations = {},
  config: ImageKitConfig = defaultImageConfig.imageKit!
): string {
  return widths
    .map((width) => {
      const url = buildImageKitURL(src, { ...transformations, w: width }, config);
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalFormat(
  acceptHeader: string,
  config: ImageOptimizationConfig = defaultImageConfig
): ImageFormat {
  if (config.avif && acceptHeader.includes('image/avif')) {
    return 'avif';
  }
  if (config.webp && acceptHeader.includes('image/webp')) {
    return 'webp';
  }
  return 'jpg';
}

/**
 * Image loading strategy for different scenarios
 */
export const loadingStrategies = {
  // Above the fold - eager load with high priority
  aboveFold: {
    priority: true,
    loading: 'eager' as const,
    placeholder: 'blur' as const,
  },
  
  // Below the fold - lazy load
  belowFold: {
    priority: false,
    loading: 'lazy' as const,
    placeholder: 'blur' as const,
  },
  
  // Hero images - highest priority
  hero: {
    priority: true,
    loading: 'eager' as const,
    placeholder: 'blur' as const,
    quality: 90,
  },
  
  // Product images - high priority for first, lazy for rest
  product: (index: number) => index === 0
    ? { priority: true, loading: 'eager' as const, placeholder: 'blur' as const }
    : { priority: false, loading: 'lazy' as const, placeholder: 'blur' as const },
  
  // Thumbnails - always lazy
  thumbnail: {
    priority: false,
    loading: 'lazy' as const,
    placeholder: 'empty' as const,
    quality: 70,
  },
  
  // Background images - lazy with low quality placeholder
  background: {
    priority: false,
    loading: 'lazy' as const,
    placeholder: 'blur' as const,
    quality: 75,
  },
};

/**
 * Preload critical images
 */
export function generateImagePreloadLinks(
  images: Array<{ src: string; as: 'image'; type?: string }>
): string[] {
  return images.map(({ src, as, type }) => 
    `<link rel="preload" as="${as}" href="${src}"${type ? ` type="${type}"` : ''}>`
  );
}

/**
 * Service Worker caching strategy for images
 */
export const imageCacheStrategy = {
  // Cache static assets for 1 year
  static: {
    maxAgeSeconds: 31536000,
    staleWhileRevalidate: 86400,
  },
  // Cache optimized images for 1 year
  optimized: {
    maxAgeSeconds: 31536000,
    staleWhileRevalidate: 86400,
  },
  // Cache placeholders for 1 day
  placeholder: {
    maxAgeSeconds: 86400,
    staleWhileRevalidate: 3600,
  },
  // No cache for dynamic images
  dynamic: {
    maxAgeSeconds: 0,
    mustRevalidate: true,
  },
};

/**
 * Next.js Image component configuration
 * Add to next.config.mjs
 */
export const nextImageConfig = {
  loader: 'custom',
  loaderFile: './src/lib/image-loader.ts',
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 768, 1024, 1536],
  minimumCacheTTL: 31536000,
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'ik.imagekit.io',
      port: '',
      pathname: '/wakefit/**',
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      port: '',
      pathname: '/**',
    },
  ],
  qualities: [25, 50, 75, 85, 90, 100],
};

/**
 * LQIP (Low Quality Image Placeholder) generator
 * Generates tiny base64 encoded images for blur placeholders
 */
export async function generateLQIP(
  buffer: Buffer,
  width: number = 20,
  quality: number = 10
): Promise<string> {
  // This would typically use sharp or similar
  // For now, return a generic placeholder
  return generateBlurDataURL(width, width, 20);
}

/**
 * Image optimization metrics tracking
 */
export interface ImageMetrics {
  originalSize: number;
  optimizedSize: number;
  savingsPercent: number;
  format: ImageFormat;
  width: number;
  height: number;
  loadTime: number;
  lcpContribution?: number;
}

/**
 * Calculate image optimization savings
 */
export function calculateImageSavings(
  originalSize: number,
  optimizedSize: number
): { savings: number; savingsPercent: number } {
  const savings = originalSize - optimizedSize;
  const savingsPercent = (savings / originalSize) * 100;
  return { savings, savingsPercent };
}

export default {
  defaultImageConfig,
  categoryPresets,
  getImageProps,
  generateBlurDataURL,
  generateSizesAttribute,
  buildImageKitURL,
  generateImageKitSrcSet,
  getOptimalFormat,
  loadingStrategies,
  generateImagePreloadLinks,
  imageCacheStrategy,
  nextImageConfig,
  generateLQIP,
  calculateImageSavings,
};