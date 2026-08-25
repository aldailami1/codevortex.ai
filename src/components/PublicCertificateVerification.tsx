'use client';

import React, { useEffect, useState } from 'react';
import { Award, Check, CheckCircle2, Copy, ExternalLink, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { Language } from '@/types';

interface VerificationResult {
  verified: boolean;
  status: 'valid' | 'invalid_id' | 'not_found' | 'revoked' | 'registry_unavailable' | 'error';
  certificateId: string;
  studentName?: string;
  courseTitleEn?: string;
  courseTitleAr?: string;
  issueDate?: string;
  score?: number;
}

interface PublicCertificateVerificationProps {
  certificateId?: string;
  language?: Language;
}

export const PublicCertificateVerification: React.FC<PublicCertificateVerificationProps> = ({ certificateId = '', language = 'en' }) => {
  const isAr = language === 'ar';
  const [query, setQuery] = useState(certificateId);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(certificateId));
  const [copied, setCopied] = useState(false);

  const verify = async (id: string) => {
    const normalized = id.trim().toUpperCase();
    if (!normalized) return;
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch(`/api/verify/${encodeURIComponent(normalized)}`);
      const data = await response.json();
      setResult(data as VerificationResult);
    } catch {
      setResult({ verified: false, status: 'error', certificateId: normalized });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) void verify(certificateId);
  }, [certificateId]);

  const publicUrl = typeof window !== 'undefined' && result?.certificateId ? `${window.location.origin}/verify/${encodeURIComponent(result.certificateId)}` : '';
  const statusCopy: Record<VerificationResult['status'], { en: string; ar: string }> = {
    valid: { en: 'Verified credential', ar: 'شهادة موثقة' },
    invalid_id: { en: 'The certificate ID format is not valid.', ar: 'صيغة معرف الشهادة غير صالحة.' },
    not_found: { en: 'No matching certificate was found.', ar: 'لم نعثر على شهادة مطابقة.' },
    revoked: { en: 'This certificate has been revoked.', ar: 'تم إلغاء هذه الشهادة.' },
    registry_unavailable: { en: 'The public registry is not connected yet. Configure the certificate registry before publishing official records.', ar: 'سجل الشهادات العام غير موصول بعد. يجب تهيئة السجل قبل نشر السجلات الرسمية.' },
    error: { en: 'Verification is temporarily unavailable. Please try again.', ar: 'التحقق غير متاح مؤقتاً. يرجى المحاولة مرة أخرى.' },
  };

  const copyUrl = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(0,242,254,0.12),transparent_36%),#080B14] px-4 py-10 text-slate-100 sm:px-6 lg:px-8 lg:py-20" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="mx-auto max-w-3xl text-center"><div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-amber-300/40 bg-gradient-to-br from-cyan-300 via-blue-600 to-amber-400 text-slate-950 shadow-[0_8px_0_rgba(146,64,14,0.6),0_18px_35px_rgba(0,242,254,0.2)]"><ShieldCheck className="h-8 w-8" /></div><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">CloudForge International Engineering Academy</p><h1 className="mt-4 text-3xl font-black text-white sm:text-5xl">{isAr ? 'التحقق العام من الشهادة' : 'Public certificate verification'}</h1><p className="mt-4 text-sm leading-7 text-slate-400">{isAr ? 'أدخل معرف الشهادة لمطابقة السجل المنشور والتحقق من حالة الاعتماد.' : 'Enter a certificate ID to match the published registry record and confirm its credential status.'}</p></header>

        <form onSubmit={(event) => { event.preventDefault(); void verify(query); }} className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 shadow-2xl backdrop-blur-md sm:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 rtl:left-auto rtl:right-3" /><input value={query} onChange={(event) => setQuery(event.target.value)} dir="ltr" aria-label={isAr ? 'معرف الشهادة' : 'Certificate ID'} placeholder="CF-8890-X26" className="min-h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-10 text-sm font-mono text-white outline-none focus:border-cyan-300" /></div><button type="submit" disabled={isLoading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 text-xs font-black text-slate-950 hover:bg-cyan-200 disabled:opacity-50"><Search className="h-4 w-4" />{isLoading ? (isAr ? 'جارٍ التحقق...' : 'Verifying...') : (isAr ? 'تحقق الآن' : 'Verify now')}</button></form>

        {result && <section className={`mx-auto max-w-3xl rounded-3xl border p-6 shadow-2xl sm:p-8 ${result.verified ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-amber-400/30 bg-slate-900/80'}`}><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-start gap-3"><div className={`rounded-2xl p-3 ${result.verified ? 'bg-emerald-300 text-slate-950' : 'bg-amber-300 text-slate-950'}`}>{result.verified ? <CheckCircle2 className="h-6 w-6" /> : <Award className="h-6 w-6" />}</div><div><p className={`text-xs font-black uppercase tracking-wider ${result.verified ? 'text-emerald-300' : 'text-amber-300'}`}>{statusCopy[result.status][isAr ? 'ar' : 'en']}</p><h2 className="mt-2 text-xl font-black text-white">{result.certificateId || query}</h2></div></div>{result.verified && <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase text-emerald-200"><Sparkles className="h-3.5 w-3.5" /> {isAr ? 'سجل صالح' : 'Valid record'}</span>}</div>{result.verified ? <div className="mt-7 grid gap-4 border-t border-slate-800 pt-6 sm:grid-cols-2"><div><p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{isAr ? 'حامل الشهادة' : 'Credential holder'}</p><p className="mt-2 text-lg font-black text-white">{result.studentName}</p></div><div><p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{isAr ? 'المؤهل المهني' : 'Professional title'}</p><p className="mt-2 text-sm font-bold text-cyan-200">Certified Cloud Automation &amp; Full-Stack AI Engineer</p></div><div><p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{isAr ? 'المسار' : 'Learning path'}</p><p className="mt-2 text-sm font-bold text-slate-200">{isAr ? result.courseTitleAr : result.courseTitleEn}</p></div><div><p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{isAr ? 'التاريخ والنتيجة' : 'Date and score'}</p><p className="mt-2 text-sm font-bold text-slate-200">{result.issueDate} · {result.score}%</p></div></div> : <p className="mt-5 border-t border-slate-800 pt-5 text-sm leading-7 text-slate-400">{statusCopy[result.status][isAr ? 'ar' : 'en']}</p>}{result.verified && <div className="mt-7 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between"><code className="break-all text-xs text-slate-500">{publicUrl}</code><button onClick={() => void copyUrl()} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-xs font-black text-cyan-200 hover:bg-cyan-400/20">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ رابط التحقق' : 'Copy verification link')}</button></div>}</section>}

        <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 text-center text-xs text-slate-500"><ExternalLink className="h-3.5 w-3.5" />{isAr ? 'لا يعرض هذا المسار سجلاً صالحاً إلا بعد ربط سجل الشهادات العام.' : 'This page displays a valid record only after the public certificate registry is connected.'}</div>
      </div>
    </main>
  );
};
