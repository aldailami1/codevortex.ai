/**
 * CloudForge — Next.js Configuration (Vercel / Netlify ready)
 * ------------------------------------------------------------------
 * - images.unoptimized: the app renders remote <img> tags (Unsplash);
 *   this disables the Next.js image optimizer so no remote-pattern or
 *   sharp dependency is required at build time on Vercel.
 * - reactStrictMode: keep for production-grade behavior.
 * - poweredByHeader: minimal information disclosure.
 * - output: standard (SSR + serverless API routes). Do NOT switch to
 *   `output: 'export'` — the /api/* route handlers need a server.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  compress: true,
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
    ];
  },
};

export default nextConfig;
