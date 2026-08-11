/**
 * CloudForge — AI Completion Edge Function
 * ------------------------------------------------------------------
 * Multi-provider LLM gateway (OpenAI → Anthropic → Gemini fallback).
 * Keys live only in Supabase secrets — never in the client bundle.
 * Accepts: { action: 'generate'|'refine'|'chat', prompt, currentFiles?, language? }
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY');
const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY');

const SYSTEM_PROMPT =
  'You are CloudForge, an expert full-stack architect. ' +
  'Given a user prompt, return STRICT JSON: ' +
  '{"title": string, "description": string, "isRTL": boolean, ' +
  '"files": [{"path": string, "content": string}]}. ' +
  'Generate 3 production-quality starter files (index.html, styles.css, app.js), ' +
  'dark theme, RTL when the prompt is Arabic.';

async function callOpenAI(prompt: string) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    }),
  });
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? null;
}

async function callAnthropic(prompt: string) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 4000,
      messages: [{ role: 'user', content: `${SYSTEM_PROMPT}\n\n${prompt}` }],
    }),
  });
  const data = await res.json();
  return data?.content?.[0]?.text ?? null;
}

async function callGemini(prompt: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] }],
      }),
    }
  );
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { action = 'generate', prompt = '', currentFiles = [], language = 'en' } = body;

    // 1) Try providers in order
    let completion: string | null = null;
    if (OPENAI_KEY) completion = await callOpenAI(prompt).catch(() => null);
    if (!completion && ANTHROPIC_KEY) completion = await callAnthropic(prompt).catch(() => null);
    if (!completion && GEMINI_KEY) completion = await callGemini(prompt).catch(() => null);

    let result: unknown = null;
    if (completion) {
      const cleaned = completion.replace(/^```json|^```|```$/g, '').trim();
      result = JSON.parse(cleaned);
    }

    // 2) Persist usage metering (service role bypasses RLS)
    const userId = (await supabase.auth.getUser()).data.user?.id;
    await supabase.from('ai_usage').insert({
      profile_id: userId,
      provider: OPENAI_KEY ? 'openai' : ANTHROPIC_KEY ? 'anthropic' : GEMINI_KEY ? 'gemini' : 'fallback',
      model: 'multi-provider',
      action,
      tokens_in: 0,
      tokens_out: 0,
    }).select();

    return new Response(JSON.stringify({ success: true, action, result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
