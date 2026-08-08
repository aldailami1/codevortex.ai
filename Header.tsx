import React from 'react';
import { Language, ViewMode, UserProfile } from '../types';

// استيراد آمن وديناميكي لمسار الترجمات يتوافق مع بيئة Linux في Vercel
let useTranslationHook: (lang: Language) => any;
try {
  const localesModule = require('../locales');
  useTranslationHook = localesModule.useTranslation || localesModule.default;
} catch (e) {
  try {
    const localesModuleFallback = require('./locales');
    useTranslationHook = localesModuleFallback.useTranslation || localesModuleFallback.default;
  } catch (err) {
    useTranslationHook = () => ((key: string) => key);
  }
}

import {
  Sparkles,
  Globe,
  User,
  LogOut,
  LayoutDashboard,
  Code2,
  CreditCard,
  Settings,
  Shield,
  HelpCircle,
  FolderKanban
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  user: UserProfile | null;
  onLogout?: () => void;
  onOpenLoginModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  currentView,
  onSelectView,
  user,
  onLogout,
  onOpenLoginModal
}) => {
  const isAr = language === 'ar';
  const t = useTranslationHook(language);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div 
          onClick={() => onSelectView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00F2FE] to-[#7928CA] rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-full h-full bg-[#090e1a] border border-cyan-500/40 rounded-xl flex items-center justify-center p-1.5 shadow-lg">
              <svg className="w-full h-full text-[#00F2FE]" viewBox="0 0 100 100" fill="none">
                <path
                  d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50C90 35 80 20 65 15C50 10 35 25 35 40C35 55 50 65 65 60"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="50" r="12" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
              Cloud<span className="text-[#00F2FE]">Forge</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold -mt-1">
              AI PLATFORM
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => onSelectView('landing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentView === 'landing'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-[#00F2FE] border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>

          <button
            onClick={() => onSelectView('workspace')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'workspace'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-[#00F2FE] border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'مساحة العمل' : 'Workspace'}</span>
          </button>

          <button
            onClick={() => onSelectView('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'dashboard'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-[#00F2FE] border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
          </button>

          <button
            onClick={() => onSelectView('pricing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'pricing'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-[#00F2FE] border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{isAr ? 'الباقات' : 'Pricing'}</span>
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(isAr ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:border-cyan-500/40 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>

          {/* User Account / Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <User className="w-3.5 h-3.5 text-[#00F2FE]" />
                <span className="text-xs font-bold text-slate-200">{user.name}</span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-red-950/50 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all"
                  title={isAr ? 'تسجيل الخروج' : 'Logout'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
