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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, repos } = await getAuthenticatedRepos();
    const { id } = await params;
    
    const address = await repos.customerAddresses.getById(id);
    
    if (!address || address.customer_id !== user.id) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, address });
  } catch (error: any) {
    if (error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 });
    }
    console.error('Get address error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, repos } = await getAuthenticatedRepos();
    const { id } = await params;
    const body = await request.json();
    
    const validationResult = addressSchema.partial().safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const address = await repos.customerAddresses.update(id, validationResult.data);
    
    if (address.customer_id !== user.id) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, address });
  } catch (error: any) {
    if (error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 });
    }
    console.error('Update address error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, repos } = await getAuthenticatedRepos();
    const { id } = await params;
    
    // Verify ownership first
    const address = await repos.customerAddresses.getById(id);
    if (!address || address.customer_id !== user.id) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }
    
    await repos.customerAddresses.delete(id);
    return NextResponse.json({ success: true, message: 'Address deleted' });
  } catch (error: any) {
    if (error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 });
    }
    console.error('Delete address error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}