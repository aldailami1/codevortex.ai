import { createClient } from '@supabase/supabase-js';
import { isArText, json, jsonError } from '@/lib/api';
import { CLOUDFORGE_SUPPORT_CONTEXT, getRelevantFaq } from '@/lib/supportContext';

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_ITEMS = 10;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createConversationId() {
  return crypto.randomUUID();
}

function fallbackReply(message: string, ar: boolean) {
  const normalized = message.toLowerCase();
  const faq = getRelevantFaq(message)[0];
  if (faq) return faq.replace(/^[^:]+:\s*/, '');
  if (ar) {
    if (normalized.includes('خطأ') || normalized.includes('مشكلة')) return 'أفهم أن هناك مشكلة. أرسل نص الخطأ بعد إخفاء أي مفاتيح أو بيانات شخصية، واذكر الصفحة والخطوة التي ظهر فيها حتى نحدد المسار الآمن التالي.';
    return 'أهلاً بك في CloudForge. أخبرني بما تحاول بناءه أو أين توقفت، وسأساعدك خطوة بخطوة. لا تشارك كلمات المرور أو مفاتيح API داخل المحادثة.';
  }
  if (normalized.includes('error') || normalized.includes('issue')) return 'I understand something is blocking you. Share the exact error with secrets and personal data redacted, plus the page and step where it appeared, and we will identify the safest next step.';
  return 'Welcome to CloudForge. Tell me what you are building or where you are stuck, and I will guide you step by step. Please do not share passwords or API keys in chat.';
}

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function persistMessage(conversationId: string, role: 'user' | 'assistant', content: string, metadata: Record<string, unknown> = {}) {
  const supabase = getServerSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from('support_messages').insert({ conversation_id: conversationId, role, content, metadata });
  return !error;
}

async function loadHistory(conversationId: string) {
  const supabase = getServerSupabase();
  if (!supabase) return [] as Array<{ role: 'user' | 'assistant'; content: string }>;
  const { data } = await supabase.from('support_messages').select('role, content').eq('conversation_id', conversationId).order('created_at', { ascending: false }).limit(MAX_HISTORY_ITEMS);
  return (data || []).reverse().filter((item): item is { role: 'user' | 'assistant'; content: string } => (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string');
}

async function ensureConversation(conversationId: string, language: string) {
  const supabase = getServerSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from('support_conversations').upsert({ id: conversationId, language: language || 'en', channel: 'web_widget', status: 'open', updated_at: new Date().toISOString() }, { onConflict: 'id', ignoreDuplicates: true });
  return !error;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';
    const message = rawMessage.slice(0, MAX_MESSAGE_LENGTH);
    const language = typeof body.language === 'string' ? body.language : 'en';
    const ar = language === 'ar' || isArText(message);
    if (!message) return jsonError(ar ? 'اكتب رسالتك أولاً' : 'Please write a message first', 400);

    const requestedConversationId = typeof body.conversationId === 'string' && UUID_PATTERN.test(body.conversationId) ? body.conversationId : '';
    const conversationId = requestedConversationId || createConversationId();
    const persistedConversation = await ensureConversation(conversationId, ar ? 'ar' : 'en');
    const history = await loadHistory(conversationId);
    await persistMessage(conversationId, 'user', message, { language: ar ? 'ar' : 'en', source: 'web_widget' });

    let reply = '';
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const relevantFaq = getRelevantFaq(message);
        const context = relevantFaq.length ? `${CLOUDFORGE_SUPPORT_CONTEXT}\n\nRelevant CloudForge knowledge:\n${relevantFaq.join('\n')}` : CLOUDFORGE_SUPPORT_CONTEXT;
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
          body: JSON.stringify({
            model: process.env.OPENAI_SUPPORT_MODEL || 'gpt-4o-mini',
            temperature: 0.35,
            max_tokens: 500,
            messages: [{ role: 'system', content: `${context}\n\nReply in ${ar ? 'Arabic' : 'English'}.` }, ...history, { role: 'user', content: message }],
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const candidate = data?.choices?.[0]?.message?.content;
          if (typeof candidate === 'string') reply = candidate.trim();
        }
      } catch {
        reply = '';
      }
    }

    reply = reply || fallbackReply(message, ar);
    const persistedAssistant = await persistMessage(conversationId, 'assistant', reply, { provider: openaiKey ? 'openai_or_fallback' : 'deterministic_fallback' });
    return json({ reply, conversationId, persisted: persistedConversation && persistedAssistant, provider: openaiKey ? 'ai_or_fallback' : 'deterministic' });
  } catch {
    return jsonError('Chat failed', 500);
  }
}
