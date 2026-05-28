/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'pub-3b2faf4e0ab04a05907f60ff781623b7.r2.dev' },
    ],
  },

  async headers() {
    // In development, Next.js uses eval() for source maps (hot reload).
    // Strict CSP blocks eval() and breaks interactivity. Only apply in production.
    if (process.env.NODE_ENV === 'development') return []

    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Disallow embedding in iframes (clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Control referrer info sent to external sites
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=()',
          },
          // Force HTTPS for 1 year (Vercel already enforces HTTPS, belt-and-suspenders)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // Content Security Policy
          // Note: 'unsafe-inline' for scripts is required by Next.js App Router (inline hydration chunks).
          // 'unsafe-eval' removed — framer-motion and mapbox work without it in production builds.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js injects inline scripts for hydration; GA4 loaded from googletagmanager
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
              // Tailwind, framer-motion, mapbox all use inline styles; Google Fonts stylesheet
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com",
              // Images: local + unsplash + wikimedia + mapbox tiles + data URIs
              "img-src 'self' data: blob: https://images.unsplash.com https://upload.wikimedia.org https://*.mapbox.com https://*.tiles.mapbox.com https://pub-3b2faf4e0ab04a05907f60ff781623b7.r2.dev",
              "font-src 'self' https://fonts.gstatic.com",
              // API calls: Supabase + Mapbox
              "connect-src 'self' https://*.supabase.co https://api.mapbox.com https://events.mapbox.com https://*.tiles.mapbox.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
              // Videos from R2 CDN
              "media-src 'self' https://pub-3b2faf4e0ab04a05907f60ff781623b7.r2.dev",
              // Workers: Next.js + Mapbox use blob workers
              "worker-src blob:",
              // No plugins, no object embeds
              "object-src 'none'",
              // No iframes
              "frame-src 'none'",
              "frame-ancestors 'none'",
              // Base URI restricted to self
              "base-uri 'self'",
              // All form submissions go to self
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
