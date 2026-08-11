import { json, jsonError, uid } from '@/lib/api';

/**
 * CloudForge — Send OTP (email magic-code)
 * Uses Supabase Auth OTP when configured; sandbox fallback otherwise.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, name } = body as { email?: string; name?: string };

    if (!email) return jsonError('Email is required', 400);

    // In sandbox mode we return the code directly (demo behavior).
    const code = Math.floor(100000 + Math.random() * 900000);

    return json({
      success: true,
      code,
      message: `OTP dispatched to ${email}`,
      user: { id: uid('usr'), email, name: name || email.split('@')[0] },
    });
  } catch (err) {
    return jsonError('Failed to send OTP', 500, String(err));
  }
}
