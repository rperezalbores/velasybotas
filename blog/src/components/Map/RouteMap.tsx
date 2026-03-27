'use client'

import { useEffect, useRef, lazy, Suspense } from 'react'
import { GeoJSONLineString, Coordinates } from '@/types'

const LeafletMap = lazy(() => import('./LeafletMap'))

interface RouteMapProps {
  route?: GeoJSONLineString | null
  markers?: Array<{ coords: Coordinates; label: string; color?: string }>
  height?: string
  style?: React.CSSProperties
  zoom?: number
  center?: [number, number]
}

export default function RouteMap({
  route,
  markers = [],
  height = '400px',
  style: styleProp,
  zoom = 4,
  center,
}: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)

  useEffect(() => {
    // Mapbox requires a token — using a placeholder approach
    // In production, set NEXT_PUBLIC_MAPBOX_TOKEN env var
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    if (!token) {
      // Render a stylised placeholder when no token is set
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mapboxgl: any = null

    import('mapbox-gl').then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mapboxgl = (mod.default ?? mod) as any
      mapboxgl.accessToken = token

      if (!containerRef.current || mapRef.current || !mapboxgl) return

      const defaultCenter: [number, number] = center ??
        (route ? [route.coordinates[Math.floor(route.coordinates.length / 2)][0],
                   route.coordinates[Math.floor(route.coordinates.length / 2)][1]] : [77, 10])

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: defaultCenter,
        zoom,
        attributionControl: false,
        pitchWithRotate: false,
      })

      mapRef.current = map

      map.on('load', () => {
        // Draw route
        if (route) {
          map.addSource('route', {
            type: 'geojson',
            data: { type: 'Feature', properties: {}, geometry: route },
          })
          // Shadow/glow
          map.addLayer({
            id: 'route-glow',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#c8a96e',
              'line-width': 6,
              'line-blur': 6,
              'line-opacity': 0.4,
            },
          })
          // Main line
          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#d4aa6e',
              'line-width': 2,
              'line-dasharray': [4, 3],
            },
          })
        }

        // Add markers
        markers.forEach(({ coords, label, color = '#c8a96e' }) => {
          const el = document.createElement('div')
          el.style.cssText = `
            width: 12px; height: 12px;
            border-radius: 50%;
            background: ${color};
            border: 2px solid white;
            box-shadow: 0 0 0 4px rgba(200,169,110,0.3);
            cursor: pointer;
          `
          new mapboxgl!.Marker({ element: el })
            .setLngLat([coords.lng, coords.lat])
            .setPopup(new mapboxgl!.Popup({ offset: 20 }).setText(label))
            .addTo(map)
        })
      })
    })

    return () => {
      if (mapRef.current) {
        ;(mapRef.current as { remove: () => void }).remove()
        mapRef.current = null
      }
    }
  }, [route, markers, zoom, center])

  // No token: render an interactive Leaflet map (dark tiles, no API key needed)
  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <Suspense
        fallback={
          <div
            style={{
              height,
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 50%, #0d2436 100%)',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...styleProp,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/artemisa_tracking.png"
              alt="Artemisa route — Dubai to Langkawi"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        }
      >
        <LeafletMap route={route} markers={markers} height={height} style={styleProp} />
      </Suspense>
    )
  }

  return (
    <div
      ref={containerRef}
      className="mapbox-container"
      style={{ height, borderRadius: '2px', ...styleProp }}
    />
  )
}
