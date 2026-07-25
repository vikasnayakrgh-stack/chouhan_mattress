/**
 * Next.js Image Custom Loader for ImageKit
 * This loader integrates with Next.js Image component to use ImageKit transformations
 * 
 * Usage in next.config.js:
 * images: {
 *   loader: 'custom',
 *   loaderFile: './src/lib/assets/imageLoader.ts',
 * }
 * 
 * Or use directly in components:
 * import Image from 'next/image'
 * import { imageKitLoader } from '@/lib/assets/imageLoader'
 * 
 * <Image loader={imageKitLoader} src="/path/to/image.jpg" width={800} height={600} />
 */

import type { ImageLoaderProps } from 'next/image';
import { getOptimizedImageUrl, type ImageTransformations } from './cdn';

// Default transformation presets for common use cases
export const IMAGE_PRESETS: Record<string, ImageTransformations> = {
  // Hero/banner images - high quality, responsive
  hero: {
    quality: 85,
    format: 'auto',
    crop: 'fill',
    gravity: 'auto',
  },
  // Product images - consistent sizing
  product: {
    quality: 80,
    format: 'auto',
    crop: 'fill',
    gravity: 'center',
  },
  // Thumbnails - small, fast loading
  thumbnail: {
    quality: 70,
    format: 'auto',
    crop: 'fill',
    gravity: 'center',
  },
  // Category/grid images
  category: {
    quality: 75,
    format: 'auto',
    crop: 'fill',
    gravity: 'auto',
  },
  // Avatar/profile images
  avatar: {
    quality: 80,
    format: 'auto',
    crop: 'thumb',
    gravity: 'face',
    radius: 'max',
  },
  // Background images - can be lower quality
  background: {
    quality: 70,
    format: 'auto',
    crop: 'fill',
    gravity: 'center',
  },
  // Blur placeholder - very low quality
  blur: {
    quality: 10,
    format: 'auto',
    blur: 50,
    crop: 'fill',
  },
  // LQIP placeholder
  lqip: {
    quality: 20,
    format: 'webp',
    crop: 'fill',
    width: 20,
    height: 20,
  },
};

/**
 * Custom Image Loader for Next.js Image component
 * Compatible with Next.js 13+ custom loader API
 */
export function imageKitLoader({ src, width, quality }: ImageLoaderProps): string {
  // Determine preset based on width or use default
  let preset: ImageTransformations = { quality: quality || 80, format: 'auto' };
  
  if (width <= 100) {
    preset = IMAGE_PRESETS.thumbnail;
  } else if (width <= 300) {
    preset = IMAGE_PRESETS.category;
  } else if (width <= 800) {
    preset = IMAGE_PRESETS.product;
  } else {
    preset = IMAGE_PRESETS.hero;
  }
  
  return getOptimizedImageUrl({
    src,
    transformations: {
      ...preset,
      width,
      quality: quality || preset.quality,
    },
  });
}

/**
 * Create a custom loader with specific preset
 */
export function createCustomLoader(presetName: keyof typeof IMAGE_PRESETS) {
  return ({ src, width, quality }: ImageLoaderProps): string => {
    const preset = IMAGE_PRESETS[presetName];
    return getOptimizedImageUrl({
      src,
      transformations: {
        ...preset,
        width,
        quality: quality || preset.quality,
      },
    });
  };
}

/**
 * Predefined loaders for common use cases
 */
export const loaders = {
  hero: createCustomLoader('hero'),
  product: createCustomLoader('product'),
  thumbnail: createCustomLoader('thumbnail'),
  category: createCustomLoader('category'),
  avatar: createCustomLoader('avatar'),
  background: createCustomLoader('background'),
  blur: createCustomLoader('blur'),
  lqip: createCustomLoader('lqip'),
};

/**
 * Responsive image configuration for Next.js Image
 * Generates appropriate sizes and srcSet based on layout
 */
export interface ImageLoaderResponsiveConfig {
  layout: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
  sizes?: string;
  breakpoints?: number[];
}

export const RESPONSIVE_CONFIGS: Record<string, ImageLoaderResponsiveConfig> = {
  // Hero banner - full width
  hero: {
    layout: 'responsive',
    sizes: '100vw',
    breakpoints: [640, 1024, 1280, 1920, 2560],
  },
  // Product grid - 4 columns on desktop, 2 on tablet, 1 on mobile
  productGrid: {
    layout: 'responsive',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw',
    breakpoints: [320, 480, 640, 800, 960, 1280],
  },
  // Category grid - 6 columns on desktop
  categoryGrid: {
    layout: 'responsive',
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw',
    breakpoints: [160, 240, 320, 400, 480],
  },
  // Thumbnail - fixed small size
  thumbnail: {
    layout: 'fixed',
    sizes: '80px',
    breakpoints: [80, 160],
  },
  // Avatar - fixed small circular
  avatar: {
    layout: 'fixed',
    sizes: '48px',
    breakpoints: [48, 96],
  },
  // Full width banner
  banner: {
    layout: 'responsive',
    sizes: '100vw',
    breakpoints: [640, 1024, 1280, 1920],
  },
  // Half width (side by side)
  half: {
    layout: 'responsive',
    sizes: '(max-width: 768px) 100vw, 50vw',
    breakpoints: [320, 480, 640, 800, 960],
  },
  // Third width (3 columns)
  third: {
    layout: 'responsive',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    breakpoints: [320, 480, 640, 800],
  },
  // Quarter width (4 columns)
  quarter: {
    layout: 'responsive',
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
    breakpoints: [240, 320, 400, 480],
  },
};

/**
 * Get responsive config by name
 */
export function getImageLoaderResponsiveConfig(name: keyof typeof RESPONSIVE_CONFIGS): ImageLoaderResponsiveConfig {
  return RESPONSIVE_CONFIGS[name] || RESPONSIVE_CONFIGS.productGrid;
}

/**
 * Generate fill layout props for Next.js Image
 * Use when parent has relative positioning and defined dimensions
 */
export function getFillLayoutProps(): {
  layout: 'fill';
  objectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition: string;
} {
  return {
    layout: 'fill',
    objectFit: 'cover',
    objectPosition: 'center',
  };
}

/**
 * Generate intrinsic layout props (maintains aspect ratio, scales down)
 */
export function getIntrinsicLayoutProps(maxWidth?: number): {
  layout: 'intrinsic';
  style?: React.CSSProperties;
} {
  return {
    layout: 'intrinsic',
    style: maxWidth ? { maxWidth } : undefined,
  };
}

export default imageKitLoader;