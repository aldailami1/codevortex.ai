/**
 * CloudForge — Academy Course Data (self-contained)
 * ------------------------------------------------------------------
 * Built-in learning tracks, fully embedded as static TypeScript
 * constants. No remote fetch — the Academy always renders content.
 */
import type { CourseTrack } from '@/types/academy';

export const COURSES_DATA: CourseTrack[] = [
  {
    id: 'track-cloud-foundations',
    slug: 'cloud-foundations',
    titleEn: 'Cloud Foundations',
    titleAr: 'أساسيات الحوسبة السحابية',
    descriptionEn:
      'Understand cloud infrastructure, deployment models, and how CloudForge provisions live environments.',
    descriptionAr:
      'افهم البنية التحتية السحابية ونماذج النشر وكيف يجهز CloudForge بيئات تشغيل حية.',
    shortDescriptionEn: 'Cloud computing fundamentals with hands-on CloudForge labs.',
    shortDescriptionAr: 'أساسيات الحوسبة السحابية مع تطبيقات عملية على CloudForge.',
    category: 'cloud',
    level: 'beginner',
    iconName: 'Cloud',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    instructor: {
      nameEn: 'CloudForge Academy',
      nameAr: 'أكاديمية CloudForge',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      titleEn: 'Lead Technical Instructor',
      titleAr: 'كبير المدربين التقنيين',
    },
    accentColor: '#00F2FE',
    rating: 4.9,
    totalStudents: 12400,
    chapters: [
      {
        id: 'ch-1',
        titleEn: 'Chapter 1 — Cloud Basics',
        titleAr: 'الفصل 1 — أساسيات السحابة',
        descriptionEn: 'IaaS, PaaS, SaaS and the deployment models.',
        descriptionAr: 'البنية كخدمة والمنصة كخدمة والبرمجيات كخدمة ونماذج النشر.',
        lessons: [
          {
            id: 'ls-1-1',
            type: 'video',
            titleEn: 'What is Cloud Computing?',
            titleAr: 'ما هي الحوسبة السحابية؟',
            duration: '8 min',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            textContentEn:
              '## What is Cloud Computing?\n\nCloud computing delivers compute, storage, and networking over the internet on a pay-as-you-go basis.\n\n- **IaaS** — virtual machines (EC2, Compute Engine)\n- **PaaS** — managed runtimes (Vercel, Heroku)\n- **SaaS** — finished apps (Gmail, Notion)\n\n### Deployment models\n- Public cloud\n- Private cloud\n- Hybrid cloud',
            textContentAr:
              '## ما هي الحوسبة السحابية؟\n\nالحوسبة السحابية تقدم الحوسبة والتخزين والشبكات عبر الإنترنت بنظام الدفع حسب الاستخدام.\n\n- **IaaS** — أجهزة افتراضية\n- **PaaS** — بيئات تشغيل مُدارة\n- **SaaS** — تطبيقات جاهزة',
          },
          {
            id: 'ls-1-2',
            type: 'article',
            titleEn: 'The CloudForge Deployment Pipeline',
            titleAr: 'خط أنابيب النشر في CloudForge',
            duration: '12 min',
            textContentEn:
              '## The CloudForge Pipeline\n\n1. **Prompt** — you describe your app.\n2. **Generation** — the neural engine scaffolds code and schema.\n3. **Preview** — a live sandbox runs on port 3000.\n4. **Deploy** — one click ships to Vercel / Netlify with SSL and edge caching.',
            textContentAr:
              '## خط أنابيب CloudForge\n\n1. **الطلب** — تصف تطبيقك.\n2. **التوليد** — يبني المحرك العصبي الكود والمخطط.\n3. **المعاينة** — بيئة تجريبية حية على المنفذ 3000.\n4. **النشر** — ضغطة واحدة تنشر إلى Vercel / Netlify مع SSL.',
          },
          {
            id: 'ls-1-3',
            type: 'quiz',
            titleEn: 'Cloud Basics Quiz',
            titleAr: 'اختبار أساسيات السحابة',
            duration: '5 min',
            quiz: [
              {
                id: 'q-1-1',
                questionEn: 'Which service model provides managed runtimes like Vercel?',
                questionAr: 'أي نموذج خدمة يوفر بيئات تشغيل مُدارة مثل Vercel؟',
                options: [
                  { id: 'opt-1', textEn: 'PaaS', textAr: 'PaaS', isCorrect: true },
                  { id: 'opt-2', textEn: 'IaaS', textAr: 'IaaS', isCorrect: false },
                  { id: 'opt-3', textEn: 'On-premise', textAr: 'محلي', isCorrect: false },
                ],
              },
              {
                id: 'q-1-2',
                questionEn: 'What port does CloudForge use for live preview?',
                questionAr: 'ما المنفذ الذي يستخدمه CloudForge للمعاينة الحية؟',
                options: [
                  { id: 'opt-1', textEn: '3000', textAr: '3000', isCorrect: true },
                  { id: 'opt-2', textEn: '8080', textAr: '8080', isCorrect: false },
                  { id: 'opt-3', textEn: '5000', textAr: '5000', isCorrect: false },
                ],
              },
            ],
          },
        ],
        chapterExam: {
          id: 'exam-ch-1',
          titleEn: 'Chapter 1 Exam',
          titleAr: 'اختبار الفصل الأول',
          descriptionEn: 'Covers cloud models and the CloudForge pipeline.',
          descriptionAr: 'يغطي نماذج السحابة وخط أنابيب CloudForge.',
          passingScore: 70,
          questions: [
            {
              id: 'eq-1-1',
              questionEn: 'What does PaaS stand for?',
              questionAr: 'ماذا تعني PaaS؟',
              options: [
                { id: 'opt-1', textEn: 'Platform as a Service', textAr: 'المنصة كخدمة', isCorrect: true },
                { id: 'opt-2', textEn: 'Product as a Service', textAr: 'المنتج كخدمة', isCorrect: false },
                { id: 'opt-3', textEn: 'Private Access Service', textAr: 'خدمة الوصول الخاص', isCorrect: false },
              ],
            },
            {
              id: 'eq-1-2',
              questionEn: 'Which step comes first in the CloudForge pipeline?',
              questionAr: 'ما الخطوة الأولى في خط أنابيب CloudForge؟',
              options: [
                { id: 'opt-1', textEn: 'Prompt', textAr: 'الطلب', isCorrect: true },
                { id: 'opt-2', textEn: 'Deploy', textAr: 'النشر', isCorrect: false },
                { id: 'opt-3', textEn: 'Preview', textAr: 'المعاينة', isCorrect: false },
              ],
            },
            {
              id: 'eq-1-3',
              questionEn: 'Hybrid cloud combines public and…?',
              questionAr: 'السحابة الهجينة تجمع بين العامة و…؟',
              options: [
                { id: 'opt-1', textEn: 'Private cloud', textAr: 'السحابة الخاصة', isCorrect: true },
                { id: 'opt-2', textEn: 'No cloud', textAr: 'بدون سحابة', isCorrect: false },
                { id: 'opt-3', textEn: 'Edge only', textAr: 'الحافة فقط', isCorrect: false },
              ],
            },
          ],
        },
      },
      {
        id: 'ch-2',
        titleEn: 'Chapter 2 — Deployments & DevOps',
        titleAr: 'الفصل 2 — النشر والعمليات',
        descriptionEn: 'CI/CD, environments, and rollbacks.',
        descriptionAr: 'التكامل المستمر والنشر المستمر والبيئات والاسترجاع.',
        lessons: [
          {
            id: 'ls-2-1',
            type: 'article',
            titleEn: 'Environments: preview vs production',
            titleAr: 'البيئات: المعاينة مقابل الإنتاج',
            duration: '10 min',
            textContentEn:
              '## Environments\n\nEvery CloudForge project gets a **preview** environment for every branch and a protected **production** environment. This keeps experiments isolated from what your users see.',
          },
          {
            id: 'ls-2-2',
            type: 'video',
            titleEn: 'Zero-downtime rollbacks',
            titleAr: 'الاسترجاع بدون توقف',
            duration: '7 min',
            textContentEn:
              '## Rollbacks\n\nVercel and Netlify keep immutable deployments. Rolling back is a pointer change — instant, safe, and auditable.',
          },
        ],
      },
    ],
    finalExam: {
      id: 'exam-final-foundations',
      titleEn: 'Cloud Foundations — Final Exam',
      titleAr: 'أساسيات السحابة — الاختبار النهائي',
      descriptionEn: 'Comprehensive assessment for the Cloud Foundations track.',
      descriptionAr: 'تقييم شامل لمسار أساسيات الحوسبة السحابية.',
      passingScore: 80,
      questions: [
        {
          id: 'fq-1',
          questionEn: 'Which cloud model fits a managed serverless runtime?',
          questionAr: 'أي نموذج سحابي يناسب بيئة تشغيل Serverless مُدارة؟',
          options: [
            { id: 'opt-1', textEn: 'PaaS / FaaS', textAr: 'PaaS / FaaS', isCorrect: true },
            { id: 'opt-2', textEn: 'On-premise', textAr: 'محلي', isCorrect: false },
            { id: 'opt-3', textEn: 'Physical servers', textAr: 'خوادم فيزيائية', isCorrect: false },
          ],
        },
        {
          id: 'fq-2',
          questionEn: 'SSL certificates are handled automatically by…?',
          questionAr: 'شهادات SSL تُدار تلقائياً بواسطة…؟',
          options: [
            { id: 'opt-1', textEn: 'The hosting platform', textAr: 'منصة الاستضافة', isCorrect: true },
            { id: 'opt-2', textEn: 'Your browser only', textAr: 'متصفحك فقط', isCorrect: false },
            { id: 'opt-3', textEn: 'Email providers', textAr: 'مزودي البريد', isCorrect: false },
          ],
        },
        {
          id: 'fq-3',
          questionEn: 'A preview deployment is used to…?',
          questionAr: 'النشر التجريبي يُستخدم من أجل…؟',
          options: [
            { id: 'opt-1', textEn: 'Test changes safely', textAr: 'اختبار التغييرات بأمان', isCorrect: true },
            { id: 'opt-2', textEn: 'Replace the database', textAr: 'استبدال قاعدة البيانات', isCorrect: false },
            { id: 'opt-3', textEn: 'Send marketing emails', textAr: 'إرسال رسائل تسويقية', isCorrect: false },
          ],
        },
      ],
    },
  },
  {
    id: 'track-fullstack-supabase',
    slug: 'fullstack-supabase',
    titleEn: 'Full-Stack with Supabase',
    titleAr: 'تطوير Full-Stack مع Supabase',
    descriptionEn:
      'Auth, PostgreSQL, Row Level Security, and Realtime — build complete backends without a server.',
    descriptionAr:
      'المصادقة وPostgreSQL وسياسات الأمان RLS والبيانات اللحظية — ابنِ خلفيات كاملة بدون خوادم.',
    shortDescriptionEn: 'Ship databases, auth and realtime with Supabase.',
    shortDescriptionAr: 'أطلق قواعد البيانات والمصادقة والبيانات اللحظية مع Supabase.',
    category: 'fullstack',
    level: 'intermediate',
    iconName: 'Database',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    instructor: {
      nameEn: 'CloudForge Academy',
      nameAr: 'أكاديمية CloudForge',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      titleEn: 'Senior Backend Engineer',
      titleAr: 'مهندس خلفيات أول',
    },
    accentColor: '#3B82F6',
    rating: 4.8,
    totalStudents: 8900,
    chapters: [
      {
        id: 'ch-3',
        titleEn: 'Chapter 1 — Database & RLS',
        titleAr: 'الفصل 1 — قاعدة البيانات وRLS',
        descriptionEn: 'Tables, relations, indexes and security policies.',
        descriptionAr: 'الجداول والعلاقات والفهارس وسياسات الأمان.',
        lessons: [
          {
            id: 'ls-3-1',
            type: 'video',
            titleEn: 'Designing relational schemas',
            titleAr: 'تصميم المخططات العلائقية',
            duration: '14 min',
            textContentEn:
              '## Relational design\n\n- Normalize data into tables with **Primary Keys**.\n- Link tables with **Foreign Keys**.\n- Speed up lookups with **Indexes**.\n\nExample:\n\n```sql\nCREATE TABLE projects (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE\n);\n```',
          },
          {
            id: 'ls-3-2',
            type: 'article',
            titleEn: 'Row Level Security 101',
            titleAr: 'أساسيات سياسات الأمان RLS',
            duration: '15 min',
            textContentEn:
              '## RLS\n\nRow Level Security lets you scope access per row using the authenticated user:\n\n```sql\nALTER TABLE projects ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "owner access"\nON projects FOR ALL\nUSING (auth.uid() = owner_id);\n```\n\nAlways **disable RLS** for service-role calls only.',
          },
          {
            id: 'ls-3-3',
            type: 'quiz',
            titleEn: 'RLS Quick Quiz',
            titleAr: 'اختبار سريع لـ RLS',
            duration: '6 min',
            quiz: [
              {
                id: 'q-3-1',
                questionEn: 'Which function returns the signed-in user id in Supabase?',
                questionAr: 'ما الدالة التي ترجع معرّف المستخدم المسجل في Supabase؟',
                options: [
                  { id: 'opt-1', textEn: 'auth.uid()', textAr: 'auth.uid()', isCorrect: true },
                  { id: 'opt-2', textEn: 'current_user()', textAr: 'current_user()', isCorrect: false },
                  { id: 'opt-3', textEn: 'now()', textAr: 'now()', isCorrect: false },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'ch-4',
        titleEn: 'Chapter 2 — Auth & Realtime',
        titleAr: 'الفصل 2 — المصادقة والبيانات اللحظية',
        descriptionEn: 'Email OTP, sessions, and Realtime Channels.',
        descriptionAr: 'بريد OTP والجلسات وقنوات البيانات اللحظية.',
        lessons: [
          {
            id: 'ls-4-1',
            type: 'article',
            titleEn: 'Email OTP authentication',
            titleAr: 'المصادقة عبر رمز البريد',
            duration: '9 min',
            textContentEn:
              '## OTP auth\n\n1. `supabase.auth.signInWithOtp({ email })`\n2. User receives a 6-digit code.\n3. `supabase.auth.verifyOtp({ email, token })`\n4. Session is established — done.',
          },
          {
            id: 'ls-4-2',
            type: 'article',
            titleEn: 'Realtime Channels & WebSockets',
            titleAr: 'قنوات البيانات اللحظية وWebSockets',
            duration: '11 min',
            textContentEn:
              `## Realtime\n\n\`\`\`js\nconst channel = supabase\n  .channel('deploy-logs')\n  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'deploy_logs' }, (payload) => {\n    console.log('New log:', payload.new);\n  })\n  .subscribe();\n\`\`\`\n\nUse Realtime for live build logs, dashboards, and chat.`,
          },
        ],
      },
    ],
    finalExam: {
      id: 'exam-final-supabase',
      titleEn: 'Full-Stack Supabase — Final Exam',
      titleAr: 'تطوير Full-Stack مع Supabase — الاختبار النهائي',
      descriptionEn: 'Assess your Supabase mastery.',
      descriptionAr: 'اختبر إتقانك لـ Supabase.',
      passingScore: 80,
      questions: [
        {
          id: 'fq-4',
          questionEn: 'What must be enabled before writing RLS policies?',
          questionAr: 'ما الذي يجب تفعيله قبل كتابة سياسات RLS؟',
          options: [
            { id: 'opt-1', textEn: 'Row Level Security on the table', textAr: 'تفعيل RLS على الجدول', isCorrect: true },
            { id: 'opt-2', textEn: 'A cron job', textAr: 'مهمة مجدولة', isCorrect: false },
            { id: 'opt-3', textEn: 'A CDN', textAr: 'شبكة توزيع محتوى', isCorrect: false },
          ],
        },
        {
          id: 'fq-5',
          questionEn: 'Which API powers live dashboards in Supabase?',
          questionAr: 'أي واجهة تتيح لوحات حية في Supabase؟',
          options: [
            { id: 'opt-1', textEn: 'Realtime Channels', textAr: 'قنوات البيانات اللحظية', isCorrect: true },
            { id: 'opt-2', textEn: 'Storage only', textAr: 'التخزين فقط', isCorrect: false },
            { id: 'opt-3', textEn: 'SMS API', textAr: 'واجهة الرسائل النصية', isCorrect: false },
          ],
        },
        {
          id: 'fq-6',
          questionEn: 'Foreign keys enforce…?',
          questionAr: 'المفاتيح الأجنبية تضمن…؟',
          options: [
            { id: 'opt-1', textEn: 'Referential integrity', textAr: 'سلامة العلاقات', isCorrect: true },
            { id: 'opt-2', textEn: 'Email delivery', textAr: 'تسليم البريد', isCorrect: false },
            { id: 'opt-3', textEn: 'CSS styling', textAr: 'تنسيق CSS', isCorrect: false },
          ],
        },
      ],
    },
  },
  {
    id: 'track-ai-engineering',
    slug: 'ai-engineering',
    titleEn: 'AI Application Engineering',
    titleAr: 'هندسة تطبيقات الذكاء الاصطناعي',
    descriptionEn:
      'Prompt engineering, LLM APIs, edge functions, and shipping AI features safely.',
    descriptionAr:
      'هندسة الأوامر وواجهات نماذج اللغة ودوال الحافة ونشر ميزات الذكاء الاصطناعي بأمان.',
    shortDescriptionEn: 'Build production AI features with LLM APIs.',
    shortDescriptionAr: 'ابنِ ميزات ذكاء اصطناعي إنتاجية مع واجهات نماذج اللغة.',
    category: 'ai',
    level: 'advanced',
    iconName: 'Brain',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1677442136019-a2172ecb1dee?auto=format&fit=crop&w=800&q=80',
    instructor: {
      nameEn: 'CloudForge Academy',
      nameAr: 'أكاديمية CloudForge',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      titleEn: 'AI Solutions Architect',
      titleAr: 'مهندس حلول ذكاء اصطناعي',
    },
    accentColor: '#7928CA',
    rating: 4.9,
    totalStudents: 6400,
    chapters: [
      {
        id: 'ch-5',
        titleEn: 'Chapter 1 — LLM APIs & Prompts',
        titleAr: 'الفصل 1 — نماذج اللغة والأوامر',
        descriptionEn: 'Tokens, temperature, system prompts.',
        descriptionAr: 'الرموز ودرجة الحرارة وأوامر النظام.',
        lessons: [
          {
            id: 'ls-5-1',
            type: 'article',
            titleEn: 'Anatomy of a great prompt',
            titleAr: 'تشريح أمر فعّال',
            duration: '12 min',
            textContentEn:
              '## Prompt anatomy\n\n1. **Role** — "You are a senior React engineer."\n2. **Task** — "Refactor this component."\n3. **Context** — include relevant files.\n4. **Constraints** — "Use TypeScript, no external state lib."\n5. **Output format** — "Return JSON."',
          },
          {
            id: 'ls-5-2',
            type: 'video',
            titleEn: 'OpenAI & Anthropic APIs',
            titleAr: 'واجهات OpenAI و Anthropic',
            duration: '16 min',
            textContentEn:
              '## LLM APIs\n\nBoth providers expose chat completions:\n\n```js\nconst res = await fetch(\'https://api.openai.com/v1/chat/completions\', {\n  method: \'POST\',\n  headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },\n  body: JSON.stringify({ model: \'gpt-4o\', messages: [{ role: \'user\', content: prompt }] }),\n});\n```\n\nNever expose keys to the browser — call through an edge function.',
          },
          {
            id: 'ls-5-3',
            type: 'quiz',
            titleEn: 'Prompting Quiz',
            titleAr: 'اختبار الأوامر',
            duration: '6 min',
            quiz: [
              {
                id: 'q-5-1',
                questionEn: 'Where should API keys live in production?',
                questionAr: 'أين يجب حفظ مفاتيح API في بيئة الإنتاج؟',
                options: [
                  { id: 'opt-1', textEn: 'Server environment variables', textAr: 'متغيرات بيئة الخادم', isCorrect: true },
                  { id: 'opt-2', textEn: 'Frontend source code', textAr: 'كود الواجهة', isCorrect: false },
                  { id: 'opt-3', textEn: 'Public URLs', textAr: 'روابط عامة', isCorrect: false },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'ch-6',
        titleEn: 'Chapter 2 — Edge Functions',
        titleAr: 'الفصل 2 — دوال الحافة',
        descriptionEn: 'Serverless AI proxies and streaming.',
        descriptionAr: 'وسطاء ذكاء اصطناعي بدون خوادم والبث المباشر.',
        lessons: [
          {
            id: 'ls-6-1',
            type: 'article',
            titleEn: 'Why edge functions for AI',
            titleAr: 'لماذا دوال الحافة للذكاء الاصطناعي',
            duration: '10 min',
            textContentEn:
              '## Edge + AI\n\nEdge functions run close to your users, hold secrets safely, and can stream LLM responses with low latency. CloudForge ships AI completion through Supabase Edge Functions.',
          },
          {
            id: 'ls-6-2',
            type: 'coding_challenge',
            titleEn: 'Challenge: secure AI proxy',
            titleAr: 'تحدي: وسيط ذكاء اصطناعي آمن',
            duration: '20 min',
            textContentEn:
              '## Challenge\n\nWrite an edge function that accepts a prompt, calls the LLM provider, and returns the completion — without ever exposing the key.',
          },
        ],
      },
    ],
    finalExam: {
      id: 'exam-final-ai',
      titleEn: 'AI Engineering — Final Exam',
      titleAr: 'هندسة الذكاء الاصطناعي — الاختبار النهائي',
      descriptionEn: 'Assess your AI application engineering skills.',
      descriptionAr: 'اختبر مهاراتك في هندسة تطبيقات الذكاء الاصطناعي.',
      passingScore: 80,
      questions: [
        {
          id: 'fq-7',
          questionEn: 'API keys in client-side code are…?',
          questionAr: 'مفاتيح API في كود الواجهة تعتبر…؟',
          options: [
            { id: 'opt-1', textEn: 'A security risk', textAr: 'خطراً أمنياً', isCorrect: true },
            { id: 'opt-2', textEn: 'Best practice', textAr: 'أفضل ممارسة', isCorrect: false },
            { id: 'opt-3', textEn: 'Required for SSR', textAr: 'مطلوبة لـ SSR', isCorrect: false },
          ],
        },
        {
          id: 'fq-8',
          questionEn: 'Which parameter controls randomness in LLM output?',
          questionAr: 'أي معامل يتحكم في عشوائية مخرجات النموذج؟',
          options: [
            { id: 'opt-1', textEn: 'temperature', textAr: 'temperature', isCorrect: true },
            { id: 'opt-2', textEn: 'timeout', textAr: 'timeout', isCorrect: false },
            { id: 'opt-3', textEn: 'max_retries', textAr: 'max_retries', isCorrect: false },
          ],
        },
        {
          id: 'fq-9',
          questionEn: 'Edge functions are ideal for AI because they…?',
          questionAr: 'دوال الحافة مثالية للذكاء الاصطناعي لأنها…؟',
          options: [
            { id: 'opt-1', textEn: 'Keep secrets server-side & reduce latency', textAr: 'تحفظ الأسرار وتقلل زمن الاستجابة', isCorrect: true },
            { id: 'opt-2', textEn: 'Run in the browser', textAr: 'تعمل في المتصفح', isCorrect: false },
            { id: 'opt-3', textEn: 'Replace databases', textAr: 'تحل محل قواعد البيانات', isCorrect: false },
          ],
        },
      ],
    },
  },
];
