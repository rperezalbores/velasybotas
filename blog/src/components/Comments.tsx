'use client'

import { useState, useEffect, useRef } from 'react'
import { useT } from '@/lib/i18n'

interface Comment {
  id: string
  author_name: string
  body: string
  created_at: string
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  // Simple deterministic color from name
  const colors = [
    { bg: 'var(--navy-900)', fg: 'var(--gold-500)' },
    { bg: '#1e6091',         fg: '#e8f4f8' },
    { bg: '#2d6a4f',         fg: '#d8f3dc' },
    { bg: '#6b4226',         fg: '#fde8d8' },
    { bg: '#4a3728',         fg: 'var(--gold-400)' },
  ]
  const color = colors[name.charCodeAt(0) % colors.length]

  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: color.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-playfair)',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: color.fg,
        flexShrink: 0,
      }}
    >
      {initials || '?'}
    </div>
  )
}

function formatCommentDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Comments({ entryId }: { entryId: string }) {
  const t = useT()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [thanks, setThanks] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    fetch(`/api/comments?entry=${encodeURIComponent(entryId)}`)
      .then((r) => r.json())
      .then((data) => { setComments(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [entryId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !body.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry_id: entryId, author_name: name, author_email: email, body }),
      })
      if (!res.ok) throw new Error()
      const newComment: Comment = await res.json()
      setComments((prev) => [...prev, newComment])
      setName(''); setEmail(''); setBody('')
      setThanks(true)
      setTimeout(() => setThanks(false), 5000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const count = comments.length

  return (
    <div
      style={{
        marginTop: '3.5rem',
        paddingTop: '3rem',
        borderTop: '1px solid rgba(200,169,110,0.3)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--navy-900)',
            margin: 0,
          }}
        >
          {t('comments.title')}
        </h3>
        {!loading && count > 0 && (
          <span
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.68rem',
              color: 'var(--muted)',
              letterSpacing: '0.06em',
            }}
          >
            {count} {t('comments.count')}{count !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Comment list */}
      {loading ? (
        <div style={{ height: '2rem' }} />
      ) : count === 0 ? (
        <p
          style={{
            fontFamily: 'var(--font-playfair)',
            fontStyle: 'italic',
            fontSize: '0.95rem',
            color: 'var(--muted)',
            marginBottom: '2.5rem',
          }}
        >
          {t('comments.noComments')}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
          {comments.map((c) => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '0 1rem' }}>
              <Avatar name={c.author_name} />
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.6rem',
                    marginBottom: '0.35rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--navy-900)',
                    }}
                  >
                    {c.author_name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-mono)',
                      fontSize: '0.65rem',
                      color: 'var(--muted)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {formatCommentDate(c.created_at)}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.7,
                    color: '#2d2d2d',
                    margin: 0,
                  }}
                >
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Divider */}
      <div
        style={{
          borderTop: '1px solid rgba(200,169,110,0.25)',
          marginBottom: '2rem',
        }}
      />

      {/* Form */}
      <h4
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--navy-900)',
          margin: '0 0 1.5rem',
        }}
      >
        {t('comments.leave')}
      </h4>

      <form ref={formRef} onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}
        >
          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={labelStyle}>{t('comments.name')} *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={labelStyle}>
              {t('comments.email')}{' '}
              <span style={{ fontFamily: 'var(--font-dm-sans)', letterSpacing: 0, textTransform: 'none', fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 400 }}>
                — {t('comments.emailNote')}
              </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={inputStyle}
            />
          </div>

          {/* Message */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', gridColumn: '1 / -1' }}>
            <label style={labelStyle}>{t('comments.message')} *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={5}
              placeholder={t('comments.placeholder')}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          {/* Submit row */}
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.73rem',
                color: 'var(--muted)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {t('comments.privacy')}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {thanks && (
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.72rem',
                    color: '#2d6a4f',
                    letterSpacing: '0.04em',
                  }}
                >
                  ✓ {t('comments.thanks')}
                </span>
              )}
              {error && (
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.72rem',
                    color: '#c0392b',
                    letterSpacing: '0.04em',
                  }}
                >
                  {error}
                </span>
              )}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--navy-950)',
                  background: submitting ? 'rgba(200,169,110,0.5)' : 'var(--gold-500)',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '0.7rem 1.6rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s, transform 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {submitting ? t('comments.submitting') : t('comments.submit')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm-mono)',
  fontSize: '0.65rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--navy-900)',
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontSize: '0.9rem',
  color: 'var(--text)',
  background: 'var(--white, #fff)',
  border: '1px solid rgba(200,169,110,0.3)',
  borderRadius: '2px',
  padding: '0.6rem 0.8rem',
  outline: 'none',
  width: '100%',
}
