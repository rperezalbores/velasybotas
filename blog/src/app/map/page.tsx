import { getTrips } from '@/lib/trips'
import MapPageContent from './MapPageContent'

export default function MapPage() {
  return <MapPageContent trips={getTrips()} />
}
