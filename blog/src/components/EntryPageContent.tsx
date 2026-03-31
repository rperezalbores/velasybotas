'use client'

import React from 'react'
import Image from 'next/image'
import Breadcrumb from '@/components/Breadcrumb'
import Comments from '@/components/Comments'
import { Trip } from '@/types'
import { renderInline } from '@/lib/renderText'
import { useT, useLang } from '@/lib/i18n'
import { useLocalizedTrip, useLocalizedLeg, useLocalizedEntry } from '@/lib/useLocalizedTrip'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function EntryPageContent({
  trip: rawTrip,
  legIndex,
  entryIndex,
}: {
  trip: Trip
  legIndex: number
  entryIndex: number
}) {
  const t = useT()
  const { lang } = useLang()
  const localizedTrip = useLocalizedTrip(rawTrip)
  const rawLeg = rawTrip.legs[legIndex]
  const localizedLeg = useLocalizedLeg(rawLeg)
  const rawEntry = rawLeg.entries[entryIndex]
  const entry = useLocalizedEntry(rawEntry)

  const prevEntry = entryIndex > 0 ? rawLeg.entries[entryIndex - 1] : null
  const nextEntry = entryIndex < rawLeg.entries.length - 1 ? rawLeg.entries[entryIndex + 1] : null

  const entryId = rawTrip.flat
    ? `${rawTrip.slug}/${rawEntry.slug}`
    : `${rawTrip.slug}/${rawLeg.slug}/${rawEntry.slug}`

  const backHref = rawTrip.flat ? `/trips/${rawTrip.slug}` : `/trips/${rawTrip.slug}/${rawLeg.slug}`

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem) clamp(3rem, 6vw, 6rem)' }}>
      <Breadcrumb
        items={[
          { label: t('nav.trips'), href: '/trips' },
          { label: localizedTrip.title, href: `/trips/${rawTrip.slug}` },
          ...(rawTrip.flat ? [] : [{ label: localizedLeg.title, href: `/trips/${rawTrip.slug}/${rawLeg.slug}` }]),
          { label: entry.title },
        ]}
      />

      {/* Back to leg / trip link */}
      <a
        href={backHref}
        style={{
          display: 'inline-block',
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.65rem',
          color: 'var(--gold-500)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          marginBottom: '2.5rem',
        }}
      >
        {rawTrip.flat ? t('entry.backToTrip') : t('entry.backToLeg')}
      </a>

      {/* Entry header */}
      <div style={{ marginBottom: '3rem' }}>
        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.7rem',
            color: 'var(--gold-500)',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
          }}
        >
          {formatDate(rawEntry.date)} · {rawEntry.location}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            color: 'var(--navy-900)',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {entry.title}
        </h1>
      </div>

      {/* Entry content */}
      <div className="prose-entry">
        {(() => {
          const captionStyle: React.CSSProperties = {
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.65rem',
            color: 'var(--navy-400)',
            letterSpacing: '0.05em',
            textAlign: 'center',
            marginTop: '0.5rem',
            fontStyle: 'italic',
          }
          const getCaption = (idx: number) => {
            const arr = lang === 'es' ? rawEntry.captionsEs : rawEntry.captions
            return arr?.[idx] || ''
          }
          const blocks = entry.content.split('\n\n')
          const nodes: React.ReactNode[] = []
          let i = 0
          while (i < blocks.length) {
            const block = blocks[i].trim()

            // PHOTOLEFT / PHOTORIGHT — flex row with next text block, vertically centered
            const floatMatch = block.match(/^\[PHOTO(LEFT|RIGHT):(\d+)\]$/)
            if (floatMatch) {
              const side = floatMatch[1] === 'LEFT' ? 'left' : 'right'
              const idx = parseInt(floatMatch[2])
              const src = rawEntry.images[idx]
              const caption = getCaption(idx)
              const nextBlock = blocks[i + 1]?.trim()
              const nextIsMedia = !!nextBlock?.match(/^\[(PHOTO|VIDEO)/)
              const pairedText = nextBlock && !nextIsMedia ? nextBlock : undefined
              if (src) {
                const img = (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Image src={src} alt={caption || entry.title} width={900} height={1350} className="media-float-item" sizes="(max-width: 600px) 100vw, 42vw" style={{ height: 'auto', display: 'block', borderRadius: '2px' }} />
                    {caption && <p style={captionStyle}>{caption}</p>}
                  </div>
                )
                const txt = pairedText ? <div style={{ flex: 1 }}><p style={{ margin: 0 }}>{renderInline(pairedText)}</p></div> : null
                nodes.push(
                  <div key={i} className="media-float" style={{ flexDirection: side === 'left' ? 'row' : 'row-reverse' }}>
                    {img}{txt}
                  </div>
                )
              }
              i += pairedText ? 2 : 1
              continue
            }

            // [PHOTOS:n,m] — side by side grid
            const photosMatch = block.match(/^\[PHOTOS:(\d+),(\d+)\]$/)
            if (photosMatch) {
              const idx1 = parseInt(photosMatch[1])
              const idx2 = parseInt(photosMatch[2])
              const src1 = rawEntry.images[idx1]
              const src2 = rawEntry.images[idx2]
              const cap1 = getCaption(idx1)
              const cap2 = getCaption(idx2)
              if (src1 || src2) nodes.push(
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', margin: '2rem 0' }}>
                  {src1 && <div>{<Image src={src1} alt={cap1 || entry.title} width={900} height={600} sizes="(max-width: 860px) 50vw, 430px" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '2px' }} />}{cap1 && <p style={captionStyle}>{cap1}</p>}</div>}
                  {src2 && <div>{<Image src={src2} alt={cap2 || entry.title} width={900} height={600} sizes="(max-width: 860px) 50vw, 430px" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '2px' }} />}{cap2 && <p style={captionStyle}>{cap2}</p>}</div>}
                </div>
              )
              i++; continue
            }

            // [PHOTO] / [PHOTO:n] — full width
            const photoMatch = block.match(/^\[PHOTO(?::(\d+))?\]$/)
            if (photoMatch) {
              const idx = photoMatch[1] ? parseInt(photoMatch[1]) : 0
              const src = rawEntry.images[idx]
              const caption = getCaption(idx)
              if (src) nodes.push(
                <div key={i} style={{ width: '100%', margin: '2rem 0', textAlign: 'center', background: 'transparent' }}>
                  <div style={{ display: 'inline-block', maxWidth: '100%' }}>
                    <Image src={src} alt={caption || entry.title} width={1800} height={1200} sizes="(max-width: 860px) 100vw, 860px" style={{ maxWidth: '100%', maxHeight: '572px', width: 'auto', height: 'auto', display: 'block' }} />
                    {caption && <p style={{ ...captionStyle, width: 0, minWidth: '100%', marginTop: '0.5rem' }}>{caption}</p>}
                  </div>
                </div>
              )
              i++; continue
            }

            // VIDEOLEFT / VIDEORIGHT — flex row with next text block, vertically centered
            const videoFloatMatch = block.match(/^\[VIDEO(LEFT|RIGHT):(\d+)\]$/)
            if (videoFloatMatch) {
              const side = videoFloatMatch[1] === 'LEFT' ? 'left' : 'right'
              const src = rawEntry.videos?.[parseInt(videoFloatMatch[2])] ?? rawEntry.video
              const nextBlock = blocks[i + 1]?.trim()
              const nextIsMedia = !!nextBlock?.match(/^\[(PHOTO|VIDEO)/)
              const pairedText = nextBlock && !nextIsMedia ? nextBlock : undefined
              if (src) {
                const vid = <video controls playsInline className="media-float-item" style={{ height: 'auto', display: 'block', borderRadius: '2px', maxWidth: '100%' }}><source src={src} type="video/mp4" /></video>
                const txt = pairedText ? <div style={{ flex: 1 }}><p style={{ margin: 0 }}>{renderInline(pairedText)}</p></div> : null
                nodes.push(
                  <div key={i} className="media-float" style={{ flexDirection: side === 'left' ? 'row' : 'row-reverse' }}>
                    {vid}{txt}
                  </div>
                )
              }
              i += pairedText ? 2 : 1
              continue
            }

            // [VIDEO:n]
            const videoMatch = block.match(/^\[VIDEO:(\d+)\]$/)
            if (videoMatch) {
              const src = rawEntry.videos?.[parseInt(videoMatch[1])] ?? rawEntry.video
              if (src) nodes.push(
                <div key={i} style={{ margin: '2rem 0', textAlign: 'center' }}>
                  <video controls playsInline style={{ maxWidth: '100%', maxHeight: '572px', width: 'auto', display: 'inline-block' }}>
                    <source src={src} type="video/mp4" />
                  </video>
                </div>
              )
              i++; continue
            }

            // plain text
            if (block) nodes.push(<p key={i}>{renderInline(block)}</p>)
            i++
          }
          return nodes
        })()}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        {rawEntry.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.65rem',
              color: 'var(--muted)',
              background: '#f5f5f5',
              padding: '3px 8px',
              borderRadius: '2px',
              letterSpacing: '0.06em',
            }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Comments */}
      <Comments entryId={entryId} />

      {/* Prev / Next entry nav */}
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
        {prevEntry ? (
          <a
            href={rawTrip.flat ? `/trips/${rawTrip.slug}/entries/${prevEntry.slug}` : `/trips/${rawTrip.slug}/${rawLeg.slug}/${prevEntry.slug}`}
            style={{
              textDecoration: 'none',
              padding: '1.25rem',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '2px',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '4px' }}>
              {t('entry.prevEntry')}
            </div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem', fontWeight: 600, color: 'var(--navy-900)' }}>
              {prevEntry.title}
            </div>
          </a>
        ) : (
          <a
            href={backHref}
            style={{
              textDecoration: 'none',
              padding: '1.25rem',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '2px',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '4px' }}>
              {rawTrip.flat ? t('entry.backToTrip') : t('entry.backToLeg')}
            </div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem', fontWeight: 600, color: 'var(--navy-900)' }}>
              {rawTrip.flat ? localizedTrip.title : localizedLeg.title}
            </div>
          </a>
        )}

        {nextEntry && (
          <a
            href={rawTrip.flat ? `/trips/${rawTrip.slug}/entries/${nextEntry.slug}` : `/trips/${rawTrip.slug}/${rawLeg.slug}/${nextEntry.slug}`}
            style={{
              textDecoration: 'none',
              padding: '1.25rem',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '2px',
              textAlign: 'right',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '4px' }}>
              {t('entry.nextEntry')}
            </div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem', fontWeight: 600, color: 'var(--navy-900)' }}>
              {nextEntry.title}
            </div>
          </a>
        )}
      </div>
    </div>
  )
}
