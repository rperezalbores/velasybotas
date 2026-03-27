import { getTrips, getFeaturedTrip } from '@/lib/trips'
import HomePageContent from './HomePageContent'

export default function HomePage() {
  const featured = getFeaturedTrip()
  const others = getTrips().filter((t) => t.slug !== featured.slug).slice(0, 3)

  return <HomePageContent featured={featured} others={others} />
}
