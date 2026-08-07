import React, { useState } from 'react';
import { Language } from '../types';
import {
  MessageSquare,
  Send,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle2,
  Sparkles,
  LifeBuoy,
  Briefcase,
  Newspaper
} from 'lucide-react';

interface ContactUsPageProps {
  language: Language;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ language }) => {
  const isAr = language === 'ar';
  const [department, setDepartment] = useState<'support' | 'sales' | 'press'>('support');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    try {
      await fetch('/api/db/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: formData.name,
          sender_email: formData.email,
          message_content: formData.subject ? `[${formData.subject}] ${formData.message}` : formData.message,
        }),
      });
    } catch (err) {
      console.warn('Backend ticket persistence error:', err);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const officeLocations = [
    { cityAr: 'الرياض، المملكة العربية السعودية', cityEn: 'Riyadh, Saudi Arabia', address: 'King Fahd Road, Digital City, Tower 4' },
    { cityAr: 'سان فرانسيسكو، الولايات المتحدة', cityEn: 'San Francisco, USA', address: 'Market St, Financial District, Suite 1200' },
    { cityAr: 'دبي، الإمارات العربية المتحدة', cityEn: 'Dubai, UAE', address: 'DIFC, Innovation Hub, Gate Avenue' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-16 px-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-black">
            <Mail className="w-4 h-4 text-[#00F2FE]" />
            <span>{isAr ? 'نحن هنا لمساعدتك دائماً' : 'We Are Here to Help'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {isAr ? 'تواصل مع فريق CodeVortex' : 'Contact CodeVortex Team'}
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm">
            {isAr
              ? 'اختر القسم المناسب لإرسال تذكرتك أو استفسارك وسيصلك رد من مهندسينا في أقل من ساعتين.'
              : 'Select a department to submit a ticket. Our engineering support team responds in < 2 hours.'}
          </p>
        </div>

        {/* Form & Department Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Department Selector & Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {isAr ? 'اختر القسم المختص' : 'SELECT DEPARTMENT'}
              </span>

              <div className="space-y-2">
                <button
                  onClick={() => setDepartment('support')}
                  className={`w-full p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-3 transition-all ${
                    department === 'support'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <LifeBuoy className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="text-left rtl:text-right">
                    <div>{isAr ? 'الدعم الفني للمطورين' : 'Developer Technical Support'}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{isAr ? 'استفسارات الأكواد والحاويات' : 'Code & container issues'}</div>
                  </div>
                </button>

                <button
                  onClick={() => setDepartment('sales')}
                  className={`w-full p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-3 transition-all ${
                    department === 'sales'
                      ? 'bg-purple-950/80 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="text-left rtl:text-right">
                    <div>{isAr ? 'مبيعات الشركات Enterprise' : 'Enterprise Sales'}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{isAr ? 'الاشتراكات المخصصة والفرق' : 'Custom pricing & teams'}</div>
                  </div>
                </button>

                <button
                  onClick={() => setDepartment('press')}
                  className={`w-full p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-3 transition-all ${
                    department === 'press'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Newspaper className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="text-left rtl:text-right">
                    <div>{isAr ? 'الصحافة والاستفسارات العامة' : 'Media & General Enquiries'}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{isAr ? 'المقابلات والتسويق' : 'Press & partnerships'}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Live Support Pill */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{isAr ? 'فريق الدعم نشط الآن' : 'Support Team Online'}</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {isAr ? 'متوسط زمن الرد الحالي: 14 دقيقة' : 'Average response time: 14 mins'}
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-white">{isAr ? 'تم إرسال رسالتك بنجاح!' : 'Message Sent Successfully!'}</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  {isAr
                    ? 'سيقوم مهندس الدعم الفني بمراجعة تذكرتك والتواصل معك عبر بريدك الإلكتروني قريباً.'
                    : 'Our engineering team will review your ticket and reach out to your email shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isAr ? 'مثال: محمد علي' : 'e.g. John Doe'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="dev@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isAr ? 'موضوع الاستفسار' : 'Subject'}</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={isAr ? 'عنوان المشكلة أو الاستفسار' : 'Inquiry topic'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{isAr ? 'تفاصيل الرسالة أو التذكرة' : 'Message Details'}</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isAr ? 'اشرح الاستفسار أو الأخطاء التي تواجهها هنا...' : 'Describe your question or error details here...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:scale-101 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 fill-current" />
                  <span>{isAr ? 'إرسال التذكرة فوراً' : 'Submit Support Ticket'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Global Offices */}
        <div className="pt-8 border-t border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? 'مكاتب ومقرات الشركة حول العالم' : 'Global Office Locations'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {officeLocations.map((loc, idx) => (
              <div key={idx} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{isAr ? loc.cityAr : loc.cityEn}</span>
                </div>
                <p className="text-slate-400 text-[11px] pl-5 rtl:pr-5">{loc.address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
