import 'server-only'
import { cookies, headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export const ALLOWED_STAFF_ROLES = [
  'super_admin',
  'admin',
  'manager',
  'inventory',
  'sales',
  'customer_support',
  'content_editor',
  'owner',
  'staff',
  'viewer',
]

// Dev bypass for mock mode
function isDevMockMode(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DATA_SOURCE === 'mock'
}

export interface AuthValidationResult {
  authorized: boolean
  user: any | null
  role: string | null
  error: string | null
  status: 200 | 401 | 403
}

/**
 * Server-side helper to validate session authentication and staff role authorization
 * for Admin Server Actions, API routes, and Server Components.
 */
export async function validateAdminSession(tokenOrHeader?: string | null): Promise<AuthValidationResult> {
  // Dev bypass: allow mock mode without Supabase
  if (isDevMockMode()) {
    return {
      authorized: true,
      user: { id: 'dev-user', app_metadata: { role: 'super_admin', is_staff: true } },
      role: 'super_admin',
      error: null,
      status: 200,
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      authorized: false,
      user: null,
      role: null,
      error: 'Supabase environment configuration missing',
      status: 401,
    }
  }

  let token = tokenOrHeader

  // If token not provided explicitly, auto-extract from headers or cookies
  if (!token) {
    try {
      const headerList = await headers()
      const authHeader = headerList.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    } catch {
      // Ignored if headers() not available in context
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies()
      token = cookieStore.get('sb-access-token')?.value || cookieStore.get('supabase-auth-token')?.value
    } catch {
      // Ignored if cookies() not available
    }
  }

  // Extract from Bearer header if provided
  if (token?.startsWith('Bearer ')) {
    token = token.substring(7)
  }

  if (!token) {
    return {
      authorized: false,
      user: null,
      role: null,
      error: 'Missing authentication token',
      status: 401,
    }
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return {
      authorized: false,
      user: null,
      role: null,
      error: 'Invalid authentication session token',
      status: 401,
    }
  }

  let role = (user.app_metadata?.role as string | undefined)?.toLowerCase() || null

  // Fallback check against staff table if app_metadata.role not yet synchronized
  if (!role) {
    const { data: staffRecord } = await supabase
      .from('staff')
      .select('role, status')
      .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
      .eq('status', 'active')
      .single()

    if (staffRecord) {
      role = staffRecord.role.toLowerCase()
    }
  }

  if (!role || !ALLOWED_STAFF_ROLES.includes(role)) {
    return {
      authorized: false,
      user,
      role,
      error: 'Forbidden: Insufficient admin/staff privileges',
      status: 403,
    }
  }

  return {
    authorized: true,
    user,
    role,
    error: null,
    status: 200,
  }
}

/**
 * Guard assertion function that throws an error if authentication or role check fails.
 * Designed for use in privileged server functions and service methods.
 */
export async function requireAdminRole(
  tokenOrHeader?: string | null,
  requiredRoles: string[] = ALLOWED_STAFF_ROLES
): Promise<{ user: any; role: string }> {
  const auth = await validateAdminSession(tokenOrHeader)
  
  if (!auth.authorized || !auth.user || !auth.role) {
    throw new Error(`Unauthorized Admin Operation: ${auth.error || 'Access denied'}`)
  }

  if (requiredRoles.length > 0 && !requiredRoles.map(r => r.toLowerCase()).includes(auth.role.toLowerCase())) {
    throw new Error(`Forbidden: Role '${auth.role}' does not have required permissions`)
  }

  return { user: auth.user, role: auth.role }
}
