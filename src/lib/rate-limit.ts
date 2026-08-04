import 'server-only'

interface RateLimitStore {
  count: number
  resetTime: number
}

// In-memory sliding window rate limiter store
const rateLimitMap = new Map<string, RateLimitStore>()

// Periodic cleanup of expired rate limit entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, store] of rateLimitMap.entries()) {
      if (now > store.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetInMs: number
}

/**
 * Sliding-window rate limiter for sensitive endpoints.
 * @param identifier IP or user ID tracking key
 * @param action Namespace for the limit (e.g. 'checkout', 'login', 'admin_api')
 * @param limit Maximum allowed requests in window
 * @param windowMs Time window duration in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  action: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const key = `${action}:${identifier}`
  const now = Date.now()
  const currentStore = rateLimitMap.get(key)

  if (!currentStore || now > currentStore.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetInMs: windowMs,
    }
  }

  if (currentStore.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetInMs: Math.max(0, currentStore.resetTime - now),
    }
  }

  currentStore.count += 1
  return {
    success: true,
    limit,
    remaining: limit - currentStore.count,
    resetInMs: Math.max(0, currentStore.resetTime - now),
  }
}

/**
 * Extract client IP from Request headers in Next.js Server environment
 */
export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }
  const xRealIp = request.headers.get('x-real-ip')
  if (xRealIp) {
    return xRealIp.trim()
  }
  return '127.0.0.1'
}
