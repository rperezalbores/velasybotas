'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trip } from '@/types'
import { useT } from '@/lib/i18n'
import { useLocalizedTrip } from '@/lib/useLocalizedTrip'

const typeColor: Record<string, string> = {
  sailing: '#1e6091',
  camino: '#6b4226',
  pilgrimage: '#7c5c2e',
  travel: '#2d6a4f',
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  if (s.getFullYear() === e.getFullYear()) {
    return `${months[s.getMonth()]} – ${months[e.getMonth()]} ${e.getFullYear()}`
  }
  return `${months[s.getMonth()]} ${s.getFullYear()} – ${months[e.getMonth()]} ${e.getFullYear()}`
}

export default function TripCard({ trip: rawTrip, featured = false }: { trip: Trip; featured?: boolean }) {
  const t = useT()
  const trip = useLocalizedTrip(rawTrip)
  const typeLabel: Record<string, string> = {
    sailing: t('type.sailing'),
    camino: t('type.camino'),
    pilgrimage: t('type.pilgrimage'),
    travel: t('type.travel'),
  }

  if (featured) {
    return (
      <Link href={`/trips/${trip.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          className="trip-card"
          style={{
            position: 'relative',
            borderRadius: '2px',
            overflow: 'hidden',
            height: 'clamp(300px, 55vw, 520px)',
            cursor: 'pointer',
          }}
        >
          {/* Background image */}
          <Image
            src={trip.coverImage}
            alt={trip.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
          />
          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(7,14,23,0.92) 0%, rgba(7,14,23,0.4) 50%, rgba(7,14,23,0.1) 100%)',
            }}
          />
          {/* Content */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '2.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span
                style={{
                  background: typeColor[trip.type] || '#333',
                  color: 'white',
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '2px',
                }}
              >
                {typeLabel[trip.type]}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                {formatDateRange(trip.dateStart, trip.dateEnd)}
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
                color: 'white',
                margin: '0 0 0.5rem',
                lineHeight: 1.15,
              }}
            >
              {trip.title}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1rem',
                fontStyle: 'italic',
                color: 'var(--gold-400)',
                margin: '0 0 1rem',
              }}
            >
              {trip.subtitle}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.6,
                maxWidth: '540px',
                margin: 0,
              }}
            >
              {trip.summary}
            </p>

            <div
              style={{
                marginTop: '1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--gold-400)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {t('trip.readLog')}
              <span style={{ fontSize: '1rem' }}>→</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/trips/${trip.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className="trip-card"
        style={{
          position: 'relative',
          borderRadius: '2px',
          overflow: 'hidden',
          height: 'clamp(200px, 40vw, 340px)',
          cursor: 'pointer',
        }}
      >
        <Image
          src={trip.coverImage}
          alt={trip.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          style={{ objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7,14,23,0.88) 0%, rgba(7,14,23,0.2) 60%)',
          }}
        />
        {/* Upcoming badge */}
        {new Date(trip.dateStart) > new Date() && (
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(200,169,110,0.9)',
              color: 'white',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '4px 8px',
              borderRadius: '2px',
            }}
          >
            {t('trip.upcoming')}
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.7rem',
              color: 'var(--gold-400)',
              letterSpacing: '0.08em',
            }}
          >
            {formatDateRange(trip.dateStart, trip.dateEnd)}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'white',
              margin: '0.25rem 0 0.25rem',
              lineHeight: 1.2,
            }}
          >
            {trip.title}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '0.85rem',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
            }}
          >
            {trip.subtitle}
          </p>
        </div>
      </div>
    </Link>
  )
}
