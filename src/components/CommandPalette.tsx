import React, { useState, useEffect } from 'react';
import { ViewMode, Language, ProjectFile } from '@/types';
import {
  Search,
  Code2,
  Terminal,
  Play,
  Rocket,
  FolderTree,
  Sparkles,
  Command,
  FileCode,
  Languages,
  Eye,
  ShoppingBag,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  files: ProjectFile[];
  onSelectFile: (path: string) => void;
  onSelectView: (view: ViewMode) => void;
  onOpenDeployModal: () => void;
  onToggleLanguage: (lang: Language) => void;
  onTriggerAI: (prompt: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  language,
  files,
  onSelectFile,
  onSelectView,
  onOpenDeployModal,
  onToggleLanguage,
  onTriggerAI,
}) => {
  const isAr = language === 'ar';
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
    setQuery('');
  };

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onTriggerAI(query.trim());
    onClose();
    setQuery('');
  };

  const filteredFiles = files.filter((f) =>
    f.path.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <form onSubmit={handleAISubmit} className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/90">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث عن ملف، شغل أمراً، أو اكتب طلباً للذكاء الاصطناعي (مثال: أضف نموذج اتصل بنا)...'
                : 'Type a command, search files, or prompt AI (e.g. Add dark mode toggle)...'
            }
            autoFocus
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm font-medium"
          />
          {query.trim() && (
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-md shadow-cyan-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'توليد بالذكاء الاصطناعي' : 'AI Generate'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        {/* Command Body Options */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-4 text-xs text-slate-300">
          {/* Section 1: Views Navigation */}
          <div>
            <span className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {isAr ? 'شاشات المنصة' : 'VIEWS & WORKSPACES'}
            </span>
            <div className="space-y-1">
              <button
                onClick={() => handleAction(() => onSelectView('workspace'))}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 transition-all font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>{isAr ? 'مساحة العمل السحابية (CloudForge Workstation)' : 'CloudForge Cloud Workstation'}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Ctrl+1
                </span>
              </button>

              <button
                onClick={() => handleAction(() => onSelectView('preview'))}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 transition-all font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'المعاينة الحية للتطبيق (Live Sandbox)' : 'Live Application Preview'}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Ctrl+2
                </span>
              </button>

              <button
                onClick={() => handleAction(() => onSelectView('marketplace'))}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 transition-all font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'سوق القوالب الجاهزة (Templates Market)' : 'Templates Marketplace'}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Ctrl+3
                </span>
              </button>
            </div>
          </div>

          {/* Section 2: Project Files */}
          <div>
            <span className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {isAr ? 'ملفات الكود المتاحة' : 'PROJECT FILES'}
            </span>
            <div className="space-y-1">
              {filteredFiles.map((f) => (
                <button
                  key={f.path}
                  onClick={() =>
                    handleAction(() => {
                      onSelectFile(f.path);
                      onSelectView('workspace');
                    })
                  }
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 transition-all font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    <span>{f.path}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{f.content.length} bytes</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Actions */}
          <div>
            <span className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {isAr ? 'الأوامر والنشر' : 'GLOBAL ACTIONS'}
            </span>
            <div className="space-y-1">
              <button
                onClick={() => handleAction(onOpenDeployModal)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 transition-all font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Rocket className="w-4 h-4 text-cyan-400" />
                  <span>{isAr ? 'النشر السحابي بنقرة واحدة (One-Click Deploy)' : 'One-Click Cloud Deployment'}</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Deploy
                </span>
              </button>

              <button
                onClick={() => handleAction(() => onToggleLanguage(isAr ? 'en' : 'ar'))}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-slate-200 transition-all font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Languages className="w-4 h-4 text-violet-400" />
                  <span>{isAr ? 'التحويل إلى اللغة الإنجليزية' : 'Switch Language to Arabic'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5 text-cyan-400" />
            <span>CloudForge Command Palette v5.0</span>
          </div>
          <span>Esc {isAr ? 'للاغلاق' : 'to close'}</span>
        </div>
      </div>
    </div>
  );
};
