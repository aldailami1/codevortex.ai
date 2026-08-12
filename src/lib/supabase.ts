/**
 * CloudForge — Supabase Clients (self-contained, SSR-safe)
 * ------------------------------------------------------------------
 * Browser and server clients. Every accessor is guarded: if the env
 * variables are absent (fresh Vercel deploy without env config) the
 * helpers return `null` instead of throwing, so the UI keeps working.
 */
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function hasSupabaseConfig(): boolean {
  return Boolean(url && anonKey);
}

/** Browser-side Supabase client (used by client components). */
export function createSupabaseBrowserClient() {
  if (!hasSupabaseConfig()) return null;
  return createBrowserClient(url, anonKey);
}

/** Server-side Supabase client with cookie management (route handlers). */
export function createSupabaseServerClient(
  request: NextRequest,
  response: NextResponse
) {
  if (!hasSupabaseConfig()) return null;
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });
}

/** Default Supabase browser client instance */
export const supabase = createSupabaseBrowserClient();

export default supabase;
