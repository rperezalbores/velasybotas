'use client'

import { useEffect, useRef } from 'react'
import { GeoJSONLineString, Coordinates } from '@/types'

interface LeafletMapProps {
  route?: GeoJSONLineString | null
  markers?: Array<{ coords: Coordinates; label: string }>
  height?: string
  style?: React.CSSProperties
}

export default function LeafletMap({ route, markers = [], height = '400px', style: styleProp }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Dynamically import leaflet (not SSR-safe)
    import('leaflet').then((L) => {
      if (!containerRef.current || mapRef.current) return

      // Inject Leaflet CSS once
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // Default center: middle of the route, or Indian Ocean
      const defaultCenter: [number, number] = route
        ? (() => {
            const mid = route.coordinates[Math.floor(route.coordinates.length / 2)]
            return [mid[1], mid[0]]
          })()
        : [10, 77]

      const map = L.map(containerRef.current, {
        center: defaultCenter,
        zoom: 4,
        zoomControl: true,
        attributionControl: false,
      })

      mapRef.current = map

      // CartoDB Voyager — daylight, clean, no API key needed
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map)

      // Route polyline
      if (route) {
        const latlngs: [number, number][] = route.coordinates.map(([lng, lat]) => [lat, lng])

        // Glow layer
        L.polyline(latlngs, {
          color: '#cc00cc',
          weight: 4,
          opacity: 0.18,
          smoothFactor: 1,
        }).addTo(map)

        // Main solid line
        L.polyline(latlngs, {
          color: '#dd00cc',
          weight: 1.3,
          opacity: 0.95,
          smoothFactor: 1,
        }).addTo(map)

        // Fit map to route
        map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40] })
      }

      // Waypoint markers
      markers.forEach(({ coords, label }) => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:12px;height:12px;
            border-radius:50%;
            background:#dd00cc;
            border:2px solid #fff;
            box-shadow:0 0 0 4px rgba(221,0,204,0.25);
          "></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        })
        L.marker([coords.lat, coords.lng], { icon })
          .bindPopup(`<span style="font-family:sans-serif;font-size:13px">${label}</span>`)
          .addTo(map)
      })
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [route, markers])

  return (
    <div
      ref={containerRef}
      style={{
        height,
        borderRadius: '2px',
        overflow: 'hidden',
        ...styleProp,
      }}
    />
  )
}
