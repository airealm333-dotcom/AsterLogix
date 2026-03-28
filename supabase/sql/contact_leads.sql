-- Optional: store assessment / contact form submissions for CRM-style follow-up.
-- Inserts use the Supabase service role from server actions only (RLS blocks direct anon/auth access).

CREATE TABLE IF NOT EXISTS public.contact_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  company_role text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_leads_created_at_idx
  ON public.contact_leads (created_at DESC);

ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;
