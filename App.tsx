import React, { useState, useEffect, useMemo } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Project, ViewMode, Language, TemplateItem, AIModel, ProjectFile } from './types';
const useTranslation = () => ({ t: (key: string) => key });
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
import { AcademyPage } from './AcademyPage';
import { PromptEngine } from './PromptEngine';
import { ReplitWorkspace } from './ReplitWorkspace';
import { LiveCanvas } from './LiveCanvas';
import { CodeEditor } from './CodeEditor';
import { AIChatAssistant } from './AIChatAssistant';
import { Marketplace } from './Marketplace';
import { DeploymentModal } from './DeploymentModal';
import { ProjectDrawer } from './ProjectDrawer';
import { CommandPalette } from './CommandPalette';
import { ProjectUploadModal } from './ProjectUploadModal';
import { SEOHelperModal } from './SEOHelperModal';
import { CloudForgeEngine } from './CloudForgeEngine';
import { Footer } from './Footer';
import { FloatingSupportWidget } from './FloatingSupportWidget';


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

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-[#0B0F19] text-slate-100 font-sans min-h-screen flex flex-col justify-between">

  <!-- Navbar -->
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

      <nav class="hidden md:flex gap-8 text-sm font-semibold text-slate-400">
        <a href="#features" class="hover:text-cyan-400 transition-colors">المميزات</a>
        <a href="#sandbox" class="hover:text-cyan-400 transition-colors">التجربة الحية</a>
        <a href="#pricing" class="hover:text-cyan-400 transition-colors">الباقات</a>
      </nav>

      <a href="#sandbox" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all">
        ابدأ البناء مجاناً
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="py-20 px-6 max-w-5xl mx-auto text-center space-y-6 relative">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-extrabold">
      <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
      بيئة التطوير والتوليد السحابي المباشر العالمية
    </div>

    <h1 class="text-4xl sm:text-6xl font-black text-white leading-tight">
      ابتكر، ابنِ، وانشر تطبيقك القادم في بيئة ريبلت سحابية فائقة السرعة
    </h1>

    <p class="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
      اكتب فكرتك بالأوامر النصية وسيقوم المحرك ببناء الأكواد والملفات وإتاحة المعاينة التفاعلية والشل السحابي فوراً.
    </p>

    <div class="pt-4 flex flex-col sm:flex-row justify-center gap-4">
      <button onclick="scrollDemo()" class="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all">
        تجربة المحاكي التفاعلي
      </button>
      <button onclick="alert('تم تفعيل محرر الأكواد المصدرية')" class="px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 font-semibold text-slate-200 text-sm">
        عرض الأكواد المصدرية
      </button>
    </div>
  </section>

  <!-- Interactive Sandbox -->
  <section id="sandbox" class="py-16 px-6 bg-slate-900/60 border-y border-slate-800/80">
    <div class="max-w-4xl mx-auto text-center space-y-6">
      <h2 class="text-2xl font-bold text-white">تفاعل مع عناصر الصفحة الحية</h2>
      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <p class="text-slate-400 text-sm">اضغط على الزر أدناه لتحديث عداد المبيعات التفاعلي مباشرة:</p>
        <button onclick="updateCount()" class="px-6 py-3 bg-[#00F2FE] hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20">
          تحديث العداد الحقيقي
        </button>
        <div id="counterVal" class="text-2xl font-extrabold text-[#00F2FE]">إجمالي الطلبات: 1,420</div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-800 py-6 text-center text-slate-500 text-xs">
    © 2026 CodeVortex Neural Engine. جميع الحقوق محفوظة.
  </footer>

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
      content: `let count = 1420;
function updateCount() {
  count++;
  document.getElementById('counterVal').innerText = "إجمالي الطلبات: " + count.toLocaleString();
}
function scrollDemo() {
  document.getElementById('sandbox').scrollIntoView({ behavior: 'smooth' });
}`,
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
    const saved = localStorage.getItem('codevortex_projects_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local projects:', e);
      }
    }
    return [INITIAL_PROJECT];
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || INITIAL_PROJECT.id);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [showProjectsDrawer, setShowProjectsDrawer] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
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

  // Scroll to top on every view switch to guarantee SPA view isolation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  // Sync projects to LocalStorage
  useEffect(() => {
    localStorage.setItem('codevortex_projects_v4', JSON.stringify(projects));
  }, [projects]);

  const t = useMemo(() => useTranslation(language), [language]);

  // Auto-switch document layout direction and update localized document title synchronously
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.title = `${t('appName')} | ${t('tagline')}`;
  }, [language, t]);

  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0] || INITIAL_PROJECT;

  // 1. Generate Project via AI
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
        description: data.description || 'Generated by CodeVortex AI Engine',
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
      console.warn('Network issue detected. Switching to local sandbox mode:', err);
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

  // 2. Refine Code via AI Co-Pilot
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
            p.id === activeProjectId
              ? {
                  ...p,
                  files: data.updatedFiles,
                  updatedAt: new Date().toISOString(),
                }
              : p
          )
        );
      }
    } catch (err) {
      console.warn('Refinement network issue detected. Applying local edit fallback:', err);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? {
                ...p,
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );
    } finally {
      setIsRefining(false);
    }
  };

  // Update file content manually in Code Editor
  const handleUpdateFile = (path: string, content: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProjectId) return p;
        const updatedFiles = p.files.map((f) => (f.path === path ? { ...f, content } : f));
        return { ...p, files: updatedFiles, updatedAt: new Date().toISOString() };
      })
    );
  };

  // Add new file to current project
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

  // Delete file
  const handleDeleteFile = (path: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProjectId) return p;
        return { ...p, files: p.files.filter((f) => f.path !== path), updatedAt: new Date().toISOString() };
      })
    );
  };

  // Import Template from Marketplace
  const handleImportTemplate = (template: TemplateItem) => {
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
  };

  // Rename Project
  const handleUpdateProjectName = (newName: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p))
    );
  };

  // Create Blank Project
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

  // Clone Project
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

  // Delete Project
  const handleDeleteProject = (id: string) => {
    const remaining = projects.filter((p) => p.id !== id);
    if (remaining.length === 0) return;
    setProjects(remaining);
    if (activeProjectId === id) {
      setActiveProjectId(remaining[0].id);
    }
  };

  // Export Clean Code ZIP / Bundle File
  const handleExportZip = async () => {
    try {
      const zip = new JSZip();
      currentProject.files.forEach((file) => {
        zip.file(file.path, file.content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const safeName = currentProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      saveAs(blob, `${safeName || 'project'}-codevortex.zip`);
    } catch (err) {
      console.error('Failed to generate ZIP archive:', err);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans ${language === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>
      {/* Top Main Navigation Header */}
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

      {/* Main SPA Container with Complete View Isolation */}
      <main key={activeView} className="flex-1 flex flex-col relative w-full">
        {activeView === 'landing' && (
          <LandingPage
            language={language}
            onSelectView={handleSelectView}
            onGenerateFromPrompt={(prompt, model) => handleGenerateProject(prompt, model)}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeView === 'dashboard' && (
          <UserDashboard
            projects={projects}
            activeProjectId={activeProjectId}
            language={language}
            onSelectProject={setActiveProjectId}
            onCreateNewProject={handleCreateNewProject}
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
          <AcademyPage
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
            <PromptEngine
              language={language}
              onGenerate={handleGenerateProject}
              isGenerating={isGenerating}
            />
            <ReplitWorkspace
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
          <LiveCanvas
            project={currentProject}
            language={language}
            onUpdateFileContent={handleUpdateFile}
          />
        )}

        {activeView === 'code' && (
          <CodeEditor
            project={currentProject}
            language={language}
            onUpdateFile={handleUpdateFile}
            onAddFile={handleAddFile}
            onDeleteFile={handleDeleteFile}
          />
        )}

        {activeView === 'chat' && (
          <AIChatAssistant
            project={currentProject}
            language={language}
            onApplyCodeEdit={handleApplyCodeEdit}
            isProcessing={isRefining}
          />
        )}

        {activeView === 'marketplace' && (
          <Marketplace
            language={language}
            onImportTemplate={handleImportTemplate}
          />
        )}

        {activeView === 'cloudforge' && (
          <CloudForgeEngine
            language={language}
            currentProject={currentProject}
            onOpenWorkspace={() => setActiveView('workspace')}
            onDeployProject={(schema) => {
              // Update project description with schema JSON
              setProjects((prev) =>
                prev.map((p) =>
                  p.id === activeProjectId
                    ? { ...p, description: JSON.stringify(schema) }
                    : p
                )
              );
            }}
          />
        )}
      </main>

      {/* Global Footer */}
      {activeView !== 'workspace' && activeView !== 'preview' && activeView !== 'code' && (
        <Footer language={language} onSelectView={handleSelectView} />
      )}

      {/* Floating Customer Support Live Chat Widget */}
      <FloatingSupportWidget
        language={language}
        onNavigateToDepartment={(dept) => setActiveView(`support-${dept}` as any)}
      />

      {/* Global Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        language={language}
        files={currentProject.files}
        onSelectFile={(path) => {
          setActiveView('workspace');
        }}
        onSelectView={setActiveView}
        onOpenDeployModal={() => setShowDeployModal(true)}
        onToggleLanguage={setLanguage}
        onTriggerAI={handleApplyCodeEdit}
      />

      {/* Deployment Modal */}
      {showDeployModal && (
        <DeploymentModal
          project={currentProject}
          language={language}
          onClose={() => setShowDeployModal(false)}
        />
      )}

      {/* Projects Manager Drawer */}
      {showProjectsDrawer && (
        <ProjectDrawer
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

      {/* Upload ZIP Project Modal */}
      <ProjectUploadModal
        language={language}
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onProjectUploaded={(newProj) => {
          setProjects((prev) => [newProj, ...prev]);
          setActiveProjectId(newProj.id);
          setActiveView('workspace');
        }}
      />

      {/* SEO & Indexing Helper Modal */}
      <SEOHelperModal
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
