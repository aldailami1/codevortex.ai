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

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/** Browser-side Supabase client (used by client components). */
export function createSupabaseBrowserClient() {
  if (!hasSupabaseConfig()) return null;
  if (!browserClient) {
    browserClient = createBrowserClient(url, anonKey);
  }
  return browserClient;
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

/** Default Safe Supabase Proxy Client with full type assertion */
export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_target, prop) {
    const client = createSupabaseBrowserClient();
    if (!client) {
      if (prop === 'auth') {
        return {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
          signOut: () => Promise.resolve({ error: null }),
        };
      }
      return () => Promise.resolve({ data: null, error: null });
    }
    const val = (client as any)[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  }
});

export default supabase;
