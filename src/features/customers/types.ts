export type CustomerStatus = 'active' | 'inactive' | 'blocked'

export interface CustomerAddress {
  id: string
  label: string
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefaultShipping: boolean
  isDefaultBilling: boolean
}

export interface CustomerNote {
  id: string
  content: string
  author: string
  createdAt: string
  updatedAt?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  city: string
  state: string
  status: CustomerStatus
  ordersCount: number
  totalSpend: number
  lastOrderDate: string | null
  createdAt: string
  addresses: CustomerAddress[]
  notes: CustomerNote[]
}
