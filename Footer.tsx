import React, { useState } from 'react';
import { Language, ViewMode } from '../types';
import { useTranslation } from '../locales/translations';
import {
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  ShieldCheck,
  Code2,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  language: Language;
  onSelectView: (view: ViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onSelectView }) => {
  const isAr = language === 'ar';
  const t = useTranslation(language);
  const [showCookieNotice, setShowCookieNotice] = useState(false);

  return (
    <footer className="bg-[#0B0F19] border-t border-slate-800/80 pt-16 pb-8 px-6 font-sans text-xs text-slate-400 relative z-30">
      {/* 5-Column Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {/* Column 1: Brand Logo & Live System Status */}
        <div className="space-y-4 lg:col-span-1">
          {/* Unified Brand Logo & Slogan */}
          <button
            onClick={() => onSelectView('landing')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00F2FE] via-blue-600 to-[#7928CA] p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all shrink-0">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center overflow-hidden">
                <svg className="w-5 h-5 text-[#00F2FE] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  <circle cx="12" cy="12" r="3" fill="#00F2FE" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col text-left rtl:text-right">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#00F2FE] bg-clip-text text-transparent">
                  CodeVortex
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/40 text-[#00F2FE] text-[9px] font-extrabold font-mono tracking-wider shadow-inner">
                  v2.4 Pro
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 -mt-0.5 tracking-tight">
                {t('vortexSub')}
              </span>
            </div>
          </button>

          <p className="text-slate-400 text-xs leading-relaxed">
            {t('footerDesc')}
          </p>

          {/* Live System Status Indicator */}
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-[11px] bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-bold">{t('systemsOperational')}</span>
          </div>
        </div>

        {/* Column 2: Products */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('footerProducts')}</span>
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => onSelectView('workspace')}
                className="hover:text-cyan-400 transition-colors text-left rtl:text-right"
              >
                {t('workstation')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('chat')}
                className="hover:text-cyan-400 transition-colors text-left rtl:text-right"
              >
                {t('aiChat')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('preview')}
                className="hover:text-cyan-400 transition-colors text-left rtl:text-right"
              >
                {t('livePreview')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('marketplace')}
                className="hover:text-cyan-400 transition-colors text-left rtl:text-right"
              >
                {t('marketplace')}
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Developers & Community */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>{t('footerDevelopers')}</span>
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => onSelectView('support')}
                className="hover:text-purple-400 transition-colors text-left rtl:text-right"
              >
                {t('support')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('community')}
                className="hover:text-purple-400 transition-colors text-left rtl:text-right flex items-center gap-1"
              >
                <span>{t('community')}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('changelog')}
                className="hover:text-purple-400 transition-colors text-left rtl:text-right"
              >
                {t('changelog')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('workspace')}
                className="hover:text-purple-400 transition-colors text-left rtl:text-right"
              >
                APIs & Cloud SDKs
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Company */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('footerCompany')}</span>
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => onSelectView('about')}
                className="hover:text-emerald-400 transition-colors text-left rtl:text-right"
              >
                {t('aboutUs')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('contact')}
                className="hover:text-emerald-400 transition-colors text-left rtl:text-right"
              >
                {t('contactUs')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('privacy')}
                className="hover:text-emerald-400 transition-colors text-left rtl:text-right"
              >
                {t('privacyPolicy')}
              </button>
            </li>
          </ul>
        </div>

        {/* Column 5: Security & Compliance */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('footerSecurity')}</span>
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => onSelectView('privacy')}
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300 font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isAr ? 'معايير SOC 2' : 'SOC 2 Type II Certified'}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('privacy')}
                className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-300 font-semibold"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{isAr ? 'تشفير البيانات 256-bit' : '256-bit Data Encryption'}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('privacy')}
                className="hover:text-amber-400 transition-colors text-left rtl:text-right"
              >
                {t('privacyPolicy')}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        {/* Copyright */}
        <div>
          © 2026 CodeVortex, Inc. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </div>

        {/* Interactive Legal Links */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button onClick={() => onSelectView('privacy')} className="hover:text-slate-300 transition-colors">
            {t('privacyPolicy')}
          </button>
          <span className="text-slate-800">•</span>
          <button onClick={() => onSelectView('privacy')} className="hover:text-slate-300 transition-colors">
            {t('termsOfService')}
          </button>
          <span className="text-slate-800">•</span>
          <button onClick={() => onSelectView('privacy')} className="hover:text-slate-300 transition-colors">
            {isAr ? 'الأمان' : 'Security'}
          </button>
          <span className="text-slate-800">•</span>
          <button
            onClick={() => setShowCookieNotice(!showCookieNotice)}
            className="hover:text-slate-300 transition-colors"
          >
            {isAr ? 'إعدادات الكوكيز' : 'Cookie Settings'}
          </button>
        </div>

        {/* Social & Dev Links */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>
      </div>

      {showCookieNotice && (
        <div className="max-w-7xl mx-auto mt-4 p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-[10px] text-slate-400">
          <span>
            {isAr
              ? 'تستخدم منصة CodeVortex ملفات تعريف الارتباط الأساسية لتقديم تجربة تشغيل سحابية آمنة.'
              : 'CodeVortex uses essential cookies for secure cloud execution and session continuity.'}
          </span>
          <button
            onClick={() => setShowCookieNotice(false)}
            className="px-2.5 py-1 bg-cyan-950 text-cyan-400 font-bold rounded-lg border border-cyan-800 ml-2"
          >
            {isAr ? 'موافق' : 'Accept'}
          </button>
        </div>
      )}
    </footer>
  );
};
