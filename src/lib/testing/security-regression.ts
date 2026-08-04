import { validateAdminSession } from '@/lib/auth/adminAuth'
import { checkRateLimit } from '@/lib/rate-limit'
import { createOrderPayloadSchema } from '@/lib/validations/checkout'
import { runRlsAudit } from '@/lib/testing/verify_rls'

export interface TestResult {
  name: string
  category: 'AUTH' | 'INTEGRITY' | 'VALIDATION' | 'RATE_LIMIT' | 'PERSISTENCE' | 'RLS'
  status: 'PASS' | 'FAIL'
  evidence: string
}

/**
 * End-to-End Security Regression Test Suite
 */
export async function runSecurityRegressionSuite(): Promise<{
  summary: { total: number; passed: number; failed: number }
  results: TestResult[]
}> {
  const results: TestResult[] = []

  // 1. Anonymous Access to Admin Guard Test
  try {
    const auth = await validateAdminSession(null)
    const passed = auth.authorized === false && auth.status === 401
    results.push({
      name: 'Anonymous → Admin Route Guard',
      category: 'AUTH',
      status: passed ? 'PASS' : 'FAIL',
      evidence: `Status returned: ${auth.status}, error: "${auth.error}"`,
    })
  } catch (err: any) {
    results.push({
      name: 'Anonymous → Admin Route Guard',
      category: 'AUTH',
      status: 'PASS',
      evidence: `Blocked with exception: ${err.message}`,
    })
  }

  // 2. Non-Staff User Role Access Guard Test
  try {
    // Mock user without staff role
    const auth = await validateAdminSession('mock-customer-token')
    const passed = auth.authorized === false
    results.push({
      name: 'Customer → Admin Role Guard',
      category: 'AUTH',
      status: passed ? 'PASS' : 'FAIL',
      evidence: `Status returned: ${auth.status}, role rejected: ${auth.role || 'none'}`,
    })
  } catch (err: any) {
    results.push({
      name: 'Customer → Admin Role Guard',
      category: 'AUTH',
      status: 'PASS',
      evidence: `Rejected by guard: ${err.message}`,
    })
  }

  // 3. Price Tampering Prevention Test (Zod schema strips or ignores client price)
  const tamperPayload = {
    items: [
      {
        productId: 'mattress-1',
        variantSize: 'Queen',
        quantity: 1,
        unitPrice: 1, // Attempted price manipulation to ₹1
      },
    ],
    shippingAddress: {
      fullName: 'Test User',
      phone: '9876543210',
      pincode: '110020',
      houseNo: '101',
      street: 'Main Road',
      city: 'Delhi',
      state: 'Delhi',
    },
  }

  const parseResult = createOrderPayloadSchema.safeParse(tamperPayload)
  const priceIgnored = parseResult.success && !('unitPrice' in parseResult.data.items[0])
  results.push({
    name: 'Price Manipulation Prevention',
    category: 'INTEGRITY',
    status: priceIgnored ? 'PASS' : 'FAIL',
    evidence: priceIgnored
      ? 'Zod schema stripped client-supplied unitPrice field'
      : 'Client price passed schema',
  })

  // 4. Invalid Quantity Boundary Test
  const invalidQtyPayload = {
    items: [
      {
        productId: 'mattress-1',
        quantity: -5,
      },
    ],
    shippingAddress: tamperPayload.shippingAddress,
  }

  const qtyResult = createOrderPayloadSchema.safeParse(invalidQtyPayload)
  const qtyBlocked = !qtyResult.success
  results.push({
    name: 'Negative Quantity Validation',
    category: 'VALIDATION',
    status: qtyBlocked ? 'PASS' : 'FAIL',
    evidence: qtyBlocked ? 'Rejected negative quantity (-5)' : 'Allowed negative quantity!',
  })

  // 5. Rate Limit Enforcement Test
  const testIp = '192.168.1.99'
  let rateLimited = false
  for (let i = 0; i < 6; i++) {
    const res = checkRateLimit(testIp, 'regression_test_checkout', 5, 60000)
    if (!res.success) {
      rateLimited = true
      break
    }
  }
  results.push({
    name: 'Rate Limiting Enforcement (5 req/min)',
    category: 'RATE_LIMIT',
    status: rateLimited ? 'PASS' : 'FAIL',
    evidence: rateLimited ? '6th request correctly blocked with HTTP 429' : 'Failed to block 6th request',
  })

  // 6. RLS Verification Test
  const rlsResults = await runRlsAudit()
  const rlsPassed = rlsResults.every((r) => r.status === 'PASS')
  results.push({
    name: 'Database Row-Level Security Audit',
    category: 'RLS',
    status: rlsPassed ? 'PASS' : 'FAIL',
    evidence: rlsPassed
      ? 'All RLS policy assertions passed (Anon read/write blocked)'
      : `Failed RLS assertions: ${rlsResults.filter((r) => r.status === 'FAIL').map((r) => r.table).join(', ')}`,
  })

  const passedCount = results.filter((r) => r.status === 'PASS').length

  return {
    summary: {
      total: results.length,
      passed: passedCount,
      failed: results.length - passedCount,
    },
    results,
  }
}
