/**
 * Asset Utilities - Main Entry Point
 * Exports all asset-related utilities for the Wakefit clone
 */

// CDN Abstraction Layer
export * from './cdn';
export { default as cdn } from './cdn';

// Next.js Image Loader
export * from './imageLoader';
export { default as imageLoader } from './imageLoader';

// Font Configuration
export * from './fonts';
export { default as fonts } from './fonts';

// SVG Icon System
export * from './icons';
export { default as icons } from './icons';

// Placeholder Generation
export * from './placeholders';
export { default as placeholders } from './placeholders';

// Responsive Image Sizing
export * from './responsive';
export { default as responsive } from './responsive';

export {
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
} from './utils';
export { default as utils } from './utils';

/**
 * Convenience functions for common asset operations
 */

import { 
  getOptimizedImageUrl, 
  generateBlurPlaceholder, 
  preloadCriticalAssets,
  configureCDN,
  getCDNConfig,
} from './cdn';

import { 
  imageKitLoader, 
  loaders, 
  RESPONSIVE_CONFIGS, 
  getImageLoaderResponsiveConfig 
} from './imageLoader';

import { 
  poppins, 
  inter, 
  fontClassNames, 
  fontPreconnectHints,
  tailwindFontFamilies,
} from './fonts';

import { 
  ICON_SIZES, 
  SpriteIcon, 
  iconRegistry,
  ICON_CATEGORIES,
} from './icons';

import { 
  generateBlurDataUrl, 
  getPresetPlaceholder,
  PLACEHOLDER_PRESETS,
} from './placeholders';

import { 
  getResponsivePreset, 
  generateImageProps, 
  RESPONSIVE_PRESETS,
  LAZY_LOAD_PRESETS,
  isResponsiveAboveFold,
  generatePreloadLinks,
  useResponsiveImage,
} from './responsive';

/**
 * Initialize asset pipeline with configuration
 * Call this in your app initialization (e.g., layout.tsx or _app.tsx)
 */
export function initializeAssetPipeline(config?: {
  cdn?: Partial<import('./cdn').CDNConfig>;
  fonts?: { preload?: boolean };
  icons?: { spriteUrl?: string };
}): void {
  // Configure CDN if provided
  if (config?.cdn) {
    configureCDN(config.cdn);
  }
  
  // Fonts are preloaded via next/font automatically when used in layout.tsx
  // Icons sprite URL can be configured if needed
}

/**
 * Get all critical asset preload links for the current page
 * Use in layout.tsx or page components for critical assets
 */
export function getCriticalAssetPreloads(): string[] {
  const assets = [
    // Font preconnects
    ...fontPreconnectHints.map(h => `<link rel="${h.rel}" href="${h.href}"${h.crossOrigin ? ` crossorigin="${h.crossOrigin}"` : ''} />`),
    // CDN preconnect
    `<link rel="preconnect" href="https://ik.imagekit.io" crossorigin="anonymous" />`,
    `<link rel="dns-prefetch" href="https://ik.imagekit.io" />`,
  ];
  
  return assets;
}

/**
 * Generate preload links for above-fold images
 * Pass array of image sources that appear above the fold
 */
export function getAboveFoldPreloads(imageSources: string[]): string[] {
  return generatePreloadLinks(
    imageSources.map(src => ({
      src: getOptimizedImageUrl({ src, transformations: { width: 1920, quality: 85 } }),
      as: 'image' as const,
      type: 'image/webp',
    }))
  );
}

/**
 * Asset utility object for easy importing
 */
export const assetUtils = {
  // CDN
  getOptimizedImageUrl,
  generateBlurPlaceholder,
  preloadCriticalAssets,
  configureCDN,
  getCDNConfig,
  
  // Image Loader
  imageKitLoader,
  loaders,
  RESPONSIVE_CONFIGS,
  getImageLoaderResponsiveConfig,
  
  // Fonts
  poppins,
  inter,
  fontClassNames,
  fontPreconnectHints,
  tailwindFontFamilies,
  
  // Icons
  ICON_SIZES,
  SpriteIcon,
  iconRegistry,
  ICON_CATEGORIES,
  
  // Placeholders
  generateBlurDataUrl,
  getPresetPlaceholder,
  PLACEHOLDER_PRESETS,
  
  // Responsive
  getResponsivePreset,
  generateImageProps,
  RESPONSIVE_PRESETS,
  LAZY_LOAD_PRESETS,
  isResponsiveAboveFold,
  generatePreloadLinks,
  useResponsiveImage,
  
  // Initialization
  initializeAssetPipeline,
  getCriticalAssetPreloads,
  getAboveFoldPreloads,
};

export default assetUtils;