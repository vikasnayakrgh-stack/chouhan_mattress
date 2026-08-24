import 'server-only'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { validateAdminSession } from '@/lib/auth/adminAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: Request) {
  try {
    // Defense-in-depth: In-handler authentication & role check
    const auth = await validateAdminSession()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: auth.status })
    }

    const callerRole = auth.role?.toLowerCase()
    if (!['super_admin', 'admin', 'owner'].includes(callerRole || '')) {
      return NextResponse.json({ success: false, error: 'Forbidden: Only Admins can invite new staff members' }, { status: 403 })
    }

    const body = await request.json()
    const { email, role = 'admin', name } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email address is required' }, { status: 400 })
    }

    const ALLOWED_ROLES = [
      'super_admin',
      'admin',
      'manager',
      'inventory',
      'sales',
      'customer_support',
      'content_editor',
    ]

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ success: false, error: `Invalid role '${role}'` }, { status: 400 })
    }

    // Only Super Admin / Owner can invite another Super Admin
    if (role === 'super_admin' && !['super_admin', 'owner'].includes(callerRole || '')) {
      return NextResponse.json({ success: false, error: 'Forbidden: Only Super Admins can invite Super Admin staff' }, { status: 403 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate secure 32-char token
    const token = crypto.randomBytes(24).toString('hex')
    const staffName = name || email.split('@')[0]

    // 1. Create or update invited staff record
    const { data: staffRecord, error: staffError } = await supabase
      .from('staff')
      .upsert(
        {
          name: staffName,
          email: email.toLowerCase(),
          role,
          status: 'invited',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select()
      .single()

    if (staffError) {
      return NextResponse.json({ success: false, error: staffError.message }, { status: 500 })
    }

    // 2. Create staff invitation record
    const { data: invitation, error: inviteError } = await supabase
      .from('staff_invitations')
      .insert({
        email: email.toLowerCase(),
        role,
        token,
        status: 'pending',
        invited_by: staffRecord.id,
      })
      .select()
      .single()

    if (inviteError) {
      return NextResponse.json({ success: false, error: inviteError.message }, { status: 500 })
    }

    const origin = new URL(request.url).origin
    const inviteLink = `${origin}/admin/login?inviteToken=${token}&email=${encodeURIComponent(email)}`

    return NextResponse.json({
      success: true,
      data: {
        invitation,
        inviteLink,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Defense-in-depth: In-handler authentication & role check
    const auth = await validateAdminSession()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || 'Unauthorized' }, { status: auth.status })
    }

    const callerRole = auth.role?.toLowerCase()
    if (!['super_admin', 'admin', 'owner'].includes(callerRole || '')) {
      return NextResponse.json({ success: false, error: 'Forbidden: Only Admins can revoke staff invitations' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const invitationId = searchParams.get('id')

    if (!invitationId) {
      return NextResponse.json({ success: false, error: 'Invitation ID is required' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase
      .from('staff_invitations')
      .update({ status: 'revoked', updated_at: new Date().toISOString() })
      .eq('id', invitationId)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}
