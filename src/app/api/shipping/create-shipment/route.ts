import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { autoCreateShipmentForOrder } from '@/services/shippingService'
import { validateAdminSession } from '@/lib/auth/adminAuth'

export async function POST(request: NextRequest) {
  try {
    // In-handler authentication (only admin / inventory staff)
    const auth = await validateAdminSession()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: auth.status })
    }

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 })
    }

    const result = await autoCreateShipmentForOrder(orderId)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Shipment and AWB created successfully',
      data: result,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}
