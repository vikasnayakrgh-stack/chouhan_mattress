import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { logSecurityEvent } from '@/lib/security-logger';

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
  const clientIp = getClientIp(request);
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
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

    const { email } = validationResult.data;

    // Rate Limiting (3 password reset requests per 15 min per IP+email)
    const rateLimitKey = `${clientIp}:${email.toLowerCase().trim()}`;
    const rateLimit = checkRateLimit(rateLimitKey, 'auth_forgot_password', 3, 15 * 60 * 1000);
    if (!rateLimit.success) {
      logSecurityEvent({
        eventType: 'RATE_LIMIT_EXCEEDED',
        ipAddress: clientIp,
        userEmail: email,
        resource: '/api/auth/forgot-password',
        action: 'POST',
        status: 'BLOCKED',
        details: { remaining: rateLimit.remaining, resetInMs: rateLimit.resetInMs },
      });

      return NextResponse.json(
        { error: 'Too many password reset requests. Please try again in 15 minutes.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimit.resetInMs / 1000).toString(),
          },
        }
      );
    }

    // Send password reset email via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      // Don't reveal if email exists or not (security best practice)
      console.error('Password reset error:', error);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}