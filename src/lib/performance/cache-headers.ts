/**
 * Caching Headers Configuration
 * 
 * Provides optimal caching headers for different asset types
 * to maximize cache hits and minimize revalidation requests.
 * 
 * Wakefit uses: ImageKit CDN, edge caching
 * This adds: comprehensive cache-control headers, service worker ready,
 * stale-while-revalidate, immutable caching for hashed assets
 */

export interface CacheHeadersConfig {
  /** Cache-Control header value */
  cacheControl: string;
  /** Expires header value (optional, prefer Cache-Control) */
  expires?: string;
  /** ETag configuration */
  etag?: boolean;
  /** Last-Modified configuration */
  lastModified?: boolean;
  /** Vary header */
  vary?: string;
}

/**
 * Asset type categorization for caching
 */
export type AssetType = 
  | 'html'           // HTML documents - no cache or short cache
  | 'js'             // JavaScript bundles - long cache with hashes
  | 'css'            // CSS bundles - long cache with hashes
  | 'font'           // Font files - very long cache
  | 'image'          // Images - long cache
  | 'image-optimized' // Optimized images (AVIF/WebP) - long cache
  | 'video'          // Video files - long cache
  | 'audio'          // Audio files - long cache
  | 'json'           // API responses - short cache or no cache
  | 'api'            // API endpoints - no cache or short cache
  | 'static'         // Other static assets - long cache
  | 'service-worker' // Service worker - no cache
  | 'manifest';      // Web app manifest - short cache

/**
 * Cache strategy presets
 */
export const cacheStrategies: Record<AssetType, CacheHeadersConfig> = {
  // HTML documents - always revalidate
  html: {
    cacheControl: 'public, max-age=0, must-revalidate',
    etag: true,
    lastModified: true,
  },
  
  // JavaScript bundles - immutable if hashed, otherwise long cache
  js: {
    cacheControl: 'public, max-age=31536000, immutable', // 1 year
    etag: true,
    lastModified: true,
  },
  
  // CSS bundles - immutable if hashed
  css: {
    cacheControl: 'public, max-age=31536000, immutable', // 1 year
    etag: true,
    lastModified: true,
  },
  
  // Font files - very long cache, rarely change
  font: {
    cacheControl: 'public, max-age=31536000, immutable', // 1 year
    etag: true,
    lastModified: true,
    vary: 'Accept',
  },
  
  // Images - long cache, serve from CDN
  image: {
    cacheControl: 'public, max-age=31536000, immutable', // 1 year
    etag: true,
    lastModified: true,
  },
  
  // Optimized images (AVIF/WebP from ImageKit)
  'image-optimized': {
    cacheControl: 'public, max-age=31536000, stale-while-revalidate=86400', // 1 year + 1 day SWR
    etag: true,
    lastModified: true,
  },
  
  // Video files - long cache
  video: {
    cacheControl: 'public, max-age=31536000, immutable', // 1 year
    etag: true,
    lastModified: true,
  },
  
  // Audio files - long cache
  audio: {
    cacheControl: 'public, max-age=31536000, immutable', // 1 year
    etag: true,
    lastModified: true,
  },
  
  // JSON/API responses - short cache with revalidation
  json: {
    cacheControl: 'public, max-age=300, stale-while-revalidate=600', // 5 min + 10 min SWR
    etag: true,
    lastModified: true,
    vary: 'Accept, Accept-Encoding',
  },
  
  // API endpoints - no cache by default
  api: {
    cacheControl: 'no-store, private, must-revalidate',
    etag: false,
    lastModified: false,
  },
  
  // Other static assets
  static: {
    cacheControl: 'public, max-age=31536000, immutable', // 1 year
    etag: true,
    lastModified: true,
  },
  
  // Service worker - no cache, always fresh
  'service-worker': {
    cacheControl: 'no-store, private, must-revalidate',
    etag: false,
    lastModified: false,
  },
  
  // Web app manifest - short cache
  manifest: {
    cacheControl: 'public, max-age=86400, must-revalidate', // 1 day
    etag: true,
    lastModified: true,
  },
};

/**
 * Cache headers for specific Next.js routes
 */
export const routeCacheHeaders: Record<string, CacheHeadersConfig> = {
  // Static pages - cache with revalidation
  '/': {
    cacheControl: 'public, max-age=0, stale-while-revalidate=3600, stale-if-error=86400',
    etag: true,
    lastModified: true,
  },
  
  // Product pages - cache with revalidation
  '/products': {
    cacheControl: 'public, max-age=0, stale-while-revalidate=3600, stale-if-error=86400',
    etag: true,
    lastModified: true,
  },
  
  // Product detail - cache with revalidation
  '/products/[slug]': {
    cacheControl: 'public, max-age=0, stale-while-revalidate=3600, stale-if-error=86400',
    etag: true,
    lastModified: true,
  },
  
  // Cart - no cache (user-specific)
  '/cart': {
    cacheControl: 'private, max-age=0, must-revalidate',
    etag: true,
    lastModified: true,
  },
  
  // Checkout - no cache (user-specific, sensitive)
  '/checkout': {
    cacheControl: 'no-store, private, must-revalidate',
    etag: false,
    lastModified: false,
  },
  
  // Account - no cache (user-specific)
  '/account': {
    cacheControl: 'private, max-age=0, must-revalidate',
    etag: true,
    lastModified: true,
  },
  
  // Blog - cache with revalidation
  '/blog': {
    cacheControl: 'public, max-age=0, stale-while-revalidate=3600, stale-if-error=86400',
    etag: true,
    lastModified: true,
  },
  
  // Search - short cache
  '/search': {
    cacheControl: 'public, max-age=60, stale-while-revalidate=120',
    etag: true,
    lastModified: true,
  },
  
  // API routes - no cache
  '/api': {
    cacheControl: 'no-store, private, must-revalidate',
    etag: false,
    lastModified: false,
  },
};

/**
 * Get cache headers for a specific asset type
 */
export function getCacheHeaders(assetType: AssetType): CacheHeadersConfig {
  return cacheStrategies[assetType] || cacheStrategies.static;
}

/**
 * Get cache headers for a specific route
 */
export function getRouteCacheHeaders(pathname: string): CacheHeadersConfig {
  // Exact match
  if (routeCacheHeaders[pathname]) {
    return routeCacheHeaders[pathname];
  }
  
  // Pattern match for dynamic routes
  for (const [pattern, config] of Object.entries(routeCacheHeaders)) {
    if (pattern.includes('[')) {
      const regex = new RegExp(
        '^' + pattern
          .replace(/\[([^\]]+)\]/g, '([^/]+)')
          .replace(/\*/g, '.*') + '$'
      );
      if (regex.test(pathname)) {
        return config;
      }
    }
  }
  
  // Default to HTML caching
  return cacheStrategies.html;
}

/**
 * Generate cache headers object for Next.js middleware or headers()
 */
export function generateCacheHeaders(config: CacheHeadersConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Cache-Control': config.cacheControl,
  };
  
  if (config.expires) {
    headers['Expires'] = config.expires;
  }
  
  if (config.etag === false) {
    headers['ETag'] = '';
  }
  
  if (config.lastModified === false) {
    headers['Last-Modified'] = '';
  }
  
  if (config.vary) {
    headers['Vary'] = config.vary;
  }
  
  return headers;
}

/**
 * Next.js headers() configuration
 * Add to next.config.mjs under async headers()
 */
export const nextJsHeadersConfig = [
  // Static assets with hashes - immutable cache
  {
    source: '/_next/static/:path*',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
    ],
  },
  
  // JavaScript chunks
  {
    source: '/_next/static/chunks/:path*.js',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
    ],
  },
  
  // CSS chunks
  {
    source: '/_next/static/chunks/:path*.css',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      { key: 'Content-Type', value: 'text/css; charset=utf-8' },
    ],
  },
  
  // Media files
  {
    source: '/_next/static/media/:path*',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
  },
  
  // Fonts
  {
    source: '/:path*.woff2',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ],
  },
  {
    source: '/:path*.woff',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ],
  },
  
  // Images (local)
  {
    source: '/images/:path*',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
  },
  
  // Favicon and icons
  {
    source: '/:path*.ico',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
  },
  {
    source: '/:path*.svg',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
  },
  {
    source: '/manifest.json',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' },
    ],
  },
  
  // Service worker
  {
    source: '/sw.js',
    headers: [
      { key: 'Cache-Control', value: 'no-store, private, must-revalidate' },
      { key: 'Service-Worker-Allowed', value: '/' },
    ],
  },
  
  // HTML pages - stale-while-revalidate
  {
    source: '/:path*',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=0, stale-while-revalidate=3600, stale-if-error=86400' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ],
  },
  
  // API routes - no cache
  {
    source: '/api/:path*',
    headers: [
      { key: 'Cache-Control', value: 'no-store, private, must-revalidate' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
    ],
  },
];

/**
 * Edge/CDN cache configuration
 * For ImageKit, Cloudflare, etc.
 */
export const edgeCacheConfig = {
  // Browser cache TTL
  browserTTL: 31536000, // 1 year
  
  // Edge cache TTL
  edgeTTL: 31536000, // 1 year
  
  // Stale-while-revalidate
  swr: 86400, // 1 day
  
  // Stale-if-error
  staleIfError: 604800, // 1 week
  
  // Purge cache on deploy
  purgeOnDeploy: true,
  
  // Cache tags for selective purging
  cacheTags: {
    products: 'products',
    categories: 'categories',
    blog: 'blog',
    user: 'user-specific',
    cart: 'cart',
  },
};

/**
 * Cache key configuration
 * Determines what makes a unique cache entry
 */
export const cacheKeyConfig = {
  // Include in cache key
  include: [
    'path',
    'query', // Be careful with query params
    'headers:accept',
    'headers:accept-language',
    'headers:device-type', // mobile/desktop
  ],
  
  // Exclude from cache key (normalize)
  exclude: [
    'headers:cookie', // Don't cache per-user by default
    'headers:authorization',
    'query:utm_*', // Ignore UTM parameters
    'query:fbclid',
    'query:gclid',
    'query:ref',
  ],
  
  // Normalize
  normalize: {
    // Sort query parameters
    sortQueryParams: true,
    // Lowercase path
    lowercasePath: true,
    // Remove trailing slash
    removeTrailingSlash: true,
  },
};

/**
 * Service Worker caching strategies
 */
export const swCacheStrategies = {
  // Cache first - for static assets
  staticAssets: {
    strategy: 'cache-first' as const,
    cacheName: 'static-assets-v1',
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
          // Normalize URL for cache key
          const url = new URL(request.url);
          url.search = '';
          return url.href;
        },
      },
    ],
  },
  
  // Network first - for HTML pages
  pages: {
    strategy: 'network-first' as const,
    cacheName: 'pages-v1',
    networkTimeoutSeconds: 3,
    plugins: [
      {
        fetchDidFail: async () => {
          // Return offline page
          return new Response(await caches.match('/offline.html'));
        },
      },
    ],
  },
  
  // Stale while revalidate - for API responses
  api: {
    strategy: 'stale-while-revalidate' as const,
    cacheName: 'api-v1',
    plugins: [
      {
        cacheWillUpdate: async ({ response }: { response: Response }) => {
          // Only cache successful responses
          if (response.status === 200) {
            return response;
          }
          return null;
        },
      },
    ],
  },
  
  // Image optimization - cache optimized images
  images: {
    strategy: 'cache-first' as const,
    cacheName: 'images-v1',
    plugins: [
      {
        cacheWillUpdate: async ({ response }: { response: Response }) => {
          // Cache all successful image responses
          if (response.status === 200 && response.headers.get('content-type')?.startsWith('image/')) {
            return response;
          }
          return null;
        },
      },
    ],
  },
};

/**
 * HTTP/2 and HTTP/3 specific headers
 */
export const http2Headers = {
  // Early hints for preloading
  earlyHints: {
    'Link': [
      '</_next/static/css/app.css>; rel=preload; as=style',
      '</_next/static/chunks/main.js>; rel=preload; as=script',
      '</fonts/inter-var.woff2>; rel=preload; as=font; crossorigin',
    ].join(', '),
  },
  
  // Server push hints (deprecated in HTTP/2, use preload instead)
  serverPush: {
    'Link': [
      '</_next/static/css/app.css>; rel=preload; as=style; nopush',
      '</_next/static/chunks/main.js>; rel=preload; as=script; nopush',
    ].join(', '),
  },
};

/**
 * Security headers (also affect caching behavior)
 */
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ik.imagekit.io",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com https://ik.imagekit.io",
    "connect-src 'self' https://ik.imagekit.io https://api.wakefit.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'cross-origin',
};

/**
 * Combined headers for production
 */
export const productionHeaders = {
  ...securityHeaders,
  // Cache headers applied via next.config.mjs headers()
};

export default {
  cacheStrategies,
  routeCacheHeaders,
  getCacheHeaders,
  getRouteCacheHeaders,
  generateCacheHeaders,
  nextJsHeadersConfig,
  edgeCacheConfig,
  cacheKeyConfig,
  swCacheStrategies,
  http2Headers,
  securityHeaders,
  productionHeaders,
};