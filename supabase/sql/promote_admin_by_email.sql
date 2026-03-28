-- One-off: run in Supabase SQL Editor if an admin account has profiles.role = 'user'
-- (e.g. created before handle_new_user trigger, or row inserted by ensure_my_profile as user).
-- Replace the email with the account that should be admin, then hard-refresh the app.

UPDATE public.profiles
SET role = 'admin'
WHERE lower(email) = lower('adithyan701264@gmail.com');
