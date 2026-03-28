-- Optional: run in Supabase SQL Editor after auth_rbac_newsletter.sql
-- Adds preheader text and tag-based audience filtering for newsletter_campaigns.

ALTER TABLE public.newsletter_campaigns
  ADD COLUMN IF NOT EXISTS preheader text;

ALTER TABLE public.newsletter_campaigns
  ADD COLUMN IF NOT EXISTS audience_tags text[];

COMMENT ON COLUMN public.newsletter_campaigns.preheader IS
  'Inbox preview line (hidden in HTML; shown next to subject in many clients).';

COMMENT ON COLUMN public.newsletter_campaigns.audience_tags IS
  'If NULL or empty, send to all subscribers; otherwise subscriber must have at least one matching tag.';
