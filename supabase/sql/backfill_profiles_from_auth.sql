-- One-time: create profiles rows for auth users that have no row (e.g. accounts
-- created before on_auth_user_created trigger existed). Safe to re-run.
-- Run in Supabase SQL Editor after user_role enum and public.profiles exist.

INSERT INTO public.profiles (id, email, role)
SELECT
  u.id,
  COALESCE(u.email::text, ''),
  CASE
    WHEN lower(COALESCE(u.email::text, '')) = 'adithyan701264@gmail.com'
    THEN 'admin'::public.user_role
    ELSE 'user'::public.user_role
  END
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;
