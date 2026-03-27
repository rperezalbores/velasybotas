'use client'

import Link from 'next/link'
import { useT } from '@/lib/i18n'

export default function Footer() {
  const t = useT()
  return (
    <footer
      style={{
        background: 'var(--navy-950)',
        borderTop: '1px solid rgba(200,169,110,0.15)',
        padding: '4rem 2rem 2rem',
        marginTop: '6rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '0.5rem',
              }}
            >
              Velas y Botas
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.7,
                maxWidth: '240px',
              }}
            >
              {t('footer.tagline')}<br />
              Ricardo Perez — retired, sailing, walking Caminos.
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'var(--gold-500)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              {t('footer.navigate')}
            </div>
            {[
              { href: '/trips', label: t('footer.allTrips') },
              { href: '/trips?type=sailing', label: t('nav.sailing') },
              { href: '/trips?type=camino', label: t('nav.caminos') },
              { href: '/map', label: t('nav.map') },
              { href: '/about', label: t('nav.about') },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                  marginBottom: '0.5rem',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'var(--gold-500)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              Artemisa
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.7,
              }}
            >
              Hanse 505<br />
              21 kWh lithium · 2 kW solar<br />
              Royal Langkawi Yacht Marina<br />
              Malaysia
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0 0 1.5rem' }} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            © {new Date().getFullYear()} Ricardo Perez · Velas y Botas
          </span>
          <span
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.7rem',
              color: 'rgba(200,169,110,0.4)',
              letterSpacing: '0.05em',
            }}
          >
            Dubai · Langkawi · Somewhere in between
          </span>
        </div>
      </div>
    </footer>
  )
}
