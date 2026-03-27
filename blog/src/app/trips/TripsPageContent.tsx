'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import TripCard from '@/components/TripCard'
import { useT } from '@/lib/i18n'
import { Trip } from '@/types'

function TripsContent({ trips }: { trips: Trip[] }) {
  const searchParams = useSearchParams()
  const t = useT()
  const activeType = searchParams.get('type') ?? 'all'
  const filtered =
    activeType === 'all' ? trips : trips.filter((trip) => trip.type === activeType)

  const filterTabs = [
    { key: 'all', label: t('trips.filter.all') },
    { key: 'sailing', label: t('trips.filter.sailing') },
    { key: 'camino', label: t('trips.filter.camino') },
    { key: 'pilgrimage', label: t('trips.filter.pilgrimage') },
    { key: 'travel', label: t('trips.filter.travel') },
  ]

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '4rem' }}>
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
          {t('trips.theLog')}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: 'var(--navy-900)',
            margin: '0 0 2rem',
            lineHeight: 1.1,
          }}
        >
          {t('trips.everyVoyage')}<br />
          <span style={{ fontStyle: 'italic' }}>{t('nav.caminos')}</span>
        </h1>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {filterTabs.map(({ key, label }) => (
            <a
              key={key}
              href={key === 'all' ? '/trips' : `/trips?type=${key}`}
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '2px',
                border: `1px solid ${activeType === key ? 'var(--navy-900)' : 'rgba(0,0,0,0.12)'}`,
                background: activeType === key ? 'var(--navy-900)' : 'transparent',
                color: activeType === key ? 'white' : 'var(--muted)',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {filtered.map((trip, i) => (
          <TripCard key={trip.slug} trip={trip} featured={i === 0 && activeType === 'all'} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '6rem 0',
            fontFamily: 'var(--font-playfair)',
            fontSize: '1.25rem',
            fontStyle: 'italic',
            color: 'var(--muted)',
          }}
        >
          {t('trips.nothing')}
        </div>
      )}
    </div>
  )
}

export default function TripsPageContent({ trips }: { trips: Trip[] }) {
  return (
    <Suspense fallback={null}>
      <TripsContent trips={trips} />
    </Suspense>
  )
}
