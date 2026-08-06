import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getRepositories } from '@/repositories';
import { cartItemSchema, applyCouponSchema, CartItemInput, ApplyCouponInput } from '@/lib/validations/auth';

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
    const cart = await repos.carts.getByCustomerId(user.id);
    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    if (error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 });
    }
    console.error('Get cart error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, repos } = await getAuthenticatedRepos();
    const body = await request.json();
    
    const validationResult = cartItemSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const item = validationResult.data;
    const cart = await repos.carts.addItem(user.id, {
      product_id: item.productId,
      variant_id: item.variantId,
      name: '', // Will be fetched from product service
      price: 0, // Will be fetched from product service
      quantity: item.quantity,
      image: '',
      size: undefined,
      thickness: undefined,
      category: undefined,
    });

    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    if (error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 });
    }
    console.error('Add to cart error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user, repos } = await getAuthenticatedRepos();
    const body = await request.json();
    
    const validationResult = applyCouponSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { code } = validationResult.data;
    const cart = await repos.carts.applyCoupon(user.id, code || null);
    
    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    if (error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 });
    }
    console.error('Apply coupon error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, repos } = await getAuthenticatedRepos();
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    
    if (!itemId) {
      return NextResponse.json({ success: false, error: 'Item ID required' }, { status: 400 });
    }

    const cart = await repos.carts.removeItem(user.id, itemId);
    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    if (error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 });
    }
    console.error('Remove from cart error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}