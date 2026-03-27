import React from 'react'

/**
 * Renders a string with inline markdown: **bold**, *italic*, `code`
 */
export function renderInline(text: string): React.ReactNode[] {
  // Split on **bold**, *italic*, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 600, color: '#0d1b2a' }}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.875em', background: '#f5f5f5', padding: '1px 5px', borderRadius: '2px' }}>{part.slice(1, -1)}</code>
    }
    return part
  })
}
