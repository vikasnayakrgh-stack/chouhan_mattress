import 'server-only'

export interface ShiprocketPincodeResult {
  serviceable: boolean
  courierName?: string
  estimatedDays?: number
  etd?: string
  codAvailable?: boolean
}

export interface ShiprocketCreateOrderParams {
  orderId: string
  orderDate: string
  pickupLocation?: string
  billingCustomerName: string
  billingLastName?: string
  billingAddress: string
  billingCity: string
  billingPincode: string
  billingState: string
  billingCountry?: string
  billingEmail?: string
  billingPhone: string
  shippingIsBilling?: boolean
  orderItems: Array<{
    name: string
    sku: string
    units: number
    sellingPrice: number
    discount?: number
    tax?: number
  }>
  paymentMethod: 'Prepaid' | 'COD'
  subTotal: number
  length?: number
  breadth?: number
  height?: number
  weight?: number
}

export interface ShiprocketOrderResponse {
  orderId: number
  shipmentId: number
  status: string
  statusCode: number
  onboardingCompletedNow: number
  awbCode?: string
  courierName?: string
}

let cachedToken: string | null = null
let tokenExpiresAt: number = 0

const email = process.env.SHIPROCKET_EMAIL || ''
const password = process.env.SHIPROCKET_PASSWORD || ''

/**
 * Retrieves authenticated JWT from Shiprocket API with in-memory caching
 */
export async function getShiprocketToken(): Promise<string | null> {
  if (!email || !password) {
    return null
  }

  const now = Date.now()
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken
  }

  try {
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      console.error(`[SHIPROCKET_AUTH] Failed with status ${response.status}`)
      return null
    }

    const data = await response.json()
    cachedToken = data.token
    // Cache for 9 days (token valid for 10 days)
    tokenExpiresAt = now + 9 * 24 * 60 * 60 * 1000
    return cachedToken
  } catch (err) {
    console.error('[SHIPROCKET_AUTH] Exception:', err)
    return null
  }
}

/**
 * Checks pincode serviceability via Shiprocket
 */
export async function checkShiprocketPincode(
  deliveryPincode: string,
  pickupPincode: string = '492001',
  cod: boolean = false
): Promise<ShiprocketPincodeResult> {
  const token = await getShiprocketToken()

  // Sandbox fallback for test environments
  if (!token) {
    const validPincode = /^[1-9][0-9]{5}$/.test(deliveryPincode)
    return {
      serviceable: validPincode,
      courierName: 'Delhivery Surface (Express)',
      estimatedDays: deliveryPincode.startsWith('49') ? 2 : 4,
      etd: `${deliveryPincode.startsWith('49') ? 2 : 4} Business Days`,
      codAvailable: true,
    }
  }

  try {
    const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&cod=${cod ? 1 : 0}&weight=15`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return { serviceable: false }
    }

    const data = await response.json()
    const companies = data?.data?.available_courier_companies || []
    if (companies.length === 0) {
      return { serviceable: false }
    }

    const bestCourier = companies[0]
    return {
      serviceable: true,
      courierName: bestCourier.courier_name,
      estimatedDays: bestCourier.etd_hours ? Math.ceil(bestCourier.etd_hours / 24) : 4,
      etd: bestCourier.etd || '3-5 Business Days',
      codAvailable: bestCourier.cod === 1,
    }
  } catch (err) {
    console.error('[SHIPROCKET_PINCODE_CHECK] Exception:', err)
    return { serviceable: false }
  }
}

/**
 * Creates shipment in Shiprocket
 */
export async function createShiprocketOrder(
  params: ShiprocketCreateOrderParams
): Promise<ShiprocketOrderResponse> {
  const token = await getShiprocketToken()

  // Sandbox mode fallback
  if (!token) {
    console.log('[SHIPROCKET] Running in sandbox mode. Generated mock shipment.')
    const mockShipmentId = Math.floor(1000000 + Math.random() * 9000000)
    const mockAwb = `AWB${Math.floor(1000000000 + Math.random() * 9000000000)}`
    return {
      orderId: Math.floor(100000 + Math.random() * 900000),
      shipmentId: mockShipmentId,
      status: 'NEW',
      statusCode: 1,
      onboardingCompletedNow: 0,
      awbCode: mockAwb,
      courierName: 'Delhivery Surface Express',
    }
  }

  const payload = {
    order_id: params.orderId,
    order_date: params.orderDate,
    pickup_location: params.pickupLocation || 'Primary Warehouse',
    billing_customer_name: params.billingCustomerName,
    billing_last_name: params.billingLastName || '',
    billing_address: params.billingAddress,
    billing_city: params.billingCity,
    billing_pincode: params.billingPincode,
    billing_state: params.billingState,
    billing_country: params.billingCountry || 'India',
    billing_email: params.billingEmail || 'orders@chouhanmattress.com',
    billing_phone: params.billingPhone,
    shipping_is_billing: true,
    order_items: params.orderItems.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.units,
      selling_price: item.sellingPrice,
      discount: item.discount || 0,
      tax: item.tax || 0,
    })),
    payment_method: params.paymentMethod,
    sub_total: params.subTotal,
    length: params.length || 180,
    breadth: params.breadth || 90,
    height: params.height || 20,
    weight: params.weight || 20,
  }

  const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Shiprocket Order creation failed (${response.status}): ${errText}`)
  }

  const result = await response.json()
  return {
    orderId: result.order_id,
    shipmentId: result.shipment_id,
    status: result.status,
    statusCode: result.status_code,
    onboardingCompletedNow: result.onboarding_completed_now,
    awbCode: result.awb_code,
    courierName: result.courier_name,
  }
}

/**
 * Generates AWB for a created shipment in Shiprocket
 */
export async function generateShiprocketAWB(shipmentId: number): Promise<{ awbCode: string; courierName: string }> {
  const token = await getShiprocketToken()
  if (!token) {
    return {
      awbCode: `AWB${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      courierName: 'Delhivery Surface Express',
    }
  }

  const response = await fetch('https://apiv2.shiprocket.in/v1/external/courier/assign/awb', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shipment_id: shipmentId }),
  })

  if (!response.ok) {
    throw new Error(`AWB Generation failed with status ${response.status}`)
  }

  const data = await response.json()
  return {
    awbCode: data.response?.data?.awb_code,
    courierName: data.response?.data?.courier_name,
  }
}

/**
 * Generates shipping label URL in Shiprocket
 */
export async function getShiprocketLabel(shipmentId: number): Promise<string> {
  const token = await getShiprocketToken()
  if (!token) {
    return `https://shiprocket.co/label/mock_${shipmentId}.pdf`
  }

  const response = await fetch('https://apiv2.shiprocket.in/v1/external/generate/label', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shipment_id: [shipmentId] }),
  })

  if (!response.ok) {
    throw new Error(`Label generation failed with status ${response.status}`)
  }

  const data = await response.json()
  return data.label_url || data.label_created
}

/**
 * Tracks shipment by AWB or Order Number
 */
export async function trackShiprocketShipment(awb: string): Promise<any> {
  const token = await getShiprocketToken()
  if (!token) {
    return {
      tracking_data: {
        track_status: 1,
        shipment_status: 'IN_TRANSIT',
        current_status: 'In Transit — Dispatched from Central Facility',
        scans: [
          {
            location: 'Raipur Hub',
            date: new Date().toISOString(),
            activity: 'Shipment Manifested and Picked Up',
          },
        ],
      },
    }
  }

  const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    return null
  }

  return await response.json()
}
