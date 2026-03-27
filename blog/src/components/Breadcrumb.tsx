import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem' }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {i > 0 && (
              <span
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--gold-500)',
                  opacity: 0.5,
                  margin: '0 0.25rem',
                  fontSize: '0.8rem',
                }}
              >
                —
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s',
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--navy-900)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {item.label}
              </span>
            )}
          </span>
        ))}
      </div>
    </nav>
  )
}
