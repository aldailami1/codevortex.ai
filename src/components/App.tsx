'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Project, ViewMode, Language, TemplateItem, AIModel, ProjectFile } from '@/types';
import { safeGetItem, safeSetItem, migrateLegacyCache } from '@/lib/utils';
import { Header } from './Header';
import { LandingPage } from './LandingPage';
import { UserDashboard } from './UserDashboard';
import { PricingSection } from './PricingSection';
import { AboutUsPage } from './AboutUsPage';
import { ContactUsPage } from './ContactUsPage';
import { SupportPage } from './SupportPage';
import { CommunityPage } from './CommunityPage';
import { ChangelogPage } from './ChangelogPage';
import { PrivacyPage } from './PrivacyPage';
import { PlatformCommandCenter } from './PlatformCommandCenter';
import { Footer } from './Footer';
import { FloatingSupportWidget } from './FloatingSupportWidget';

const LazyModuleLoading = () => (
  <div className="flex min-h-[18rem] items-center justify-center p-6 text-slate-400" role="status" aria-live="polite">
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-xs font-semibold shadow-xl">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
      <span>Loading CloudForge module…</span>
    </div>
  </div>
);

const LazyAcademyPage = dynamic(() => import('./AcademyPage').then((module) => module.AcademyPage), { loading: LazyModuleLoading, ssr: false });
const LazyPromptEngine = dynamic(() => import('./PromptEngine').then((module) => module.PromptEngine), { loading: LazyModuleLoading, ssr: false });
const LazyReplitWorkspace = dynamic(() => import('./ReplitWorkspace').then((module) => module.ReplitWorkspace), { loading: LazyModuleLoading, ssr: false });
const LazyLiveCanvas = dynamic(() => import('./LiveCanvas').then((module) => module.LiveCanvas), { loading: LazyModuleLoading, ssr: false });
const LazyCodeEditor = dynamic(() => import('./CodeEditor').then((module) => module.CodeEditor), { loading: LazyModuleLoading, ssr: false });
const LazyAIChatAssistant = dynamic(() => import('./AIChatAssistant').then((module) => module.AIChatAssistant), { loading: LazyModuleLoading, ssr: false });
const LazyMarketplace = dynamic(() => import('./Marketplace').then((module) => module.Marketplace), { loading: LazyModuleLoading, ssr: false });
const LazyDeploymentModal = dynamic(() => import('./DeploymentModal').then((module) => module.DeploymentModal), { loading: LazyModuleLoading, ssr: false });
const LazyProjectDrawer = dynamic(() => import('./ProjectDrawer').then((module) => module.ProjectDrawer), { loading: LazyModuleLoading, ssr: false });
const LazyCommandPalette = dynamic(() => import('./CommandPalette').then((module) => module.CommandPalette), { loading: LazyModuleLoading, ssr: false });
const LazyProjectUploadModal = dynamic(() => import('./ProjectUploadModal').then((module) => module.ProjectUploadModal), { loading: LazyModuleLoading, ssr: false });
const LazySEOHelperModal = dynamic(() => import('./SEOHelperModal').then((module) => module.SEOHelperModal), { loading: LazyModuleLoading, ssr: false });
const LazyCloudForgeEngine = dynamic(() => import('./CloudForgeEngine').then((module) => module.CloudForgeEngine), { loading: LazyModuleLoading, ssr: false });
const INITIAL_PROJECT: Project = {
  id: 'proj-default',
  name: 'CloudForge Workstation',
  description: 'AI Generated Cloud Application & Repl Workspace',
  language: 'ar',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isRTL: true,
  files: [
    {
      path: 'index.html',
      content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CloudForge Engine - منصة التطوير السحابية الذكية</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-[#0B0F19] text-slate-100 font-sans min-h-screen flex flex-col justify-between">
  <header class="border-b border-slate-800/80 px-6 py-4 backdrop-blur-md bg-[#0B0F19]/80 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00F2FE] via-blue-600 to-[#7928CA] flex items-center justify-center font-black text-slate-950 shadow-lg shadow-cyan-500/20">
          ⚡
        </div>
        <span class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-[#00F2FE] bg-clip-text text-transparent">
          CloudForge Engine
        </span>
      </div>
    </div>
  </header>
  <script src="app.js"></script>
  <script>lucide.createIcons();</script>
</body>
</html>`,
    },
    {
      path: 'styles.css',
      content: `body { font-family: 'Cairo', sans-serif; }`,
    },
    {
      path: 'app.js',
      content: `let count = 1420;`,
    },
  ],
};

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeView, setActiveView] = useState<ViewMode>('landing');
  const [viewHistory, setViewHistory] = useState<ViewMode[]>([]);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showSEOModal, setShowSEOModal] = useState<boolean>(false);

  const handleSelectView = (newView: ViewMode) => {
    if (newView !== activeView) {
      setViewHistory((prev) => [...prev, activeView]);
      setActiveView(newView);
    }
  };

  const handleGoBack = () => {
    if (viewHistory.length > 0) {
      const prevView = viewHistory[viewHistory.length - 1];
      setViewHistory((prev) => prev.slice(0, prev.length - 1));
      setActiveView(prevView);
    } else {
      setActiveView('landing');
    }
  };

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = safeGetItem('cloudforge_projects_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local projects:', e);
      }
    }
    return [INITIAL_PROJECT];
  });

  // Migrate legacy CloudForge cache keys -> CloudForge keys once.
  useEffect(() => {
    migrateLegacyCache();
  }, []);

  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || INITIAL_PROJECT.id);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [showProjectsDrawer, setShowProjectsDrawer] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  useEffect(() => {
    safeSetItem('cloudforge_projects_v1', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.title = 'CloudForge Platform | Cloud Development Engine';
  }, [language]);

  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0] || INITIAL_PROJECT;

  const handleGenerateProject = async (
    prompt: string,
    model: AIModel,
    settings?: { isRTL: boolean; projectType: string }
  ) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model,
          language,
          projectType: settings?.projectType || 'fullstack',
        }),
      });

      if (!response.ok) throw new Error(`Server status ${response.status}`);
      const data = await response.json();

      const newProj: Project = {
        id: `proj-${Date.now()}`,
        name: data.title || prompt.substring(0, 24) || 'New AI Project',
        description: data.description || 'Generated by CloudForge AI Engine',
        language,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        files: data.files || INITIAL_PROJECT.files,
        isRTL: data.isRTL ?? (language === 'ar'),
        modelUsed: model,
      };

      setProjects((prev) => [newProj, ...prev]);
      setActiveProjectId(newProj.id);
      setActiveView('workspace');
    } catch (err) {
      const fallbackProj: Project = {
        ...INITIAL_PROJECT,
        id: `proj-fallback-${Date.now()}`,
        name: prompt.substring(0, 24) || 'Cloud Project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isRTL: language === 'ar',
      };
      setProjects((prev) => [fallbackProj, ...prev]);
      setActiveProjectId(fallbackProj.id);
      setActiveView('workspace');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyCodeEdit = async (prompt: string) => {
    setIsRefining(true);
    try {
      const response = await fetch('/api/ai/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          currentFiles: currentProject.files,
        }),
      });
      if (!response.ok) throw new Error(`Server status ${response.status}`);
      const data = await response.json();
      if (data.updatedFiles && Array.isArray(data.updatedFiles)) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === activeProjectId ? { ...p, files: data.updatedFiles, updatedAt: new Date().toISOString() } : p
          )
        );
      }
    } catch (err) {
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProjectId ? { ...p, updatedAt: new Date().toISOString() } : p))
      );
    } finally {
      setIsRefining(false);
    }
  };

  const handleUpdateFile = (path: string, content: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProjectId) return p;
        const updatedFiles = p.files.map((f) => (f.path === path ? { ...f, content } : f));
        return { ...p, files: updatedFiles, updatedAt: new Date().toISOString() };
      })
    );
  };

  const handleAddFile = (path: string, content?: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProjectId) return p;
        if (p.files.some((f) => f.path === path)) return p;
        const newFile = { path, content: content || `/* New file ${path} */\n` };
        return { ...p, files: [...p.files, newFile], updatedAt: new Date().toISOString() };
      })
    );
  };

  const handleDeleteFile = (path: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProjectId) return p;
        return { ...p, files: p.files.filter((f) => f.path !== path), updatedAt: new Date().toISOString() };
      })
    );
  };

  const handleImportTemplate = (template: TemplateItem, options?: { openDeploy?: boolean }) => {
    const importedProj: Project = {
      id: `proj-template-${Date.now()}`,
      name: language === 'ar' ? template.titleAr : template.title,
      description: language === 'ar' ? template.descriptionAr : template.description,
      language,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      files: template.files,
      isRTL: language === 'ar',
    };
    setProjects((prev) => [importedProj, ...prev]);
    setActiveProjectId(importedProj.id);
    setActiveView('workspace');
    if (options?.openDeploy) {
      window.setTimeout(() => setShowDeployModal(true), 0);
    }
  };

  const handleUpdateProjectName = (newName: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p))
    );
  };

  const handleCreateNewProject = () => {
    const blank: Project = {
      id: `proj-${Date.now()}`,
      name: language === 'ar' ? 'مشروع جديد' : 'New Project',
      description: 'Clean HTML/CSS/JS Application',
      language,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      files: INITIAL_PROJECT.files,
      isRTL: language === 'ar',
    };
    setProjects((prev) => [blank, ...prev]);
    setActiveProjectId(blank.id);
    setActiveView('workspace');
  };

  const handleCloneProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const cloned: Project = {
      ...target,
      id: `proj-${Date.now()}`,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [cloned, ...prev]);
    setActiveProjectId(cloned.id);
  };

  const handleDeleteProject = (id: string) => {
    const remaining = projects.filter((p) => p.id !== id);
    if (remaining.length === 0) return;
    setProjects(remaining);
    if (activeProjectId === id) {
      setActiveProjectId(remaining[0].id);
    }
  };

  const handleExportZip = async () => {
    try {
      const [{ default: JSZip }, { saveAs }] = await Promise.all([import('jszip'), import('file-saver')]);
      const zip = new JSZip();
      currentProject.files.forEach((file) => {
        zip.file(file.path, file.content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const safeName = currentProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      saveAs(blob, `${safeName || 'project'}-cloudforge.zip`);
    } catch (err) {
      console.error('Failed to generate ZIP archive:', err);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans ${language === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>
      <Header
        currentProject={currentProject}
        onUpdateProjectName={handleUpdateProjectName}
        activeView={activeView}
        onSelectView={handleSelectView}
        language={language}
        onToggleLanguage={setLanguage}
        onOpenProjectsDrawer={() => setShowProjectsDrawer(true)}
        onOpenDeployModal={() => setShowDeployModal(true)}
        onExportZip={handleExportZip}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        onGoBack={handleGoBack}
        canGoBack={viewHistory.length > 0}
        isLoginModalOpen={isLoginModalOpen}
        onToggleLoginModal={setIsLoginModalOpen}
      />

      <main key={activeView} className="flex-1 flex flex-col relative w-full">
        {activeView === 'landing' && (
          <LandingPage
            language={language}
            onSelectView={handleSelectView}
            onGenerateFromPrompt={(prompt, model) => handleGenerateProject(prompt, model)}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeView === 'control-center' && (
          <PlatformCommandCenter
            language={language}
            project={currentProject}
            onSelectView={handleSelectView}
            onOpenWorkspace={() => setActiveView('workspace')}
            onOpenDeploy={() => setShowDeployModal(true)}
          />
        )}

        {activeView === 'dashboard' && (
          <UserDashboard
            projects={projects}
            activeProjectId={activeProjectId}
            currentProject={currentProject}
            language={language}
            onSelectProject={setActiveProjectId}
            onCreateProject={handleCreateNewProject}
            onCloneProject={handleCloneProject}
            onDeleteProject={handleDeleteProject}
            onSelectView={handleSelectView}
          />
        )}

        {activeView === 'pricing' && (
          <PricingSection
            language={language}
            onSelectView={handleSelectView}
            onOpenDeployModal={() => setShowDeployModal(true)}
          />
        )}

        {activeView === 'about' && (
          <AboutUsPage
            language={language}
            onSelectView={handleSelectView}
          />
        )}

        {activeView === 'contact' && (
          <ContactUsPage
            language={language}
          />
        )}

        {(activeView === 'support' || activeView === 'support-sales' || activeView === 'support-billing' || activeView === 'support-tech' || activeView === 'support-executive') && (
          <SupportPage
            language={language}
            onSelectView={handleSelectView}
            initialDepartment={
              activeView === 'support-billing' ? 'billing' :
              activeView === 'support-tech' ? 'tech' :
              activeView === 'support-executive' ? 'executive' : 'sales'
            }
          />
        )}

        {activeView === 'community' && (
          <CommunityPage
            language={language}
          />
        )}

        {activeView === 'changelog' && (
          <ChangelogPage
            language={language}
          />
        )}

        {activeView === 'privacy' && (
          <PrivacyPage
            language={language}
          />
        )}

        {activeView === 'academy' && (
          <LazyAcademyPage
            language={language}
            onOpenWorkspace={(initialCode) => {
              if (initialCode) {
                handleAddFile(`example-${Date.now()}.js`, initialCode);
              }
              setActiveView('workspace');
            }}
          />
        )}

        {activeView === 'workspace' && (
          <div className="flex-1 flex flex-col w-full">
            <LazyPromptEngine
              language={language}
              onGenerate={handleGenerateProject}
              isGenerating={isGenerating}
            />
            <LazyReplitWorkspace
              project={currentProject}
              language={language}
              onUpdateFileContent={handleUpdateFile}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
              onApplyAICodeEdit={handleApplyCodeEdit}
              isAIProcessing={isRefining}
              onOpenDeployModal={() => setShowDeployModal(true)}
            />
          </div>
        )}

        {activeView === 'preview' && (
          <LazyLiveCanvas
            project={currentProject}
            language={language}
            onUpdateFileContent={handleUpdateFile}
          />
        )}

        {activeView === 'code' && (
          <LazyCodeEditor
            project={currentProject}
            language={language}
            onUpdateFile={handleUpdateFile}
            onAddFile={handleAddFile}
            onDeleteFile={handleDeleteFile}
          />
        )}

        {activeView === 'chat' && (
          <LazyAIChatAssistant
            project={currentProject}
            language={language}
            onApplyCodeEdit={handleApplyCodeEdit}
            isProcessing={isRefining}
          />
        )}

        {activeView === 'marketplace' && (
          <LazyMarketplace
            language={language}
            onImportTemplate={handleImportTemplate}
            onDeployTemplate={(template) => handleImportTemplate(template, { openDeploy: true })}
          />
        )}

        {activeView === 'cloudforge' && (
          <LazyCloudForgeEngine
            language={language}
            currentProject={currentProject}
            onOpenWorkspace={() => setActiveView('workspace')}
            onDeployProject={(schema) => {
              setProjects((prev) =>
                prev.map((p) =>
                  p.id === activeProjectId ? { ...p, description: JSON.stringify(schema) } : p
                )
              );
            }}
          />
        )}
      </main>

      {activeView !== 'workspace' && activeView !== 'preview' && activeView !== 'code' && (
        <Footer language={language} onSelectView={handleSelectView} />
      )}

      <FloatingSupportWidget
        language={language}
        onNavigateToDepartment={(dept) => setActiveView(`support-${dept}` as any)}
      />

      <LazyCommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        language={language}
        files={currentProject.files}
        onSelectFile={(path) => setActiveView('workspace')}
        onSelectView={setActiveView}
        onOpenDeployModal={() => setShowDeployModal(true)}
        onToggleLanguage={setLanguage}
        onTriggerAI={handleApplyCodeEdit}
      />

      {showDeployModal && (
        <LazyDeploymentModal
          project={currentProject}
          language={language}
          onClose={() => setShowDeployModal(false)}
        />
      )}

      {showProjectsDrawer && (
        <LazyProjectDrawer
          projects={projects}
          activeProjectId={activeProjectId}
          language={language}
          onSelectProject={setActiveProjectId}
          onCreateNewProject={handleCreateNewProject}
          onCloneProject={handleCloneProject}
          onDeleteProject={handleDeleteProject}
          onClose={() => setShowProjectsDrawer(false)}
        />
      )}

      <LazyProjectUploadModal
        language={language}
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onProjectUploaded={(newProj) => {
          setProjects((prev) => [newProj, ...prev]);
          setActiveProjectId(newProj.id);
          setActiveView('workspace');
        }}
      />

      <LazySEOHelperModal
        project={currentProject}
        language={language}
        isOpen={showSEOModal}
        onClose={() => setShowSEOModal(false)}
        onInjectSEOFiles={(newFiles) => {
          setProjects((prev) =>
            prev.map((p) => {
              if (p.id !== activeProjectId) return p;
              const fileMap = new Map(p.files.map((f) => [f.path, f]));
              newFiles.forEach((nf) => fileMap.set(nf.path, nf));
              return {
                ...p,
                files: Array.from(fileMap.values()),
                updatedAt: new Date().toISOString(),
              };
            })
          );
        }}
      />
    </div>
  );
}
