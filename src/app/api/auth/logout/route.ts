import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    // Get access token from cookie
    const accessToken = request.cookies.get('sb-access-token')?.value;
    
    if (accessToken) {
      // Sign out from Supabase (revokes the session server-side)
      await supabase.auth.signOut();
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear auth cookies
    const clearCookieOptions = [
      'Path=/',
      'Max-Age=0',
      'SameSite=Lax',
      'Secure',
      'HttpOnly',
    ].join('; ');

    response.headers.set('Set-Cookie', `sb-access-token=; ${clearCookieOptions}`);
    response.headers.append('Set-Cookie', `sb-refresh-token=; ${clearCookieOptions}`);

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}