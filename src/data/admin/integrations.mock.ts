import type { Integration } from '@/features/integrations/types'

export const mockIntegrations: Integration[] = [
  {
    id: 'int-razorpay', name: 'Razorpay', provider: 'Razorpay Software Pvt. Ltd.', type: 'payments', status: 'connected',
    description: 'Accept UPI, cards, net banking, wallets and EMI payments.',
    connectedAt: '2025-02-01T10:00:00+05:30', lastSyncAt: '2026-07-27T09:00:00+05:30',
    apiKeys: [{ id: 'key-rzp-1', label: 'Live Key', maskedKey: 'rzp_live_••••••••4Kd9', createdAt: '2026-07-20T11:00:00+05:30', lastUsedAt: '2026-07-27T09:00:00+05:30' }],
    webhooks: [{ id: 'wh-rzp-1', url: 'https://api.chouhanmattress.com/webhooks/razorpay', events: ['payment.captured', 'payment.failed', 'refund.processed'], active: true, lastDeliveryAt: '2026-07-27T08:42:00+05:30', lastDeliveryStatus: 'success' }],
    configFields: [
      { key: 'key_id', label: 'Key ID', value: 'rzp_live_••••4Kd9', secret: true },
      { key: 'auto_capture', label: 'Auto Capture', value: 'true', secret: false },
    ],
  },
  {
    id: 'int-shiprocket', name: 'Shiprocket', provider: 'Bigfoot Retail Solutions', type: 'shipping', status: 'connected',
    description: 'Pan-India shipping, AWB generation and tracking sync.',
    connectedAt: '2025-02-10T10:00:00+05:30', lastSyncAt: '2026-07-27T08:30:00+05:30',
    apiKeys: [{ id: 'key-sr-1', label: 'API Token', maskedKey: 'sr_••••••••8mQ2', createdAt: '2025-02-10T10:00:00+05:30', lastUsedAt: '2026-07-27T08:30:00+05:30' }],
    webhooks: [{ id: 'wh-sr-1', url: 'https://api.chouhanmattress.com/webhooks/shiprocket', events: ['shipment.delivered', 'shipment.out_for_delivery', 'shipment.rto'], active: true, lastDeliveryAt: '2026-07-26T19:12:00+05:30', lastDeliveryStatus: 'success' }],
    configFields: [
      { key: 'pickup_location', label: 'Pickup Location', value: 'Bhanpuri Warehouse, Raipur', secret: false },
      { key: 'channel_id', label: 'Channel ID', value: '38291', secret: false },
    ],
  },
  {
    id: 'int-whatsapp', name: 'WhatsApp Business (Bluetick)', provider: 'Bluetick Digital', type: 'messaging', status: 'connected',
    description: 'Order updates, abandoned cart nudges and sales chat on WhatsApp.',
    connectedAt: '2025-06-01T10:00:00+05:30', lastSyncAt: '2026-07-27T09:15:00+05:30',
    apiKeys: [{ id: 'key-wa-1', label: 'Bluetick API Key', maskedKey: 'btk_••••••••7Yx1', createdAt: '2025-06-01T10:00:00+05:30', lastUsedAt: '2026-07-27T09:15:00+05:30' }],
    webhooks: [{ id: 'wh-wa-1', url: 'https://api.chouhanmattress.com/webhooks/whatsapp', events: ['message.received', 'message.status'], active: true, lastDeliveryAt: '2026-07-27T09:10:00+05:30', lastDeliveryStatus: 'success' }],
    configFields: [{ key: 'waba_number', label: 'WhatsApp Number', value: '+91 98261 45870', secret: false }],
  },
  {
    id: 'int-sendgrid', name: 'SendGrid Email', provider: 'Twilio SendGrid', type: 'email', status: 'connected',
    description: 'Transactional emails: order confirmations, shipping updates, refunds.',
    connectedAt: '2025-03-01T10:00:00+05:30', lastSyncAt: '2026-07-27T07:00:00+05:30',
    apiKeys: [{ id: 'key-sg-1', label: 'API Key', maskedKey: 'SG.••••••••pL3v', createdAt: '2025-03-01T10:00:00+05:30', lastUsedAt: '2026-07-27T07:00:00+05:30' }],
    webhooks: [],
    configFields: [{ key: 'sender', label: 'Sender', value: 'orders@chouhanmattress.com', secret: false }],
  },
  {
    id: 'int-twilio', name: 'Twilio SMS', provider: 'Twilio Inc.', type: 'sms', status: 'error',
    description: 'SMS notifications via DLT-registered sender ID CHNMTS.',
    connectedAt: '2025-04-01T10:00:00+05:30', lastSyncAt: '2026-07-25T14:00:00+05:30',
    apiKeys: [{ id: 'key-tw-1', label: 'Auth Token', maskedKey: 'tw_••••••••2Bn8', createdAt: '2025-04-01T10:00:00+05:30' }],
    webhooks: [{ id: 'wh-tw-1', url: 'https://api.chouhanmattress.com/webhooks/twilio', events: ['sms.delivered', 'sms.failed'], active: true, lastDeliveryAt: '2026-07-25T14:00:00+05:30', lastDeliveryStatus: 'failed' }],
    configFields: [{ key: 'sender_id', label: 'DLT Sender ID', value: 'CHNMTS', secret: false }],
  },
  {
    id: 'int-ga4', name: 'Google Analytics 4', provider: 'Google', type: 'analytics', status: 'connected',
    description: 'Traffic, conversion and ecommerce event tracking.',
    connectedAt: '2025-01-15T10:00:00+05:30', lastSyncAt: '2026-07-27T06:00:00+05:30',
    apiKeys: [],
    webhooks: [],
    configFields: [{ key: 'measurement_id', label: 'Measurement ID', value: 'G-CHN4MTRS22', secret: false }],
  },
  {
    id: 'int-erp', name: 'Tally ERP Sync', provider: 'Tally Solutions', type: 'erp', status: 'disconnected',
    description: 'Sync invoices, GST reports and inventory with Tally Prime.',
    apiKeys: [],
    webhooks: [],
    configFields: [{ key: 'company_name', label: 'Tally Company', value: 'Chouhan Mattress & Furnishings', secret: false }],
  },
  {
    id: 'int-supabase', name: 'Supabase', provider: 'Supabase Inc.', type: 'database', status: 'pending',
    description: 'Production database, auth and storage (migration planned).',
    apiKeys: [{ id: 'key-sb-1', label: 'Service Role Key', maskedKey: 'sbp_••••••••9Qw4', createdAt: '2026-07-15T10:00:00+05:30' }],
    webhooks: [],
    configFields: [{ key: 'project_ref', label: 'Project Ref', value: 'chouhan-prod', secret: false }],
  },
]
