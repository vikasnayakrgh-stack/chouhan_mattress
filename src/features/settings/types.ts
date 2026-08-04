export interface GeneralSettings {
  storeName: string
  legalName: string
  email: string
  phone: string
  supportPhone: string
  gstin: string
  timezone: string
  currency: string
  locale: string
}

export interface StoreSettings {
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  country: string
  orderPrefix: string
  invoicePrefix: string
  lowStockThreshold: number
  maintenanceMode: boolean
}

export interface ShippingZone {
  id: string
  name: string
  states: string[]
  rate: number
  freeAbove: number
  estimatedDays: string
}

export interface ShippingSettings {
  freeShippingThreshold: number
  defaultCarrier: string
  codEnabled: boolean
  codCharge: number
  zones: ShippingZone[]
}

export interface PaymentGateway {
  id: string
  name: string
  enabled: boolean
  mode: 'test' | 'live'
  supportedMethods: string[]
}

export interface PaymentSettings {
  gateways: PaymentGateway[]
  codEnabled: boolean
  codMaxOrderValue: number
  autoCapture: boolean
}

export interface TaxRate {
  id: string
  name: string
  rate: number
  hsnCode: string
  categories: string[]
}

export interface TaxSettings {
  pricesIncludeTax: boolean
  gstin: string
  placeOfSupply: string
  rates: TaxRate[]
}

export interface NotificationTemplate {
  id: string
  event: string
  channel: 'email' | 'sms' | 'whatsapp'
  enabled: boolean
  subject?: string
}

export interface NotificationSettings {
  senderEmail: string
  senderName: string
  smsSenderId: string
  whatsappEnabled: boolean
  templates: NotificationTemplate[]
}

export interface AllSettings {
  general: GeneralSettings
  store: StoreSettings
  shipping: ShippingSettings
  payments: PaymentSettings
  tax: TaxSettings
  notifications: NotificationSettings
}

export type SettingsSection = keyof AllSettings
