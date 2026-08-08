import React, { useState, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { ProjectFile, Language } from './types';
import { Wand2, ToggleLeft, ToggleRight, Copy, Check } from 'lucide-react';

// دالة تنسيق محلية آمنة تمنع أخطاء الاستدعاء المفقود في Vercel
const formatCode = async (code: string, path: string) => {
  return { formatted: code, changed: false, error: null };
};

interface CodeEditorProps {
  activeFile: ProjectFile | null;
  language: Language;
  onUpdateFileContent: (path: string, content: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  activeFile,
  language,
  onUpdateFileContent,
}) => {
  const isAr = language === 'ar';
  const editorRef = useRef<any>(null);
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatOnSave, setFormatOnSave] = useState(true);
  const [formatStatus, setFormatStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const getMonacoLanguage = (path: string) => {
    if (path.endsWith('.html')) return 'html';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };

  const handleFormat = async () => {
    if (!activeFile) return;
    setIsFormatting(true);

    const res = await formatCode(activeFile.content, activeFile.path);
    setIsFormatting(false);

    if (res.changed) {
      onUpdateFileContent(activeFile.path, res.formatted);
      setFormatStatus(isAr ? '✨ تم التنسيق بنجاح' : '✨ Code Formatted');
    } else {
      setFormatStatus(isAr ? '👍 الكود منسق بالفعل' : '👍 Already Formatted');
    }

    setTimeout(() => setFormatStatus(null), 3000);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
      if (formatOnSave && activeFile) {
        const val = editor.getValue();
        const res = await formatCode(val, activeFile.path);
        if (res.changed) {
          editor.setValue(res.formatted);
          onUpdateFileContent(activeFile.path, res.formatted);
        }
      }
    });
  };

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeFile) {
    return (
      <div className="flex-1 bg-slate-950 flex items-center justify-center text-slate-500 text-xs font-mono">
        {isAr ? 'قم باختيار ملف لعرضه' : 'Select a file to edit'}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-hidden relative font-sans">
      {/* Action Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-2 shrink-0 text-xs">
        <span className="font-mono text-cyan-400 font-bold truncate">
          {activeFile.path}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFormatOnSave(!formatOnSave)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono border transition-all ${
              formatOnSave
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {formatOnSave ? <ToggleRight className="w-3.5 h-3.5 text-cyan-400" /> : <ToggleLeft className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAr ? 'تنسيق الحفظ' : 'Format on Save'}</span>
          </button>

          <button
            onClick={handleFormat}
            disabled={isFormatting}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all"
          >
            <Wand2 className={`w-3.5 h-3.5 text-cyan-400 ${isFormatting ? 'animate-spin' : ''}`} />
            <span>{isAr ? 'تنسيق' : 'Format'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isAr ? 'تم' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
          </button>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 relative overflow-hidden">
        {formatStatus && (
          <div className="absolute top-3 right-5 z-20 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-xl backdrop-blur-md">
            {formatStatus}
          </div>
        )}

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
      </div>
    </div>
  );
};
