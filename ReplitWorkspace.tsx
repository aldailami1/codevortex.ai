import React, { useState, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Project, Language } from '../types';
import { InteractiveTerminal } from './InteractiveTerminal';
import { LiveCanvas } from './LiveCanvas';
import { formatCode } from '../lib/formatter';
import {
  FileCode,
  FolderTree,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  Code2,
  Terminal as TerminalIcon,
  Eye,
  Sparkles,
  Search,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Send,
  Maximize2,
  X,
  Bot,
  LayoutGrid,
  Sidebar,
  SlidersHorizontal,
  RefreshCw,
  Wand2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface ReplitWorkspaceProps {
  project: Project;
  language: Language;
  onUpdateFileContent: (path: string, content: string) => void;
  onAddFile: (path: string, content: string) => void;
  onDeleteFile: (path: string) => void;
  onApplyAICodeEdit: (prompt: string) => void;
  isAIProcessing: boolean;
  onOpenDeployModal: () => void;
}

export const ReplitWorkspace: React.FC<ReplitWorkspaceProps> = ({
  project,
  language,
  onUpdateFileContent,
  onAddFile,
  onDeleteFile,
  onApplyAICodeEdit,
  isAIProcessing,
  onOpenDeployModal,
}) => {
  const isAr = language === 'ar';

  // Pane Visibility States for Resizable Layout
  const [showFileTree, setShowFileTree] = useState<boolean>(true);
  const [showTerminal, setShowTerminal] = useState<boolean>(true);
  const [showPreview, setShowPreview] = useState<boolean>(true);

  // Active File & Virtual Tree State
  const [activeFilePath, setActiveFilePath] = useState<string>('index.html');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNewFileModal, setShowNewFileModal] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showAICopilotDrawer, setShowAICopilotDrawer] = useState<boolean>(false);
  const [aiCopilotPrompt, setAICopilotPrompt] = useState<string>('');
  const [isFormatting, setIsFormatting] = useState<boolean>(false);
  const [formatOnSave, setFormatOnSave] = useState<boolean>(true);
  const [formatStatus, setFormatStatus] = useState<string | null>(null);
  const editorRef = useRef<any>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    src: true,
    components: true,
  });

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ CodeVortex Cloud IDE Kernel v5.2.0',
    `📁 Mounted ${project.files.length} project files into memory workspace`,
    '🟢 Monaco Editor & Vite Dev Server running on Port 3000',
  ]);

  const activeFile = project.files.find((f) => f.path === activeFilePath) || project.files[0];

  const handleFormatCode = async () => {
    if (!activeFile) return;
    setIsFormatting(true);
    setFormatStatus(null);

    const result = await formatCode(activeFile.content, activeFile.path);
    setIsFormatting(false);

    if (result.error) {
      setFormatStatus(`⚠️ ${result.error}`);
      setTerminalLogs((prev) => [...prev, `❌ Prettier Error: ${result.error}`]);
      setTimeout(() => setFormatStatus(null), 4000);
      return;
    }

    if (result.changed) {
      onUpdateFileContent(activeFile.path, result.formatted);
      setFormatStatus(isAr ? '✨ تم تنسيق الكود بواسطة Prettier' : '✨ Code formatted with Prettier');
      setTerminalLogs((prev) => [...prev, `✨ Formatted ${activeFile.path} with Prettier`]);
    } else {
      setFormatStatus(isAr ? '👍 الكود منسق بالفعل' : '👍 Code is already formatted');
    }

    setTimeout(() => setFormatStatus(null), 3000);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Ctrl+S / Cmd+S Format on Save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
      if (formatOnSave && activeFile) {
        const val = editor.getValue();
        const res = await formatCode(val, activeFile.path);
        if (res.changed && !res.error) {
          editor.setValue(res.formatted);
          onUpdateFileContent(activeFile.path, res.formatted);
          setFormatStatus(isAr ? '✨ تم الحفظ والتنسيق تلقائياً' : '✨ Auto-formatted on save');
          setTerminalLogs((prev) => [...prev, `💾 Saved & formatted ${activeFile.path}`]);
          setTimeout(() => setFormatStatus(null), 3000);
        }
      }
    });

    // Alt+Shift+F Prettier Format
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      handleFormatCode();
    });
  };

  const handleCreateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let path = newFileName.trim();
    if (!path.includes('.')) path += '.js';

    onAddFile(path, `// ${path} - Created in CodeVortex Cloud IDE\n`);
    setActiveFilePath(path);
    setNewFileName('');
    setShowNewFileModal(false);
    setTerminalLogs((prev) => [...prev, `✅ Created new file: ${path}`]);
  };

  const handleDeleteActiveFile = (path: string) => {
    if (project.files.length <= 1) return;
    onDeleteFile(path);
    const remaining = project.files.filter((f) => f.path !== path);
    if (remaining.length > 0) {
      setActiveFilePath(remaining[0].path);
    }
    setTerminalLogs((prev) => [...prev, `🗑️ Removed file: ${path}`]);
  };

  const handleCopyCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAICopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCopilotPrompt.trim() || isAIProcessing) return;

    const promptText = aiCopilotPrompt.trim();
    onApplyAICodeEdit(promptText);
    setAICopilotPrompt('');
    setTerminalLogs((prev) => [
      ...prev,
      `🤖 AI Co-Pilot prompt received: "${promptText}"`,
      '⚡ Compiling workspace AST & updating live preview...',
    ]);
  };

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  // Helper for file type language mapping in Monaco Editor
  const getMonacoLanguage = (path: string) => {
    if (path.endsWith('.html')) return 'html';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };

  // Helper for file icon styling
  const getFileIcon = (path: string) => {
    if (path.endsWith('.html')) return <FileCode className="w-4 h-4 text-amber-400 shrink-0" />;
    if (path.endsWith('.css')) return <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />;
    if (path.endsWith('.js') || path.endsWith('.ts') || path.endsWith('.tsx'))
      return <FileCode className="w-4 h-4 text-blue-400 shrink-0" />;
    return <FileCode className="w-4 h-4 text-slate-400 shrink-0" />;
  };

  const filteredFiles = project.files.filter((f) =>
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col h-full overflow-hidden relative font-sans">
      {/* Workspace Top Toolbar Control Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-4 shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFileTree(!showFileTree)}
            className={`p-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-semibold ${
              showFileTree
                ? 'bg-slate-950 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isAr ? 'تبديل الشجرة البرمجية' : 'Toggle File Tree'}
          >
            <Sidebar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'الملفات' : 'Files'}</span>
          </button>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-semibold ${
              showPreview
                ? 'bg-slate-950 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isAr ? 'تبديل المعاينة الحية' : 'Toggle Preview Canvas'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'المعاينة' : 'Preview'}</span>
          </button>

          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-semibold ${
              showTerminal
                ? 'bg-slate-950 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isAr ? 'تبديل الطرفية والصدفة' : 'Toggle Cloud Terminal'}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'الطرفية' : 'Terminal'}</span>
          </button>
        </div>

        {/* Project Name and Deploy Button */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-bold text-xs">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{project.name || 'CodeVortex Application'}</span>
          </div>

          <button
            onClick={onOpenDeployModal}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>{isAr ? 'نشر سحابي' : 'Cloud Deploy'}</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Pane Replit Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden">
        {/* PANE 1: Virtual File Tree Explorer */}
        {showFileTree && (
          <div className="lg:col-span-2 bg-slate-900/90 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col h-full overflow-hidden transition-all">
            {/* Explorer Header */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                <span className="font-extrabold text-xs tracking-tight text-white uppercase">
                  {isAr ? 'شجرة الملفات' : 'FILE EXPLORER'}
                </span>
              </div>

              <button
                onClick={() => setShowNewFileModal(true)}
                className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                title={isAr ? 'إضافة ملف جديد' : 'New File'}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick File Search */}
            <div className="p-2 border-b border-slate-800/80">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث في الملفات...' : 'Filter files...'}
                  className="w-full bg-slate-950 border border-slate-800/80 rounded-xl pl-8 pr-3 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* File Tree List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredFiles.map((f) => {
                const isActive = f.path === activeFilePath;
                return (
                  <div
                    key={f.path}
                    onClick={() => setActiveFilePath(f.path)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getFileIcon(f.path)}
                      <span className="truncate">{f.path}</span>
                    </div>

                    {project.files.length > 1 && isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteActiveFile(f.path);
                        }}
                        className="opacity-60 hover:opacity-100 text-rose-400 hover:text-rose-300 transition-opacity p-0.5"
                        title={isAr ? 'حذف الملف' : 'Delete File'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* AI Co-Pilot Dock Trigger */}
            <div className="p-3 bg-slate-950 border-t border-slate-800">
              <button
                onClick={() => setShowAICopilotDrawer(!showAICopilotDrawer)}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/40 text-cyan-300 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>{isAr ? 'مساعد الذكاء الاصطناعي' : 'AI Co-Pilot'}</span>
              </button>
            </div>
          </div>
        )}

        {/* PANE 2: Center Code Editor with Monaco */}
        <div
          className={`${
            showFileTree && showPreview
              ? 'lg:col-span-5'
              : showFileTree || showPreview
              ? 'lg:col-span-7'
              : 'lg:col-span-12'
          } bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col h-full overflow-hidden transition-all`}
        >
          {/* Editor Tabs Bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-3 pt-2 flex items-center justify-between gap-2 overflow-x-auto select-none shrink-0">
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {project.files.map((f) => {
                const isActive = f.path === activeFilePath;
                return (
                  <button
                    key={f.path}
                    onClick={() => setActiveFilePath(f.path)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs font-semibold border-t border-x transition-all shrink-0 ${
                      isActive
                        ? 'bg-slate-950 border-slate-800 text-cyan-400 font-extrabold'
                        : 'bg-slate-900/50 border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {getFileIcon(f.path)}
                    <span>{f.path}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 py-0.5">
              {/* Format on Save Toggle */}
              <button
                onClick={() => setFormatOnSave(!formatOnSave)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-all border ${
                  formatOnSave
                    ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
                title={
                  formatOnSave
                    ? (isAr ? 'التنسيق التلقائي عند الحفظ مفعّل (Ctrl+S)' : 'Format on Save Enabled (Ctrl+S)')
                    : (isAr ? 'تفعيل التنسيق عند الحفظ' : 'Enable Format on Save')
                }
              >
                {formatOnSave ? <ToggleRight className="w-3.5 h-3.5 text-cyan-400" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                <span className="hidden xl:inline">{isAr ? 'تنسيق تلقائي' : 'Format on Save'}</span>
              </button>

              {/* Auto-Format Prettier Button */}
              <button
                onClick={handleFormatCode}
                disabled={isFormatting}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:text-white transition-all shadow active:scale-95 shrink-0"
                title={isAr ? 'تنسيق الكود بواسطة Prettier (Alt+Shift+F)' : 'Auto-Format code with Prettier (Alt+Shift+F)'}
              >
                <Wand2 className={`w-3.5 h-3.5 text-cyan-400 ${isFormatting ? 'animate-spin' : ''}`} />
                <span>{isFormatting ? (isAr ? 'تنسيق...' : 'Formatting...') : (isAr ? 'تنسيق Prettier' : 'Auto-Format')}</span>
              </button>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 text-xs font-semibold transition-all px-2 py-1 rounded bg-slate-950 border border-slate-800 shrink-0"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Canvas */}
          <div className="flex-1 bg-slate-950 relative overflow-hidden">
            {formatStatus && (
              <div className="absolute top-3 right-5 z-20 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
                {formatStatus}
              </div>
            )}

            {activeFile ? (
              <Editor
                height="100%"
                language={getMonacoLanguage(activeFile.path)}
                theme="vs-dark"
                value={activeFile.content}
                onMount={handleEditorMount}
                onChange={(val) => onUpdateFileContent(activeFile.path, val || '')}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                  fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                {isAr ? 'لا يوجد ملف محدد' : 'No file selected'}
              </div>
            )}
          </div>
        </div>

        {/* PANE 3: Live Preview & Terminal Pane */}
        {showPreview && (
          <div
            className={`${
              showFileTree ? 'lg:col-span-5' : 'lg:col-span-6'
            } bg-slate-900/50 flex flex-col h-full overflow-hidden transition-all`}
          >
            {/* Top Half: Live Sandbox Canvas */}
            <div className={`${showTerminal ? 'h-3/5' : 'h-full'} border-b border-slate-800 flex flex-col overflow-hidden`}>
              <LiveCanvas
                project={project}
                language={language}
                onUpdateFileContent={onUpdateFileContent}
              />
            </div>

            {/* Bottom Half: Interactive Cloud Shell Terminal */}
            {showTerminal && (
              <div className="h-2/5 p-2 bg-slate-950 overflow-hidden flex flex-col">
                <InteractiveTerminal
                  language={language}
                  onRunProject={() =>
                    setTerminalLogs((prev) => [...prev, '⚡ Refreshed application canvas in sandbox'])
                  }
                  onDeployProject={onOpenDeployModal}
                  additionalLogs={terminalLogs}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating AI Co-Pilot Slide-over Drawer */}
      {showAICopilotDrawer && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-sm text-white">
                {isAr ? 'مساعد الكود الذكي المباشر' : 'CodeVortex AI Co-Pilot'}
              </h3>
            </div>

            <button
              onClick={() => setShowAICopilotDrawer(false)}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold block">
                {isAr ? 'محرك التوليد المباشر:' : 'Streaming AI Assistant Engine:'}
              </span>
              <p className="text-slate-400 leading-relaxed">
                {isAr
                  ? 'اطلب أي تحسين أو إضافة عنصر جديد للكود، وسيقوم المحرك بإعادة الحزمة المصدرية مضافة مباشرة للبيئة.'
                  : 'Ask AI to craft components, fix CSS layouts, or generate interactive JS functions live.'}
              </p>
            </div>

            {isAIProcessing && (
              <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 flex items-center gap-3 animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span>{isAr ? 'جاري تحليل الأكواد وبنائها مباشرة...' : 'AI is parsing & generating updated source files...'}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleAICopilotSubmit} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={aiCopilotPrompt}
              onChange={(e) => setAICopilotPrompt(e.target.value)}
              placeholder={isAr ? 'مثال: أضف نموذج تواصل مع زر إرسال...' : 'e.g. Add a contact form with submit button...'}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!aiCopilotPrompt.trim() || isAIProcessing}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                !aiCopilotPrompt.trim() || isAIProcessing
                  ? 'bg-slate-800 text-slate-500'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* New File Creation Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-base">
              {isAr ? 'إنشاء ملف كود جديد' : 'Create New File'}
            </h3>

            <form onSubmit={handleCreateFileSubmit} className="space-y-3">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="e.g. utils.js or styles/custom.css"
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-100 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFileModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!newFileName.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20"
                >
                  {isAr ? 'إنشاء الملف' : 'Create File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
