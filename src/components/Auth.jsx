import React, { useState } from 'react';
import { Mail, Lock, Key, Shield, Sparkles, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';

export function Auth({ onAuthenticated, isRTL = false }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('pro');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'login' || mode === 'register') {
        const res = await fetch('/api/db/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: fullName || email.split('@')[0] })
        });
        const data = await res.json();
        if (data.success) {
          setMode('otp');
          setMessage({
            type: 'info',
            text: data.otp_code
              ? `رمز التحقق المزدوج OTP: ${data.otp_code}`
              : 'تم ارسال كود التحقق الى بريدك الإلكتروني بنجاح.'
          });
        } else {
          throw new Error(data.error || 'فشل في العملية');
        }
      } else if (mode === 'otp') {
        const res = await fetch('/api/db/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp_code: otpCode })
        });
        const data = await res.json();
        if (data.success) {
          setMessage({ type: 'success', text: 'تم تسجيل الدخول بنجاح! جاري التوجيه...' });
          setTimeout(() => {
            if (onAuthenticated) onAuthenticated(data.user);
          }, 800);
        } else {
          throw new Error(data.error || 'رمز OTP غير صحيح');
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'حدث خطأ غير متوقع' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto p-6 md:p-8 bg-[#0F172A] border border-slate-800 rounded-3xl shadow-2xl text-slate-100 ${isRTL ? 'dir-rtl' : 'dir-ltr'}`}>
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#00F2FE] to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20 mb-2">
          <Shield className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-black text-white">
          CloudForge Auth & Supabase RLS
        </h2>
        <p className="text-xs text-slate-400">
          تسجيل الدخول الآمن وإدارة الهوية الرقمية لمنصة CloudForge
        </p>
      </div>

      {message && (
        <div className={`p-3.5 rounded-2xl text-xs font-bold mb-4 flex items-center gap-2 ${
          message.type === 'error' ? 'bg-red-950/80 border border-red-800 text-red-300' :
          message.type === 'success' ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300' :
          'bg-cyan-950/80 border border-cyan-800 text-cyan-300'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">الاسم الكامل</label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="محمد علي"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        )}

        {mode !== 'otp' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@cloudforge.io"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </>
        )}

        {mode === 'register' && (
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">خطة الحساب (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="free">Free Pioneer</option>
              <option value="pro">Pro Architect ($20/mo)</option>
              <option value="enterprise">Enterprise Sovereign</option>
            </select>
          </div>
        )}

        {mode === 'otp' && (
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">رمز كود التحقق OTP (6 أرقام)</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="123456"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center font-mono text-lg tracking-widest text-cyan-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-black text-xs shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? 'جاري التحقق...' : mode === 'otp' ? 'تأكيد الدخول' : mode === 'register' ? 'إنشاء حساب CloudForge' : 'تسجيل الدخول'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-between">
        {mode === 'login' ? (
          <button onClick={() => setMode('register')} className="text-cyan-400 hover:underline">
            حساب جديد؟ انضم الآن
          </button>
        ) : (
          <button onClick={() => setMode('login')} className="text-cyan-400 hover:underline">
            لديك حساب بالفعل؟ سجل دخولك
          </button>
        )}
        <span className="text-[10px] text-slate-500 font-mono">Supabase Auth Integrated</span>
      </div>
    </div>
  );
}
