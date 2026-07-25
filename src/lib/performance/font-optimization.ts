/**
 * Font Loading Optimization Utilities
 * 
 * Provides strategies for optimal font loading:
 * - Preload critical fonts
 * - font-display: swap for fallback fonts
 * - Font subsetting for reduced file sizes
 * - Variable fonts support
 * - Self-hosting fonts via next/font
 * 
 * Wakefit uses: next/font with swap, DNS prefetch for ImageKit
 * This adds: font subsetting, variable fonts, preload optimization
 */

import { Inter, Poppins, Roboto } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Font Display Strategies
 * - 'swap': Show fallback immediately, swap when loaded (recommended for body text)
 * - 'optional': Browser decides - may skip font if slow connection
 * - 'fallback': Short block period, then swap
 * - 'block': Block text until font loads (avoid for body text)
 * - 'auto': Browser default (usually block)
 */
export type FontDisplay = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';

/**
 * Font subset options for reducing file size
 */
export interface FontSubsetOptions {
  /** Unicode ranges to include */
  unicodeRanges?: string[];
  /** Specific characters to include */
  characters?: string;
  /** Predefined subset names */
  predefinedSubset?: 'latin' | 'latin-ext' | 'cyrillic' | 'greek' | 'devanagari' | 'vietnamese';
}

/**
 * Font configuration options
 */
export interface FontConfig {
  /** Font family name */
  name: string;
  /** Font display strategy */
  display: FontDisplay;
  /** Preload this font */
  preload: boolean;
  /** Font weight(s) to load */
  weight?: string | number | (string | number)[];
  /** Font style(s) to load */
  style?: 'normal' | 'italic' | 'oblique' | ('normal' | 'italic' | 'oblique')[];
  /** Variable font configuration */
  variable?: string;
  /** Subset configuration */
  subset?: FontSubsetOptions;
  /** Fallback font family */
  fallback?: string[];
  /** Whether to adjust fallback font metrics */
  adjustFontFallback?: boolean | 'advance-override' | 'ascent-override' | 'descent-override' | 'line-gap-override';
  /** Font loader configuration */
  loader?: 'google' | 'local' | 'variable';
  /** Path for local fonts */
  path?: string;
  /** Custom CSS variable name */
  variableName?: string;
}

/**
 * Predefined font subsets for common use cases
 */
export const fontSubsets = {
  /** Basic Latin characters only (~15-20KB) */
  latin: ['U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA', 'U+02DC', 'U+2000-206F', 'U+2074', 'U+20AC', 'U+2122', 'U+2191', 'U+2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD'],
  
  /** Latin Extended (~25-35KB) */
  'latin-ext': ['U+0100-024F', 'U+0259', 'U+1E00-1EFF', 'U+2020', 'U+20A0-20AB', 'U+2122', 'U+2191', 'U+2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD'],
  
  /** Cyrillic characters */
  cyrillic: ['U+0400-045F', 'U+0490-0491', 'U+04B0-04B1', 'U+2116'],
  
  /** Greek characters */
  greek: ['U+0370-03FF'],
  
  /** Devanagari for Hindi/Marathi */
  devanagari: ['U+0900-097F'],
  
  /** Vietnamese characters */
  vietnamese: ['U+0102-0103', 'U+0110-0111', 'U+0128-0129', 'U+0168-0169', 'U+01A0-01A1', 'U+01AF-01B0', 'U+1EA0-1EF9', 'U+20AB'],
  
  /** Common punctuation and symbols */
  punctuation: ['U+2000-206F', 'U+2070-209F', 'U+20A0-20CF', 'U+2100-214F'],
  
  /** Currency symbols */
  currency: ['U+20A0-20CF', 'U+0024', 'U+00A2-00A5', 'U+20B0-20BF'],
};

/**
 * Wakefit Brand Font Configuration
 * Using Inter as primary (system font stack fallback)
 * Using Poppins for headings (brand font)
 */
export const wakefitFonts = {
  /** Primary font - Inter (system UI font stack compatible) */
  primary: {
    name: 'Inter',
    display: 'swap' as FontDisplay,
    preload: true,
    weight: ['400', '500', '600', '700'],
    style: 'normal',
    variable: '--font-inter',
    subset: { predefinedSubset: 'latin' as const },
    fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    adjustFontFallback: 'advance-override' as const,
    loader: 'google' as const,
  } satisfies FontConfig,
  
  /** Heading font - Poppins (brand personality) */
  heading: {
    name: 'Poppins',
    display: 'swap' as FontDisplay,
    preload: true,
    weight: ['500', '600', '700', '800'],
    style: 'normal',
    variable: '--font-poppins',
    subset: { predefinedSubset: 'latin' as const },
    fallback: ['Inter', 'system-ui', 'sans-serif'],
    adjustFontFallback: 'advance-override' as const,
    loader: 'google' as const,
  } satisfies FontConfig,
  
  /** Monospace font for code */
  mono: {
    name: 'JetBrains Mono',
    display: 'optional' as FontDisplay,
    preload: false,
    weight: ['400', '500'],
    style: 'normal',
    variable: '--font-mono',
    subset: { predefinedSubset: 'latin' as const },
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
    loader: 'google' as const,
  } satisfies FontConfig,
};

/**
 * Next.js Font Instances
 * Using next/font/google for automatic optimization
 */
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: 'advance-override',
});

export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['500', '600', '700', '800'],
  preload: true,
  fallback: ['Inter', 'system-ui', 'sans-serif'],
  adjustFontFallback: 'advance-override',
});

export const jetbrainsMono = Inter({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-mono',
  weight: ['400', '500'],
  preload: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
});

/**
 * Local Font Configuration (for self-hosted fonts)
 * Use this for custom brand fonts not available on Google Fonts
 */
export function createLocalFont(config: {
  name: string;
  src: string | { path: string; weight: string; style: string }[];
  display?: FontDisplay;
  variable?: string;
  weight?: string | number | (string | number)[];
  style?: string | string[];
  fallback?: string[];
  preload?: boolean;
}) {
  return localFont({
    src: config.src,
    display: config.display ?? 'swap',
    variable: config.variable,
    weight: config.weight,
    style: config.style,
    fallback: config.fallback,
    preload: config.preload ?? true,
  });
}

/**
 * Variable Font Configuration
 * Single file for multiple weights - smaller total size
 */
export interface VariableFontConfig {
  name: string;
  variable: string;
  src: string;
  weightRange?: string; // e.g., '100 900'
  display?: FontDisplay;
  fallback?: string[];
  preload?: boolean;
}

/**
 * Generate preload links for critical fonts
 * Use in layout.tsx <head> or next/head
 */
export function generateFontPreloadLinks(fonts: FontConfig[]): string[] {
  return fonts
    .filter((font) => font.preload)
    .map((font) => {
      const weights = Array.isArray(font.weight) ? font.weight : [font.weight];
      const styles = Array.isArray(font.style) ? font.style : [font.style];
      
      return weights.flatMap((weight) =>
        styles.map((style) => {
          const href = font.loader === 'google'
            ? `https://fonts.googleapis.com/css2?family=${font.name.replace(/\s+/g, '+')}:wght@${weight}&display=${font.display}`
            : font.path || `/fonts/${font.name.toLowerCase().replace(/\s+/g, '-')}-${weight}.woff2`;
          
          return `<link rel="preload" as="font" type="font/woff2" href="${href}" crossorigin>`;
        })
      );
    })
    .flat();
}

/**
 * Generate font-face CSS for self-hosted fonts
 */
export function generateFontFaceCSS(config: FontConfig): string {
  const weights = Array.isArray(config.weight) ? config.weight : [config.weight];
  const styles = Array.isArray(config.style) ? config.style : [config.style];
  
  let css = '';
  
  for (const weight of weights) {
    for (const style of styles) {
      const fontFamily = config.name;
      const src = config.path 
        ? `url('${config.path}') format('woff2')`
        : `url('https://fonts.gstatic.com/s/${config.name.toLowerCase().replace(/\s+/g, '')}/v1/${weight}-${style}.woff2') format('woff2')`;
      
      css += `
@font-face {
  font-family: '${fontFamily}';
  font-weight: ${weight};
  font-style: ${style};
  font-display: ${config.display};
  src: ${src};
  ${config.variable ? `font-family: '${fontFamily}', var(${config.variable});` : ''}
  ${config.adjustFontFallback === 'advance-override' ? 'ascent-override: 90%; descent-override: 25%; line-gap-override: 0%;' : ''}
}
`;
    }
  }
  
  return css;
}

/**
 * Font Loading Strategy Component
 * Add to layout.tsx to implement font loading optimizations
 */
export function FontLoadingStrategy() {
  // This component renders font preload hints and font-display CSS
  // In Next.js App Router, use the font variables directly in layout.tsx
  
  if (typeof window === 'undefined') {
    // Server-side: return preload links
    const preloadLinks = generateFontPreloadLinks([
      wakefitFonts.primary,
      wakefitFonts.heading,
    ]);
    
    return (
      <>
        {preloadLinks.map((link, i) => (
          <link key={i} rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --font-inter: 'Inter', system-ui, sans-serif;
                --font-poppins: 'Poppins', 'Inter', system-ui, sans-serif;
                --font-mono: 'JetBrains Mono', ui-monospace, monospace;
              }
              @font-face {
                font-family: 'Inter-fallback';
                src: local('Arial');
                ascent-override: 90%;
                descent-override: 25%;
                line-gap-override: 0%;
              }
              @font-face {
                font-family: 'Poppins-fallback';
                src: local('Arial');
                ascent-override: 105%;
                descent-override: 30%;
                line-gap-override: 0%;
              }
            `,
          }}
        />
      </>
    );
  }
  
  return null;
}

/**
 * Font Subsetting Utility
 * Generate subset configuration for specific character sets
 */
export function createSubsetConfig(
  locale: 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'or' | 'pa' | 'as'
): FontSubsetOptions {
  const subsets: Record<string, FontSubsetOptions> = {
    en: { predefinedSubset: 'latin' },
    hi: { predefinedSubset: 'devanagari' },
    ta: { predefinedSubset: 'tamil' },
    te: { predefinedSubset: 'telugu' },
    bn: { predefinedSubset: 'bengali' },
    mr: { predefinedSubset: 'devanagari' },
    gu: { predefinedSubset: 'gujarati' },
    kn: { predefinedSubset: 'kannada' },
    ml: { predefinedSubset: 'malayalam' },
    or: { predefinedSubset: 'oriya' },
    pa: { predefinedSubset: 'gurmukhi' },
    as: { predefinedSubset: 'assamese' },
  };
  
  return subsets[locale] ?? { predefinedSubset: 'latin' };
}

/**
 * Font Performance Budget
 * Target: Total font size < 50KB (woff2, subset)
 */
export const fontBudget = {
  maxTotalSize: 50 * 1024, // 50KB
  maxIndividualFont: 25 * 1024, // 25KB per font
  recommendedFormats: ['woff2'] as const,
  fallbackStrategy: 'system-ui' as const,
};

/**
 * Preconnect hints for font providers
 * Add to next.config.mjs or layout.tsx
 */
export const fontPreconnectHrefs = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://ik.imagekit.io', // Wakefit's ImageKit CDN
];

/**
 * DNS Prefetch for font domains
 */
export const fontDnsPrefetchHrefs = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

export default {
  wakefitFonts,
  inter,
  poppins,
  jetbrainsMono,
  createLocalFont,
  generateFontPreloadLinks,
  generateFontFaceCSS,
  createSubsetConfig,
  fontBudget,
  fontPreconnectHrefs,
  fontDnsPrefetchHrefs,
  FontLoadingStrategy,
};