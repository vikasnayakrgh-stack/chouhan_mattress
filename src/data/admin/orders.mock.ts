import type { Order, OrderStatus, PaymentStatus, Address, OrderItem } from '@/features/orders/types'

const addr = (name: string, phone: string, city: string, state: string, pincode: string): Address => ({
  name,
  phone,
  line1: `${Math.floor(Math.random() * 0) + 12}, Residency Road`,
  city,
  state,
  pincode,
  country: 'India',
})

function item(
  id: string,
  productId: string,
  productName: string,
  sku: string,
  variantLabel: string,
  qty: number,
  mrp: number,
  price: number
): OrderItem {
  return {
    id,
    productId,
    productName,
    variantId: `var-${sku.toLowerCase()}`,
    sku,
    variantLabel,
    quantity: qty,
    mrp,
    sellingPrice: price,
    total: price * qty,
  }
}

function order(
  n: number,
  customerId: string,
  customerName: string,
  email: string,
  phone: string,
  items: OrderItem[],
  status: OrderStatus,
  paymentStatus: PaymentStatus,
  paymentMethod: string,
  city: string,
  state: string,
  pincode: string,
  createdAt: string,
  shippingFee = 0,
  discount = 0
): Order {
  const subtotal = items.reduce((s, i) => s + i.total, 0)
  const tax = Math.round(subtotal * 0.18)
  const address = addr(customerName, phone, city, state, pincode)
  const fulfillmentStatus =
    status === 'delivered' ? 'fulfilled' : status === 'shipped' || status === 'packed' ? 'partially_fulfilled' : 'unfulfilled'
  return {
    id: `order-${String(n).padStart(3, '0')}`,
    orderNumber: `CM-${1000 + n}`,
    customerId,
    customerName,
    customerEmail: email,
    customerPhone: phone,
    items,
    subtotal,
    discount,
    shippingFee,
    tax,
    total: subtotal - discount + shippingFee + tax,
    status,
    paymentStatus,
    paymentMethod,
    fulfillmentStatus,
    shippingAddress: address,
    billingAddress: address,
    timeline: [
      {
        id: `tl-${n}-1`,
        status: 'new',
        title: 'Order placed',
        description: `Order CM-${1000 + n} was placed by ${customerName}`,
        timestamp: createdAt,
      },
      ...(status !== 'new'
        ? [
            {
              id: `tl-${n}-2`,
              status,
              title: `Order ${status}`,
              description: `Status updated to ${status}`,
              timestamp: createdAt,
              actor: 'Rahul Chouhan',
            },
          ]
        : []),
    ],
    createdAt,
    updatedAt: createdAt,
  }
}

const rawOrders: Order[] = [
  order(42, 'cust-001', 'Amit Sharma', 'amit.sharma@gmail.com', '+91 98765 43210',
    [item('oi-1', 'prod-001', 'OrthoSpine Pro Memory Foam Mattress', 'CM-ORTHO-7260-6', 'Queen / 6 inch', 1, 19999, 13999)],
    'new', 'pending', 'UPI', 'Indore', 'Madhya Pradesh', '452001', '2026-07-26T10:15:00Z'),
  order(41, 'cust-002', 'Priya Patel', 'priya.patel@yahoo.com', '+91 98221 12345',
    [item('oi-2', 'prod-006', 'CoolGel Memory Foam Pillow', 'CM-CGPIL-QN', 'Queen', 2, 2499, 1599),
     item('oi-3', 'prod-008', 'Premium Mattress Protector', 'CM-PROT-7260', 'Queen', 1, 1999, 1249)],
    'confirmed', 'paid', 'Credit Card', 'Ahmedabad', 'Gujarat', '380015', '2026-07-25T14:30:00Z'),
  order(40, 'cust-003', 'Rajesh Verma', 'rajesh.verma@outlook.com', '+91 90909 80808',
    [item('oi-4', 'prod-005', 'PocketSpring Luxury Mattress', 'CM-POCKET-7272-10', 'King / 10 inch', 1, 45999, 34999)],
    'processing', 'paid', 'Net Banking', 'Bhopal', 'Madhya Pradesh', '462001', '2026-07-24T09:00:00Z', 0, 2000),
  order(39, 'cust-004', 'Sunita Joshi', 'sunita.joshi@gmail.com', '+91 88700 5566',
    [item('oi-5', 'prod-002', 'ComfortCloud Dual Comfort Mattress', 'CM-DUAL-7260-5', 'Queen / 5 inch', 1, 14999, 10499)],
    'packed', 'cod', 'Cash on Delivery', 'Jaipur', 'Rajasthan', '302001', '2026-07-23T16:45:00Z', 199),
  order(38, 'cust-005', 'Vikram Singh Rathore', 'vikram.rathore@gmail.com', '+91 99280 11223',
    [item('oi-6', 'prod-010', 'Adjustable Bed Base', 'CM-BASE-7260', 'Queen', 1, 44999, 35999)],
    'shipped', 'paid', 'Credit Card', 'Udaipur', 'Rajasthan', '313001', '2026-07-21T11:20:00Z'),
  order(37, 'cust-006', 'Neha Gupta', 'neha.gupta@gmail.com', '+91 98111 22334',
    [item('oi-7', 'prod-003', 'SpineGuard Coir Mattress', 'CM-COIR-7248-4', 'Double / 4 inch', 1, 10999, 7699)],
    'shipped', 'cod', 'Cash on Delivery', 'New Delhi', 'Delhi', '110019', '2026-07-20T13:00:00Z', 199),
  order(36, 'cust-007', 'Suresh Kumar', 'suresh.kumar@rediffmail.com', '+91 94250 66778',
    [item('oi-8', 'prod-001', 'OrthoSpine Pro Memory Foam Mattress', 'CM-ORTHO-7272-8', 'King / 8 inch', 1, 27999, 19999),
     item('oi-9', 'prod-007', 'NeckSupport Cervical Pillow', 'CM-CVPIL-STD', 'Standard', 2, 1799, 1199)],
    'delivered', 'paid', 'UPI', 'Indore', 'Madhya Pradesh', '452010', '2026-07-15T10:00:00Z'),
  order(35, 'cust-008', 'Anjali Deshmukh', 'anjali.d@gmail.com', '+91 98600 44556',
    [item('oi-10', 'prod-004', 'DreamRest Bonnell Spring Mattress', 'CM-SPRING-7260-6', 'Queen / 6 inch', 1, 17999, 12599)],
    'delivered', 'paid', 'Debit Card', 'Pune', 'Maharashtra', '411038', '2026-07-12T15:30:00Z'),
  order(34, 'cust-009', 'Mohammed Irfan', 'irfan.md@gmail.com', '+91 90000 12312',
    [item('oi-11', 'prod-006', 'CoolGel Memory Foam Pillow', 'CM-CGPIL-STD', 'Standard', 4, 1999, 1299)],
    'delivered', 'paid', 'UPI', 'Hyderabad', 'Telangana', '500001', '2026-07-10T09:45:00Z'),
  order(33, 'cust-010', 'Kavita Nair', 'kavita.nair@gmail.com', '+91 98470 88990',
    [item('oi-12', 'prod-008', 'Premium Mattress Protector', 'CM-PROT-7272', 'King', 2, 2299, 1449)],
    'delivered', 'paid', 'UPI', 'Kochi', 'Kerala', '682001', '2026-07-08T12:10:00Z'),
  order(32, 'cust-001', 'Amit Sharma', 'amit.sharma@gmail.com', '+91 98765 43210',
    [item('oi-13', 'prod-009', 'Bamboo Cooling Mattress Protector', 'CM-BPROT-7260', 'Queen', 1, 2999, 2099)],
    'cancelled', 'refunded', 'UPI', 'Indore', 'Madhya Pradesh', '452001', '2026-07-05T17:00:00Z'),
  order(31, 'cust-011', 'Deepak Malhotra', 'deepak.m@gmail.com', '+91 98100 33445',
    [item('oi-14', 'prod-002', 'ComfortCloud Dual Comfort Mattress', 'CM-DUAL-7272-5', 'King / 5 inch', 1, 17999, 12599)],
    'returned', 'refunded', 'Credit Card', 'Gurugram', 'Haryana', '122002', '2026-07-02T10:30:00Z'),
  order(30, 'cust-012', 'Shreya Iyer', 'shreya.iyer@gmail.com', '+91 98840 77889',
    [item('oi-15', 'prod-001', 'OrthoSpine Pro Memory Foam Mattress', 'CM-ORTHO-7236-6', 'Single / 6 inch', 1, 12999, 8999)],
    'delivered', 'paid', 'Net Banking', 'Chennai', 'Tamil Nadu', '600040', '2026-06-28T08:20:00Z'),
  order(29, 'cust-005', 'Vikram Singh Rathore', 'vikram.rathore@gmail.com', '+91 99280 11223',
    [item('oi-16', 'prod-007', 'NeckSupport Cervical Pillow', 'CM-CVPIL-LG', 'Large', 1, 2199, 1499)],
    'cancelled', 'failed', 'Credit Card', 'Udaipur', 'Rajasthan', '313001', '2026-06-25T19:15:00Z'),
  order(28, 'cust-003', 'Rajesh Verma', 'rajesh.verma@outlook.com', '+91 90909 80808',
    [item('oi-17', 'prod-003', 'SpineGuard Coir Mattress', 'CM-COIR-7236-4', 'Single / 4 inch', 2, 7999, 5599)],
    'delivered', 'cod', 'Cash on Delivery', 'Bhopal', 'Madhya Pradesh', '462001', '2026-06-20T11:40:00Z', 199),
]

// Enrich with tracking, carrier, refunds and extra timeline events for shipped/delivered/returned orders
const CARRIERS = ['Delhivery', 'Blue Dart', 'Ekart Logistics', 'DTDC']

export const mockOrders: Order[] = rawOrders.map((o, idx) => {
  const enriched: Order = { ...o, refunds: [] }
  if (['shipped', 'delivered', 'returned'].includes(o.status)) {
    enriched.trackingNumber = `AWB${9000000000 + idx * 137}`
    enriched.carrier = CARRIERS[idx % CARRIERS.length]
    enriched.timeline = [
      ...enriched.timeline,
      {
        id: `tl-${o.id}-ship`,
        status: 'shipped',
        title: 'Shipment created',
        description: `Tracking ${enriched.trackingNumber} via ${enriched.carrier}`,
        timestamp: o.updatedAt,
        actor: 'Rahul Chouhan',
      },
    ]
  }
  if (o.paymentStatus === 'refunded') {
    enriched.refunds = [
      {
        id: `ref-${o.id}`,
        amount: o.total,
        reason: o.status === 'returned' ? 'Product returned by customer' : 'Order cancelled',
        type: 'full',
        status: 'processed',
        createdAt: o.updatedAt,
        actor: 'Rahul Chouhan',
      },
    ]
  }
  return enriched
})
