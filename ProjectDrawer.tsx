import React from 'react';
import { Project, Language } from '../types';
import { Folder, Plus, Trash2, Copy, X, Sparkles, CheckCircle } from 'lucide-react';

interface ProjectDrawerProps {
  projects: Project[];
  activeProjectId: string;
  language: Language;
  onSelectProject: (id: string) => void;
  onCreateNewProject: () => void;
  onCloneProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onClose: () => void;
}

export const ProjectDrawer: React.FC<ProjectDrawerProps> = ({
  projects,
  activeProjectId,
  language,
  onSelectProject,
  onCreateNewProject,
  onCloneProject,
  onDeleteProject,
  onClose,
}) => {
  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-cyan-400" />
              <h3 className="font-extrabold text-white text-base">
                {isAr ? 'مدير المشاريع المحفوظة' : 'Saved Projects Manager'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Project CTA */}
          <button
            onClick={() => {
              onCreateNewProject();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إنشاء مشروع جديد فارغ' : 'Create New Blank Project'}</span>
          </button>

          {/* Project List */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {projects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    onSelectProject(proj.id);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-slate-950 border-cyan-500/80 shadow-lg'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 truncate flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate">{proj.name}</span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                          {isAr ? 'نشط' : 'Active'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{proj.description}</p>
                    <span className="text-[10px] text-slate-600 font-mono block">
                      {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloneProject(proj.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-400"
                      title={isAr ? 'استنساخ المشروع' : 'Clone project'}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {projects.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(proj.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400"
                        title={isAr ? 'حذف المشروع' : 'Delete project'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500 font-mono">
          CodeVortex Cloud Storage Engine v2.5
        </div>
      </div>
    </div>
  );
};
