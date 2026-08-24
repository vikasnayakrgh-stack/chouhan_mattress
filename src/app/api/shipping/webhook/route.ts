import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const supabase = createAdminClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })
    }

    // Shiprocket tracking webhook format
    const awb = payload.awb || payload.awb_code || payload.waybill
    const currentStatus = (payload.current_status || payload.status || '').toLowerCase()
    const location = payload.location || payload.current_city || 'In Transit'

    if (!awb) {
      return NextResponse.json({ error: 'AWB not found in payload' }, { status: 400 })
    }

    // Map carrier status to system status
    let mappedShippingStatus: string = 'in_transit'
    let orderStatusUpdate: string | null = null

    if (currentStatus.includes('delivered')) {
      mappedShippingStatus = 'delivered'
      orderStatusUpdate = 'delivered'
    } else if (currentStatus.includes('out for delivery')) {
      mappedShippingStatus = 'out_for_delivery'
      orderStatusUpdate = 'shipped'
    } else if (currentStatus.includes('rto') || currentStatus.includes('return')) {
      mappedShippingStatus = 'rto'
      orderStatusUpdate = 'returned'
    } else if (currentStatus.includes('manifest') || currentStatus.includes('pickup')) {
      mappedShippingStatus = 'manifested'
      orderStatusUpdate = 'shipped'
    }

    // Find order by awb_number
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .or(`awb_number.eq.${awb},tracking_number.eq.${awb}`)
      .single()

    if (order) {
      const existingTimeline = Array.isArray(order.timeline) ? order.timeline : []
      const updatedTimeline = [
        ...existingTimeline,
        {
          status: mappedShippingStatus,
          title: `Courier Status: ${currentStatus.toUpperCase()}`,
          note: `Location: ${location}. Activity update received from carrier.`,
          timestamp: new Date().toISOString(),
        },
      ]

      const updateFields: Record<string, any> = {
        shipping_status: mappedShippingStatus,
        timeline: updatedTimeline,
        updated_at: new Date().toISOString(),
      }

      if (orderStatusUpdate) {
        updateFields.status = orderStatusUpdate
      }

      await supabase.from('orders').update(updateFields).eq('id', order.id)
    }

    return NextResponse.json({ success: true, received: true })
  } catch (err: any) {
    console.error('[SHIPPING_WEBHOOK_ERROR]', err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
