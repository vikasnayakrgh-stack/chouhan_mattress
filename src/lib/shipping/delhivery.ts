import 'server-only'

export interface DelhiveryPincodeResult {
  serviceable: boolean
  prepaid: boolean
  cod: boolean
  repl: boolean
  pickup: boolean
  state: string
  city: string
  etd?: string
}

const apiToken = process.env.DELHIVERY_API_TOKEN || ''

/**
 * Checks pincode serviceability directly via Delhivery B2C API
 */
export async function checkDelhiveryPincode(pincode: string): Promise<DelhiveryPincodeResult> {
  if (!apiToken) {
    const valid = /^[1-9][0-9]{5}$/.test(pincode)
    return {
      serviceable: valid,
      prepaid: true,
      cod: true,
      repl: false,
      pickup: true,
      state: 'Chhattisgarh',
      city: 'Raipur',
      etd: '3-4 Business Days',
    }
  }

  try {
    const response = await fetch(`https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`, {
      headers: {
        Authorization: `Token ${apiToken}`,
      },
    })

    if (!response.ok) {
      return { serviceable: false, prepaid: false, cod: false, repl: false, pickup: false, state: '', city: '' }
    }

    const data = await response.json()
    const pinData = data?.delivery_codes?.[0]?.postal_code

    if (!pinData) {
      return { serviceable: false, prepaid: false, cod: false, repl: false, pickup: false, state: '', city: '' }
    }

    return {
      serviceable: pinData.pre_paid === 'Y' || pinData.cod === 'Y',
      prepaid: pinData.pre_paid === 'Y',
      cod: pinData.cod === 'Y',
      repl: pinData.repl === 'Y',
      pickup: pinData.pickup === 'Y',
      state: pinData.state_code || '',
      city: pinData.district || '',
      etd: '3-5 Business Days',
    }
  } catch (err) {
    console.error('[DELHIVERY_PINCODE_CHECK] Exception:', err)
    return { serviceable: false, prepaid: false, cod: false, repl: false, pickup: false, state: '', city: '' }
  }
}

/**
 * Tracks shipment via Delhivery API
 */
export async function trackDelhiveryWaybill(waybill: string): Promise<any> {
  if (!apiToken) {
    return {
      ShipmentData: [
        {
          Shipment: {
            Status: {
              Status: 'In Transit',
              StatusDateTime: new Date().toISOString(),
              StatusLocation: 'Raipur Gateway',
              Instructions: 'Out for long haul transit',
            },
          },
        },
      ],
    }
  }

  try {
    const response = await fetch(`https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}`, {
      headers: {
        Authorization: `Token ${apiToken}`,
      },
    })

    if (!response.ok) return null
    return await response.json()
  } catch (err) {
    console.error('[DELHIVERY_TRACK_ERROR]', err)
    return null
  }
}
