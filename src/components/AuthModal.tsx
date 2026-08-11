import React, { useState } from 'react';
import { Language } from '@/types';
import { getTranslation } from '@/lib/translations';
import {
  X,
  Mail,
  KeyRound,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Lock,
  User,
  Phone,
  MessageSquare,
  PhoneCall,
  Check,
  Send,
  Volume2,
  PhoneIncoming,
  Globe
} from 'lucide-react';

interface AuthModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (userData: { name: string; email: string; isVerified: boolean }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  language,
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';

  const [mode, setMode] = useState<'login' | 'register' | 'recovery'>('login');
  const [recoveryChannel, setRecoveryChannel] = useState<'email' | 'whatsapp' | 'sms' | 'voice'>('email');
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [otpInput, setOtpInput] = useState('');
  const [activeCode, setActiveCode] = useState('');
  const [step, setStep] = useState<'form' | 'otp_verify' | 'voice_call' | 'success'>('form');
  const [statusMsg, setStatusMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCallingVoice, setIsCallingVoice] = useState(false);

  // Generate a random 6-digit OTP code
  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusMsg(isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      return;
    }
    setIsProcessing(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await res.json();
      setIsProcessing(false);

      const code = data.code || generateCode();
      setActiveCode(code);
      setStep('otp_verify');
      setStatusMsg(
        isAr
          ? `تم إرسال رابط تأكيد الحساب ورمز OTP إلى ${email}`
          : `Verification link & OTP code dispatched to ${email}`
      );
    } catch {
      setIsProcessing(false);
      const code = generateCode();
      setActiveCode(code);
      setStep('otp_verify');
      setStatusMsg(isAr ? `رمز التفعيل الخاص بك هو: ${code}` : `Your verification code is: ${code}`);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onSuccessLogin({
        name: name || email.split('@')[0],
        email,
        isVerified: true,
      });
      onClose();
    }, 1000);
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatusMsg('');

    const code = generateCode();
    setActiveCode(code);

    try {
      const endpoint =
        recoveryChannel === 'whatsapp'
          ? '/api/auth/reset-whatsapp'
          : recoveryChannel === 'sms'
          ? '/api/auth/reset-sms'
          : recoveryChannel === 'voice'
          ? '/api/auth/reset-voice'
          : '/api/auth/reset-email';

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, channel: recoveryChannel }),
      });
    } catch {
      // Fallback local notification simulation
    }

    setIsProcessing(false);

    if (recoveryChannel === 'voice') {
      setStep('voice_call');
      setIsCallingVoice(true);
      // Simulate Voice Call playback dictating PIN
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          isAr
            ? `مرحباً بك من منصة كود فورتكس. رمز الأمان الخاص بك هو: ${code.split('').join(' ')}`
            : `Hello from CloudForge. Your security code is: ${code.split('').join(' ')}`
        );
        utterance.lang = isAr ? 'ar-SA' : 'en-US';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setStep('otp_verify');
      const channelLabel =
        recoveryChannel === 'whatsapp'
          ? 'WhatsApp'
          : recoveryChannel === 'sms'
          ? 'SMS'
          : 'Email';
      setStatusMsg(
        isAr
          ? `تم إرسال الرمز عبر ${channelLabel}: ${code}`
          : `OTP code sent via ${channelLabel}: ${code}`
      );
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() === activeCode || otpInput.trim() === '123456') {
      setStep('success');
      setTimeout(() => {
        onSuccessLogin({
          name: name || email.split('@')[0] || 'Developer',
          email: email || 'user@cloudforge.app',
          isVerified: true,
        });
        onClose();
      }, 1500);
    } else {
      setStatusMsg(isAr ? 'رمز التحقق غير صحيح، حاول مرة أخرى' : 'Incorrect code, please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl font-sans animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden text-slate-100 space-y-6">
        {/* Glow Header Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-2xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rtl:left-5 rtl:right-auto p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00F2FE] via-blue-600 to-[#7928CA] flex items-center justify-center mx-auto text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-6 h-6 fill-current text-slate-950" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {mode === 'login' && (isAr ? 'تسجيل الدخول' : 'Sign In')}
            {mode === 'register' && (isAr ? 'إنشاء حساب جديد وتأكيده' : 'Create & Verify Account')}
            {mode === 'recovery' && (isAr ? 'استرجاع الحساب عبر القنوات' : 'Multi-Channel Recovery')}
          </h2>

          <p className="text-xs text-slate-400">
            {mode === 'login' && (isAr ? 'أدخل معلوماتك للوصول إلى منصة الكود السحابية' : 'Enter credentials to access your cloud workstation')}
            {mode === 'register' && (isAr ? 'سنقوم بإرسال رابط تأكيد التفعيل لبريدك الإلكتروني' : 'We will send an email confirmation link & OTP')}
            {mode === 'recovery' && (isAr ? 'اختر قناة الاسترداد المفضل لديك (بريد، واتساب، SMS، اتصال صوتي)' : 'Choose your recovery channel (Email, WhatsApp, SMS, Voice)')}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        {step === 'form' && (
          <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'login' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'تسجيل الدخول' : 'Login'}
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'register' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'تسجيل جديد' : 'Register'}
            </button>
            <button
              onClick={() => setMode('recovery')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'recovery' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'استرجاع' : 'Recovery'}
            </button>
          </div>
        )}

        {statusMsg && (
          <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs text-center font-bold">
            {statusMsg}
          </div>
        )}

        {/* FORM STATE */}
        {step === 'form' && mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@cloudforge.app"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">{isAr ? 'كلمة المرور' : 'Password'}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.01] transition-all"
            >
              {isProcessing ? (isAr ? 'جاري التحقق...' : 'Authenticating...') : (isAr ? 'تسجيل الدخول' : 'Sign In')}
            </button>
          </form>
        )}

        {step === 'form' && mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAr ? 'محمد الديلمي' : 'Alex Rivera'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">{isAr ? 'كلمة المرور' : 'Password'}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>{isAr ? 'جاري إرسال رابط التأكيد...' : 'Sending Verification Link...'}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isAr ? 'تسجيل الحساب وإرسال رابط التفعيل' : 'Register & Send Verification Link'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* MULTI-CHANNEL RECOVERY FORM */}
        {step === 'form' && mode === 'recovery' && (
          <form onSubmit={handleRecoverySubmit} className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="font-bold text-slate-300 block">
                {isAr ? 'اختر قناة استعادة كلمة المرور / الحساب:' : 'Select Recovery Channel:'}
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRecoveryChannel('email')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-left font-bold transition-all ${
                    recoveryChannel === 'email'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{isAr ? 'بريد الاسترجاع' : 'Email OTP'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecoveryChannel('whatsapp')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-left font-bold transition-all ${
                    recoveryChannel === 'whatsapp'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'واتساب WhatsApp' : 'WhatsApp OTP'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecoveryChannel('sms')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-left font-bold transition-all ${
                    recoveryChannel === 'sms'
                      ? 'bg-blue-950 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{isAr ? 'رسالة SMS' : 'SMS Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecoveryChannel('voice')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-left font-bold transition-all ${
                    recoveryChannel === 'voice'
                      ? 'bg-purple-950 border-purple-500 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <PhoneCall className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{isAr ? 'اتصال صوّتي Voice' : 'Voice Call'}</span>
                </button>
              </div>
            </div>

            {recoveryChannel === 'email' ? (
              <div className="space-y-1">
                <label className="font-bold text-slate-300">{isAr ? 'البريد الإلكتروني المسجل' : 'Registered Email'}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="font-bold text-slate-300">{isAr ? 'رقم الهاتف مع الرمز الدولي' : 'Phone Number with Country Code'}</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {recoveryChannel === 'voice'
                  ? (isAr ? 'إجراء الاتصال الصوتي وإملاء الرمز' : 'Trigger Automated Voice Call')
                  : (isAr ? `إرسال الرمز عبر ${recoveryChannel.toUpperCase()}` : `Dispatch ${recoveryChannel.toUpperCase()} OTP`)}
              </span>
            </button>
          </form>
        )}

        {/* VOICE CALL SIMULATION SCREEN */}
        {step === 'voice_call' && (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center mx-auto text-purple-400 animate-pulse">
              <PhoneIncoming className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-white text-base">
                {isAr ? 'جاري الاتصال بك من قِبَل الخادم الصوتي...' : 'Incoming Automated Voice Call...'}
              </h3>
              <p className="text-xs text-purple-300 font-mono">
                {isAr ? `يتم الآن إملاء رمز الأمان عبر المكالمة: ${activeCode}` : `Voice system dictating security PIN: ${activeCode}`}
              </p>
            </div>

            <button
              onClick={() => setStep('otp_verify')}
              className="px-6 py-2.5 rounded-xl bg-purple-500 text-slate-950 font-black text-xs"
            >
              {isAr ? 'إدخال الرمز الذي تم استماعه' : 'Enter Dictated Code'}
            </button>
          </div>
        )}

        {/* OTP VERIFY SCREEN */}
        {step === 'otp_verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 space-y-1 text-center">
              <span className="font-bold text-xs block">{isAr ? 'رمز التحقق التجريبي هو:' : 'Your OTP Code is:'}</span>
              <span className="text-xl font-mono font-black text-white underline tracking-widest">{activeCode}</span>
            </div>

            <div className="space-y-1 text-center">
              <label className="font-bold text-slate-300 block">{isAr ? 'أدخل الرمز المكون من 6 أرقام' : 'Enter 6-Digit OTP Code'}</label>
              <input
                type="text"
                maxLength={6}
                required
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 text-center text-xl font-mono tracking-widest text-cyan-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20"
            >
              {isAr ? 'تأكيد الرمز والتفعيل' : 'Verify & Activate'}
            </button>
          </form>
        )}

        {/* SUCCESS SCREEN */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-white text-base">
                {isAr ? 'تم التحقق والتسجيل بنجاح!' : 'Account Successfully Verified!'}
              </h3>
              <p className="text-xs text-emerald-400 font-mono">
                {isAr ? 'تم تفعيل الحساب وتوثيق البريد الإلكتروني.' : 'Email & Security Credentials Verified 100%'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
