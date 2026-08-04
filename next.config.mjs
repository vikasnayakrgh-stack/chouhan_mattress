/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/lib/assets/imageLoader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: '*.imagekit.io',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    // In production we lock the app into its own frame. In non-production
    // (local dev, StackBlitz / WebContainer preview) we relax frame
    // restrictions so the app can render inside an embedded preview iframe
    // and the preview doesn't fail with "workspace failed to render".
    const isProd = process.env.NODE_ENV === 'production';
    const frameOptions = isProd ? 'DENY' : 'SAMEORIGIN';
    const frameAncestors = isProd ? "'none'" : "'self' *";
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: frameOptions,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "img-src 'self' data: blob: https://ik.imagekit.io https://*.imagekit.io https://hcfcpkldxegalkrwngog.supabase.co",
              "connect-src 'self' https://hcfcpkldxegalkrwngog.supabase.co https://*.supabase.co wss://*.supabase.co",
              `frame-ancestors ${frameAncestors}`,
            ].join('; '),
          },
        ],
      },
    ];
  },
}

export default nextConfig