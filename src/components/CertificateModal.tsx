import React from 'react';
import { Certificate, Language } from '@/types';
import { Award, CheckCircle, Download, Printer, QrCode, ShieldCheck, Sparkles, X } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  language,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl font-sans animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(245,158,11,0.2)] text-slate-100 space-y-6 overflow-hidden my-auto">
        {/* Top Metallic Gold Border Highlight */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 rtl:left-6 rtl:right-auto p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Official Certificate Canvas */}
        <div className="bg-slate-950 border-2 border-amber-500/30 rounded-2xl p-6 sm:p-10 relative space-y-8 text-center overflow-hidden shadow-2xl">
          {/* Subtle Watermark Stamp */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-80 h-80 text-amber-400" />
          </div>

          {/* Certificate Header */}
          <div className="space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center mx-auto text-slate-950 shadow-xl shadow-amber-500/20">
              <Award className="w-9 h-9 stroke-[2.5]" />
            </div>

            <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400 block">
              CODEVORTEX CLOUD ACADEMY
            </span>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {isAr ? 'شهادة إتمام وتفوق معتمدة' : 'OFFICIAL CERTIFICATE OF COMPLETION'}
            </h1>

            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isAr
                ? 'تُشهد أكاديمية كود فورتكس العالمية بأن الحاصل على هذه الشهادة قد أتم بنجاح كلي كافة متطلبات المسار البرمجي والامتحان النهائي.'
                : 'This is to officially verify that the individual named below has successfully completed all coursework, practical playgrounds, and the final assessment.'}
            </p>
          </div>

          {/* Recipient Name Display */}
          <div className="py-4 border-y border-amber-500/20 relative z-10 space-y-1">
            <span className="text-xs text-slate-400 font-medium block">
              {isAr ? 'ممنوحة بكل فخر إلى:' : 'PROUDLY PRESENTED TO'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-serif">
              {certificate.studentName}
            </h2>
          </div>

          {/* Course Details */}
          <div className="space-y-2 relative z-10">
            <span className="text-xs text-slate-400 block">{isAr ? 'لاشتيازه بنجاح المسار المتخصص في:' : 'FOR SUCCESSFUL COMPLETION OF THE SPECIALIZED TRACK:'}</span>
            <h3 className="text-xl sm:text-2xl font-black text-cyan-400">
              {certificate.courseTitle}
            </h3>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Score Achieved: {certificate.score}%</span>
            </div>
          </div>

          {/* Verification Footer with QR & Stamp */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left rtl:text-right relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1 rounded-xl shadow-lg shrink-0 flex items-center justify-center">
                <QrCode className="w-14 h-14 text-slate-950" />
              </div>
              <div className="space-y-0.5 text-[11px] font-mono text-slate-400">
                <span className="font-bold text-white block">Certificate ID: {certificate.certificateId}</span>
                <span>Issue Date: {certificate.issueDate}</span>
                <span className="text-cyan-400 block truncate max-w-[200px]">{certificate.verificationUrl}</span>
              </div>
            </div>

            {/* Official Badge Stamp */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/20 border border-amber-500/40 text-amber-400 text-xs font-bold shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>VERIFIED BY CODEVORTEX KERNEL</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 print:hidden text-xs">
          <button
            onClick={handlePrintCertificate}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-200 flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? 'طباعة / حفظ PDF' : 'Print / Download PDF'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <span>{isAr ? 'تم الحفظ' : 'Done'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
