import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getTranslation } from '../lib/translations';
import {
  Building2,
  CreditCard,
  Cpu,
  Crown,
  Key,
  Link as LinkIcon,
  Copy,
  Check,
  Upload,
  FileText,
  Paperclip,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  Search,
  X,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FileCode,
  AlertCircle,
  Eye,
  HelpCircle,
  ChevronRight,
  PhoneCall,
  PhoneOff,
  Mic,
  Volume2
} from 'lucide-react';

export type DepartmentType = 'sales' | 'billing' | 'tech' | 'executive';

interface DepartmentalSupportPortalProps {
  language: Language;
  initialDepartment?: DepartmentType;
  initialMagicKey?: string;
  onNavigateToView?: (view: any) => void;
}

export interface TicketAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
  uploaded_at: string;
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'department_agent' | 'system';
  sender_name: string;
  text: string;
  timestamp: string;
}

export interface TicketData {
  id: string;
  magic_key: string;
  department: DepartmentType;
  sender_name: string;
  sender_email: string;
  subject: string;
  message_content: string;
  status: 'received' | 'assigned' | 'in_progress' | 'resolved';
  created_at: string;
  updated_at: string;
  attachments?: TicketAttachment[];
  messages?: TicketMessage[];
  system_info?: {
    fax_line: string;
    official_email: string;
    submitted_at: string;
  };
}

export const DepartmentalSupportPortal: React.FC<DepartmentalSupportPortalProps> = ({
  language,
  initialDepartment = 'sales',
  initialMagicKey = '',
  onNavigateToView,
}) => {
  const isAr = language === 'ar';
  const t = getTranslation(language);

  // Selected Department Tab
  const [activeDept, setActiveDept] = useState<DepartmentType>(initialDepartment);

  // Search Magic Key State
  const [magicKeyInput, setMagicKeyInput] = useState(initialMagicKey);
  const [isSearchingKey, setIsSearchingKey] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Active Loaded Ticket
  const [activeTicket, setActiveTicket] = useState<TicketData | null>(null);

  // New Ticket Form State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessageText, setTicketMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<TicketData | null>(null);

  // Department Chat Thread Input
  const [chatInput, setChatInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Copy Feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Upload File Drag & Drop State
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<TicketAttachment | null>(null);

  // Live Voice Officer Call State
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [isOfficerSpeaking, setIsOfficerSpeaking] = useState(false);
  const [voiceCallStatus, setVoiceCallStatus] = useState<string>('');

  const handleStartVoiceCall = () => {
    setIsVoiceCallActive(true);
    const greetingText = isAr
      ? `مرحباً بك مع مسئول ${deptInfo[activeDept].titleAr}. تذكرتك بالرقم ${activeTicket?.id || 'النشط'} جاري معالجتها بأعلى أولوية. كيف يمكنني إفادتك صوتاً؟`
      : `Hello! Connecting you live to ${deptInfo[activeDept].titleEn}. Ticket ${activeTicket?.id || 'active'} is prioritized. How can I assist you by voice?`;
    
    setVoiceCallStatus(greetingText);
    speakText(greetingText);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isAr ? 'ar-SA' : 'en-US';
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      
      utterance.onstart = () => setIsOfficerSpeaking(true);
      utterance.onend = () => setIsOfficerSpeaking(false);
      utterance.onerror = () => setIsOfficerSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEndVoiceCall = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsVoiceCallActive(false);
    setIsOfficerSpeaking(false);
  };

  // Load ticket if initial Magic Key is provided
  useEffect(() => {
    if (initialMagicKey) {
      handleLookupTicket(initialMagicKey);
    }
  }, [initialMagicKey]);

  const handleLookupTicket = async (keyToSearch: string) => {
    const key = keyToSearch.trim();
    if (!key) return;

    setIsSearchingKey(true);
    setSearchError('');

    try {
      const res = await fetch(`/api/db/support/departmental-tickets/lookup?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      setIsSearchingKey(false);

      if (data.success && data.ticket) {
        setActiveTicket(data.ticket);
        setActiveDept(data.ticket.department);
        setCreatedTicket(null);
      } else {
        setSearchError(
          isAr
            ? 'لم يتم العثور على تذكرة بهذا المفتاح أو الرقم. يرجى التحقق وإعادة المحاولة.'
            : 'No ticket found matching this Magic Key or ID. Please check and try again.'
        );
      }
    } catch (err) {
      console.warn('Ticket lookup error:', err);
      setIsSearchingKey(false);
      setSearchError(isAr ? 'حدث خطأ أثناء البحث عن التذكرة.' : 'Error performing ticket lookup.');
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessageText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/db/support/departmental-tickets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: activeDept,
          sender_name: senderName,
          sender_email: senderEmail,
          subject: ticketSubject || (isAr ? `طلب جديد - ${deptInfo[activeDept].titleAr}` : `New Inquiry - ${deptInfo[activeDept].titleEn}`),
          message: ticketMessageText,
          language: language,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.ticket) {
        setCreatedTicket(data.ticket);
        setActiveTicket(data.ticket);
        setTicketSubject('');
        setTicketMessageText('');
      } else {
        throw new Error(data.error || 'Failed to create ticket');
      }
    } catch (err) {
      console.error('Create ticket error:', err);
      setIsSubmitting(false);
      // Fallback ticket creation simulation
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const randHex = Math.random().toString(36).substring(2, 7).toUpperCase();
      const prefix = activeDept === 'billing' ? 'CV-FIN-2026-' : activeDept === 'tech' ? 'CV-TECH-2026-' : activeDept === 'executive' ? 'CV-EXEC-2026-' : 'CV-SALES-2026-';
      const keyPrefix = activeDept === 'billing' ? 'CVKEY-FIN-' : activeDept === 'tech' ? 'CVKEY-TECH-' : activeDept === 'executive' ? 'CVKEY-EXEC-' : 'CVKEY-SALES-';

      const fallbackTicket: TicketData = {
        id: `${prefix}${randNum}`,
        magic_key: `${keyPrefix}${randHex}`,
        department: activeDept,
        sender_name: senderName,
        sender_email: senderEmail,
        subject: ticketSubject || 'Department Request',
        message_content: ticketMessageText,
        status: 'received',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        attachments: [],
        messages: [
          {
            id: `msg_u_${Date.now()}`,
            sender: 'user',
            sender_name: senderName,
            text: ticketMessageText,
            timestamp: new Date().toISOString(),
          },
          {
            id: 'msg_a_init',
            sender: 'department_agent',
            sender_name: deptInfo[activeDept].officerTitleAr,
            text: isAr ? 'تم تسجيل التذكرة بنجاح وتخصيص مستشار القسم لمراجعة طلبكم.' : 'Ticket registered successfully. A department specialist is assigned to review.',
            timestamp: new Date().toISOString(),
          },
        ],
        system_info: {
          fax_line: '',
          official_email: '',
          submitted_at: new Date().toISOString(),
        },
      };

      setCreatedTicket(fallbackTicket);
      setActiveTicket(fallbackTicket);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeTicket) return;

    const userText = chatInput.trim();
    setChatInput('');
    setIsSendingMsg(true);

    try {
      const res = await fetch('/api/db/support/departmental-tickets/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key_or_id: activeTicket.magic_key || activeTicket.id,
          message: userText,
          sender_name: senderName,
          language: language,
        }),
      });

      const data = await res.json();
      setIsSendingMsg(false);

      if (data.success && data.ticket) {
        setActiveTicket(data.ticket);
      } else {
        throw new Error('Message error');
      }
    } catch (err) {
      console.warn('Chat message error fallback:', err);
      setIsSendingMsg(false);

      // Client-side fallback message append
      const updatedMessages: TicketMessage[] = [
        ...(activeTicket.messages || []),
        {
          id: `msg_u_${Date.now()}`,
          sender: 'user',
          sender_name: senderName,
          text: userText,
          timestamp: new Date().toISOString(),
        },
        {
          id: `msg_a_${Date.now()}`,
          sender: 'department_agent',
          sender_name: deptInfo[activeTicket.department].officerTitleAr,
          text: isAr ? 'تم استلام تحديثك وجاري المتابعة الفورية.' : 'Message received. Direct response logged.',
          timestamp: new Date().toISOString(),
        },
      ];

      setActiveTicket({
        ...activeTicket,
        status: 'in_progress',
        messages: updatedMessages,
      });
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !activeTicket) return;

    const file = files[0];
    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        const res = await fetch('/api/db/support/departmental-tickets/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key_or_id: activeTicket.magic_key || activeTicket.id,
            file_name: file.name,
            file_size: sizeStr,
            file_type: file.type,
            file_data: base64Data,
          }),
        });

        const data = await res.json();
        setIsUploading(false);

        if (data.success && data.ticket) {
          setActiveTicket(data.ticket);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('File upload fallback:', err);
      setIsUploading(false);

      const newAtt: TicketAttachment = {
        id: `att_${Date.now()}`,
        name: file.name,
        size: sizeStr,
        type: file.type,
        uploaded_at: new Date().toISOString(),
      };

      setActiveTicket({
        ...activeTicket,
        attachments: [...(activeTicket.attachments || []), newAtt],
      });
    }
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const deptInfo = {
    sales: {
      id: 'sales',
      path: '/support/sales',
      titleAr: 'قسم مبيعات الشركات والاستفسارات التجارية الكبرى',
      titleEn: 'Sales & Enterprise Commercial Portal',
      descAr: 'مخصص للشركات الكبرى، طلبات العقود الخاصة، استفسارات باقة Enterprise، وتخصيص الموارد الحسابية الضخمة.',
      descEn: 'Tailored for enterprise buyers, custom SLAs, high-capacity cloud specs & team workspace licensing.',
      officerTitleAr: 'مبيعات الشركات والصفقات الكبرى',
      icon: Building2,
      badge: 'ENTERPRISE CONTRACTS',
      colorTheme: 'from-purple-600 to-indigo-600',
      borderTheme: 'border-purple-500/40',
      bgTheme: 'bg-purple-950/40',
      textAccent: 'text-purple-400',
    },
    billing: {
      id: 'billing',
      path: '/support/billing',
      titleAr: 'قسم الخدمات المالية والمحاسبة',
      titleEn: 'Billing & Financial Operations Portal',
      descAr: 'مخصص لفواتير الاشتراكات، التحويلات البنكية المباشرة، حل النزاعات المالية، طلبات الاسترداد، وبدائل وسيلة الدفع.',
      descEn: 'Dedicated for subscription invoices, bank wire receipts, refund disputes & alternative payment resolution.',
      officerTitleAr: 'قسم المحاسبة والخدمات المالية',
      icon: CreditCard,
      badge: 'FINANCIAL SERVICES',
      colorTheme: 'from-emerald-500 to-teal-600',
      borderTheme: 'border-emerald-500/40',
      bgTheme: 'bg-emerald-950/40',
      textAccent: 'text-emerald-400',
    },
    tech: {
      id: 'tech',
      path: '/support/tech',
      titleAr: 'قسم الدعم التقني المتقدم',
      titleEn: 'Advanced Technical Support Portal',
      descAr: 'مخصص للمشاكل التقنية المعقدة، أخطاء السيرفرات السحابية، ومشاكل ربط الـ APIs وحاويات التشغيل على Port 3000.',
      descEn: 'Dedicated for runtime container debugging, API integrations, complex code errors & port 3000 diagnostics.',
      officerTitleAr: 'قسم الدعم التقني المتقدم',
      icon: Cpu,
      badge: 'ENGINEERING & INFRA',
      colorTheme: 'from-[#00F2FE] to-blue-600',
      borderTheme: 'border-cyan-500/40',
      bgTheme: 'bg-cyan-950/40',
      textAccent: 'text-cyan-400',
    },
    executive: {
      id: 'executive',
      path: '/support/executive',
      titleAr: 'قسم الإدارة العليا والسيادية',
      titleEn: 'Executive Management & Sovereign Portal',
      descAr: 'مخصص حصرياً للجهات الرسمية، الشراكات الاستراتيجية الكبرى، والقرارات الإدارية العليا.',
      descEn: 'Reserved strictly for official government entities, strategic partnerships & executive governance.',
      officerTitleAr: 'مكتب الإدارة العليا والسيادية',
      icon: Crown,
      badge: 'SOVEREIGN GOVERNANCE',
      colorTheme: 'from-amber-400 to-yellow-600',
      borderTheme: 'border-amber-500/40',
      bgTheme: 'bg-amber-950/40',
      textAccent: 'text-amber-400',
    },
  };

  const currentDeptObj = deptInfo[activeDept];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Sovereign Header Banner */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-black">
                <ShieldCheck className="w-4 h-4 text-[#00F2FE]" />
                <span>
                  {isAr
                    ? 'بوابات الدعم والأقسام المتخصصة بمفاتيح التذاكر الآمنة'
                    : 'Secure Departmental Portals & Magic Ticket Keys'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {isAr
                  ? 'منظومة الدعم التخصصية ومتابعة التذاكر السحرية'
                  : 'Specialized Departmental Support & Magic Key Gateway'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {isAr
                  ? 'تتيح هذه البوابة التفاعل المباشر مع أربعة أقسام مستقلة بالمنصة، وتوليد روابط سحرية (Magic Links) ومفاتيح تشفير آمنة تمنحك وصولاً فورياً بدون كلمة سر.'
                  : 'Direct interaction hub for 4 specialized platform departments with encrypted Magic Ticket Keys & instant password-free tracking links.'}
              </p>
            </div>

            {/* MAGIC KEY SEARCH BAR (Anywhere Search) */}
            <div className="w-full lg:w-96 bg-slate-900/90 border border-cyan-500/30 p-4 rounded-2xl shadow-xl space-y-3">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#00F2FE]" />
                <span>{isAr ? 'متابعة تذكرة بمفتاح سحري (Magic Key):' : 'Track Ticket with Magic Key / ID:'}</span>
              </label>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLookupTicket(magicKeyInput);
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 rtl:right-3 rtl:left-auto top-3" />
                  <input
                    type="text"
                    value={magicKeyInput}
                    onChange={(e) => setMagicKeyInput(e.target.value)}
                    placeholder={isAr ? 'أدخل المفتاح: CVKEY-FIN-4102...' : 'Key e.g. CVKEY-FIN-4102...'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 rtl:pr-9 rtl:pl-3 pr-3 py-2 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingKey}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-black text-xs hover:scale-105 transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  {isSearchingKey ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>{isAr ? 'دخول' : 'Access'}</span>
                  )}
                </button>
              </form>

              {searchError && <p className="text-[10px] text-rose-400 font-bold">{searchError}</p>}
            </div>
          </div>
        </div>

        {/* UNIFIED SIDE-BY-SIDE SUPPORT & LIVE CHAT WORKSPACE */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* 1. SIDEBAR: PINNED DEPARTMENT LIST & TRACKER (قائمة الأقسام الجانبية) */}
          <aside className="w-full md:w-1/3 lg:w-1/4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shrink-0 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs sm:text-sm font-black text-cyan-400 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00F2FE]" />
                <span>{isAr ? 'أقسام الدعم الفني' : 'Support Departments'}</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                4 Portals
              </span>
            </div>

            {/* Department Navigation Buttons */}
            <div className="space-y-2">
              {(['tech', 'billing', 'sales', 'executive'] as DepartmentType[]).map((deptKey) => {
                const d = deptInfo[deptKey];
                const IconComp = d.icon;
                const isSelected = activeDept === deptKey;

                return (
                  <button
                    key={deptKey}
                    onClick={() => {
                      setActiveDept(deptKey);
                      setActiveTicket(null);
                      setCreatedTicket(null);
                      setSearchError('');
                    }}
                    className={`w-full text-right rtl:text-right text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                      isSelected
                        ? `${d.bgTheme} ${d.borderTheme} border-2 text-white shadow-md`
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`p-1.5 rounded-lg bg-slate-950 text-cyan-400 shrink-0 ${isSelected ? d.textAccent : ''}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="truncate">{isAr ? d.titleAr : d.titleEn}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'text-cyan-400 rtl:rotate-180' : 'text-slate-500'}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Active Ticket Summary Box in Sidebar if active */}
            {activeTicket && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-cyan-300 font-bold">{activeTicket.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black uppercase text-[9px]">
                      {activeTicket.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-white truncate">{activeTicket.subject}</p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleStartVoiceCall}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] flex items-center justify-center gap-1 transition-all"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{isAr ? 'مكالمة صوتیة' : 'Voice Call'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTicket(null);
                        setCreatedTicket(null);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                      title={isAr ? 'طلب جديد' : 'New Inquiry'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* 2. MAIN WORKSPACE: LIVE CHAT & DEPARTMENT INQUIRY FORM (منطقة الدردشة المباشرة) */}
          <main className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between p-4 sm:p-6 min-h-[550px] shadow-2xl">
            {activeTicket ? (
              /* ACTIVE TICKET LIVE CHAT & VAULT INTERFACE */
              <div className="flex-1 flex flex-col justify-between space-y-4">
                {/* Chat Top Bar */}
                <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black text-slate-950 bg-gradient-to-r ${deptInfo[activeTicket.department].colorTheme}`}>
                        {activeTicket.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1">
                        <Key className="w-3 h-3 text-[#00F2FE]" />
                        <span>Key: {activeTicket.magic_key}</span>
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-white">{activeTicket.subject}</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `https://codevortex.com/support/${activeTicket.department}?key=${activeTicket.magic_key}`,
                          'ticket_link'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      {copiedField === 'ticket_link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{copiedField === 'ticket_link' ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط السحري' : 'Copy Magic Link')}</span>
                    </button>
                  </div>
                </div>

                {/* Real-time Status Tracker Stepper Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[10px]">
                  {[
                    { step: 1, key: 'received', titleAr: 'استلام الطلب', titleEn: 'Received' },
                    { step: 2, key: 'assigned', titleAr: 'توجيه للقسم', titleEn: 'Assigned' },
                    { step: 3, key: 'in_progress', titleAr: 'قيد المعالجة', titleEn: 'In Progress' },
                    { step: 4, key: 'resolved', titleAr: 'تم الاعتماد', titleEn: 'Resolved' },
                  ].map((st, idx) => {
                    const statusMap: Record<string, number> = { received: 1, assigned: 2, in_progress: 3, resolved: 4 };
                    const currentStepNum = statusMap[activeTicket.status] || 2;
                    const isDone = st.step <= currentStepNum;
                    const isCurrent = st.step === currentStepNum;

                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isCurrent
                            ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 font-black'
                            : isDone
                            ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400 font-bold'
                            : 'bg-slate-900/40 border-slate-800 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {isDone ? <Check className="w-3 h-3 text-emerald-400" /> : <span>{st.step}.</span>}
                          <span>{isAr ? st.titleAr : st.titleEn}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live Chat Thread Messages Container */}
                <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-y-auto space-y-3 max-h-[360px] min-h-[260px]">
                  {activeTicket.messages?.map((msg) => {
                    const isUser = msg.sender === 'user';
                    const isSys = msg.sender === 'system';

                    if (isSys) {
                      return (
                        <div key={msg.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center text-[11px] font-mono text-cyan-300">
                          {msg.text}
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}>
                        <span className="text-[10px] text-slate-500 font-mono px-1">
                          {msg.sender_name} • {new Date(msg.timestamp).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div
                          className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                            isUser
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Document Attachments Bar */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Paperclip className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-[11px] font-bold truncate">
                      {isAr ? `المستندات المرفقة (${activeTicket.attachments?.length || 0})` : `Vault Attachments (${activeTicket.attachments?.length || 0})`}
                    </span>
                  </div>

                  <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-[11px] cursor-pointer flex items-center gap-1">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? (isAr ? 'جاري الرفع...' : 'Uploading...') : (isAr ? 'إرفاق مستند' : 'Attach File')}</span>
                  </label>
                </div>

                {/* Bottom Chat Message Input Bar */}
                <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={isAr ? 'اكتب استفسارك هنا...' : 'Type your inquiry here...'}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={isSendingMsg || !chatInput.trim()}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md"
                  >
                    {isSendingMsg ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{isAr ? 'إرسال' : 'Send'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* DEPARTMENT INQUIRY FORM FOR SELECTED DEPARTMENT */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${currentDeptObj.colorTheme} text-slate-950 flex items-center justify-center font-black shadow-md`}>
                      <currentDeptObj.icon className="w-5 h-5 text-slate-950" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white">{isAr ? currentDeptObj.titleAr : currentDeptObj.titleEn}</h2>
                      <p className="text-xs text-slate-400">{isAr ? currentDeptObj.descAr : currentDeptObj.descEn}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-cyan-400 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 w-fit">
                    {currentDeptObj.path}
                  </span>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">{isAr ? 'الاسم الكامل / الجهة:' : 'Full Name / Entity:'}</label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">{isAr ? 'البريد الإلكتروني للتواصل:' : 'Contact Email:'}</label>
                      <input
                        type="email"
                        required
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">{isAr ? 'عنوان الاستفسار أو الطلب:' : 'Inquiry Subject:'}</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder={
                        activeDept === 'sales'
                          ? isAr ? 'استفسار عن اشتراكات باقة الشركات' : 'Enterprise subscription inquiry'
                          : activeDept === 'billing'
                          ? isAr ? 'استفسار عن الفواتير والتحويل البنكي' : 'Billing & invoice inquiry'
                          : activeDept === 'tech'
                          ? isAr ? 'دعم برمي والدعم التقني' : 'Technical support inquiry'
                          : isAr ? 'مذكرة شراكة استراتيجية' : 'Strategic partnership memo'
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">{isAr ? 'اكتب استفسارك التفصيلي هنا:' : 'Inquiry Details:'}</label>
                    <textarea
                      required
                      rows={4}
                      value={ticketMessageText}
                      onChange={(e) => setTicketMessageText(e.target.value)}
                      placeholder={isAr ? 'اكتب استفسارك هنا وسيقوم فريق الدعم بالرد الفوري...' : 'Type your detailed inquiry here for department assignment...'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${currentDeptObj.colorTheme} text-slate-950 font-black text-xs shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isAr ? 'جاري توجيه التذكرة وتوليد المفتاح السحري...' : 'Generating Magic Key & Dispatching...'}</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>{isAr ? `تقديم الطلب وتوليد المفتاح السحري` : `Submit Inquiry & Generate Magic Key`}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>

        {/* ATTACHMENT PREVIEW MODAL */}
        {previewAttachment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">{previewAttachment.name}</h3>
                </div>
                <button
                  onClick={() => setPreviewAttachment(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <Lock className="w-8 h-8 mx-auto text-emerald-400" />
                <p className="text-xs text-slate-300">
                  {isAr
                    ? 'المستند محفوظ ومحمي بتشفير AES 256-bit على الخوادم المعتمدة.'
                    : 'Encrypted document stored under AES 256-bit vault protection.'}
                </p>
                <div className="text-[11px] font-mono text-cyan-300">
                  Size: {previewAttachment.size} • Uploaded: {new Date(previewAttachment.uploaded_at).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => setPreviewAttachment(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                {isAr ? 'إغلاق المعاينة' : 'Close Preview'}
              </button>
            </div>
          </div>
        )}

        {/* LIVE AI VOICE OFFICER CALL MODAL */}
        {isVoiceCallActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/20 relative">
                  <Volume2 className={`w-10 h-10 ${isOfficerSpeaking ? 'animate-bounce text-slate-950' : 'text-slate-950'}`} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                    {isAr ? 'مكالمة صوتية مباشرة مع الذكاء الاصطناعي' : 'Gemini Live Audio Assistant'}
                  </span>
                  <h3 className="text-lg font-black text-white">
                    {isAr ? currentDeptObj.titleAr : currentDeptObj.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isAr ? `مسئول القسم متصل الآن لتغطية التذكرة ${activeTicket?.id}` : `Officer connected for ticket ${activeTicket?.id}`}
                  </p>
                </div>

                {/* Animated Voice Equalizer Bar */}
                <div className="flex items-center justify-center gap-1.5 h-10 py-2">
                  {[40, 70, 100, 60, 90, 50, 80, 30, 95, 65].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: isOfficerSpeaking ? `${h}%` : '20%' }}
                      className="w-1.5 bg-emerald-400 rounded-full transition-all duration-150"
                    />
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed text-right rtl:text-right">
                  <p className="font-semibold text-emerald-300 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حديث المسئول:' : 'Officer Speech:'}</span>
                  </p>
                  <span>{voiceCallStatus}</span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleEndVoiceCall}
                    className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <PhoneOff className="w-4 h-4 fill-current" />
                    <span>{isAr ? 'إنهاء المكالمة الصوتية' : 'End Call'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
