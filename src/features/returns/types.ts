export type ReturnStatus =
  | 'requested'
  | 'approved'
  | 'received'
  | 'inspected'
  | 'refunded'
  | 'rejected'

export type ReturnReason =
  | 'damaged'
  | 'defective'
  | 'wrong_item'
  | 'not_as_described'
  | 'size_issue'
  | 'comfort_issue'
  | 'changed_mind'
  | 'other'

export type ReturnResolution = 'refund' | 'replacement' | 'store_credit'

export interface ReturnItem {
  id: string
  orderItemId: string
  productName: string
  sku: string
  variantLabel: string
  quantity: number
  refundAmount: number
}

export interface ReturnTimelineEvent {
  id: string
  status: ReturnStatus | 'note'
  title: string
  description?: string
  timestamp: string
  actor?: string
}

export interface Return {
  id: string
  returnNumber: string // e.g. "RET-2001"
  orderId: string
  orderNumber: string
  customerId: string
  customerName: string
  customerPhone: string
  items: ReturnItem[]
  reason: ReturnReason
  reasonNote?: string
  resolution: ReturnResolution
  status: ReturnStatus
  refundAmount: number
  images: string[]
  timeline: ReturnTimelineEvent[]
  createdAt: string
  updatedAt: string
}

export const RETURN_REASON_LABELS: Record<ReturnReason, string> = {
  damaged: 'Damaged in transit',
  defective: 'Defective product',
  wrong_item: 'Wrong item delivered',
  not_as_described: 'Not as described',
  size_issue: 'Size issue',
  comfort_issue: 'Comfort issue',
  changed_mind: 'Changed mind',
  other: 'Other',
}

export const RETURN_RESOLUTION_LABELS: Record<ReturnResolution, string> = {
  refund: 'Refund',
  replacement: 'Replacement',
  store_credit: 'Store Credit',
}

export interface ReturnFilters {
  search?: string
  status?: ReturnStatus | 'all'
  reason?: ReturnReason | 'all'
  dateFrom?: string
  dateTo?: string
}
