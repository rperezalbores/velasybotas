import { notFound } from 'next/navigation'
import { getTripBySlug, getTrips } from '@/lib/trips'
import LegPageContent from '@/components/LegPageContent'

export function generateStaticParams() {
  return getTrips()
    .filter((t) => !t.flat)
    .flatMap((t) => t.legs.map((l) => ({ slug: t.slug, leg: l.slug })))
}

export default function LegPage({ params }: { params: { slug: string; leg: string } }) {
  const trip = getTripBySlug(params.slug)
  if (!trip) notFound()

  // Flat trips have no leg pages — entries are accessed directly from the trip page
  if (trip.flat) notFound()

  const legIndex = trip.legs.findIndex((l) => l.slug === params.leg)
  if (legIndex === -1) notFound()

  return <LegPageContent trip={trip} legIndex={legIndex} />
}
