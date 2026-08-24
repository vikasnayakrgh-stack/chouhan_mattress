import 'server-only'
import { createAdminClient } from '@/lib/supabase/server'
import {
  checkShiprocketPincode,
  createShiprocketOrder,
  generateShiprocketAWB,
  getShiprocketLabel,
  trackShiprocketShipment,
} from '@/lib/shipping/shiprocket'
import { checkDelhiveryPincode } from '@/lib/shipping/delhivery'

export interface UnifiedPincodeResult {
  pincode: string
  serviceable: boolean
  carrier: string
  estimatedDays: number
  deliveryDateEstimate: string
  codAvailable: boolean
  freeDelivery: boolean
  source: 'shiprocket' | 'delhivery' | 'fallback'
}

/**
 * Unified Pincode Serviceability Engine with Shiprocket Primary & Delhivery Fallback
 */
export async function checkDeliveryPincode(pincode: string): Promise<UnifiedPincodeResult> {
  const cleanPin = pincode.trim().replace(/\D/g, '')
  if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
    return {
      pincode: cleanPin,
      serviceable: false,
      carrier: 'None',
      estimatedDays: 0,
      deliveryDateEstimate: 'N/A',
      codAvailable: false,
      freeDelivery: false,
      source: 'fallback',
    }
  }

  // 1. Primary Check: Shiprocket
  const rzpResult = await checkShiprocketPincode(cleanPin)
  if (rzpResult.serviceable) {
    const days = rzpResult.estimatedDays || 4
    const estDate = new Date()
    estDate.setDate(estDate.getDate() + days)

    return {
      pincode: cleanPin,
      serviceable: true,
      carrier: rzpResult.courierName || 'Delhivery Surface (Express)',
      estimatedDays: days,
      deliveryDateEstimate: estDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      codAvailable: rzpResult.codAvailable ?? true,
      freeDelivery: true,
      source: 'shiprocket',
    }
  }

  // 2. Secondary Fallback Check: Delhivery Direct
  const delResult = await checkDelhiveryPincode(cleanPin)
  if (delResult.serviceable) {
    const days = cleanPin.startsWith('49') ? 2 : 4
    const estDate = new Date()
    estDate.setDate(estDate.getDate() + days)

    return {
      pincode: cleanPin,
      serviceable: true,
      carrier: 'Delhivery Direct B2C',
      estimatedDays: days,
      deliveryDateEstimate: estDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      codAvailable: delResult.cod,
      freeDelivery: true,
      source: 'delhivery',
    }
  }

  // 3. Fallback for valid standard Indian 6-digit PIN codes
  return {
    pincode: cleanPin,
    serviceable: true,
    carrier: 'India Post / Blue Dart Express',
    estimatedDays: 5,
    deliveryDateEstimate: '5-7 Business Days',
    codAvailable: true,
    freeDelivery: true,
    source: 'fallback',
  }
}

/**
 * Automatically creates shipment, assigns AWB tracking number, and retrieves shipping label
 */
export async function autoCreateShipmentForOrder(orderIdOrDbId: string): Promise<{
  success: boolean
  awbNumber?: string
  carrier?: string
  labelUrl?: string
  error?: string
}> {
  const supabase = createAdminClient()
  if (!supabase) {
    return { success: false, error: 'Database client unavailable' }
  }

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .or(`id.eq.${orderIdOrDbId},order_number.eq.${orderIdOrDbId}`)
      .single()

    if (error || !order) {
      return { success: false, error: 'Order not found' }
    }

    // Skip if already assigned an AWB
    if (order.awb_number || order.tracking_number) {
      return {
        success: true,
        awbNumber: order.awb_number || order.tracking_number,
        carrier: order.carrier,
        labelUrl: order.shipping_label_url,
      }
    }

    const shipAddress = order.shipping_address || {}
    const items = Array.isArray(order.items) ? order.items : []

    // 1. Create order in Shiprocket
    const shipOrder = await createShiprocketOrder({
      orderId: order.order_number,
      orderDate: new Date(order.created_at).toISOString().split('T')[0],
      billingCustomerName: shipAddress.fullName || order.customer_name || 'Customer',
      billingAddress: `${shipAddress.houseNo || ''} ${shipAddress.street || ''}`.trim() || 'Address on file',
      billingCity: shipAddress.city || 'Raipur',
      billingPincode: shipAddress.pincode || '492001',
      billingState: shipAddress.state || 'Chhattisgarh',
      billingPhone: shipAddress.phone || order.customer_phone || '9999999999',
      paymentMethod: order.payment_method === 'cod' ? 'COD' : 'Prepaid',
      subTotal: Number(order.total),
      orderItems: items.map((i: any) => ({
        name: i.name || i.productName || 'Mattress',
        sku: i.sku || i.size || 'STANDARD-MATTRESS',
        units: Number(i.quantity) || 1,
        sellingPrice: Number(i.unitPrice || i.sellingPrice || order.total),
      })),
    })

    // 2. Generate AWB
    let awb = shipOrder.awbCode
    let courier = shipOrder.courierName || 'Delhivery Surface Express'

    if (!awb && shipOrder.shipmentId) {
      try {
        const awbResult = await generateShiprocketAWB(shipOrder.shipmentId)
        awb = awbResult.awbCode
        courier = awbResult.courierName
      } catch (awbErr) {
        console.warn('[AWB_GENERATION_WARN]', awbErr)
      }
    }

    // 3. Generate Label
    let labelUrl: string | undefined = undefined
    if (shipOrder.shipmentId) {
      try {
        labelUrl = await getShiprocketLabel(shipOrder.shipmentId)
      } catch (lblErr) {
        console.warn('[LABEL_GENERATION_WARN]', lblErr)
      }
    }

    // 4. Update order in Supabase
    const existingTimeline = Array.isArray(order.timeline) ? order.timeline : []
    const updatedTimeline = [
      ...existingTimeline,
      {
        status: 'shipped',
        title: 'Shipment Created & AWB Assigned',
        note: `Shipment booked via ${courier} (AWB: ${awb || 'Pending Manifest'}).`,
        timestamp: new Date().toISOString(),
      },
    ]

    await supabase
      .from('orders')
      .update({
        shipping_order_id: String(shipOrder.orderId),
        awb_number: awb,
        tracking_number: awb,
        carrier: courier,
        shipping_label_url: labelUrl,
        shipping_status: 'manifested',
        fulfillment_status: 'fulfilled',
        status: order.status === 'new' ? 'processing' : order.status,
        timeline: updatedTimeline,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    return {
      success: true,
      awbNumber: awb,
      carrier: courier,
      labelUrl,
    }
  } catch (err: any) {
    console.error('[AUTO_SHIPMENT_ERROR]', err)
    return { success: false, error: err?.message || 'Failed to generate shipment' }
  }
}

/**
 * Tracks order shipment status
 */
export async function trackOrderLive(awb: string): Promise<any> {
  return await trackShiprocketShipment(awb)
}

export const shippingService = {
  checkDeliveryPincode,
  autoCreateShipmentForOrder,
  trackOrderLive,
}
