import { getTrips } from '@/lib/trips'
import TripsPageContent from './TripsPageContent'

export default function TripsPage() {
  return <TripsPageContent trips={getTrips()} />
}
