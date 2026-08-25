import { isArText, json, jsonError } from '@/lib/api';

const fallbackReply = (message: string, ar: boolean) => {
  const normalized = message.toLowerCase();
  if (ar) {
    if (normalized.includes('دفع') || normalized.includes('اشتراك') || normalized.includes('فاتورة')) {
      return 'أفهم أنك تسأل عن الدفع أو الاشتراك. راجع الباقة وطريقة الدفع المختارة، وإذا ظهر لك خطأ أرسل نصه وسأساعدك في تحديد الخطوة التالية.';
    }
    if (normalized.includes('نشر') || normalized.includes('دومين') || normalized.includes('ssl')) {
      return 'ممتاز، أستطيع مساعدتك في النشر. ابدأ بمراجعة ملفات المشروع والنطاق، ثم افتح سجل النشر لمعرفة إن كانت المشكلة في الإعدادات أو في مزوّد الاستضافة.';
    }
    return 'أهلاً بك في CloudForge. أخبرني بما تحاول بناءه أو أين توقفت، وسأرشدك خطوة بخطوة وبأسلوب عملي. يمكنك أيضاً طلب الانتقال إلى مساحة العمل أو الأكاديمية في أي وقت.';
  }
  if (normalized.includes('payment') || normalized.includes('subscription') || normalized.includes('invoice')) {
    return 'I understand you are asking about billing. Check the selected plan and payment method, and if an error appears, send me its exact text so I can help with the next step.';
  }
  if (normalized.includes('deploy') || normalized.includes('domain') || normalized.includes('ssl')) {
    return 'Happy to help with deployment. Review the project files and domain first, then open the deployment log to see whether the issue comes from configuration or the hosting provider.';
  }
  return 'Welcome to CloudForge. Tell me what you are trying to build or where you are stuck, and I will guide you step by step. You can also ask me to open the workspace or Academy at any time.';
};

/** CloudForge Support Chat: warm, contextual, provider-safe assistance. */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';
    const message = rawMessage.slice(0, 4000);
    const language = typeof body.language === 'string' ? body.language : '';
    const ar = language === 'ar' || isArText(message);

    if (!message) return jsonError(ar ? 'اكتب رسالتك أولاً' : 'Please write a message first', 400);

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.35,
            max_tokens: 450,
            messages: [
              {
                role: 'system',
                content: `You are CloudForge's warm, expert support partner. Reply in the user's language (${ar ? 'Arabic' : 'English'}). Be natural, respectful, concise, and practical. Ask one clarifying question when needed. Never claim to have opened a ticket, changed an account, charged a card, deployed code, or contacted a human unless the API explicitly confirms it. If an action requires a human or provider, explain the next safe step without sounding dismissive.`,
              },
              { role: 'user', content: message },
            ],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (typeof reply === 'string' && reply.trim()) return json({ reply: reply.trim() });
        }
      } catch {
        // The deterministic response below keeps support available when the provider is unavailable.
      }
    }

    return json({ reply: fallbackReply(message, ar) });
  } catch {
    return jsonError('Chat failed', 500);
  }
}
