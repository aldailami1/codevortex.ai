import React, { useState } from 'react';
import { CertificateRecord } from '../types/academy';
import { Award, ShieldCheck, Printer, CheckCircle2, Edit3, Sparkles } from 'lucide-react';

interface CertificateProps {
  certificate: CertificateRecord;
  isArabic: boolean;
  onUpdateStudentName?: (newName: string) => void;
}

export const Certificate: React.FC<CertificateProps> = ({
  certificate,
  isArabic,
  onUpdateStudentName,
}) => {
  const [studentName, setStudentName] = useState<string>(certificate.studentName || 'سعيد السعيدي');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const handleSaveName = () => {
    setIsEditingName(false);
    if (onUpdateStudentName) {
      onUpdateStudentName(studentName);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto print:p-0">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl print:hidden">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="font-bold text-white text-base">
              {isArabic ? 'الشهادة المعتمدة الرسمية' : 'Official Accredited Certificate'}
            </h3>
            <p className="text-xs text-slate-400">
              {isArabic ? 'صادرة وموثقة من أكاديمية CodeVortex السحابية' : 'Issued & Verified by CodeVortex Cloud Academy'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Edit Name Button */}
          <button
            onClick={() => setIsEditingName(!isEditingName)}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isArabic ? 'تعديل اسم الطالب' : 'Edit Student Name'}</span>
          </button>

          {/* Print Certificate Button */}
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 hover:scale-105 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isArabic ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>

      {/* Edit Student Name Inline Box */}
      {isEditingName && (
        <div className="p-4 bg-slate-950 border border-cyan-800/60 rounded-xl flex items-center gap-3 print:hidden">
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder={isArabic ? 'أدخل اسمك الثلاثي بالشهادة' : 'Enter full name for certificate'}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleSaveName}
            className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-extrabold text-xs hover:bg-cyan-300"
          >
            {isArabic ? 'حفظ وتحديث' : 'Save'}
          </button>
        </div>
      )}

      {/* High-Grade Printable Certificate Frame */}
      <div
        id="official-certificate"
        className="relative bg-slate-900 text-slate-100 border-4 border-amber-600/80 p-8 md:p-12 rounded-2xl shadow-2xl space-y-6 overflow-hidden print:border-black print:text-black print:bg-white"
      >
        {/* Decorative Luxury Corner Ornaments */}
        <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-400/80 rounded-tl-lg print:border-black" />
        <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-400/80 rounded-tr-lg print:border-black" />
        <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-400/80 rounded-bl-lg print:border-black" />
        <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-400/80 rounded-br-lg print:border-black" />

        {/* Top Header / Logo */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-amber-400 print:text-black" />
            <h1 className="text-3xl font-extrabold text-white tracking-wide print:text-black">
              CodeVortex Academy
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 print:text-black mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 print:text-black" />
            <span>ID: {certificate.verificationCode}</span>
            {certificate.score && (
              <>
                <span>•</span>
                <span className="text-amber-400 font-bold print:text-black">
                  {isArabic ? `الدرجة: ${certificate.score}%` : `Score: ${certificate.score}%`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Certificate Text & Body */}
        <div className="text-center space-y-5 my-6">
          <p className="text-gray-300 text-lg font-medium print:text-black">
            {isArabic ? 'تشهد أكاديمية CodeVortex لـ' : 'This is to certify that:'}
          </p>

          <h2 className="text-3xl md:text-4xl font-black text-amber-400 tracking-wide border-b-2 border-amber-500/40 inline-block pb-2 px-8 print:text-black">
            {studentName}
          </h2>

          <p className="text-gray-300 text-base pt-2 print:text-black">
            {isArabic ? 'قد أتم بنجاح' : 'has successfully completed'}
          </p>

          <div className="inline-block bg-cyan-950/60 border border-cyan-500/40 rounded-xl px-6 py-3 my-2 shadow-inner print:bg-slate-100 print:border-black">
            <span className="text-cyan-400 text-xl font-bold print:text-black">
              {isArabic ? certificate.courseTitleAr : certificate.courseTitleEn}
            </span>
          </div>

          <div className="text-gray-400 text-sm mt-4 print:text-black">
            {isArabic ? `تاريخ الإصدار: ${certificate.issueDate}` : `Issue Date: ${certificate.issueDate}`}
          </div>
        </div>

        <hr className="border-slate-800 my-6 print:border-slate-300" />

        {/* Signatures and Official Seal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center mt-6">
          {/* Head of Academic Board */}
          <div className="space-y-1">
            <h3 className="text-amber-400 font-serif font-bold text-lg italic print:text-black">
              Dr. Ali Muhammad Al-Dailami
            </h3>
            <p className="text-xs text-gray-300 font-semibold print:text-black">
              {isArabic ? 'رئيس المجلس الأكاديمي' : 'Head of Academic Board'}
            </p>
            <p className="text-[10px] text-gray-500 print:text-black">
              {isArabic ? 'مجلس CodeVortex التعليمي' : 'CodeVortex Learning Council'}
            </p>
          </div>

          {/* Official Seal */}
          <div className="flex justify-center my-2 md:my-0">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center bg-amber-500/10 p-2 shadow-lg print:border-black print:bg-slate-100">
              <div className="w-full h-full rounded-full border border-amber-500 flex flex-col items-center justify-center text-[9px] font-bold text-amber-400 print:border-black print:text-black">
                <ShieldCheck className="w-5 h-5 text-amber-400 print:text-black mb-0.5" />
                <span>OFFICIAL</span>
                <span>SEAL</span>
              </div>
            </div>
          </div>

          {/* Director of Accreditation */}
          <div className="space-y-1">
            <h3 className="text-cyan-400 font-serif font-bold text-lg italic print:text-black">
              Eng. Eileen Ibrahim
            </h3>
            <p className="text-xs text-gray-300 font-semibold print:text-black">
              {isArabic ? 'مدير اعتماد الشهادات' : 'Director of Accreditation'}
            </p>
            <p className="text-[10px] text-gray-500 print:text-black">
              {isArabic ? 'هيئة الاعتماد الرقمي' : 'Digital Accreditation Council'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

