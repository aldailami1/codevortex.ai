import React, { useState, useRef, useEffect } from 'react';
import { Language, TerminalLog } from '../types';
import {
  Terminal as TerminalIcon,
  Play,
  Trash2,
  Copy,
  Check,
  Zap,
  CornerDownLeft,
  Activity,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface InteractiveTerminalProps {
  language: Language;
  onRunProject?: () => void;
  onDeployProject?: () => void;
  additionalLogs?: string[];
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  language,
  onRunProject,
  onDeployProject,
  additionalLogs = [],
}) => {
  const isAr = language === 'ar';

  const [inputCmd, setInputCmd] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: '1',
      type: 'info',
      text: 'CodeVortex Neural Cloud Kernel v5.2.0-release',
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: '2',
      type: 'success',
      text: '⚡ Environment booted on port 3000 (Vite 5.1 + Tailwind CSS engine ready)',
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: '3',
      type: 'info',
      text: '$ type "help" for available developer shell commands',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    if (additionalLogs.length > 0) {
      const newEntries: TerminalLog[] = additionalLogs.map((log, i) => ({
        id: `ext-${Date.now()}-${i}`,
        type: log.includes('✅') || log.includes('success') ? 'success' : log.includes('⚡') ? 'info' : 'info',
        text: log,
        timestamp: new Date().toLocaleTimeString(),
      }));
      setLogs((prev) => [...prev, ...newEntries]);
    }
  }, [additionalLogs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputCmd.trim();
    if (!cmd) return;

    const userLog: TerminalLog = {
      id: Date.now().toString(),
      type: 'cmd',
      text: `$ ${cmd}`,
      timestamp: new Date().toLocaleTimeString(),
    };

    let responseLogText = '';
    let responseType: 'info' | 'success' | 'warning' | 'error' = 'info';

    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      responseLogText = isAr
        ? 'الأوامر المتاحة:\n - run: تشغيل وتحديث المعاينة\n - build: بناء وحزم المشروع\n - deploy: النشر السحابي الفوري\n - clear: مسح السجل\n - status: حالة الخادم والسحابة\n - ls: عرض قائمة الملفات\n - info: معلومات المحرك العصبي'
        : 'Available commands:\n - run: Execute project in sandbox\n - build: Compile project bundle\n - deploy: Trigger live cloud deployment\n - clear: Clear console logs\n - status: Check dev server status\n - ls: List project bundle files\n - info: Show CodeVortex Engine spec';
    } else if (lower === 'run' || lower === 'npm run dev' || lower === 'vite') {
      responseLogText = '⚡ Compiling assets... Sandbox server updated at http://localhost:3000';
      responseType = 'success';
      if (onRunProject) onRunProject();
    } else if (lower === 'build' || lower === 'npm run build') {
      responseLogText = '📦 [Vite Build] Bundling HTML/CSS/JS... Output generated in /dist/ index.html (0 errors, 0 warnings)';
      responseType = 'success';
    } else if (lower === 'deploy') {
      responseLogText = '🚀 Triggering One-Click Cloud Deployment pipeline... Opening deployment dialog';
      responseType = 'success';
      if (onDeployProject) onDeployProject();
    } else if (lower === 'clear') {
      setLogs([]);
      setInputCmd('');
      return;
    } else if (lower === 'status') {
      responseLogText = '🟢 Dev Server: RUNNING | Port: 3000 | Memory: 42MB | Node: v20.11.0 | Engine: CodeVortex Neural v5';
      responseType = 'success';
    } else if (lower === 'ls' || lower === 'dir') {
      responseLogText = '📄 index.html  🎨 styles.css  ⚡ app.js  📋 metadata.json';
    } else if (lower.startsWith('npm install') || lower.startsWith('npm i')) {
      responseLogText = `📦 Installed package "${cmd.replace(/npm (install|i)\s*/, '')}" successfully in 120ms (cached)`;
      responseType = 'success';
    } else {
      responseLogText = `Command not recognized: "${cmd}". Type "help" for command list.`;
      responseType = 'warning';
    }

    const aiLog: TerminalLog = {
      id: (Date.now() + 1).toString(),
      type: responseType,
      text: responseLogText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setLogs((prev) => [...prev, userLog, aiLog]);
    setInputCmd('');
  };

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden font-mono text-xs shadow-2xl transition-all ${
        isExpanded ? 'fixed inset-4 z-50 bg-slate-950/95 backdrop-blur-xl' : 'h-full min-h-[200px]'
      }`}
    >
      {/* Terminal Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-2 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-slate-200 text-[11px] tracking-tight">
            {isAr ? 'منصة الأوامر والشل (CodeVortex Shell v5)' : 'CodeVortex Cloud Shell v5.0'}
          </span>

          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-extrabold border border-emerald-500/20">
            ONLINE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-[11px] flex items-center gap-1"
            title={isAr ? 'نسخ أسطر الشل' : 'Copy Logs'}
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setLogs([])}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-all"
            title={isAr ? 'تنظيف السجل' : 'Clear Logs'}
          >
            <Trash2 className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-all"
            title={isExpanded ? 'تصغير' : 'توسيع'}
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Terminal Logs Output Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1.5 font-mono text-[11px] text-slate-300 leading-relaxed bg-slate-950/90 selection:bg-cyan-500 selection:text-slate-950">
        {logs.map((log) => {
          let textColor = 'text-slate-300';
          if (log.type === 'cmd') textColor = 'text-cyan-400 font-bold';
          if (log.type === 'success') textColor = 'text-emerald-400 font-medium';
          if (log.type === 'warning') textColor = 'text-amber-400';
          if (log.type === 'error') textColor = 'text-rose-400';

          return (
            <div key={log.id} className="flex items-start gap-2 whitespace-pre-wrap break-words">
              <span className="text-slate-600 select-none text-[10px] shrink-0 font-sans">
                [{log.timestamp}]
              </span>
              <span className={textColor}>{log.text}</span>
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input Prompt */}
      <form
        onSubmit={handleCommandSubmit}
        className="bg-slate-900 border-t border-slate-800/80 p-2 px-3 flex items-center gap-2 shrink-0"
      >
        <span className="text-cyan-400 font-bold select-none text-xs">$</span>
        <input
          type="text"
          value={inputCmd}
          onChange={(e) => setInputCmd(e.target.value)}
          placeholder={isAr ? 'اكتب أمراً هنا (مثال: help, run, status, deploy)...' : 'Type shell command (e.g. help, run, status, deploy)...'}
          className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-600 focus:outline-none text-xs font-mono"
        />
        <button
          type="submit"
          className="p-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[11px] font-sans font-semibold flex items-center gap-1"
        >
          <CornerDownLeft className="w-3 h-3 text-cyan-400" />
          <span className="hidden sm:inline">{isAr ? 'تنفيذ' : 'Run'}</span>
        </button>
      </form>
    </div>
  );
};
