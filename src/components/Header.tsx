import React, { useState, useEffect } from 'react';
import { ViewMode, Language, Project } from '@/types';
import { useTranslation } from '@/lib/translations';
import { AuthModal } from './AuthModal';
import supabase from '@/lib/supabase';
import {
  Sparkles,
  Search,
  Menu,
  X,
  LogOut,
  User,
  Globe,
  Home,
  LayoutGrid,
  MessageSquareCode,
  ShoppingBag,
  HelpCircle,
  Users,
  FileText,
  Info,
  PhoneCall,
  Shield,
  Rocket,
  Download,
  Cpu,
  Check,
  Command,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  FolderKanban,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';

interface HeaderProps {
  currentProject: Project;
  onUpdateProjectName: (name: string) => void;
  activeView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenProjectsDrawer: () => void;
  onOpenDeployModal: () => void;
  onExportZip: () => void;
  onOpenCommandPalette: () => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
  isLoginModalOpen?: boolean;
  onToggleLoginModal?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  onUpdateProjectName,
  activeView,
  onSelectView,
  language,
  onToggleLanguage,
  onOpenProjectsDrawer,
  onOpenDeployModal,
  onExportZip,
  onOpenCommandPalette,
  onGoBack,
  canGoBack = false,
  isLoginModalOpen: propIsLoginModalOpen,
  onToggleLoginModal,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [internalIsLoginModalOpen, setInternalIsLoginModalOpen] = useState(false);

  const isLoginModalOpen = propIsLoginModalOpen !== undefined ? propIsLoginModalOpen : internalIsLoginModalOpen;
  const setIsLoginModalOpen = (open: boolean) => {
    if (onToggleLoginModal) {
      onToggleLoginModal(open);
    } else {
      setInternalIsLoginModalOpen(open);
    }
  };

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const isAr = language === 'ar';
  const t = useTranslation(language);

  // Sync Supabase Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const LANGUAGES_LIST: Array<{ code: Language; name: string; nativeName: string; flag: string }> = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  ];

  const currentLangObj = LANGUAGES_LIST.find((l) => l.code === language) || LANGUAGES_LIST[0];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!loginEmailInput.trim() || !passwordInput) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmailInput.trim(),
      password: passwordInput,
    });

    setLoading(false);
    if (error) {
      setAuthError(error.message);
    } else {
      setIsLoginModalOpen(false);
      setLoginEmailInput('');
      setPasswordInput('');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'apple' | 'azure') => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoginModalOpen(false);
  };

  const navigateTo = (view: ViewMode) => {
    onSelectView(view);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* 1. Clutter-free 3-Item Header */}
      <header className="bg-[#0B0F19]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-2xl font-sans">
        
        {/* Right Side (Platform Logo & Version Badge) */}
        <div className="flex items-center gap-3">
          {activeView !== 'landing' && onGoBack && (
            <button
              onClick={onGoBack}
              className="px-2.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-[#00F2FE] hover:text-white font-extrabold text-xs transition-all flex items-center gap-1 shrink-0 shadow-md animate-fade-in"
              title={t('back')}
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{t('back')}</span>
            </button>
          )}

          <button
            onClick={() => onSelectView('landing')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            {/* Neon Logo Icon */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00F2FE] via-blue-600 to-[#7928CA] p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center overflow-hidden">
                <svg className="w-5 h-5 text-[#00F2FE] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  <circle cx="12" cy="12" r="3" fill="#00F2FE" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#00F2FE] bg-clip-text text-transparent">
                  CloudForge
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/40 text-[#00F2FE] text-[9px] font-extrabold font-mono tracking-wider shadow-inner">
                  v2.4 Pro
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 -mt-0.5 tracking-tight">
                {t('vortexSub')}
              </span>
            </div>
          </button>
        </div>

        {/* Left Side (3 Key Action Items: Search, Login Button, Hamburger Menu) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Item 1: Quick Search / Command Palette */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs transition-all shadow-inner group"
            title={`${t('quickSearch')} (Ctrl+K)`}
          >
            <Search className="w-4 h-4 text-[#00F2FE] group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-medium">
              {t('search')}
            </span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[9px] font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-500">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          {/* Item 2: Prominent Login Button / Logged-in User Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 font-bold text-xs hover:bg-slate-800 transition-all shadow-lg shadow-emerald-500/10"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  {(user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[110px] truncate">{user.email}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="group relative p-[1.5px] rounded-full bg-gradient-to-r from-cyan-400 via-blue-600 to-purple-600 hover:from-cyan-300 hover:to-purple-500 shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(121,40,202,0.5)] transition-all hover:scale-102 active:scale-98 shrink-0"
            >
              <div className="px-3.5 py-1.5 rounded-full bg-[#0B0F19]/90 hover:bg-[#0B0F19]/60 backdrop-blur-md flex items-center gap-2.5 transition-all">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>

                <div className="flex flex-col text-left leading-tight">
                  <span className="font-extrabold text-xs text-white group-hover:text-cyan-200 transition-colors">
                    {t('login')}
                  </span>
                  <span className="text-[9px] font-medium text-cyan-300/80 tracking-wide">
                    {t('account')}
                  </span>
                </div>

                <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform shrink-0">
                  {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                </div>
              </div>
            </button>
          )}

          {/* Item 3: Quick Top-Bar Language Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs transition-all shadow-md font-bold"
              title={t('changeLanguage')}
            >
              <span className="text-base leading-none">{currentLangObj.flag}</span>
              <span className="font-mono text-[11px] text-cyan-300 uppercase">{currentLangObj.code}</span>
              <Globe className="w-3.5 h-3.5 text-[#00F2FE]" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute top-full mt-2 right-0 rtl:left-0 rtl:right-auto w-48 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 grid grid-cols-1 gap-1 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                {LANGUAGES_LIST.map((langItem) => (
                  <button
                    key={langItem.code}
                    onClick={() => {
                      onToggleLanguage(langItem.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                      language === langItem.code
                        ? 'bg-cyan-950 text-[#00F2FE] border border-cyan-800/80 font-bold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{langItem.flag}</span>
                      <span>{langItem.nativeName}</span>
                    </span>
                    {language === langItem.code && <Check className="w-3.5 h-3.5 text-[#00F2FE]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item 4: Hamburger Menu Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-[#00F2FE] transition-all focus:outline-none shadow-md"
            aria-label="Open Navigation Drawer"
            title={t('navigation')}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Full-Pages Mobile & Desktop Drawer Menu */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-sans">
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in"
          />

          <aside className="relative w-full max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden z-10 animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00F2FE] via-blue-600 to-[#7928CA] flex items-center justify-center text-slate-950 font-black">
                  ⚡
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-100 text-sm">
                    {t('navigation')}
                  </h2>
                  <span className="text-[10px] text-slate-400 font-mono">CloudForge v2.4 Pro</span>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-2 text-xs">
                    <Globe className="w-4 h-4 text-[#00F2FE]" />
                    <span>{t('globalLanguages')}</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">14 Languages</span>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className="w-full flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-bold hover:border-cyan-500/40 transition-all text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{currentLangObj.flag}</span>
                      <span>{currentLangObj.nativeName} ({currentLangObj.code.toUpperCase()})</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLangDropdownOpen && (
                    <div className="mt-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5 grid grid-cols-2 gap-1 shadow-2xl z-20">
                      {LANGUAGES_LIST.map((langItem) => (
                        <button
                          key={langItem.code}
                          onClick={() => {
                            onToggleLanguage(langItem.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all ${
                            language === langItem.code
                              ? 'bg-cyan-950 text-[#00F2FE] border border-cyan-800/80 font-bold'
                              : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          <span className="text-base">{langItem.flag}</span>
                          <span className="truncate text-[11px]">{langItem.nativeName}</span>
                          {language === langItem.code && <Check className="w-3 h-3 text-[#00F2FE] ml-auto shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Sections */}
              <div className="space-y-2">
                <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
                  {t('mainNav')}
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => navigateTo('landing')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                      activeView === 'landing'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <Home className="w-4 h-4 text-[#00F2FE]" />
                    <span>{t('home')}</span>
                  </button>

                  <button
                    onClick={() => navigateTo('dashboard')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                      activeView === 'dashboard'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <FolderKanban className="w-4 h-4 text-purple-400" />
                    <span>{t('dashboardAndProjects')}</span>
                  </button>

                  <button
                    onClick={() => navigateTo('cloudforge')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                      activeView === 'cloudforge'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>CloudForge Engine</span>
                  </button>

                  <button
                    onClick={() => navigateTo('workspace')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                      activeView === 'workspace'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4 text-emerald-400" />
                    <span>{t('workspace')}</span>
                  </button>

                  <button
                    onClick={() => navigateTo('chat')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                      activeView === 'chat'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <MessageSquareCode className="w-4 h-4 text-cyan-400" />
                    <span>{t('aiAssistant')}</span>
                  </button>

                  <button
                    onClick={() => navigateTo('marketplace')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                      activeView === 'marketplace'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>{t('marketplace')}</span>
                  </button>

                  <button
                    onClick={() => navigateTo('academy')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                      activeView === 'academy'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>{t('academy')}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
                  {t('supportPortal')}
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => navigateTo('support')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                      activeView === 'support'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    <span>{t('support')}</span>
                  </button>

                  <button
                    onClick={() => navigateTo('community')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                      activeView === 'community'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-orange-400" />
                      <span>{t('devCommunity')}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Reddit & Discord</span>
                  </button>

                  <button
                    onClick={() => navigateTo('changelog')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                      activeView === 'changelog'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>{t('changelog')}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
                  {t('about')}
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => navigateTo('about')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                      activeView === 'about'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <Info className="w-4 h-4 text-emerald-400" />
                    <span>{t('about')}</span>
                  </button>

                  <button
                    onClick={() => navigateTo('contact')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                      activeView === 'contact'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <PhoneCall className="w-4 h-4 text-cyan-400" />
                    <span>{t('contact')}</span>
                  </button>

                  <button
                    onClick={() => navigateTo('privacy')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                      activeView === 'privacy'
                        ? 'bg-cyan-950/80 text-[#00F2FE] border border-cyan-800/80'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'سياسة الخصوصية وشروط الخدمة' : 'Privacy & Terms'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-3">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenDeployModal();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-102 active:scale-98 transition-all"
              >
                <Rocket className="w-4 h-4 fill-current text-slate-950" />
                <span>{isAr ? 'النشر السحابي المباشر' : 'Deploy Application'}</span>
              </button>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onExportZip();
                }}
                className="w-full py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:text-white hover:bg-slate-900 flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>{isAr ? 'تصدير الكود المصدر ZIP' : 'Export Source Code'}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Interactive Dual-Panel Login Modal connected with Supabase */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 font-sans">
          <div
            onClick={() => setIsLoginModalOpen(false)}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl animate-in fade-in"
          />

          <div className="relative w-full max-w-4xl bg-[#0d1222] border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12 animate-in zoom-in-95 my-auto max-h-[90vh]">
            
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Side Panel */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#12182d] via-[#0d1020] to-[#180a2c] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80 relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#00F2FE] via-blue-600 to-[#7928CA] flex items-center justify-center text-slate-950 font-black shadow-2xl shadow-cyan-500/30">
                    <Sparkles className="w-9 h-9 text-slate-950 animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">
                      Cloud<span className="text-[#00F2FE]">Forge</span>
                    </h2>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                      {isAr ? 'من الفكرة إلى الكود، بسرعة وإبداع.' : 'From idea to code, fast & creative.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">
                        {isAr ? 'آمن وموثوق' : 'Secure & Trusted'}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {isAr ? 'حماية متقدمة لبياناتك ومتوافقة مع أعلى المعايير.' : 'Enterprise Grade Security SOC 2 & SSL.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">
                        {isAr ? 'أداء بلا حدود' : 'Limitless Performance'}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {isAr ? 'بنية تحتية قوية لتجربة سريعة وسلسة.' : 'Ultra-fast Cloud Container Execution.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">
                        {isAr ? 'مطور من أجلك' : 'Developer First'}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {isAr ? 'كل الأدوات التي تحتاجها في مكان واحد.' : 'All AI & IDE tools in one integrated suite.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-4 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                v2.4 Pro Cloud Ingress • All Systems Operational
              </div>
            </div>

            {/* Right Side Panel */}
            <div className="md:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-center overflow-y-auto max-h-[85vh]">
              
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-slate-400">
                  {isAr ? 'مرحباً بك في' : 'Welcome to'}
                </span>
                <h3 className="text-2xl font-black text-white">
                  Cloud<span className="text-[#00F2FE]">Forge</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'سجّل الدخول للمتابعة إلى حسابك' : 'Sign in to continue to your account'}
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-semibold text-center animate-shake">
                  {authError}
                </div>
              )}

              {user ? (
                /* Logged In Real User Account State */
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isAr ? 'البريد الإلكتروني:' : 'Email:'}</span>
                      <span className="font-bold text-cyan-400 font-mono">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isAr ? 'معرف المستخدم:' : 'User ID:'}</span>
                      <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">{user.id}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400">{isAr ? 'نوع الحساب:' : 'Account Plan:'}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono font-bold">Pro Account</span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-400 font-bold hover:bg-rose-900 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
                  </button>
                </div>
              ) : (
                /* Form State */
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('google')}
                      className="w-full py-2.5 px-4 bg-[#0a0d17] hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl font-extrabold text-slate-200 hover:text-white flex items-center justify-between transition-all group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>{isAr ? 'تسجيل الدخول باستخدام Google' : 'Sign in with Google'}</span>
                      </div>
                      <ChevronDown className="-rotate-90 w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin('github')}
                      className="w-full py-2.5 px-4 bg-[#0a0d17] hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl font-extrabold text-slate-200 hover:text-white flex items-center justify-between transition-all group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        <span>{isAr ? 'تسجيل الدخول باستخدام GitHub' : 'Sign in with GitHub'}</span>
                      </div>
                      <ChevronDown className="-rotate-90 w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin('apple')}
                      className="w-full py-2.5 px-4 bg-[#0a0d17] hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl font-extrabold text-slate-200 hover:text-white flex items-center justify-between transition-all group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.13c.64-.78 1.08-1.85.96-2.93-.93.04-2.08.62-2.74 1.4-.59.68-1.11 1.77-.97 2.83 1.04.08 2.11-.52 2.75-1.3"/>
                        </svg>
                        <span>{isAr ? 'تسجيل الدخول باستخدام Apple' : 'Sign in with Apple'}</span>
                      </div>
                      <ChevronDown className="-rotate-90 w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin('azure')}
                      className="w-full py-2.5 px-4 bg-[#0a0d17] hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl font-extrabold text-slate-200 hover:text-white flex items-center justify-between transition-all group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#F25022" d="M1 1h10v10H1z"/>
                          <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                          <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                          <path fill="#FFB900" d="M13 13h10v10H13z"/>
                        </svg>
                        <span>{isAr ? 'تسجيل الدخول باستخدام Microsoft' : 'Sign in with Microsoft'}</span>
                      </div>
                      <ChevronDown className="-rotate-90 w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </button>
                  </div>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-slate-800/80 w-full"></div>
                    <span className="bg-[#0d1222] px-3 text-[10px] text-slate-500 font-mono uppercase">
                      {isAr ? 'أو' : 'OR'}
                    </span>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 rtl:left-auto rtl:right-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={loginEmailInput}
                        onChange={(e) => setLoginEmailInput(e.target.value)}
                        placeholder={isAr ? 'البريد الإلكتروني' : 'Email Address'}
                        className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all"
                      />
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 rtl:left-auto rtl:right-3 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder={isAr ? 'كلمة المرور' : 'Password'}
                        className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9 pr-9 rtl:pl-9 rtl:pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 rtl:right-auto rtl:left-3 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                        />
                        <span>{isAr ? 'تذكرني' : 'Remember me'}</span>
                      </label>

                      <button
                        type="button"
                        onClick={async () => {
                          if (!loginEmailInput.trim()) {
                            alert(isAr ? 'يرجى إدخال البريد الإلكتروني أولاً' : 'Please enter your email first');
                            return;
                          }
                          const { error } = await supabase.auth.resetPasswordForEmail(loginEmailInput.trim());
                          if (error) alert(error.message);
                          else alert(isAr ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.' : 'Password reset link sent to your email.');
                        }}
                        className="text-purple-400 hover:text-purple-300 font-semibold"
                      >
                        {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 hover:scale-101 active:scale-99 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    >
                      <span>{loading ? (isAr ? 'جاري التحقق...' : 'Signing in...') : (isAr ? 'تسجيل الدخول' : 'Sign In')}</span>
                      {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </form>

                  <div className="text-center pt-2 text-[11px] text-slate-400">
                    <span>{isAr ? 'ليس لديك حساب؟ ' : "Don't have an account? "}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginModalOpen(false);
                        setShowOtpModal(true);
                      }}
                      className="text-[#00F2FE] hover:underline font-extrabold"
                    >
                      {isAr ? 'إنشاء حساب جديد' : 'Create New Account'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Dedicated Email OTP Verification Modal */}
      <AuthModal
        language={language}
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccessLogin={(loggedInUser) => {
          setUser(loggedInUser);
          onSelectView('dashboard');
        }}
      />
    </>
  );
};
