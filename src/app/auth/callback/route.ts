
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  // We'll redirect to /choose after successful login
  const origin = `${requestUrl.origin}/choose`;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || supabaseUrl === "YOUR_SUPABASE_URL" || !supabaseAnonKey || supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") {
    const errorMessage = 'Supabase environment variables are not configured correctly on the server.';
    console.error(errorMessage);
    return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error?message=${encodeURIComponent(errorMessage)}`);
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
        return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error?message=${encodeURIComponent(error.message)}`);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(origin)
}
