-- Optional: align RLS with app behavior — admins newsletter-only; blog publish writers-only.
-- Run in Supabase SQL editor after auth_rbac_newsletter.sql and newsletter_editor_access.sql.

-- ── Blog: remove admin from writer-style policies; admin moderation without INSERT ──
DROP POLICY IF EXISTS blog_posts_writer_select_own ON public.blog_posts;
CREATE POLICY blog_posts_writer_select_own ON public.blog_posts
  FOR SELECT TO authenticated
  USING (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'writer'
    )
  );

DROP POLICY IF EXISTS blog_posts_writer_insert ON public.blog_posts;
CREATE POLICY blog_posts_writer_insert ON public.blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'writer'
    )
  );

DROP POLICY IF EXISTS blog_posts_writer_update_own ON public.blog_posts;
CREATE POLICY blog_posts_writer_update_own ON public.blog_posts
  FOR UPDATE TO authenticated
  USING (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'writer'
    )
  )
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'writer'
    )
  );

DROP POLICY IF EXISTS blog_posts_admin_all ON public.blog_posts;

CREATE POLICY blog_posts_admin_select ON public.blog_posts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY blog_posts_admin_update ON public.blog_posts
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

CREATE POLICY blog_posts_admin_delete ON public.blog_posts
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ── Newsletter campaigns: drop non-admin editor compose (app is admin-only) ──
DROP POLICY IF EXISTS newsletter_campaigns_editor_insert ON public.newsletter_campaigns;
DROP POLICY IF EXISTS newsletter_campaigns_editor_select ON public.newsletter_campaigns;

-- ── Blog: admin INSERT (dashboard is admin-only; without this, admins cannot publish) ──
DROP POLICY IF EXISTS blog_posts_admin_insert ON public.blog_posts;
CREATE POLICY blog_posts_admin_insert ON public.blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
