/**
 * CloudForge — Built-in Marketplace Templates (self-contained data)
 * ------------------------------------------------------------------
 * A curated set of production-ready starter templates, fully embedded as
 * static TypeScript constants. No remote fetch, no external JSON — every
 * template bundles its own project files so the Marketplace always works.
 */
import type { TemplateItem } from '@/types';

const base = 'https://images.unsplash.com/photo-';

export const MARKETPLACE_TEMPLATES: TemplateItem[] = [
  {
    id: 'tpl-saas-landing',
    title: 'SaaS Landing Page',
    titleAr: 'صفحة هبوط SaaS احترافية',
    description:
      'High-converting SaaS marketing site with pricing, features, testimonials, and newsletter capture.',
    descriptionAr:
      'موقع تسويقي احترافي لمنتجات SaaS مع قسم الأسعار والمميزات وآراء العملاء والنشرة البريدية.',
    category: 'saas',
    badge: 'SaaS',
    image: `${base}1467232004584-a2411f6d1c3a?auto=format&fit=crop&w=800&q=80`,
    files: [
      {
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Acme SaaS — Ship faster</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="nav">
    <strong>Acme</strong>
    <nav><a href="#features">Features</a><a href="#pricing">Pricing</a></nav>
  </header>
  <main>
    <section class="hero">
      <h1>Build your next SaaS in days</h1>
      <p>Landing pages, auth, billing — all included.</p>
      <button class="cta">Start Free</button>
    </section>
    <section id="features"><h2>Features</h2></section>
    <section id="pricing"><h2>Pricing</h2></section>
  </main>
  <script src="app.js"></script>
</body>
</html>`,
      },
      {
        path: 'styles.css',
        content: `body { margin: 0; font-family: system-ui, sans-serif; background: #0b0f19; color: #e2e8f0; }
.nav { display: flex; justify-content: space-between; padding: 1rem 2rem; }
.hero { padding: 6rem 2rem; text-align: center; }
.cta { background: linear-gradient(90deg,#00f2fe,#7928ca); border: 0; padding: 0.9rem 1.6rem; border-radius: 12px; font-weight: 700; color: #0b0f19; cursor: pointer; }`,
      },
      {
        path: 'app.js',
        content: `// Acme SaaS — interactions
document.querySelector('.cta')?.addEventListener('click', () => {
  alert('Welcome aboard! 🚀');
});`,
      },
    ],
  },
  {
    id: 'tpl-ecommerce-store',
    title: 'E-Commerce Storefront',
    titleAr: 'متجر إلكتروني متكامل',
    description:
      'Full storefront with product grid, cart drawer, and Stripe-ready checkout structure.',
    descriptionAr:
      'متجر كامل مع شبكة منتجات وسلة مشتريات منزلقة وهيكل دفع جاهز للتكامل مع Stripe.',
    category: 'ecommerce',
    badge: 'E-COMM',
    image: `${base}1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80`,
    files: [
      {
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shoply — Modern Commerce</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="topbar"><h1>Shoply</h1><button id="cartBtn">Cart (0)</button></header>
  <main id="products" class="grid"></main>
  <aside id="cartDrawer" class="drawer hidden"><h2>Your Cart</h2><ul id="cartList"></ul></aside>
  <script src="app.js"></script>
</body>
</html>`,
      },
      {
        path: 'styles.css',
        content: `body { margin: 0; font-family: system-ui, sans-serif; background: #f8fafc; color: #0f172a; }
.topbar { display: flex; justify-content: space-between; padding: 1rem 2rem; background: #0f172a; color: #fff; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; padding: 2rem; }
.card { background: #fff; border-radius: 16px; padding: 1rem; box-shadow: 0 4px 16px rgba(2,6,23,.08); }
.drawer { position: fixed; right: 0; top: 0; height: 100vh; width: 320px; background: #fff; box-shadow: -4px 0 24px rgba(2,6,23,.2); padding: 2rem; }
.hidden { display: none; }`,
      },
      {
        path: 'app.js',
        content: `const products = [
  { id: 1, name: 'Wireless Headphones', price: 89 },
  { id: 2, name: 'Mechanical Keyboard', price: 129 },
  { id: 3, name: 'Ergonomic Mouse', price: 49 },
];
let cart = [];
const grid = document.getElementById('products');
grid.innerHTML = products.map((p) =>
  \`<div class="card"><h3>\${p.name}</h3><p>$\${p.price}</p><button data-id="\${p.id}">Add to cart</button></div>\`
).join('');
grid.addEventListener('click', (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;
  cart.push(products.find((p) => p.id === id));
  document.getElementById('cartBtn').textContent = \`Cart (\${cart.length})\`;
});`,
      },
    ],
  },
  {
    id: 'tpl-admin-dashboard',
    title: 'Analytics Admin Dashboard',
    titleAr: 'لوحة تحليلات إدارية',
    description:
      'Dark analytics console with KPI cards, charts placeholders, and a data table — Supabase-ready.',
    descriptionAr:
      'لوحة تحليلات داكنة مع بطاقات مؤشرات ورسوم بيانية وجدول بيانات — جاهزة للربط مع Supabase.',
    category: 'dashboard',
    badge: 'ADMIN',
    image: `${base}1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80`,
    files: [
      {
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pulse — Analytics</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <aside class="sidebar"><h2>Pulse</h2><nav><a>Overview</a><a>Users</a><a>Billing</a></nav></aside>
  <main>
    <div class="kpis"><div class="kpi">Revenue<br/><strong>$12,480</strong></div><div class="kpi">Users<br/><strong>8,240</strong></div><div class="kpi">Churn<br/><strong>1.2%</strong></div></div>
    <table id="tbl"></table>
  </main>
  <script src="app.js"></script>
</body>
</html>`,
      },
      {
        path: 'styles.css',
        content: `body { margin: 0; display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; background: #0b0f19; color: #e2e8f0; font-family: system-ui; }
.sidebar { background: #0f172a; padding: 1.5rem; }
.kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 1.5rem; }
.kpi { background: #111827; border: 1px solid #1e293b; border-radius: 14px; padding: 1rem; }
table { width: calc(100% - 3rem); margin: 0 1.5rem; border-collapse: collapse; }
td, th { border-bottom: 1px solid #1e293b; padding: 0.7rem; text-align: left; }`,
      },
      {
        path: 'app.js',
        content: `const rows = [
  ['#1021', 'Acme Corp', 'Pro', '$299'],
  ['#1022', 'Globex', 'Enterprise', '$899'],
  ['#1023', 'Initech', 'Free', '$0'],
];
document.getElementById('tbl').innerHTML =
  '<tr><th>ID</th><th>Company</th><th>Plan</th><th>MRR</th></tr>' +
  rows.map((r) => \`<tr>\${r.map((c) => \`<td>\${c}</td>\`).join('')}</tr>\`).join('');`,
      },
    ],
  },
  {
    id: 'tpl-ai-chatbot',
    title: 'AI Chat Assistant UI',
    titleAr: 'واجهة مساعد ذكي للمحادثة',
    description:
      'Polished chat UI with streaming-style bubbles, suggested prompts, and an API hook.',
    descriptionAr:
      'واجهة محادثة أنيقة مع فقاعات بأسلوب البث المباشر واقتراحات جاهزة ونقطة ربط مع API.',
    category: 'ai',
    badge: 'AI',
    image: `${base}1677442136019-a2172ecb1dee?auto=format&fit=crop&w=800&q=80`,
    files: [
      {
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Neural Chat</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="chat">
    <div id="messages"></div>
    <form id="composer"><input id="input" placeholder="Ask anything..." /><button>Send</button></form>
  </main>
  <script src="app.js"></script>
</body>
</html>`,
      },
      {
        path: 'styles.css',
        content: `body { margin: 0; height: 100vh; display: flex; background: #0b0f19; color: #e2e8f0; font-family: system-ui; }
.chat { width: 100%; max-width: 720px; margin: auto; display: flex; flex-direction: column; gap: 1rem; padding: 1rem; }
#messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.6rem; }
.bubble { max-width: 75%; padding: 0.7rem 1rem; border-radius: 16px; }
.bubble.user { align-self: flex-end; background: linear-gradient(90deg,#00f2fe,#3b82f6); color: #0b0f19; }
.bubble.bot { align-self: flex-start; background: #111827; border: 1px solid #1e293b; }
#composer { display: flex; gap: 0.5rem; }
#input { flex: 1; padding: 0.8rem; border-radius: 12px; border: 1px solid #1e293b; background: #111827; color: #e2e8f0; }`,
      },
      {
        path: 'app.js',
        content: `const messages = document.getElementById('messages');
function addBubble(text, who) {
  const div = document.createElement('div');
  div.className = \`bubble \${who}\`;
  div.textContent = text;
  messages.appendChild(div);
}
addBubble('Hello! I am your AI assistant. How can I help?', 'bot');
document.getElementById('composer').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('input');
  const text = input.value.trim();
  if (!text) return;
  addBubble(text, 'user');
  input.value = '';
  // Hook your AI endpoint here:
  addBubble('...', 'bot');
});`,
      },
    ],
  },
  {
    id: 'tpl-corporate-site',
    title: 'Corporate / Agency Site',
    titleAr: 'موقع شركة أو وكالة',
    description:
      'Elegant corporate website with services, team, contact form, and dark theme.',
    descriptionAr:
      'موقع شركة أنيق مع قسم الخدمات والفريق ونموذج تواصل وثيم داكن عصري.',
    category: 'landing',
    badge: 'CORP',
    image: `${base}1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80`,
    files: [
      {
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vertex Agency</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header><h1>Vertex</h1><nav><a>Services</a><a>Team</a><a>Contact</a></nav></header>
  <section class="hero"><h2>We build digital products that matter.</h2><p>Strategy · Design · Engineering</p></section>
  <section id="services"></section>
  <section id="team"></section>
  <footer>© 2026 Vertex Agency</footer>
  <script src="app.js"></script>
</body>
</html>`,
      },
      {
        path: 'styles.css',
        content: `body { margin: 0; font-family: system-ui; background: #0b0f19; color: #e2e8f0; }
header { display: flex; justify-content: space-between; padding: 1.2rem 2rem; border-bottom: 1px solid #1e293b; }
.hero { padding: 5rem 2rem; text-align: center; }
footer { padding: 2rem; text-align: center; color: #64748b; }`,
      },
      {
        path: 'app.js',
        content: `const services = ['Product Strategy', 'UI/UX Design', 'Cloud Engineering'];
document.getElementById('services').innerHTML =
  '<h2>Services</h2><ul>' + services.map((s) => \`<li>\${s}</li>\`).join('') + '</ul>';`,
      },
    ],
  },
  {
    id: 'tpl-rest-api',
    title: 'REST API + Supabase Starter',
    titleAr: 'قاعدة REST API مع Supabase',
    description:
      'Backend starter with Express-style routes, Supabase client setup, and environment-safe config.',
    descriptionAr:
      'قاعدة خلفية بنمط Express مع إعداد عميل Supabase وإعدادات بيئة آمنة.',
    category: 'dashboard',
    badge: 'API',
    image: `${base}1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80`,
    files: [
      {
        path: 'server.js',
        content: `// CloudForge REST API Starter
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(req) {
  const { method, url } = req;
  if (method === 'GET' && url === '/api/health') {
    return { statusCode: 200, body: JSON.stringify({ ok: true, service: 'cloudforge-api' }) };
  }
  return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
}`,
      },
      {
        path: 'README.md',
        content: `# CloudForge REST API Starter

- Deploy on Vercel as Serverless Functions.
- Set \`NEXT_PUBLIC_SUPABASE_URL\` and \`SUPABASE_SERVICE_ROLE_KEY\` in your environment.
- Add routes under \`/api/*\` and wire Row Level Security on the Supabase side.`,
      },
      {
        path: '.env.example',
        content: `NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-... # optional`,
      },
    ],
  },
];
