/**
 * Placeholder Generation Utilities
 * Generates blur data URLs, LQIP, and dominant color placeholders
 * 
 * These utilities work on the server side (Node.js) with sharp
 * For client-side, use the pre-generated placeholders
 */

import { generateBlurPlaceholder } from './cdn';

// Placeholder types
export type PlaceholderType = 'blur' | 'lqip' | 'dominant-color' | 'solid' | 'gradient';

export interface PlaceholderOptions {
  type: PlaceholderType;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  backgroundColor?: string;
  // For gradient placeholders
  gradient?: {
    type: 'linear' | 'radial';
    stops: Array<{ color: string; offset: number }>;
    direction?: string;
  };
  // For solid color
  color?: string;
}

export interface PlaceholderResult {
  dataUrl: string;
  width: number;
  height: number;
  type: PlaceholderType;
  dominantColor?: string;
  cssBackground?: string; // CSS background property value
}

/**
 * Generate a blur data URL placeholder (base64 encoded tiny image)
 * This is the same as the Next.js Image blurDataUrl prop
 */
export function generateBlurDataUrl(
  width: number = 10,
  height: number = 10,
  color: string = '#e5e5e5'
): string {
  return generateBlurPlaceholder(width, height, color);
}

/**
 * Generate a solid color placeholder
 */
export function generateSolidPlaceholder(
  width: number = 20,
  height: number = 20,
  color: string = '#e5e5e5'
): PlaceholderResult {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${color}"/>
  </svg>`;
  const base64 = Buffer.from(svg).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${base64}`;
  
  return {
    dataUrl,
    width,
    height,
    type: 'solid',
    dominantColor: color,
    cssBackground: color,
  };
}

/**
 * Generate a gradient placeholder
 */
export function generateGradientPlaceholder(
  width: number = 20,
  height: number = 20,
  gradient: PlaceholderOptions['gradient'] = {
    type: 'linear',
    stops: [
      { color: '#e5e5e5', offset: 0 },
      { color: '#d4d4d4', offset: 1 },
    ],
    direction: '45deg',
  }
): PlaceholderResult {
  const { type, stops, direction = '45deg' } = gradient;
  
  let gradientDef = '';
  if (type === 'linear') {
    gradientDef = `<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      ${stops.map((stop, i) => `<stop offset="${stop.offset * 100}%" stop-color="${stop.color}"/>`).join('')}
    </linearGradient>`;
  } else {
    gradientDef = `<radialGradient id="grad" cx="50%" cy="50%" r="50%">
      ${stops.map((stop, i) => `<stop offset="${stop.offset * 100}%" stop-color="${stop.color}"/>`).join('')}
    </radialGradient>`;
  }
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>${gradientDef}</defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
  </svg>`;
  
  const base64 = Buffer.from(svg).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${base64}`;
  
  // Calculate average color for CSS background fallback
  const avgColor = stops.reduce((acc, stop) => {
    const hex = stop.color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r: acc.r + r, g: acc.g + g, b: acc.b + b };
  }, { r: 0, g: 0, b: 0 });
  
  const len = stops.length;
  const dominantColor = `rgb(${Math.round(avgColor.r / len)}, ${Math.round(avgColor.g / len)}, ${Math.round(avgColor.b / len)})`;
  
  return {
    dataUrl,
    width,
    height,
    type: 'gradient',
    dominantColor,
    cssBackground: `linear-gradient(${direction}, ${stops.map(s => s.color).join(', ')})`,
  };
}

/**
 * Generate placeholder based on options
 */
export function generatePlaceholder(options: PlaceholderOptions): PlaceholderResult {
  const { type, width = 20, height = 20 } = options;
  
  switch (type) {
    case 'blur':
      return {
        dataUrl: generateBlurDataUrl(width, height, options.backgroundColor || '#e5e5e5'),
        width,
        height,
        type: 'blur',
      };
    case 'solid':
      return generateSolidPlaceholder(width, height, options.color || '#e5e5e5');
    case 'gradient':
      return generateGradientPlaceholder(width, height, options.gradient);
    case 'lqip':
      // LQIP would require sharp - return a minimal WebP placeholder
      return {
        dataUrl: 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
        width,
        height,
        type: 'lqip',
      };
    case 'dominant-color':
      // Would require image analysis - return solid fallback
      return generateSolidPlaceholder(width, height, options.color || '#e5e5e5');
    default:
      return generateSolidPlaceholder(width, height, '#e5e5e5');
  }
}

/**
 * Predefined placeholder presets for common use cases
 */
export const PLACEHOLDER_PRESETS: Record<string, PlaceholderOptions> = {
  // Minimal blur for hero images
  heroBlur: {
    type: 'blur',
    width: 20,
    height: 11,
    backgroundColor: '#1a1a2e',
  },
  // Product image placeholder
  product: {
    type: 'gradient',
    width: 20,
    height: 20,
    gradient: {
      type: 'linear',
      direction: '135deg',
      stops: [
        { color: '#f5f5f5', offset: 0 },
        { color: '#e8e8e8', offset: 0.5 },
        { color: '#f0f0f0', offset: 1 },
      ],
    },
  },
  // Avatar/profile placeholder
  avatar: {
    type: 'gradient',
    width: 20,
    height: 20,
    gradient: {
      type: 'radial',
      stops: [
        { color: '#e0e0e0', offset: 0 },
        { color: '#c0c0c0', offset: 1 },
      ],
    },
  },
  // Category card placeholder
  category: {
    type: 'gradient',
    width: 20,
    height: 15,
    gradient: {
      type: 'linear',
      direction: '45deg',
      stops: [
        { color: '#fff8f0', offset: 0 },
        { color: '#ffe8d0', offset: 1 },
      ],
    },
  },
  // Skeleton loader placeholder
  skeleton: {
    type: 'solid',
    width: 100,
    height: 100,
    color: '#e5e5e5',
  },
  // Dark mode placeholder
  dark: {
    type: 'gradient',
    width: 20,
    height: 20,
    gradient: {
      type: 'linear',
      direction: '135deg',
      stops: [
        { color: '#1a1a2e', offset: 0 },
        { color: '#16213e', offset: 1 },
      ],
    },
  },
};

/**
 * Get a preset placeholder by name
 */
export function getPresetPlaceholder(name: keyof typeof PLACEHOLDER_PRESETS): PlaceholderResult {
  const preset = PLACEHOLDER_PRESETS[name];
  if (!preset) {
    console.warn(`Placeholder preset "${name}" not found, using default`);
    return generatePlaceholder({ type: 'solid', color: '#e5e5e5' });
  }
  return generatePlaceholder(preset);
}

/**
 * Server-side placeholder generation with sharp (for build-time generation)
 * This would be used in a build script or API route
 */
export async function generateSharpPlaceholder(
  imageBuffer: Buffer,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png' | 'avif';
    type: 'lqip' | 'blur' | 'dominant-color';
  }
): Promise<PlaceholderResult> {
  // Dynamic import for server-side only
  // const sharp = (await import('sharp')).default;
  // 
  // const { width = 20, height = 20, quality = 20, format = 'webp', type } = options;
  // 
  // let pipeline = sharp(imageBuffer).resize(width, height, { fit: 'inside' });
  // 
  // if (type === 'blur') {
  //   pipeline = pipeline.blur(20);
  // }
  // 
  // if (type === 'dominant-color') {
  //   const stats = await pipeline.stats();
  //   const dominant = stats.dominant;
  //   const color = `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`;
  //   return generateSolidPlaceholder(width, height, color);
  // }
  // 
  // const buffer = await pipeline.toFormat(format, { quality }).toBuffer();
  // const base64 = buffer.toString('base64');
  // const mimeType = format === 'webp' ? 'webp' : format === 'jpeg' ? 'jpeg' : format;
  // 
  // return {
  //   dataUrl: `data:image/${mimeType};base64,${base64}`,
  //   width,
  //   height,
  //   type,
  // };
  
  // Fallback for environments without sharp
  return getPresetPlaceholder('product');
}

/**
 * CSS-in-JS helper for placeholder styles
 */
export function getPlaceholderStyles(result: PlaceholderResult): React.CSSProperties {
  return {
    backgroundImage: `url("${result.dataUrl}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: result.dominantColor || result.cssBackground || '#e5e5e5',
    // For blur placeholders, add filter
    ...(result.type === 'blur' && {
      filter: 'blur(20px)',
      transform: 'scale(1.1)',
    }),
  };
}

/**
 * Generate responsive placeholder sizes
 */
export function generateResponsivePlaceholders(
  baseWidth: number,
  baseHeight: number,
  breakpoints: number[] = [320, 640, 1024, 1280, 1920],
  options: PlaceholderOptions = { type: 'blur' }
): Record<number, PlaceholderResult> {
  const results: Record<number, PlaceholderResult> = {};
  
  for (const bp of breakpoints) {
    const scale = bp / baseWidth;
    const width = Math.round(baseWidth * scale);
    const height = Math.round(baseHeight * scale);
    results[bp] = generatePlaceholder({ ...options, width, height });
  }
  
  return results;
}

export default {
  generateBlurDataUrl,
  generateSolidPlaceholder,
  generateGradientPlaceholder,
  generatePlaceholder,
  getPresetPlaceholder,
  generateSharpPlaceholder,
  getPlaceholderStyles,
  generateResponsivePlaceholders,
  PLACEHOLDER_PRESETS,
};