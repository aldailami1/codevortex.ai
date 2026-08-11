import { json, jsonError } from '@/lib/api';
import { isArText } from '@/lib/api';

/**
 * CloudForge — Support Chat (Floating Widget)
 * Returns a contextual agent reply. Uses an AI provider when configured;
 * otherwise a deterministic multilingual helper response.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { message, language } = body as { message?: string; language?: string };

    const ar = language === 'ar' || isArText(message || '');

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && message) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'You are the CloudForge support assistant. Answer briefly and helpfully in the user\'s language.',
              },
              { role: 'user', content: message },
            ],
          }),
        });
        const data = await res.json();
        const reply = data?.choices?.[0]?.message?.content;
        if (reply) return json({ reply });
      } catch {
        /* fallback */
      }
    }

    const reply = ar
      ? 'أهلاً بك في دعم CloudForge! فريقنا متاح عبر بوابة الدعم على مدار الساعة، ويمكنك أيضاً فتح تذكرة من صفحة الدعم.'
      : 'Welcome to CloudForge Support! Our team is available 24/7 through the Support Portal — you can also open a ticket from the Support page.';

    return json({ reply });
  } catch (err) {
    return jsonError('Chat failed', 500, String(err));
  }
}
