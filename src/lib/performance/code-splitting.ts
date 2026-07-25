/**
 * Code Splitting Strategy Utilities
 * 
 * Provides patterns and utilities for optimal code splitting in Next.js:
 * - Dynamic imports for heavy components
 * - Route-based splitting (automatic in Next.js App Router)
 * - Component-level splitting for large components
 * - Library-level splitting for heavy dependencies
 * - Prefetching strategies
 * - Bundle analysis integration
 * 
 * Wakefit uses: Next.js App Router (automatic route splitting), 
 * optimizePackageImports for lucide-react
 * This adds: dynamic imports for heavy components, prefetch strategies
 */

import dynamic from 'next/dynamic';
import { ComponentType, lazy, Suspense, ReactNode } from 'react';

/**
 * Dynamic import options for code splitting
 */
export interface DynamicImportOptions<T extends ComponentType<any> = ComponentType<any>> {
  /** Show loading state while component loads */
  loading?: () => ReactNode;
  /** Disable SSR for this component */
  ssr?: boolean;
  /** Custom webpack chunk name */
  webpackChunkName?: string;
  /** Preload the component */
  preload?: boolean;
  /** Timeout for loading (ms) */
  timeout?: number;
  /** Custom error boundary */
  onError?: (error: Error) => ReactNode;
}

/**
 * Heavy component categories that should be code-split
 */
export const heavyComponents = {
  /** Charts and data visualization */
  charts: [
    'recharts',
    'victory',
    'chart.js',
    'd3',
    'nivo',
    'visx',
  ],
  /** Animation libraries */
  animation: [
    'framer-motion',
    'react-spring',
    'motion',
    'animejs',
    'gsap',
  ],
  /** Rich text editors */
  editors: [
    'slate',
    'draft-js',
    'quill',
    'tiptap',
    'prosemirror',
    'lexical',
  ],
  /** Date pickers and calendars */
  datePickers: [
    'react-day-picker',
    'react-datepicker',
    'date-fns',
    'dayjs',
    'moment',
  ],
  /** Form libraries */
  forms: [
    'react-hook-form',
    'formik',
    'yup',
    'zod',
  ],
  /** UI component libraries (heavy) */
  ui: [
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-select',
    '@radix-ui/react-popover',
    '@radix-ui/react-tooltip',
    '@radix-ui/react-tabs',
    '@radix-ui/react-accordion',
    '@radix-ui/react-navigation-menu',
  ],
  /** Carousel/slider */
  carousel: [
    'embla-carousel-react',
    'swiper',
    'react-slick',
  ],
  /** Tables and grids */
  tables: [
    'tanstack-table',
    'react-table',
    'ag-grid',
    'react-virtualized',
    'react-window',
  ],
  /** Maps and charts */
  maps: [
    'leaflet',
    'mapbox-gl',
    'react-map-gl',
    'google-maps',
  ],
  /** PDF and document processing */
  documents: [
    'pdfjs-dist',
    'jspdf',
    'react-pdf',
    'docx',
  ],
  /** 3D and WebGL */
  threeD: [
    'three',
    'react-three-fiber',
    '@react-three/drei',
    'babylonjs',
  ],
} as const;

/**
 * Check if a module is considered "heavy" and should be dynamically imported
 */
export function isHeavyModule(moduleName: string): boolean {
  const heavyModules = Object.values(heavyComponents).flat();
  return heavyModules.some((heavy) => 
    moduleName.includes(heavy) || heavy.includes(moduleName)
  );
}

/**
 * Create a dynamically imported component with optimal settings
 */
export function createDynamicComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions<T> = {}
): T {
  const {
    loading = () => <ComponentSkeleton />,
    ssr = false,
    webpackChunkName,
    preload = false,
  } = options;

  const DynamicComponent = dynamic<T>(importFn, {
    loading,
    ssr,
    ...(webpackChunkName && { loadableGenerated: { webpack: () => [webpackChunkName] } }),
  });

  // Preload if requested (client-side only)
  if (preload && typeof window !== 'undefined') {
    // Preload on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFn());
    } else {
      setTimeout(() => importFn(), 1);
    }
  }

  return DynamicComponent;
}

/**
 * Skeleton component for loading states
 */
function ComponentSkeleton(): ReactNode {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-32 w-full" />
  );
}

/**
 * Predefined dynamic imports for common heavy components
 */
export const dynamicImports = {
  /** Charts - only load when needed */
  Chart: createDynamicComponent(
    () => import('@/components/charts/Chart').then((mod) => ({ default: mod.Chart })),
    { webpackChunkName: 'charts', loading: () => <ChartSkeleton /> }
  ),

  /** Rich text editor */
  RichTextEditor: createDynamicComponent(
    () => import('@/components/editor/RichTextEditor').then((mod) => ({ default: mod.RichTextEditor })),
    { webpackChunkName: 'editor', ssr: false }
  ),

  /** Date picker */
  DatePicker: createDynamicComponent(
    () => import('@/components/ui/DatePicker').then((mod) => ({ default: mod.DatePicker })),
    { webpackChunkName: 'datepicker' }
  ),

  /** Carousel/slider */
  Carousel: createDynamicComponent(
    () => import('@/components/ui/Carousel').then((mod) => ({ default: mod.Carousel })),
    { webpackChunkName: 'carousel' }
  ),

  /** Modal/Dialog */
  Dialog: createDynamicComponent(
    () => import('@/components/ui/Dialog').then((mod) => ({ default: mod.Dialog })),
    { webpackChunkName: 'dialog', ssr: false }
  ),

  /** Data table */
  DataTable: createDynamicComponent(
    () => import('@/components/tables/DataTable').then((mod) => ({ default: mod.DataTable })),
    { webpackChunkName: 'datatable' }
  ),

  /** Image gallery */
  ImageGallery: createDynamicComponent(
    () => import('@/components/gallery/ImageGallery').then((mod) => ({ default: mod.ImageGallery })),
    { webpackChunkName: 'gallery' }
  ),

  /** Product configurator */
  ProductConfigurator: createDynamicComponent(
    () => import('@/components/product/ProductConfigurator').then((mod) => ({ default: mod.ProductConfigurator })),
    { webpackChunkName: 'configurator', ssr: false }
  ),

  /** Checkout flow */
  Checkout: createDynamicComponent(
    () => import('@/components/checkout/CheckoutFlow').then((mod) => ({ default: mod.CheckoutFlow })),
    { webpackChunkName: 'checkout', ssr: false }
  ),

  /** 3D viewer */
  ModelViewer: createDynamicComponent(
    () => import('@/components/3d/ModelViewer').then((mod) => ({ default: mod.ModelViewer })),
    { webpackChunkName: '3d', ssr: false }
  ),
};

/**
 * Skeleton components for loading states
 */
function ChartSkeleton(): ReactNode {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  );
}

/**
 * Route-based code splitting utilities
 * Next.js App Router does this automatically, but these helpers
 * provide additional control for complex scenarios
 */

export interface RouteChunkConfig {
  /** Route pattern */
  route: string;
  /** Chunks to preload for this route */
  preloadChunks?: string[];
  /** Chunks to defer */
  deferChunks?: string[];
  /** Priority: high, low, auto */
  priority?: 'high' | 'low' | 'auto';
}

/**
 * Route chunk configurations for prefetching optimization
 */
export const routeChunkConfigs: RouteChunkConfig[] = [
  {
    route: '/',
    preloadChunks: ['main', 'framework', 'hero', 'products'],
    priority: 'high',
  },
  {
    route: '/products*',
    preloadChunks: ['main', 'product-list', 'filters', 'carousel'],
    priority: 'high',
  },
  {
    route: '/products/[slug]',
    preloadChunks: ['main', 'product-detail', 'gallery', 'configurator', 'reviews'],
    priority: 'high',
  },
  {
    route: '/cart',
    preloadChunks: ['main', 'cart', 'checkout-summary'],
    priority: 'high',
  },
  {
    route: '/checkout*',
    preloadChunks: ['main', 'checkout', 'payment', 'address'],
    priority: 'high',
  },
  {
    route: '/account*',
    preloadChunks: ['main', 'account', 'orders', 'profile'],
    priority: 'low',
  },
  {
    route: '/blog*',
    preloadChunks: ['main', 'blog', 'markdown'],
    priority: 'low',
  },
  {
    route: '/search',
    preloadChunks: ['main', 'search', 'filters'],
    priority: 'auto',
  },
];

/**
 * Get chunks to preload for a given route
 */
export function getPreloadChunksForRoute(pathname: string): string[] {
  for (const config of routeChunkConfigs) {
    const pattern = config.route.replace('*', '.*').replace('[slug]', '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(pathname)) {
      return config.preloadChunks || [];
    }
  }
  return [];
}

/**
 * Component-level code splitting with intersection observer
 * Loads component when it enters viewport
 */
export function createIntersectionObserverComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions<T> & { rootMargin?: string; threshold?: number } = {}
): T {
  const { rootMargin = '100px', threshold = 0.1, ...dynamicOptions } = options;
  
  const DynamicComponent = dynamic(importFn, {
    loading: dynamicOptions.loading || (() => <ComponentSkeleton />),
    ssr: dynamicOptions.ssr ?? false,
  });

  // This would be used with a wrapper component that uses IntersectionObserver
  // See IntersectionObserverWrapper below
  
  return DynamicComponent;
}

/**
 * Wrapper component that loads child when visible in viewport
 */
interface IntersectionObserverWrapperProps {
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  fallback?: ReactNode;
}

export function IntersectionObserverWrapper({
  children,
  rootMargin = '100px',
  threshold = 0.1,
  triggerOnce = true,
  fallback = <ComponentSkeleton />,
}: IntersectionObserverWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce]);

  return (
    <div ref={elementRef}>
      {isVisible ? children : fallback}
    </div>
  );
}

/**
 * Prefetch utilities for client-side navigation
 */

/**
 * Prefetch a dynamic import
 */
export async function prefetchComponent(importFn: () => Promise<any>): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    await importFn();
  } catch (error) {
    console.warn('Failed to prefetch component:', error);
  }
}

/**
 * Prefetch multiple components
 */
export async function prefetchComponents(importFns: Array<() => Promise<any>>): Promise<void> {
  await Promise.allSettled(importFns.map(prefetchComponent));
}

/**
 * Prefetch on hover (for links)
 */
export function createPrefetchOnHover<T>(
  importFn: () => Promise<{ default: T }>,
  delay: number = 100
): (() => void) {
  let timeoutId: NodeJS.Timeout | null = null;
  let hasPrefetched = false;

  return () => {
    if (hasPrefetched) return;
    
    if (timeoutId) clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      prefetchComponent(importFn);
      hasPrefetched = true;
    }, delay);
  };
}

/**
 * Next.js Link prefetch optimization
 * Disable prefetch for heavy routes, enable for critical routes
 */
export const prefetchConfig = {
  // Routes to prefetch aggressively
  prefetch: ['/', '/products', '/cart', '/checkout'],
  
  // Routes to disable prefetch (heavy bundles)
  noPrefetch: ['/account', '/blog', '/help', '/search'],
  
  // Viewport-based prefetch (when link enters viewport)
  viewportPrefetch: true,
};

/**
 * Bundle splitting configuration for webpack
 * Add to next.config.mjs
 */
export const webpackSplitConfig = {
  // Split vendor chunks
  splitChunks: {
    chunks: 'all',
    minSize: 20000,
    maxSize: 244000,
    minChunks: 1,
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    cacheGroups: {
      default: false,
      vendors: false,
      
      // Framework chunk
      framework: {
        name: 'framework',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler|prop-types)[\\/]/,
        priority: 40,
        enforce: true,
      },
      
      // UI library chunk
      ui: {
        name: 'ui',
        chunks: 'all',
        test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
        priority: 30,
        reuseExistingChunk: true,
      },
      
      // Animation chunk
      animation: {
        name: 'animation',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](framer-motion|react-spring|motion)[\\/]/,
        priority: 25,
      },
      
      // Charts chunk
      charts: {
        name: 'charts',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](recharts|victory|d3|chart\.js)[\\/]/,
        priority: 25,
      },
      
      // Forms chunk
      forms: {
        name: 'forms',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](react-hook-form|zod|yup|@hookform)[\\/]/,
        priority: 20,
      },
      
      // Date utilities chunk
      date: {
        name: 'date',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](date-fns|dayjs|moment)[\\/]/,
        priority: 20,
      },
      
      // Carousel chunk
      carousel: {
        name: 'carousel',
        chunks: 'all',
        test: /[\\/]node_modules[\\/](embla-carousel|swiper)[\\/]/,
        priority: 15,
      },
      
      // Lucide icons (optimized via optimizePackageImports)
      icons: {
        name: 'icons',
        chunks: 'all',
        test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
        priority: 35,
      },
      
      // Common vendor chunk
      commons: {
        name: 'commons',
        chunks: 'all',
        minChunks: 2,
        priority: 10,
        reuseExistingChunk: true,
        maxSize: 100000,
      },
      
      // Large vendors
      largeVendors: {
        name: 'large-vendors',
        chunks: 'all',
        test: (module: any) => {
          const size = module.size?.() || 0;
          return size > 160000 && /[\\/]node_modules[\\/]/.test(module.identifier());
        },
        priority: 5,
        minSize: 160000,
      },
    },
  },
};

/**
 * Analyze bundle composition
 * Use with: ANALYZE=true npm run build
 */
export function analyzeBundleComposition(buildDir: string = '.next') {
  // This would use @next/bundle-analyzer or webpack-bundle-analyzer
  // Returns analysis of chunk sizes and composition
  return {
    // Analysis would be generated at build time
  };
}

/**
 * Performance budget for chunks
 */
export const chunkBudgets = {
  framework: 45 * 1024,     // 45KB
  ui: 30 * 1024,            // 30KB
  animation: 25 * 1024,     // 25KB
  charts: 30 * 1024,        // 30KB
  forms: 15 * 1024,         // 15KB
  date: 10 * 1024,          // 10KB
  carousel: 15 * 1024,      // 15KB
  icons: 10 * 1024,         // 10KB
  commons: 20 * 1024,       // 20KB
  main: 80 * 1024,          // 80KB
  totalJS: 170 * 1024,      // 170KB gzipped
} as const;

/**
 * Check if chunks meet budget
 */
export function validateChunkBudgets(chunkSizes: Record<string, number>): {
  passed: boolean;
  violations: Array<{ chunk: string; budget: number; actual: number }>;
} {
  const violations: Array<{ chunk: string; budget: number; actual: number }> = [];
  
  for (const [chunk, budget] of Object.entries(chunkBudgets)) {
    const actual = chunkSizes[chunk] || 0;
    if (actual > budget) {
      violations.push({ chunk, budget, actual });
    }
  }
  
  return {
    passed: violations.length === 0,
    violations,
  };
}

// Need to import React hooks
import { useState, useEffect, useRef } from 'react';

export default {
  createDynamicComponent,
  dynamicImports,
  heavyComponents,
  isHeavyModule,
  getPreloadChunksForRoute,
  createIntersectionObserverComponent,
  IntersectionObserverWrapper,
  prefetchComponent,
  prefetchComponents,
  createPrefetchOnHover,
  prefetchConfig,
  webpackSplitConfig,
  chunkBudgets,
  validateChunkBudgets,
  analyzeBundleComposition,
};