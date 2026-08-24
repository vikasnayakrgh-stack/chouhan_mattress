import 'server-only'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateAdminSession } from '@/lib/auth/adminAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: Request) {
  try {
    // Defense-in-depth: In-handler authentication & role check
    const auth = await validateAdminSession()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: auth.status })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch active & invited staff members
    const { data: staffList, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false })

    if (staffError) {
      return NextResponse.json({ success: false, error: staffError.message }, { status: 500 })
    }

    // Fetch pending invitations
    const { data: invitations, error: inviteError } = await supabase
      .from('staff_invitations')
      .select('*')
      .order('created_at', { ascending: false })

    if (inviteError) {
      return NextResponse.json({ success: false, error: inviteError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        staff: staffList || [],
        invitations: invitations || [],
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    // Defense-in-depth: In-handler check (only super_admin, admin, owner can update staff)
    const auth = await validateAdminSession()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: auth.status })
    }

    const callerRole = auth.role?.toLowerCase()
    if (!['super_admin', 'admin', 'owner'].includes(callerRole || '')) {
      return NextResponse.json({ success: false, error: 'Forbidden: Insufficient privileges to manage staff' }, { status: 403 })
    }

    const body = await request.json()
    const { staffId, role, status } = body

    if (!staffId) {
      return NextResponse.json({ success: false, error: 'Staff ID is required' }, { status: 400 })
    }

    // Only super_admin/owner can grant super_admin role
    if (role === 'super_admin' && !['super_admin', 'owner'].includes(callerRole || '')) {
      return NextResponse.json({ success: false, error: 'Forbidden: Only Super Admins can grant Super Admin role' }, { status: 403 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() }
    if (role) updateData.role = role
    if (status) updateData.status = status

    const { data, error } = await supabase
      .from('staff')
      .update(updateData)
      .eq('id', staffId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // If staff member has a linked auth_user_id, update their raw_app_meta_data role as well
    if (data?.auth_user_id && role) {
      await supabase.auth.admin.updateUserById(data.auth_user_id, {
        app_metadata: { role, is_staff: status !== 'disabled' },
      })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}
