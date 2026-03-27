import { notFound } from 'next/navigation'
import { getTripBySlug, getTrips } from '@/lib/trips'
import LegPageContent from '@/components/LegPageContent'

export function generateStaticParams() {
  return getTrips().flatMap((t) =>
    t.legs.map((l) => ({ slug: t.slug, leg: l.slug }))
  )
}

export default function LegPage({ params }: { params: { slug: string; leg: string } }) {
  const trip = getTripBySlug(params.slug)
  if (!trip) notFound()

  const legIndex = trip.legs.findIndex((l) => l.slug === params.leg)
  if (legIndex === -1) notFound()

  return <LegPageContent trip={trip} legIndex={legIndex} />
}
