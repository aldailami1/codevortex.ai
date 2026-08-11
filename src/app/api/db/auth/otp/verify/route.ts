import { json, jsonError } from '@/lib/api';

/**
 * CloudForge — Verify OTP
 * Verifies the emailed code. In sandbox mode any 6-digit code passes.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, code, name } = body as { email?: string; code?: string; name?: string };

    if (!email || !code) return jsonError('Email and code are required', 400);

    const normalized = String(code).trim();
    if (!/^\d{6}$/.test(normalized)) {
      return jsonError('Invalid code format', 400);
    }

    return json({
      success: true,
      session: { access_token: 'sandbox_token', user: { id: 'usr_sandbox', email, name } },
      message: 'Code verified — welcome to CloudForge!',
    });
  } catch (err) {
    return jsonError('Verification failed', 500, String(err));
  }
}
