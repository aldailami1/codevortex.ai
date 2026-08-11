import React from 'react';
import { Language } from '@/types';
import { getTranslation } from '@/lib/translations';
import {
  Shield,
  Lock,
  Eye,
  FileCheck,
  CheckCircle,
  Server,
  Key,
  ShieldAlert
} from 'lucide-react';

interface PrivacyPageProps {
  language: Language;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ language }) => {
  const t = getTranslation(language);
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-black">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>{t('privacyPolicy')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {isAr ? 'سياسة الخصوصية وأمان البيانات وشروط الخدمة' : 'Privacy Policy, Data Security & Terms'}
          </h1>

          <p className="text-slate-400 text-sm sm:text-base">
            {isAr
              ? 'تلتزم منصة CloudForge بأعلى معايير الأمان وتشفير البيانات لحماية أكوادك ومشروعاتك السحابية.'
              : 'CloudForge is committed to top-tier security standards, keeping your cloud workspaces and code fully safe.'}
          </p>
        </div>

        {/* Security Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <Lock className="w-8 h-8 text-[#00F2FE] mx-auto" />
            <h3 className="font-bold text-sm text-white">{isAr ? 'تشفير AES 256-bit' : 'AES 256-bit Encryption'}</h3>
            <p className="text-[11px] text-slate-400">{isAr ? 'تشفير شامل لجميع الملفات المخزنة.' : 'Full encryption for all stored code files.'}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <Server className="w-8 h-8 text-purple-400 mx-auto" />
            <h3 className="font-bold text-sm text-white">{isAr ? 'معايير SOC 2 Type II' : 'SOC 2 Type II Certified'}</h3>
            <p className="text-[11px] text-slate-400">{isAr ? 'امتثال تام لمعايير الأمان العالمية.' : 'Full compliance with cloud security audits.'}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <Key className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-sm text-white">{isAr ? 'السرية والملكية الكاملة' : '100% Code Ownership'}</h3>
            <p className="text-[11px] text-slate-400">{isAr ? 'الأكواد المولدة هي ملكية خاصة للمطور.' : 'Generated code belongs 100% to you.'}</p>
          </div>
        </div>

        {/* Policy Content Blocks */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed shadow-2xl">
          
          <div className="space-y-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#00F2FE]" />
              <span>{isAr ? '1. جمع البيانات واستخدامها' : '1. Data Collection & Processing'}</span>
            </h2>
            <p>
              {isAr
                ? 'تقوم منصة CloudForge بتوليد ومعالجة أكواد البرمجة في بيئات معزولة كلياً. نحن لا نشارك الأكواد أو الأوامر النصية المدخلة مع أي طرف ثالث خارجي، ويتم استخدام البيانات فقط لتشغيل المحرر وتوليد المعاينات التفاعلية.'
                : 'CloudForge operates code execution in completely isolated cloud containers. We do not share your code or prompts with external third parties; data is processed strictly to generate and serve your live preview.'}
            </p>
          </div>

          <div className="space-y-3 border-t border-slate-800 pt-6">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>{isAr ? '2. حماية الحسابات والمفاتيح السرية' : '2. Account Security & API Keys'}</span>
            </h2>
            <p>
              {isAr
                ? 'تظل جميع المفاتيح السرية وبيانات الاعتماد (API Keys) محمية في الخوادم الخلفية دون إظهارها في متصفح العميل، لضمان أمان تام أثناء بناء النماذج وتأمين معايير OAuth و HTTPS.'
                : 'All API keys and environment credentials are stored securely on server-side proxies, ensuring zero browser leakage and maintaining strict OAuth and HTTPS encryption.'}
            </p>
          </div>

          <div className="space-y-3 border-t border-slate-800 pt-6">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              <span>{isAr ? '3. حقوق الملكية وشروط الخدمة' : '3. Code Ownership & Terms of Service'}</span>
            </h2>
            <p>
              {isAr
                ? 'يمتلك المطور جميع الأكواد المصدرية والمشاريع المنشأة عبر المنصة بدون أي قيود، مع إمكانية تصديرها كملفات ZIP أو نشرها فوراً على أي خادم خارجي بأي وقت.'
                : 'Developers maintain complete copyright and intellectual property rights over all generated code and projects created on CloudForge, with total freedom to export as ZIP or deploy anywhere.'}
            </p>
          </div>

          {/* Official Contact Reference */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>{isAr ? 'لأي استفسارات بخصوص الأمان أو سياسة الخصوصية:' : 'For security or compliance inquiries:'}</span>
            <div className="flex items-center gap-4 text-cyan-300 font-bold">
              <span>{isAr ? 'تواصل عبر تذاكر الدعم بالمنصة' : 'Contact via Platform Support Tickets'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
