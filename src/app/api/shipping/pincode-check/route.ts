import { NextRequest, NextResponse } from 'next/server'
import { checkDeliveryPincode } from '@/services/shippingService'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const pincode = searchParams.get('pincode')

  if (!pincode || !/^\d{6}$/.test(pincode.trim())) {
    return NextResponse.json(
      { success: false, error: 'Invalid 6-digit Indian PIN code' },
      { status: 400 }
    )
  }

  const result = await checkDeliveryPincode(pincode.trim())
  return NextResponse.json({ success: true, data: result })
}
