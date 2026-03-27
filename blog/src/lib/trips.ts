import { loadAllTrips } from './content'
import { Trip } from '@/types'

export function getTrips(): Trip[] {
  return loadAllTrips()
}

export function getTripBySlug(slug: string): Trip | undefined {
  return getTrips().find(t => t.slug === slug)
}

export function getFeaturedTrip(): Trip {
  const all = getTrips()
  return all.find(t => t.featured) ?? all[0]
}
