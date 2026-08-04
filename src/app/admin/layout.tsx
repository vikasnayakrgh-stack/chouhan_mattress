import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/AdminShell'
import './admin.css'

export const metadata: Metadata = {
  title: 'Admin | Chouhan Mattress',
  description: 'Chouhan Mattress admin panel',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
