'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Database,
  ExternalLink,
  Globe2,
  Layers3,
  LockKeyhole,
  Megaphone,
  Plus,
  RadioTower,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
  WandSparkles,
} from 'lucide-react';
import { Language, Project, ViewMode } from '@/types';

interface PlatformCommandCenterProps {
  language: Language;
  project: Project;
  onSelectView: (view: ViewMode) => void;
  onOpenWorkspace: () => void;
  onOpenDeploy: () => void;
}

type CenterTab = 'overview' | 'shield' | 'builder' | 'ads';

type Campaign = {
  id: string;
  name: string;
  audience: string;
  status: 'draft' | 'ready';
  budget: string;
};

const baseCampaigns: Campaign[] = [
  { id: 'cf-1', name: 'CloudForge Launch', audience: 'Global / Developers', status: 'ready', budget: '$2,400' },
  { id: 'cf-2', name: 'Academy Growth', audience: 'MENA / Students', status: 'draft', budget: '$800' },
];

export const PlatformCommandCenter: React.FC<PlatformCommandCenterProps> = ({
  language,
  project,
  onSelectView,
  onOpenWorkspace,
  onOpenDeploy,
}) => {
  const isAr = language === 'ar';
  const [tab, setTab] = useState<CenterTab>('overview');
  const [campaigns, setCampaigns] = useState<Campaign[]>(baseCampaigns);
  const [campaignName, setCampaignName] = useState('');
  const [creativeStatus, setCreativeStatus] = useState('');
  const [healMode, setHealMode] = useState(true);
  const [assetUrl, setAssetUrl] = useState('');

  const labels = useMemo(
    () =>
      isAr
        ? {
            eyebrow: 'CloudForge Control Plane',
            title: 'مركز قيادة السحابة السيادية',
            intro: 'مكان واحد لبناء المشاريع، مراقبة الحماية، تجهيز الحملات، وإدارة رحلة التعلم — مع فصل واضح بين الوضع التجريبي والاتصالات الإنتاجية.',
            overview: 'نظرة عامة',
            shield: 'الدرع الأمني',
            builder: 'البناء المرئي',
            ads: 'استوديو الإعلانات',
            openBuilder: 'فتح بيئة البناء',
            deploy: 'بدء نشر آمن',
            status: 'الحالة التشغيلية',
            healthy: 'الأساس محمي',
            local: 'وضع معاينة محلي',
            securityTitle: 'حماية المواقع والتطبيقات الخارجية',
            securityBody: 'اربط الأصل الخارجي عبر وكيل حافة معتمد، ثم راجع قواعد WAF والسجلات قبل التفعيل. لا يتم تنفيذ أي تغيير على أصل خارجي من هذه الواجهة دون موافقة صريحة.',
            connect: 'تجهيز اتصال خارجي',
            assetPlaceholder: 'https://example.com — أصل خارجي للمراجعة',
            healTitle: 'الصيانة الذاتية المنضبطة',
            healBody: 'يكتشف النظام البطء والأخطاء ويقترح إصلاحات قابلة للمراجعة. التغييرات الإنتاجية تبقى خلف بوابة موافقة ولا تُنفذ بصمت.',
            enabled: 'الاقتراحات الآلية مفعلة',
            paused: 'الاقتراحات الآلية متوقفة',
            builderTitle: 'منشئ Backend بصري',
            builderBody: 'صمّم مخططاً معزولاً لكل مشروع، طبّق RLS، ثم افتح محرر الكود أو انتقل إلى النشر بعد المراجعة.',
            schema: 'مخطط قاعدة البيانات',
            tables: 'جداول معزولة',
            fields: 'حقول محمية',
            editSchema: 'تعديل المخطط',
            adTitle: 'AI Creative Studio',
            adBody: 'أنشئ مسودات للنصوص والتصاميم والفيديو عبر مزوّد معتمد. النشر الخارجي لا يحدث تلقائياً من دون ربط حساب وموافقة.',
            campaignPlaceholder: 'اسم الحملة الجديدة',
            addCampaign: 'إضافة حملة',
            maxCampaigns: 'الحد التشغيلي: 10 حملات متوازية',
            generateCreative: 'توليد مسودة إبداعية',
            creativeReady: 'تم تجهيز مسودة إبداعية للمراجعة.',
            academy: 'الانتقال إلى أكاديمية CloudForge',
            noSilentRevenue: 'الشفافية المالية افتراضية: لا توجد مشاركة أرباح مخفية أو تحويلات تلقائية قبل تفعيلها صراحة من إعدادات الحساب.',
          }
        : {
            eyebrow: 'CloudForge Control Plane',
            title: 'Sovereign Cloud Command Center',
            intro: 'One place to build projects, monitor protection, prepare campaigns, and manage learning — with a clear boundary between preview mode and production integrations.',
            overview: 'Overview',
            shield: 'Cyber-shield',
            builder: 'Visual builder',
            ads: 'Ad studio',
            openBuilder: 'Open builder',
            deploy: 'Start secure deploy',
            status: 'Operational status',
            healthy: 'Baseline protected',
            local: 'Local preview mode',
            securityTitle: 'Protect external sites and apps',
            securityBody: 'Connect an external asset through an approved edge provider, then review WAF policies and logs before activation. No external change is made from this console without explicit approval.',
            connect: 'Prepare external connection',
            assetPlaceholder: 'https://example.com — external asset for review',
            healTitle: 'Guarded self-healing',
            healBody: 'The system detects latency and errors and proposes reviewable fixes. Production changes stay behind an approval gate and are never applied silently.',
            enabled: 'Automated suggestions enabled',
            paused: 'Automated suggestions paused',
            builderTitle: 'Visual backend builder',
            builderBody: 'Design an isolated schema per project, apply RLS, then open the code workspace or proceed to deployment after review.',
            schema: 'Database schema',
            tables: 'Isolated tables',
            fields: 'Protected fields',
            editSchema: 'Edit schema',
            adTitle: 'AI Creative Studio',
            adBody: 'Create drafts for copy, design, and video through an approved provider. External publishing never happens automatically without an account connection and approval.',
            campaignPlaceholder: 'New campaign name',
            addCampaign: 'Add campaign',
            maxCampaigns: 'Operating limit: 10 parallel campaigns',
            generateCreative: 'Generate creative draft',
            creativeReady: 'Creative draft is ready for review.',
            academy: 'Open CloudForge Academy',
            noSilentRevenue: 'Financial transparency is the default: no hidden revenue share or automatic transfers are enabled until explicitly configured in account settings.',
          },
    [isAr]
  );

  const addCampaign = () => {
    const name = campaignName.trim();
    if (!name || campaigns.length >= 10) return;
    setCampaigns((current) => [
      ...current,
      { id: `cf-${Date.now()}`, name, audience: isAr ? 'جمهور مخصص' : 'Custom audience', status: 'draft', budget: '—' },
    ]);
    setCampaignName('');
  };

  const tabs: Array<{ id: CenterTab; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: labels.overview, icon: <Activity className="h-4 w-4" /> },
    { id: 'shield', label: labels.shield, icon: <ShieldCheck className="h-4 w-4" /> },
    { id: 'builder', label: labels.builder, icon: <Layers3 className="h-4 w-4" /> },
    { id: 'ads', label: labels.ads, icon: <Megaphone className="h-4 w-4" /> },
  ];

  return (
    <section className="min-h-screen w-full overflow-hidden bg-[#0B0F19] px-4 py-6 text-slate-100 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_right,rgba(0,242,254,0.16),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(11,15,25,0.98))] p-5 shadow-2xl shadow-cyan-950/20 sm:p-8">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
                <Cloud className="h-3.5 w-3.5" />
                {labels.eyebrow}
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{labels.title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{labels.intro}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={onOpenWorkspace} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 via-blue-500 to-violet-500 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:brightness-110">
                  <Terminal className="h-4 w-4" /> {labels.openBuilder}
                </button>
                <button onClick={onOpenDeploy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-200">
                  <Rocket className="h-4 w-4" /> {labels.deploy}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[34rem]">
              {[
                { label: labels.status, value: labels.healthy, icon: <CheckCircle2 className="h-4 w-4 text-emerald-300" /> },
                { label: 'RLS', value: 'Enabled', icon: <LockKeyhole className="h-4 w-4 text-cyan-300" /> },
                { label: 'Preview', value: labels.local, icon: <RadioTower className="h-4 w-4 text-amber-300" /> },
                { label: 'Project', value: project.name, icon: <Layers3 className="h-4 w-4 text-violet-300" /> },
              ].map((item) => (
                <div key={item.label} className="min-w-0 rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.icon}{item.label}</div>
                  <p className="mt-2 truncate text-xs font-black text-slate-200">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-2 scrollbar-none">
          {tabs.map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${tab === item.id ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid gap-4 lg:grid-cols-3">
            <button onClick={() => setTab('shield')} className="group rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-5 text-start transition hover:-translate-y-0.5 hover:border-cyan-400/60">
              <div className="mb-6 flex items-center justify-between"><span className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300"><ShieldCheck className="h-6 w-6" /></span><ChevronRight className={`h-5 w-5 text-slate-500 transition group-hover:text-cyan-300 ${isAr ? 'rotate-180' : ''}`} /></div>
              <h2 className="text-lg font-black">{labels.securityTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{labels.securityBody}</p>
            </button>
            <button onClick={() => setTab('builder')} className="group rounded-3xl border border-violet-400/20 bg-slate-900/70 p-5 text-start transition hover:-translate-y-0.5 hover:border-violet-400/60">
              <div className="mb-6 flex items-center justify-between"><span className="rounded-2xl bg-violet-400/10 p-3 text-violet-300"><Database className="h-6 w-6" /></span><ChevronRight className={`h-5 w-5 text-slate-500 transition group-hover:text-violet-300 ${isAr ? 'rotate-180' : ''}`} /></div>
              <h2 className="text-lg font-black">{labels.builderTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{labels.builderBody}</p>
            </button>
            <button onClick={() => setTab('ads')} className="group rounded-3xl border border-amber-400/20 bg-slate-900/70 p-5 text-start transition hover:-translate-y-0.5 hover:border-amber-400/60">
              <div className="mb-6 flex items-center justify-between"><span className="rounded-2xl bg-amber-400/10 p-3 text-amber-300"><Megaphone className="h-6 w-6" /></span><ChevronRight className={`h-5 w-5 text-slate-500 transition group-hover:text-amber-300 ${isAr ? 'rotate-180' : ''}`} /></div>
              <h2 className="text-lg font-black">{labels.adTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{labels.adBody}</p>
            </button>
          </div>
        )}

        {tab === 'shield' && (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{labels.shield}</p><h2 className="mt-2 text-2xl font-black">{labels.securityTitle}</h2></div><Globe2 className="h-8 w-8 text-cyan-300" />
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">{labels.securityBody}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ['WAF policy', isAr ? 'جاهزة للمراجعة' : 'Review ready'],
                  ['DDoS edge', isAr ? 'يتطلب مزوّداً' : 'Provider required'],
                  ['Audit trail', isAr ? 'مفعّل محلياً' : 'Local enabled'],
                ].map(([name, value]) => <div key={name} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{name}</p><p className="mt-2 text-sm font-black text-slate-200">{value}</p></div>)}
              </div>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <input value={assetUrl} onChange={(event) => setAssetUrl(event.target.value)} placeholder={labels.assetPlaceholder} inputMode="url" className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300" />
                <button onClick={() => {
                  try {
                    const parsed = new URL(assetUrl);
                    setCreativeStatus(parsed.protocol === 'https:' ? (isAr ? 'تم إنشاء مسودة اتصال آمنة للمراجعة.' : 'A secure connection draft is ready for review.') : (isAr ? 'استخدم عنوان HTTPS فقط.' : 'Use an HTTPS URL only.'));
                  } catch {
                    setCreativeStatus(isAr ? 'أدخل عنوان HTTPS صالحاً.' : 'Enter a valid HTTPS URL.');
                  }
                }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-black text-cyan-200 hover:bg-cyan-400/20"><ExternalLink className="h-4 w-4" />{labels.connect}</button>
              </div>
              {creativeStatus && <p className="mt-3 text-xs font-bold text-emerald-300">{creativeStatus}</p>}
            </div>
            <div className="rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3"><span className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300"><RefreshCw className="h-6 w-6" /></span><button aria-pressed={healMode} onClick={() => setHealMode((value) => !value)} className={`rounded-full px-3 py-1 text-xs font-black ${healMode ? 'bg-emerald-400/15 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>{healMode ? labels.enabled : labels.paused}</button></div>
              <h2 className="mt-5 text-xl font-black">{labels.healTitle}</h2><p className="mt-3 text-sm leading-7 text-slate-400">{labels.healBody}</p>
              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"><div className="flex items-center gap-2 text-xs font-bold text-slate-300"><Activity className="h-4 w-4 text-emerald-300" /> {isAr ? 'آخر فحص: قبل 4 دقائق' : 'Last check: 4 minutes ago'}</div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[86%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" /></div><p className="mt-2 text-[11px] text-slate-500">{isAr ? 'مؤشر صحة تجريبي — اربط المراقبة الإنتاجية لتدفق حي.' : 'Demo health signal — connect production monitoring for live telemetry.'}</p></div>
            </div>
          </div>
        )}

        {tab === 'builder' && (
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-violet-400/20 bg-slate-900/70 p-5 sm:p-7"><p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">{labels.builder}</p><h2 className="mt-2 text-2xl font-black">{labels.builderTitle}</h2><p className="mt-4 text-sm leading-7 text-slate-400">{labels.builderBody}</p><div className="mt-6 space-y-3"><div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-4"><span className="flex items-center gap-2 text-sm font-bold"><Database className="h-4 w-4 text-violet-300" /> {labels.tables}</span><span className="font-mono text-violet-200">{Math.max(3, project.files.length)}</span></div><div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-4"><span className="flex items-center gap-2 text-sm font-bold"><LockKeyhole className="h-4 w-4 text-emerald-300" /> {labels.fields}</span><span className="font-mono text-emerald-200">RLS</span></div></div><button onClick={() => onSelectView('cloudforge')} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-400 px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-violet-300"><WandSparkles className="h-4 w-4" /> {labels.editSchema}</button></div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{labels.schema}</p><h3 className="mt-2 text-lg font-black">{project.name}</h3></div><BarChart3 className="h-7 w-7 text-cyan-300" /></div><div className="mt-6 space-y-3">{['projects', 'deployments', 'audit_logs'].map((table) => <div key={table} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><span className="font-mono text-sm text-slate-200">public.{table}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" /> RLS</span></div>)}</div><button onClick={onOpenWorkspace} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-200 hover:border-cyan-400/50 hover:text-cyan-200"><Terminal className="h-4 w-4" /> {labels.openBuilder}</button></div>
          </div>
        )}

        {tab === 'ads' && (
          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-3xl border border-amber-400/20 bg-slate-900/70 p-5 sm:p-7"><p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">{labels.ads}</p><h2 className="mt-2 text-2xl font-black">{labels.adTitle}</h2><p className="mt-4 text-sm leading-7 text-slate-400">{labels.adBody}</p><div className="mt-6 flex gap-2"><input value={campaignName} onChange={(event) => setCampaignName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addCampaign()} placeholder={labels.campaignPlaceholder} className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-amber-300" /><button onClick={addCampaign} disabled={campaigns.length >= 10} aria-label={labels.addCampaign} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-300 px-3 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"><Plus className="h-4 w-4" /> <span className="hidden sm:inline">{labels.addCampaign}</span></button></div><p className="mt-3 text-xs text-slate-500">{labels.maxCampaigns} · {campaigns.length}/10</p><button onClick={() => setCreativeStatus(labels.creativeReady)} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-sm font-black text-amber-200 hover:bg-amber-300/20"><Sparkles className="h-4 w-4" /> {labels.generateCreative}</button>{creativeStatus && <p className="mt-3 text-xs font-bold text-emerald-300">{creativeStatus}</p>}<div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs leading-6 text-slate-400"><Bot className="mb-2 h-4 w-4 text-amber-300" />{labels.noSilentRevenue}</div></div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5 sm:p-7"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{isAr ? 'الحملات' : 'Campaigns'}</p><h3 className="mt-2 text-lg font-black">{campaigns.length} / 10</h3></div><RadioTower className="h-7 w-7 text-amber-300" /></div><div className="space-y-3">{campaigns.map((campaign) => <div key={campaign.id} className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate text-sm font-black text-slate-100">{campaign.name}</p><p className="mt-1 text-xs text-slate-500">{campaign.audience} · {campaign.budget}</p></div><div className="flex items-center justify-between gap-3 sm:justify-end"><span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${campaign.status === 'ready' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>{campaign.status === 'ready' ? (isAr ? 'جاهزة' : 'Ready') : (isAr ? 'مسودة' : 'Draft')}</span><button onClick={() => setCampaigns((current) => current.filter((item) => item.id !== campaign.id))} aria-label={isAr ? 'حذف الحملة' : 'Delete campaign'} className="rounded-lg p-2 text-slate-500 hover:bg-rose-400/10 hover:text-rose-300"><Trash2 className="h-4 w-4" /></button></div></div>)}</div></div>
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div><p className="text-sm font-black text-slate-200">{isAr ? 'ابنِ بوعي، وانشر بموافقة.' : 'Build deliberately. Deploy with approval.'}</p><p className="mt-1 text-xs text-slate-500">{isAr ? 'الأكاديمية تشرح كل خطوة من المخطط إلى المراقبة.' : 'The Academy explains every step from schema to monitoring.'}</p></div><button onClick={() => onSelectView('academy')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-200 hover:border-cyan-400/50 hover:text-cyan-200">{labels.academy}{isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}</button></div>
      </div>
    </section>
  );
};
