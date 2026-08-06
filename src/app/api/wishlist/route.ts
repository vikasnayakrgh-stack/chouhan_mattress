import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getRepositories } from '@/repositories';

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
    const wishlist = await repos.wishlists.getByCustomerId(user.id);
    return NextResponse.json({ success: true, wishlist });
  } catch (error: any) {
    if (error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 });
    }
    console.error('Get wishlist error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, repos } = await getAuthenticatedRepos();
    const body = await request.json();
    const { productId } = body;
    
    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const wishlist = await repos.wishlists.addProduct(user.id, productId);
    return NextResponse.json({ success: true, wishlist });
  } catch (error: any) {
    if (error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 });
    }
    console.error('Add to wishlist error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, repos } = await getAuthenticatedRepos();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const wishlist = await repos.wishlists.removeProduct(user.id, productId);
    return NextResponse.json({ success: true, wishlist });
  } catch (error: any) {
    if (error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 });
    }
    console.error('Remove from wishlist error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}