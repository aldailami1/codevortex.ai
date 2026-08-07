import React, { useState, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Project, Language } from '../types';
import { formatCode } from '../lib/formatter';
import {
  FileCode,
  FileSpreadsheet,
  FileJson,
  Copy,
  Check,
  Plus,
  Code2,
  Wand2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface CodeEditorProps {
  project: Project;
  language: Language;
  onUpdateFile: (path: string, content: string) => void;
  onAddFile: (path: string) => void;
  onDeleteFile: (path: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  project,
  language,
  onUpdateFile,
  onAddFile,
  onDeleteFile,
}) => {
  const isAr = language === 'ar';

  const [activeFilePath, setActiveFilePath] = useState<string>('index.html');
  const [copied, setCopied] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isFormatting, setIsFormatting] = useState<boolean>(false);
  const [formatOnSave, setFormatOnSave] = useState<boolean>(true);
  const [formatStatus, setFormatStatus] = useState<string | null>(null);

  const editorRef = useRef<any>(null);

  const activeFile = project.files.find((f) => f.path === activeFilePath) || project.files[0];

  const handleCopyCode = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFormatCode = async () => {
    if (!activeFile) return;
    setIsFormatting(true);
    setFormatStatus(null);

    const result = await formatCode(activeFile.content, activeFile.path);
    setIsFormatting(false);

    if (result.error) {
      setFormatStatus(`⚠️ ${result.error}`);
      setTimeout(() => setFormatStatus(null), 4000);
      return;
    }

    if (result.changed) {
      onUpdateFile(activeFilePath, result.formatted);
      setFormatStatus(isAr ? '✨ تم تنسيق الكود بواسطة Prettier' : '✨ Code auto-formatted with Prettier');
    } else {
      setFormatStatus(isAr ? '👍 الكود منسق بالفعل' : '👍 Code is already formatted');
    }

    setTimeout(() => setFormatStatus(null), 3000);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register Ctrl+S / Cmd+S Format on Save shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
      if (formatOnSave && activeFile) {
        const val = editor.getValue();
        const res = await formatCode(val, activeFilePath);
        if (res.changed && !res.error) {
          editor.setValue(res.formatted);
          onUpdateFile(activeFilePath, res.formatted);
          setFormatStatus(isAr ? '✨ تم الحفظ والتنسيق تلقائياً' : '✨ Auto-formatted on save');
          setTimeout(() => setFormatStatus(null), 3000);
        }
      }
    });

    // Register Alt+Shift+F Prettier Format shortcut
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      handleFormatCode();
    });
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      onAddFile(newFileName.trim());
      setActiveFilePath(newFileName.trim());
      setNewFileName('');
      setShowAddModal(false);
    }
  };

  const getFileIcon = (path: string) => {
    if (path.endsWith('.html')) return <FileCode className="w-4 h-4 text-amber-400" />;
    if (path.endsWith('.css')) return <FileSpreadsheet className="w-4 h-4 text-cyan-400" />;
    if (path.endsWith('.js') || path.endsWith('.ts') || path.endsWith('.tsx')) return <FileCode className="w-4 h-4 text-yellow-400" />;
    return <FileJson className="w-4 h-4 text-blue-400" />;
  };

  const getMonacoLanguage = (path: string) => {
    if (path.endsWith('.html')) return 'html';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-hidden">
      {/* File Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {project.files.map((file) => {
            const isActive = file.path === activeFilePath;
            return (
              <button
                key={file.path}
                onClick={() => setActiveFilePath(file.path)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                  isActive
                    ? 'bg-slate-950 border-cyan-500/60 text-cyan-400 shadow-lg'
                    : 'bg-slate-900/50 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {getFileIcon(file.path)}
                <span>{file.path}</span>
                {project.files.length > 1 && file.path !== 'index.html' && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.path);
                    }}
                    className="hover:text-rose-400 p-0.5 rounded transition-colors ml-1"
                    title={isAr ? 'حذف الملف' : 'Delete file'}
                  >
                    ×
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => setShowAddModal(true)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-xs font-bold"
            title={isAr ? 'إضافة ملف جديد' : 'Add new file'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Format on Save Toggle */}
          <button
            onClick={() => setFormatOnSave(!formatOnSave)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-mono text-[11px] transition-all ${
              formatOnSave
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={
              formatOnSave
                ? (isAr ? 'التنسيق التلقائي عند الحفظ مفعّل (Ctrl+S)' : 'Format on Save Enabled (Ctrl+S)')
                : (isAr ? 'تفعيل التنسيق عند الحفظ' : 'Enable Format on Save')
            }
          >
            {formatOnSave ? <ToggleRight className="w-4 h-4 text-cyan-400" /> : <ToggleLeft className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAr ? 'تنسيق عند الحفظ' : 'Format on Save'}</span>
          </button>

          {/* Auto-Format Prettier Button */}
          <button
            onClick={handleFormatCode}
            disabled={isFormatting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-300 font-extrabold hover:text-white transition-all shadow-md active:scale-95"
            title={isAr ? 'تنسيق الكود عبر Prettier (Alt+Shift+F)' : 'Auto-Format code via Prettier (Alt+Shift+F)'}
          >
            <Wand2 className={`w-3.5 h-3.5 text-cyan-400 ${isFormatting ? 'animate-spin' : ''}`} />
            <span>{isFormatting ? (isAr ? 'جاري التنسيق...' : 'Formatting...') : (isAr ? 'تنسيق Prettier' : 'Auto-Format')}</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الكود' : 'Copy Code')}</span>
          </button>
        </div>
      </div>

      {/* Monaco Code Editor */}
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
            onChange={(val) => onUpdateFile(activeFilePath, val || '')}
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              automaticLayout: true,
              wordWrap: 'on',
              lineNumbers: 'on',
              folding: true,
              scrollBeyondLastLine: false,
              tabSize: 2,
              smoothScrolling: true,
              fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 text-xs">
            {isAr ? 'لم يتم تحديد أي ملف' : 'No file selected'}
          </div>
        )}
      </div>

      {/* Add File Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateFile} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <span>{isAr ? 'إضافة ملف كود جديد' : 'Create New Code File'}</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                {isAr ? 'اسم الملف مع الامتداد (مثال: components.js أو custom.css):' : 'File name with extension:'}
              </label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="e.g. custom.js"
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-sm text-slate-100 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-semibold"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={!newFileName.trim()}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
              >
                {isAr ? 'إنشاء الملف' : 'Create File'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
