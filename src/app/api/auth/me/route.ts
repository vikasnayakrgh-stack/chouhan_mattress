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

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookie
    const accessToken = request.cookies.get('sb-access-token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated', user: null },
        { status: 401 }
      );
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session', user: null },
        { status: 401 }
      );
    }

    // Fetch customer profile if exists
    const { data: profile } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Fetch default addresses
    const { data: addresses } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', user.id)
      .order('is_default_shipping', { ascending: false });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        phone: user.phone,
        user_metadata: user.user_metadata,
        profile: profile || null,
        addresses: addresses || [],
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', user: null },
      { status: 500 }
    );
  }
}