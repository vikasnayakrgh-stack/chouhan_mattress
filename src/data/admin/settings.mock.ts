import type { AllSettings } from '@/features/settings/types'

export const mockSettings: AllSettings = {
  general: {
    storeName: 'Chouhan Mattress',
    legalName: 'Chouhan Mattress & Furnishings Pvt. Ltd.',
    email: 'care@chouhanmattress.com',
    phone: '+91 771 400 2525',
    supportPhone: '+91 98261 45870',
    gstin: '22AABCC1234D1ZE',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    locale: 'en-IN',
  },
  store: {
    addressLine1: 'Plot 14, Industrial Area, Bhanpuri',
    addressLine2: 'Near Transport Nagar',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492003',
    country: 'India',
    orderPrefix: 'CM-ORD-',
    invoicePrefix: 'CM-INV-',
    lowStockThreshold: 10,
    maintenanceMode: false,
  },
  shipping: {
    freeShippingThreshold: 4999,
    defaultCarrier: 'Shiprocket',
    codEnabled: true,
    codCharge: 99,
    zones: [
      { id: 'zone-001', name: 'Raipur Metro (Own Fleet)', states: ['Raipur', 'Bhilai', 'Durg'], rate: 0, freeAbove: 0, estimatedDays: '1-2 days' },
      { id: 'zone-002', name: 'Chhattisgarh', states: ['Chhattisgarh'], rate: 199, freeAbove: 4999, estimatedDays: '2-4 days' },
      { id: 'zone-003', name: 'Central India', states: ['Madhya Pradesh', 'Maharashtra', 'Odisha', 'Jharkhand'], rate: 349, freeAbove: 7999, estimatedDays: '4-6 days' },
      { id: 'zone-004', name: 'Rest of India', states: ['All other states'], rate: 499, freeAbove: 9999, estimatedDays: '5-8 days' },
    ],
  },
  payments: {
    gateways: [
      { id: 'gw-razorpay', name: 'Razorpay', enabled: true, mode: 'live', supportedMethods: ['UPI', 'Cards', 'Net Banking', 'Wallets', 'EMI'] },
      { id: 'gw-cod', name: 'Cash on Delivery', enabled: true, mode: 'live', supportedMethods: ['Cash', 'UPI on delivery'] },
    ],
    codEnabled: true,
    codMaxOrderValue: 50000,
    autoCapture: true,
  },
  tax: {
    pricesIncludeTax: true,
    gstin: '22AABCC1234D1ZE',
    placeOfSupply: 'Chhattisgarh (22)',
    rates: [
      { id: 'tax-001', name: 'GST 18% (Mattresses)', rate: 18, hsnCode: '9404', categories: ['Mattresses', 'Bed Frames'] },
      { id: 'tax-002', name: 'GST 12% (Pillows & Bedding)', rate: 12, hsnCode: '9404.90', categories: ['Pillows', 'Protectors', 'Comforters'] },
      { id: 'tax-003', name: 'GST 5% (Cotton Items)', rate: 5, hsnCode: '6302', categories: ['Bed Sheets'] },
    ],
  },
  notifications: {
    senderEmail: 'orders@chouhanmattress.com',
    senderName: 'Chouhan Mattress',
    smsSenderId: 'CHNMTS',
    whatsappEnabled: true,
    templates: [
      { id: 'nt-001', event: 'Order Confirmed', channel: 'email', enabled: true, subject: 'Your Chouhan Mattress order {order_number} is confirmed' },
      { id: 'nt-002', event: 'Order Confirmed', channel: 'whatsapp', enabled: true },
      { id: 'nt-003', event: 'Order Shipped', channel: 'email', enabled: true, subject: 'Your order {order_number} is on its way!' },
      { id: 'nt-004', event: 'Order Shipped', channel: 'sms', enabled: true },
      { id: 'nt-005', event: 'Order Delivered', channel: 'whatsapp', enabled: true },
      { id: 'nt-006', event: 'Abandoned Cart', channel: 'whatsapp', enabled: true },
      { id: 'nt-007', event: 'Refund Processed', channel: 'email', enabled: true, subject: 'Refund processed for order {order_number}' },
      { id: 'nt-008', event: 'Review Request', channel: 'email', enabled: false, subject: 'How is your new mattress treating you?' },
    ],
  },
}
