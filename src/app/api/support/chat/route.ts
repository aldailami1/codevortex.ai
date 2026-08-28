import { createClient } from '@supabase/supabase-js';
import { isArText, json, jsonError } from '@/lib/api';
import { CLOUDFORGE_SUPPORT_CONTEXT, getRelevantFaq } from '@/lib/supportContext';

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_ITEMS = 10;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createConversationId() {
  return crypto.randomUUID();
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

    const openaiKey = process.env.OPENAI_API_KEY;
    const requestedConversationId = typeof body.conversationId === 'string' && UUID_PATTERN.test(body.conversationId) ? body.conversationId : '';
    const conversationId = requestedConversationId || createConversationId();
    const persistedConversation = await ensureConversation(conversationId, ar ? 'ar' : 'en');
    const history = await loadHistory(conversationId);
    const persistedUserMessage = await persistMessage(conversationId, 'user', message, { language: ar ? 'ar' : 'en', source: 'web_widget' });

    if (!openaiKey) {
      return jsonError(ar ? 'خدمة الذكاء الاصطناعي غير مهيأة حالياً.' : 'AI support is not configured for this environment.', 503, { code: 'AI_PROVIDER_NOT_CONFIGURED', conversationId, persisted: persistedConversation && persistedUserMessage });
    }

    const relevantFaq = getRelevantFaq(message);
    const context = relevantFaq.length ? `${CLOUDFORGE_SUPPORT_CONTEXT}\n\nRelevant CloudForge knowledge:\n${relevantFaq.join('\n')}` : CLOUDFORGE_SUPPORT_CONTEXT;
    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: process.env.OPENAI_SUPPORT_MODEL || 'gpt-4o-mini',
          temperature: 0.35,
          max_tokens: 500,
          messages: [{ role: 'system', content: `${context}\n\nReply in ${ar ? 'Arabic' : 'English'}.` }, ...history, { role: 'user', content: message }],
        }),
      });
    } catch {
      return jsonError(ar ? 'تعذر الوصول إلى مزود الذكاء الاصطناعي.' : 'The AI provider could not be reached.', 502, { code: 'AI_PROVIDER_UNREACHABLE', conversationId, persisted: persistedConversation && persistedUserMessage });
    }

    if (!response.ok) {
      return jsonError(ar ? 'رفض مزود الذكاء الاصطناعي الطلب.' : 'The AI provider rejected the request.', 502, { code: 'AI_PROVIDER_ERROR', conversationId, persisted: persistedConversation && persistedUserMessage });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) return jsonError(ar ? 'لم يعد مزود الذكاء الاصطناعي برد صالح.' : 'The AI provider returned no usable response.', 502, { code: 'AI_EMPTY_RESPONSE', conversationId });

    const persistedAssistant = await persistMessage(conversationId, 'assistant', reply.trim(), { provider: 'openai', model: process.env.OPENAI_SUPPORT_MODEL || 'gpt-4o-mini' });
    return json({ reply: reply.trim(), conversationId, persisted: persistedConversation && persistedAssistant, provider: 'openai' });
  } catch {
    return jsonError('Chat failed', 500);
  }
}
