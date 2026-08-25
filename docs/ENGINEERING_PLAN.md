# CloudForge — الخطة الهندسية الشاملة (Engineering Blueprint)

> **الإصدار:** 2.0 · **التاريخ:** 2026-08-11
> **المكدس:** Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Supabase (PostgreSQL + RLS + Realtime + Edge Functions) · Vercel / Netlify · GitHub Actions

---

## 0) ملخص تنفيذي — ما الذي تم إصلاحه فعلياً؟

| المشكلة السابقة | السبب الجذري | الحل المطبَّق |
| --- | --- | --- |
| مفاتيح فارغة مثل `heroTitle` و `card1Title` و `stat1Val` على Vercel | ملفات الترجمة الخارجية (`lib/translations`، `locales/…`، `./translations`) لم تكن **مضمّنة في المستودع** أصلاً، والاستيرادات كانت بمسارات مختلفة ومتعارضة | كل النصوص أصبحت **كائنات TypeScript ثابتة ومضمّنة** في `src/lib/translations.ts` (14 لغة) تُبنى داخل الحزمة وقت الترجمة — لا JSON خارجي، لا مسارات لغات، لا fetch وقت التشغيل، مع fallback تلقائي للإنجليزية |
| فشل البناء (Build) على Linux/Vercel | استيرادات `./types` و `../types` و `../lib/translations` و `/src/lib/translations` و `../data/templates` و `../data/coursesData` و `../types/academy` كلها كانت تشير إلى ملفات **غير موجودة** | أُعيد بناء الهيكل الكامل: `src/components` و `src/lib` و `src/types` و `src/data` + توحيد كل الاستيرادات على `@/…` (حساسية الأحرف مطابقة 100%) |
| انهيار SSR على Vercel | `localStorage` يُستدعى داخل `useState` في `App.tsx` و `AcademyModule.tsx` أثناء العرض على الخادم | `safeGetItem` / `safeSetItem` في `src/lib/utils.ts` + ترحيل مفاتيح الكاش القديمة |
| تضارب مساحة الكاش التاريخية | مفاتيح `localStorage` قديمة (`codevortex_*`) ونصوص العلامة التجارية مختلطة | إعادة تسمية واجهة CloudForge + `migrateLegacyCache()` تُنفَّذ مرة واحدة عند الإقلاع |
| نقص نقاط API على Vercel | الواجهة تستدعي `/api/ai/generate` و `/api/deploy` … وملفات `route.js` القديمة كانت مبعثرة | 15 مسار API كامل في `src/app/api/**` مع fallback ذكي بلا مفاتيح |
| غياب الإعدادات الخاصة بـ Vercel | لا يوجد `next.config.js` ولا `postcss.config.mjs` ولا `.env.example` | إعدادات كاملة موثقة (انظر أدناه) |

---

## 1) المعمارية والبنية التحتية (System Architecture)

### 1.1 مخطط المعمارية الكلية

```
┌─────────────────────────────────────────────────────────────────────┐
│                            المتصفح / Mobile                         │
│        Next.js 15 App Router — SPA Shell (client components)        │
│   Landing · Dashboard · Workspace · Marketplace · Academy · Chat   │
└───────────────┬───────────────────────────────┬─────────────────────┘
                │ HTTPS / Edge (Vercel CDN)      │
┌───────────────▼───────────────────┐ ┌──────────▼─────────────────────┐
│        Next.js Server (SSR)       │ │   /api/* Route Handlers        │
│   pages · layout · SEO metadata   │ │   deploy · ai · auth · billing │
└───────┬──────────────────┬────────┘ └───────┬──────────┬─────────────┘
        │ @supabase/ssr    │                    │          │
┌───────▼──────────────────▼────────────────────▼──────────▼──────────┐
│                        Supabase (PostgreSQL 15)                     │
│  profiles · workspaces · projects · deployments · api_keys ·        │
│  subscriptions · invoices · templates · workflows · webhooks ·      │
│  notifications · support_tickets · audit_logs · ai_usage            │
│  + RLS policies لكل دور + Realtime Channels + Storage buckets       │
└───────┬───────────────────────────────┬─────────────────────────────┘
        │ Edge Functions (Deno)         │
┌───────▼──────────────┐ ┌──────────────▼─────────────┐
│ ai-completion        │ │ stripe-webhook             │
│ webhook-dispatcher   │ │ crypto-webhook             │
└───────┬──────────────┘ └──────────────┬─────────────┘
        │                                │
   OpenAI / Anthropic / Gemini      Stripe / Crypto Gateways
```

### 1.2 قاعدة البيانات — الجداول الأساسية والعلاقات

| الجدول | المفتاح الأساسي | العلاقات (Foreign Keys) |
| --- | --- | --- |
| `profiles` | `id uuid ← auth.users.id` | 1:1 مع نظام المصادقة |
| `workspaces` | `id` | `owner_id → profiles.id` |
| `workspace_members` | `(workspace_id, profile_id)` | `→ workspaces.id` ، `→ profiles.id` |
| `projects` | `id` | `workspace_id → workspaces.id` ، `owner_id → profiles.id` |
| `deployments` | `id` | `project_id → projects.id` ، `workspace_id → workspaces.id` ، `triggered_by → profiles.id` |
| `api_keys` | `id` | `profile_id → profiles.id` (التخزين كـ `key_hash` فقط — SHA-256) |
| `subscriptions` | `id` | `profile_id → profiles.id` ، `workspace_id → workspaces.id` |
| `invoices` | `id` | `subscription_id → subscriptions.id` ، `profile_id → profiles.id` |
| `templates` | `id` | `author_id → profiles.id` |
| `workflows` / `workflow_runs` | `id` | `workspace_id → workspaces.id` / `workflow_id → workflows.id` |
| `webhook_endpoints` / `webhook_events` | `id` | `workspace_id → workspaces.id` / `endpoint_id → webhook_endpoints.id` |
| `notifications` / `push_subscriptions` | `id` | `profile_id → profiles.id` |
| `support_tickets` / `ticket_messages` | `id` | `profile_id → profiles.id` / `ticket_id → support_tickets.id` |
| `audit_logs` | `id` | `profile_id → profiles.id` |
| `ai_usage` | `id` | `profile_id → profiles.id` ، `workspace_id → workspaces.id` |

**الفهارس (Indexes)**: كل مفاتيح أجنبية، `email`، `slug`، `status`، ومؤشرات `GIN trgm` على `projects.title` و `templates.title` للبحث النصي، ومؤشرات مركبة مثل `(profile_id, is_read)` و `(profile_id, created_at desc)`.

**الملفات**: `supabase/migrations/0001…0004` تُنفَّذ بترتيبها عبر `supabase db push` أو زر **Run migrations** في لوحة Supabase.

### 1.3 المصادقة والأدوار (RBAC)

| الدور | الصلاحيات الأساسية |
| --- | --- |
| `super_admin` | كل شيء: إدارة المنصة، حذف أي مورد، قراءة كل السجلات، إدارة الخطط |
| `admin` | إدارة المنظمة: دعوة أعضاء، إدارة مشاريع المنظمة، تذاكر الدعم، لوحات المراقبة |
| `enterprise` | مساحات عمل متعددة، نشر غير محدود، مفاتيح API، أتمتة Workflows |
| `developer` | مشاريع خاصة، نشر على Vercel/Netlify، قوالب Marketplace، استخدام AI محدود |
| `free_user` | مشاريع عامة، معاينة حية، حد شهري لعمليات AI |

**التطبيق في قاعدة البيانات**:
- `public.current_app_role()` و `public.is_admin()` و `public.is_super_admin()` — دوال `security definer` تُستخدم داخل سياسات RLS.
- `public.can_access_workspace(ws_id)` و `public.can_access_project(proj_id)` — تتحقق من العضوية/الملكية.
- Trigger `on_auth_user_created` ينشئ `profiles` تلقائياً عند التسجيل.

**المصادقة**: Supabase Auth — بريد + OTP (6 أرقام)، جلسات `@supabase/ssr` تُحدَّث في `middleware.ts`، حماية RLS على كل جدول.

### 1.4 CI/CD عبر GitHub Actions

- **`.github/workflows/ci.yml`** — على كل push/PR: `npm ci` ← `typecheck` ← `test` ← `next build`.
- **`.github/workflows/deploy-vercel.yml`** — نشر إنتاجي على Vercel عبر `amondnet/vercel-action` مع:
  - `VERCEL_TOKEN` ، `VERCEL_ORG_ID` ، `VERCEL_PROJECT_ID` كـ **GitHub Secrets**.
- **`.github/workflows/deploy-netlify.yml`** — نشر على Netlify عبر `nwtgck/actions-netlify` مع `NETLIFY_AUTH_TOKEN` و `NETLIFY_SITE_ID`.

**إدارة المتغيرات البيئية بأمان**: القاعدة الذهبية — **لا شيء يُحفظ في المستودع**. كل الأسرار في GitHub Secrets ثم تُمرَّر للمنصات؛ والنسخة العامة الموثقة في `.env.example`. التطبيق يعمل بالكامل **بدون أي متغيرات** (fallback مدمج)، فلا يوجد "تعطل بسبب متغير مفقود".

---

## 2) واجهة المستخدم والتجربة (UI/UX & Mobile-Optimized Frontend)

### 2.1 التصميم الهجين (Mobile-First / Touch-Friendly)

- **Mobile-first**: كل المكونات مبنية على `grid-cols-1 → sm → lg`، وأزرار بمساحات لمس ≥ 44px، وقوائم جانبية (Drawers) بدل الهيدر التقليدي على الشاشات الصغيرة.
- **RTL/LTR ديناميكي**: `document.documentElement.dir` يتغير مع اللغة (العربية RTL) + خط Cairo.
- **الهوية البصرية**: خلفية `#0B0F19`، توهجات نيون `#00F2FE → #7928CA`، بطاقات زجاجية `backdrop-blur` — مطابقة لمعاينة AI Studio تماماً.

### 2.2 المكونات الهيكلية الرئيسية

| المكوّن | الوظيفة |
| --- | --- |
| `Header` | تنقل كامل، بحث سريع (Ctrl+K)، مبدّل 14 لغة، تسجيل الدخول |
| `LandingPage` | Hero + توليد بالذكاء الاصطناعي + بطاقات الميزات + محاكاة IDE + إحصاءات + آراء + مجتمع + FAQ + CTA |
| `UserDashboard` | إدارة المشاريع (إنشاء، استنساخ، حذف، اختيار) |
| `ReplitWorkspace` / `LiveCanvas` / `CodeEditor` | بيئة العمل السحابية: محرر أكواد، معاينة حية متجاوبة (desktop/tablet/mobile)، طرفية تفاعلية |
| `CloudForgeEngine` | منشئ مخططات Supabase (Schema Builder) وتوليد SQL مع RLS |
| `Marketplace` | مكتبة قوالب جاهزة للاستيراد بضغطة واحدة |
| `Academy` | مسارات تعليمية + اختبارات + شهادات موثقة |
| `AuthModal` / `CheckoutModal` / `DeploymentModal` | مصادقة OTP، دفع (Stripe/كrypto)، نشر سحابي بسجلات حية |

### 2.3 الأداء (Core Web Vitals) و SEO

- **SSR/SSG**: الصفحة الرئيسية تُبنى كـ static prerender (`○ /`) + `metadata` كامل (OpenGraph, Twitter, robots, sitemap).
- **Dynamic Imports**: مكوّنات ثقيلة (Monaco Editor في `CodeEditor`) تُحمَّل عند الحاجة فقط.
- **التخزين المؤقت**: `next.config.mjs` مع `compress: true` + رؤوس أمان؛ وEdge Caching تلقائي عبر Vercel CDN.
- **الصور**: `images.unoptimized: true` لتفادي أخطاء الـ remote patterns في بيئة Vercel.
- **SEO Metadata**: عناوين ووصف وكلمات مفتاحية عربية/إنجليزية في `src/app/layout.tsx` + `robots.ts` + `sitemap.ts`.

---

## 3) الميزات المتقدمة والأتمتة والذكاء الاصطناعي

### 3.1 دمج نماذج الذكاء الاصطناعي (OpenAI / Anthropic / Gemini)

- **`supabase/functions/ai-completion`** — بوابة LLM متعددة المزودين: تحاول OpenAI ← Anthropic ← Gemini بالتسلسل، والمفاتيح محفوظة في **Supabase Secrets** فقط.
- **مسارات `/api/ai/generate` و `/api/ai/refine` في Next.js** — تعمل على الخادم، ومع غياب أي مفتاح تُرجع **توليداً حتمياً (deterministic)** مبنيّاً على كلمات المفتاح (saas / ecommerce / dashboard / ai) مع دعم RTL — فلا يفشل زر "Generate App" أبداً.
- **قياس الاستخدام**: كل طلب يُسجَّل في `ai_usage` (المزود، النموذج، الإجراء، الرموز) لفرض حدود الخطط.

### 3.2 اللوحات اللحظية (Real-time Data Streams)

- `alter publication supabase_realtime add table deployments; workflow_runs; notifications; webhook_events; projects`
- الواجهة تستخدم `supabase.channel('deploy-logs').on('postgres_changes', …).subscribe()` لبث سجلات النشر، مؤشرات اللوحات، والإشعارات عبر WebSockets.

### 3.3 الاشتراكات وبوابات الدفع المزدوجة

- **Stripe (الاشتراكات الدورية)**: `/api/db/billing/checkout` ينشئ `checkout.session` بوضع `subscription`، و`stripe-webhook` يفعّل الاشتراك ويسجّل الفواتير في `subscriptions` / `invoices` ويحدّث `profiles.plan`.
- **المدفوعات الرقمية (Crypto)**: `crypto-webhook` يتحقق من توقيع HMAC-SHA256 ثم يؤكد المعاملة على السلسلة ويفعّل الاشتراك.
- **Sandbox fallback**: بدون مفاتيح، تُرجع مسارات الدفع `transaction_id` تجريبياً ليكتمل تدفق الواجهة.

---

## 4) قوالب التطبيقات وأنظمة الربط (Templates & Automation)

### 4.1 مكتبة القوالب (Marketplace / Template Engine)

- بيانات القوالب **مضمّنة** في `src/data/templates.ts` (6 قوالب كاملة بملفاتها: SaaS، متجر، لوحة تحكم، شات AI، موقع شركة، REST API starter) — تعمل فوراً بدون خادم.
- **الإصدار المؤسسي**: جدول `templates` في Supabase يسمح بنشر قوالب المجتمع (`author_id`، تصنيفات، تنزيلات) مع RLS: قراءة عامة للقوالب المنشورة، وكتابة للمؤلفين.
- "استيراد بضغطة زر": `handleImportTemplate` يحوّل القالب إلى مشروع كامل في الـ Workspace خلال لحظة.

### 4.2 محرك الربط والأتمتة (Workflow Automation — شبيه Zapier/Make)

- جداول `workflows` + `workflow_runs` + `webhook_endpoints` + `webhook_events`.
- **`webhook-dispatcher`**: عند حدوث حدث (نشر مكتمل، فاتورة مدفوعة، تشغيل workflow) يبحث عن النقاط المشتركة، يوقّع الحمولة بـ HMAC لكل نقطة، ويسلّمها مع إعادة محاولة (حتى 3) وتسجيل `response_code`.
- **Event Listeners**: `postgres_changes` من Realtime تتيح تشغيل الـ Workflows استجابةً لتغيرات قاعدة البيانات (مثال: مشروع جديد ← نشر تلقائي).
- **Webhooks الواردة**: `/api/deploy` و `/api/webhooks/*` كنقاط استقبال موثّقة بالتوقيعات.

---

## 5) الأمان والمراقبة والتوسع (Security, Monitoring & Scaling)

### 5.1 تشفير وحماية البيانات

- **In-transit**: HTTPS إلزامي عبر Vercel/Netlify + `HSTS` ضمن رؤوس `next.config.mjs`.
- **At-rest**: قاعدة بيانات Supabase مشفّرة، ومفاتيح API تُخزَّن **كـ hash فقط** (`key_hash sha256` + `key_prefix` للعرض) — لا تُعرض الأسرار أبداً.
- **أسرار AI/Stripe**: لا تصل للمتصفح إطلاقاً — فقط Edge Functions و Route Handlers على الخادم.

### 5.2 الوقاية من OWASP Top 10

| الثغرة | الإجراء |
| --- | --- |
| **SQLi** | Supabase Client مُرقّم المعاملات + سياسات RLS — لا استعلامات SQL مدمجة في الواجهة |
| **XSS** | React يفلتر الإخراج افتراضياً؛ ومحتوى `textContentEn/Ar` يُعرض عبر `dangerouslySetInnerHTML` فقط داخل الأكاديمية لمحتوى ثابت مكتوب يدوياً |
| **CSRF** | سياسات SameSite للكوكيز + `X-Frame-Options: SAMEORIGIN` + التحقق من التوقيعات في الـ Webhooks |
| **IDOR** | كل قراءة/كتابة تمر عبر دوال `can_access_workspace` / `can_access_project` داخل RLS |
| **كشف المعلومات** | `poweredByHeader: false`، رؤوس `X-Content-Type-Options`، `Referrer-Policy` |

### 5.3 المراقبة والتتبع المركزي

- **Sentry**: أضف `NEXT_PUBLIC_SENTRY_DSN` لربط `@sentry/nextjs` (مسار التوثيق في README) — التقاط أخطاء الواجهة والخادم.
- **Logflare**: اربطه بمنشورات Supabase كوجهة لوجوهات Realtime/Edge Functions.
- **audit_logs**: كل الإجراءات الحساسة (تسجيل دخول، نشر، تغيير خطة، مفاتيح API) تُسجَّل بـ `ip_address` و `user_agent`.
- **ai_usage**: قياس استهلاك نماذج AI لكل مستخدم/مساحة عمل.

### 5.4 التوسع الأفقي والتخزين المؤقت والإشعارات

- **Horizontal Scaling**: تطبيق Next.js عديم الحالة (Stateless) — الجلسات في Supabase، والبيانات في PostgreSQL → يمكن تكرار الخوادم/الحاويات بلا حدود.
- **Edge Caching**: Vercel CDN + `robots`/`sitemap` ثابتة + `images.unoptimized` لخفة الردود.
- **Push & Real-time Notifications**: جدول `push_subscriptions` (Web Push) + `notifications` عبر Realtime Channels، ويمكن إضافة Web Push عبر VAPID لاحقاً.

---

## 6) خارطة الطريق المقترحة (Roadmap)

| المرحلة | المحتوى |
| --- | --- |
| ✅ **تم** | إعادة الهيكلة Next.js App Router، إصلاح i18n (14 لغة مضمّنة)، إصلاح الاستيرادات، SSR-safe، 15 API route، schema Supabase كامل + RLS + RBAC، Edge Functions الأربعة، CI/CD، الخطة الهندسية |
| 🔜 المرحلة 1 | ربط Supabase فعلياً (env)، تفعيل Stripe الحقيقي، Sentry/Logflare |
| 🔜 المرحلة 2 | Web Push، محرك Workflows في الواجهة (محرر مرئي)، نشر قوالب المجتمع |
| 🔜 المرحلة 3 | تحليلات Realtime كاملة في Dashboard، خطط Enterprise متعددة المساحات |

---

## 7) فحص سريع قبل النشر على Vercel

```bash
# محلياً (يتطلب Node 20+)
npm install
npm run dev          # http://localhost:3000

# الفحص الكامل
npm run typecheck    # صفر أخطاء
npm test             # 6 اختبارات ناجحة
npm run build        # build إنتاجي ناجح

# النشر على Vercel
vercel               # أول مرة: vercel link ثم vercel --prod
# أو تلقائياً عبر GitHub Actions بعد ربط الـ Secrets المذكورة أعلاه
```

> **ملاحظة عن كاش الاسم القديم**: عند أول زيارة بعد النشر، تنفَّذ `migrateLegacyCache()` فتنقل `codevortex_*` → `cloudforge_*` وتحذف القديم. ولضمان نظافة كاملة في Vercel: من لوحة المشروع → **Settings → Builds → Clear Build Cache** ثم **Redeploy**.


## 8) CloudForge Control Plane — الإصدار 2.5

أضيفت واجهة **CloudForge Control Center** كطبقة تشغيل موحّدة فوق الوحدات الموجودة. وهي متاحة من قائمة التنقل تحت المسار `control-center` وتجمع أربع مساحات واضحة: النظرة العامة، الدرع الأمني، البناء المرئي، واستوديو الإعلانات. صُممت الواجهة بأسلوب mobile-first، مع أزرار لمس مناسبة، حالات RTL/LTR، ودعم للشاشات الصغيرة والكبيرة.

| المساحة | ما توفره الآن | ما يتطلب تكاملاً إنتاجياً لاحقاً |
| --- | --- | --- |
| الدرع الأمني | عرض حالة الأساس الأمني، مراجعة WAF، سجل تدقيق، ووضع اقتراحات الصيانة الذاتية | مزوّد WAF/CDN معتمد، telemetry حي، قواعد rate limiting، وعمليات موافقة قبل تعديل أصل خارجي |
| البناء المرئي | ملخص المخطط، مؤشرات RLS، والانتقال إلى Schema Builder وWorkspace | مشروع Supabase مستقل لكل مساحة عمل، أسرار خادمية، وسياسة عزل وفوترة قابلة للتدقيق |
| استوديو الإعلانات | إدارة مسودات حملات حتى 10 حملات متوازية وتوليد مسودة إبداعية للمراجعة | مزوّد توليد معتمد، منصات نشر موثّقة، قياس impressions/clicks، ومراجعة امتثال قبل النشر |
| الأكاديمية | رابط مباشر إلى الدورات والاختبارات والشهادات الموجودة | محتوى تدريبي موسّع، تحليلات تقدم، وشهادات قابلة للتحقق خارجياً |

> **مبدأ أمني:** لا تنفذ CloudForge أي تغيير على موقع خارجي، ولا تنشر حملة، ولا تطبق إصلاحاً إنتاجياً بصمت. يجب أن يمر كل إجراء خارجي عبر مزوّد موثوق، تحقق من الصلاحيات، سجل تدقيق، وموافقة صريحة عند الضرورة.

> **مبدأ مالي:** لا توجد مشاركة أرباح مخفية أو تحويلات تلقائية مفعلة للمستخدمين. أي نموذج monetization يجب أن يظهر في إعدادات الحساب، ويخضع لموافقة وشروط واضحة وسجل تدقيق.

### 8.1 حدود التنفيذ الحالية

الدرع الأمني في هذه المرحلة هو **طبقة إدارة واستعداد للتكامل** وليس بديلاً عن شبكة DDoS أو WAF فعلية. كما أن مؤشر الصحة في الواجهة إشارة تجريبية حتى يتم ربط مصدر telemetry إنتاجي. وبالمثل، فإن استوديو الإعلانات يدير مسودات محلية ولا يدّعي إتمام شراء أو نشر إعلامي قبل إضافة مفاتيح مزود الإعلانات ومسارات webhook والتحقق من التوقيع.

### 8.2 المسارات المقترحة للإصدار التالي

يُستكمل الإصدار التالي عبر إضافة جداول `security_assets`, `security_events`, `ad_campaigns`, `ad_events` و`approval_requests` مع RLS، ثم بناء workers خارج واجهة المستخدم لمعالجة الأحداث غير المتزامنة. يجب تفعيل مفاتيح Idempotency، التحقق من HMAC للويبهوكس، حدود معدل لكل مساحة عمل، وتسجيل كل تغيير في `audit_logs` قبل تفعيل أي نشر عالمي.


## 9) Global Experience Upgrade — الإصدار 2.6

### 9.1 الأداء والتحميل الفوري

تم نقل الصفحة الجذرية إلى تصيير مباشر للـ App shell بدلاً من شاشة تحميل سوداء طويلة. وتُحمّل الوحدات الثقيلة مثل Monaco وWorkspace وLive Preview وMarketplace وAcademy وCommand Palette وDeployment Modals عبر `next/dynamic` عند فتح المسار فقط. كما أصبح `JSZip` و`FileSaver` يُحمّلان عند طلب التصدير لا أثناء الزيارة الأولى. لا يُضمن رقم أقل من ثانية لكل جهاز وشبكة، لذلك يجب قياس LCP وINP وCLS في بيئة النشر الفعلية قبل اعتماد هدف زمني.

### 9.2 التنقل العالمي

أصبح الـ Header شفافاً مع روابط سطح مكتب مختصرة للرئيسية ومركز القيادة والسوق والأسعار، بينما تحولت القائمة الكاملة إلى Sidebar عريض قابل للطي بعرض متجاوب، وحالات RTL/LTR صحيحة، وتسميات بشرية مثل `Explore CloudForge` بدلاً من ترجمة تقنية حرفية. كما أضيفت قواعد `focus-visible` ومساحات لمس مناسبة ودعم `prefers-reduced-motion`.

### 9.3 Marketplace العالمي

أضيف `src/data/marketplaceCatalog.ts` ككتالوج ثابت سريع يضم أكثر من 20 عنصراً بين المواقع، SaaS، التجارة الإلكترونية، التطبيقات والخدمات، والمخططات وواجهات REST API. يدعم السوق الفلترة والبحث والترتيب، والمعاينة الحية داخل `iframe` مع `sandbox="allow-scripts"`، والتثبيت في مساحة العمل أو تجهيز النشر من خلال نافذة النشر الحالية. الصور تستخدم `loading="lazy"` و`decoding="async"` لتقليل أثرها على أول تحميل.

### 9.4 الدفع والباقات

أصبحت الباقات المعروضة هي Free، Pro بسعر أساسي 20 دولاراً شهرياً، Enterprise مخصص، وAd-Engine مستقل، مع تبديل شهري/سنوي وخصم سنوي معروض بوضوح. أضيفت باقات Starter بقيمة 10 دولارات، Growth بقيمة 25 دولاراً، وScale بقيمة 50 دولاراً فأكثر. مسار checkout الآن يقبل منتجات الاشتراك والمنتجات ذات الدفع الواحد، ويستخدم معرفات أسعار Stripe من متغيرات البيئة، ويرفض نجاحاً وهمياً عندما لا يكون المزود مهيئاً. Apple Pay يُعرض عبر دعم wallet في Stripe Checkout، بينما PayPal وBinance Pay يظهران كخيارات صريحة لكن يعيدان حالة `501` إلى أن تضاف خوادم OAuth/webhook الخاصة بهما.

> **قاعدة تشغيلية:** لا تُرسل أرقام البطاقات أو أسرار المزوّد إلى السجل أو قاعدة البيانات. يجب استخدام Stripe Checkout/Elements في الإنتاج، وتفعيل `ALLOW_SANDBOX_CHECKOUT` للتطوير المحلي فقط.

### 9.5 الدعم البشري

تمت إعادة صياغة شخصية الدعم لتكون مرحبة وسياقية، وتسأل سؤالاً توضيحياً عند الحاجة، وتشرح الخطوة التالية بلغة طبيعية. كما أضيف حد إدخال 4000 حرف، وأصبح fallback يوضح عدم توفر المزود بدلاً من الادعاء بإنشاء تذكرة. لا يدّعي المساعد تنفيذ نشر أو خصم أو تغيير حساب ما لم يؤكده مسار API صراحة.
