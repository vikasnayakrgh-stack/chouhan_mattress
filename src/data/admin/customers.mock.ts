import type { Customer, CustomerAddress, CustomerNote } from '@/features/customers/types'

const address = (
  id: string,
  label: string,
  name: string,
  phone: string,
  line1: string,
  city: string,
  state: string,
  pincode: string,
  isDefaultShipping = true,
  isDefaultBilling = true,
  line2?: string
): CustomerAddress => ({
  id,
  label,
  name,
  phone,
  line1,
  line2,
  city,
  state,
  pincode,
  country: 'India',
  isDefaultShipping,
  isDefaultBilling,
})

const note = (id: string, content: string, createdAt: string, author = 'Rahul Chouhan'): CustomerNote => ({
  id,
  content,
  author,
  createdAt,
})

export const mockCustomers: Customer[] = [
  {
    id: 'cust-001', name: 'Amit Sharma', email: 'amit.sharma@gmail.com', phone: '+91 98765 43210', city: 'Indore', state: 'Madhya Pradesh', status: 'active', ordersCount: 3, totalSpend: 28497, lastOrderDate: '2026-07-26', createdAt: '2025-11-02',
    addresses: [
      address('addr-001a', 'Home', 'Amit Sharma', '+91 98765 43210', '12, Residency Road, Vijay Nagar', 'Indore', 'Madhya Pradesh', '452001'),
      address('addr-001b', 'Office', 'Amit Sharma', '+91 98765 43210', '3rd Floor, Brilliant Titanium, Scheme 78', 'Indore', 'Madhya Pradesh', '452010', false, false),
    ],
    notes: [
      note('note-001a', 'Repeat customer — prefers UPI payments. Asked about king-size upgrade options.', '2026-07-20T10:00:00Z'),
      note('note-001b', 'Cancelled one order (CM-1032) due to delayed dispatch. Handle with priority.', '2026-07-06T09:30:00Z', 'Pooja Chouhan'),
    ],
  },
  {
    id: 'cust-002', name: 'Priya Patel', email: 'priya.patel@yahoo.com', phone: '+91 98221 12345', city: 'Ahmedabad', state: 'Gujarat', status: 'active', ordersCount: 2, totalSpend: 9645, lastOrderDate: '2026-07-25', createdAt: '2026-01-14',
    addresses: [address('addr-002a', 'Home', 'Priya Patel', '+91 98221 12345', 'B-204, Shivalik Heights, Satellite', 'Ahmedabad', 'Gujarat', '380015')],
    notes: [note('note-002a', 'Interested in bulk pillow order for guest house. Follow up in August.', '2026-07-25T15:00:00Z')],
  },
  {
    id: 'cust-003', name: 'Rajesh Verma', email: 'rajesh.verma@outlook.com', phone: '+91 90909 80808', city: 'Bhopal', state: 'Madhya Pradesh', status: 'active', ordersCount: 4, totalSpend: 62195, lastOrderDate: '2026-07-24', createdAt: '2025-09-20',
    addresses: [
      address('addr-003a', 'Home', 'Rajesh Verma', '+91 90909 80808', '45, Arera Colony, E-7', 'Bhopal', 'Madhya Pradesh', '462016'),
      address('addr-003b', 'Farmhouse', 'Rajesh Verma', '+91 90909 80808', 'Kolar Road, Near Sarvadharm', 'Bhopal', 'Madhya Pradesh', '462042', false, false),
    ],
    notes: [note('note-003a', 'VIP customer. Gave 5-star Google review. Eligible for loyalty discount.', '2026-07-24T12:00:00Z')],
  },
  {
    id: 'cust-004', name: 'Sunita Joshi', email: 'sunita.joshi@gmail.com', phone: '+91 88700 5566', city: 'Jaipur', state: 'Rajasthan', status: 'active', ordersCount: 1, totalSpend: 12587, lastOrderDate: '2026-07-23', createdAt: '2026-05-10',
    addresses: [address('addr-004a', 'Home', 'Sunita Joshi', '+91 88700 5566', '78, Malviya Nagar, Sector 5', 'Jaipur', 'Rajasthan', '302017')],
    notes: [],
  },
  {
    id: 'cust-005', name: 'Vikram Singh Rathore', email: 'vikram.rathore@gmail.com', phone: '+91 99280 11223', city: 'Udaipur', state: 'Rajasthan', status: 'active', ordersCount: 2, totalSpend: 44268, lastOrderDate: '2026-07-21', createdAt: '2026-02-08',
    addresses: [address('addr-005a', 'Home', 'Vikram Singh Rathore', '+91 99280 11223', 'Villa 12, Fateh Sagar Road', 'Udaipur', 'Rajasthan', '313001')],
    notes: [note('note-005a', 'One payment failed earlier — card issue resolved. High AOV customer.', '2026-06-26T11:00:00Z')],
  },
  {
    id: 'cust-006', name: 'Neha Gupta', email: 'neha.gupta@gmail.com', phone: '+91 98111 22334', city: 'New Delhi', state: 'Delhi', status: 'active', ordersCount: 1, totalSpend: 9284, lastOrderDate: '2026-07-20', createdAt: '2026-06-01',
    addresses: [address('addr-006a', 'Home', 'Neha Gupta', '+91 98111 22334', 'C-56, Kalkaji Extension', 'New Delhi', 'Delhi', '110019')],
    notes: [],
  },
  {
    id: 'cust-007', name: 'Suresh Kumar', email: 'suresh.kumar@rediffmail.com', phone: '+91 94250 66778', city: 'Indore', state: 'Madhya Pradesh', status: 'active', ordersCount: 5, totalSpend: 78450, lastOrderDate: '2026-07-15', createdAt: '2025-06-15',
    addresses: [
      address('addr-007a', 'Home', 'Suresh Kumar', '+91 94250 66778', '23, Sudama Nagar, Sector D', 'Indore', 'Madhya Pradesh', '452009'),
      address('addr-007b', 'Shop', 'Suresh Kumar', '+91 94250 66778', 'Shop 5, Rajwada Market', 'Indore', 'Madhya Pradesh', '452002', false, false),
    ],
    notes: [note('note-007a', 'Oldest customer — 5 orders. Referred 2 friends. Send festive coupon.', '2026-07-16T09:00:00Z')],
  },
  {
    id: 'cust-008', name: 'Anjali Deshmukh', email: 'anjali.d@gmail.com', phone: '+91 98600 44556', city: 'Pune', state: 'Maharashtra', status: 'active', ordersCount: 2, totalSpend: 20120, lastOrderDate: '2026-07-12', createdAt: '2026-03-22',
    addresses: [address('addr-008a', 'Home', 'Anjali Deshmukh', '+91 98600 44556', 'Flat 801, Amanora Park Town', 'Pune', 'Maharashtra', '411028')],
    notes: [],
  },
  {
    id: 'cust-009', name: 'Mohammed Irfan', email: 'irfan.md@gmail.com', phone: '+91 90000 12312', city: 'Hyderabad', state: 'Telangana', status: 'active', ordersCount: 1, totalSpend: 6131, lastOrderDate: '2026-07-10', createdAt: '2026-07-01',
    addresses: [address('addr-009a', 'Home', 'Mohammed Irfan', '+91 90000 12312', '8-2-293, Road No. 14, Banjara Hills', 'Hyderabad', 'Telangana', '500034')],
    notes: [],
  },
  {
    id: 'cust-010', name: 'Kavita Nair', email: 'kavita.nair@gmail.com', phone: '+91 98470 88990', city: 'Kochi', state: 'Kerala', status: 'active', ordersCount: 1, totalSpend: 3419, lastOrderDate: '2026-07-08', createdAt: '2026-06-18',
    addresses: [address('addr-010a', 'Home', 'Kavita Nair', '+91 98470 88990', '34, Panampilly Nagar', 'Kochi', 'Kerala', '682036')],
    notes: [],
  },
  {
    id: 'cust-011', name: 'Deepak Malhotra', email: 'deepak.m@gmail.com', phone: '+91 98100 33445', city: 'Gurugram', state: 'Haryana', status: 'inactive', ordersCount: 1, totalSpend: 14867, lastOrderDate: '2026-07-02', createdAt: '2026-04-05',
    addresses: [address('addr-011a', 'Home', 'Deepak Malhotra', '+91 98100 33445', 'Tower B-1203, DLF Phase 3', 'Gurugram', 'Haryana', '122002')],
    notes: [note('note-011a', 'Returned mattress (comfort issue). Refund processed. Offered exchange discount — declined.', '2026-07-05T14:00:00Z')],
  },
  {
    id: 'cust-012', name: 'Shreya Iyer', email: 'shreya.iyer@gmail.com', phone: '+91 98840 77889', city: 'Chennai', state: 'Tamil Nadu', status: 'active', ordersCount: 1, totalSpend: 10619, lastOrderDate: '2026-06-28', createdAt: '2026-06-10',
    addresses: [address('addr-012a', 'Home', 'Shreya Iyer', '+91 98840 77889', '12/4, 2nd Main Road, Anna Nagar', 'Chennai', 'Tamil Nadu', '600040')],
    notes: [],
  },
]
