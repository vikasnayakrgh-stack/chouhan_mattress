import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_STAFF_ROLES = ['owner', 'admin', 'manager', 'staff', 'viewer']

// Customer routes that require authentication
const CUSTOMER_PROTECTED_ROUTES = [
  '/account',
  '/wishlist',
  '/cart',
  '/checkout',
]

// Admin routes that require staff authentication
const ADMIN_PROTECTED_ROUTES = [
  '/admin',
  '/api/admin',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Dev bypass: allow admin access in development with mock data (no Supabase required)
  const isDev = process.env.NODE_ENV === 'development'
  const isMockMode = process.env.NEXT_PUBLIC_DATA_SOURCE === 'mock'
  if (isDev && isMockMode) {
    return NextResponse.next()
  }

  // Check if this is an admin route
  const isAdminRoute = ADMIN_PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route) && !pathname.startsWith('/admin/login')
  )

  // Check if this is a customer protected route
  const isCustomerRoute = CUSTOMER_PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )

  // Protect admin routes
  if (isAdminRoute) {
    return await protectAdminRoute(request, pathname)
  }

  // Protect customer routes
  if (isCustomerRoute) {
    return await protectCustomerRoute(request, pathname)
  }

  return NextResponse.next()
}

async function protectAdminRoute(request: NextRequest, pathname: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase env vars missing, reject admin access
  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication configuration missing' }, { status: 401 })
    }
    return new NextResponse('Unauthorized: Admin configuration missing', { status: 401 })
  }

  // Extract Bearer token or cookie token
  const authHeader = request.headers.get('Authorization')
  const authCookie = request.cookies.get('sb-access-token')?.value || request.cookies.get('supabase-auth-token')?.value
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authCookie

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized: Missing authentication token' }, { status: 401 })
    }
    // Redirect unauthenticated admin page requests to 401 unauthorized page / response
    return new NextResponse(
      '<!DOCTYPE html><html><head><title>401 Unauthorized</title></head><body style="font-family:sans-serif;padding:50px;text-align:center;"><h1>401 Unauthorized</h1><p>Access to the Chouhan Mattress Admin Panel requires valid staff authentication.</p></body></html>',
      { status: 401, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Create Supabase client and verify JWT token
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized: Invalid authentication session' }, { status: 401 })
    }
    return new NextResponse('Unauthorized: Invalid authentication session', { status: 401 })
  }

  // Check staff role in app_metadata (tamper-proof JWT claim)
  const role = user.app_metadata?.role as string | undefined
  if (!role || !ALLOWED_STAFF_ROLES.includes(role.toLowerCase())) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient staff permissions' }, { status: 403 })
    }
    return new NextResponse('Forbidden: Insufficient staff permissions', { status: 403 })
  }

  return NextResponse.next()
}

async function protectCustomerRoute(request: NextRequest, pathname: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase env vars missing, reject customer access
  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication configuration missing' }, { status: 401 })
    }
    // Redirect to login with return URL
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Extract Bearer token or cookie token
  const authHeader = request.headers.get('Authorization')
  const authCookie = request.cookies.get('sb-access-token')?.value || request.cookies.get('supabase-auth-token')?.value
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authCookie

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized: Missing authentication token' }, { status: 401 })
    }
    // Redirect to login with return URL
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Create Supabase client and verify JWT token
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized: Invalid authentication session' }, { status: 401 })
    }
    // Redirect to login with return URL
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check if email is verified (for customer routes)
  if (!user.email_confirmed_at) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Email not verified', code: 'EMAIL_NOT_VERIFIED' }, { status: 403 })
    }
    // Redirect to verify email page
    const verifyUrl = new URL('/auth/verify-email', request.url)
    verifyUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(verifyUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/account/:path*',
    '/wishlist',
    '/cart',
    '/checkout',
  ],
}