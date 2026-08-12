/**
 * CloudForge — High-Performance Next.js Configuration
 * ------------------------------------------------------------------
 * - Optimized bundle imports for ultra-fast load times.
 * - Long-term browser caching & Edge headers.
 * - Unoptimized remote image fallbacks for zero build-time delay.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // تسريع واضغط معالجة الكود باستخدام محرك SWC
  swcMinify: true,

  // تحسين استيراد الحزم الثقيلة لتقليل حجم الـ Bundle
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@supabase/supabase-js',
      'framer-motion',
      'lodash',
    ],
  },

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // حفظ الصور في الكاش لمدة سنة
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // تخزين مؤقت فائق السرعة للملفات الثابتة والخطوط
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
