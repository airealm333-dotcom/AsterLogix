-- Experidium: profiles, RBAC, blog author linkage, writer applications, newsletter campaigns, RLS, storage.
-- Run in Supabase SQL Editor after existing subscribers + blog_posts tables exist.
-- Order: run blog_posts.sql first if starting fresh, or this file merges alters.
--
-- If `EXECUTE PROCEDURE` errors on your Postgres version, use:
--   EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 1. Enum & profiles
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM (
    'admin',
    'user',
    'pending_writer',
    'writer',
    'revoked_writer'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  role public.user_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);

-- Sync new auth users → profiles (admin bootstrap email per product spec)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    COALESCE(new.email, ''),
    CASE
      WHEN lower(COALESCE(new.email, '')) = 'adithyan701264@gmail.com'
      THEN 'admin'::public.user_role
      ELSE 'user'::public.user_role
    END
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. subscribers: audience tags
-- ---------------------------------------------------------------------------
ALTER TABLE public.subscribers
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}'::text[];

-- ---------------------------------------------------------------------------
-- 3. blog_posts: author + optional HTML body (TipTap)
-- ---------------------------------------------------------------------------
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL;

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS body_html text;

-- Backfill author_id from first admin (run after at least one admin profile exists)
UPDATE public.blog_posts bp
SET author_id = sub.admin_id
FROM (
  SELECT id AS admin_id
  FROM public.profiles
  WHERE role = 'admin'
  ORDER BY created_at ASC
  LIMIT 1
) sub
WHERE bp.author_id IS NULL;

CREATE INDEX IF NOT EXISTS blog_posts_author_id_idx ON public.blog_posts (author_id);

-- ---------------------------------------------------------------------------
-- 4. Writer applications & newsletter campaigns
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.writer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  reason text NOT NULL,
  portfolio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  html_body text NOT NULL,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at timestamptz,
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  preheader text,
  audience_tags text[]
);

-- Existing DBs created before preheader/audience_tags: add columns idempotently.
ALTER TABLE public.newsletter_campaigns
  ADD COLUMN IF NOT EXISTS preheader text;

ALTER TABLE public.newsletter_campaigns
  ADD COLUMN IF NOT EXISTS audience_tags text[];

CREATE INDEX IF NOT EXISTS newsletter_campaigns_status_scheduled_idx
  ON public.newsletter_campaigns (status, scheduled_at);

-- ---------------------------------------------------------------------------
-- 5. Published posts visible to public (hide revoked_writer authors)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.list_published_blog_posts()
RETURNS SETOF public.blog_posts
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT bp.*
  FROM public.blog_posts bp
  LEFT JOIN public.profiles pr ON pr.id = bp.author_id
  WHERE bp.published = true
    AND (bp.author_id IS NULL OR pr.role IS DISTINCT FROM 'revoked_writer')
  ORDER BY bp.published_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_published_blog_post(p_slug text)
RETURNS SETOF public.blog_posts
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT bp.*
  FROM public.blog_posts bp
  LEFT JOIN public.profiles pr ON pr.id = bp.author_id
  WHERE bp.slug = p_slug
    AND bp.published = true
    AND (bp.author_id IS NULL OR pr.role IS DISTINCT FROM 'revoked_writer')
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.list_published_blog_posts() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_published_blog_post(text) TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 6. Storage: blog-media bucket (public read, authenticated upload for writers/admins)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS blog_media_public_read ON storage.objects;
CREATE POLICY blog_media_public_read ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'blog-media');

DROP POLICY IF EXISTS blog_media_authenticated_upload ON storage.objects;
CREATE POLICY blog_media_authenticated_upload ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'blog-media'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('writer', 'admin')
    )
  );

DROP POLICY IF EXISTS blog_media_owner_update ON storage.objects;
CREATE POLICY blog_media_owner_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'blog-media'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('writer', 'admin')
    )
  );

DROP POLICY IF EXISTS blog_media_owner_delete ON storage.objects;
CREATE POLICY blog_media_owner_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'blog-media'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('writer', 'admin')
    )
  );

-- ---------------------------------------------------------------------------
-- 6b. RLS helper — avoids infinite recursion when policies SELECT from profiles
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'::public.user_role
  );
$$;

REVOKE ALL ON FUNCTION public.current_user_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_is_admin() TO authenticated;

-- ---------------------------------------------------------------------------
-- 7. RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;

-- profiles (two permissive SELECT policies OR’d together — no self-referential EXISTS)
DROP POLICY IF EXISTS profiles_select_own_or_admin ON public.profiles;
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_select_if_admin ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY profiles_select_if_admin ON public.profiles
  FOR SELECT TO authenticated
  USING (public.current_user_is_admin());

-- Self-heal: app can insert the caller’s own row if the auth trigger did not run (legacy accounts).
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS profiles_update_admin ON public.profiles;
CREATE POLICY profiles_update_admin ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());

DROP POLICY IF EXISTS profiles_apply_pending ON public.profiles;
CREATE POLICY profiles_apply_pending ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() AND role = 'user')
  WITH CHECK (id = auth.uid() AND role = 'pending_writer');

-- blog_posts: public read published non-revoked (mirror RPC logic)
DROP POLICY IF EXISTS blog_posts_public_read ON public.blog_posts;
CREATE POLICY blog_posts_public_read ON public.blog_posts
  FOR SELECT TO anon, authenticated
  USING (
    published = true
    AND (
      author_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.profiles pr
        WHERE pr.id = author_id AND pr.role IS DISTINCT FROM 'revoked_writer'
      )
    )
  );

DROP POLICY IF EXISTS blog_posts_writer_select_own ON public.blog_posts;
CREATE POLICY blog_posts_writer_select_own ON public.blog_posts
  FOR SELECT TO authenticated
  USING (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('writer', 'admin')
    )
  );

DROP POLICY IF EXISTS blog_posts_writer_insert ON public.blog_posts;
CREATE POLICY blog_posts_writer_insert ON public.blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('writer', 'admin')
    )
  );

DROP POLICY IF EXISTS blog_posts_writer_update_own ON public.blog_posts;
CREATE POLICY blog_posts_writer_update_own ON public.blog_posts
  FOR UPDATE TO authenticated
  USING (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('writer', 'admin')
    )
  )
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('writer', 'admin')
    )
  );

DROP POLICY IF EXISTS blog_posts_admin_all ON public.blog_posts;
CREATE POLICY blog_posts_admin_all ON public.blog_posts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- subscribers: admin only (footer uses service role)
DROP POLICY IF EXISTS subscribers_admin_select ON public.subscribers;
CREATE POLICY subscribers_admin_select ON public.subscribers
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS subscribers_admin_update ON public.subscribers;
CREATE POLICY subscribers_admin_update ON public.subscribers
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- writer_applications
DROP POLICY IF EXISTS writer_apps_insert_own ON public.writer_applications;
CREATE POLICY writer_apps_insert_own ON public.writer_applications
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS writer_apps_select_own_or_admin ON public.writer_applications;
CREATE POLICY writer_apps_select_own_or_admin ON public.writer_applications
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS writer_apps_admin_delete ON public.writer_applications;
CREATE POLICY writer_apps_admin_delete ON public.writer_applications
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- newsletter_campaigns: admin only
DROP POLICY IF EXISTS newsletter_campaigns_admin_all ON public.newsletter_campaigns;
CREATE POLICY newsletter_campaigns_admin_all ON public.newsletter_campaigns
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- 8. RPC: ensure profile row for current user (no service role in Next.js needed)
-- ---------------------------------------------------------------------------
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
