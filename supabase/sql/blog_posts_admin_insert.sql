-- Fix: if you ran admin_newsletter_blog_split_rls.sql, admins could SELECT/UPDATE/DELETE
-- blog_posts but had no INSERT policy. The admin dashboard publishes as admin — run this once.

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
