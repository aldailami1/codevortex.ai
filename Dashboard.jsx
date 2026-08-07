import React from 'react';
import { Cpu, Plus, Layers, Zap, Folder, ArrowRight, Play, Database, Globe, CheckCircle } from 'lucide-react';

export function Dashboard({
  projects = [],
  activeProjectId,
  onSelectProject,
  onCreateNewProject,
  onSelectView,
  isRTL = false
}) {
  return (
    <div className={`p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-[#0B0F19] border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>CloudForge Engine Control Panel</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            مساحة العمل والمشاريع السحابية
          </h1>
          <p className="text-slate-400 text-xs max-w-xl">
            إدارة كافة المشاريع، هندسة البيانات Schema، متابعة السجلات وتوليد الأكواد بالتكامل مع Supabase
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onCreateNewProject}
            className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>مشروع جديد</span>
          </button>

          {onSelectView && (
            <button
              onClick={() => onSelectView('cloudforge')}
              className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-cyan-300 font-extrabold text-xs flex items-center justify-center gap-2"
            >
              <Database className="w-4 h-4" />
              <span>CloudForge Engine</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="text-xs text-slate-400 font-bold">المشاريع النشطة</div>
          <div className="text-2xl font-black text-white">{projects.length}</div>
          <div className="text-[10px] text-cyan-400 font-mono">24/7 Container Runtime Active</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="text-xs text-slate-400 font-bold">حالة القواعد Database</div>
          <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Supabase RLS</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Row Level Security Enforced</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="text-xs text-slate-400 font-bold">منفذ التشغيل Port</div>
          <div className="text-2xl font-black text-cyan-400 font-mono">3000</div>
          <div className="text-[10px] text-slate-500 font-mono">Cloud Run Standard Ingress</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="text-xs text-slate-400 font-bold">محرك AI</div>
          <div className="text-2xl font-black text-purple-400">Gemini 3.6 Flash</div>
          <div className="text-[10px] text-slate-500 font-mono">Neural Engine Pipeline</div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>المشاريع الحالية</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const isSelected = proj.id === activeProjectId;
            return (
              <div
                key={proj.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-cyan-500 shadow-xl shadow-cyan-950/40'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                      <Folder className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                      {proj.files?.length || 0} ملفات
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white">{proj.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{proj.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (onSelectProject) onSelectProject(proj.id);
                      if (onSelectView) onSelectView('workspace');
                    }}
                    className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>فتح بيئة العمل</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>

                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(proj.updatedAt || Date.now()).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
