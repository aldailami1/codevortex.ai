import React, { useState } from 'react';
import { Project, Language, ViewMode } from './types';
import { useTranslation } from '../lib/translations'; // تم تصحيح المسار هنا
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Code2, 
  Clock, 
  Search, 
  LayoutGrid, 
  List,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface UserDashboardProps {
  projects: Project[];
  currentProject: Project;
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
  onDeleteProject: (id: string) => void;
  onSelectView: (view: ViewMode) => void;
  language: Language;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  projects,
  currentProject,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onSelectView,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewStyle, setViewStyle] = useState<'grid' | 'list'>('grid');
  const isAr = language === 'ar';
  const t = useTranslation(language);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-[#00F2FE] bg-clip-text text-transparent flex items-center gap-3">
              <FolderKanban className="w-8 h-8 text-[#00F2FE]" />
              {t('dashboardAndProjects')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isAr ? 'إدارة ومتابعة جميع مشاريع التطوير السحابية الخاصة بك' : 'Manage and monitor all your cloud development projects'}
            </p>
          </div>

          <button
            onClick={onCreateProject}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-102 active:scale-98 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isAr ? 'مشروع جديد' : 'New Project'}</span>
          </button>
        </div>

        {/* Toolbar Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 rtl:left-auto rtl:right-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'البحث في المشاريع...' : 'Search projects...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setViewStyle('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewStyle === 'grid' ? 'bg-cyan-950 text-[#00F2FE]' : 'text-slate-400 hover:text-white'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewStyle('list')}
                className={`p-1.5 rounded-lg transition-all ${viewStyle === 'list' ? 'bg-cyan-950 text-[#00F2FE]' : 'text-slate-400 hover:text-white'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mx-auto">
              <FolderKanban className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-400 font-medium">
              {isAr ? 'لا توجد مشاريع مطابقة للبحث' : 'No projects found'}
            </p>
          </div>
        ) : viewStyle === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`group relative bg-slate-900/80 border rounded-2xl p-5 transition-all hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between ${
                  currentProject.id === project.id ? 'border-cyan-500/80 bg-slate-900' : 'border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00F2FE]">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-100 text-sm group-hover:text-[#00F2FE] transition-colors line-clamp-1">
                          {project.name}
                        </h3>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {project.files.length} {isAr ? 'ملفات' : 'files'}
                        </span>
                      </div>
                    </div>

                    {projects.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition-all"
                        title={isAr ? 'حذف المشروع' : 'Delete Project'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {project.description || (isAr ? 'مشروع تطبيق سحابي تم إنشاؤه عبر CloudForge' : 'Cloud application project generated via CloudForge')}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => {
                      onSelectProject(project);
                      onSelectView('workspace');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800/80 text-[#00F2FE] font-bold text-xs hover:bg-[#00F2FE] hover:text-slate-950 transition-all flex items-center gap-1.5"
                  >
                    <span>{isAr ? 'فتح المطور' : 'Open IDE'}</span>
                    {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00F2FE]">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-xs">{project.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{project.files.length} {isAr ? 'ملفات' : 'files'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      onSelectProject(project);
                      onSelectView('workspace');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800/80 text-[#00F2FE] font-bold text-xs hover:bg-[#00F2FE] hover:text-slate-950 transition-all"
                  >
                    {isAr ? 'فتح' : 'Open'}
                  </button>

                  {projects.length > 1 && (
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
