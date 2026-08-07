import React from 'react';
import { Language, ViewMode } from '../types';
import {
  Sparkles,
  Target,
  Users,
  Award,
  Globe2,
  Heart,
  ShieldCheck,
  Zap,
  Building2,
  Rocket
} from 'lucide-react';

interface AboutUsPageProps {
  language: Language;
  onSelectView: (view: ViewMode) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ language, onSelectView }) => {
  const isAr = language === 'ar';

  const teamMembers = [
    {
      name: isAr ? 'د. محمد الدايلمي' : 'Dr. Mohammed Al-Dailami',
      role: isAr ? 'المؤسس والرئيس التنفيذي' : 'Founder & CEO',
      bioAr: 'خبير ذكاء اصطناعي وأنظمة سحابية موزعة مع رؤية لتمكين الملايين من تطوير البرمجيات دون حواجز.',
      bioEn: 'AI & Distributed Cloud Systems Expert passionate about democratizing software development worldwide.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: isAr ? 'م. سارة القحطاني' : 'Sarah Al-Qahtani',
      role: isAr ? 'رئيسة قسم الهندسة والذكاء الاصطناعي' : 'Head of AI Engineering',
      bioAr: 'متخصصة في نماذج اللغة وتوليد الأكواد وإدارة بيئات Sandbox الموزعة.',
      bioEn: 'Specialized in Large Language Models, code generation, and distributed container sandboxes.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: isAr ? 'دانيال ستين' : 'Daniel Stein',
      role: isAr ? 'مدير البنية التحتية السحابية' : 'Head of Cloud Infrastructure',
      bioAr: 'مهندس سابق في Google Cloud معترك في تصميم الحاويات السريعة والتنفيذ في أقل من 200ms.',
      bioEn: 'Ex-Google Cloud architect building zero-cold-start container runtime infrastructure.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
  ];

  const values = [
    {
      icon: Target,
      titleAr: 'إضفاء الطابع الديمقراطي على البرمجة',
      titleEn: 'Democratizing Software Development',
      descAr: 'نؤمن بأن كل شخص يملك فكرة مبتكرة يجب أن يمتلك القدرة التقنية لبنائها فوراً دون عوائق.',
      descEn: 'We believe anyone with an innovative idea should have the tools to build it instantly.',
    },
    {
      icon: Zap,
      titleAr: 'السرعة الفائقة بدون تسويف',
      titleEn: 'Relentless Execution Speed',
      descAr: 'صممنا بيئة CodeVortex لتكون الأسرع في التشغيل والتنفيذ المباشر على المنفذ 3000.',
      descEn: 'Built from the ground up for sub-second container booting and instant live preview.',
    },
    {
      icon: ShieldCheck,
      titleAr: 'الأمان المؤسسي والخصوصية',
      titleEn: 'Enterprise Security & Privacy',
      descAr: 'حماية الأكواد المصدرية وتأمين خوادم النشر بأعلى معايير التشفير العالمية.',
      descEn: 'Top-tier code encryption, sandboxed execution, and SOC 2 security compliance.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-16 px-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header Story */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-black">
            <Sparkles className="w-4 h-4 text-[#00F2FE]" />
            <span>{isAr ? 'قصة وسالة منصة CodeVortex' : 'Our Story & Mission'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {isAr ? 'نمكن الجميع من بناء برمجيات عالمية بسهولة وسرعة' : 'Empowering Everyone to Build World-Class Software'}
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'تأسست منصة CodeVortex بهدف واضح: إلغاء التعقيدات البرمجية وإتاحة بيئة تطوير سحابية شاملة تعتمد على الذكاء الاصطناعي، لتتيح للمطورين والشركات تحويل أفكارهم إلى برمجيات حقيقية في دقائق.'
              : 'CodeVortex was born to eliminate software friction. We combine real-time REPL environments with neural AI agents to let creators deploy apps in minutes.'}
          </p>
        </div>

        {/* Company Core Values */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white">{isAr ? 'قيمنا الجوهرية' : 'Our Core Values'}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, idx) => {
              const IconComp = v.icon;
              return (
                <div key={idx} className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3 hover:border-cyan-500/30 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{isAr ? v.titleAr : v.titleEn}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{isAr ? v.descAr : v.descEn}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white">{isAr ? 'فريق القيادة والابتكار' : 'Leadership & Engineering Team'}</h2>
            <p className="text-slate-400 text-xs">{isAr ? 'عقول هندسية تسعى لإعادة تعريف مستقبل البرمجة السحابية' : 'Engineering minds redefining cloud development'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((m, idx) => (
              <div key={idx} className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4 text-center hover:border-purple-500/30 transition-all">
                <img src={m.avatar} alt={m.name} className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-cyan-500/40 shadow-lg" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">{m.name}</h3>
                  <p className="text-[11px] text-cyan-400 font-bold">{m.role}</p>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{isAr ? m.bioAr : m.bioEn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 border border-slate-800 p-8 rounded-3xl text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-white">{isAr ? 'هل أنت مستعد للانضمام لمستقبل البرمجة؟' : 'Ready to Join the Future of Software?'}</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            {isAr ? 'ابدأ الآن وبطريقة مجانية تماماً لتجربة المحاكي التفاعلي ومحرر الأكواد.' : 'Start now for free and experience the autonomous AI developer.'}
          </p>
          <button
            onClick={() => onSelectView('dashboard')}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            {isAr ? 'استكشاف لوحة التحكم والمشاريع' : 'Explore User Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};
