import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Trip, Leg, Entry } from '@/types'

const CONTENT_ROOT = path.join(process.cwd(), '../content/trips')

// ── Entries ────────────────────────────────────────────────────────────────

function loadEntriesFromDir(entriesDir: string): Entry[] {
  if (!fs.existsSync(entriesDir)) return []

  return fs
    .readdirSync(entriesDir)
    .filter(f => f.endsWith('.mdx'))
    .sort()
    .map(file => {
      const raw = fs.readFileSync(path.join(entriesDir, file), 'utf-8')
      const { data, content } = matter(raw)

      const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx$/, '')

      // Split EN body from <ES>...</ES> block
      const [enRaw = '', esRaw = ''] = content.split(/<ES>/)
      const enContent = enRaw.replace(/\n---\s*$/, '').trim()
      const contentEs = esRaw.replace(/<\/ES>[\s\S]*$/, '').trim() || undefined

      const images: string[] = (data.photos ?? []).map((p: { url: string }) => p.url)
      const captions: string[] = (data.photos ?? []).map((p: { caption?: string }) => p.caption ?? '')
      const captionsEs: string[] = (data.photos ?? []).map((p: { captionEs?: string }) => p.captionEs ?? '')
      const videos: string[] = (data.videos ?? []).map((v: { url: string }) => v.url)

      const loc = data.location
      const location: string = typeof loc === 'string' ? loc : (loc?.name ?? '')
      const coords = loc?.lat != null ? { lat: loc.lat as number, lng: loc.lng as number } : undefined

      return {
        slug,
        date: String(data.date ?? ''),
        title: data.title ?? '',
        titleEs: data.titleEs,
        location,
        coords,
        tags: data.tags ?? [],
        excerpt: data.excerpt ?? '',
        excerptEs: data.excerptEs,
        content: enContent,
        contentEs,
        images,
        captions,
        captionsEs,
        videos,
      } satisfies Entry
    })
}

export function loadLegEntries(tripSlug: string, legSlug: string): Entry[] {
  return loadEntriesFromDir(path.join(CONTENT_ROOT, tripSlug, legSlug, 'entries'))
}

// ── Legs ───────────────────────────────────────────────────────────────────

function loadLeg(tripSlug: string, legSlug: string): Leg | null {
  const legJsonPath = path.join(CONTENT_ROOT, tripSlug, legSlug, 'leg.json')
  if (!fs.existsSync(legJsonPath)) return null

  const data = JSON.parse(fs.readFileSync(legJsonPath, 'utf-8'))

  // from/to may be a string or { name, lat, lng }
  const fromObj = typeof data.from === 'string' ? null : data.from
  const toObj   = typeof data.to   === 'string' ? null : data.to

  return {
    slug:       data.slug ?? legSlug,
    title:      data.title ?? '',
    titleEs:    data.titleEs,
    dateStart:  data.dateStart ?? '',
    dateEnd:    data.dateEnd ?? '',
    from:       fromObj ? fromObj.name : data.from,
    to:         toObj   ? toObj.name   : data.to,
    fromCoords: fromObj ? { lat: fromObj.lat, lng: fromObj.lng } : data.fromCoords,
    toCoords:   toObj   ? { lat: toObj.lat,   lng: toObj.lng   } : data.toCoords,
    summary:    data.summary ?? '',
    summaryEs:  data.summaryEs,
    coverImage: data.coverImage ?? '',
    entries:    loadLegEntries(tripSlug, legSlug),
  }
}

// ── Trips ──────────────────────────────────────────────────────────────────

export function loadAllTrips(): Trip[] {
  if (!fs.existsSync(CONTENT_ROOT)) return []

  return fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()
    .flatMap(tripSlug => {
      const tripJsonPath = path.join(CONTENT_ROOT, tripSlug, 'trip.json')
      if (!fs.existsSync(tripJsonPath)) return []

      const data = JSON.parse(fs.readFileSync(tripJsonPath, 'utf-8'))

      const tripDir = path.join(CONTENT_ROOT, tripSlug)
      const flatEntriesDir = path.join(tripDir, 'entries')
      const isFlat = fs.existsSync(flatEntriesDir) && fs.lstatSync(flatEntriesDir).isDirectory()

      let legs: Leg[]
      if (isFlat) {
        // Flat trip: entries live directly in trip/entries/ — create a synthetic leg
        legs = [{
          slug:       'entries',
          title:      data.title ?? '',
          titleEs:    data.titleEs,
          dateStart:  data.dateStart ?? '',
          dateEnd:    data.dateEnd ?? '',
          from:       '',
          to:         '',
          fromCoords: { lat: 0, lng: 0 },
          toCoords:   { lat: 0, lng: 0 },
          summary:    data.summary ?? '',
          summaryEs:  data.summaryEs,
          coverImage: data.coverImage ?? '',
          entries:    loadEntriesFromDir(flatEntriesDir),
        }]
      } else {
        legs = fs
          .readdirSync(tripDir, { withFileTypes: true })
          .filter(d => d.isDirectory())
          .map(d => d.name)
          .sort()
          .flatMap(legSlug => {
            const leg = loadLeg(tripSlug, legSlug)
            return leg ? [leg] : []
          })
      }

      return [{
        slug:       data.slug ?? tripSlug,
        title:      data.title ?? '',
        titleEs:    data.titleEs,
        subtitle:   data.subtitle ?? '',
        subtitleEs: data.subtitleEs,
        type:       data.type ?? 'travel',
        dateStart:  data.dateStart ?? '',
        dateEnd:    data.dateEnd ?? '',
        summary:    data.summary ?? '',
        summaryEs:  data.summaryEs,
        coverImage: data.coverImage ?? '',
        route:            data.route ?? null,
        tags:             data.tags ?? [],
        featured:         data.featured ?? false,
        flat:             isFlat,
        elevationProfile: data.elevationProfile,
        staticMapImage:   data.staticMapImage,
        legs,
      }] satisfies Trip[]
    })
}
