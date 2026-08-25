import type { ProjectFile, TemplateItem } from '@/types';
import { MARKETPLACE_TEMPLATES } from './templates';

const previewImages = {
  website: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80',
  saas: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
  ecommerce: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
  app: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=900&q=80',
  schema: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
};

const starterFiles = (title: string, kind: string): ProjectFile[] => [
  {
    path: 'index.html',
    language: 'html',
    content: `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="shell">
    <span class="eyebrow">CloudForge ${kind}</span>
    <h1>${title}</h1>
    <p>Production-ready starter structure. Connect your data and provider credentials on the server.</p>
    <button id="start">Open workspace</button>
  </main>
  <script src="app.js"></script>
</body>
</html>`,
  },
  {
    path: 'styles.css',
    language: 'css',
    content: `:root { color-scheme: dark; font-family: Inter, system-ui, sans-serif; }
body { margin: 0; min-height: 100vh; background: #0b0f19; color: #e2e8f0; }
.shell { max-width: 760px; margin: 0 auto; padding: 18vh 2rem; }
.eyebrow { color: #00f2fe; font-size: .75rem; letter-spacing: .16em; text-transform: uppercase; font-weight: 800; }
h1 { font-size: clamp(2.5rem, 7vw, 5rem); line-height: .98; margin: 1rem 0; }
p { max-width: 34rem; color: #94a3b8; line-height: 1.7; }
button { border: 0; border-radius: 12px; padding: .85rem 1.2rem; background: linear-gradient(90deg,#00f2fe,#7928ca); color: #08111d; font-weight: 800; cursor: pointer; }`,
  },
  {
    path: 'app.js',
    language: 'javascript',
    content: `document.querySelector('#start')?.addEventListener('click', () => {
  document.querySelector('#start').textContent = 'Workspace ready';
});`,
  },
  {
    path: 'README.md',
    language: 'markdown',
    content: `# ${title}\n\nGenerated from the CloudForge Marketplace. Keep provider secrets server-side and enable RLS before production deployment.`,
  },
];

const catalogItem = (
  id: string,
  title: string,
  titleAr: string,
  description: string,
  descriptionAr: string,
  category: TemplateItem['category'],
  badge: string,
  image: keyof typeof previewImages,
  kind: string,
): TemplateItem => ({
  id,
  title,
  titleAr,
  description,
  descriptionAr,
  category,
  badge,
  image: previewImages[image],
  files: starterFiles(title, kind),
});

const GLOBAL_CATALOG: TemplateItem[] = [
  catalogItem('web-corporate-global', 'Global Corporate System', 'نظام شركة عالمي', 'Corporate website with multilingual pages, trust sections, careers, and contact flows.', 'موقع شركة متعدد اللغات مع صفحات الثقة والوظائف والتواصل.', 'website', 'WEBSITE', 'website', 'Website'),
  catalogItem('web-agency-studio', 'Agency Studio Portfolio', 'محفظة وكالة إبداعية', 'Agency portfolio with case studies, service packages, and conversion-ready contact sections.', 'محفظة وكالة مع دراسات حالة وباقات خدمات وأقسام تواصل عالية التحويل.', 'website', 'AGENCY', 'website', 'Website'),
  catalogItem('web-creator-portfolio', 'Creator Portfolio', 'محفظة أعمال شخصية', 'Personal portfolio for creators, consultants, and independent professionals.', 'محفظة شخصية للمبدعين والاستشاريين والمستقلين.', 'website', 'PORTFOLIO', 'website', 'Website'),
  catalogItem('web-personal-profile', 'Personal Profile', 'موقع شخصي احترافي', 'Fast personal profile with about, links, services, and a compact contact form.', 'موقع شخصي سريع مع نبذة وروابط وخدمات ونموذج تواصل مختصر.', 'website', 'PERSONAL', 'website', 'Website'),
  catalogItem('web-editorial-blog', 'Editorial Blog', 'مدونة تحريرية', 'Accessible editorial blog structure with categories, author pages, and SEO-ready metadata.', 'هيكل مدونة تحريرية مع تصنيفات وصفحات كتاب وبيانات SEO جاهزة.', 'website', 'BLOG', 'website', 'Website'),
  catalogItem('saas-admin-cloud', 'Cloud Admin Console', 'لوحة إدارة سحابية', 'Role-aware SaaS admin workspace with KPI surfaces and operational views.', 'مساحة SaaS إدارية بالصلاحيات مع مؤشرات أداء وواجهات تشغيل.', 'saas', 'SAAS', 'saas', 'SaaS'),
  catalogItem('saas-learning-hub', 'Learning Management Hub', 'منصة تعليمية سحابية', 'Course catalog, learner progress, quizzes, and certificate-ready data model.', 'كتالوج دورات وتقدم متعلمين واختبارات ونموذج شهادات جاهز.', 'saas', 'EDTECH', 'saas', 'SaaS'),
  catalogItem('saas-subscription-manager', 'Subscription Manager', 'نظام إدارة الاشتراكات', 'Plan catalog, customer portal, invoices, and webhook-ready billing events.', 'كتالوج خطط وبوابة عميل وفواتير وأحداث فوترة جاهزة للويبهوكس.', 'saas', 'BILLING', 'saas', 'SaaS'),
  catalogItem('commerce-retail-core', 'Retail Commerce Core', 'متجر تجزئة عصري', 'Retail storefront with catalog, inventory placeholders, cart, and checkout handoff.', 'متجر تجزئة مع كتالوج ومخزون وسلة وتحويل آمن إلى الدفع.', 'ecommerce', 'RETAIL', 'ecommerce', 'E-Commerce'),
  catalogItem('commerce-digital-products', 'Digital Products Store', 'متجر منتجات رقمية', 'Digital product storefront with gated delivery and purchase status placeholders.', 'متجر منتجات رقمية مع تسليم محمي وحالات شراء جاهزة للربط.', 'ecommerce', 'DIGITAL', 'ecommerce', 'E-Commerce'),
  catalogItem('commerce-marketplace', 'Multi-Vendor Marketplace', 'منصة متعددة التجار', 'Multi-vendor marketplace foundation with seller onboarding and order boundaries.', 'أساس منصة متعددة التجار مع تسجيل البائعين وحدود الطلبات.', 'ecommerce', 'MULTI-VENDOR', 'ecommerce', 'E-Commerce'),
  catalogItem('app-ai-chat', 'AI Chat Workspace', 'تطبيق شات بالذكاء الاصطناعي', 'Human-friendly AI chat shell with provider-safe server integration points.', 'واجهة شات ودية مع نقاط ربط خادمية آمنة لمزوّد الذكاء الاصطناعي.', 'app', 'AI APP', 'app', 'App'),
  catalogItem('app-data-analytics', 'Data Analytics Studio', 'استوديو تحليل البيانات', 'Analytics application shell with filters, event views, and export surfaces.', 'هيكل تطبيق تحليلات مع فلاتر وواجهات أحداث وتصدير.', 'app', 'ANALYTICS', 'app', 'App'),
  catalogItem('app-seo-toolkit', 'SEO Operations Toolkit', 'أدوات SEO تشغيلية', 'SEO audit workspace with metadata, sitemap, and technical checklist views.', 'مساحة تدقيق SEO مع بيانات وصفية وSitemap وقائمة فحص تقنية.', 'app', 'SEO', 'app', 'App'),
  catalogItem('schema-supabase-rbac', 'Supabase RLS Schema', 'قاعدة Supabase مع RLS', 'Isolated Supabase schema starter with profile, workspace, project, and role boundaries.', 'قاعدة Supabase معزولة للملفات ومساحات العمل والمشاريع والصلاحيات.', 'schema', 'SUPABASE', 'schema', 'Schema'),
  catalogItem('schema-rest-service', 'REST Micro-Service', 'خدمة REST جاهزة', 'REST service starter with health endpoint, validation boundary, and environment-safe config.', 'خدمة REST مع نقطة صحة وحدود تحقق وإعدادات بيئة آمنة.', 'schema', 'REST API', 'schema', 'API'),
];

export const MARKETPLACE_CATALOG: TemplateItem[] = [...MARKETPLACE_TEMPLATES, ...GLOBAL_CATALOG];
