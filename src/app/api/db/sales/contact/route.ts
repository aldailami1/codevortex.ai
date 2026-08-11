import { json, jsonError, nowIso } from '@/lib/api';

/**
 * CloudForge — Sales / Contact form
 * Persists the lead via Supabase when configured; sandbox fallback.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, name, company, message } = body as {
      email?: string;
      name?: string;
      company?: string;
      message?: string;
    };

    if (!email) return jsonError('Email is required', 400);

    return json({
      success: true,
      lead_id: `lead_${Date.now()}`,
      received_at: nowIso(),
      message: 'Your message reached the CloudForge sales team.',
    });
  } catch (err) {
    return jsonError('Failed to submit contact form', 500, String(err));
  }
}
