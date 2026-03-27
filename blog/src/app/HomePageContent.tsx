'use client'

import Link from 'next/link'
import TripCard from '@/components/TripCard'
import { useT } from '@/lib/i18n'
import { useLocalizedTrip } from '@/lib/useLocalizedTrip'
import { Trip } from '@/types'

interface Props {
  featured: Trip
  others: Trip[]
}

export default function HomePageContent({ featured: rawFeatured, others }: Props) {
  const t = useT()
  const featured = useLocalizedTrip(rawFeatured)

  return (
    <>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <img
          src={featured.coverImage}
          alt={featured.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
          }}
        />
        {/* Multi-layer gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(7,14,23,0.96) 0%, rgba(7,14,23,0.5) 40%, rgba(7,14,23,0.15) 70%, transparent 100%)',
          }}
        />
        {/* Side vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(7,14,23,0.3) 0%, transparent 40%, transparent 60%, rgba(7,14,23,0.3) 100%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem 5rem',
          }}
        >
          {/* Kicker */}
          <div
            className="fade-up"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.7rem',
                color: 'var(--gold-400)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              {t('home.latest')}
            </span>
            <span style={{ width: '40px', height: '1px', background: 'var(--gold-400)', opacity: 0.5 }} />
          </div>

          {/* Title */}
          <h1
            className="fade-up fade-up-delay-1"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.05,
              margin: '0 0 0.75rem',
              maxWidth: '700px',
              letterSpacing: '-0.02em',
            }}
          >
            {featured.title}
          </h1>

          <p
            className="fade-up fade-up-delay-2"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontStyle: 'italic',
              color: 'var(--gold-400)',
              margin: '0 0 1.5rem',
            }}
          >
            {featured.subtitle}
          </p>

          <p
            className="fade-up fade-up-delay-3"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.7,
              maxWidth: '520px',
              margin: '0 0 2rem',
            }}
          >
            {featured.summary}
          </p>

          <div className="fade-up fade-up-delay-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href={`/trips/${rawFeatured.slug}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--gold-500)',
                color: 'white',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '14px 28px',
                borderRadius: '2px',
                transition: 'background 0.2s',
              }}
            >
              {t('home.readLog')} <span>→</span>
            </Link>
            <Link
              href="/trips"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '14px 28px',
                borderRadius: '2px',
                transition: 'border-color 0.2s',
              }}
            >
              {t('home.allTrips')}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.5,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.6rem',
              color: 'white',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              writingMode: 'vertical-rl',
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: '1px',
              height: '40px',
              background: 'white',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </div>
      </section>

      {/* Section: All trips */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.65rem',
                color: 'var(--gold-500)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              {t('home.theLog')}
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--navy-900)',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {t('home.everyVoyage')}
            </h2>
          </div>
          <Link
            href="/trips"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--navy-900)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--gold-500)',
              paddingBottom: '2px',
              letterSpacing: '0.06em',
            }}
          >
            {t('trips.viewAll')}
          </Link>
        </div>

        {/* Featured large card */}
        <div style={{ marginBottom: '1.5rem' }}>
          <TripCard trip={rawFeatured} featured />
        </div>

        {/* Grid of others */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {others.map((trip) => (
            <TripCard key={trip.slug} trip={trip} />
          ))}
        </div>
      </section>

      {/* Section: About teaser */}
      <section
        style={{
          background: 'var(--navy-950)',
          padding: '6rem 2rem',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '4rem',
              color: 'var(--gold-500)',
              opacity: 0.15,
              lineHeight: 1,
              marginBottom: '1.5rem',
              userSelect: 'none',
            }}
          >
            ⚓
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: 'white',
              margin: '0 0 1.5rem',
              lineHeight: 1.2,
            }}
          >
            {t('home.retired')}<br />
            <span style={{ fontStyle: 'italic', color: 'var(--gold-400)' }}>{t('home.adventureStarted')}</span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.8,
              margin: '0 0 2.5rem',
            }}
          >
            Artemisa is a Hanse 505 berthed in Langkawi after her maiden blue water passage from Dubai.
            Three years of upgrades — 21 kWh of lithium, 2 kW of solar — paid off across three oceans.
            Between passages, there are Caminos to walk and Romerías to join.
          </p>
          <Link
            href="/about"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(200,169,110,0.4)',
              color: 'var(--gold-400)',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: '2px',
              transition: 'border-color 0.2s',
            }}
          >
            {t('home.aboutRicardo')}
          </Link>
        </div>
      </section>
    </>
  )
}
