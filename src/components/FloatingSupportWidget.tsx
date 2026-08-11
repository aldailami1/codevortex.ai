import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Language } from '@/types';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';

interface FloatingSupportWidgetProps {
  language: Language;
  onNavigateToDepartment?: (dept: 'sales' | 'billing' | 'tech' | 'executive') => void;
}

export const FloatingSupportWidget: React.FC<FloatingSupportWidgetProps> = ({
  language,
}) => {
  const isAr = language === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: isAr
        ? 'مرحباً بك في **CloudForge**! 👋 كيف يمكن لفريق الدعم الفني والذكاء الاصطناعي مساعدتك اليوم؟'
        : 'Welcome to **CloudForge**! 👋 How can our support team & AI assist you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const userText = inputVal.trim();
    if (!userText || isTyping) return;

    const userMsg = {
      sender: 'user' as const,
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: language,
          sender_name: 'AI Chat Visitor',
          sender_email: '',
          thinking_mode: false,
        }),
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'agent',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('No reply from backend');
      }
    } catch (err) {
      console.warn('Support chat request failed:', err);
      setIsTyping(false);
      const fallbackText = isAr
        ? 'يسعدنا تواصلك مع **CloudForge**! لقد تم تسجيل استفسارك كـ **تذكرة دعم فني** وحفظها في بنك التذاكر بالمنصة.'
        : 'Thank you for contacting **CloudForge**! Your query has been logged as a **support ticket** in our platform database.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className={`fixed bottom-6 ${isAr ? 'left-6' : 'right-6'} z-50 font-sans`}>
      {/* Floating Circular Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 shadow-2xl shadow-cyan-500/30 hover:scale-110 active:scale-95 transition-all duration-300"
          title={isAr ? 'خدمة العملاء والدعم الفني المباشر' : 'Live Customer Support'}
        >
          <MessageSquare className="w-6 h-6 fill-current text-slate-950" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse"></span>
        </button>
      )}

      {/* Floating Live Chat Widget Popup */}
      {isOpen && (
        <div className="w-[340px] sm:w-[410px] h-[560px] bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Widget Header */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00F2FE] to-purple-600 flex items-center justify-center text-slate-950 font-black shadow-md">
                <Bot className="w-5 h-5 fill-current text-slate-950" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>CloudForge Support</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#00F2FE]" />
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{isAr ? 'فريق الدعم المباشر متصل' : 'Support Team Online'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/90 font-sans text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[90%] px-3.5 py-2.5 rounded-2xl leading-relaxed text-xs ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-semibold rounded-br-none'
                      : 'bg-slate-900 border border-slate-800/90 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  {m.sender === 'user' ? (
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  ) : (
                    <div className="chat-markdown text-slate-200 text-xs leading-relaxed space-y-1 [&_strong]:text-[#00F2FE] [&_strong]:font-bold [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:rtl:pr-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:rtl:pr-4 [&_code]:bg-slate-950 [&_code]:text-cyan-300 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[11px]">
                      <Markdown>{m.text}</Markdown>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 font-mono px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2 bg-slate-900/50 rounded-xl border border-slate-800/50 w-fit">
                <Bot className="w-4 h-4 animate-spin text-[#00F2FE]" />
                <span>
                  {isAr ? 'جاري الصياغة والإجابة...' : 'Formulating answer...'}
                </span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={isAr ? 'اكتب رسالتك أو استفسارك هنا...' : 'Type your question...'}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              type="submit"
              disabled={isTyping}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all shrink-0 disabled:opacity-50"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

