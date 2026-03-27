import { notFound } from 'next/navigation'
import { getTripBySlug, getTrips } from '@/lib/trips'
import EntryPageContent from '@/components/EntryPageContent'

export function generateStaticParams() {
  return getTrips().flatMap((t) =>
    t.legs.flatMap((l) =>
      l.entries.map((e) => ({ slug: t.slug, leg: l.slug, entry: e.slug }))
    )
  )
}

export default function EntryPage({
  params,
}: {
  params: { slug: string; leg: string; entry: string }
}) {
  const trip = getTripBySlug(params.slug)
  if (!trip) notFound()

  const legIndex = trip.legs.findIndex((l) => l.slug === params.leg)
  if (legIndex === -1) notFound()

  const leg = trip.legs[legIndex]
  const entryIndex = leg.entries.findIndex((e) => e.slug === params.entry)
  if (entryIndex === -1) notFound()

  return <EntryPageContent trip={trip} legIndex={legIndex} entryIndex={entryIndex} />
}
