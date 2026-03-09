# SolidRoutes

AI-powered supply chain automation agency website built with Next.js, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Carousel:** Embla Carousel
- **Icons:** Lucide React
- **Fonts:** Instrument Sans, Inter (via `next/font`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
app/                  # Pages (App Router)
  about/              # About page
  blog/               # Blog listing + [slug] detail
  case-studies/       # Case studies listing + [slug] detail
  contact/            # Contact form
  privacy-policy/     # Privacy policy
  service-static/     # Services & pricing
components/
  layout/             # Header, Footer
  sections/           # Homepage sections
  ui/                 # Reusable UI components (Button, SectionLabel, etc.)
data/                 # Content data (site config, case studies, blog posts)
public/               # Static assets (images, video)
```

## Build

```bash
npm run build
npm start
```
