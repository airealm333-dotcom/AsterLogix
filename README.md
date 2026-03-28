# Experidium

Marketing and operations site for an AI-powered supply chain automation agency. **Public pages** showcase services, case studies, blog, and lead capture. **Signed-in admins** use a tabbed **admin dashboard** at `/create/newsletter` for newsletters, blog publishing, and subscriber management.

Built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS v4**, **Framer Motion**, and **Supabase** (auth, database, storage).

---

## Website overview

| Area | Who | What |
|------|-----|------|
| **Marketing** | Everyone | Home, about, services, case studies, blog, contact, privacy. Header CTA buttons link to `/contact` (“Book AI Assessment”). |
| **Newsletter signup** | Visitors | Footer and forms use the `subscribe` server action: emails go to Supabase `subscribers`, optional Resend welcome email, optional Brevo sync. |
| **Contact** | Visitors | `/contact` shows company details and a “Book a free AI assessment” form. The form currently uses `preventDefault()` on submit — **no server handler** until you wire one (e.g. email or CRM). |
| **Auth** | Users | `/login`, `/signup`, OAuth via Supabase (`/auth/callback`), sign-out via `/auth/logout`. |
| **Admin dashboard** | Users with `profiles.role = 'admin'` | `/create/newsletter` — tabbed UI: **Newsletter** (campaigns, audience tags, schedule), **Blog** (TipTap editor, publish to `blog_posts`), **Subscribers** (table, tags, pagination). Access: **Account menu → Admin dashboard** (no duplicate admin button in the main header nav). |
| **Legacy URLs** | — | `/blog/writeblogs` → admins redirect to `/create/newsletter?tab=blog`; others → `/blog`. `/dashboard` redirects signed-in users (admins → admin dashboard). |

---

## Tech stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI | React | 19.2.3 |
| Styling | Tailwind CSS | 4.x |
| Animations | Framer Motion | 12.x |
| Carousel | Embla Carousel + Autoplay | 8.x |
| Icons | Lucide React | 0.577.x |
| Rich text (admin blog) | TipTap | 3.x |
| HTML sanitization | sanitize-html | 2.x |
| Image optimization | Sharp | 0.34.x |
| Language | TypeScript | 5.x |
| Blog content | Supabase `blog_posts` + MDX fallback; `next-mdx-remote` | — |
| Newsletter | Supabase + Resend; optional Brevo | — |
| Validation | Zod | 4.x |

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm start
npm run lint
npm run seed:blog    # MDX → Supabase blog_posts (needs service role)
npm run verify:supabase
```

---

## Environment variables

Create **`.env.local`** in the project root (see your team’s secret template if you use one). Typical keys:

| Variable | Role |
|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser / server cookie sessions |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only: admin client, seeds, cron, dispatch |
| `NEXT_PUBLIC_SITE_URL` | Site origin (e.g. `http://localhost:3000`) — must match how you open the app |
| `RESEND_API_KEY` | Resend API key (server-only) |
| `RESEND_FROM_EMAIL` | **Transactional** “from”: `Experidium <contact@experidium.online>` — contact forms, account welcome, admin alerts |
| `RESEND_NEWSLETTER_FROM` | **Newsletter / marketing** “from”: `Experidium <newsletter@experidium.online>` — campaigns, subscribe welcome; falls back to `RESEND_FROM_EMAIL` if unset |
| `CONTACT_FORM_TO_EMAIL` | Inbox for contact / assessment submissions (e.g. `contact@experidium.online`); falls back to `ADMIN_ALERT_EMAIL` |
| `BREVO_API_KEY` / `BREVO_LIST_IDS` | Optional: mirror subscribers to Brevo lists |
| `CRON_SECRET` | Bearer token for [`/api/cron/dispatch-newsletter`](app/api/cron/dispatch-newsletter/route.ts); also used to sign **one-click unsubscribe** links if `NEWSLETTER_UNSUBSCRIBE_SECRET` is unset |
| `NEWSLETTER_UNSUBSCRIBE_SECRET` | Optional separate secret for [`/api/newsletter/unsubscribe`](app/api/newsletter/unsubscribe/route.ts) (HMAC); enables RFC 8058 `List-Unsubscribe-Post` headers on campaigns |
| `ADMIN_ALERT_EMAIL` | Inbox for internal alerts (e.g. newsletter writer applications); also fallback for contact form if `CONTACT_FORM_TO_EMAIL` is unset |

**Resend:** Use the same display format for both senders, e.g. `Experidium <newsletter@experidium.online>` and `Experidium <contact@experidium.online>`. Verify **experidium.online** in the Resend dashboard (DNS) for both addresses; until verified, Resend will reject those senders.

**Gmail “Promotions”:** Bulk layout and marketing wording often land there. Campaigns now send **plain-text + HTML**, **`Reply-To`** (`siteConfig.footer.email`), **`List-Unsubscribe`** (mailto + signed HTTPS when `CRON_SECRET` or `NEWSLETTER_UNSUBSCRIBE_SECRET` is set), and a calmer footer. Recipients can still **move to Primary** or add the sender to contacts; full control is on Gmail’s side.

**Auth:** In Supabase → Authentication → URL configuration, add redirect URLs for your app origin and **`/auth/callback`**. Enable Email / Google / GitHub providers as needed; OAuth apps must allow Supabase’s redirect URL `https://<project-ref>.supabase.co/auth/v1/callback`.

---

## Supabase setup (first run)

1. Run [`supabase/sql/auth_rbac_newsletter.sql`](supabase/sql/auth_rbac_newsletter.sql) in the SQL Editor (creates `profiles`, RLS, subscribers, newsletter tables, `blog-media` storage, `ensure_my_profile` RPC, etc.). If `blog_posts` must exist first, apply [`supabase/sql/blog_posts.sql`](supabase/sql/blog_posts.sql) per your migration order.
2. Optional follow-ups: [`ensure_my_profile_rpc.sql`](supabase/sql/ensure_my_profile_rpc.sql) (older DBs), [`backfill_profiles_from_auth.sql`](supabase/sql/backfill_profiles_from_auth.sql), [`fix_profiles_rls_recursion.sql`](supabase/sql/fix_profiles_rls_recursion.sql), [`profiles_insert_own.sql`](supabase/sql/profiles_insert_own.sql) as needed.
3. **Newsletter `preheader` + `audience_tags`:** Included in `auth_rbac_newsletter.sql` (table definition + idempotent `ADD COLUMN IF NOT EXISTS`). If you still see a missing-column error, run [`supabase/sql/newsletter_campaign_preheader_audience.sql`](supabase/sql/newsletter_campaign_preheader_audience.sql) once in the SQL Editor (same `ALTER`s).
4. **Promote an admin:** [`supabase/sql/promote_admin_by_email.sql`](supabase/sql/promote_admin_by_email.sql) (edit email), or set `profiles.role = 'admin'` in the Table Editor.
5. Run `npm run verify:supabase` and confirm the service role can reach `profiles`.

**Blog:** `npm run seed:blog` imports `content/blog/*.mdx` into `blog_posts` when env keys are set.

---

## Admin dashboard (`/create/newsletter`)

- **Layout:** [`app/create/newsletter/layout.tsx`](app/create/newsletter/layout.tsx) — requires session; **admin role only** (others redirect home).
- **Middleware:** [`middleware.ts`](middleware.ts) — unauthenticated visits to `/create/newsletter` redirect to `/login?next=…`.
- **UI:** [`components/dashboard/AdminDashboardTabs.tsx`](components/dashboard/AdminDashboardTabs.tsx) — tab state + URL query `?tab=` ([`lib/dashboard-tabs.ts`](lib/dashboard-tabs.ts)). Tabs: **Newsletter**, **Blog**, **Subscribers** (Insights tab removed).
- **Newsletter:** compose/send campaigns via Resend; optional tag-based audience; schedule + cron dispatch.
- **Blog:** [`components/blog/WriteBlogForm.tsx`](components/blog/WriteBlogForm.tsx) + [`app/actions/blog-publish.ts`](app/actions/blog-publish.ts) — **admin-only** publish to `blog_posts` (cover upload to `blog-media`, TipTap HTML body). If you applied [`admin_newsletter_blog_split_rls.sql`](supabase/sql/admin_newsletter_blog_split_rls.sql) before it included admin INSERT, run [`blog_posts_admin_insert.sql`](supabase/sql/blog_posts_admin_insert.sql) so admins can insert rows.
- **Subscribers:** paginated table (page size in [`app/create/newsletter/page.tsx`](app/create/newsletter/page.tsx)), tag editing via server actions.

**Scheduled newsletter sends** depend on something calling `GET /api/cron/dispatch-newsletter` with header `Authorization: Bearer <CRON_SECRET>` (same value as env).

1. **`CRON_SECRET` in Vercel (Production)** — If it is only in `.env.local`, **production cron will get 401/503**. Add it under Project → Settings → Environment Variables and redeploy. Vercel Cron [injects that Bearer header automatically](https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs) when `CRON_SECRET` exists in the project.

2. **Vercel Hobby vs Pro cron** — On **Hobby**, cron may run **at most once per day**; a schedule like `*/5 * * * *` **fails deployment**. Either upgrade to **Pro** (per-minute cron) or change [`vercel.json`](vercel.json) to a daily expression (e.g. `0 8 * * *`) and accept one batch per day, or use a **free external cron** (e.g. [cron-job.org](https://cron-job.org)) every 5–15 minutes with `Authorization: Bearer <CRON_SECRET>`.

3. **Local dev** — `next dev` does not run Vercel Cron. Test with:
   `curl -s -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/dispatch-newsletter`

4. **Schedule time** — The compose form converts your **local** `datetime-local` choice to **UTC ISO** in the browser before submit, so `scheduled_at` matches wall-clock intent (server-only parsing used to treat the value as UTC and skew times on Vercel).

---

## API routes

| Route | Purpose |
|-------|---------|
| [`app/api/cron/dispatch-newsletter/route.ts`](app/api/cron/dispatch-newsletter/route.ts) | Due `scheduled` campaigns → `dispatchNewsletterCampaign` |
| [`app/api/newsletter/brevo-stats/route.ts`](app/api/newsletter/brevo-stats/route.ts) | Brevo stats for dashboards (if configured) |
| [`app/auth/callback/route.ts`](app/auth/callback/route.ts) | Supabase OAuth code exchange |
| [`app/auth/logout/route.ts`](app/auth/logout/route.ts) | Clears session cookies |

---

## Routes (App Router)

| Route | Description |
|-------|-------------|
| `/` | Homepage (sections in `components/sections/`) |
| `/about` | About |
| `/service-static` | Services & pricing |
| `/case-studies`, `/case-studies/[slug]` | Case studies |
| `/blog`, `/blog/[slug]` | Blog listing & post ([`lib/blog.ts`](lib/blog.ts): Supabase then MDX) |
| `/blog/writeblogs` | Legacy redirect (see overview) |
| `/contact` | Contact + assessment form (submit not wired) |
| `/privacy-policy` | Privacy |
| `/login`, `/signup` | Auth |
| `/missing-profile` | Profile / RPC issues |
| `/create/newsletter` | **Admin dashboard** (tabs; `?tab=` & `?page=` for subscribers) |
| `/dashboard` | Redirects (admins → `/create/newsletter`) |
| `/dashboard/*` | Legacy dashboard paths; many redirect to `/create/newsletter` |

---

## Project structure (high level)

```
app/
  layout.tsx              # Fonts, Header (initialIsAdmin), Footer, main
  page.tsx                # Homepage
  globals.css             # Theme tokens, animations
  create/newsletter/      # Admin dashboard page + admin-only layout
  (auth)/login|signup/
  auth/callback|logout/   # Route handlers
  api/cron/…, api/newsletter/…
  blog/, case-studies/, contact/, about/, …
components/
  layout/Header.tsx       # Nav, CTAs (no header “Admin dashboard” button)
  layout/UserMenu.tsx     # Account menu; “Admin dashboard” for admins
  layout/Footer.tsx
  dashboard/              # AdminDashboardTabs, NewsletterCompose, …
  blog/                   # WriteBlogForm, TiptapEditor, …
  sections/               # Homepage sections
  ui/
content/blog/*.mdx        # MDX fallback + seed source
data/site.ts              # Nav, footer, stats, industries, services, …
lib/
  blog.ts, mdx.ts
  auth/session.ts, auth/roles.ts
  dashboard-tabs.ts
  newsletter/dispatch.ts
  email/wrap-newsletter.ts
  supabase/ (server, admin, …)
supabase/sql/             # SQL migrations / one-off scripts
scripts/                  # seed-blog, verify-supabase
public/                   # hero video, logos, images
```

---

## Components (selected)

| Item | Notes |
|------|--------|
| **Header** | Fixed nav, scroll styling, mobile drawer. Primary CTA → `/contact`. |
| **UserMenu** | Avatar dropdown; **Admin dashboard** link when `isAdmin`. |
| **Footer** | Links, newsletter signup, addresses. |
| **NewsletterForm** | Server action `subscribe`. |
| **AdminDashboardTabs** | Segmented tabs + panel shell; lazy-mount tab panels. |
| **NewsletterCompose** | Campaigns: audience tags, schedule, preheader, HTML body. |
| **WriteBlogForm** | Blog fields + TipTap; publishes via server action. |
| **Button** | `primary` / `outline` / `ghost`; `href` → `Link`. |

Homepage section order is defined in [`app/page.tsx`](app/page.tsx) (Hero, industries, services, stats, testimonials, blog preview, etc.).

---

## Data & server actions

- **Blog:** [`lib/blog.ts`](lib/blog.ts) — `getAllPosts`, `getPostBySlug`, etc.; Supabase first, MDX fallback.
- **Newsletter subscribe:** [`app/actions/subscribe.ts`](app/actions/subscribe.ts).
- **Newsletter campaigns:** [`app/actions/newsletter-dashboard.ts`](app/actions/newsletter-dashboard.ts) — create campaign, dispatch for “send now”; requires `preheader` and `audience_tags` on `newsletter_campaigns` (see Supabase setup step 3).
- **Blog publish:** [`app/actions/blog-publish.ts`](app/actions/blog-publish.ts) — admin-only insert into `blog_posts`.
- **Site copy / config:** [`data/site.ts`](data/site.ts) — `nav`, `footer`, `stats`, `industries`, `services`, pricing `offers`, etc.
- **Case studies:** [`data/caseStudies.ts`](data/caseStudies.ts).

---

## Theming

Tailwind v4 with `@theme inline` in [`app/globals.css`](app/globals.css) — colors (`background`, `foreground`, `primary`, `surface`, `muted`, `border`, …), fonts (Instrument Sans headings, Inter body).

---

## Responsive design

Standard Tailwind breakpoints (`sm`–`xl`). Sections use `max-w-7xl` containers, responsive grids, and `md:` / `lg:` navigation patterns. See existing README sections on hero height, marquee, and mobile drawer if you need implementation detail.

---

## Configuration files

- [`next.config.ts`](next.config.ts) — images (e.g. Unsplash).
- [`tsconfig.json`](tsconfig.json) — `@/*` paths.
- [`postcss.config.mjs`](postcss.config.mjs) — Tailwind v4 PostCSS.
- [`eslint.config.mjs`](eslint.config.mjs) — Next + TypeScript.

---

## Public assets

| Path | Usage |
|------|--------|
| `public/hero.mp4`, `hero-poster.jpg` | Hero background |
| `public/logos/experidium.png` | Logo (CSS mask) |
| `public/logos/*.svg` | Partner logos |
| `public/pexels-*.jpg` | Section imagery |

Remote images: Unsplash and others as configured in `next.config.ts`.
