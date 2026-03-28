-- One-off: run in Supabase SQL Editor if you already applied an older auth_rbac_newsletter.sql
-- without this function. Lets any signed-in user create their own profiles row via RPC.

CREATE OR REPLACE FUNCTION public.ensure_my_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  SELECT u.id, COALESCE(u.email::text, ''), 'user'::public.user_role
  FROM auth.users u
  WHERE u.id = auth.uid()
  ON CONFLICT (id) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_my_profile() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_my_profile() TO authenticated;
