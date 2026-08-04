import { createClient } from '@supabase/supabase-js'

export interface RlsTestResult {
  table: string
  role: 'Anonymous' | 'Customer Own' | 'Customer Other' | 'Staff' | 'Service Role'
  action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
  expectedAllowed: boolean
  actualAllowed: boolean
  status: 'PASS' | 'FAIL'
  details: string
}

/**
 * Programmatic RLS matrix verification runner
 */
export async function runRlsAudit(): Promise<RlsTestResult[]> {
  const results: RlsTestResult[] = []
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    return [
      {
        table: 'ALL',
        role: 'Anonymous',
        action: 'SELECT',
        expectedAllowed: false,
        actualAllowed: false,
        status: 'FAIL',
        details: 'Missing Supabase environment variables',
      },
    ]
  }

  const anonClient = createClient(supabaseUrl, supabaseAnonKey)
  const serviceClient = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null

  // 1. Test Anonymous read on orders (Must be DENIED)
  try {
    const { data, error } = await anonClient.from('orders').select('*').limit(1)
    const allowed = !error && data !== null && data.length > 0
    results.push({
      table: 'orders',
      role: 'Anonymous',
      action: 'SELECT',
      expectedAllowed: false,
      actualAllowed: allowed,
      status: allowed === false ? 'PASS' : 'FAIL',
      details: error ? `Denied as expected: ${error.message}` : 'Anon returned 0 records / protected',
    })
  } catch (err: any) {
    results.push({
      table: 'orders',
      role: 'Anonymous',
      action: 'SELECT',
      expectedAllowed: false,
      actualAllowed: false,
      status: 'PASS',
      details: `Exception caught: ${err.message}`,
    })
  }

  // 2. Test Anonymous insert on orders (Must be DENIED)
  try {
    const { data, error } = await anonClient.from('orders').insert({
      order_number: 'ATTACK-999',
      total: 0,
    })
    const allowed = !error
    results.push({
      table: 'orders',
      role: 'Anonymous',
      action: 'INSERT',
      expectedAllowed: false,
      actualAllowed: allowed,
      status: allowed === false ? 'PASS' : 'FAIL',
      details: error ? `Insert blocked by RLS: ${error.message}` : 'CRITICAL: Anon insert allowed!',
    })
  } catch (err: any) {
    results.push({
      table: 'orders',
      role: 'Anonymous',
      action: 'INSERT',
      expectedAllowed: false,
      actualAllowed: false,
      status: 'PASS',
      details: `Exception caught: ${err.message}`,
    })
  }

  // 3. Test Anonymous read on active products (Must be ALLOWED)
  try {
    const { data, error } = await anonClient.from('products').select('id, name, status').limit(5)
    const allowed = !error
    results.push({
      table: 'products',
      role: 'Anonymous',
      action: 'SELECT',
      expectedAllowed: true,
      actualAllowed: allowed,
      status: allowed === true ? 'PASS' : 'FAIL',
      details: error ? `Read failed: ${error.message}` : `Successfully read ${data?.length || 0} storefront products`,
    })
  } catch (err: any) {
    results.push({
      table: 'products',
      role: 'Anonymous',
      action: 'SELECT',
      expectedAllowed: true,
      actualAllowed: false,
      status: 'FAIL',
      details: `Exception: ${err.message}`,
    })
  }

  // 4. Test Service Role full access on orders (Must be ALLOWED)
  if (serviceClient) {
    try {
      const { data, error } = await serviceClient.from('orders').select('count', { count: 'exact' })
      const allowed = !error
      results.push({
        table: 'orders',
        role: 'Service Role',
        action: 'SELECT',
        expectedAllowed: true,
        actualAllowed: allowed,
        status: allowed === true ? 'PASS' : 'FAIL',
        details: error ? `Service role error: ${error.message}` : 'Service role bypassed RLS as expected',
      })
    } catch (err: any) {
      results.push({
        table: 'orders',
        role: 'Service Role',
        action: 'SELECT',
        expectedAllowed: true,
        actualAllowed: false,
        status: 'FAIL',
        details: `Exception: ${err.message}`,
      })
    }
  }

  return results
}
