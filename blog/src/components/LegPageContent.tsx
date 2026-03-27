'use client'

import Breadcrumb from '@/components/Breadcrumb'
import RouteMap from '@/components/Map/RouteMap'
import { Trip, GeoJSONLineString } from '@/types'
import { useT } from '@/lib/i18n'
import { useLocalizedTrip, useLocalizedLeg, useLocalizedEntry } from '@/lib/useLocalizedTrip'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function LegPageContent({ trip: rawTrip, legIndex }: { trip: Trip; legIndex: number }) {
  const t = useT()
  const localizedTrip = useLocalizedTrip(rawTrip)
  const rawLeg = rawTrip.legs[legIndex]
  const leg = useLocalizedLeg(rawLeg)

  const legRoute: GeoJSONLineString = {
    type: 'LineString',
    coordinates: [
      [rawLeg.fromCoords.lng, rawLeg.fromCoords.lat],
      [rawLeg.toCoords.lng, rawLeg.toCoords.lat],
    ],
  }

  const entryMarkers = rawLeg.entries
    .filter((e) => e.coords)
    .map((e) => ({ coords: e.coords!, label: e.title }))

  return (
    <>
      {/* Hero */}
      <div className="hero-image-container" style={{ height: '55vh' }}>
        <img src={rawLeg.coverImage} alt={leg.title} style={rawLeg.coverImagePosition ? { objectPosition: rawLeg.coverImagePosition } : undefined} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7,14,23,0.85) 0%, rgba(7,14,23,0.2) 70%, transparent 100%)',
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
          <div
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.7rem',
              color: 'var(--gold-400)',
              letterSpacing: '0.15em',
              marginBottom: '0.75rem',
            }}
          >
            {rawLeg.from} → {rawLeg.to}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 800,
              color: 'white',
              margin: '0',
              lineHeight: 1.1,
            }}
          >
            {leg.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <Breadcrumb
          items={[
            { label: t('nav.trips'), href: '/trips' },
            { label: localizedTrip.title, href: `/trips/${rawTrip.slug}` },
            { label: leg.title },
          ]}
        />

        {/* Summary + map */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '1.05rem',
                lineHeight: 1.8,
                color: '#333',
                marginBottom: '2rem',
              }}
            >
              {leg.summary}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                padding: '1.25rem',
                background: '#fafafa',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '2px',
              }}
            >
              {[
                { label: t('leg.departed'), value: formatDate(rawLeg.dateStart).split(',').slice(0,2).join(',') },
                { label: t('leg.arrived'), value: formatDate(rawLeg.dateEnd).split(',').slice(0,2).join(',') },
                { label: t('leg.entries'), value: `${rawLeg.entries.length}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-mono)',
                      fontSize: '0.6rem',
                      color: 'var(--gold-500)',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      marginBottom: '2px',
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: 'var(--navy-900)',
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <RouteMap
            route={legRoute}
            markers={entryMarkers}
            height="280px"
            zoom={5}
            center={[
              (rawLeg.fromCoords.lng + rawLeg.toCoords.lng) / 2,
              (rawLeg.fromCoords.lat + rawLeg.toCoords.lat) / 2,
            ]}
          />
        </div>

        {/* Entry index cards */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.65rem',
              color: 'var(--gold-500)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '2.5rem',
            }}
          >
            {t('leg.logEntries')}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {rawLeg.entries.map((rawEntry, i) => (
              <LocalizedEntryCard
                key={rawEntry.slug}
                rawEntry={rawEntry}
                index={i}
                href={`/trips/${rawTrip.slug}/${rawLeg.slug}/${rawEntry.slug}`}
                readLabel={t('leg.readEntry')}
              />
            ))}
          </div>

          {rawLeg.entries.length === 0 && (
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
                {t('leg.emptyLog')}
              </p>
            </div>
          )}
        </div>

        {/* Prev / Next leg nav */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '5rem',
            paddingTop: '3rem',
            borderTop: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          {legIndex > 0 ? (
            <a
              href={`/trips/${rawTrip.slug}/${rawTrip.legs[legIndex - 1].slug}`}
              style={{
                textDecoration: 'none',
                padding: '1.25rem',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '2px',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--muted)',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                }}
              >
                {t('leg.prevLeg')}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--navy-900)',
                }}
              >
                {rawTrip.legs[legIndex - 1].title}
              </div>
            </a>
          ) : <div />}

          {legIndex < rawTrip.legs.length - 1 && (
            <a
              href={`/trips/${rawTrip.slug}/${rawTrip.legs[legIndex + 1].slug}`}
              style={{
                textDecoration: 'none',
                padding: '1.25rem',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '2px',
                textAlign: 'right',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--muted)',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                }}
              >
                {t('leg.nextLeg')}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--navy-900)',
                }}
              >
                {rawTrip.legs[legIndex + 1].title}
              </div>
            </a>
          )}
        </div>
      </div>
    </>
  )
}

function LocalizedEntryCard({
  rawEntry,
  index,
  href,
  readLabel,
}: {
  rawEntry: Trip['legs'][0]['entries'][0]
  index: number
  href: string
  readLabel: string
}) {
  const entry = useLocalizedEntry(rawEntry)
  const coverImage = rawEntry.images[0]

  return (
    <a
      href={href}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        textDecoration: 'none',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: '2px',
        overflow: 'hidden',
        background: 'white',
        transition: 'box-shadow 0.22s, transform 0.22s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Cover image */}
      <div
        style={{
          width: '42%',
          minWidth: '180px',
          flex: '0 0 42%',
          overflow: 'hidden',
          background: '#f0ece3',
        }}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={entry.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              aspectRatio: '4/3',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              aspectRatio: '4/3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 100%)',
            }}
          >
            <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>⊕</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          flex: '1 1 260px',
          padding: '2rem 2.5rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Faded entry number */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1.5rem',
            fontFamily: 'var(--font-playfair)',
            fontSize: '5rem',
            fontWeight: 800,
            color: 'var(--navy-900)',
            opacity: 0.055,
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Date + location */}
        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.65rem',
            color: 'var(--gold-500)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          {formatDate(rawEntry.date)} · {rawEntry.location}
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
            fontWeight: 700,
            color: 'var(--navy-900)',
            margin: '0 0 1rem',
            lineHeight: 1.25,
          }}
        >
          {entry.title}
        </h3>

        {/* Excerpt */}
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.95rem',
            color: '#555',
            lineHeight: 1.75,
            margin: '0 0 1.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1,
          } as React.CSSProperties}
        >
          {entry.excerpt}
        </p>

        {/* CTA */}
        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.7rem',
            color: 'var(--gold-500)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {readLabel}
        </div>
      </div>
    </a>
  )
}
