import React, { useState } from 'react';
import JSZip from 'jszip';
import { Project, ProjectFile, Language } from '@/types';
import { Upload, FileArchive, FolderPlus, CheckCircle2, RefreshCw, X, Sparkles, AlertCircle } from 'lucide-react';

interface ProjectUploadModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onProjectUploaded: (project: Project) => void;
}

export const ProjectUploadModal: React.FC<ProjectUploadModalProps> = ({
  language,
  isOpen,
  onClose,
  onProjectUploaded,
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const processZipFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);

      const extractedFiles: ProjectFile[] = [];

      const filePromises: Promise<void>[] = [];

      loadedZip.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir && !relativePath.includes('node_modules/') && !relativePath.startsWith('.')) {
          const promise = zipEntry.async('string').then((content) => {
            extractedFiles.push({
              path: relativePath,
              content: content || '',
            });
          });
          filePromises.push(promise);
        }
      });

      await Promise.all(filePromises);

      if (extractedFiles.length === 0) {
        throw new Error(isAr ? 'لم يتم العثور على ملفات برمجية داخل الأرشيف المضغوط' : 'No source files found in zip archive');
      }

      const projectName = file.name.replace(/\.zip$/i, '') || 'Uploaded Project';

      const newProject: Project = {
        id: `proj-upload-${Date.now()}`,
        name: projectName,
        description: isAr ? 'مشروع تم رفعه من ملف ZIP سحابي' : 'Project uncompressed & imported from ZIP file',
        language,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        files: extractedFiles,
        isRTL: isAr,
      };

      setIsProcessing(false);
      onProjectUploaded(newProject);
      onClose();
    } catch (err: any) {
      console.error('Error extracting ZIP:', err);
      setIsProcessing(false);
      setErrorMsg(err?.message || (isAr ? 'حدث خطأ أثناء فك ضغط الملف' : 'Failed to extract ZIP file archive'));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processZipFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processZipFile(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl font-sans animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-100 space-y-6">
        {/* Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-2xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rtl:left-5 rtl:right-auto p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00F2FE] to-blue-600 flex items-center justify-center mx-auto text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            <FolderPlus className="w-7 h-7 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl font-black text-white">
            {isAr ? 'رفع مشروع كامل (ZIP)' : 'Upload Full Project (ZIP Archive)'}
          </h2>

          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {isAr
              ? 'قم برفع ملف ZIP الخاص بمشروعك، وسيقوم المحرك بفك الضغط تلقائياً وتشغيل بيئة العمل فوراً.'
              : 'Upload your full project archive (.zip). The platform will automatically unpack & mount all files in the cloud sandbox.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs text-center font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dropzone Container */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer relative overflow-hidden ${
            dragOver
              ? 'border-cyan-400 bg-cyan-950/30 scale-102'
              : 'border-slate-800 hover:border-cyan-500/50 bg-slate-950/60'
          }`}
        >
          <input
            type="file"
            accept=".zip"
            onChange={handleFileInputChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          />

          <div className="space-y-3 pointer-events-none">
            {isProcessing ? (
              <div className="space-y-2 py-4">
                <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
                <span className="text-xs font-bold text-cyan-300 block">
                  {isAr ? 'جاري فك ضغط الأرشيف وبناء شجرة الملفات...' : 'Unpacking archive & compiling virtual tree...'}
                </span>
              </div>
            ) : (
              <>
                <FileArchive className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                <div className="space-y-1">
                  <span className="text-sm font-extrabold text-white block">
                    {isAr ? 'اسحب واسقط ملف ZIP هنا' : 'Drag & Drop your ZIP file here'}
                  </span>
                  <span className="text-xs text-slate-400 block">
                    {isAr ? 'أو اضغط للتصفح واختيار الملف من جهازك' : 'or click to browse from your computer'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Supports HTML/CSS/JS/TS/React ZIPs</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
