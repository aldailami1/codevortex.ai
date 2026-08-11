import React, { useState } from 'react';
import { ChatMessage, Language, Project } from '@/types';
import {
  MessageSquareCode,
  Send,
  Bot,
  User,
  Sparkles,
  Code2,
  CheckCircle2,
  Copy,
  PlusCircle
} from 'lucide-react';

interface AIChatAssistantProps {
  project: Project;
  language: Language;
  onApplyCodeEdit: (prompt: string) => void;
  isProcessing: boolean;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  project,
  language,
  onApplyCodeEdit,
  isProcessing,
}) => {
  const isAr = language === 'ar';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: isAr
        ? `أهلاً بك! أنا مساعدك البرمجي المباشر في منصة CloudForge REPL IDE. يمكنك سؤالي عن إضافة ميزات جديدة، تعديل التصاميم، كود الجافاسكربت أو إصلاح الأخطاء.`
        : `Welcome! I am your CloudForge AI Co-Pilot. Ask me to refactor code, add new features, fix layout bugs, or write custom JavaScript.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputPrompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const promptToTrigger = inputPrompt.trim();
    setInputPrompt('');

    // Trigger AI code refinement
    onApplyCodeEdit(promptToTrigger);

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: isAr
          ? `تم تنفيذ طلبك بنجاح! لقد قمت بتحديث أكواد المشروع لتطبيق: "${promptToTrigger}". يمكنك معاينة النتيجة في شاشة مساحة العمل والملاحظة التفاعلية.`
          : `Your request was applied! I updated the project code to fulfill: "${promptToTrigger}". Check out the live interactive preview tab.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1200);
  };

  const sampleQuestions = isAr
    ? [
        'أضف قسم لشهادات وآراء العملاء (Testimonials)',
        'اجعل خلفية العناوين متدرجة بالألوان (Gradient text)',
        'أضف نمط الليل/النهار التفاعلي (Dark/Light Mode)',
        'أضف خريطة تفاعلية وقسم التواصل السريع',
      ]
    : [
        'Add a Testimonials carousel slider section',
        'Make the hero section title use animated gradient text',
        'Add an interactive FAQ accordions block',
        'Add interactive contact map and fast booking',
      ];

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <span>{isAr ? 'المساعد البرمجي المباشر' : 'CloudForge AI Co-Pilot'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[10px] text-slate-400">
              {isAr ? 'متصل بالمحرك العصري CloudForge AST Engine v5' : 'Connected to CloudForge AST & Neural Engine v5.0'}
            </p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-sm">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isAi ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'bg-slate-800 text-slate-200'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 shadow-lg ${
                  isAi
                    ? 'bg-slate-900 border border-slate-800 text-slate-200'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium'
                }`}
              >
                <p>{msg.text}</p>
                <span className="block text-[10px] text-slate-400 text-right opacity-70">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs text-cyan-400 animate-pulse">
              {isAr ? 'جاري كتابة الأكواد وتعديل الملفات...' : 'CloudForge AI is writing code and applying changes...'}
            </div>
          </div>
        )}
      </div>

      {/* Suggested Chips */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-500 text-[11px] font-semibold shrink-0">
          {isAr ? 'اقترحات سريعة:' : 'Quick prompts:'}
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => setInputPrompt(q)}
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 shrink-0 transition-all text-[11px]"
          >
            + {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800/80 flex gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={
            isAr
              ? 'اطلب تعديلاً أو ميزة جديدة في الكود (مثال: أضف زر شات واتساب)...'
              : 'Ask AI to add or modify components (e.g. Add a WhatsApp chat button)...'
          }
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isProcessing}
          className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            !inputPrompt.trim() || isProcessing
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
          }`}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{isAr ? 'إرسال' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};
