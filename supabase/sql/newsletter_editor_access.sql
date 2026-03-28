-- Experidium: newsletter compose access separate from role (profiles.newsletter_access).
-- Run in Supabase SQL Editor after auth_rbac_newsletter.sql.
-- Adds newsletter_applications, profiles column, profiles UPDATE policy for apply flow,
-- and splits newsletter_campaigns RLS for editors (compose) vs admins (full).

-- ---------------------------------------------------------------------------
-- 1. profiles.newsletter_access
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS newsletter_access text NOT NULL DEFAULT 'none';

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_newsletter_access_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_newsletter_access_check
  CHECK (newsletter_access IN ('none', 'pending', 'editor'));

UPDATE public.profiles
SET newsletter_access = 'editor'
WHERE role = 'admin'::public.user_role;

-- ---------------------------------------------------------------------------
-- 2. newsletter_applications (mirror writer_applications)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  reason text NOT NULL,
  portfolio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.newsletter_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS newsletter_apps_insert_own ON public.newsletter_applications;
CREATE POLICY newsletter_apps_insert_own ON public.newsletter_applications
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.newsletter_access = 'none'
    )
  );

DROP POLICY IF EXISTS newsletter_apps_select_own_or_admin ON public.newsletter_applications;
CREATE POLICY newsletter_apps_select_own_or_admin ON public.newsletter_applications
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.current_user_is_admin()
  );

DROP POLICY IF EXISTS newsletter_apps_admin_delete ON public.newsletter_applications;
CREATE POLICY newsletter_apps_admin_delete ON public.newsletter_applications
  FOR DELETE TO authenticated
  USING (public.current_user_is_admin());

-- ---------------------------------------------------------------------------
-- 3. Allow users to set newsletter_access none -> pending (apply)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS profiles_newsletter_apply_pending ON public.profiles;
CREATE POLICY profiles_newsletter_apply_pending ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() AND newsletter_access = 'none')
  WITH CHECK (id = auth.uid() AND newsletter_access = 'pending');

-- ---------------------------------------------------------------------------
-- 4. newsletter_campaigns: admin ALL + editor insert/select own
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS newsletter_campaigns_admin_all ON public.newsletter_campaigns;

CREATE POLICY newsletter_campaigns_admin_all ON public.newsletter_campaigns
  FOR ALL TO authenticated
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());

DROP POLICY IF EXISTS newsletter_campaigns_editor_insert ON public.newsletter_campaigns;
CREATE POLICY newsletter_campaigns_editor_insert ON public.newsletter_campaigns
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.newsletter_access = 'editor'
    )
  );

DROP POLICY IF EXISTS newsletter_campaigns_editor_select ON public.newsletter_campaigns;
CREATE POLICY newsletter_campaigns_editor_select ON public.newsletter_campaigns
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.newsletter_access = 'editor'
    )
  );
