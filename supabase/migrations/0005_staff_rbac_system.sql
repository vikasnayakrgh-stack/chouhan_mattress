-- Chouhan Mattress — Phase B3 Enterprise Staff Onboarding & RBAC System Migration
-- Migration file: 0005_staff_rbac_system.sql

-- 1. Create or ensure staff_role type / constraints
DO $$ BEGIN
  CREATE TYPE staff_role_type AS ENUM (
    'super_admin',
    'admin',
    'manager',
    'inventory',
    'sales',
    'customer_support',
    'content_editor'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Staff Table Schema Enhancement
CREATE TABLE IF NOT EXISTS public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  role text NOT NULL DEFAULT 'admin' CHECK (
    role IN (
      'super_admin',
      'admin',
      'manager',
      'inventory',
      'sales',
      'customer_support',
      'content_editor',
      'owner',
      'staff',
      'viewer'
    )
  ),
  avatar_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'disabled')),
  invited_by uuid,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for high-speed authentication lookup
CREATE INDEX IF NOT EXISTS idx_staff_auth_user_id ON public.staff(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);

-- 3. Staff Invitations Table
CREATE TABLE IF NOT EXISTS public.staff_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role text NOT NULL CHECK (
    role IN (
      'super_admin',
      'admin',
      'manager',
      'inventory',
      'sales',
      'customer_support',
      'content_editor'
    )
  ),
  token text NOT NULL UNIQUE,
  invited_by uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_invitations_token ON public.staff_invitations(token);
CREATE INDEX IF NOT EXISTS idx_staff_invitations_email ON public.staff_invitations(email);

-- 4. Automatic Staff Onboarding & Linking Function
CREATE OR REPLACE FUNCTION public.handle_staff_auth_linking()
RETURNS TRIGGER AS $$
DECLARE
  v_invite RECORD;
  v_existing_staff RECORD;
BEGIN
  -- Check if there is a pending staff invitation for this email
  SELECT * INTO v_invite
  FROM public.staff_invitations
  WHERE LOWER(email) = LOWER(NEW.email)
    AND status = 'pending'
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    -- Upsert staff profile linked to auth.users
    INSERT INTO public.staff (auth_user_id, name, email, role, status, invited_by)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      NEW.email,
      v_invite.role,
      'active',
      v_invite.invited_by
    )
    ON CONFLICT (email) DO UPDATE SET
      auth_user_id = NEW.id,
      role = v_invite.role,
      status = 'active',
      updated_at = now();

    -- Mark invitation as accepted
    UPDATE public.staff_invitations
    SET status = 'accepted', updated_at = now()
    WHERE id = v_invite.id;

    -- Write staff role directly to raw_app_meta_data for JWT claim validation
    UPDATE auth.users
    SET raw_app_meta_data = jsonb_build_object(
      'provider', COALESCE(raw_app_meta_data->>'provider', 'email'),
      'providers', COALESCE(raw_app_meta_data->'providers', '["email"]'::jsonb),
      'role', v_invite.role,
      'is_staff', true
    )
    WHERE id = NEW.id;

    RETURN NEW;
  END IF;

  -- Check if there is an existing invited staff record matching this email
  SELECT * INTO v_existing_staff
  FROM public.staff
  WHERE LOWER(email) = LOWER(NEW.email)
  LIMIT 1;

  IF FOUND THEN
    UPDATE public.staff
    SET auth_user_id = NEW.id,
        status = 'active',
        updated_at = now()
    WHERE id = v_existing_staff.id;

    UPDATE auth.users
    SET raw_app_meta_data = jsonb_build_object(
      'provider', COALESCE(raw_app_meta_data->>'provider', 'email'),
      'providers', COALESCE(raw_app_meta_data->'providers', '["email"]'::jsonb),
      'role', v_existing_staff.role,
      'is_staff', true
    )
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind Trigger to auth.users table
DROP TRIGGER IF EXISTS trg_staff_auth_linking ON auth.users;
CREATE TRIGGER trg_staff_auth_linking
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_staff_auth_linking();

-- 5. Seed Initial Super Admin Profile
INSERT INTO public.staff (name, email, role, status)
VALUES ('Super Administrator', 'admin@chouhanmattress.com', 'super_admin', 'active')
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  status = 'active',
  updated_at = now();
