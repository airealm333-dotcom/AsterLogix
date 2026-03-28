-- Blog posts stored in Supabase (edit via Table Editor or SQL).
-- Run in Supabase SQL Editor after subscribers table.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  date_display text not null,
  published_at date not null,
  image_url text not null,
  excerpt text not null,
  body_markdown text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_published_at_idx
  on public.blog_posts (published, published_at desc);

comment on table public.blog_posts is 'Marketing blog posts; readable by site via service role on server.';
