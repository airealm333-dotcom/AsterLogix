-- Add-on for databases that already ran auth_rbac_newsletter.sql before this policy existed.
-- Run in Supabase SQL Editor once.

DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
