import 'server-only'

export type SecurityEventType =
  | 'ADMIN_LOGIN_SUCCESS'
  | 'ADMIN_LOGIN_FAILURE'
  | 'ROLE_VIOLATION'
  | 'ORDER_CREATED'
  | 'ORDER_FAILED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'RLS_VIOLATION'
  | 'PRICE_TAMPERING_ATTEMPT'
  | 'COUPON_APPLIED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'

export interface SecurityLogPayload {
  eventType: SecurityEventType
  userId?: string | null
  userEmail?: string | null
  userRole?: string | null
  ipAddress?: string
  resource?: string
  action?: string
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED'
  details?: Record<string, any>
}

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'cookie',
  'auth',
  'secret',
  'cvv',
  'cardNumber',
  'creditCard',
  'authorization',
  'serviceRoleKey',
])

function sanitizeDetails(data: any): any {
  if (data === null || data === undefined) return data
  if (typeof data !== 'object') return data

  if (Array.isArray(data)) {
    return data.map(sanitizeDetails)
  }

  const sanitized: Record<string, any> = {}
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeDetails(value)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

/**
 * Structured Security Audit Logger
 */
export function logSecurityEvent(event: SecurityLogPayload): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    type: 'SECURITY_AUDIT_LOG',
    eventType: event.eventType,
    status: event.status,
    userId: event.userId || 'anonymous',
    userEmail: event.userEmail || null,
    userRole: event.userRole || null,
    ipAddress: event.ipAddress || 'unknown',
    resource: event.resource || 'unknown',
    action: event.action || 'unknown',
    details: sanitizeDetails(event.details || {}),
  }

  // Output formatted JSON log line
  const formattedLog = JSON.stringify(logEntry)

  if (event.status === 'FAILURE' || event.status === 'BLOCKED') {
    console.warn(`[SECURITY WARN] ${formattedLog}`)
  } else {
    console.log(`[SECURITY INFO] ${formattedLog}`)
  }
}
