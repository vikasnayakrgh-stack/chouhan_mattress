/**
 * Asset Utilities
 * High-level utilities for asset optimization, preloading, and management
 */

import { 
  getOptimizedImageUrl as cdnGetOptimizedImageUrl, 
  generateBlurPlaceholder as cdnGenerateBlurPlaceholder, 
  generateSrcSet, 
  generateSizes,
  type OptimizedImageUrlOptions,
  type ImageTransformations 
} from '@/lib/assets/cdn'
import { getPresetPlaceholder, type PlaceholderResult } from '@/lib/assets/placeholders'
import { getResponsivePreset, type ResponsiveImageConfig } from '@/lib/assets/responsive'
import { imageKitLoader, loaders, RESPONSIVE_CONFIGS, getImageLoaderResponsiveConfig } from '@/lib/assets/imageLoader'

/**
 * Get optimized image URL with transformations
 * Main utility for generating CDN URLs
 */
export function getOptimizedImageUrl(options: OptimizedImageUrlOptions): string {
  return cdnGetOptimizedImageUrl(options)
}

/**
 * Generate blur placeholder data URL
 * Returns a base64 encoded tiny image for blur effect
 */
export function generateBlurPlaceholder(
  width: number = 10,
  height: number = 10,
  color: string = '#e5e5e5'
): string {
  return cdnGenerateBlurPlaceholder(width, height, color)
}

/**
 * Preload critical assets (fonts, hero images, critical CSS)
 * Returns array of <link> tags for preloading
 * 
 * Usage in layout.tsx:
 * <head>
 *   {preloadCriticalAssets([
 *     { href: '/fonts/poppins.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
 *     { href: getOptimizedImageUrl({ src: '/hero.jpg', transformations: { width: 1920 } }), as: 'image' },
 *   ]).map(link => <link key={link.href} {...link} />)}
 * </head>
 */
export function preloadCriticalAssets(
  assets: Array<{
    href: string
    as: 'image' | 'font' | 'style' | 'script' | 'fetch'
    type?: string
    crossOrigin?: 'anonymous' | 'use-credentials' | ''
    media?: string
  }>
): Array<{
  rel: 'preload' | 'prefetch'
  href: string
  as: string
  type?: string
  crossOrigin?: string
  media?: string
}> {
  return assets.map(asset => ({
    rel: 'preload' as const,
    href: asset.href,
    as: asset.as,
    type: asset.type,
    crossOrigin: asset.crossOrigin,
    media: asset.media,
  }))
}

/**
 * Generate responsive image props for Next.js Image component
 */
export function generateResponsiveImageProps(
  src: string,
  preset: keyof typeof RESPONSIVE_CONFIGS = 'productGrid',
  overrides: Partial<OptimizedImageUrlOptions> = {}
): {
  src: string
  sizes: string
  srcSet?: string
  loader: (props: { src: string; width: number; quality?: number }) => string
  width: number
  height: number
  priority: boolean
  loading: 'lazy' | 'eager'
  placeholder: 'blur' | 'lqip' | 'empty'
  blurDataUrl?: string
  quality?: number
} {
  const config = getResponsivePreset(preset)
  const widths = config.widths || [320, 640, 1024, 1280, 1920]
  const loader = (props: { src: string; width: number; quality?: number }) => 
    getOptimizedImageUrl({
      src,
      transformations: {
        ...overrides.transformations,
        width: props.width,
        quality: props.quality || config.quality,
      },
    })

  return {
    src,
    sizes: config.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    srcSet: generateSrcSet(src, widths, overrides.transformations),
    loader,
    width: config.width || widths[widths.length - 1],
    height: config.height || Math.round((config.width || widths[widths.length - 1]) * 0.75),
    priority: overrides.priority ?? config.priority ?? false,
    loading: overrides.priority ? 'eager' : (config.loading || 'lazy'),
    placeholder: (overrides.placeholder === 'none' || overrides.placeholder === 'dominant-color' ? 'empty' : overrides.placeholder) || config.placeholder || 'blur',
    blurDataUrl: overrides.blurDataUrl || getPresetPlaceholder(
      preset === 'hero' || preset === 'heroTall' ? 'heroBlur' : 'product'
    ).dataUrl,
    quality: config.quality,
  }
}

/**
 * Get placeholder for image by preset
 */
export function getImagePlaceholder(
  preset: 'hero' | 'heroTall' | 'product' | 'category' | 'avatar' | 'thumbnail' | 'dark' | 'skeleton' = 'product'
): PlaceholderResult {
  return getPresetPlaceholder(preset)
}

/**
 * Generate srcset for responsive images
 */
export function generateImageSrcSet(
  src: string,
  widths: number[] = [320, 640, 1024, 1280, 1920],
  transformations: ImageTransformations = {}
): string {
  return generateSrcSet(src, widths, transformations)
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateImageSizes(
  breakpoints: Array<{ maxWidth: number; size: string }> = [
    { maxWidth: 640, size: '100vw' },
    { maxWidth: 1024, size: '50vw' },
    { maxWidth: 1920, size: '33vw' },
  ]
): string {
  return generateSizes(breakpoints)
}

/**
 * Check if element is above fold (client-side only)
 */
export function isElementAboveFold(
  element: HTMLElement,
  threshold: number = 100
): boolean {
  if (typeof window === 'undefined') return false
  const rect = element.getBoundingClientRect()
  return rect.top < window.innerHeight + threshold && rect.bottom > -threshold
}

/**
 * Create intersection observer for lazy loading boundary
 */
export function createUtilLazyLoadObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {
    rootMargin: '100px',
    threshold: 0.01,
  }
): IntersectionObserver | null {
  if (typeof window === 'undefined') return null
  return new IntersectionObserver(callback, options)
}

/**
 * Asset preloading strategies
 */
export const PRELOAD_STRATEGIES = {
  // Preload hero image immediately
  hero: (heroSrc: string) => ({
    href: getOptimizedImageUrl({ src: heroSrc, transformations: { width: 1920, quality: 85 } }),
    as: 'image' as const,
    type: 'image/webp',
  }),
  
  // Preload font
  font: (fontUrl: string, type: 'font/woff2' | 'font/woff' = 'font/woff2') => ({
    href: fontUrl,
    as: 'font' as const,
    type,
    crossOrigin: 'anonymous' as const,
  }),
  
  // Prefetch next page assets
  prefetch: (urls: string[]) => urls.map(url => ({
    rel: 'prefetch' as const,
    href: url,
    as: 'document' as const,
  })),
  
  // Preconnect to CDN
  preconnect: (cdnUrl: string) => ({
    rel: 'preconnect' as const,
    href: cdnUrl,
    crossOrigin: 'anonymous' as const,
  }),
  
  // DNS prefetch
  dnsPrefetch: (domain: string) => ({
    rel: 'dns-prefetch' as const,
    href: domain,
  }),
}

/**
 * Generate all critical asset preload links for layout
 */
export function generateCriticalAssetLinks(config: {
  heroImage?: string
  fonts?: Array<{ url: string; type?: 'font/woff2' | 'font/woff' }>
  cdnUrl?: string
}): Array<React.DetailedHTMLProps<React.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>> {
  const links: Array<React.DetailedHTMLProps<React.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>> = []
  
  // Preconnect to CDN
  if (config.cdnUrl) {
    links.push({
      rel: 'preconnect',
      href: config.cdnUrl,
      crossOrigin: 'anonymous',
    })
    links.push({
      rel: 'dns-prefetch',
      href: config.cdnUrl,
    })
  }
  
  // Preload hero image
  if (config.heroImage) {
    links.push({
      rel: 'preload',
      href: getOptimizedImageUrl({ 
        src: config.heroImage, 
        transformations: { width: 1920, quality: 85, format: 'webp' } 
      }),
      as: 'image',
      type: 'image/webp',
    })
  }
  
  // Preload fonts
  if (config.fonts) {
    config.fonts.forEach(font => {
      links.push({
        rel: 'preload',
        href: font.url,
        as: 'font',
        type: font.type || 'font/woff2',
        crossOrigin: 'anonymous',
      })
    })
  }
  
  return links
}

/**
 * Image optimization presets for different contexts
 */
export const IMAGE_OPTIMIZATION_PRESETS = {
  // Hero/banner images - high quality, responsive
  hero: {
    quality: 85,
    format: 'auto' as const,
    crop: 'fill' as const,
    gravity: 'auto' as const,
  },
  
  // Product images - balanced quality/size
  product: {
    quality: 80,
    format: 'auto' as const,
    crop: 'fill' as const,
    gravity: 'center' as const,
  },
  
  // Thumbnails - smaller, faster
  thumbnail: {
    quality: 70,
    format: 'auto' as const,
    crop: 'fill' as const,
    gravity: 'center' as const,
  },
  
  // Category/grid images
  category: {
    quality: 75,
    format: 'auto' as const,
    crop: 'fill' as const,
    gravity: 'auto' as const,
  },
  
  // Avatar/profile images
  avatar: {
    quality: 80,
    format: 'auto' as const,
    crop: 'thumb' as const,
    gravity: 'face' as const,
    radius: 'max' as const,
  },
  
  // Background images - can be lower quality
  background: {
    quality: 70,
    format: 'auto' as const,
    crop: 'fill' as const,
    gravity: 'center' as const,
  },
  
  // Blur placeholder - very low quality
  blur: {
    quality: 10,
    format: 'auto' as const,
    blur: 50,
    crop: 'fill' as const,
  },
  
  // LQIP placeholder
  lqip: {
    quality: 20,
    format: 'webp' as const,
    crop: 'fill' as const,
    width: 20,
    height: 20,
  },
} as const

/**
 * Get optimization preset by name
 */
export function getImageOptimizationPreset(
  name: keyof typeof IMAGE_OPTIMIZATION_PRESETS
): typeof IMAGE_OPTIMIZATION_PRESETS[keyof typeof IMAGE_OPTIMIZATION_PRESETS] {
  return IMAGE_OPTIMIZATION_PRESETS[name]
}

/**
 * Batch generate optimized URLs for multiple images
 */
export function batchGenerateOptimizedUrls(
  images: Array<{ src: string; preset?: keyof typeof IMAGE_OPTIMIZATION_PRESETS; width?: number }>
): Array<{ original: string; optimized: string }> {
  return images.map(({ src, preset, width }) => {
    const transformations = preset 
      ? { ...IMAGE_OPTIMIZATION_PRESETS[preset], width }
      : { width }
    
    return {
      original: src,
      optimized: getOptimizedImageUrl({ src, transformations }),
    }
  })
}

/**
 * Asset policy validation
 * Ensures only allowed assets are committed to repo
 */
export function validateAssetPolicy(
  filePath: string,
  allowedPatterns: RegExp[] = [
    /^public\/icons\//,
    /^public\/fonts\//,
    /^public\/logo\./,
    /^public\/favicon\./,
    /^public\/apple-touch-icon\./,
    /^public\/manifest\.json/,
    /^public\/robots\.txt/,
    /^public\/sitemap/,
  ]
): boolean {
  return allowedPatterns.some(pattern => pattern.test(filePath))
}

export default {
  getOptimizedImageUrl,
  generateBlurPlaceholder,
  preloadCriticalAssets,
  generateResponsiveImageProps,
  getImagePlaceholder,
  generateImageSrcSet,
  generateImageSizes,
  isElementAboveFold,
  createUtilLazyLoadObserver,
  PRELOAD_STRATEGIES,
  generateCriticalAssetLinks,
  IMAGE_OPTIMIZATION_PRESETS,
  getImageOptimizationPreset,
  batchGenerateOptimizedUrls,
  validateAssetPolicy,
}