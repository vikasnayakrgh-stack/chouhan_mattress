import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { signupSchema, SignupInput } from '@/lib/validations/auth';
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
    const validationResult = signupSchema.safeParse(body);
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

    const { email, password, fullName, phone, marketingOptIn } = validationResult.data;

    // Rate Limiting (5 signups per hour per IP+email)
    const rateLimitKey = `${clientIp}:${email.toLowerCase().trim()}`;
    const rateLimit = checkRateLimit(rateLimitKey, 'auth_signup', 5, 60 * 60 * 1000);
    if (!rateLimit.success) {
      logSecurityEvent({
        eventType: 'RATE_LIMIT_EXCEEDED',
        ipAddress: clientIp,
        userEmail: email,
        resource: '/api/auth/signup',
        action: 'POST',
        status: 'BLOCKED',
        details: { remaining: rateLimit.remaining, resetInMs: rateLimit.resetInMs },
      });

      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimit.resetInMs / 1000).toString(),
          },
        }
      );
    }

    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
          marketing_opt_in: marketingOptIn || false,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email`,
      },
    });

    if (authError) {
      // Handle specific error cases
      if (authError.message.includes('User already registered')) {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'Registration failed - no user created' },
        { status: 500 }
      );
    }

    // Create customer profile in database
    const { error: profileError } = await supabase
      .from('customer_profiles')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        phone: phone || null,
        marketing_opt_in: marketingOptIn || false,
      });

    if (profileError) {
      console.error('Failed to create customer profile:', profileError);
      // Don't fail registration if profile creation fails - can be created on first login
    }

    // Initialize empty cart and wishlist for the new user
    await Promise.all([
      supabase.from('carts').upsert({
        customer_id: authData.user.id,
        items: [],
      }),
      supabase.from('wishlists').upsert({
        customer_id: authData.user.id,
        product_ids: [],
      }),
    ]);

    // Return success (don't expose session data)
    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        email_confirmed_at: authData.user.email_confirmed_at,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}