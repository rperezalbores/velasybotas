'use client'

import Link from 'next/link'
import { useT } from '@/lib/i18n'

export default function AboutPage() {
  const t = useT()
  return (
    <>
      {/* Hero */}
      <div
        style={{
          background: 'var(--navy-950)',
          padding: '6rem 2rem 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative anchor */}
        <div
          style={{
            position: 'absolute',
            right: '-2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '18rem',
            opacity: 0.03,
            userSelect: 'none',
            fontFamily: 'serif',
            color: 'white',
          }}
        >
          ⚓
        </div>

        <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative' }}>
          <div
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.65rem',
              color: 'var(--gold-500)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            {t('nav.about')}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 800,
              color: 'white',
              margin: '0 0 1rem',
              lineHeight: 1.1,
            }}
          >
            Ricardo Perez
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-playfair)',
              fontStyle: 'italic',
              fontSize: '1.15rem',
              color: 'var(--gold-400)',
              margin: 0,
            }}
          >
            {t('about.retired')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div className="prose-entry">
          <p>
            <strong>Born in October 1969.</strong> Retired in May 2025, which turned out to be less of an ending
            and more of a starting gun.
          </p>

          <p>
            The plan, to the extent there was one: sail Artemisa from Dubai to wherever she wants to go next,
            walk every Camino worth walking, eat well, cook better, and be present for the family that makes
            all of it worth doing.
          </p>

          <h2>Artemisa</h2>

          <p>
            <strong>A Hanse 505, acquired in 2023.</strong> Three years of work followed — not because she needed
            rescuing, but because blue water sailing demands a particular kind of preparation. Twenty-one
            kilowatts of lithium battery. Two kilowatts of solar on deck. Watermaker, SSB radio, full
            offshore safety kit.
          </p>

          <p>
            She left Dubai in December 2025 and arrived in Langkawi in March 2026. Maldives, Sri Lanka, Thailand
            along the way. The Indian Ocean, for the record, is not an ocean that forgives casual attention.
          </p>

          <p>
            Artemisa is currently berthed at the <strong>Royal Langkawi Yacht Marina</strong>, Malaysia.
            She is resting. We are not.
          </p>

          <h2>The Caminos</h2>

          <p>
            Before the sailing, there were the walks. <strong>La Romería de El Rocío in May 2025</strong> —
            joined the Hermandad de Puente Genil for the first time. A million people, oxcarts through
            the marshes of Doñana, and a particular kind of Andalusian madness that is impossible to explain
            and equally impossible to forget.
          </p>

          <p>
            <strong>Vía de la Plata in June 2025.</strong> Sevilla to Santiago, roughly 1,000km through
            Extremadura. The least walked of the major Caminos — minimal infrastructure, almost no other
            pilgrims, and a sky so large it becomes a presence.
          </p>

          <p>
            <strong>Camino del Norte, June 2026.</strong> The northern coastal route. Already planned.
          </p>

          <h2>The rest of it</h2>

          <p>
            Golf, when there is a course worth playing. Cooking, always — the galley on Artemisa has produced
            meals that would not embarrass a restaurant ashore. Yoga, for the body that is asked to do a great
            deal of sailing and walking. A lovely wife who tolerates the obsessions. Two daughters who are,
            objectively, extraordinary.
          </p>

          <p>
            Home base remains <strong>Dubai</strong>, though that word — home — has become increasingly
            approximate.
          </p>

          <blockquote>
            The wake is the past. The horizon is not destination — it is direction.
          </blockquote>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <Link
            href="/trips"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--navy-900)',
              color: 'white',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '14px 28px',
              borderRadius: '2px',
            }}
          >
            {t('trip.readLog')} →
          </Link>
        </div>
      </div>
    </>
  )
}
