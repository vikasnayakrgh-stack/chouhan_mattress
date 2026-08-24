import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { trackOrderLive } from '@/services/shippingService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const supabase = createAdminClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('id, order_number, status, payment_status, carrier, awb_number, tracking_number, shipping_status, shipping_label_url, timeline, shipping_address, created_at')
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .single()

    if (error || !order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    let liveScans = null
    const awb = order.awb_number || order.tracking_number
    if (awb) {
      try {
        liveScans = await trackOrderLive(awb)
      } catch (trackErr) {
        console.warn('[LIVE_TRACK_FETCH_WARN]', trackErr)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
        liveTracking: liveScans,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}
