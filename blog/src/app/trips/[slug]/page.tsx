import { notFound } from 'next/navigation'
import { getTripBySlug, getTrips } from '@/lib/trips'
import TripPageContent from '@/components/TripPageContent'

export function generateStaticParams() {
  return getTrips().map((t) => ({ slug: t.slug }))
}

export default function TripPage({ params }: { params: { slug: string } }) {
  const trip = getTripBySlug(params.slug)
  if (!trip) notFound()

  return <TripPageContent trip={trip} />
}
