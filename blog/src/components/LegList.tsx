'use client'

import Link from 'next/link'
import { Trip } from '@/types'
import { useT } from '@/lib/i18n'
import { useLocalizedLeg } from '@/lib/useLocalizedTrip'

function LocalizedLegRow({ leg, trip, index }: { leg: Trip['legs'][0]; trip: Trip; index: number }) {
  const localizedLeg = useLocalizedLeg(leg)
  return (
    <Link
      key={leg.slug}
      href={`/trips/${trip.slug}/${leg.slug}`}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '64px 1fr auto',
          gap: '1.5rem',
          padding: '1.75rem',
          background: '#fafafa',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '2px',
          transition: 'background 0.2s, box-shadow 0.2s',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.background = 'white'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.background = '#fafafa'
          ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--gold-500)',
            opacity: 0.3,
            lineHeight: 1,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        <div>
          <div
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.65rem',
              color: 'var(--muted)',
              letterSpacing: '0.1em',
              marginBottom: '4px',
            }}
          >
            {leg.from} → {leg.to}
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--navy-900)',
              margin: '0 0 0.5rem',
            }}
          >
            {localizedLeg.title}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.875rem',
              color: 'var(--muted)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {localizedLeg.summary}
          </p>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '1.25rem',
            color: 'var(--gold-500)',
            opacity: 0.6,
          }}
        >
          →
        </div>
      </div>
    </Link>
  )
}

export default function LegList({ trip }: { trip: Trip }) {
  const t = useT()
  if (trip.legs.length === 0) return null

  return (
    <>
      <div
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.65rem',
          color: 'var(--gold-500)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '2rem',
        }}
      >
        {t('trip.legs')}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {trip.legs.map((leg, i) => (
          <LocalizedLegRow key={leg.slug} leg={leg} trip={trip} index={i} />
        ))}
      </div>
    </>
  )
}
