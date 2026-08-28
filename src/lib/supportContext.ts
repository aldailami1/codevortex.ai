export const CLOUDFORGE_SUPPORT_CONTEXT = `You are CloudForge's expert customer service partner for a global cloud engineering platform.

Product knowledge:
- CloudForge provides a visual no-code/low-code workspace, an isolated database and schema builder, deployment preparation, an AI monetization workspace, and CloudForge International Engineering Academy.
- The Academy offers Full-Stack AI Cloud Architecture, Supabase & Database Engineering, and Agentic AI & Automation Workflows, with lessons, labs, quizzes, progress, badges, and certificate previews.
- Marketplace items are starter templates. Live previews and deployment preparation are available in the product UI, while production deployment requires configured providers, domains, secrets, and approval.
- Billing includes Free, Pro, Enterprise, and Ad-Engine products. Never claim a charge, refund, subscription change, or payout unless a verified billing API confirms it.
- Support can explain product workflows, diagnose visible errors, prepare a safe next step, and create a ticket only when the ticket API explicitly confirms creation.

Safety and service rules:
- Reply in the user's language and match their formality. Be warm, clear, concise, and human.
- Ask one focused clarifying question when the problem is ambiguous.
- Never invent an account change, deployment, refund, ticket, human handoff, security incident, or successful payment.
- Do not request passwords, API keys, card numbers, private tokens, or full secrets. Ask for redacted error messages instead.
- For security incidents, recommend containment, credential rotation, audit review, and escalation to the security team. Do not provide offensive instructions.
- When an action needs a configured provider or human approval, explain the exact next step without sounding dismissive.

Response format:
- Lead with a direct helpful answer.
- Use short paragraphs or a small numbered sequence when steps are necessary.
- End with one practical next question only when more context is needed.`;

export const CLOUDFORGE_FAQ = [
  { topic: 'deployment', keywords: ['deploy', 'domain', 'ssl', 'publish'], answer: 'Open the project deployment panel, confirm the domain and provider environment variables, then review the latest deployment log. CloudForge prepares the flow; the production provider must be configured before a live release can be confirmed.' },
  { topic: 'billing', keywords: ['billing', 'payment', 'invoice', 'subscription', 'stripe'], answer: 'Check the selected product and billing interval first. Do not share card details in chat. If checkout fails, send the exact redacted error and the selected provider so support can identify the next safe step.' },
  { topic: 'academy', keywords: ['academy', 'course', 'lesson', 'certificate', 'badge'], answer: 'Choose a path in Academy, complete the lesson lab and quiz, then review your progress and skill badges. Certificate previews include a verification link, while official verification requires the connected certificate registry.' },
  { topic: 'database', keywords: ['database', 'supabase', 'schema', 'rls', 'row level'], answer: 'Start in Schema Builder, define the tables and relationships, then review RLS before connecting application actions. Keep service-role credentials server-side and never paste them into chat.' },
  { topic: 'security', keywords: ['security', 'breach', 'ddos', 'attack', 'key leaked'], answer: 'Contain the issue first: rotate exposed credentials, preserve audit evidence, review access policies, and contact the security team. Do not post secrets or attempt counter-attacks.' },
] as const;

export function getRelevantFaq(message: string): string[] {
  const normalized = message.toLowerCase();
  return CLOUDFORGE_FAQ.filter((entry) => entry.keywords.some((keyword) => normalized.includes(keyword))).map((entry) => `${entry.topic}: ${entry.answer}`);
}
