export type TripType = 'sailing' | 'camino' | 'pilgrimage' | 'travel'

export interface Coordinates {
  lat: number
  lng: number
}

export interface Entry {
  slug: string
  date: string
  title: string
  titleEs?: string
  location: string
  coords?: Coordinates
  tags: string[]
  excerpt: string
  excerptEs?: string
  content: string
  contentEs?: string
  images: string[]
  video?: string
  videos?: string[]
}

export interface Leg {
  slug: string
  title: string
  titleEs?: string
  dateStart: string
  dateEnd: string
  from: string
  to: string
  fromCoords: Coordinates
  toCoords: Coordinates
  summary: string
  summaryEs?: string
  coverImage: string
  coverImagePosition?: string
  entries: Entry[]
}

export interface Trip {
  slug: string
  title: string
  titleEs?: string
  subtitle: string
  subtitleEs?: string
  type: TripType
  dateStart: string
  dateEnd: string
  summary: string
  summaryEs?: string
  coverImage: string
  route: GeoJSONLineString | null
  tags: string[]
  legs: Leg[]
  featured?: boolean
  flat?: boolean
  elevationProfile?: Array<{ km: number; elev: number; label?: string; sleep?: boolean }>
  staticMapImage?: string
}

export interface GeoJSONLineString {
  type: 'LineString'
  coordinates: [number, number][]
}
