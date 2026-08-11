import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="text-7xl font-black bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] bg-clip-text text-transparent">
        404
      </div>
      <h1 className="text-2xl font-black">Page not found</h1>
      <p className="text-slate-400 max-w-md text-sm">
        The page you are looking for does not exist or was moved. CloudForge lives on a
        single-page console — head back to the landing page.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all"
      >
        ← Back to CloudForge
      </Link>
    </main>
  );
}
