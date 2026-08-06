import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { loginSchema, LoginInput } from '@/lib/validations/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = validationResult.data;

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 401 }
      );
    }

    if (!authData.session || !authData.user) {
      return NextResponse.json(
        { success: false, error: 'Login failed - no session created' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!authData.user.email_confirmed_at) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please verify your email address before logging in. Check your inbox for the verification link.',
          code: 'EMAIL_NOT_VERIFIED'
        },
        { status: 403 }
      );
    }

    const { access_token, refresh_token, expires_in } = authData.session;

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: authData.user.user_metadata?.full_name,
        phone: authData.user.user_metadata?.phone,
      },
    });

    // Set secure cookie for middleware validation
    const cookieOptions = [
      `sb-access-token=${access_token}`,
      'Path=/',
      `Max-Age=${rememberMe ? 60 * 60 * 24 * 30 : expires_in}`, // 30 days if rememberMe, else session expiry
      'SameSite=Lax',
      'Secure',
      'HttpOnly',
    ].join('; ');

    response.headers.set('Set-Cookie', cookieOptions);

    // Also set refresh token cookie for token refresh
    if (refresh_token) {
      response.headers.append('Set-Cookie', [
        `sb-refresh-token=${refresh_token}`,
        'Path=/',
        `Max-Age=${rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7}`, // 30 days or 7 days
        'SameSite=Lax',
        'Secure',
        'HttpOnly',
      ].join('; '));
    }

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}