# CLAUDE.md — Velas y Botas

## About the Owner

Ricardo was born in October 1969, Spanish, fluent in Spanish and English. He retired in May 2025 and is now enjoying life to the fullest — sailing, traveling, and spending quality time with family and friends. He plays golf, loves cooking, and is passionate about hiking and trekking (including long-distance Caminos) and yoga. He has a lovely wife (Maria Eugenia) and two beautiful daughters (Eugenia and Sofia).

## About This Project

A personal travel log website to document Ricardo's adventures — sailing voyages, trips, and destinations visited since retirement.

- Current boat: **Artemisa** — Hanse 505, acquired 2023, berthed at Royal Langkawi Yacht Marina, Malaysia
  - Three years of upgrades to make her blue water capable
  - 21 kWh lithium battery bank, 2 kW solar array, 100l/h watermaker, arch, oceanic sails
- Starting base: Dubai, UAE
- Home Base: Langkawi, Malaysia

## Tech Stack

- **Next.js 14** (App Router) — deployed on **Vercel**
- **Mapbox GL JS** — animated sailing routes, clickable pins
- **MDX** — rich content with embedded maps/photos per entry
- **Tailwind CSS** — styling
- **Local JSON/MDX files** — content management (no CMS)
- **Supabase** (PostgreSQL) — comments database
- **`@supabase/supabase-js`** — Supabase client library

## External Services & Credentials

All secrets live in `blog/.env.local` (never committed). Add the same vars to Vercel → Project Settings → Environment Variables when deploying.

| Variable | Service | Notes |
|----------|---------|-------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox | Public — safe in client code. Account: rperezalbores |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | `https://itouwumtfbbflzrfkcqk.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Publishable key — safe in client code |
| `SUPABASE_SERVICE_KEY` | Supabase | Secret key — server-side only, never expose to client |

Reference template: `blog/.env.local.example`

## Blog Structure

Entries span 1–4 months each, organized as **Voyages → Legs → Entries**.

### URL Hierarchy

```
/                          → Home: featured trip + world map overview
/trips                     → All trips (timeline list)
/trips/[slug]              → Trip page: route map, leg list, summary
/trips/[slug]/[leg-slug]   → Leg page: entries, photos, map segment
/map                       → Full world map — all routes + clickable pins
/about                     → About Ricardo
```

Trip types: `pilgrimage` | `camino` | `sailing` | `travel`

### Content Data Model

```
Voyage
  title, slug, dateStart, dateEnd
  summary, coverImage
  route: GeoJSON LineString
  tags[]
  legs[]

Leg
  title, slug, dateStart, dateEnd
  from, to  (place names + coords)
  entries[]
  photos[]

Entry
  date, title, body (MDX)
  location: { lat, lng }
  tags[]   (sailing | land | golf | food | family | ...)
  photos[]
```

### File Structure

```
TRAVELBLOG/
├── app/
│   ├── page.tsx                       (home)
│   ├── voyages/
│   │   ├── page.tsx                   (timeline)
│   │   ├── [slug]/page.tsx            (voyage overview)
│   │   └── [slug]/[leg]/page.tsx      (leg detail)
│   ├── map/page.tsx
│   └── about/page.tsx
├── content/
│   └── trips/
│       ├── rocio-2025/                        (Romería de El Rocío — May 2025)
│       │   ├── trip.json                      (metadata, route, hermandad details)
│       │   └── entries/
│       │       └── *.mdx
│       ├── via-de-la-plata-2025/              (Camino Vía de la Plata — June 2025)
│       │   ├── trip.json
│       │   └── entries/
│       │       └── *.mdx
│       ├── dubai-to-langkawi/                 (Sailing — Dec 2025 to Mar 2026, Artemisa's maiden blue water passage)
│       │   ├── trip.json                      (metadata, full route GeoJSON)
│       │   ├── leg-1-dubai-maldives/
│       │   │   ├── leg.json
│       │   │   └── entries/*.mdx
│       │   ├── leg-2-maldives-sri-lanka/
│       │   │   ├── leg.json
│       │   │   └── entries/*.mdx
│       │   ├── leg-3-sri-lanka-thailand/
│       │   │   ├── leg.json
│       │   │   └── entries/*.mdx
│       │   └── leg-4-thailand-langkawi/
│       │       ├── leg.json
│       │       └── entries/*.mdx
│       └── camino-del-norte-2026/             (Camino del Norte — June 2026)
│           ├── trip.json
│           └── entries/
│               └── *.mdx
├── components/
│   ├── Map/                           (Mapbox components)
│   ├── VoyageCard.tsx
│   ├── LegTimeline.tsx
│   └── EntryCard.tsx
└── CLAUDE.md
```

## Content Workflow

Ricardo sends photos and text highlights via Telegram while traveling. Claude receives these and writes the blog entries — rich, witty but not verbose — expanding the raw ideas into polished content. Ricardo's input is the seed; Claude does the writing. Writting needs to be catchy and interesting to read. Always a nice story around associated pictures. 

**Voice:** Confident, warm, lightly humorous. The tone of a well-traveled man who has seen enough of the world to not over-explain it.

### Entry Requirements

- **Every entry must be bilingual.** Provide `titleEs`, `excerptEs`, and `contentEs` for all entries. Spanish is always the primary language of the owner — translations must be natural, not mechanical.
- Use `[PHOTO]` or `[PHOTO:n]` markers in content to interleave images at the right narrative moment.
- Use `[PHOTOLEFT:n]` for **portrait (tall) images** — floats the image left at 42% width with text wrapping on the right.
- Use `[PHOTORIGHT:n]` for **portrait (tall) images** — floats the image right at 42% width with text wrapping on the left.
- Always use one of these for portrait photos; never render them full-width.
- Use `[PHOTOS:n,m]` to place two images side by side in a 1:1 grid. Best for two landscape shots of similar scenes.
- Use `[VIDEO:n]` markers for video clips when provided.

## Media Rendering Rules

- **Photos and videos must never have a black background container.** Portrait media (taller than wide) displayed in a wide container will show black bands if the container has `background: '#000'` or inherits a dark background. Always use `textAlign: 'center'` on the container with no background, and `maxWidth: '100%'`, `maxHeight`, `width: 'auto'`, `display: 'inline-block'` on the media element. This lets portrait content display at natural proportions without letterboxing.
- **Static file serving:** Photos live in `content/trips/[trip]/[leg]/photos/`. A symlink `blog/public/content → ../../content` makes them accessible at `/content/trips/[trip]/[leg]/photos/filename`. Never use a flat `public/photos/` folder — keep photos with their leg.

## Bilingual Architecture

The site is fully bilingual EN/ES with a toggle in the top-left of the header.

### Data model — bilingual fields

All optional `*Es` fields fall back to English if absent:

```
Trip:   titleEs, subtitleEs, summaryEs
Leg:    titleEs, summaryEs
Entry:  titleEs, excerptEs, contentEs
```

### Translation system

- **UI strings** — defined in `src/lib/i18n.tsx` in the `ui` dictionary, typed as `UIKey`. Add new keys there when new UI copy is introduced.
- **Content** — `useLocalizedTrip()`, `useLocalizedLeg()`, `useLocalizedEntry()` hooks in `src/lib/useLocalizedTrip.ts` swap in the `*Es` field when `lang === 'es'`.
- **Language state** — React Context (`LangProvider`) with `localStorage` persistence. Toggle updates all components in real time.
- Pages with `generateStaticParams` stay as server components; their content is delegated to `'use client'` wrapper components (`TripPageContent.tsx`, `LegPageContent.tsx`).

## Design Principles

The blog must look professional, crisp, sharp, and high quality. Think luxury travel magazine aesthetic — not a hobbyist blog. Clean typography, generous whitespace, rich photography, and polished UI components throughout.

## Navigation UX

- **Home map**: all voyage routes drawn as animated lines — click route → voyage page
- **Voyage map**: zooms to route, legs highlighted on hover — click → leg page
- **Leg map**: shows daily track with entry pins — click pin → scrolls to entry
- **Breadcrumb**: Home → Voyage → Leg always visible
- Mobile-first (sailing audience often on phones)

## Voyages & Trips

### Published (need pages built)
| Slug | Title | Type | Date |
|------|-------|------|------|
| `rocio-2025` | La Romería de El Rocío | Pilgrimage (Hermandad de Puente Genil) | May 2025 |
| `via-de-la-plata-2025` | Vía de la Plata | Trekking (Camino) | June 2025 |
| `dubai-to-langkawi` | Dubai to Langkawi — Artemisa's Maiden Blue Water Passage | Sailing | Dec 2025 – Mar 2026 |

**Dubai → Langkawi legs:**
- Leg 1: Dubai → Maldives
- Leg 2: Maldives → Sri Lanka
- Leg 3: Sri Lanka → Thailand
- Leg 4: Thailand → Langkawi

### Upcoming
| Slug | Title | Type | Date |
|------|-------|------|------|
| `camino-del-norte-2026` | Camino del Norte | Trekking (Camino) | June 2026 |

## Comments System

Comments are stored in Supabase and rendered per entry. The system is fully bilingual.

### Architecture
- **API routes:** `blog/src/app/api/comments/route.ts` — GET (fetch by entry) + POST (create)
- **Component:** `blog/src/components/Comments.tsx` — injected at the bottom of each entry in `LegPageContent.tsx`
- **Entry ID format:** `{trip-slug}/{leg-slug}/{entry-slug}` (e.g. `dubai-to-langkawi/leg-8-passage-thailand-langkawi/2026-02-20-last-night-in-thailand`)
- **i18n keys:** `comments.*` namespace in `src/lib/i18n.tsx`

### Database schema (Supabase)
```sql
comments (
  id           uuid primary key,
  entry_id     text not null,      -- trip/leg/entry slug path
  author_name  text not null,
  author_email text,               -- stored, never returned to client
  body         text not null,
  approved     boolean default true,
  created_at   timestamptz default now()
)
```
Schema file: `supabase-schema.sql` (run once in Supabase SQL Editor).

RLS policies: public SELECT on approved=true, public INSERT.

### Moderation
Currently auto-approved (`approved = true` on insert). To enable moderation: change the INSERT policy to `with check (false)` and flip `approved` manually in the Supabase dashboard.

## Deployment (Vercel)

```bash
# Push to GitHub → Vercel auto-deploys
# Required env vars in Vercel dashboard:
NEXT_PUBLIC_MAPBOX_TOKEN
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
```

## Run

```bash
cd blog && npm install --legacy-peer-deps && npm run dev   # → http://localhost:3000
```

Note: `--legacy-peer-deps` is required because `react-leaflet@5` declares a peer dep on React 19 but the project uses React 18.

## Security

### Secrets & credentials
- **Never commit `.env.local`** — it is in `.gitignore`. If it ever leaks, rotate keys immediately: Supabase Dashboard → Project Settings → API, and Mapbox → Tokens.
- `SUPABASE_SERVICE_KEY` is server-side only — never use it in client components or `NEXT_PUBLIC_` variables.
- The Supabase URL and anon key are safe to expose publicly (RLS enforces access control).

### Security headers
Configured in `next.config.mjs` via the `headers()` block. Applied to all routes:
- `Content-Security-Policy` — allowlists Mapbox, Supabase, Unsplash, Wikimedia; blocks everything else
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Strict-Transport-Security` — enforces HTTPS
- `Referrer-Policy: strict-origin-when-cross-origin`

If you add a new external service (fonts, analytics, CDN), update the CSP in `next.config.mjs` to allowlist the new domain.

### Comments API hardening (`src/app/api/comments/route.ts`)
Three layers of protection on `POST /api/comments`:
1. **CSRF** — `Origin` header must match `Host`; cross-site requests are rejected with 403
2. **Rate limiting** — 10 comments per IP per hour (in-memory sliding window; resets on cold start)
3. **Input validation** — `entry_id` must match slug regex, `author_name` ≤ 100 chars, `body` ≤ 5000 chars, email format checked

### Supabase RLS
`supabase-schema.sql` defines two policies:
- **SELECT** — only `approved = true` rows are readable
- **INSERT** — enforces the same field constraints at the DB layer (second line of defence after API validation)

Column-level `CHECK` constraints also enforce length and format limits directly on the table.

### Dependency hygiene
- Next.js is pinned to `14.2.35` (latest stable 14.x, patches multiple CVEs vs 14.2.29)
- `next-mdx-remote@5` has a known SSR code-execution CVE for *untrusted* MDX (GHSA-g4xw-jxrg-5f6m). MDX content here is author-controlled so risk is low, but upgrade to v6 when possible (breaking change — check API compatibility first)
- ESLint-related vulnerabilities (`glob`, `picomatch`) are dev-only and do not affect the deployed app
- Run `npm audit` periodically and update Next.js to the latest 14.2.x patch
