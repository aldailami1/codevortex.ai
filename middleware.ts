/**
 * CloudForge — Edge Middleware
 * ------------------------------------------------------------------
 * Refreshes Supabase auth sessions on every request (standard
 * @supabase/ssr pattern). If Supabase env vars are not configured yet,
 * the middleware is a transparent no-op so the app still deploys and
 * runs on Vercel without environment setup.
 */
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!supabaseUrl || !supabaseAnonKey) {
    return response; // no Supabase configured — transparent pass-through
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            response.cookies.set(name, value);
          }
        },
      },
    });

    // Refresh session if expired — required for Server Components.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Optional: attach the resolved user to the request for route handlers.
    if (user) {
      request.headers.set('x-cloudforge-user-id', user.id);
    }
  } catch {
    // Never break the request on auth failures.
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
