import type { Metadata, Viewport } from 'next';
import './globals.css';

/**
 * CloudForge — Root Layout
 * Full SEO metadata, Cairo font, dark theme shell.
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
    <html lang="en" dir="ltr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-[#0B0F19] text-slate-100 font-sans min-h-screen antialiased selection:bg-cyan-500 selection:text-slate-950">
        <div id="app-root" className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
