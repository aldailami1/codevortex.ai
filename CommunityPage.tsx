import React from 'react';
import { Language, ViewMode } from '../types';
import { Users, ArrowLeft, MessageSquare, Globe, Heart, MessageCircle } from 'lucide-react';

// معالجة مرنة واستيراد آمن لتفادي أخطاء المسارات النسبية في Vercel
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

interface CommunityPageProps {
  language: Language;
  onSelectView: (view: ViewMode) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  language,
  onSelectView,
}) => {
  const isAr = language === 'ar';
  const t = useTranslationHook(language);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Back Header */}
        <button
          onClick={() => onSelectView('landing')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800"
        >
          <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        {/* Header Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[#00F2FE] text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>CloudForge Community</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {isAr ? 'مجتمع المطورين والمبتكرين' : 'Developer Community'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            {isAr ? 'تواصل مع آلآلاف من المطورين وشارك مشاريعك البرمجية السحابية.' : 'Connect with thousands of developers and showcase your cloud applications.'}
          </p>
        </div>

        {/* Community Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#00F2FE]">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {isAr ? 'مجموعات النقاش الحية' : 'Discussion Forums'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'شارك في الحوارات حول المزايا الجديدة، واستعرض الحلول للثغرات والأكواد المعقدة مع باقي أعضاء المجتمع.'
                : 'Engage in active technical discussions, share architecture tips, and solve code challenges together.'}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {isAr ? 'معرض المشاريع المفتوحة' : 'Open Showcase'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'اعرض تطبيقاتك ومشاريعك السحابية المصممة عبر CloudForge واحصل على آراء وتقييمات مباشرة.'
                : 'Discover and test apps built by fellow engineers on the CloudForge platform ecosystem.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
