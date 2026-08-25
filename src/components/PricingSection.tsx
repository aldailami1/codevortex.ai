import React, { useState } from 'react';
import { BillingProduct, Language, ViewMode } from '@/types';
import { CheckoutModal } from './CheckoutModal';
import {
  Check,
  Zap,
  Sparkles,
  Rocket,
  ShieldCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';

interface PricingSectionProps {
  language: Language;
  onSelectView: (view: ViewMode) => void;
  onOpenDeployModal?: () => void;
  onUpgradeSuccess?: (plan: BillingProduct) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  language,
  onSelectView,
  onOpenDeployModal,
  onUpgradeSuccess,
}) => {
  const isAr = language === 'ar';
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BillingProduct>('pro');

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleOpenProCheckout = () => {
    setSelectedPlan('pro');
    setIsCheckoutOpen(true);
  };

  const handleOpenEnterpriseContact = () => {
    setSelectedPlan('enterprise');
    setIsCheckoutOpen(true);
  };

  const handleOpenAdProduct = (product: Extract<BillingProduct, 'ad-engine' | 'ad-starter' | 'ad-growth' | 'ad-scale'>) => {
    setSelectedPlan(product);
    setIsCheckoutOpen(true);
  };

  const handlePaymentCompleted = (plan: BillingProduct) => {
    if (onUpgradeSuccess) {
      onUpgradeSuccess(plan);
    } else {
      localStorage.setItem('cloudforge_user_plan', plan);
    }
    onSelectView('dashboard');
  };

  const faqs = [
    {
      qAr: 'هل يمكنني الترقية أو إلغاء الاشتراك في أي وقت؟',
      qEn: 'Can I upgrade or cancel my subscription at any time?',
      aAr: 'نعم، يمكنك تعديل باقتك أو إلغائها فوراً من لوحة التحكم دون أي رسوم إضافية.',
      aEn: 'Yes, you can manage, upgrade, or cancel your subscription anytime directly from your dashboard.',
    },
    {
      qAr: 'ما الفرق بين المشاريع العامة والخاصة (Private Repls)؟',
      qEn: 'What is the difference between Public and Private Repls?',
      aAr: 'المشاريع العامة يتاح كودها للجميع في مجتمع المطورين، بينما المشاريع الخاصة تكون محمية ومخصصة لك أو لفريقك فقط.',
      aEn: 'Public projects are visible to the open-source community, while Private Repls keep your source code secured.',
    },
    {
      qAr: 'كيف يعمل وكيل الذكاء الاصطناعي CloudForge AI Agent؟',
      qEn: 'How does the CloudForge AI Agent work?',
      aAr: 'يقوم الوكيل بتحليل طلبك النصي، إنشاء الهيكل والملفات، تنفيذ حزم NPM، وتصحيح الأخطاء تلقائياً على خوادم Cloud Run.',
      aEn: 'The agent parses your natural language prompts, creates files, executes NPM packages, and fixes runtime bugs live.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-16 px-4 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-black">
            <Sparkles className="w-4 h-4 text-[#00F2FE]" />
            <span>{isAr ? 'خطط أسعار بسيطة وشفافة' : 'Simple & Transparent Pricing'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white">
            {isAr ? 'اختر الباقة المناسبة لطموحك البرمجي' : 'Choose the Perfect Plan for Your Software'}
          </h1>

          <p className="text-slate-400 text-sm sm:text-base">
            {isAr
              ? 'ابدأ مجاناً للتجربة وبناء المشاريع العامة، أو ارتقِ إلى باقة المطورين والمؤسسات للحصول على موارد حوسبة فائقة السرعة.'
              : 'Start free for learning & open-source projects, or upgrade to Pro & Enterprise for dedicated compute resources.'}
          </p>

          {/* Monthly / Yearly Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-4">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              {isAr ? 'دفع شهري' : 'Monthly Billing'}
            </span>

            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 rounded-full bg-slate-900 border border-slate-800 p-1 flex items-center transition-all relative"
            >
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-r from-[#00F2FE] to-blue-600 transition-all ${
                  billingCycle === 'yearly' ? (isAr ? '-translate-x-6' : 'translate-x-6') : ''
                }`}
              />
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                {isAr ? 'دفع سنوي' : 'Yearly Billing'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-black">
                {isAr ? 'خصم 20%' : 'Save 20%'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* Card 1: Free Hobby Plan */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
                  {isAr ? 'الباقة المجانية (Hobby)' : 'Hobby / Free Plan'}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-slate-500 text-xs">/{isAr ? 'شهرياً' : 'month'}</span>
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  {isAr ? 'مناسبة للتعلم وبناء المشاريع البرمجية البسيطة والمفتوحة المصدر' : 'Best for learning, experimenting, and building public open-source projects'}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'مشاريع عامة غير محدودة (Public Repls)' : 'Unlimited Public Repls'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'موارد حوسبة أساسية (512 MB RAM)' : 'Basic Compute (512 MB RAM)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'وصول أساسي لوكيل الذكاء الاصطناعي' : 'Standard AI Agent access'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'استضافة مجانية على subdomain' : 'Free hosting on subdomains'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectView('dashboard')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
            >
              {isAr ? 'البدء مجاناً الآن' : 'Start Free Now'}
            </button>
          </div>

          {/* Card 2: Pro Developer Plan (Featured) */}
          <div className="bg-slate-900 border-2 border-cyan-500 rounded-3xl p-6 space-y-6 flex flex-col justify-between shadow-2xl shadow-cyan-500/15 relative hover:scale-105 transition-all">
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
              {isAr ? 'الأكثر شعبية للمطورين' : 'MOST POPULAR FOR DEVS'}
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-extrabold">
                  {isAr ? 'باقة المطورين (Pro)' : 'Pro Developer Plan'}
                </span>
                <Sparkles className="w-5 h-5 text-[#00F2FE]" />
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === 'yearly' ? '$16' : '$20'}
                  </span>
                  <span className="text-slate-400 text-xs">/{isAr ? 'شهرياً' : 'month'}</span>
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  {isAr ? 'للمطورين المستقلين ورواد الأعمال الراغبين في حماية أكوادهم وموارد فائقة' : 'For independent developers & founders needing private code & high-speed AI'}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-bold">{isAr ? 'مشاريع خاصة غير محدودة (Private Repls)' : 'Unlimited Private Repls'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{isAr ? 'موارد حوسبة مضاعفة (4 GB RAM + Boost CPU)' : 'Boosted Compute (4 GB RAM + CPU)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{isAr ? 'وصول موسع وغير محدود للوكيل الذكي v5' : 'Unlimited CloudForge AI Agent v5'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{isAr ? 'ربط دومين خاص (Custom Domain & SSL)' : 'Custom Domain & SSL certificate'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{isAr ? 'أولوية القصوى في سرعة البناء والنشر' : 'Priority build queues & zero delay'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenProCheckout}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F2FE] via-blue-600 to-[#7928CA] text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 hover:scale-102 transition-all cursor-pointer"
            >
              {isAr ? 'الترقية لباقتك الاحترافية (Pro)' : 'Upgrade to Pro Now'}
            </button>
          </div>

          {/* Card 3: Teams & Enterprise Plan */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 rounded-xl bg-purple-950 border border-purple-800 text-purple-400 text-xs font-bold">
                  {isAr ? 'المؤسسات والفرق (Enterprise)' : 'Teams / Enterprise'}
                </span>
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{isAr ? 'مخصص' : 'Custom'}</span>
                  <span className="text-slate-500 text-xs">/{isAr ? 'مستخدم / شهرياً' : 'seat / month'}</span>
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  {isAr ? 'للشركات والفرق البرمجية التي تتطلب بيئة عمل تعاونية وصلاحيات متقدمة' : 'For engineering teams requiring team workspaces, SOC 2 compliance & SSO'}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{isAr ? 'مساحات عمل تعاونية آمنة للفرق' : 'Collaborative Shared Workspaces'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{isAr ? 'صلاحيات إدارية متقدمة (RBAC)' : 'Advanced RBAC & Admin Security'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{isAr ? 'دعم فني أولوية 24/7 ودليل مخصص' : '24/7 Dedicated Support & SLA'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{isAr ? 'التوافق التام مع معايير SOC 2' : 'SOC 2 Type II Security Compliance'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenEnterpriseContact}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
            >
              {isAr ? 'التواصل مع مبيعات الشركات' : 'Contact Enterprise Sales'}
            </button>
          </div>

          {/* Card 4: Ad-Engine Tier */}
          <div className="bg-gradient-to-b from-amber-950/40 to-slate-900/90 border border-amber-500/30 rounded-3xl p-6 space-y-6 flex flex-col justify-between hover:border-amber-400/70 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between"><span className="px-3 py-1 rounded-xl bg-amber-950 border border-amber-800 text-amber-300 text-xs font-bold">{isAr ? 'محرك الإعلانات' : 'Ad-Engine Tier'}</span><Rocket className="w-5 h-5 text-amber-300" /></div>
              <div><div className="flex items-baseline gap-1"><span className="text-4xl font-black text-white">{isAr ? 'رصيد' : 'Credit'}</span><span className="text-slate-500 text-xs">/{isAr ? 'حسب الاستخدام' : 'usage based'}</span></div><p className="text-slate-400 text-xs mt-2">{isAr ? 'شحن أرصدة الحملات وإدارة المسودات والتقارير ضمن مساحة تسويق مستقلة.' : 'Fund campaign credits and manage drafts and reporting in a dedicated marketing workspace.'}</p></div>
              <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300"><div className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-300 shrink-0" /><span>{isAr ? 'دعم الحملات عبر Meta وGoogle وTikTok' : 'Meta, Google, and TikTok campaign support'}</span></div><div className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-300 shrink-0" /><span>{isAr ? 'مسودات نص وتصميم بالذكاء الاصطناعي' : 'AI-assisted copy and creative drafts'}</span></div><div className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-300 shrink-0" /><span>{isAr ? 'تقارير وتحسين بعد الموافقة' : 'Reporting and optimization after approval'}</span></div></div>
            </div>
            <button onClick={() => handleOpenAdProduct('ad-engine')} className="w-full py-3 rounded-xl bg-amber-300 hover:bg-amber-200 text-slate-950 font-black text-xs transition-all">{isAr ? 'فتح باقة الإعلانات' : 'Open Ad-Engine'}</button>
          </div>
        </div>

        {/* Standalone Marketing & Ad Packs */}
        <section className="space-y-5 rounded-3xl border border-amber-500/20 bg-amber-950/10 p-5 sm:p-7">
          <div><p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">{isAr ? 'باقات مستقلة' : 'Standalone Ad Packs'}</p><h2 className="mt-2 text-2xl font-black text-white">{isAr ? 'حوّل الرصيد إلى حملة واضحة المراحل' : 'Turn campaign credit into a clear growth workflow'}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{isAr ? 'الأسعار التالية لشحن الرصيد فقط؛ ميزانية الوسائط الخارجية وأي شراء إعلاني يعتمدان على المزوّد والموافقة.' : 'These prices fund the CloudForge workflow only; external media spend and purchases depend on provider approval.'}</p></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { product: 'ad-starter' as const, price: '$10', nameEn: 'Starter Ad Pack', nameAr: 'باقة الانطلاق والتجربة', descEn: 'One campaign draft, AI copy and creative handoff.', descAr: 'مسودة حملة واحدة مع نص وتصميم بالذكاء الاصطناعي.' },
              { product: 'ad-growth' as const, price: '$25', nameEn: 'Growth Marketing Pack', nameAr: 'باقة النمو المتسارع', descEn: 'Multi-channel workflow and daily reporting setup.', descAr: 'تدفق متعدد القنوات وتجهيز تقارير يومية.' },
              { product: 'ad-scale' as const, price: '$50+', nameEn: 'Scale & Dominate Pack', nameAr: 'باقة الهيمنة والتوسع', descEn: 'Full-funnel planning, A/B test drafts and team guidance.', descAr: 'استراتيجية Full Funnel ومسودات A/B ومرافقة الفريق.' },
            ].map((pack) => <div key={pack.product} className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-5"><div><div className="flex items-center justify-between"><h3 className="font-black text-white">{isAr ? pack.nameAr : pack.nameEn}</h3><span className="text-xl font-black text-amber-300">{pack.price}</span></div><p className="mt-3 text-xs leading-6 text-slate-400">{isAr ? pack.descAr : pack.descEn}</p><p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-emerald-300">{isAr ? '100% من الرصيد للتدفق' : '100% of credit funds the workflow'}</p></div><button onClick={() => handleOpenAdProduct(pack.product)} className="mt-5 min-h-11 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-black text-amber-200 hover:bg-amber-400/20">{isAr ? 'شراء الباقة' : 'Buy pack'}</button></div>)}
          </div>
        </section>

        {/* FAQ Section */}
        <div className="pt-12 border-t border-slate-800/80 space-y-6 max-w-3xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>{isAr ? 'الأسئلة الشائعة حول الاشتراكات' : 'Frequently Asked Questions'}</span>
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-200 hover:text-white"
                >
                  <span>{isAr ? faq.qAr : faq.qEn}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-slate-400 text-xs border-t border-slate-800/60 leading-relaxed">
                    {isAr ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout Sandbox & Sales Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        language={language}
        planType={selectedPlan}
        billingCycle={billingCycle}
        onPaymentSuccess={handlePaymentCompleted}
      />
    </div>
  );
};
