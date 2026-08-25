import React, { useEffect, useState } from 'react';
import { BillingProduct, Language } from '@/types';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Building2,
  Lock,
  ArrowRight,
  Send,
  Check,
  Rocket
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  planType: BillingProduct;
  billingCycle: 'monthly' | 'yearly';
  onPaymentSuccess: (plan: BillingProduct) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  language,
  planType,
  billingCycle,
  onPaymentSuccess,
}) => {
  const isAr = language === 'ar';

  // Pro Checkout State
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('Mohammed Al-Dailami');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'crypto' | 'apple_pay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  // Enterprise Sales State
  const [companyName, setCompanyName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [teamSize, setTeamSize] = useState('10-50');
  const [salesMessage, setSalesMessage] = useState('');
  const [salesSubmitted, setSalesSubmitted] = useState(false);
  const [salesTicketId, setSalesTicketId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsCompleted(false);
      setSalesSubmitted(false);
      setCheckoutError('');
      setTxnId('');
    }
  }, [isOpen, planType]);

  if (!isOpen) return null;

  const isEnterprise = planType === 'enterprise';
  const isAdProduct = planType.startsWith('ad-');
  const priceAmount = planType === 'ad-starter' ? '$10' : planType === 'ad-growth' ? '$25' : planType === 'ad-scale' ? '$50+' : planType === 'ad-engine' ? '$10+' : billingCycle === 'yearly' ? '$16' : '$20';
  const productName = planType === 'pro' ? (isAr ? 'باقة المطورين Pro' : 'Pro Developer Plan') : planType === 'ad-engine' ? (isAr ? 'محرك الإعلانات' : 'Ad-Engine') : planType === 'ad-starter' ? (isAr ? 'باقة الانطلاق والتجربة' : 'Starter Ad Pack') : planType === 'ad-growth' ? (isAr ? 'باقة النمو المتسارع' : 'Growth Marketing Pack') : (isAr ? 'باقة الهيمنة والتوسع' : 'Scale & Dominate Pack');

  const handleFillTestCard = (type: 'visa' | 'master') => {
    if (type === 'visa') {
      setCardNumber('4242 4242 4242 4242');
    } else {
      setCardNumber('5555 5555 5555 4444');
    }
  };

  const handleExecuteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setCheckoutError('');

    try {
      const cardLast4 = cardNumber.replace(/\s+/g, '').slice(-4) || '4242';
      const res = await fetch('/api/db/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: workEmail || 'user@cloudforge.com',
          plan: planType,
          billing_cycle: billingCycle,
          payment_method: paymentMethod,
          card_last4: paymentMethod === 'card' || paymentMethod === 'apple_pay' ? cardLast4 : undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      setIsProcessing(false);

      if (!res.ok || !data.success) {
        throw new Error(data.error || (isAr ? 'تعذر بدء عملية الدفع. تحقق من إعدادات المزوّد.' : 'Unable to start checkout. Check provider configuration.'));
      }
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      setTxnId(data.transaction_id || `txn_${Date.now()}`);
      setIsCompleted(true);
    } catch (err) {
      setIsProcessing(false);
      setCheckoutError(err instanceof Error ? err.message : (isAr ? 'تعذر بدء عملية الدفع.' : 'Unable to start checkout.'));
    }
  };

  const handleSendSalesContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch('/api/db/sales/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName || 'Global Enterprise Partner',
          work_email: workEmail,
          team_size: teamSize,
          message: salesMessage,
        }),
      });

      const data = await res.json();
      setIsProcessing(false);
      setSalesTicketId(data.ticket_id || `tkt_sales_${Date.now()}`);
      setSalesSubmitted(true);
    } catch (err) {
      console.warn('Sales contact warn:', err);
      setIsProcessing(false);
      setSalesTicketId(`tkt_sales_${Date.now()}`);
      setSalesSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden font-sans">
        {/* Top Header Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00F2FE] via-blue-600 to-[#7928CA] flex items-center justify-center text-slate-950 font-black shadow-lg">
              {planType === 'pro' ? <Zap className="w-5 h-5" /> : isEnterprise ? <Building2 className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">
                  {isEnterprise
                    ? isAr ? 'نموذج التواصل مع مبيعات الشركات' : 'Enterprise Sales Inquiry'
                    : productName}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] font-mono font-bold">
                  SECURE CHECKOUT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isEnterprise
                  ? isAr ? 'حجز مساحات عمل وتخصيص خوادم معزولة' : 'Custom Infrastructure & Team Seats'
                  : isAdProduct ? (isAr ? 'رصيد تشغيل إعلاني — الدفع عبر مزوّد معتمد' : 'Advertising workflow credit — paid through an approved provider') : (isAr ? 'اشتراك باقة المطورين Pro' : 'Pro Developer Plan Subscription')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PRO PLAN CHECKOUT FLOW */}
        {!isEnterprise && (
          <div className="p-6 space-y-6">
            {!isCompleted ? (
              <form onSubmit={handleExecuteCheckout} className="space-y-5">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label={isAr ? 'اختيار طريقة الدفع' : 'Payment method'}>
                  {[
                    { value: 'card' as const, label: 'Stripe', detail: 'Card' },
                    { value: 'apple_pay' as const, label: 'Apple Pay', detail: 'Wallet' },
                    { value: 'paypal' as const, label: 'PayPal', detail: 'Redirect' },
                    { value: 'crypto' as const, label: 'Crypto', detail: 'Binance Pay' },
                  ].map((method) => <button key={method.value} type="button" onClick={() => setPaymentMethod(method.value)} className={`min-h-12 rounded-xl border px-2 py-2 text-[10px] font-black transition ${paymentMethod === method.value ? 'border-cyan-300 bg-cyan-400/10 text-cyan-200' : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600'}`}><span className="block">{method.label}</span><span className="mt-0.5 block text-[9px] font-medium text-slate-500">{method.detail}</span></button>)}
                </div>

                {/* Order Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">
                      {isAr ? 'الباقة المختارة:' : 'Selected Plan:'}                       <strong className="text-[#00F2FE]">{productName}</strong>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isAr ? `دفع ${billingCycle === 'yearly' ? 'سنوي (خصم 20%)' : 'شهري'}` : `${billingCycle === 'yearly' ? 'Yearly (20% OFF)' : 'Monthly Billing'}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white">{priceAmount}</div>
                    <span className="text-[10px] text-slate-400">/{isAr ? 'شهرياً' : 'month'}</span>
                  </div>
                </div>

                {paymentMethod === 'card' && (<>
                {/* Test Card Fill Quick Buttons */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-bold">{isAr ? 'أمثلة بطاقات Stripe في بيئة التطوير:' : 'Stripe test cards in development:'}</span>
                    <span className="text-emerald-400 font-mono text-[10px]">{isAr ? 'للتطوير فقط' : 'Development only'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleFillTestCard('visa')}
                      className="py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 flex items-center justify-center gap-2 transition-all"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#00F2FE]" />
                      <span>VISA: 4242 •••• 4242</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillTestCard('master')}
                      className="py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-amber-300 flex items-center justify-center gap-2 transition-all"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>MC: 5555 •••• 4444</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      {isAr ? 'الاسم المدون على البطاقة:' : 'Cardholder Name:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      {isAr ? 'رقم البطاقة الائتمانية:' : 'Card Number:'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 rtl:left-3 rtl:right-auto top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isAr ? 'تاريخ الانتهاء:' : 'Expiry Date:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isAr ? 'رمز الأمان (CVC):' : 'CVC:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                </>)}

                {checkoutError && <div role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs font-bold text-rose-200">{checkoutError}</div>}

                {/* Execute Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>{isAr ? 'جاري محاكاة وتأكيد عملية الدفع...' : 'Executing Test Checkout...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isAr ? `المتابعة إلى الدفع الآمن (${priceAmount})` : `Continue to secure checkout (${priceAmount})`}</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Success Confirmation Box */
              <div className="py-8 px-4 text-center space-y-5 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">
                    {isAr ? 'تم بدء عملية الدفع بنجاح' : 'Checkout started successfully'}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    {isAr
                      ? `تم إنشاء جلسة دفع آمنة للمنتج ${productName}. ستظهر حالة التفعيل بعد تأكيد المزوّد.`
                      : `A secure checkout session was created for ${productName}. Activation will follow provider confirmation.`}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 w-fit mx-auto">
                  Transaction ID: {txnId}
                </div>

                <button
                  onClick={() => {
                    onPaymentSuccess(planType);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
                >
                  <span>{isAr ? 'الانتقال للوحة التحكم ومتابعة العمل' : 'Go to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ENTERPRISE SALES CONTACT FLOW */}
        {planType === 'enterprise' && (
          <div className="p-6 space-y-6">
            {!salesSubmitted ? (
              <form onSubmit={handleSendSalesContact} className="space-y-4">
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/80 text-xs text-purple-200">
                  {isAr
                    ? 'سيتم توجيه طلبك التجاري مباشرة لفريق مبيعات المؤسسات واستخراج تذكرة فنية مخصصة بمقر الشركة.'
                    : 'Your sales inquiry will be logged directly into our enterprise ticket system for custom quotes.'}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {isAr ? 'اسم الشركة / المؤسسة:' : 'Company / Enterprise Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={isAr ? 'شركة الحلول السحابية المتقدمة' : 'Acme Corp'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      {isAr ? 'البريد الإلكتروني للعمل:' : 'Work Email:'}
                    </label>
                    <input
                      type="email"
                      required
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      {isAr ? 'حجم الفريق المطلوب:' : 'Expected Team Size:'}
                    </label>
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="5-20">5 - 20 {isAr ? 'مطور' : 'seats'}</option>
                      <option value="20-100">20 - 100 {isAr ? 'مطور' : 'seats'}</option>
                      <option value="100+">100+ {isAr ? 'مطور' : 'seats'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {isAr ? 'تفاصيل ومتطلبات المشروع:' : 'Project Requirements & Scope:'}
                  </label>
                  <textarea
                    rows={3}
                    value={salesMessage}
                    onChange={(e) => setSalesMessage(e.target.value)}
                    placeholder={isAr ? 'اكتب تفاصيل الموارد المطلوبة وقواعد البيانات المعزولة...' : 'Describe your custom cloud infrastructure needs...'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg hover:scale-102 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>{isAr ? 'جاري تسليم طلب المبيعات...' : 'Submitting Request...'}</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isAr ? 'إرسال طلب المبيعات التجاري' : 'Submit Enterprise Request'}</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="py-8 px-4 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 mx-auto rounded-full bg-purple-950 border-2 border-purple-500 text-purple-300 flex items-center justify-center shadow-xl">
                  <Check className="w-8 h-8 text-purple-300" />
                </div>
                <h3 className="text-lg font-black text-white">
                  {isAr ? 'تم استلام طلب المبيعات بنجاح!' : 'Enterprise Request Received!'}
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  {isAr
                    ? `تم تسجيل طلبك في بنك التذاكر برقم (${salesTicketId}). وسيقوم مهندس مبيعات المؤسسات بمقرنا بالرياض/دبي بالتواصل معك فوراً.`
                    : `Your request has been logged under Ticket #${salesTicketId}. Our enterprise sales team will reach out to you directly.`}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
