'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLang, useT, type Lang } from '@/lib/i18n'

const LangToggle = ({ lang, setLang, style }: { lang: Lang; setLang: (l: Lang) => void; style?: React.CSSProperties }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '3px',
      padding: '3px',
      gap: '2px',
      ...style,
    }}
  >
    {(['en', 'es'] as Lang[]).map((l) => (
      <button
        key={l}
        onClick={() => setLang(l)}
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '8px 12px',
          borderRadius: '2px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: lang === l ? 'var(--gold-500)' : 'transparent',
          color: lang === l ? 'white' : 'rgba(255,255,255,0.45)',
        }}
      >
        {l}
      </button>
    ))}
  </div>
)

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { lang, setLang } = useLang()
  const t = useT()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handle = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [])

  const navItems = [
    { href: '/trips', label: t('nav.trips') },
    { href: '/trips?type=sailing', label: t('nav.sailing') },
    { href: '/trips?type=camino', label: t('nav.caminos') },
    { href: '/map', label: t('nav.map') },
    { href: '/about', label: t('nav.about') },
  ]

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(7,14,23,0.97)' : 'rgba(7,14,23,1)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(200,169,110,0.15)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="header-inner">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Left: Language toggle (desktop only) + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {!isMobile && <LangToggle lang={lang} setLang={setLang} />}

            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Velas y Botas
                </span>
                {!isMobile && (
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: '0.65rem',
                      fontWeight: 400,
                      color: 'var(--gold-500)',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Ricardo Perez · Travels
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="nav-link"
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'color 0.2s',
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
              aria-label="Toggle menu"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      display: 'block',
                      width: '22px',
                      height: '1.5px',
                      background: 'white',
                      transition: 'all 0.3s',
                      transformOrigin: 'center',
                      transform:
                        menuOpen && i === 0 ? 'rotate(45deg) translate(4px, 4px)'
                        : menuOpen && i === 1 ? 'scaleX(0)'
                        : menuOpen && i === 2 ? 'rotate(-45deg) translate(4px, -4px)'
                        : 'none',
                    }}
                  />
                ))}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <div style={{ background: 'var(--navy-950)', borderTop: '1px solid rgba(200,169,110,0.15)', padding: '1.5rem 2rem' }}>
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '1rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {label}
            </Link>
          ))}
          <div style={{ paddingTop: '1.25rem' }}>
            <LangToggle lang={lang} setLang={(l) => { setLang(l); setMenuOpen(false) }} />
          </div>
        </div>
      )}
    </header>
  )
}
