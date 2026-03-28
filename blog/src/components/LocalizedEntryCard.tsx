'use client'

import Image from 'next/image'
import { Trip } from '@/types'
import { useLocalizedEntry } from '@/lib/useLocalizedTrip'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function LocalizedEntryCard({
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
          position: 'relative',
          aspectRatio: '4/3',
        }}
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={entry.title}
            fill
            sizes="(max-width: 640px) 100vw, 42vw"
            style={{ objectFit: 'cover' }}
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
