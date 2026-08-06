import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_STAFF_ROLES = [
  'super_admin',
  'admin',
  'manager',
  'inventory',
  'sales',
  'customer_support',
  'content_editor',
  'owner',
  'staff',
]

// Granular Role Route Permission Matrix
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/admin/settings': ['super_admin', 'admin', 'owner'],
  '/admin/inventory': ['super_admin', 'admin', 'manager', 'inventory', 'owner'],
  '/admin/orders': ['super_admin', 'admin', 'manager', 'sales', 'customer_support', 'owner'],
  '/admin/customers': ['super_admin', 'admin', 'manager', 'customer_support', 'owner'],
  '/admin/content': ['super_admin', 'admin', 'content_editor', 'owner'],
  '/admin/discounts': ['super_admin', 'admin', 'manager', 'owner'],
  '/admin/analytics': ['super_admin', 'admin', 'manager', 'owner'],
}

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

  // Dev bypass: allow admin access ONLY in development when data source is mock
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
    return NextResponse.redirect(new URL('/admin/login?error=missing_token', request.url))
  }

  // Create Supabase client and verify JWT token
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized: Invalid authentication session' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login?error=invalid_session', request.url))
  }

  // Extract role from app_metadata or query staff database table fallback
  let staffRole = (user.app_metadata?.role as string | undefined)?.toLowerCase()
  let isStaff = user.app_metadata?.is_staff as boolean | undefined

  // Fallback: Query staff table to verify active staff status if app_metadata is missing
  if (!staffRole) {
    const { data: staffRecord } = await supabase
      .from('staff')
      .select('role, status')
      .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
      .eq('status', 'active')
      .single()

    if (staffRecord) {
      staffRole = staffRecord.role.toLowerCase()
      isStaff = true
    }
  }

  // Reject access if user is not an active staff member
  if (!staffRole || !ALLOWED_STAFF_ROLES.includes(staffRole)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient staff permissions' }, { status: 403 })
    }
    return new NextResponse(
      '<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body style="font-family:sans-serif;padding:50px;text-align:center;background:#0F172A;color:#F8FAFC;"><h1>403 Forbidden</h1><p>Access to Chouhan Mattress Admin requires active staff onboarding.</p><a href="/admin/login" style="color:#F59E0B;font-weight:bold;">Return to Admin Login</a></body></html>',
      { status: 403, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Route-Level Granular Permission Check
  for (const [prefix, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(prefix)) {
      if (!allowedRoles.includes(staffRole)) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: `Forbidden: Role '${staffRole}' cannot access ${prefix}` },
            { status: 403 }
          )
        }
        return new NextResponse(
          `<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body style="font-family:sans-serif;padding:50px;text-align:center;background:#0F172A;color:#F8FAFC;"><h1>403 Access Denied</h1><p>Your staff role (<strong>${staffRole}</strong>) lacks permission to access <code>${prefix}</code>.</p><a href="/admin" style="color:#F59E0B;font-weight:bold;">Return to Dashboard</a></body></html>`,
          { status: 403, headers: { 'Content-Type': 'text/html' } }
        )
      }
      break
    }
  }

  return NextResponse.next()
}

async function protectCustomerRoute(request: NextRequest, pathname: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication configuration missing' }, { status: 401 })
    }
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const authHeader = request.headers.get('Authorization')
  const authCookie = request.cookies.get('sb-access-token')?.value || request.cookies.get('supabase-auth-token')?.value
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authCookie

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized: Missing authentication token' }, { status: 401 })
    }
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized: Invalid authentication session' }, { status: 401 })
    }
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!user.email_confirmed_at) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Email not verified', code: 'EMAIL_NOT_VERIFIED' }, { status: 403 })
    }
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