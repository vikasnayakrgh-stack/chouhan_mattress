import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/account';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    );
  }

  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });

    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Session exchange error:', sessionError);
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent('Failed to complete authentication')}`, request.url)
      );
    }

    if (data.session) {
      const { access_token, refresh_token, expires_in } = data.session;

      // Redirect to the intended page with cookies set via middleware
      // We'll set cookies via a response
      const response = NextResponse.redirect(new URL(next, request.url));
      
      const cookieOptions = [
        `sb-access-token=${access_token}`,
        'Path=/',
        `Max-Age=${expires_in}`,
        'SameSite=Lax',
        'Secure',
        'HttpOnly',
      ].join('; ');

      response.headers.set('Set-Cookie', cookieOptions);

      if (refresh_token) {
        response.headers.append('Set-Cookie', [
          `sb-refresh-token=${refresh_token}`,
          'Path=/',
          `Max-Age=${60 * 60 * 24 * 7}`, // 7 days
          'SameSite=Lax',
          'Secure',
          'HttpOnly',
        ].join('; '));
      }

      return response;
    }
  }

  // Fallback redirect
  return NextResponse.redirect(new URL(next, request.url));
}