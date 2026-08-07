import React, { useState, useRef, useEffect } from 'react';
import { Project, DeviceMode, Language } from '../types';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  Edit3,
  Check,
  Zap,
  Code,
  ShieldCheck,
  QrCode,
  Palette,
  Sparkles,
  X,
  Copy,
  Sliders
} from 'lucide-react';

interface LiveCanvasProps {
  project: Project;
  language: Language;
  onUpdateFileContent?: (path: string, content: string) => void;
}

export const LiveCanvas: React.FC<LiveCanvasProps> = ({
  project,
  language,
  onUpdateFileContent,
}) => {
  const isAr = language === 'ar';

  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [visualEditActive, setVisualEditActive] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [selectedText, setSelectedText] = useState<string>('');
  const [newTextValue, setNewTextValue] = useState<string>('');
  const [copiedMobileUrl, setCopiedMobileUrl] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Get combined HTML code string
  const getCombinedSrcDoc = () => {
    const htmlFile = project.files.find((f) => f.path === 'index.html')?.content || '<h1>No index.html</h1>';
    const cssFile = project.files.find((f) => f.path === 'styles.css')?.content || '';
    const jsFile = project.files.find((f) => f.path === 'app.js')?.content || '';

    let doc = htmlFile;

    if (cssFile && !doc.includes('<style id="cv-css">')) {
      doc = doc.replace('</head>', `<style id="cv-css">${cssFile}</style></head>`);
    }

    if (jsFile && !doc.includes('<script id="cv-js">')) {
      doc = doc.replace('</body>', `<script id="cv-js">${jsFile}</script></body>`);
    }

    // Inject click listener script if visual edit mode is enabled
    if (visualEditActive) {
      const inspectorScript = `
        <script>
          document.addEventListener('click', function(e) {
            if (e.target) {
              e.preventDefault();
              e.stopPropagation();
              const text = e.target.innerText || e.target.value || '';
              window.parent.postMessage({ type: 'ELEMENT_CLICKED', tagName: e.target.tagName, text: text }, '*');
            }
          }, true);
        </script>
      `;
      doc = doc.replace('</body>', `${inspectorScript}</body>`);
    }

    return doc;
  };

  const srcDoc = getCombinedSrcDoc();

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ELEMENT_CLICKED') {
        setSelectedText(event.data.text);
        setNewTextValue(event.data.text);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Apply visual text replace across project index.html file
  const handleApplyVisualEdit = () => {
    if (!selectedText || !newTextValue || !onUpdateFileContent) return;

    const htmlFile = project.files.find((f) => f.path === 'index.html');
    if (htmlFile) {
      const updatedContent = htmlFile.content.replace(selectedText, newTextValue);
      onUpdateFileContent('index.html', updatedContent);
      setSelectedText('');
      setNewTextValue('');
    }
  };

  // Open in new browser tab
  const handleOpenInNewTab = () => {
    const blob = new Blob([srcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Device width constraints
  const getDeviceWidthClass = () => {
    switch (deviceMode) {
      case 'tablet':
        return 'w-[768px] max-w-full h-[850px] shadow-2xl rounded-3xl border-[6px] border-slate-800 my-4';
      case 'mobile':
        return 'w-[380px] max-w-full h-[740px] shadow-2xl rounded-[40px] border-[10px] border-slate-800 my-4 relative';
      default:
        return 'w-full h-full min-h-[720px] border-none rounded-2xl';
    }
  };

  const simulatedMobileUrl = `https://${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'app'}.codevortex.cloud`;

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-hidden relative">
      {/* Sandbox Top Control Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-semibold backdrop-blur-md sticky top-0 z-20">
        {/* Device Mode Switchers */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-lg transition-all ${
              deviceMode === 'desktop'
                ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={isAr ? 'عرض الشاشة الكبيرة (سطح المكتب)' : 'Desktop View'}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-lg transition-all ${
              deviceMode === 'tablet'
                ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={isAr ? 'عرض الجهاز اللوحي (آيباد)' : 'Tablet View'}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-lg transition-all ${
              deviceMode === 'mobile'
                ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={isAr ? 'عرض الهاتف المحمول' : 'Mobile View'}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Live Simulated URL Bar */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono max-w-md truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="truncate">{simulatedMobileUrl}</span>
        </div>

        {/* Visual Edit Toggle & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVisualEditActive(!visualEditActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              visualEditActive
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-extrabold shadow-lg shadow-amber-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isAr ? 'المحرر البصري النقري (No-Code Visual Editor)' : 'Toggle Click-to-Edit'}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'المحرر البصري' : 'Visual Inspector'}</span>
          </button>

          {/* QR Code Phone Test */}
          <button
            onClick={() => setShowQrModal(true)}
            className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-all"
            title={isAr ? 'معاينة على الهاتف المباشر' : 'Test on Phone'}
          >
            <QrCode className="w-4 h-4" />
          </button>

          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all"
            title={isAr ? 'إعادة تحديث المعاينة' : 'Refresh Preview'}
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenInNewTab}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 hover:text-cyan-300 font-extrabold transition-all"
            title={isAr ? 'فتح في تبويب مستقل' : 'Open in New Tab'}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'تبويب جديد' : 'New Tab'}</span>
          </button>
        </div>
      </div>

      {/* Visual Inspector Drawer Overlay */}
      {visualEditActive && selectedText && (
        <div className="bg-slate-900 border-b border-amber-500/40 p-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl z-30 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 w-full sm:w-auto">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate">{isAr ? 'تعديل النص المحدد في الصفحة:' : 'Edit Selected Text:'}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-xl">
            <input
              type="text"
              value={newTextValue}
              onChange={(e) => setNewTextValue(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
            />
            <button
              onClick={handleApplyVisualEdit}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shrink-0"
            >
              {isAr ? 'حفظ التعديل البصري' : 'Save Text'}
            </button>
          </div>
        </div>
      )}

      {/* Main Sandbox Stage */}
      <div className="flex-1 bg-slate-900/50 p-4 flex items-center justify-center overflow-auto relative">
        <div className={`transition-all duration-300 mx-auto ${getDeviceWidthClass()}`}>
          {deviceMode === 'mobile' && (
            <div className="w-32 h-4 bg-slate-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none"></div>
          )}
          <iframe
            key={refreshKey}
            ref={iframeRef}
            srcDoc={srcDoc}
            title="CodeVortex Live Sandbox"
            className="w-full h-full bg-white rounded-2xl shadow-2xl border-0 overflow-hidden"
            sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
          />
        </div>
      </div>

      {/* QR Mobile Simulator Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative text-center">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center font-bold">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-white text-base">
              {isAr ? 'اختبر الموقع على هاتفك مباشرة' : 'Test Live App on Mobile'}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'انسخ رابط المعاينة السحابي أو افتحه في متصفح الجوال لاختبار تجربة المستخدم الاستجابية.'
                : 'Open this simulated live URL on any browser or share with team members.'}
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-2 text-xs font-mono">
              <span className="truncate text-slate-300">{simulatedMobileUrl}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(simulatedMobileUrl);
                  setCopiedMobileUrl(true);
                  setTimeout(() => setCopiedMobileUrl(false), 2000);
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold shrink-0 text-[11px]"
              >
                {copiedMobileUrl ? (isAr ? 'تم' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
