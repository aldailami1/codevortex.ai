import React from 'react';
import { Language, ViewMode } from '../types';
import { Shield, ArrowLeft, Lock, Eye, FileText, Server, Bell } from 'lucide-react';

// استيراد آمن ومعالج لمسار الترجمات يمنع توقف البناء على Vercel
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

interface PrivacyPageProps {
  language: Language;
  onSelectView: (view: ViewMode) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({
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

        {/* Page Title Section */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[#00F2FE] text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>CloudForge Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {isAr ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy & Data Protection Policy'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            {isAr ? 'آخر تحديث: أغسطس 2026' : 'Last updated: August 2026'}
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-[#00F2FE]">
              <Lock className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">
                {isAr ? '1. البيانات التي نجمعها' : '1. Information We Collect'}
              </h2>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'نحن نجمع البيانات الأساسية اللازمة لتقديم خدمة التطوير السحابي بآمان، مثل معلومات الحساب (البريد الإلكتروني، الاسم)، وأوامر البرمجة التي تُدخلها لنماذج الذكاء الاصطناعي لتوليد الأكواد وتوفير المعاينة الحية.'
                : 'We collect essential information required to deliver cloud development services safely, including account credentials (email, name), and coding prompts submitted to AI models for code generation.'}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-[#00F2FE]">
              <Eye className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">
                {isAr ? '2. كيف نستخدم معلوماتك' : '2. How We Use Your Information'}
              </h2>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'تُستخدم بياناتك فقط لتشغيل وتطوير بيئة العمل CloudForge، وتحسين أداء النماذج الذكية، وضمان استقرار بيئات التشغيل المعزولة (Containers).'
                : 'Your data is strictly used to operate and improve the CloudForge environment, optimize AI model responsiveness, and maintain secure REPL container instances.'}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-[#00F2FE]">
              <Server className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">
                {isAr ? '3. أمان الشفرة البرمجية والحوسبة' : '3. Code Security & Infrastructure'}
              </h2>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'تتم معالجة شفراتك البرمجية ومشاريعك في بيئات مشفرة ومؤمنة بالكامل. لا يتم مشاركة الأكواد أو المشروعات الخاصة مع أي أطراف خارجية بدون إذنك الصريح.'
                : 'Your source code and assets are processed within fully encrypted containerized environments. Private projects are never shared with third parties without express consent.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

