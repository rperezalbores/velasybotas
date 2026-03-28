'use client'

import Image from 'next/image'
import Breadcrumb from '@/components/Breadcrumb'
import RouteMap from '@/components/Map/RouteMap'
import LegList from '@/components/LegList'
import { Trip } from '@/types'
import { useT } from '@/lib/i18n'
import { useLocalizedTrip } from '@/lib/useLocalizedTrip'

const typeColor: Record<string, string> = {
  sailing: '#1e6091',
  camino: '#6b4226',
  pilgrimage: '#7c5c2e',
  travel: '#2d6a4f',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function TripPageContent({ trip: rawTrip }: { trip: Trip }) {
  const t = useT()
  const trip = useLocalizedTrip(rawTrip)

  const isUpcoming = new Date(rawTrip.dateStart) > new Date()
  const allMarkers = rawTrip.legs.map((leg) => ({
    coords: leg.fromCoords,
    label: leg.from,
  }))
  if (rawTrip.legs.length > 0) {
    const last = rawTrip.legs[rawTrip.legs.length - 1]
    allMarkers.push({ coords: last.toCoords, label: last.to })
  }

  const typeLabel: Record<string, string> = {
    sailing: t('type.sailing'),
    camino: t('type.camino'),
    pilgrimage: t('type.pilgrimage'),
    travel: t('type.travel'),
  }

  return (
    <>
      {/* Hero */}
      <div className="hero-image-container" style={{ height: '65vh' }}>
        <Image src={rawTrip.coverImage} alt={trip.title} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7,14,23,0.8) 0%, rgba(7,14,23,0.2) 60%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: 0,
            right: 0,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: typeColor[rawTrip.type] || '#1e6091',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '2px',
              marginBottom: '1rem',
              display: 'inline-block',
            }}
          >
            {typeLabel[rawTrip.type]}
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: 'white',
              margin: '0.5rem 0 0.5rem',
              lineHeight: 1.1,
            }}
          >
            {trip.title}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-playfair)',
              fontStyle: 'italic',
              fontSize: '1.1rem',
              color: 'var(--gold-400)',
              margin: 0,
            }}
          >
            {trip.subtitle}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <Breadcrumb
          items={[
            { label: t('nav.trips'), href: '/trips' },
            { label: trip.title },
          ]}
        />

        {/* Meta bar */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            padding: '1.5rem 0',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            marginBottom: '3rem',
          }}
        >
          {[
            { label: t('trip.start'), value: formatDate(rawTrip.dateStart) },
            { label: t('trip.end'), value: isUpcoming ? t('trip.upcoming') : formatDate(rawTrip.dateEnd) },
            { label: t('trip.type'), value: typeLabel[rawTrip.type] },
            { label: t('trip.legsCount'), value: rawTrip.legs.length > 0 ? `${rawTrip.legs.length}` : '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--gold-500)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--navy-900)',
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Two-col: summary + map */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
            alignItems: 'start',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '1.05rem',
                lineHeight: 1.8,
                color: '#333',
              }}
            >
              {trip.summary}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {rawTrip.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--muted)',
                    background: '#f5f5f5',
                    padding: '4px 10px',
                    borderRadius: '2px',
                    letterSpacing: '0.08em',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <RouteMap
            route={rawTrip.route}
            markers={allMarkers}
            height="320px"
          />
        </div>

        {/* Legs */}
        <LegList trip={rawTrip} />

        {rawTrip.legs.length === 0 && isUpcoming && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem',
              border: '1px dashed rgba(200,169,110,0.4)',
              borderRadius: '2px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                color: 'var(--muted)',
                margin: 0,
              }}
            >
              {t('trip.emptyLog')}
            </p>
          </div>
        )}
      </div>
    </>
  )
}
