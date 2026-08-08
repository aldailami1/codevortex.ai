import React from 'react';
import { Language } from '../types';
import { useTranslation } from './locales';
import {
  FileText,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Terminal,
  Check,
  Calendar,
  Code
} from 'lucide-react';

interface ChangelogPageProps {
  language: Language;
}

export const ChangelogPage: React.FC<ChangelogPageProps> = ({ language }) => {
  const t = useTranslation(language);
  const isAr = language === 'ar';

  const releases = [
    {
      version: 'v2.4 Pro (Latest Release)',
      date: 'August 2026',
      badge: 'Major Update',
      titleAr: 'تحديث الهوية الشاملة، محرك اللغات الـ 10، وتكامل خوادم AI Cloud Sandbox',
      titleEn: 'Global Branding Alignment, 10-Language Localization Engine & Live AI Cloud Sandbox',
      itemsAr: [
        'توحيد الهوية البصرية وشعار CloudForge النيون المتوهج في الرأس والتذييل والقوائم.',
        'دعم 10 لغات عالمية حقيقية (العربية، الإنجليزية، الإسبانية، الفرنسية، الألمانية، الصينية، اليابانية، الهندية، الروسية، التركية) مع ضبط الاتجاه التلقائي.',
        'تفعيل زر الرجوع الذكي والتلقائي بالهيدر يخفي نفسه في الرئيسية ويظهر في القوائم الفرعية.',
        'دمج مساعد خدمة العملاء الذكي التفاعلي العائم لتقديم استجابة فورية 24/7.',
        'توفير محرر الأكواد الشامل والمربوط مباشرة بخوادم التشغيل التفاعلية.',
      ],
      itemsEn: [
        'Unified visual identity & glowing neon CloudForge logo across Header, Footer, and Drawer.',
        'Native 10-language localization engine (AR, EN, ES, FR, DE, ZH, JA, HI, RU, TR) with auto-RTL/LTR switching.',
        'Dynamic Back Button in Header that auto-hides on Home Page and appears on sub-pages.',
        'Floating Live AI Support Customer Agent for instant 24/7 technical queries.',
        'Direct live cloud workspace sandbox running on port 3000.',
      ]
    },
    {
      version: 'v2.3.0',
      date: 'June 2026',
      badge: 'Feature Update',
      titleAr: 'تطوير محرك AI Copilot وقوالب البرمجة السحابية الفائقة',
      titleEn: 'AI Copilot Refinement Engine & Ultra Cloud Templates Marketplace',
      itemsAr: [
        'تحسين سرعة معالجة الأوامر البرمجية وتوليد الأكواد بنسبة 40%.',
        'إطلاق سوق القوالب المتقدمة وتوفير قوالب جاهزة لـ SaaS والمتاجر والمواقع الطبية.',
        'دعم التخصيص الكامل للخطوط وألوان الواجهة الداكنة (Dark Mode Glassmorphism).',
      ],
      itemsEn: [
        '40% speed boost for multi-file code generation and AST refactoring.',
        'Launched Advanced Templates Marketplace with production SaaS & E-Commerce starters.',
        'Full Dark Mode Glassmorphism design polish with customizable accent colors.',
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Page Title Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-400 text-xs font-black">
            <FileText className="w-4 h-4" />
            <span>{t('changelog')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {isAr ? 'مدونة المنصة وسجل التحديثات البرمجية' : 'Platform Changelog & Engineering Blog'}
          </h1>

          <p className="text-slate-400 text-sm sm:text-base">
            {isAr
              ? 'تابع أحدث الإضافات والتحديثات البرمجية وميزات بيئة التطوير السحابية CloudForge.'
              : 'Stay up-to-date with all feature releases, security updates, and architecture improvements.'}
          </p>
        </div>

        {/* Timeline of Releases */}
        <div className="space-y-8">
          {releases.map((rel, idx) => (
            <div key={idx} className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 relative overflow-hidden shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-lg text-[#00F2FE]">{rel.version}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-[10px] font-bold">
                    {rel.badge}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{rel.date}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-black text-white">
                  {isAr ? rel.titleAr : rel.titleEn}
                </h2>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  {(isAr ? rel.itemsAr : rel.itemsEn).map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[#00F2FE] shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
