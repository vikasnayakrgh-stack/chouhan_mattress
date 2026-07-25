/**
 * Resource Hints Utilities
 * 
 * Provides utilities for managing resource hints (preconnect, dns-prefetch, preload, prefetch, prerender)
 * to improve page load performance by establishing early connections and loading critical resources.
 * 
 * Wakefit uses: DNS prefetch for ImageKit, preconnect for ImageKit
 * This adds: Comprehensive resource hint strategy, dynamic hint injection, route-based hints
 */

import { Metadata } from 'next';

/**
 * Resource hint types
 */
export type ResourceHintType = 
  | 'preconnect'      // Establish early connection (TCP + TLS)
  | 'dns-prefetch'    // DNS lookup only
  | 'preload'         // Fetch resource with high priority
  | 'prefetch'        // Fetch resource with low priority (next navigation)
  | 'prerender'       // Full page render in background
  | 'modulepreload';  // Preload ES modules

/**
 * Resource hint configuration
 */
export interface ResourceHint {
  type: ResourceHintType;
  href: string;
  as?: string;           // For preload: script, style, font, image, fetch, etc.
  crossorigin?: 'anonymous' | 'use-credentials' | '';
  type?: string;         // MIME type
  media?: string;        // Media query for conditional loading
  fetchpriority?: 'high' | 'low' | 'auto';
  integrity?: string;    // Subresource integrity
  referrerpolicy?: string;
  sizes?: string;        // For images
  imagesrcset?: string;  // For responsive images
  imagesizes?: string;   // For responsive images
}

/**
 * Preconnect hints - establish early connections to critical origins
 */
export const preconnectHints: ResourceHint[] = [
  // ImageKit CDN - Wakefit's image provider
  {
    type: 'preconnect',
    href: 'https://ik.imagekit.io',
    crossorigin: 'anonymous',
  },
  {
    type: 'preconnect',
    href: 'https://ik.imagekit.io/wakefit',
    crossorigin: 'anonymous',
  },
  
  // Google Fonts - for font loading
  {
    type: 'preconnect',
    href: 'https://fonts.googleapis.com',
    crossorigin: 'anonymous',
  },
  {
    type: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossorigin: 'anonymous',
  },
  
  // API origin
  {
    type: 'preconnect',
    href: process.env.NEXT_PUBLIC_API_URL || 'https://api.wakefit.co',
    crossorigin: 'anonymous',
  },
  
  // Analytics/CDN origins
  {
    type: 'preconnect',
    href: 'https://www.google-analytics.com',
    crossorigin: 'anonymous',
  },
  {
    type: 'preconnect',
    href: 'https://www.googletagmanager.com',
    crossorigin: 'anonymous',
  },
];

/**
 * DNS prefetch hints - lightweight DNS lookups for non-critical origins
 */
export const dnsPrefetchHints: ResourceHint[] = [
  // Third-party services
  {
    type: 'dns-prefetch',
    href: 'https://connect.facebook.net',
  },
  {
    type: 'dns-prefetch',
    href: 'https://snap.licdn.com',
  },
  {
    type: 'dns-prefetch',
    href: 'https://px.ads.linkedin.com',
  },
  {
    type: 'dns-prefetch',
    href: 'https://cdn.jsdelivr.net',
  },
  {
    type: 'dns-prefetch',
    href: 'https://unpkg.com',
  },
  {
    type: 'dns-prefetch',
    href: 'https://cdn.jsdelivr.net',
  },
];

/**
 * Preload hints - fetch critical resources with high priority
 */
export const preloadHints: ResourceHint[] = [
  // Critical CSS (if not inlined)
  // {
  //   type: 'preload',
  //   href: '/_next/static/css/app.css',
  //   as: 'style',
  //   fetchpriority: 'high',
  // },
  
  // Critical fonts
  {
    type: 'preload',
    href: '/fonts/inter-var.woff2',
    as: 'font',
    crossorigin: 'anonymous',
    type: 'font/woff2',
    fetchpriority: 'high',
  },
  {
    type: 'preload',
    href: '/fonts/poppins-var.woff2',
    as: 'font',
    crossorigin: 'anonymous',
    type: 'font/woff2',
    fetchpriority: 'high',
  },
  
  // Hero image (above the fold)
  {
    type: 'preload',
    href: 'https://ik.imagekit.io/wakefit/hero-banner.webp',
    as: 'image',
    fetchpriority: 'high',
    type: 'image/webp',
  },
];

/**
 * Prefetch hints - fetch resources for likely next navigation
 */
export const prefetchHints: ResourceHint[] = [
  // Product page assets
  {
    type: 'prefetch',
    href: '/products/[slug]',
    as: 'document',
  },
  {
    type: 'prefetch',
    href: '/cart',
    as: 'document',
  },
  {
    type: 'prefetch',
    href: '/checkout',
    as: 'document',
  },
  
  // Search and category pages
  {
    type: 'prefetch',
    href: '/search',
    as: 'document',
  },
];

/**
 * Module preload hints - for ES modules
 */
export const modulePreloadHints: ResourceHint[] = [
  // Critical JS chunks
  {
    type: 'modulepreload',
    href: '/_next/static/chunks/main.js',
  },
  {
    type: 'modulepreload',
    href: '/_next/static/chunks/framework.js',
  },
  {
    type: 'modulepreload',
    href: '/_next/static/chunks/webpack.js',
  },
];

/**
 * Route-specific resource hints
 * Add route-specific hints for critical pages
 */
export const routeHints: Record<string, ResourceHint[]> = {
  '/': [
    // Homepage - preload hero image, critical fonts
    {
      type: 'preload',
      href: 'https://ik.imagekit.io/wakefit/home-hero.webp',
      as: 'image',
      fetchpriority: 'high',
    },
    {
      type: 'prefetch',
      href: '/products',
      as: 'document',
    },
  ],
  
  '/products': [
    // Product listing - prefetch product images, category data
    {
      type: 'prefetch',
      href: '/api/categories',
      as: 'fetch',
      crossorigin: 'anonymous',
    },
    {
      type: 'prefetch',
      href: '/products/[slug]',
      as: 'document',
    },
  ],
  
  '/products/[slug]': [
    // Product detail - preload gallery images, prefetch checkout
    {
      type: 'preload',
      href: 'https://ik.imagekit.io/wakefit/product-gallery-1.webp',
      as: 'image',
      fetchpriority: 'high',
    },
    {
      type: 'prefetch',
      href: '/cart',
      as: 'document',
    },
    {
      type: 'prefetch',
      href: '/checkout',
      as: 'document',
    },
  ],
  
  '/cart': [
    // Cart - prefetch checkout
    {
      type: 'prefetch',
      href: '/checkout',
      as: 'document',
    },
    {
      type: 'prefetch',
      href: '/api/shipping-methods',
      as: 'fetch',
      crossorigin: 'anonymous',
    },
  ],
  
  '/checkout': [
    // Checkout - preload payment SDK, prefetch order confirmation
    {
      type: 'preconnect',
      href: 'https://api.razorpay.com',
      crossorigin: 'anonymous',
    },
    {
      type: 'prefetch',
      href: '/orders/[id]',
      as: 'document',
    },
  ],
  
  '/search': [
    // Search - prefetch results API
    {
      type: 'prefetch',
      href: '/api/search',
      as: 'fetch',
      crossorigin: 'anonymous',
    },
  ],
  
  '/account': [
    // Account - prefetch orders, profile
    {
      type: 'prefetch',
      href: '/api/user/orders',
      as: 'fetch',
      crossorigin: 'anonymous',
    },
    {
      type: 'prefetch',
      href: '/api/user/profile',
      as: 'fetch',
      crossorigin: 'anonymous',
    },
  ],
};

/**
 * Generate resource hint link tags
 */
export function generateResourceHintLinks(hints: ResourceHint[]): string {
  return hints
    .map((hint) => {
      const attrs: string[] = [`rel="${hint.type}"`, `href="${hint.href}"`];
      
      if (hint.as) attrs.push(`as="${hint.as}"`);
      if (hint.crossorigin) attrs.push(`crossorigin="${hint.crossorigin}"`);
      if (hint.type) attrs.push(`type="${hint.type}"`);
      if (hint.media) attrs.push(`media="${hint.media}"`);
      if (hint.fetchpriority) attrs.push(`fetchpriority="${hint.fetchpriority}"`);
      if (hint.integrity) attrs.push(`integrity="${hint.integrity}"`);
      if (hint.referrerpolicy) attrs.push(`referrerpolicy="${hint.referrerpolicy}"`);
      if (hint.sizes) attrs.push(`sizes="${hint.sizes}"`);
      if (hint.imagesrcset) attrs.push(`imagesrcset="${hint.imagesrcset}"`);
      if (hint.imagesizes) attrs.push(`imagesizes="${hint.imagesizes}"`);
      
      return `<link ${attrs.join(' ')} />`;
    })
    .join('\n');
}

/**
 * Get all resource hints for a route
 */
export function getResourceHintsForRoute(pathname: string): ResourceHint[] {
  const hints: ResourceHint[] = [
    ...preconnectHints,
    ...dnsPrefetchHints,
    ...preloadHints,
    ...modulePreloadHints,
  ];
  
  // Add route-specific hints
  for (const [pattern, routeHints] of Object.entries(routeHints)) {
    const regex = patternToRegex(pattern);
    if (regex.test(pathname)) {
      hints.push(...routeHints);
    }
  }
  
  // Add prefetch hints for all routes
  hints.push(...prefetchHints);
  
  return hints;
}

/**
 * Convert route pattern to regex
 */
function patternToRegex(pattern: string): RegExp {
  const regexPattern = pattern
    .replace(/\[([^\]]+)\]/g, '([^/]+)')  // [slug] -> ([^/]+)
    .replace(/\*/g, '.*');                 // * -> .*
  return new RegExp(`^${regexPattern}$`);
}

/**
 * Generate resource hints metadata for Next.js layout
 */
export function generateResourceHintsMetadata(pathname: string): Metadata {
  const hints = getResourceHintsForRoute(pathname);
  
  return {
    other: {
      'link': hints.map(hint => ({
        rel: hint.type,
        href: hint.href,
        ...(hint.as && { as: hint.as }),
        ...(hint.crossorigin && { crossorigin: hint.crossorigin }),
        ...(hint.type && { type: hint.type }),
        ...(hint.media && { media: hint.media }),
        ...(hint.fetchpriority && { fetchpriority: hint.fetchpriority }),
        ...(hint.integrity && { integrity: hint.integrity }),
        ...(hint.referrerpolicy && { referrerpolicy: hint.referrerpolicy }),
        ...(hint.sizes && { sizes: hint.sizes }),
        ...(hint.imagesrcset && { imagesrcset: hint.imagesrcset }),
        ...(hint.imagesizes && { imagesizes: hint.imagesizes }),
      })),
    },
  };
}

/**
 * Resource hints React component for client-side injection
 */
export function ResourceHints({ 
  pathname, 
  hints = getResourceHintsForRoute(pathname) 
}: { 
  pathname: string; 
  hints?: ResourceHint[];
}) {
  if (typeof window === 'undefined') {
    // Server-side: render as link tags
    return (
      <>
        {hints.map((hint, index) => (
          <link
            key={index}
            rel={hint.type}
            href={hint.href}
            as={hint.as}
            crossOrigin={hint.crossorigin}
            type={hint.type}
            media={hint.media}
            fetchPriority={hint.fetchpriority}
            integrity={hint.integrity}
            referrerPolicy={hint.referrerpolicy}
            sizes={hint.sizes}
            imageSrcSet={hint.imagesrcset}
            imageSizes={hint.imagesizes}
          />
        ))}
      </>
    );
  }
  
  // Client-side: inject dynamically
  useEffect(() => {
    const existingHrefs = new Set(
      Array.from(document.querySelectorAll('link[rel]')).map(link => link.href)
    );
    
    hints.forEach(hint => {
      if (!existingHrefs.has(hint.href)) {
        const link = document.createElement('link');
        link.rel = hint.type;
        link.href = hint.href;
        if (hint.as) link.as = hint.as;
        if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
        if (hint.type) link.type = hint.type;
        if (hint.media) link.media = hint.media;
        if (hint.fetchpriority) link.fetchPriority = hint.fetchpriority;
        if (hint.integrity) link.integrity = hint.integrity;
        if (hint.referrerpolicy) link.referrerPolicy = hint.referrerpolicy;
        if (hint.sizes) link.sizes = hint.sizes;
        if (hint.imagesrcset) link.setAttribute('imagesrcset', hint.imagesrcset);
        if (hint.imagesizes) link.setAttribute('imagesizes', hint.imagesizes);
        document.head.appendChild(link);
      }
    });
  }, [pathname, hints]);
  
  return null;
}

import { useEffect } from 'react';

/**
 * Critical resource hints that should be in <head> immediately
 */
export const criticalResourceHints = [
  // Must be in <head> before any other resources
  { type: 'preconnect', href: 'https://ik.imagekit.io', crossorigin: 'anonymous' },
  { type: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
  { type: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
  { type: 'dns-prefetch', href: 'https://www.google-analytics.com' },
];

/**
 * Non-critical resource hints that can be deferred
 */
export const deferredResourceHints = [
  { type: 'preconnect', href: 'https://connect.facebook.net', crossorigin: 'anonymous' },
  { type: 'dns-prefetch', href: 'https://snap.licdn.com' },
  { type: 'dns-prefetch', href: 'https://px.ads.linkedin.com' },
  { type: 'prefetch', href: '/cart', as: 'document' },
  { type: 'prefetch', href: '/checkout', as: 'document' },
];

/**
 * Inject resource hints into document head
 * Call this early in layout.tsx
 */
export function injectResourceHints(
  hints: ResourceHint[] = [...criticalResourceHints, ...deferredResourceHints]
): void {
  if (typeof document === 'undefined') return;
  
  const existingHrefs = new Set(
    Array.from(document.querySelectorAll('link[rel]')).map(link => link.href)
  );
  
  hints.forEach(hint => {
    if (!existingHrefs.has(hint.href)) {
      const link = document.createElement('link');
      link.rel = hint.type;
      link.href = hint.href;
      if (hint.as) link.as = hint.as;
      if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
      if (hint.type) link.type = hint.type;
      if (hint.media) link.media = hint.media;
      if (hint.fetchpriority) link.fetchPriority = hint.fetchpriority;
      if (hint.integrity) link.integrity = hint.integrity;
      if (hint.referrerpolicy) link.referrerPolicy = hint.referrerpolicy;
      document.head.appendChild(link);
    });
  });
}

/**
 * Performance observer for resource hints effectiveness
 */
export function observeResourceHints(): PerformanceObserver | null {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return null;
  
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          // Check if resource had preconnect/dns-prefetch benefit
          if (resource.connectStart > 0 && resource.domainLookupStart > 0) {
            const dnsTime = resource.domainLookupEnd - resource.domainLookupStart;
            const connectTime = resource.connectEnd - resource.connectStart;
            const sslTime = resource.connectEnd - resource.secureConnectionStart;
            
            console.debug(`Resource: ${resource.name}`, {
              dns: `${dnsTime.toFixed(1)}ms`,
              connect: `${connectTime.toFixed(1)}ms`,
              ssl: `${sslTime.toFixed(1)}ms`,
              total: `${resource.duration.toFixed(1)}ms`,
            });
          }
        }
      }
    });
    
    observer.observe({ type: 'resource', buffered: true });
    return observer;
  } catch (e) {
    console.warn('Resource hints observer not supported:', e);
    return null;
  }
}

/**
 * Preload critical resources dynamically
 */
export function preloadCriticalResources(
  resources: Array<{ href: string; as: string; type?: string; crossorigin?: string }>
): Promise<void[]> {
  return Promise.all(
    resources.map(({ href, as, type, crossorigin }) => {
      return new Promise<void>((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        if (type) link.type = type;
        if (crossorigin) link.crossOrigin = crossorigin;
        
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to preload: ${href}`));
        
        document.head.appendChild(link);
      });
    })
  );
}

/**
 * Prefetch next page resources
 */
export function prefetchNextPage(pathname: string): void {
  const route = routeHints[pathname];
  if (route) {
    const prefetches = route.filter(h => h.type === 'prefetch');
    injectResourceHints(prefetches);
  }
}

export default {
  preconnectHints,
  dnsPrefetchHints,
  preloadHints,
  prefetchHints,
  modulePreloadHints,
  routeHints,
  generateResourceHintLinks,
  getResourceHintsForRoute,
  generateResourceHintsMetadata,
  ResourceHints,
  criticalResourceHints,
  deferredResourceHints,
  injectResourceHints,
  observeResourceHints,
  preloadCriticalResources,
  prefetchNextPage,
};