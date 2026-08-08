import React, { useState, useEffect } from 'react';
import { Language, ViewMode, AIModel } from '../types';
import { useTranslation } from '../locales';
import {
  Sparkles,
  Zap,
  Rocket,
  Code2,
  Terminal,
  Cpu,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Star,
  Users,
  ArrowRight,
  Play,
  Layers,
  Bot,
  Laptop,
  Flame,
  ChevronRight,
  ChevronDown,
  Building2,
  Check,
  Github,
  Twitter,
  MessageSquare,
  Mail,
  Send,
  HelpCircle,
  LayoutGrid,
  ShoppingBag,
  FolderKanban,
  Shield,
  Server
} from 'lucide-react';

interface LandingPageProps {
  language: Language;
  onSelectView: (view: ViewMode) => void;
  onGenerateFromPrompt: (prompt: string, model: AIModel) => void;
  onOpenLoginModal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onSelectView,
  onGenerateFromPrompt,
  onOpenLoginModal,
}) => {
  const isAr = language === 'ar';
  const t = useTranslation(language);
  const [promptInput, setPromptInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>('cv-neural-v5');
  const [activeTabDemo, setActiveTabDemo] = useState<'agent' | 'terminal' | 'preview'>('agent');
  const [simulatedCodeIndex, setSimulatedCodeIndex] = useState(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Animated Code Snippets simulation
  const codeLines = [
    `// CloudForge Neural Engine v5.0 initialized`,
    `import { createAgent, deployContainer } from '@cloudforge/neural';`,
    `const app = createAgent({ model: 'cv-neural-v5', rtl: ${isAr ? 'true' : 'false'} });`,
    `await app.generateFullStackApp('Live REPL Container Application');`,
    `console.log('✅ Live REPL Container compiled on port :3000 in 1.1s');`,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedCodeIndex((prev) => (prev + 1) % codeLines.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [codeLines.length]);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onGenerateFromPrompt(promptInput.trim(), selectedModel);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterSubmitted(false);
      setNewsletterEmail('');
    }, 4000);
  };

  // Marketing Feature Cards
  const featureCards = [
    {
      title: t('card1Title'),
      desc: t('card1Desc'),
      icon: <ShoppingBag className="w-6 h-6 text-[#00F2FE]" />,
      badge: t('card1Badge'),
    },
    {
      title: t('card2Title'),
      desc: t('card2Desc'),
      icon: <FolderKanban className="w-6 h-6 text-purple-400" />,
      badge: t('card2Badge'),
    },
    {
      title: t('card3Title'),
      desc: t('card3Desc'),
      icon: <Server className="w-6 h-6 text-emerald-400" />,
      badge: t('card3Badge'),
    },
    {
      title: t('card4Title'),
      desc: t('card4Desc'),
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      badge: t('card4Badge'),
    },
  ];

  // Testimonials
  const testimonials = [
    {
      id: '1',
      name: isAr ? 'عبدالله السعيد' : 'Abdullah Al-Saeed',
      role: isAr ? 'مؤسس ورئيس تنفيذي' : 'Founder & CEO',
      company: 'TechFlow',
      comment: isAr
        ? 'CloudForge حولت فكرتنا إلى منتج في دقائق! سرعة التطوير والنشر السحابي لا تقدر بثمن لشركتنا الناشئة.'
        : 'CloudForge converted our idea into a live product in minutes! Cloud deployment speed is priceless.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      rating: 5,
    },
    {
      id: '2',
      name: isAr ? 'م. سارة المهيدي' : 'Eng. Sarah Al-Muhaidi',
      role: isAr ? 'قائدة فريق البرمجيات' : 'Lead Software Architect',
      company: 'Cloud Studio',
      comment: isAr
        ? 'تكامل CloudForge السلس مع جميع اللغات والذكاء الاصطناعي فاق توقعاتنا.'
        : 'Seamless CloudForge integration with multilingual support & AI exceeded our expectations.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      rating: 5,
    },
    {
      id: '3',
      name: isAr ? 'د. يوسف منصور' : 'Dr. Youssef Mansour',
      role: isAr ? 'استشاري التحول الرقمي' : 'Digital Transformation Consultant',
      company: 'Global AI Ventures',
      comment: isAr
        ? 'نستخدم بيئة العمل CloudForge السحابية المعززة بالذكاء الاصطناعي لبناء برمجيات معقدة ونشرها بكفاءة غير مسبوقة.'
        : 'We rely on CloudForge Cloud Platform to construct high-performance full-stack web applications with unprecedented efficiency.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      rating: 5,
    },
  ];

  // FAQs
  const faqs = [
    {
      q: isAr ? 'هل CloudForge مجانية؟ وما هي خطط التسعير؟' : 'Is CloudForge free? What are the pricing plans?',
      a: isAr
        ? 'نعم! تقدم منصة CloudForge خطة Hobby مجانية بالكامل تتضمن مشاريع عامة غير محدودة وموارد حوسبة أساسية للتعلم وتجربة الأفكار. وتوجد باقات مدفوعة للمشاريع الخاصة وموارد الحوسبة المعززة.'
        : 'Yes! CloudForge provides a completely free Hobby plan including unlimited public projects and basic compute resources. Paid plans offer private projects and enhanced compute power.'
    },
    {
      q: isAr ? 'ما أنواع التطبيقات التي يمكنني بناؤها باستخدام CloudForge؟' : 'What types of applications can I build using CloudForge?',
      a: isAr
        ? 'يمكنك بناء كافة أنواع تطبيقات الويب المتكاملة (Full-Stack)، المتاجر الإلكترونية، لوحات تحكم البيانات، تطبيقات الذكاء الاصطناعي، وأدوات الخدمة الذاتية مع معاينة حية سريعة على المنفذ :3000.'
        : 'You can build all types of full-stack web applications, e-commerce stores, analytics dashboards, AI tools, and SaaS products with real-time port 3000 live preview.'
    },
    {
      q: isAr ? 'هل يمكنك إنشاء تطبيقات سطح المكتب باستخدام CloudForge؟' : 'Can you build desktop apps using CloudForge?',
      a: isAr
        ? 'بالتأكيد! يمكنك تطوير تطبيقات سطح المكتب والهواتف الذكية عبر إطارات عمل الويب المتوافقة وتصدير الكود المصدر بالكامل لتشغيله عبر Electron أو Tauri أو PWA.'
        : 'Absolutely! You can develop desktop and mobile applications using modern web frameworks and export full source code to run via Electron, Tauri, or PWA.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-cyan-500/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 max-w-6xl mx-auto text-center space-y-8 relative">
        {/* Central Official Platform Brand Banner */}
        <div className="flex flex-col items-center justify-center space-y-3 pt-2">
          {/* Glowing Neon Emblem */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00F2FE] via-[#3B82F6] to-[#7928CA] rounded-full blur-2xl opacity-70 animate-pulse" />
            <div className="relative w-full h-full rounded-3xl bg-[#090e1a] border border-cyan-400/40 shadow-[0_0_40px_rgba(0,242,254,0.3)] flex items-center justify-center p-3">
              <svg className="w-full h-full text-[#00F2FE]" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="vortexHeroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F2FE" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#7928CA" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50C90 35 80 20 65 15C50 10 35 25 35 40C35 55 50 65 65 60"
                  stroke="url(#vortexHeroGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="50" r="12" fill="url(#vortexHeroGrad)" />
              </svg>
            </div>
          </div>

          {/* CloudForge Title & Dual Slogan */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Cloud<span className="text-[#00F2FE]">Forge</span>
              </h2>
              <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-950 to-purple-950 border border-cyan-500/40 text-[#00F2FE] text-xs font-mono font-bold">
                v2.4 Pro
              </span>
            </div>
            
            <p className="text-sm sm:text-base font-extrabold text-cyan-300 tracking-wide">
              {t('vortexSub')}
            </p>
          </div>
        </div>

        {/* Floating Tech Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-black shadow-lg shadow-cyan-500/10 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#00F2FE]" />
          <span>{t('heroPill')}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.15] max-w-5xl mx-auto text-white">
          {t('heroTitle')}
        </h1>

        {/* Hero Description */}
        <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-normal leading-relaxed">
          {t('heroSubtitle')}
        </p>

        {/* Main Clean AI Prompt Box */}
        <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-3 sm:p-4 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl relative group hover:border-cyan-500/50 transition-all">
          <form onSubmit={handleQuickSubmit} className="space-y-0">
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <Bot className="w-6 h-6 text-[#00F2FE] shrink-0" />
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={t('heroInputPlaceholder')}
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0"
              >
                <Rocket className="w-4 h-4 fill-current text-slate-950" />
                <span>{t('generateAppBtn')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Direct Action Buttons */}
        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onSelectView('workspace')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Rocket className="w-4.5 h-4.5 fill-current" />
            <span>{t('startJourneyBtn')}</span>
          </button>

          <button
            onClick={() => onSelectView('dashboard')}
            className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 font-bold text-slate-200 text-sm flex items-center gap-2 shadow-lg transition-all"
          >
            <Sparkles className="w-4.5 h-4.5 text-cyan-400" />
            <span>{t('discoverPowerBtn')}</span>
          </button>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {t('featureCapabilities')}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            {t('featureSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-3xl space-y-4 shadow-xl hover:shadow-cyan-500/10 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[#00F2FE] text-[10px] font-bold font-mono">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-[#00F2FE] transition-colors">
                  {card.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <button
                onClick={() => onSelectView('workspace')}
                className="w-full pt-3 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-cyan-400 transition-colors border-t border-slate-800/80 mt-2"
              >
                <span>{t('exploreNow')}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-[#00F2FE]">{t('stat1Val')}</span>
            <p className="text-xs text-slate-300 font-medium">{t('stat1Label')}</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-[#7928CA]">{t('stat2Val')}</span>
            <p className="text-xs text-slate-300 font-medium">{t('stat2Label')}</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{t('stat3Val')}</span>
            <p className="text-xs text-slate-300 font-medium">{t('stat3Label')}</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{t('stat4Val')}</span>
            <p className="text-xs text-slate-300 font-medium">{t('stat4Label')}</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-6 pt-8">
          <div className="text-center">
            <h3 className="text-2xl font-black text-white">{t('testimonialsTitle')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tItem) => (
              <div key={tItem.id} className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl hover:border-cyan-500/30 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(tItem.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                    "{tItem.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                  <img src={tItem.avatar} alt={tItem.name} className="w-10 h-10 rounded-full object-cover border border-cyan-500/40" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{tItem.name}</h4>
                    <p className="text-[11px] text-slate-400">{tItem.role} - <span className="text-cyan-400">{tItem.company}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 px-4 bg-slate-950/90 border-t border-slate-800/80 relative">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span>{t('openCommunity')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {t('joinBuilders')}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              {t('communitySub')}
            </p>
          </div>

          {/* Interactive Community Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Reddit */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-orange-500/40 p-6 rounded-3xl space-y-4 shadow-xl transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                  {t('redditTitle')}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {t('redditDesc')}
                </p>
              </div>

              <a
                href="https://reddit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-orange-600 hover:text-white text-orange-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-800 transition-all mt-4"
              >
                <span>{t('joinReddit')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 2: GitHub Open Source */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-3xl space-y-4 shadow-xl transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                  <Github className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {t('githubTitle')}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {t('githubDesc')}
                </p>
              </div>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-800 transition-all mt-4"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{t('starGithub')}</span>
              </a>
            </div>

            {/* Card 3: X / Twitter */}
            <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 p-6 rounded-3xl space-y-4 shadow-xl transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                  <Twitter className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                  {t('twitterTitle')}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {t('twitterDesc')}
                </p>
              </div>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-purple-600 hover:text-white text-purple-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-800 transition-all mt-4"
              >
                <span>{t('followX')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          {/* Glowing Sparkles Icon */}
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#00F2FE] via-blue-600 to-[#7928CA] flex items-center justify-center mx-auto text-slate-950 font-black shadow-xl shadow-cyan-500/20">
            <Sparkles className="w-8 h-8 text-slate-950 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {t('stayUpdated')}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {t('newsletterSub')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-2 shadow-inner focus-within:border-cyan-500/50 transition-all">
              <Mail className="w-5 h-5 text-slate-500 ml-2 shrink-0" />
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t('enterEmail')}
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>{t('subscribe')}</span>
                <Send className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {newsletterSubmitted && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{t('subSuccess')}</span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 px-4 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-purple-400 text-xs font-bold">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>{t('helpDoc')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {t('faqTitle')}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              {t('faqSub')}
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-white hover:text-cyan-400 transition-colors"
                  >
                    <span className="pr-4">{faq.q}</span>
                    <div className={`p-1.5 rounded-lg bg-slate-950 border border-slate-800 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4 bg-slate-950/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800 text-center space-y-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            {t('readyTitle')}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t('readySub')}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onSelectView('pricing')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all"
            >
              {t('explorePlans')}
            </button>
            <button
              onClick={() => onSelectView('dashboard')}
              className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 font-bold text-slate-200 text-sm transition-all"
            >
              {t('tryFree')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
