import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslation } from '../lib/translations';
import { DepartmentalSupportPortal } from './DepartmentalSupportPortal';
import {
  HelpCircle,
  Search,
  MessageSquare,
  FileText,
  Mail,
  Phone,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Send,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Building2,
  CreditCard,
  Cpu,
  Crown
} from 'lucide-react';

interface SupportPageProps {
  language: Language;
  initialDepartment?: 'sales' | 'billing' | 'tech' | 'executive';
  initialMagicKey?: string;
}

export const SupportPage: React.FC<SupportPageProps> = ({
  language,
  initialDepartment = 'sales',
  initialMagicKey = '',
}) => {
  const t = getTranslation(language);
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      qAr: 'كيف يعمل نظام مفاتيح التذاكر السحرية (Magic Ticket Keys)؟',
      qEn: 'How does the Magic Ticket Keys system work?',
      aAr: 'عند تقديم أي طلب لأي من الأقسام المخصصة (المبيعات، المالية، الدعم التقني، أو الإدارة)، يولد النظام تلقائياً مفتاحاً سحرياً فريداً (مثال: CVKEY-FIN-4102) ورابط متابعة مشفر يتيح لك متابعة التذكرة والدردشة المباشرة ورفع المستندات دون الحاجة لكلمة سر.',
      aEn: 'When you submit a request to any dedicated department (Sales, Billing, Tech, or Executive), the system generates a unique Magic Key (e.g., CVKEY-FIN-4102) and an encrypted tracking link to access ticket status, live chat, and file uploads password-free.',
    },
    {
      qAr: 'ما هي الأقسام المتخصصة الأربعة المتوفرة بالمنصة؟',
      qEn: 'What are the four dedicated department portals available?',
      aAr: '1) قسم مبيعات الشركات (Sales & Enterprise)\n2) قسم الخدمات المالية والمحاسبة (Billing & Finance)\n3) قسم الدعم التقني المتقدم (Advanced Tech Support)\n4) قسم الإدارة العليا والسيادية (Executive Management)',
      aEn: '1) Sales & Enterprise (/support/sales)\n2) Billing & Finance (/support/billing)\n3) Advanced Tech Support (/support/tech)\n4) Executive Management (/support/executive)',
    },
    {
      qAr: 'ما هي معايير تشفير البيانات لحفظ الكود والبيانات السحابية والمستندات المرفقة؟',
      qEn: 'What encryption standards protect code, cloud data & uploaded documents?',
      aAr: 'نستخدم تشفير AES 256-bit لكافة المستندات والبيانات المخزنة ونفق TLS 1.3 المشفّر لكل الاتصالات، مع شهادات اعتماد SOC 2 Type II العالمية.',
      aEn: 'We enforce AES 256-bit encryption for stored code & vault attachments with TLS 1.3 tunnels for all transit data.',
    },
    {
      qAr: 'كيف يمكنني التواصل المباشر مع المقر الرئيسي والإدارة العليا؟',
      qEn: 'How can I contact Executive Management directly?',
      aAr: 'قسم الإدارة العليا مخصص حصرياً للجهات الرسمية والشراكات الكبرى، ويمكن تقديم تذكرة مباشرة من خلال قسم Executive Management في المنصة.',
      aEn: 'Executive Management is dedicated to official entities & strategic partnerships via the Executive Portal.',
    },
  ];

  const filteredFaqs = faqs.filter(f => 
    (isAr ? f.qAr : f.qEn).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (isAr ? f.aAr : f.aEn).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans space-y-12">
      {/* 1. DEDICATED DEPARTMENTAL PORTALS & MAGIC KEYS COMPONENT */}
      <DepartmentalSupportPortal
        language={language}
        initialDepartment={initialDepartment}
        initialMagicKey={initialMagicKey}
      />

      {/* 2. KNOWLEDGE BASE & FAQS SECTION */}
      <div className="max-w-7xl mx-auto space-y-8 pt-6 border-t border-slate-800">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-cyan-400 text-xs font-black">
            <HelpCircle className="w-4 h-4 text-[#00F2FE]" />
            <span>{isAr ? 'قاعدة المعرفة والأسئلة الشائعة' : 'Knowledge Base & FAQs'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isAr ? 'الأسئلة الشائعة حول المنظومة والتذاكر' : 'Frequently Asked Questions'}
          </h2>

          {/* FAQ Search Box */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن إجابة أو تذكرة أو توثيق...' : 'Search answers or documentation...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 rtl:pr-11 rtl:pl-4 pr-4 py-3 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3 max-w-4xl mx-auto">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left rtl:text-right flex items-center justify-between font-bold text-slate-200 text-xs sm:text-sm hover:text-cyan-300 transition-colors"
                >
                  <span>{isAr ? faq.qAr : faq.qEn}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-slate-400 text-xs leading-relaxed border-t border-slate-800/60 pt-3 whitespace-pre-line">
                    {isAr ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

