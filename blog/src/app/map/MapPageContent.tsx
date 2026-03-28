'use client'

import RouteMap from '@/components/Map/RouteMap'
import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/lib/i18n'
import { useLocalizedTrip } from '@/lib/useLocalizedTrip'
import { Trip } from '@/types'

function LocalizedTripLink({ trip: rawTrip }: { trip: Trip }) {
  const trip = useLocalizedTrip(rawTrip)
  return (
    <Link
      href={`/trips/${rawTrip.slug}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '2px',
        textDecoration: 'none',
        transition: 'box-shadow 0.2s',
        background: 'white',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '2px',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <Image
          src={rawTrip.coverImage}
          alt={trip.title}
          width={48}
          height={48}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--navy-900)',
            lineHeight: 1.2,
          }}
        >
          {trip.title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.65rem',
            color: 'var(--muted)',
            marginTop: '2px',
          }}
        >
          {new Date(rawTrip.dateStart).getFullYear()}
        </div>
      </div>
    </Link>
  )
}

export default function MapPageContent({ trips }: { trips: Trip[] }) {
  const t = useT()
  const tripsWithRoutes = trips.filter((t) => t.route)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.65rem',
            color: 'var(--gold-500)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          {t('map.theChart')}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: 'var(--navy-900)',
            margin: '0 0 1rem',
            lineHeight: 1.1,
          }}
        >
          {t('map.whereArtemisa').split('\n')[0]}<br />
          <span style={{ fontStyle: 'italic' }}>{t('map.whereArtemisa').split('\n')[1]}</span>
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.95rem',
            color: 'var(--muted)',
            maxWidth: '500px',
          }}
        >
          {t('map.allRoutes')}
          Set <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '2px', fontSize: '0.85em' }}>NEXT_PUBLIC_MAPBOX_TOKEN</code> in your .env for the interactive version.
        </p>
      </div>

      {/* Main map */}
      <RouteMap
        route={tripsWithRoutes[0]?.route}
        markers={tripsWithRoutes[0]?.legs.map((l) => ({ coords: l.fromCoords, label: l.from })) ?? []}
        height="clamp(280px, 45vw, 520px)"
        zoom={3}
        center={[77, 10]}
      />

      {/* Trip list */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
          marginTop: '3rem',
        }}
      >
        {trips.map((trip) => (
          <LocalizedTripLink key={trip.slug} trip={trip} />
        ))}
      </div>
    </div>
  )
}
