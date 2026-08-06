/**
 * Chouhan Mattress - Super Admin Provisioning Script
 * Run with: node scripts/seed-super-admin.mjs
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function seedSuperAdmin() {
  console.log('👑 Provisioning Primary Super Admin for Chouhan Mattress...')

  const superAdminEmail = 'admin@chouhanmattress.com'
  const superAdminPassword = process.env.SUPER_ADMIN_INITIAL_PASSWORD || 'ChouhanAdmin@2026!'

  try {
    // 1. Check if auth user exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    let authUser = users?.find((u) => u.email?.toLowerCase() === superAdminEmail.toLowerCase())

    if (!authUser) {
      console.log(`🔑 Creating auth user for ${superAdminEmail}...`)
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: superAdminEmail,
        password: superAdminPassword,
        email_confirm: true,
        user_metadata: { full_name: 'Super Administrator' },
        app_metadata: { role: 'super_admin', is_staff: true },
      })

      if (createError) {
        console.error('❌ Error creating auth user:', createError.message)
      } else {
        authUser = newUser.user
        console.log(`✅ Auth user created successfully with ID: ${authUser.id}`)
      }
    } else {
      console.log(`ℹ️ Auth user already exists with ID: ${authUser.id}. Updating app_metadata...`)
      await supabase.auth.admin.updateUserById(authUser.id, {
        app_metadata: { role: 'super_admin', is_staff: true },
      })
    }

    // 2. Upsert staff table record
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .upsert(
        {
          auth_user_id: authUser?.id || null,
          name: 'Super Administrator',
          email: superAdminEmail,
          role: 'super_admin',
          status: 'active',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select()

    if (staffError) {
      console.warn('⚠️ Staff table upsert note:', staffError.message)
    } else {
      console.log('✅ Staff table record upserted successfully!')
    }

    console.log('\n======================================================')
    console.log('🎉 SUPER ADMIN PROVISIONING COMPLETE!')
    console.log('======================================================')
    console.log(`Email:    ${superAdminEmail}`)
    console.log(`Role:     super_admin`)
    console.log(`Status:   active`)
    console.log('======================================================\n')
  } catch (err) {
    console.error('❌ Error during provisioning:', err)
  }
}

seedSuperAdmin()
