'use client';

import React, { useMemo, useState } from 'react';
import { MARKETPLACE_CATALOG } from '@/data/marketplaceCatalog';
import { TemplateItem, Language } from '@/types';
import {
  Check,
  ChevronDown,
  Download,
  Eye,
  Filter,
  Layers3,
  Rocket,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';

interface MarketplaceProps {
  language: Language;
  onImportTemplate: (template: TemplateItem) => void;
  onDeployTemplate?: (template: TemplateItem) => void;
}

type MarketplaceCategory = 'all' | 'website' | 'saas' | 'ecommerce' | 'app' | 'schema';

const categoryLabels: Record<MarketplaceCategory, { en: string; ar: string }> = {
  all: { en: 'All', ar: 'الكل' },
  website: { en: 'Websites', ar: 'مواقع إلكترونية' },
  saas: { en: 'Cloud & SaaS', ar: 'السحابة و SaaS' },
  ecommerce: { en: 'E-Commerce', ar: 'التجارة الإلكترونية' },
  app: { en: 'Apps & Services', ar: 'التطبيقات والخدمات' },
  schema: { en: 'Schemas & APIs', ar: 'المخططات وواجهات API' },
};

const getPreviewDocument = (template: TemplateItem) => {
  const html = template.files.find((file) => file.path.endsWith('.html'))?.content || '<main><h1>CloudForge Preview</h1></main>';
  const css = template.files.find((file) => file.path.endsWith('.css'))?.content || '';
  const js = template.files.find((file) => file.path.endsWith('.js'))?.content || '';
  const withStyles = html.includes('</head>') ? html.replace('</head>', `<style>${css}</style></head>`) : `<style>${css}</style>${html}`;
  return withStyles.includes('</body>') ? withStyles.replace('</body>', `<script>${js.replace(/<\//g, '<\\/')}</script></body>`) : `${withStyles}<script>${js.replace(/<\//g, '<\\/')}</script>`;
};

export const Marketplace: React.FC<MarketplaceProps> = ({ language, onImportTemplate, onDeployTemplate }) => {
  const isAr = language === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [importedId, setImportedId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [sortMode, setSortMode] = useState<'recommended' | 'name'>('recommended');
  const [deployingId, setDeployingId] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = MARKETPLACE_CATALOG.filter((template) => {
      const categoryMatches = selectedCategory === 'all' || template.category === selectedCategory;
      const searchMatches = !query || [template.title, template.titleAr, template.description, template.descriptionAr, template.badge].some((value) => value.toLowerCase().includes(query));
      return categoryMatches && searchMatches;
    });
    return sortMode === 'name' ? [...filtered].sort((a, b) => (isAr ? a.titleAr.localeCompare(b.titleAr) : a.title.localeCompare(b.title))) : filtered;
  }, [isAr, searchQuery, selectedCategory, sortMode]);

  const handleImport = (template: TemplateItem) => {
    onImportTemplate(template);
    setImportedId(template.id);
    window.setTimeout(() => setImportedId(null), 2500);
  };

  const handleDeploy = (template: TemplateItem) => {
    setDeployingId(template.id);
    if (onDeployTemplate) onDeployTemplate(template);
    else onImportTemplate(template);
    window.setTimeout(() => setDeployingId(null), 1800);
  };

  return (
    <section className="min-h-screen flex-1 overflow-y-auto bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-7xl space-y-7">
        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_right,rgba(0,242,254,0.16),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(11,15,25,0.98))] p-5 shadow-2xl sm:p-8">
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200"><ShoppingBag className="h-3.5 w-3.5" /> CloudForge Marketplace</div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{isAr ? 'مكتبة عالمية لبناء مشروعك التالي' : 'A global library for your next build'}</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{isAr ? 'استكشف قوالب المواقع والمنصات السحابية والمتاجر والتطبيقات والمخططات الجاهزة، ثم عاينها وثبّتها أو جهّز نشرها.' : 'Explore ready-to-edit websites, cloud platforms, commerce, apps, and schemas. Preview, install, or prepare a deployment in one flow.'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{isAr ? 'العناصر' : 'Catalog'}</p><p className="mt-1 text-2xl font-black text-cyan-300">{MARKETPLACE_CATALOG.length}+</p></div><div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{isAr ? 'التصنيفات' : 'Categories'}</p><p className="mt-1 text-2xl font-black text-violet-300">5</p></div><div className="col-span-2 rounded-2xl border border-white/10 bg-slate-950/50 p-3 sm:col-span-1"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{isAr ? 'الإجراء' : 'Action'}</p><p className="mt-1 text-xs font-black text-emerald-300">{isAr ? 'معاينة ثم موافقة' : 'Preview then approve'}</p></div></div>
          </div>
        </div>

        <div className="sticky top-2 z-20 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto scrollbar-none">
              <Filter className="h-4 w-4 shrink-0 text-cyan-300" />
              {(Object.keys(categoryLabels) as MarketplaceCategory[]).map((category) => <button key={category} onClick={() => setSelectedCategory(category)} className={`min-h-10 shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition ${selectedCategory === category ? 'bg-cyan-300 text-slate-950' : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-cyan-400/50 hover:text-white'}`}>{categoryLabels[category][isAr ? 'ar' : 'en']}</button>)}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 rtl:left-auto rtl:right-3" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={isAr ? 'ابحث بالاسم أو التصنيف...' : 'Search by name or category...'} className="min-h-10 w-full rounded-xl border border-slate-800 bg-slate-900 px-9 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" /></div>
              <label className="relative"><span className="sr-only">{isAr ? 'ترتيب' : 'Sort'}</span><select value={sortMode} onChange={(event) => setSortMode(event.target.value as 'recommended' | 'name')} className="min-h-10 w-full appearance-none rounded-xl border border-slate-800 bg-slate-900 px-3 pr-8 text-xs font-bold text-slate-300 outline-none focus:border-cyan-300 sm:w-36"><option value="recommended">{isAr ? 'الموصى به' : 'Recommended'}</option><option value="name">{isAr ? 'حسب الاسم' : 'By name'}</option></select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" /></label>
            </div>
          </div>
          <p className="px-1 text-xs text-slate-500">{isAr ? `عرض ${filteredTemplates.length} من ${MARKETPLACE_CATALOG.length} عنصراً` : `Showing ${filteredTemplates.length} of ${MARKETPLACE_CATALOG.length} items`}</p>
        </div>

        {filteredTemplates.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-16 text-center text-sm text-slate-400">{isAr ? 'لم نعثر على عناصر مطابقة. جرّب مصطلحاً مختلفاً.' : 'No matching items. Try another search term.'}</div> : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filteredTemplates.map((template) => <article key={template.id} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-cyan-950/30"><div className="relative aspect-[16/9] overflow-hidden bg-slate-950"><img src={template.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" /><span className="absolute left-3 top-3 rounded-full border border-white/10 bg-slate-950/80 px-2.5 py-1 text-[10px] font-black tracking-wider text-cyan-200">{template.badge}</span><button onClick={() => setPreviewTemplate(template)} aria-label={`${isAr ? 'معاينة' : 'Preview'} ${isAr ? template.titleAr : template.title}`} className="absolute bottom-3 right-3 inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-white/15 bg-slate-950/85 px-3 py-2 text-xs font-black text-white backdrop-blur hover:border-cyan-300 hover:text-cyan-200"><Eye className="h-3.5 w-3.5" /> {isAr ? 'معاينة حية' : 'Live preview'}</button></div><div className="flex flex-1 flex-col gap-4 p-5"><div className="space-y-2"><h2 className="text-base font-black text-white">{isAr ? template.titleAr : template.title}</h2><p className="line-clamp-3 text-xs leading-6 text-slate-400">{isAr ? template.descriptionAr : template.description}</p></div><div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4"><span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500"><Layers3 className="h-3.5 w-3.5" /> {template.files.length} {isAr ? 'ملفات' : 'files'}</span><div className="flex items-center gap-2"><button onClick={() => handleImport(template)} className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black transition ${importedId === template.id ? 'bg-emerald-300 text-slate-950' : 'border border-slate-700 bg-slate-950 text-slate-200 hover:border-cyan-300 hover:text-cyan-200'}`}>{importedId === template.id ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}{importedId === template.id ? (isAr ? 'تم التثبيت' : 'Installed') : (isAr ? 'تثبيت' : 'Install')}</button><button onClick={() => handleDeploy(template)} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-200">{deployingId === template.id ? <Sparkles className="h-3.5 w-3.5 animate-spin" /> : <Rocket className="h-3.5 w-3.5" />}{deployingId === template.id ? (isAr ? 'جارٍ التجهيز' : 'Preparing') : (isAr ? 'نشر' : 'Deploy')}</button></div></div></div></article>)}</div>}
      </div>

      {previewTemplate && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={isAr ? 'معاينة القالب' : 'Template preview'}><div className="flex h-[min(88vh,52rem)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl"><div className="flex items-center justify-between gap-4 border-b border-slate-800 px-4 py-3 sm:px-6"><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">{isAr ? 'معاينة حية' : 'Live preview'}</p><h2 className="truncate text-base font-black text-white">{isAr ? previewTemplate.titleAr : previewTemplate.title}</h2></div><button onClick={() => setPreviewTemplate(null)} aria-label={isAr ? 'إغلاق المعاينة' : 'Close preview'} className="rounded-xl border border-slate-700 p-2 text-slate-300 hover:border-cyan-300 hover:text-white"><X className="h-4 w-4" /></button></div><div className="flex-1 bg-white"><iframe title={isAr ? `معاينة ${previewTemplate.titleAr}` : `Preview ${previewTemplate.title}`} srcDoc={getPreviewDocument(previewTemplate)} className="h-full w-full border-0" sandbox="allow-scripts" /></div><div className="flex flex-col gap-2 border-t border-slate-800 bg-slate-950 p-3 sm:flex-row sm:justify-end"><button onClick={() => handleImport(previewTemplate)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-black text-slate-200 hover:border-cyan-300 hover:text-cyan-200"><Download className="h-4 w-4" /> {isAr ? 'تثبيت في مساحة العمل' : 'Install to workspace'}</button><button onClick={() => handleDeploy(previewTemplate)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-cyan-200"><Rocket className="h-4 w-4" /> {isAr ? 'تجهيز النشر' : 'Prepare deployment'}</button></div></div></div>}
    </section>
  );
};
