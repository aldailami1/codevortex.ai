import React, { useState } from 'react';
import { Language, AIModel, AccentColor, FontChoice } from '@/types';
import {
  Sparkles,
  Zap,
  Wand2,
  ChevronDown,
  Globe2,
  Sliders,
  Palette,
  Type,
  Code,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface PromptEngineProps {
  language: Language;
  onGenerate: (
    prompt: string,
    model: AIModel,
    settings: {
      isRTL: boolean;
      projectType: string;
      accentColor: AccentColor;
      fontChoice: FontChoice;
    }
  ) => void;
  isGenerating: boolean;
}

export const PromptEngine: React.FC<PromptEngineProps> = ({
  language,
  onGenerate,
  isGenerating,
}) => {
  const isAr = language === 'ar';

  const [promptText, setPromptText] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>('cv-neural-v5');
  const [projectType, setProjectType] = useState<string>('landing');
  const [autoRTL, setAutoRTL] = useState<boolean>(true);
  const [accentColor, setAccentColor] = useState<AccentColor>('cyan');
  const [fontChoice, setFontChoice] = useState<FontChoice>('cairo');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const arabicPresets = [
    'منصة برمجيات سحابية (SaaS) لإدارة المهام والمشاريع مع باقات تفاعلية',
    'متجر إلكتروني متكامل لبيع العطور الفاخرة مع سلة تسوق وحساب الإجمالي',
    'موقع مكتب استشارات قانونية وتقنية مع نظام حجز استشارات وإرسال نموذج',
    'منصة دورات كود وتطوير برمجيات مع بطاقات كورسات وتقييمات للطلاب',
    'موقع مطعم فاخر مع قائمة طعام تفاعلية وسلة طلبات سريعة مع واتساب',
    'موقع عقارات فاخرة مع تصفية وحساب قيمة الأقساط الشهرية',
  ];

  const englishPresets = [
    'SaaS Analytics & AI Marketing platform landing page with animated charts',
    'E-Commerce store for luxury mechanical keyboards with interactive cart',
    'Digital Design Agency portfolio with dark mode, project showcase & contact form',
    'Medical Clinic & Health platform with online appointment booking',
    'Boutique Coffee & Bistro website with order menu & location map',
    'Real Estate platform with mortgage calculator & luxury property listings',
  ];

  const presets = isAr ? arabicPresets : englishPresets;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() || isGenerating) return;

    onGenerate(promptText.trim(), selectedModel, {
      isRTL: autoRTL,
      projectType,
      accentColor,
      fontChoice,
    });
  };

  return (
    <div className="bg-slate-950 border-b border-slate-800/80 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Gradient Pulse */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-3 relative z-10">
        {/* Title Bar & Proprietary Engine Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{isAr ? 'محرك التوليد بالأوامر النصية' : 'Prompt-to-Website AI Engine'}</span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-[10px] font-mono font-bold">
                v5.0 Neural
              </span>
            </h2>
          </div>

          {/* Proprietary AI Engine Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 hidden sm:inline-flex">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'المعالج البرمجي:' : 'Engine:'}</span>
            </span>

            <div className="relative inline-block">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as AIModel)}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/60 text-cyan-400 font-extrabold px-3 py-1.5 rounded-xl appearance-none pr-8 cursor-pointer text-xs focus:outline-none focus:border-cyan-500 shadow-lg"
              >
                <option value="cv-neural-v5">⚡ CloudForge Neural v5.0 (سريع ومباشر)</option>
                <option value="vortex-quantum">🧠 CloudForge Quantum Ultra (تصميم كودي ذكي)</option>
                <option value="cortex-core-pro">🔮 Cortex Core Pro (منطق برمجيات معقد)</option>
                <option value="cyber-logic-v3">🛡️ Cyber Logic Engine (أنظمة متكاملة)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Prompt Input Box */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative group">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={
                isAr
                  ? 'صف موقعك أو تطبيقك بالتفصيل هنا (مثال: ابنِ موقعاً لمتجر إلكتروني لبيع العطور الفاخرة مع نظام سلة تفاعلي وخيار تبديل الليل والنهار)...'
                  : 'Describe your web app or website in detail (e.g. Build an AI copywriting SaaS landing page with dark mode, pricing toggle and interactive demo)...'
              }
              rows={3}
              dir={isAr ? 'rtl' : 'ltr'}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none shadow-2xl transition-all resize-none font-sans leading-relaxed group-hover:border-slate-700"
            />

            <button
              type="submit"
              disabled={!promptText.trim() || isGenerating}
              className={`absolute ${isAr ? 'left-3' : 'right-3'} bottom-3 px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-xl ${
                !promptText.trim() || isGenerating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25 hover:scale-105 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>{isAr ? 'جاري بناء الكود...' : 'Generating Project...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>{isAr ? 'توليد المنصة بنقرة' : 'Generate Project'}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets & Advanced Toggle */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{isAr ? 'أفكار جاهزة للتوليد:' : 'Presets:'}</span>
            </span>

            {presets.slice(0, 3).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPromptText(preset)}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-400 px-3 py-1 rounded-full transition-all truncate max-w-xs"
              >
                {preset}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-extrabold ml-auto"
            >
              <Sliders className="w-3 h-3" />
              <span>{isAr ? 'خيارات التصميم والتأثيرات' : 'Customization Options'}</span>
            </button>
          </div>

          {/* Advanced Accordion Panel */}
          {showAdvanced && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs animate-in fade-in zoom-in-95 duration-150">
              {/* Archetype */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">
                  {isAr ? 'نوع المنصة:' : 'Archetype:'}
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="landing">{isAr ? 'صفحة هبوط تسويقية (Landing Page)' : 'Landing Page'}</option>
                  <option value="saas">{isAr ? 'منصة سحابية (SaaS Dashboard)' : 'SaaS App'}</option>
                  <option value="store">{isAr ? 'متجر إلكتروني (E-Commerce Store)' : 'E-Commerce Store'}</option>
                  <option value="portfolio">{isAr ? 'معرض أعمال ومؤسسة' : 'Agency & Portfolio'}</option>
                  <option value="medical">{isAr ? 'منصة خدمات طبية' : 'Medical & Health Clinic'}</option>
                </select>
              </div>

              {/* Color Accent */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isAr ? 'لون الهوية الرئيسي:' : 'Color Accent:'}</span>
                </label>
                <select
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value as AccentColor)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="cyan">⚡ {isAr ? 'سياين نيون (Cyan Neon)' : 'Cyan Neon'}</option>
                  <option value="emerald">🌿 {isAr ? 'زمردي حاد (Emerald Green)' : 'Emerald Cyber'}</option>
                  <option value="violet">🔮 {isAr ? 'بنفسجي ملكي (Royal Violet)' : 'Royal Violet'}</option>
                  <option value="amber">👑 {isAr ? 'ذهبي فاخر (Luxury Amber)' : 'Amber Gold'}</option>
                </select>
              </div>

              {/* Font Choice */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isAr ? 'خط الخادمة:' : 'Typography:'}</span>
                </label>
                <select
                  value={fontChoice}
                  onChange={(e) => setFontChoice(e.target.value as FontChoice)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="cairo">Cairo (خط القاهرة العصري)</option>
                  <option value="tajawal">Tajawal (تجوال الدقيق)</option>
                  <option value="readex">Readex Pro (ريدكس بلس)</option>
                  <option value="jakarta">Plus Jakarta Sans / Inter</option>
                </select>
              </div>

              {/* Auto RTL */}
              <div className="flex items-center sm:pt-6">
                <label className="text-slate-200 font-bold flex items-center gap-2 cursor-pointer bg-slate-950 p-2 rounded-xl border border-slate-800 w-full justify-center">
                  <input
                    type="checkbox"
                    checked={autoRTL}
                    onChange={(e) => setAutoRTL(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-500 bg-slate-900 border-slate-700"
                  />
                  <span>{isAr ? 'دعم العربية (RTL Mode)' : 'Auto RTL Support'}</span>
                </label>
              </div>
            </div>
          )}
        </form>

        {/* Live Generation Progress Indicator */}
        {isGenerating && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-800/60 space-y-2 animate-pulse shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
              <span className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>
                  {isAr
                    ? 'يقوم المحرك العصري برسم وبناء هيكل المشروع وتحليل المكونات...'
                    : 'CloudForge Engine is compiling modern layout, styles, & state logic...'}
                </span>
              </span>
              <span className="font-mono text-cyan-400">92%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full w-[92%] rounded-full transition-all duration-1000"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
