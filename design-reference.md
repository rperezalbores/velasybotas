# Design Reference — rojocangrejo.com

Source: https://www.rojocangrejo.com/alineamientos-de-carnac/

Use this file as inspiration for the look, feel, and editorial voice of the travel blog.

---

## Visual Design

### Layout
- Fixed header with dark background, white logo (SVG, animated)
- Single-column article body, max ~780px wide, centred
- Sidebar below main content on mobile (responsive stacking)
- Generous padding — content breathes
- Breadcrumb under header: `Home → Country → Article`

### Typography
- **Headlines**: Bold (700+), large, clean sans-serif
- **Body**: Regular weight, comfortable line-height (~1.7), ~17–18px
- **Section numbers**: `01—`, `02—` — large, styled as decorative dividers
- **Emphasis**: Heavy use of `**bold**` for scanability — key facts, punchlines, instructions all bolded inline
- No serif fonts — clean, modern throughout

### Color
- Dark header (`#1a1a1a` or similar) with white text/logo
- White article background
- Warm accent color for CTAs and links
- Photography carries all the color — the UI stays neutral

### Images
- Full-width hero image immediately below the title
- Inline images (portrait + landscape) break up long text blocks
- High resolution, professional quality
- No captions visible — images speak for themselves or are introduced in body copy
- `object-fit: cover` for consistent ratios

### Section Dividers
```
01—
## Section Title
```
The number + em dash acts as a visual anchor and progress indicator through the article.

### Table of Contents
- Labelled "Directo al grano" (straight to the point)
- Bullet list of anchor links
- Appears after intro, before first section
- Should be collapsible or subtle — not dominant

---

## Content Structure (per article/entry)

```
1. Hook — Scene, dialogue, or provocative opener (2–4 paragraphs)
2. Context-setter — "Here's why this matters / what this is"
3. Hero image
4. Table of contents ("Directo al grano")
5. Numbered sections (01—, 02—, 03—...)
   Each section: mix of storytelling + practical info + inline images
6. Closing / What else to do nearby
7. Related articles
```

---

## Writing Voice (for Claude to emulate)

- **Witty but not verbose** — punchy sentences, humour comes from observation not from trying too hard
- **Conversational second-person** ("te estarás preguntando", "vamos al grano")
- **Bold text as rhythm** — readers skim, bold catches the eye, keeps them reading
- **Self-aware** — the writer acknowledges the reader's impatience and plays with it
- **Grounded in personal experience** — specific details (what was eaten, what was said, what went wrong) over generic travel prose
- No clichés ("hidden gem", "magical", "breathtaking") — describe what you actually saw and felt

### Adapted voice for Ricardo's blog
Ricardo is Spanish, retired, sailing blue water on Artemisa and walking Caminos. Tone should feel like a well-traveled man writing for friends — warm, direct, occasionally irreverent. Stories should feel lived-in, not performed.

---

## Navigation UX Patterns

- **Multi-level dropdown** organised geographically (continent → country)
- **Hamburger menu** on mobile with back-navigation per level
- **Breadcrumbs** always visible under header
- Fixed header stays accessible while scrolling
- No infinite scroll — paginated or linked article flow

---

## What to Implement (adapted for this blog)

| rojocangrejo pattern | Ricardo's blog adaptation |
|---|---|
| Geographic nav by continent/country | Nav by trip type: Sailing / Caminos / Travel |
| Article sections `01—` `02—` | Entry sections within each leg |
| Full-width hero image | Hero image per voyage + per leg |
| "Directo al grano" TOC | "En este viaje" summary box per trip |
| Bold-heavy body copy | Same — bold for facts, punchlines, key moments |
| Dark header + white logo | Dark nautical header, Artemisa-inspired palette |
| Breadcrumb nav | Home → Trip → Leg → Entry |

---

## Palette Suggestion (inspired by, not copied from)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#ffffff` | Article background |
| `--header-bg` | `#0d1b2a` | Deep navy — nautical, not black |
| `--header-text` | `#ffffff` | Logo + nav |
| `--accent` | `#c8a96e` | Gold/sand — warm, not garish |
| `--text` | `#1a1a1a` | Body copy |
| `--muted` | `#6b7280` | Captions, metadata |
| `--section-num` | `#c8a96e` | `01—` dividers |

---

## Fonts to Consider

- **Headings**: `Playfair Display` or `Cormorant Garamond` — editorial weight, works in Spanish and English
- **Body**: `Inter` or `DM Sans` — clean, highly legible
- **Section numbers**: Same as headings, oversized, light or bold

---

## Things to Avoid

- Generic AI travel blog aesthetic (pale backgrounds, soft pastels, Lato/Roboto everywhere)
- Cluttered sidebars with ads/widgets
- Auto-playing video or music
- Stock photography — Ricardo's own photos only
- Overly formal or stiff writing — this is a personal blog, not a tourism board
