'use client';

import React from 'react';
import dynamic from 'next/dynamic';

function AppSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-center p-6 space-y-4 animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-cyan-400/30 animate-ping" />
      </div>
      <div className="h-4 w-32 bg-slate-800 rounded-full" />
      <div className="h-3 w-48 bg-slate-800/60 rounded-full" />
    </div>
  );
}

const App = dynamic(() => import('@/components/App'), {
  ssr: false,
  loading: () => <AppSkeleton />,
});

export default function Page() {
  return <App />;
}
