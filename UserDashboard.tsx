import React, { useState } from 'react';
import { Project, Language, ViewMode } from './types';
import { useTranslation } from './lib/translations';
import {
  Plus,
  Search,
  FolderKanban,
  Sparkles,
  ExternalLink,
  Code2,
  Copy,
  Trash2,
  Cpu,
  HardDrive,
  Globe,
  Lock,
  MoreVertical,
  Activity,
  Bell,
  Settings,
  Users,
  LayoutGrid,
  Check,
  ChevronRight,
  Clock,
  Play,
  Home,
  CreditCard,
  UserCheck,
  ShieldCheck,
  Layers,
  Terminal,
  Zap
} from 'lucide-react';

interface UserDashboardProps {
  projects: Project[];
  activeProjectId: string;
  language: Language;
  onSelectProject: (id: string) => void;
  onCreateNewProject: () => void;
  onCloneProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onSelectView: (view: ViewMode) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  projects,
  activeProjectId,
  language,
  onSelectProject,
  onCreateNewProject,
  onCloneProject,
  onDeleteProject,
  onSelectView,
}) => {
  const isAr = language === 'ar';
  const t = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'notifications' | 'settings' | 'account'>('projects');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = (proj: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedId(proj.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 bg-[#0B0F19] text-slate-100 flex flex-col md:flex-row overflow-hidden font-sans min-h-[calc(100vh-60px)]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950/90 border-b md:border-b-0 md:border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* User Profile Summary */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F2FE] via-blue-600 to-[#7928CA] flex items-center justify-center font-black text-slate-950 shadow-md">
              ⚡
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{t('myAccount')}</h4>
              <p className="text-[10px] text-cyan-400 font-mono truncate">
                {(localStorage.getItem('cloudforge_user_plan') || 'pro') === 'enterprise'
                  ? 'Enterprise Plan Active 🏢'
                  : (localStorage.getItem('cloudforge_user_plan') || 'pro') === 'pro'
                  ? 'Pro Plan Active ⚡'
                  : 'Hobby Plan Active 🚀'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {/* 1. Home */}
            <button
              onClick={() => onSelectView('landing')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 hover:border hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
            >
              <Home className="w-4 h-4 text-cyan-400" />
              <span>{t('home')}</span>
            </button>

            {/* 2. My Projects */}
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 hover:border hover:border-cyan-500/30'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-cyan-400" />
              <span>{t('myProjects')}</span>
              <span className="ml-auto rtl:mr-auto rtl:ml-0 text-[10px] bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 font-mono">
                {projects.length}
              </span>
            </button>

            {/* 3. Marketplace */}
            <button
              onClick={() => onSelectView('marketplace')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 hover:border hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>{t('marketplace')}</span>
            </button>

            {/* 4. Notifications */}
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-slate-900 text-white border border-slate-800 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>{t('notifications')}</span>
              <span className="ml-auto rtl:mr-auto rtl:ml-0 text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">
                2
              </span>
            </button>

            {/* 5. Pricing */}
            <button
              onClick={() => onSelectView('pricing')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 hover:border hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>{t('pricing')}</span>
            </button>

            {/* 6. Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white border border-slate-800 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>{t('settings')}</span>
            </button>

            {/* 7. Account */}
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'account'
                  ? 'bg-slate-900 text-white border border-slate-800 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>{t('account')}</span>
            </button>
          </nav>
        </div>

        {/* Resources Usage Widget */}
        <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3 mt-6">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
            <span>{isAr ? 'استهلاك الموارد السحابية' : 'Cloud Resource Usage'}</span>
            <span className="text-emerald-400 font-mono">0.4 GB / 4.0 GB</span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                <span>RAM Container</span>
                <span>12%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="w-[12%] h-full bg-cyan-400 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                <span>CPU Speed</span>
                <span>3%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="w-[3%] h-full bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Central Workspace Main Content Area */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {activeTab === 'projects' && (
          <>
            {/* Header Bar inside Dashboard */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <FolderKanban className="w-6 h-6 text-cyan-400" />
                  <span>{t('dashboardAndProjects')}</span>
                </h1>
                <p className="text-slate-400 text-xs mt-1">
                  {t('activeContainer')}
                </p>
              </div>

              {/* Prominent Action Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onCreateNewProject}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] hover:scale-105 active:scale-95 text-slate-950 font-black text-xs shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t('createNewProject')}</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchProjects')}
                  className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{isAr ? 'إجمالي المشاريع:' : 'Total Projects:'}</span>
                <span className="font-bold text-cyan-400 font-mono">{filteredProjects.length}</span>
              </div>
            </div>

            {/* Project Cards Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj.id);
                      onSelectView('workspace');
                    }}
                    className={`group cursor-pointer bg-slate-900/70 backdrop-blur-xl border rounded-3xl p-5 space-y-4 transition-all duration-300 relative hover:-translate-y-1 ${
                      isActive
                        ? 'border-cyan-500 shadow-xl shadow-cyan-500/15 bg-slate-900/90'
                        : 'border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 font-bold shadow-inner">
                          <Code2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                            {proj.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                              RUNNING
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">:3000</span>
                          </div>
                        </div>
                      </div>

                      {/* Active Indicator Badge */}
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-extrabold border border-cyan-500/40">
                          {isAr ? 'نشط' : 'Active'}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {proj.description || (isAr ? 'تطبيق سحابي متكامل متولد بواسطة الذكاء الاصطناعي' : 'Cloud application generated via CloudForge AI')}
                    </p>

                    {/* Stats & Metadata Footer */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(proj.updatedAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleCopyLink(proj, e)}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                          title={isAr ? 'نسخ الرابط' : 'Copy link'}
                        >
                          {copiedId === proj.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCloneProject(proj.id);
                          }}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-all"
                          title={t('cloneProject')}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>

                        {projects.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProject(proj.id);
                            }}
                            className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-all"
                            title={t('deleteProject')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Open in Workstation CTA */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(proj.id);
                        onSelectView('workspace');
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-950 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-all border border-slate-800 group-hover:border-cyan-400"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t('openApp')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-xl font-bold text-white">{t('notifications')}</h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-3">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">{isAr ? 'تم تحديث وكيل CloudForge v5.2' : 'CloudForge Agent v5.2 Deployed'}</h4>
                  <p className="text-slate-400 text-xs mt-1">{isAr ? 'تم تحسين سرعة توليد الأكواد بنسبة 40% وإتاحة خادم منفذ 3000 بفرط استجابة.' : 'Code generation speed boosted by 40% with instant port 3000 container preview.'}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">{isAr ? 'تأمين التشفير والحاويات' : 'Container Sandboxing Active'}</h4>
                  <p className="text-slate-400 text-xs mt-1">{isAr ? 'جميع ملفاتك المصدرية محمية ومعزولة تماماً في بيئة سحابية آمنة.' : 'Your source files are fully sandboxed and protected.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-xl font-bold text-white">{t('systemSettings')}</h2>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="font-bold text-white">{isAr ? 'اتجاه الواجهة الافتراضي (RTL/LTR)' : 'Default Layout Direction'}</div>
                  <div className="text-slate-400 text-[11px]">{isAr ? 'دعم العربية واللغات من اليمين لليسار' : 'Arabic & Right-to-Left alignment'}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 font-mono font-bold">{isAr ? 'RTL' : 'LTR'}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="font-bold text-white">{isAr ? 'منفذ المعاينة السحابي' : 'Preview Container Port'}</div>
                  <div className="text-slate-400 text-[11px]">{isAr ? 'البناء على المنفذ المعتمد 3000' : 'Bound directly to port 3000'}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 font-mono font-bold">:3000</span>
              </div>
            </div>
          </div>
        )}

        {/* Account / Login Tab */}
        {activeTab === 'account' && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-xl font-bold text-white">{t('myAccount')}</h2>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 text-xs">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">CloudForge Developer</h3>
                  <p className="text-slate-400 text-xs">developer@cloudforge.io</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-[10px] font-mono font-bold">
                    Pro Developer Account
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
