import React, { useState } from 'react';
import { Project, Language } from './types';
import {
  Store,
  Search,
  Sparkles,
  ExternalLink,
  Code2,
  Tag,
  ArrowRight,
  CheckCircle2,
  Layers,
  Star,
  Download,
} from 'lucide-react';

// تعريف القوالب محلياً لمنع أخطاء المسارات المفقودة في Vercel
const TEMPLATES_DATA: Partial<Project>[] = [
  {
    id: 'template-react-landing',
    name: 'SaaS Landing Page',
    description: 'Modern, responsive SaaS landing page built with React and Tailwind CSS.',
    files: [
      {
        path: 'index.html',
        content: '<!DOCTYPE html>\n<html>\n<head><title>SaaS Landing</title></head>\n<body><div id="root"></div></body>\n</html>',
      },
    ],
  },
  {
    id: 'template-e-commerce',
    name: 'E-Commerce Storefront',
    description: 'Full-featured online store front with cart state management.',
    files: [
      {
        path: 'index.html',
        content: '<!DOCTYPE html>\n<html>\n<head><title>E-Commerce Store</title></head>\n<body><div id="root"></div></body>\n</html>',
      },
    ],
  },
  {
    id: 'template-dashboard',
    name: 'Analytics Dashboard',
    description: 'Clean admin dashboard with charts and real-time metrics.',
    files: [
      {
        path: 'index.html',
        content: '<!DOCTYPE html>\n<html>\n<head><title>Admin Dashboard</title></head>\n<body><div id="root"></div></body>\n</html>',
      },
    ],
  },
];

interface MarketplaceProps {
  language: Language;
  onSelectTemplate: (template: any) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  language,
  onSelectTemplate,
}) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = TEMPLATES_DATA.filter((tmpl) =>
    tmpl.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tmpl.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1">
              <Store className="w-5 h-5" />
              <span>{isAr ? 'سوق القوالب والتطبيقات' : 'Templates & App Marketplace'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {isAr ? 'استكشف قوالب جاهزة للإطلاق' : 'Explore Production-Ready Templates'}
            </h1>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث في القوالب...' : 'Search templates...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-cyan-500/5"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-white group-hover:text-cyan-400 transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {template.files?.length || 0} {isAr ? 'ملفات' : 'files'}
                </span>

                <button
                  onClick={() => onSelectTemplate(template)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isAr ? 'استخدام القالب' : 'Use Template'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
