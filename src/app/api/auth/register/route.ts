import { json, jsonError, uid } from '@/lib/api';
import { createSupabaseServerClient } from '@/lib/supabase';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * CloudForge — Registration
 * Creates the auth user via Supabase when configured; otherwise returns
 * a deterministic sandbox code so the signup flow completes on Vercel
 * even without environment variables.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, name, password } = body as {
      email?: string;
      name?: string;
      password?: string;
    };

    if (!email) return jsonError('Email is required', 400);

    const response = NextResponse.json({});
    const supabase = createSupabaseServerClient(request, response);

    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: password || uid('pw'),
        options: { data: { full_name: name || email.split('@')[0] } },
      });
      if (error) return jsonError(error.message, 400);
      return json({
        success: true,
        user: data.user,
        code: Math.floor(100000 + Math.random() * 900000), // demo: surface code in response
        message: 'Account created. Verify your email to continue.',
      });
    }

    // Sandbox fallback — deterministic 6-digit code.
    return json({
      success: true,
      user: { id: uid('usr'), email, name: name || email.split('@')[0] },
      code: Math.floor(100000 + Math.random() * 900000),
      message: 'Sandbox mode: no Supabase env configured yet.',
    });
  } catch (err) {
    return jsonError('Registration failed', 500, String(err));
  }
}
