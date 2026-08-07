import React, { useState } from 'react';
import { MARKETPLACE_TEMPLATES } from '../data/templates';
import { TemplateItem, Language } from '../types';
import {
  ShoppingBag,
  Sparkles,
  Download,
  Upload,
  Check,
  Search,
  Filter,
  ExternalLink,
  Tag
} from 'lucide-react';

interface MarketplaceProps {
  language: Language;
  onImportTemplate: (template: TemplateItem) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  language,
  onImportTemplate,
}) => {
  const isAr = language === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [importedId, setImportedId] = useState<string | null>(null);

  const filteredTemplates = MARKETPLACE_TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.titleAr.includes(searchQuery) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.descriptionAr.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleImport = (tpl: TemplateItem) => {
    onImportTemplate(tpl);
    setImportedId(tpl.id);
    setTimeout(() => setImportedId(null), 2500);
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAr ? 'سوق القوالب والأدوات البرمجية' : 'CodeVortex Marketplace'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            {isAr ? 'اختر قالبك الجاهز وابدأ التطوير بضغطة زر' : 'Import Pre-Built Premium Templates & UI Bundles'}
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {isAr
              ? 'مجموعة مختارة من أفضل قوالب المواقع والتطبيقات المصممة باحترافية والمتوافقة مع كافة الشاشات واللغة العربية.'
              : 'Browse high-converting SaaS, E-Commerce, and Corporate templates ready to edit and deploy in seconds.'}
          </p>
        </div>

        {/* Publish Action Button */}
        <button
          onClick={() => alert(isAr ? 'ميزة نشر القوالب في السوق متاحة للمطورين في الحسابات المتقدمة' : 'Template publisher enabled for CodeVortex Pro Developers')}
          className="px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-100 font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 shrink-0"
        >
          <Upload className="w-4 h-4 text-cyan-400" />
          <span>{isAr ? 'انشر قالبك في السوق' : 'Publish Your Template'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'saas', 'ecommerce', 'agency'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap capitalize ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all'
                ? isAr ? 'الكل' : 'All Templates'
                : cat === 'saas'
                ? isAr ? 'منصات سحابية (SaaS)' : 'SaaS Platforms'
                : cat === 'ecommerce'
                ? isAr ? 'متاجر إلكترونية' : 'E-Commerce'
                : isAr ? 'وكالات وحلول' : 'Agencies'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في القوالب...' : 'Search templates...'}
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2 pl-9 text-xs text-slate-100 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between group"
          >
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img
                src={tpl.image}
                alt={tpl.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-cyan-400 text-[10px] font-bold tracking-wider uppercase">
                {tpl.badge}
              </span>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-extrabold text-white text-base">
                  {isAr ? tpl.titleAr : tpl.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                  {isAr ? tpl.descriptionAr : tpl.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  {tpl.files.length} {isAr ? 'ملفات جاهزة' : 'files bundled'}
                </span>

                <button
                  onClick={() => handleImport(tpl)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg ${
                    importedId === tpl.id
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 hover:scale-105'
                  }`}
                >
                  {importedId === tpl.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تم استيراد القالب' : 'Imported!'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAr ? 'استيراد لمحرر الكود' : 'Import to IDE'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
