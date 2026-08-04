import type { ISettingsRepository } from '@/repositories/types'
import type { AllSettings, SettingsSection } from '@/features/settings/types'
import { supabaseMappers } from './mappers'

const DEFAULT_SETTINGS: AllSettings = {
  general: {
    storeName: 'Chouhan Mattress',
    legalName: 'Chouhan Mattress Pvt Ltd',
    email: 'support@chouhanmattress.com',
    phone: '',
    supportPhone: '',
    gstin: '',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    locale: 'en-IN',
  },
  store: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    orderPrefix: 'CM',
    invoicePrefix: 'INV',
    lowStockThreshold: 5,
    maintenanceMode: false,
  },
  shipping: {
    freeShippingThreshold: 5000,
    defaultCarrier: 'Standard',
    codEnabled: true,
    codCharge: 49,
    zones: [],
  },
  payments: {
    gateways: [],
    codEnabled: true,
    codMaxOrderValue: 50000,
    autoCapture: false,
  },
  tax: {
    pricesIncludeTax: true,
    gstin: '',
    placeOfSupply: 'CG',
    rates: [],
  },
  notifications: {
    senderEmail: 'orders@chouhanmattress.com',
    senderName: 'Chouhan Mattress',
    smsSenderId: 'CHOHNM',
    whatsappEnabled: false,
    templates: [],
  },
}

export class SupabaseSettingsRepository implements ISettingsRepository {
  async getAll(): Promise<AllSettings> {
    const sb = supabaseMappers.getClient()
    const { data, error } = await sb.from('app_settings').select('*')
    if (error || !data) return DEFAULT_SETTINGS
    const merged = { ...DEFAULT_SETTINGS }
    for (const row of data as Record<string, unknown>[]) {
      const key = String(row.key) as SettingsSection
      if (key in merged) {
        const value = (row.value ?? {}) as Record<string, unknown>
        const current = (merged as Record<string, unknown>)[key] as Record<string, unknown>
        ;(merged as Record<string, unknown>)[key] = { ...current, ...value }
      }
    }
    return merged
  }

  async updateSection<K extends SettingsSection>(section: K, values: AllSettings[K]): Promise<AllSettings[K]> {
    const sb = supabaseMappers.getClient()
    const { error } = await sb.from('app_settings').upsert({
      key: section,
      value: values,
    }, { onConflict: 'key' })
    if (error) throw error
    return values
  }
}
