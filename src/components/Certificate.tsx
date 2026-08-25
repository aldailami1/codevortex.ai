'use client';

import React, { useMemo, useState } from 'react';
import { CertificateRecord } from '@/types/academy';
import { Award, Check, CheckCircle2, Copy, Download, Edit3, Linkedin, Printer, ShieldCheck, Sparkles, Twitter, X } from 'lucide-react';

interface CertificateProps {
  certificate: CertificateRecord;
  isArabic: boolean;
  onUpdateStudentName?: (newName: string) => void;
}

const professionalTitle = 'Certified Cloud Automation & Full-Stack AI Engineer';

export const Certificate: React.FC<CertificateProps> = ({ certificate, isArabic, onUpdateStudentName }) => {
  const [studentName, setStudentName] = useState(certificate.studentName || 'CloudForge Learner');
  const [isEditingName, setIsEditingName] = useState(false);
  const [copied, setCopied] = useState(false);
  const verificationUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cloudforge.app';
    return `${origin}/verify/${encodeURIComponent(certificate.verificationCode)}`;
  }, [certificate.verificationCode]);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(verificationUrl)}`;

  const handleSaveName = () => {
    setIsEditingName(false);
    onUpdateStudentName?.(studentName);
  };

  const handlePrint = () => {
    const previousTitle = document.title;
    document.title = `CloudForge-Certificate-${certificate.verificationCode}`;
    window.print();
    window.setTimeout(() => { document.title = previousTitle; }, 1000);
  };

  const handleCopyVerification = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const shareLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}`, '_blank', 'noopener,noreferrer');
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I earned ${professionalTitle} at CloudForge International Engineering Academy.`)}&url=${encodeURIComponent(verificationUrl)}`, '_blank', 'noopener,noreferrer');

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 print:max-w-none print:p-0">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl print:hidden sm:flex-row sm:items-center"><div className="flex items-center gap-3"><div className="rounded-xl bg-amber-400/10 p-2 text-amber-300"><Award className="h-5 w-5" /></div><div><h2 className="text-sm font-black text-white">{isArabic ? 'شهادة CloudForge الرقمية الموثقة' : 'Verified CloudForge Digital Certificate'}</h2><p className="text-xs text-slate-400">{isArabic ? 'تحقق عام، QR، مشاركة اجتماعية، وتصدير PDF' : 'Public verification, QR, social sharing, and PDF export'}</p></div></div><div className="flex flex-wrap gap-2"><button onClick={() => setIsEditingName((value) => !value)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-200 hover:border-cyan-300"><Edit3 className="h-3.5 w-3.5 text-cyan-300" />{isArabic ? 'تعديل الاسم' : 'Edit name'}</button><button onClick={handlePrint} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 px-3 py-2 text-xs font-black text-slate-950"><Download className="h-3.5 w-3.5" />{isArabic ? 'تحميل PDF' : 'Download PDF'}</button><button onClick={shareLinkedIn} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-3 py-2 text-xs font-bold text-sky-200"><Linkedin className="h-3.5 w-3.5" />LinkedIn</button><button onClick={shareTwitter} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-200"><Twitter className="h-3.5 w-3.5" />X</button></div></div>

      {isEditingName && <div className="flex flex-col gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-4 print:hidden sm:flex-row"><input value={studentName} onChange={(event) => setStudentName(event.target.value)} dir="auto" className="min-h-11 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none focus:border-cyan-300" placeholder={isArabic ? 'اسم الطالب الكامل' : 'Full student name'} /><button onClick={handleSaveName} className="min-h-11 rounded-xl bg-cyan-300 px-4 text-xs font-black text-slate-950">{isArabic ? 'حفظ الاسم' : 'Save name'}</button></div>}

      <div id="official-certificate" className="relative overflow-hidden rounded-2xl border-2 border-cyan-400 bg-[radial-gradient(circle_at_15%_15%,rgba(0,242,254,0.16),transparent_26%),radial-gradient(circle_at_85%_80%,rgba(245,158,11,0.15),transparent_28%),linear-gradient(135deg,#050914,#0b1224_48%,#070b15)] p-5 text-slate-100 shadow-[0_25px_90px_rgba(0,0,0,0.5)] sm:p-8 md:p-12 print:rounded-none print:border-black print:bg-white print:p-8 print:text-black print:shadow-none">
        <div className="pointer-events-none absolute inset-3 rounded-xl border border-amber-400/40 sm:inset-5 print:border-black" />
        <div className="pointer-events-none absolute inset-5 rounded-lg border border-cyan-400/20 sm:inset-8 print:border-slate-400" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" /><div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative z-10 space-y-7 sm:space-y-10">
          <header className="flex flex-col items-center justify-between gap-5 border-b border-amber-400/25 pb-6 sm:flex-row sm:items-start print:border-black"><div className="flex items-center gap-3"><div className="grid h-14 w-14 place-items-center rounded-2xl border border-amber-300/60 bg-gradient-to-br from-cyan-300 via-blue-600 to-amber-400 text-slate-950 shadow-[0_8px_0_rgba(146,64,14,0.6),0_15px_30px_rgba(0,242,254,0.25)]"><Sparkles className="h-7 w-7" /></div><div><p className="text-lg font-black tracking-tight text-white print:text-black">CloudForge</p><p className="max-w-[14rem] text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200 print:text-black">CloudForge International Engineering Academy</p></div></div><div className="text-center sm:text-right"><p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300 print:text-black">{isArabic ? 'اعتماد رقمي' : 'DIGITAL CREDENTIAL'}</p><p className="mt-1 text-[10px] font-mono text-slate-400 print:text-black">{certificate.issueDate}</p></div></header>

          <div className="text-center"><p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-200 print:text-black">CloudForge International Engineering Academy</p><h1 className="mt-4 text-3xl font-black tracking-[0.08em] text-amber-300 sm:text-5xl print:text-black">CERTIFICATE OF PROFICIENCY &amp; COMPLETION</h1><div className="mx-auto mt-5 h-px max-w-xl bg-gradient-to-r from-transparent via-amber-300 to-transparent print:bg-black" /></div>

          <div className="mx-auto max-w-4xl space-y-4 text-center"><p className="text-sm leading-7 text-slate-300 print:text-black">This is to certify that <span className="sr-only">{studentName}</span></p><h2 className="inline-block border-b-2 border-amber-300 px-5 pb-2 text-3xl font-black text-white sm:text-5xl print:border-black print:text-black">{studentName}</h2><p className="text-sm leading-7 text-slate-300 print:text-black">has successfully passed all technical requirements and hands-on cloud architecture labs to earn the professional title:</p><div className="mx-auto inline-flex max-w-full rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-center text-base font-black text-cyan-200 shadow-inner sm:text-xl print:border-black print:bg-slate-100 print:text-black">{professionalTitle}</div><p className="pt-2 text-xs text-slate-400 print:text-black">{isArabic ? `المسار المكتمل: ${certificate.courseTitleAr}` : `Completed path: ${certificate.courseTitleEn}`}</p></div>

          <div className="grid gap-6 border-y border-amber-400/25 py-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center print:border-black"><div className="order-2 space-y-1 text-center sm:order-1"><div className="font-serif text-lg italic text-amber-200 print:text-black">Dr. Ali Muhammad Al-Dailami</div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-black">Head of Cloud Engineering</p><p className="text-[10px] text-slate-500 print:text-black">{isArabic ? 'رئيس قطاع الهندسة السحابية' : 'Cloud Engineering Sector'}</p></div><div className="order-1 flex flex-col items-center gap-3 sm:order-2"><div className="relative grid h-28 w-28 place-items-center rounded-full border-4 border-amber-300 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-800 text-slate-950 shadow-[0_8px_0_rgba(120,53,15,0.8),0_15px_35px_rgba(245,158,11,0.25)]"><div className="grid h-20 w-20 place-items-center rounded-full border-2 border-dashed border-slate-950/60"><ShieldCheck className="h-9 w-9" /><span className="absolute bottom-5 text-[8px] font-black tracking-[0.18em]">CLOUD</span></div></div><span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300 print:text-black">Gold holographic seal</span></div><div className="order-3 space-y-1 text-center"><div className="font-serif text-lg italic text-cyan-200 print:text-black">Eng. Eileen Ibrahim</div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-black">Academy Director</p><p className="text-[10px] text-slate-500 print:text-black">{isArabic ? 'مدير أكاديمية CloudForge' : 'CloudForge International Academy'}</p></div></div>

          <footer className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end"><div className="flex flex-col gap-3 text-[10px] text-slate-400 print:text-black"><div className="flex flex-wrap items-center gap-2"><span className="font-black uppercase tracking-wider text-cyan-200 print:text-black">Certificate ID</span><code className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-cyan-200 print:border-black print:bg-white print:text-black">{certificate.verificationCode}</code><span className="text-slate-600 print:text-black">·</span><span>{isArabic ? `النتيجة: ${certificate.score}%` : `Score: ${certificate.score}%`}</span></div><button onClick={handleCopyVerification} className="inline-flex w-fit items-center gap-2 text-start text-[10px] text-slate-400 hover:text-cyan-200 print:hidden"><Copy className="h-3.5 w-3.5" />{copied ? (isArabic ? 'تم نسخ رابط التحقق' : 'Verification link copied') : (isArabic ? 'نسخ رابط التحقق العام' : 'Copy public verification link')}</button><p className="max-w-lg leading-5">{isArabic ? 'امسح رمز QR للتحقق من معرف الشهادة عبر صفحة التحقق العامة.' : 'Scan the QR code to verify this credential through the public verification page.'}</p></div><div className="mx-auto w-32 rounded-xl border border-white/15 bg-white p-2 shadow-xl print:w-28"><img src={qrUrl} alt={isArabic ? 'رمز QR للتحقق من الشهادة' : 'Certificate verification QR code'} className="aspect-square w-full" referrerPolicy="no-referrer" /><p className="mt-1 break-all text-center text-[7px] font-bold text-slate-700">VERIFY</p></div></footer>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400 print:hidden"><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{isArabic ? 'المعرّف مرتبط بصفحة تحقق عامة' : 'ID is linked to a public verification page'}</span><button onClick={handlePrint} className="inline-flex items-center gap-2 text-cyan-200 hover:text-cyan-100"><Printer className="h-4 w-4" />{isArabic ? 'طباعة عالية الدقة / حفظ PDF' : 'High-resolution print / Save PDF'}</button></div>
    </section>
  );
};
