import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getRepositories } from '@/repositories';
import { addressSchema, AddressInput } from '@/lib/validations/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getAuthenticatedRepos() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('UNAUTHENTICATED');
  }

  if (!user.email_confirmed_at) {
    throw new Error('EMAIL_NOT_VERIFIED');
  }

  const accessToken = cookieStore.get('sb-access-token')?.value;
  const repos = getRepositories(accessToken);

  return { user, repos };
}

export async function GET() {
  try {
    const { user, repos } = await getAuthenticatedRepos();
    const addresses = await repos.customerAddresses.getByCustomerId(user.id);
    return NextResponse.json({ success: true, addresses });
  } catch (error: any) {
    if (error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 });
    }
    console.error('Get addresses error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, repos } = await getAuthenticatedRepos();
    const body = await request.json();
    
    const validationResult = addressSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const addressData = validationResult.data;
    const address = await repos.customerAddresses.create({
      customer_id: user.id,
      type: addressData.type,
      label: addressData.label ?? null,
      full_name: addressData.fullName,
      phone: addressData.phone,
      line1: addressData.line1,
      line2: addressData.line2 ?? null,
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode,
      country: addressData.country,
      is_default_shipping: addressData.isDefaultShipping,
      is_default_billing: addressData.isDefaultBilling,
    });

    return NextResponse.json({ success: true, address });
  } catch (error: any) {
    if (error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 });
    }
    console.error('Create address error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}