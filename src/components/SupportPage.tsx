import React, { useState } from 'react';
import { Language, ViewMode } from '@/types';
// Self-contained translations: all copy is hardcoded in '@/lib/translations'
// and bundled at build time — no external files, no empty keys.
import { useTranslation } from '@/lib/translations';

import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  BookOpen, 
  ShieldCheck, 
  Search, 
  ChevronDown, 
  Send, 
  CheckCircle2, 
  LifeBuoy
} from 'lucide-react';

interface SupportPageProps {
  language: Language;
  onSelectView: (view: ViewMode) => void;
  initialDepartment?: 'sales' | 'tech' | 'billing' | 'executive';
}

export const SupportPage: React.FC<SupportPageProps> = ({
  language,
  onSelectView,
  initialDepartment = 'sales',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticketSent, setTicketSent] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [activeDepartment, setActiveDepartment] = useState(initialDepartment);

  const isAr = language === 'ar';
  const t = useTranslation(language);

  const faqs = [
    {
      q: isAr ? 'كيف يمكنني نشر تحفتي البرمجية على السحابة؟' : 'How do I deploy my application to the cloud?',
      a: isAr 
        ? 'ببساطة اضغط على زر "النشر السحابي" في الهيدر العلوي، اختر المزود المناسب (Netlify / Vercel)، وأدخل رمز API الخاص بك لينطلق مشروعك فوراً.'
        : 'Click the "Deploy" button in the top header, select your target platform (Vercel/Netlify), enter your credentials, and build instantly.'
    },
    {
      q: isAr ? 'هل الكود البرمجي الذي أبنيه في CloudForge مملوك لي بالكامل؟' : 'Do I own the source code generated in CloudForge?',
      a: isAr
        ? 'نعم، 100%. جميع الشفرات المصدرية والمشاريع التي تم إنشاؤها هي ملكك تماماً ويمكنك تصديرها كملف ZIP في أي وقت.'
        : 'Yes, 100%. All source code and generated components belong exclusively to you, and you can export as ZIP anytime.'
    },
    {
      q: isAr ? 'كيف أستفيد من المساعد الذكي AI للإنشاء؟' : 'How do I utilize the AI Coding Assistant?',
      a: isAr
        ? 'انتقل إلى تبويب "المساعد الذكي"، واكتب وصف التطبيق أو الميزة التي ترغب في بنائها بلغة طبيعية وسيقوم المحرك بكتابة الملفات وتحديث المشروع تلقائياً.'
        : 'Head over to the AI Assistant tab, describe your feature in natural language, and the engine will build and structure the files automatically.'
    },
    {
      q: isAr ? 'ما هي حدود الاستخدام المجاني للمنصة؟' : 'What are the limits of the free tier?',
      a: isAr
        ? 'الباقة المجانية تتيح لك بناء عدد غير محدود من المشاريع محلياً، مع إمكانية التصدير واستخدام نموذج الذكاء الاصطناعي القياسي.'
        : 'The free plan allows unlimited local projects creation, ZIP exports, and standard AI compilation capabilities.'
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject && message) {
      setTicketSent(true);
      setTimeout(() => {
        setTicketSent(false);
        setSubject('');
        setMessage('');
      }, 4000);
    }
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Hero Banner */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[#00F2FE] text-xs font-bold">
            <LifeBuoy className="w-4 h-4 animate-spin-slow" />
            <span>{isAr ? 'مركز الدعم الفني المباشر' : '24/7 Technical Support Center'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-white via-slate-100 to-[#00F2FE] bg-clip-text text-transparent">
            {isAr ? 'كيف يمكننا مساعدتك اليوم؟' : 'How can we help you build today?'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            {isAr 
              ? 'ابحث في الأسئلة الشائعة، استكشف الوثائق التعليمية، أو تواصل مباشرة مع فريق الدعم الفني لدينا.' 
              : 'Search through FAQs, explore our comprehensive documentation, or contact our dedicated developer support.'}
          </p>

          {/* Quick Search Input */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-5 rtl:left-auto rtl:right-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن إجابة، مشكلة، أو ميزة...' : 'Search for guides, errors, or features...'}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-12 pr-4 rtl:pl-4 rtl:pr-12 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 shadow-xl transition-all"
            />
          </div>
        </div>

        {/* 3 Action Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div 
            onClick={() => onSelectView('academy')}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00F2FE] group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-sm group-hover:text-[#00F2FE] transition-colors">
              {isAr ? 'الوثائق والأكاديمية' : 'Documentation & Academy'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr ? 'دروس تعليمية خطوة بخطوة لشرح كافة إمكانيات محرك CloudForge.' : 'Comprehensive step-by-step guides to master all CloudForge engines.'}
            </p>
          </div>

          <div 
            onClick={() => onSelectView('community')}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-sm group-hover:text-purple-400 transition-colors">
              {isAr ? 'مجتمع المطورين' : 'Developer Community'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr ? 'تواصل مع أقرانك المطورين وشارك التجارب في Discord وReddit.' : 'Connect with peers, share project links, and troubleshoot on Discord & Reddit.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all group space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-sm group-hover:text-emerald-400 transition-colors">
              {isAr ? 'حالة النظام والنشر' : 'System Status & Deploy'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr ? 'تفقّد استقرار الخوادم ومحركات البناء السحابية المباشرة.' : 'Check live metrics for cloud build servers and instant container execution.'}
            </p>
          </div>
        </div>

        {/* FAQs Accordion Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#00F2FE]" />
            <span>{isAr ? 'الأسئلة الأكثر شيوعاً' : 'Frequently Asked Questions'}</span>
          </h2>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left rtl:text-right flex items-center justify-between font-bold text-xs sm:text-sm text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-[#00F2FE]' : ''}`} />
                </button>

                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Ticket Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-400" />
              <span>{isAr ? 'إرسال تذكرة دعم فني' : 'Submit a Support Ticket'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isAr ? 'أرسل تفاصيل مشكلتك وسيجيبك مهندسو الدعم خلال ساعات معدودة.' : 'Send us your technical query and our dev team will respond shortly.'}
            </p>
          </div>

          {ticketSent ? (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{isAr ? 'تم إرسال تذكرتك بنجاح! سينظر فريقنا الفني فيها فوراً.' : 'Ticket submitted successfully! Our team is reviewing it.'}</span>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">{isAr ? 'موضوع المشكلة' : 'Subject'}</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={isAr ? 'مثال: فشل ربط قاعدة البيانات Supabase' : 'e.g., Supabase connection timeout'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">{isAr ? 'تفاصيل الرسالة أو سجل الخطأ' : 'Message Details or Error Log'}</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isAr ? 'اكتب هنا التفاصيل الكاملة لمساعدتك بدقة...' : 'Describe your issue step by step...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-99"
              >
                <Send className="w-4 h-4" />
                <span>{isAr ? 'إرسال التذكرة الآن' : 'Send Ticket Now'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
