'use client';

import React, { useState } from 'react';
import { Language, ViewMode } from '@/types';
import { useTranslation } from '@/lib/translations';
import { BookOpen, CheckCircle2, Code2, Github, Lock, MessageSquare, ShieldCheck, Twitter, Linkedin, X } from 'lucide-react';

interface FooterProps {
  language: Language;
  onSelectView: (view: ViewMode) => void;
}

const linkClass = 'text-start text-xs text-slate-400 transition hover:text-cyan-300';

export const Footer: React.FC<FooterProps> = ({ language, onSelectView }) => {
  const isAr = language === 'ar';
  const t = useTranslation(language);
  const [showCookieNotice, setShowCookieNotice] = useState(false);

  const groups = [
    {
      title: 'CORE ENGINE',
      titleAr: 'المحرك الأساسي',
      icon: Code2,
      color: 'text-cyan-300',
      links: [
        { label: isAr ? 'الرئيسية' : 'Home', view: 'landing' as ViewMode },
        { label: isAr ? 'محطة العمل' : 'Workstation', view: 'workspace' as ViewMode },
        { label: isAr ? 'منشئ المخطط' : 'Schema Builder', view: 'cloudforge' as ViewMode },
        { label: isAr ? 'مركز القيادة' : 'Control Center', view: 'control-center' as ViewMode },
      ],
    },
    {
      title: 'ECOSYSTEM',
      titleAr: 'المنظومة',
      icon: SparkleIcon,
      color: 'text-violet-300',
      links: [
        { label: isAr ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant', view: 'chat' as ViewMode },
        { label: isAr ? 'السوق' : 'Marketplace', view: 'marketplace' as ViewMode },
        { label: isAr ? 'الأكاديمية' : 'Academy', view: 'academy' as ViewMode },
      ],
    },
    {
      title: 'RESOURCES',
      titleAr: 'المصادر',
      icon: BookOpen,
      color: 'text-emerald-300',
      links: [
        { label: isAr ? 'التوثيق' : 'Documentation', view: 'changelog' as ViewMode },
        { label: isAr ? 'المجتمع' : 'Community', view: 'community' as ViewMode },
        { label: isAr ? 'الدعم' : 'Support', view: 'support' as ViewMode },
      ],
    },
  ];

  return (
    <footer className="w-full overflow-x-hidden border-t border-slate-800/80 bg-[#0B0F19] px-4 pb-8 pt-12 font-sans text-slate-400 sm:px-6 lg:px-8 lg:pt-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 lg:grid-cols-12">
        <div className="col-span-2 space-y-4 lg:col-span-4">
          <button onClick={() => onSelectView('landing')} className="flex items-center gap-3 text-start">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-cyan-300 via-blue-600 to-violet-600 text-slate-950 shadow-lg shadow-cyan-500/20">✦</span>
            <span><strong className="block bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-xl font-black text-transparent">CloudForge</strong><span className="block text-[10px] font-bold text-slate-500">{t('cloudForgeSub')}</span></span>
          </button>
          <p className="max-w-sm text-xs leading-6 text-slate-400">{t('footerDesc')}</p>
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-[10px] font-bold text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-300" />{isAr ? 'الخدمات الأساسية تعمل' : 'Core services operational'}</div>
        </div>

        {groups.map((group) => { const Icon = group.icon; return <div key={group.title} className="col-span-1 space-y-4 lg:col-span-2"><h2 className="flex items-center gap-2 text-[10px] font-black tracking-[0.14em] text-slate-100"><Icon className={`h-4 w-4 ${group.color}`} />{isAr ? group.titleAr : group.title}</h2><nav className="space-y-3">{group.links.map((link) => <button key={link.label} onClick={() => onSelectView(link.view)} className={linkClass}>{link.label}</button>)}</nav></div>; })}

        <div className="col-span-2 space-y-4 lg:col-span-2"><h2 className="flex items-center gap-2 text-[10px] font-black tracking-[0.14em] text-slate-100"><ShieldCheck className="h-4 w-4 text-amber-300" />{isAr ? 'الأمان' : 'SECURITY'}</h2><div className="space-y-3 text-xs"><button onClick={() => onSelectView('privacy')} className="flex items-center gap-2 text-start text-slate-300 hover:text-amber-200"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{isAr ? 'ضوابط SOC 2' : 'SOC 2 controls'}</button><button onClick={() => onSelectView('privacy')} className="flex items-center gap-2 text-start text-slate-300 hover:text-cyan-200"><Lock className="h-4 w-4 text-cyan-300" />{isAr ? 'تشفير البيانات' : 'Data encryption'}</button><button onClick={() => onSelectView('privacy')} className={linkClass}>{isAr ? 'سياسة الخصوصية' : 'Privacy policy'}</button></div></div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-7xl flex-col gap-5 border-t border-slate-800 pt-6 text-[11px] text-slate-500 lg:flex-row lg:items-center lg:justify-between"><div>© 2026 CloudForge. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</div><div className="flex flex-wrap items-center gap-3"><button onClick={() => onSelectView('privacy')} className="hover:text-slate-300">{t('privacyPolicy')}</button><span>·</span><button onClick={() => onSelectView('privacy')} className="hover:text-slate-300">{t('termsOfService')}</button><span>·</span><button onClick={() => setShowCookieNotice((current) => !current)} className="hover:text-slate-300">{isAr ? 'إعدادات ملفات الارتباط' : 'Cookie settings'}</button></div><div className="flex items-center gap-2"><a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="rounded-xl border border-slate-800 bg-slate-900 p-2 hover:border-cyan-400 hover:text-cyan-300"><Github className="h-4 w-4" /></a><a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="rounded-xl border border-slate-800 bg-slate-900 p-2 hover:border-cyan-400 hover:text-cyan-300"><Twitter className="h-4 w-4" /></a><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-xl border border-slate-800 bg-slate-900 p-2 hover:border-cyan-400 hover:text-cyan-300"><Linkedin className="h-4 w-4" /></a><a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="rounded-xl border border-slate-800 bg-slate-900 p-2 hover:border-cyan-400 hover:text-cyan-300"><MessageSquare className="h-4 w-4" /></a></div></div>

      {showCookieNotice && <div className="mx-auto mt-4 flex w-full max-w-7xl items-start justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-xs text-slate-400"><span>{isAr ? 'تستخدم CloudForge ملفات الارتباط الأساسية لاستمرارية الجلسة والأمان.' : 'CloudForge uses essential cookies for session continuity and security.'}</span><button onClick={() => setShowCookieNotice(false)} aria-label={isAr ? 'إغلاق' : 'Close'} className="rounded-lg p-1 text-slate-400 hover:text-white"><X className="h-4 w-4" /></button></div>}
    </footer>
  );
};

function SparkleIcon({ className }: { className?: string }) {
  return <SparklesGlyph className={className} />;
}

function SparklesGlyph({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5L12 3Z" /><path d="m19 15-.7 2.3L16 18l2.3.7L19 21l.7-2.3L22 18l-2.3-.7L19 15Z" /></svg>;
}
