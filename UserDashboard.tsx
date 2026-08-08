import React, { useState } from 'react';
import { Language, ViewMode, AIModel } from './types';
import {
  LayoutDashboard,
  FolderKanban,
  Zap,
  Plus,
  Play,
  Code2,
  Cpu,
  Clock,
  ArrowRight,
  Sparkles,
  Bot,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Boxes,
  Activity
} from 'lucide-react';

// استيراد آمن مع معالجة الاحتياط في حال اختلاف مسار locales
let useTranslationHook: (lang: Language) => any;
try {
  const localesModule = require('./locales');
  useTranslationHook = localesModule.useTranslation || localesModule.default;
} catch (e) {
  useTranslationHook = () => ((key: string) => key);
}

interface UserDashboardProps {
  language: Language;
  onSelectView: (view: ViewMode) => void;
  onGenerateFromPrompt?: (prompt: string, model: AIModel) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  language,
  onSelectView,
  onGenerateFromPrompt
}) => {
  const isAr = language === 'ar';
  const t = useTranslationHook(language);

  const [promptInput, setPromptInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>('cv-neural-v5');
  const [filterCategory, setFilterCategory] = useState<'all' | 'web' | 'ai' | 'mobile'>('all');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    if (onGenerateFromPrompt) {
      onGenerateFromPrompt(promptInput.trim(), selectedModel);
    } else {
      onSelectView('workspace');
    }
  };

  const sampleProjects = [
    {
      id: '1',
      title: isAr ? 'منصة التجارة السحابية' : 'E-Commerce Cloud Engine',
      category: 'web',
      updated: isAr ? 'منذ 10 دقائق' : '10 mins ago',
      status: 'active',
      model: 'CloudForge Neural v5.0',
    },
    {
      id: '2',
      title: isAr ? 'لوحة تحكم الذكاء الاصطناعي' : 'AI Analytics Dashboard',
      category: 'ai',
      updated: isAr ? 'منذ ساعتين' : '2 hours ago',
      status: 'active',
      model: 'CloudForge Neural v5.0',
    },
    {
      id: '3',
      title: isAr ? 'تطبيق إدارة المهام الذكي' : 'Smart Task Planner',
      category: 'mobile',
      updated: isAr ? 'منذ يومين' : '2 days ago',
      status: 'archived',
      model: 'CloudForge Fast-V1',
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-[#00F2FE]" />
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {isAr ? 'لوحة تحكم CloudForge' : 'CloudForge Dashboard'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {isAr ? 'إدارة المشاريع السحابية والنشر الفوري عبر المحرك العصبي' : 'Manage your cloud projects and instant REPL deployments'}
            </p>
          </div>

          <button
            onClick={() => onSelectView('workspace')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isAr ? 'مشروع جديد' : 'New Project'}</span>
          </button>
        </div>

        {/* Quick Generation Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-[#00F2FE]" />
            <span>{isAr ? 'توليد تطبيق جديد بالذكاء الاصطناعي' : 'Generate New Application with AI'}</span>
          </div>

          <form onSubmit={handleQuickSubmit} className="space-y-3">
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 focus-within:border-cyan-500/50 transition-all">
              <Bot className="w-6 h-6 text-[#00F2FE] shrink-0" />
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={isAr ? 'اكتب وصف التطبيق المطلوب لبنائه فوراً...' : 'Describe the app you want to build instantly...'}
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{isAr ? 'بناء' : 'Build'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Projects Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-cyan-400" />
              <span>{isAr ? 'المشاريع الحالية' : 'Current Projects'}</span>
            </h2>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterCategory === 'all' ? 'bg-cyan-500/20 text-[#00F2FE] border border-cyan-500/40' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'}`}
              >
                {isAr ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setFilterCategory('web')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterCategory === 'web' ? 'bg-cyan-500/20 text-[#00F2FE] border border-cyan-500/40' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'}`}
              >
                {isAr ? 'تطبيقات الويب' : 'Web Apps'}
              </button>
              <button
                onClick={() => setFilterCategory('ai')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterCategory === 'ai' ? 'bg-cyan-500/20 text-[#00F2FE] border border-cyan-500/40' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'}`}
              >
                {isAr ? 'ذكاء اصطناعي' : 'AI Apps'}
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleProjects
              .filter(p => filterCategory === 'all' || p.category === filterCategory)
              .map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-3xl space-y-4 shadow-xl transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[#00F2FE]">
                        <Boxes className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-bold">
                        {project.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'مؤرشف' : 'Archived')}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white group-hover:text-[#00F2FE] transition-colors">
                      {project.title}
                    </h3>

                    <div className="space-y-1 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-slate-500" />
                        <span>{project.model}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{project.updated}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectView('workspace')}
                    className="w-full pt-3 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-cyan-400 transition-colors border-t border-slate-800/80 mt-2"
                  >
                    <span>{isAr ? 'فتح في المحرر' : 'Open in Workspace'}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};
