import React from 'react';
import { Language, ViewMode } from '../types';
import { HelpCircle, ArrowLeft, MessageSquare, Mail, LifeBuoy, FileText, CheckCircle2 } from 'lucide-react';

// معالجة آمنة لمسارات استيراد الترجمات تمنع توقف عملية البناء في Vercel
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

interface SupportPageProps {
  language: Language;
  onSelectView: (view: ViewMode) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({
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
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[#00F2FE] text-xs font-bold">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>CloudForge Support Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {isAr ? 'مركز الدعم والمساندة الفنية' : 'Help & Support Center'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            {isAr ? 'كيف يمكننا مساعدتك في استخدام منصة التطوير اليوم؟' : 'How can we assist your development workflow today?'}
          </p>
        </div>

        {/* Support Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[#00F2FE]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {isAr ? 'المحادثة المباشرة مع المساعد الذكي' : 'AI Technical Assistant'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'احصل على إجابات فورية وحلول تقنية للأكواد وبناء التطبيقات مباشرة عبر المساعد المدمج داخل بيئة العمل.'
                : 'Get instant answers and direct technical debugging for your code modules directly inside the CloudForge workspace.'}
            </p>
            <button
              onClick={() => onSelectView('workspace')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#00F2FE] hover:underline"
            >
              <span>{isAr ? 'الانتقال إلى مساحة العمل' : 'Go to Workspace'}</span>
              <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {isAr ? 'الوثائق والتوثيق البرمجي' : 'Platform Documentation'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'استكشف أدلة الاستخدام، واجهات API، وطريقة إعداد المشاريع السحابية من الصفر.'
                : 'Explore step-by-step guides, API references, and project setup tutorials for optimal cloud builds.'}
            </p>
            <button
              onClick={() => onSelectView('landing')}
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:underline"
            >
              <span>{isAr ? 'عرض الأدلة والتوثيق' : 'View Documentation'}</span>
              <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
