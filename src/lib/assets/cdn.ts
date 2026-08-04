/**
 * CDN Abstraction Layer
 * Abstracts ImageKit (ik.imagekit.io) and provides a generic CDN interface
 * for easy provider switching (Cloudinary, CloudFront, Imgix, etc.)
 */

export type CDNProvider = 'imagekit' | 'cloudinary' | 'cloudfront' | 'imgix' | 'custom';

export interface CDNConfig {
  provider: CDNProvider;
  baseUrl: string;
  // Provider-specific config
  imageKit?: {
    urlEndpoint: string; // e.g., 'https://ik.imagekit.io/your-id'
    publicKey?: string;
    privateKey?: string; // Server-side only
  };
  cloudinary?: {
    cloudName: string;
    apiKey?: string;
    apiSecret?: string;
  };
  cloudfront?: {
    distributionDomain: string; // e.g., 'd12345.cloudfront.net'
    keyPairId?: string;
    privateKey?: string;
  };
  imgix?: {
    domain: string; // e.g., 'my-images.imgix.net'
    token?: string;
  };
  custom?: {
    transformFn: (url: string, transformations: ImageTransformations) => string;
  };
}

export interface ImageTransformations {
  // Dimensions
  width?: number;
  height?: number;
  aspectRatio?: string; // e.g., '16:9', '4:3', '1:1'
  
  // Resize modes
  crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop' | 'extract' | 'pad';
  focus?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'auto';
  gravity?: 'auto' | 'face' | 'faces' | 'center' | 'top' | 'bottom' | 'left' | 'right';
  
  // Quality & Format
  quality?: number | 'auto'; // 1-100 or 'auto'
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png' | 'gif' | 'heic';
  progressive?: boolean;
  lossless?: boolean;
  
  // Effects
  blur?: number; // 1-100 or 1-2000 (provider dependent)
  brightness?: number; // -100 to 100
  contrast?: number; // -100 to 100
  saturation?: number; // -100 to 100
  sharpen?: number | 'auto';
  grayscale?: boolean;
  sepia?: boolean;
  vignette?: number;
  auto?: boolean;
  
  // Overlays & Watermarks
  overlay?: {
    image?: string; // Public ID or URL
    text?: string;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    opacity?: number;
    position?: 'top_left' | 'top' | 'top_right' | 'left' | 'center' | 'right' | 'bottom_left' | 'bottom' | 'bottom_right';
    offsetX?: number;
    offsetY?: number;
    width?: number;
    height?: number;
  };
  
  // Border & Radius
  border?: {
    width: number;
    color: string;
    radius?: number;
  };
  radius?: number | 'max';
  
  // Rotation & Flip
  rotate?: number | 'auto';
  flip?: 'h' | 'v' | 'both';
  
  // Background (for padding)
  background?: string; // hex, rgb, or 'auto'
  
  // Advanced
  dpr?: number | 'auto'; // Device pixel ratio
  defaultImage?: string; // Fallback image
  
  // Provider-specific passthrough
  rawTransformations?: Record<string, string | number | boolean>;
}

export interface OptimizedImageUrlOptions {
  src: string; // Original image path or full URL
  transformations?: ImageTransformations;
  // Priority hint for above-fold images
  priority?: boolean;
  // Placeholder options
  placeholder?: 'blur' | 'lqip' | 'dominant-color' | 'none';
  blurDataUrl?: string;
  // Responsive sizing
  sizes?: string; // e.g., '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  widths?: number[]; // e.g., [320, 640, 960, 1280, 1920]
}

// Default configuration - ImageKit as default provider
const defaultConfig: CDNConfig = {
  provider: 'imagekit',
  baseUrl: 'https://ik.imagekit.io',
  imageKit: {
    urlEndpoint: 'https://ik.imagekit.io/wakefit', // Replace with your ImageKit URL endpoint
  },
};

// Current config (can be overridden at runtime)
let currentConfig: CDNConfig = { ...defaultConfig };

/**
 * Configure the CDN provider at runtime (e.g., from env vars)
 */
export function configureCDN(config: Partial<CDNConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Get current CDN configuration
 */
export function getCDNConfig(): CDNConfig {
  return currentConfig;
}

/**
 * Build optimized image URL using the configured CDN provider
 */
export function getOptimizedImageUrl(options: OptimizedImageUrlOptions): string {
  const { src, transformations = {}, priority = false } = options;
  
  // If src is a local path (starts with / or data:), return it directly
  if (src.startsWith('/') || src.startsWith('data:')) {
    return src;
  }
  
  // If src is already a full URL, use it as base
  const isFullUrl = src.startsWith('http://') || src.startsWith('https://');
  const baseSrc = isFullUrl ? src : `${currentConfig.baseUrl}/${src.replace(/^\//, '')}`;
  
  switch (currentConfig.provider) {
    case 'imagekit':
      return buildImageKitUrl(baseSrc, transformations, priority);
    case 'cloudinary':
      return buildCloudinaryUrl(baseSrc, transformations);
    case 'cloudfront':
      return buildCloudFrontUrl(baseSrc, transformations);
    case 'imgix':
      return buildImgixUrl(baseSrc, transformations);
    case 'custom':
      return currentConfig.custom?.transformFn(baseSrc, transformations) ?? baseSrc;
    default:
      return baseSrc;
  }
}

/**
 * Build ImageKit URL with transformations
 * Format: https://ik.imagekit.io/{id}/{transformations}/{path}?{query}
 */
function buildImageKitUrl(baseSrc: string, transformations: ImageTransformations, priority: boolean): string {
  const { urlEndpoint } = currentConfig.imageKit || {};
  if (!urlEndpoint) return baseSrc;
  
  // Extract path from baseSrc if it's a full URL
  let path = baseSrc;
  if (baseSrc.includes(urlEndpoint)) {
    path = baseSrc.replace(urlEndpoint + '/', '');
  }
  
  const tr: string[] = [];
  
  // Dimensions
  if (transformations.width) tr.push(`w-${transformations.width}`);
  if (transformations.height) tr.push(`h-${transformations.height}`);
  if (transformations.aspectRatio) tr.push(`ar-${transformations.aspectRatio.replace(':', '-')}`);
  
  // Crop/Resize mode
  if (transformations.crop) tr.push(`c-${transformations.crop}`);
  if (transformations.focus) tr.push(`fo-${transformations.focus}`);
  if (transformations.gravity) tr.push(`g-${transformations.gravity}`);
  
  // Quality & Format
  if (transformations.quality !== undefined) {
    tr.push(`q-${transformations.quality === 'auto' ? 'auto' : transformations.quality}`);
  }
  if (transformations.format) tr.push(`f-${transformations.format}`);
  if (transformations.progressive) tr.push('pr-true');
  if (transformations.lossless) tr.push('lo-true');
  
  // Effects
  if (transformations.blur) tr.push(`bl-${transformations.blur}`);
  if (transformations.brightness) tr.push(`b-${transformations.brightness}`);
  if (transformations.contrast) tr.push(`co-${transformations.contrast}`);
  if (transformations.saturation) tr.push(`s-${transformations.saturation}`);
  if (transformations.sharpen) tr.push(`sh-${transformations.sharpen === 'auto' ? 'auto' : transformations.sharpen}`);
  if (transformations.grayscale) tr.push('e-grayscale');
  if (transformations.sepia) tr.push('e-sepia');
  if (transformations.vignette) tr.push(`vi-${transformations.vignette}`);
  
  // Overlay
  if (transformations.overlay) {
    const overlay = transformations.overlay;
    if (overlay.image) tr.push(`oi-${encodeURIComponent(overlay.image)}`);
    if (overlay.text) tr.push(`ot-${encodeURIComponent(overlay.text)}`);
    if (overlay.fontFamily) tr.push(`of-${overlay.fontFamily}`);
    if (overlay.fontSize) tr.push(`ofs-${overlay.fontSize}`);
    if (overlay.fontWeight) tr.push(`ofw-${overlay.fontWeight}`);
    if (overlay.color) tr.push(`oc-${overlay.color.replace('#', '')}`);
    if (overlay.opacity) tr.push(`oo-${overlay.opacity * 100}`);
    if (overlay.position) tr.push(`op-${overlay.position.replace('_', '-')}`);
    if (overlay.offsetX) tr.push(`ox-${overlay.offsetX}`);
    if (overlay.offsetY) tr.push(`oy-${overlay.offsetY}`);
    if (overlay.width) tr.push(`ow-${overlay.width}`);
    if (overlay.height) tr.push(`oh-${overlay.height}`);
  }
  
  // Border & Radius
  if (transformations.border) {
    tr.push(`bo-${transformations.border.width}-${transformations.border.color.replace('#', '')}`);
    if (transformations.border.radius) tr.push(`r-${transformations.border.radius}`);
  }
  if (transformations.radius) tr.push(`r-${transformations.radius === 'max' ? 'max' : transformations.radius}`);
  
  // Rotation & Flip
  if (transformations.rotate !== undefined) tr.push(`rt-${transformations.rotate === 'auto' ? 'auto' : transformations.rotate}`);
  if (transformations.flip) tr.push(`fl-${transformations.flip}`);
  
  // Background
  if (transformations.background) tr.push(`bg-${transformations.background.replace('#', '')}`);
  
  // DPR
  if (transformations.dpr) tr.push(`dpr-${transformations.dpr === 'auto' ? 'auto' : transformations.dpr}`);
  
  // Default image
  if (transformations.defaultImage) tr.push(`di-${encodeURIComponent(transformations.defaultImage)}`);
  
  // Priority - add cache-busting param for priority images to ensure fresh delivery
  if (priority) {
    tr.push(`_=${Date.now()}`);
  }
  
  // Raw transformations passthrough
  if (transformations.rawTransformations) {
    Object.entries(transformations.rawTransformations).forEach(([key, value]) => {
      tr.push(`${key}-${value}`);
    });
  }
  
  const transformString = tr.length > 0 ? `tr:${tr.join(':')}/` : '';
  return `${urlEndpoint}/${transformString}${path}`;
}

/**
 * Build Cloudinary URL with transformations
 */
function buildCloudinaryUrl(baseSrc: string, transformations: ImageTransformations): string {
  const { cloudName } = currentConfig.cloudinary || {};
  if (!cloudName) return baseSrc;
  
  const tr: string[] = [];
  
  if (transformations.width) tr.push(`w_${transformations.width}`);
  if (transformations.height) tr.push(`h_${transformations.height}`);
  if (transformations.crop) tr.push(`c_${transformations.crop}`);
  if (transformations.gravity) tr.push(`g_${transformations.gravity}`);
  if (transformations.quality !== undefined) tr.push(`q_${transformations.quality}`);
  if (transformations.format) tr.push(`f_${transformations.format}`);
  if (transformations.blur) tr.push(`e_blur:${transformations.blur}`);
  if (transformations.brightness) tr.push(`e_brightness:${transformations.brightness}`);
  if (transformations.contrast) tr.push(`e_contrast:${transformations.contrast}`);
  
  const transformString = tr.length > 0 ? `${tr.join(',')}/` : '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${baseSrc}`;
}

/**
 * Build CloudFront URL (using Lambda@Edge or CloudFront Functions for transforms)
 */
function buildCloudFrontUrl(baseSrc: string, transformations: ImageTransformations): string {
  const { distributionDomain } = currentConfig.cloudfront || {};
  if (!distributionDomain) return baseSrc;
  
  // CloudFront typically uses query parameters or path-based transforms via Lambda@Edge
  const params = new URLSearchParams();
  if (transformations.width) params.set('w', String(transformations.width));
  if (transformations.height) params.set('h', String(transformations.height));
  if (transformations.quality) params.set('q', String(transformations.quality));
  if (transformations.format) params.set('f', transformations.format);
  
  return `https://${distributionDomain}/${baseSrc}?${params.toString()}`;
}

/**
 * Build Imgix URL with transformations
 */
function buildImgixUrl(baseSrc: string, transformations: ImageTransformations): string {
  const { domain } = currentConfig.imgix || {};
  if (!domain) return baseSrc;
  
  const params = new URLSearchParams();
  if (transformations.width) params.set('w', String(transformations.width));
  if (transformations.height) params.set('h', String(transformations.height));
  if (transformations.crop) params.set('fit', transformations.crop);
  if (transformations.quality !== undefined) params.set('q', String(transformations.quality));
  if (transformations.format) params.set('fm', transformations.format);
  if (transformations.blur) params.set('blur', String(transformations.blur));
  if (transformations.brightness) params.set('bri', String(transformations.brightness));
  if (transformations.contrast) params.set('con', String(transformations.contrast));
  if (transformations.saturation) params.set('sat', String(transformations.saturation));
  if (transformations.grayscale) params.set('monochrome', 'true');
  if (transformations.auto) params.set('auto', 'format,compress');
  
  return `https://${domain}/${baseSrc}?${params.toString()}`;
}

/**
 * Generate blur data URL placeholder (base64 encoded tiny image)
 */
export function generateBlurPlaceholder(
  width: number = 10,
  height: number = 10,
  color: string = '#e5e5e5'
): string {
  // Create a tiny base64 encoded SVG as blur placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${color}"/>
  </svg>`;
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate Low Quality Image Placeholder (LQIP) - small WebP/JPEG
 * This is a server-side utility that would typically use sharp or similar
 */
export async function generateLQIP(
  imageBuffer: Buffer,
  options: { width?: number; height?: number; quality?: number; format?: 'webp' | 'jpeg' } = {}
): Promise<string> {
  // This would use sharp on the server side
  // const sharp = (await import('sharp')).default;
  // const { width = 20, height = 20, quality = 20, format = 'webp' } = options;
  // const buffer = await sharp(imageBuffer)
  //   .resize(width, height, { fit: 'inside' })
  //   .toFormat(format, { quality })
  //   .toBuffer();
  // return `data:image/${format};base64,${buffer.toString('base64')}`;
  
  // Placeholder - returns a tiny base64 WebP
  return 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
}

/**
 * Preload critical assets (fonts, hero images, critical CSS)
 */
export function preloadCriticalAssets(assets: Array<{ href: string; as: 'image' | 'font' | 'style' | 'script'; type?: string; crossOrigin?: string }>): string[] {
  return assets.map(asset => {
    let link = `<link rel="preload" href="${asset.href}" as="${asset.as}"`;
    if (asset.type) link += ` type="${asset.type}"`;
    if (asset.crossOrigin) link += ` crossorigin="${asset.crossOrigin}"`;
    link += ' />';
    return link;
  });
}

/**
 * Generate responsive srcset and sizes for Next.js Image
 */
export function generateSrcSet(
  src: string,
  widths: readonly number[] | number[] = [320, 640, 960, 1280, 1920],
  transformations: ImageTransformations = {}
): string {
  return widths
    .map(w => {
      const url = getOptimizedImageUrl({
        src,
        transformations: { ...transformations, width: w },
      });
      return `${url} ${w}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(
  breakpoints: Array<{ maxWidth: number; size: string }> = [
    { maxWidth: 640, size: '100vw' },
    { maxWidth: 1024, size: '50vw' },
    { maxWidth: 1920, size: '33vw' },
  ]
): string {
  return breakpoints
    .map(bp => `(max-width: ${bp.maxWidth}px) ${bp.size}`)
    .join(', ') + `, ${breakpoints[breakpoints.length - 1]?.size || '100vw'}`;
}

/**
 * Check if image should be priority loaded (above-fold)
 */
export function isAboveFold(
  element: HTMLElement,
  threshold: number = 100
): boolean {
  if (typeof window === 'undefined') return false;
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight + threshold && rect.bottom > -threshold;
}

/**
 * IntersectionObserver-based lazy loading boundary detector
 */
export function createLazyLoadObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {
    rootMargin: '100px',
    threshold: 0.01,
  }
): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;
  return new IntersectionObserver(callback, options);
}

/**
 * ImageKit-specific URL builder for direct use
 */
export function buildImageKitUrlPublic(
  path: string,
  transformations: ImageTransformations = {}
): string {
  return getOptimizedImageUrl({ src: path, transformations });
}

export default {
  configureCDN,
  getCDNConfig,
  getOptimizedImageUrl,
  generateBlurPlaceholder,
  generateLQIP,
  preloadCriticalAssets,
  generateSrcSet,
  generateSizes,
  isAboveFold,
  createLazyLoadObserver,
  buildImageKitUrl: buildImageKitUrlPublic,
};