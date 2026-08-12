import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';

// تحميل خط Cairo محلياً عبر Next.js لتجنب حظر العرض وتسريع فتح الصفحة
const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-cairo',
});

/**
 * CloudForge — Root Layout
 * Full SEO metadata, Cairo font optimization, dark theme shell.
 */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://cloudforge.app'
  ),
  title: {
    default: 'CloudForge — AI-Native Cloud Building & Automation Engine',
    template: '%s | CloudForge',
  },
  description:
    'CloudForge is the all-in-one AI cloud workstation: generate full-stack apps, live previews, Supabase schemas, and one-click deployments to Vercel & Netlify in minutes.',
  keywords: [
    'CloudForge',
    'AI cloud development',
    'cloud building engine',
    'Supabase',
    'Vercel',
    'Netlify',
    'SaaS builder',
    'no-code',
    'full-stack generator',
  ],
  authors: [{ name: 'CloudForge' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
    url: '/',
    siteName: 'CloudForge',
    title: 'CloudForge — Build, Deploy & Scale Cloud Apps at the Speed of AI',
    description:
      'Generate full-stack apps, live previews, Supabase schemas, and one-click deployments in minutes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudForge — AI-Native Cloud Building Engine',
    description:
      'Generate, preview, deploy, and scale cloud applications at the speed of AI.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0F19',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`dark ${cairo.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* تسريع الاتصال بالخوادم الخارجية الأساسية */}
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="dns-prefetch" href="https://vercel.com" />
      </head>
      <body className={`${cairo.className} bg-[#0B0F19] text-slate-100 font-sans min-h-screen antialiased selection:bg-cyan-500 selection:text-slate-950`}>
        <div id="app-root" className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
