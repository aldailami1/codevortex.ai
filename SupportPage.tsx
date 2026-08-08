import React, { useState } from 'react';
import { Language, ViewMode } from './types';
import { useTranslation } from './locales';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Send, 
  CheckCircle2, 
  Search, 
  BookOpen, 
  Terminal, 
  Sparkles,
  ChevronDown,
  Clock,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

interface SupportPageProps {
  language: Language;
  onSelectView: (view: ViewMode) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ language, onSelectView }) => {
  const isAr = language === 'ar';
  const t = useTranslation(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: 'general', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1200);
  };

  const faqItems = [
    {
      q: isAr ? 'كيف تعمل بيئة CloudForge السحابية؟' : 'How does CloudForge cloud workspace work?',
      a: isAr 
        ? 'تعتمد CloudForge على المحرك العصبي الأصلي للترجمة البرمجية الفورية. يقوم الذكاء الاصطناعي بنشر الحاويات البرمجية تلقائياً وعرض النتيجة الحية على المنفذ :3000.'
        : 'CloudForge leverages its neural engine to instantly compile code, automatically deploy runtime containers, and serve live previews on port :3000.'
    },
    {
      q: isAr ? 'كيف يمكنني تصدير الكود المصدر لمشروعي؟' : 'How can I export my project source code?',
      a: isAr
        ? 'يمكنك تحميل هيكل المشروع كاملاً بصيغة ZIP من شريط أدوات محرر الكود أو ربطه مباشرة بمستودع GitHub الخاص بك بنقرة واحدة.'
        : 'You can download the full project structure as a ZIP file from the editor toolbar or commit it directly to your GitHub repository in one click.'
    },
    {
      q: isAr ? 'ما هي حدود الاستخدام في الخطة المجانية؟' : 'What are the limits of the free plan?',
      a: isAr
        ? 'تتيح الخطة المجانية إنشاء مشاريع عامة غير محدودة والوصول إلى المحرك العصبي الأساسي مع دعم المعاينة الحية ومشاركة الروابط.'
        : 'The free plan allows unlimited public projects, access to the primary neural engine, live REPL preview, and project sharing.'
    },
    {
      q: isAr ? 'كيف أستطيع الإبلاغ عن مشكلة برمجية أو اقتراح ميزة؟' : 'How do I report a bug or suggest a feature?',
      a: isAr
        ? 'يمكنك إرسال رسالة مباشرة من نموذج الدعم أدناه أو فتح تذكرة عبر مجتمعنا على GitHub و Reddit.'
        : 'You can submit a ticket directly using the form below or start a discussion on our GitHub and Reddit channels.'
    }
  ];

  const filteredFaqs = faqItems.filter(item => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header / Hero */}
      <section className="pt-12 pb-12 px-4 max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-bold shadow-lg">
          <HelpCircle className="w-4 h-4 text-[#00F2FE]" />
          <span>{isAr ? 'مركز الدعم والمساعدة' : 'Support & Help Center'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          {isAr ? 'كيف يمكننا مساعدتك اليوم؟' : 'How can we help you today?'}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          {isAr ? 'ابحث في الأسئلة الشائعة أو تواصل مباشرة مع فريق الهندسة والدعم الفني.' : 'Search our knowledge base or reach out to our technical engineering team.'}
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto pt-4">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 rtl:left-auto rtl:right-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن إجابات، أوامر، أو حلول مشاكل...' : 'Search for answers, commands, or troubleshooting...'}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 rtl:pl-4 rtl:pr-12 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 shadow-xl backdrop-blur-xl transition-all"
            />
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="py-6 px-4 max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-cyan-500/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-[#00F2FE]">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">{isAr ? 'الوثائق البرمجية' : 'Documentation'}</h3>
          <p className="text-slate-400 text-xs">{isAr ? 'تعرف على أدوات المنصة وأدلة الاستخدام المتقدمة.' : 'Explore platform capabilities and advanced guides.'}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-cyan-500/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">{isAr ? 'حالة الخدمة والسيرفرات' : 'System Status'}</h3>
          <p className="text-slate-400 text-xs">{isAr ? 'مراقبة فورية لأداء المحركات والمستوعبات.' : 'Real-time performance monitoring and availability.'}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-cyan-500/40 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">{isAr ? 'دعم الفني 24/7' : '24/7 Support'}</h3>
          <p className="text-slate-400 text-xs">{isAr ? 'فريق المهندسين متواجد على مدار الساعة لمساعدتك.' : 'Our engineers are ready to assist you anytime.'}</p>
        </div>
      </section>

      {/* Main Content: FAQs + Contact Form */}
      <section className="py-10 px-4 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FAQs Accordion Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00F2FE]" />
            <h2 className="text-xl font-bold text-white">
              {isAr ? 'الأسئلة الأكثر شيوعاً' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 text-left rtl:text-right font-bold text-sm text-slate-200 hover:text-cyan-400 flex items-center justify-between transition-colors"
                    >
                      <span className="pr-2 rtl:pr-0 rtl:pl-2">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                {isAr ? 'لم نجد نتائج تطابق بحثك.' : 'No matching answers found.'}
              </div>
            )}
          </div>
        </div>

        {/* Support Ticket Form Column */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span>{isAr ? 'إرسال تذكرة دعم' : 'Send Support Ticket'}</span>
              </h2>
              <p className="text-slate-400 text-xs">
                {isAr ? 'أرسل لنا استفسارك وسيصلك الرد بسرعة.' : 'Fill out the form and we will respond promptly.'}
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 bg-emerald-950/80 border border-emerald-800 rounded-2xl text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-300">{isAr ? 'تم استلام تذكرتك بنجاح!' : 'Ticket Received Successfully!'}</h3>
                <p className="text-xs text-emerald-400/80">{isAr ? 'سيقوم فريق الدعم الفني بمراجعتها والرد في أقرب وقت.' : 'Our tech team will review it and get back to you.'}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">{isAr ? 'الاسم' : 'Name'}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isAr ? 'الاسم الكامل' : 'Full Name'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">{isAr ? 'نوع الاستفسار' : 'Subject'}</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="general">{isAr ? 'استفسار عام' : 'General Inquiry'}</option>
                    <option value="bug">{isAr ? 'الإبلاغ عن خطأ برمجي' : 'Bug Report'}</option>
                    <option value="billing">{isAr ? 'الحساب والاشتراكات' : 'Billing & Account'}</option>
                    <option value="feature">{isAr ? 'اقتراح ميزة جديدة' : 'Feature Request'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">{isAr ? 'نص الرسالة' : 'Message'}</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isAr ? 'اشرح استفسارك بالتفصيل...' : 'Describe your request in detail...'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">{isAr ? 'جاري الإرسال...' : 'Submitting...'}</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 fill-current" />
                      <span>{isAr ? 'إرسال التذكرة' : 'Submit Ticket'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
