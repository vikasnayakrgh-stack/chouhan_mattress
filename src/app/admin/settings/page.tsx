'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  UserPlus,
  ShieldCheck,
  Mail,
  Copy,
  Check,
  X,
  Trash2,
  RefreshCw,
  Crown,
  KeyRound,
  Sliders,
  Sparkles,
  Search,
} from 'lucide-react'
import { AdminPageHeader, AdminDataTable } from '@/components/admin'
import { toast } from 'sonner'

interface StaffMember {
  id: string
  auth_user_id?: string
  name: string
  email: string
  role: string
  status: 'active' | 'invited' | 'disabled'
  last_login_at?: string
  created_at: string
}

interface StaffInvitation {
  id: string
  email: string
  role: string
  token: string
  status: 'pending' | 'accepted' | 'expired' | 'revoked'
  expires_at: string
  created_at: string
}

const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin', desc: 'Full unrestricted system access, staff onboarding, settings' },
  { value: 'admin', label: 'Admin', desc: 'Manage products, orders, discounts, reviews, content' },
  { value: 'manager', label: 'Store Manager', desc: 'Manage inventory, orders, discounts, customer support' },
  { value: 'inventory', label: 'Inventory Manager', desc: 'Manage product stock levels & low-stock alerts' },
  { value: 'sales', label: 'Sales & Fulfillment', desc: 'Manage sales orders & fulfillment status' },
  { value: 'customer_support', label: 'Customer Support', desc: 'View customer directory & manage product reviews' },
  { value: 'content_editor', label: 'Content Editor', desc: 'Manage homepage CMS, banners, FAQs & SEO' },
]

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'staff' | 'store' | 'integrations'>('staff')
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [invitations, setInvitations] = useState<StaffInvitation[]>([])
  const [loading, setLoading] = useState(true)

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState('admin')
  const [submittingInvite, setSubmittingInvite] = useState(false)
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  const fetchStaffData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/staff')
      const json = await res.json()
      if (json.success) {
        setStaff(json.data.staff || [])
        setInvitations(json.data.invitations || [])
      } else {
        toast.error(json.error || 'Failed to fetch staff directory')
      }
    } catch (err) {
      toast.error('Network error fetching staff directory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaffData()
  }, [])

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingInvite(true)
    try {
      const res = await fetch('/api/admin/staff/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          name: inviteName,
          role: inviteRole,
        }),
      })

      const json = await res.json()
      if (json.success) {
        toast.success(`Invitation dispatched for ${inviteEmail}!`)
        setGeneratedInviteLink(json.data.inviteLink)
        fetchStaffData()
      } else {
        toast.error(json.error || 'Failed to dispatch invitation')
      }
    } catch (err) {
      toast.error('Server error creating staff invitation')
    } finally {
      setSubmittingInvite(false)
    }
  }

  const handleRevokeInvite = async (invitationId: string) => {
    try {
      const res = await fetch(`/api/admin/staff/invite?id=${invitationId}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Invitation revoked successfully')
        fetchStaffData()
      } else {
        toast.error(json.error || 'Failed to revoke invitation')
      }
    } catch (err) {
      toast.error('Error revoking invitation')
    }
  }

  const handleUpdateRole = async (staffId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, role: newRole }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Staff role updated')
        fetchStaffData()
      } else {
        toast.error(json.error || 'Failed to update role')
      }
    } catch (err) {
      toast.error('Error updating role')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedLink(true)
    toast.success('Invite link copied to clipboard!')
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
      case 'owner':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-extrabold">
            <Crown className="w-3.5 h-3.5 text-amber-400" /> Super Admin
          </span>
        )
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            Admin
          </span>
        )
      case 'manager':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold">
            Store Manager
          </span>
        )
      case 'inventory':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold">
            Inventory
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold capitalize">
            {role.replace('_', ' ')}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <AdminPageHeader
        title="System Settings & Staff RBAC"
        description="Manage enterprise staff directory, role-based permissions, and invitations."
      />

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Staff Directory & RBAC</span>
        </button>
        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'store'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Store Configuration</span>
        </button>
      </div>

      {activeTab === 'staff' && (
        <div className="space-y-8">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
            <div>
              <h3 className="text-lg font-extrabold text-white">Staff Directory & Permissions</h3>
              <p className="text-xs text-slate-400 mt-1">
                Only active staff members with assigned RBAC roles can access Chouhan Mattress Admin.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchStaffData}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-colors"
                title="Refresh directory"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setGeneratedInviteLink(null)
                  setShowInviteModal(true)
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Invite Staff Member</span>
              </button>
            </div>
          </div>

          {/* Active Staff Directory */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" /> Active Staff Directory ({staff.length})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5">Staff Member</th>
                    <th className="px-4 py-3.5">Assigned Role</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Last Active</th>
                    <th className="px-4 py-3.5 text-right">Role Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {staff.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-extrabold text-xs">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-white text-xs">{member.name}</p>
                            <p className="text-[11px] text-slate-400">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">{getRoleBadge(member.role)}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                            member.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {member.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                        {member.last_login_at
                          ? new Date(member.last_login_at).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Never'}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                          disabled={member.role === 'super_admin'}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Invitations */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" /> Pending Invitations (
                {invitations.filter((i) => i.status === 'pending').length})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5">Invited Email</th>
                    <th className="px-4 py-3.5">Assigned Role</th>
                    <th className="px-4 py-3.5">Invitation Link</th>
                    <th className="px-4 py-3.5">Expires</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {invitations.filter((i) => i.status === 'pending').length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-xs">
                        No pending staff invitations.
                      </td>
                    </tr>
                  ) : (
                    invitations
                      .filter((i) => i.status === 'pending')
                      .map((invite) => {
                        const link = typeof window !== 'undefined'
                          ? `${window.location.origin}/admin/login?inviteToken=${invite.token}&email=${encodeURIComponent(invite.email)}`
                          : ''
                        return (
                          <tr key={invite.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-white">{invite.email}</td>
                            <td className="px-4 py-3.5">{getRoleBadge(invite.role)}</td>
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => copyToClipboard(link)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-amber-400 text-[11px] rounded-lg transition-colors"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy Link</span>
                              </button>
                            </td>
                            <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                              {new Date(invite.expires_at).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <button
                                onClick={() => handleRevokeInvite(invite.id)}
                                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                title="Revoke invitation"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        )
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'store' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl text-center space-y-3 max-w-xl mx-auto my-8">
          <Sliders className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Store Configurations</h3>
          <p className="text-xs text-slate-400">
            Payment gateways, white-glove shipping rates, and email notification webhooks are active.
          </p>
        </div>
      )}

      {/* Invite Staff Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-extrabold text-white mb-1">Invite New Staff Member</h3>
              <p className="text-xs text-slate-400 mb-6">
                Dispatches an onboarding invitation. Authenticated accounts will automatically bind to this staff profile.
              </p>

              {generatedInviteLink ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-semibold text-emerald-300">
                    ✅ Invitation Dispatched! Copy the invitation link below:
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300 break-all">
                    {generatedInviteLink}
                  </div>

                  <button
                    onClick={() => copyToClipboard(generatedInviteLink)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Onboarding Link'}</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendInvite} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Staff Member Name
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      placeholder="e.g. Vikram Sharma"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Staff Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      placeholder="vikram@chouhanmattress.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Assigned RBAC Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label} — {r.desc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingInvite}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-lg mt-2"
                  >
                    {submittingInvite ? 'Dispatching Invitation...' : 'Dispatch Invitation'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
