import React from 'react';

export const metadata = {
  title: 'CloudForge - AI-Native Cloud Building & Automation Engine',
  description: 'AI-Native Cloud Building Engine with Schema Architect, Live Build Logs, and Supabase RLS.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0B0F19] text-slate-100 font-sans min-h-screen antialiased selection:bg-cyan-500 selection:text-slate-950">
        <div id="app-root" className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
