'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Lang = 'en' | 'es'

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved === 'en' || saved === 'es') setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

/** Returns the right string based on current language, falling back to English */
export function useLocalized(en: string, es?: string): string {
  const { lang } = useLang()
  return lang === 'es' && es ? es : en
}

// ─── UI Translations ────────────────────────────────────────────────────────

type UIKey =
  | 'nav.trips' | 'nav.sailing' | 'nav.caminos' | 'nav.map' | 'nav.about'
  | 'home.latest' | 'home.readLog' | 'home.allTrips' | 'home.everyVoyage' | 'home.theLog'
  | 'home.retired' | 'home.adventureStarted' | 'home.aboutRicardo'
  | 'trips.theLog' | 'trips.everyVoyage' | 'trips.filter.all' | 'trips.filter.sailing'
  | 'trips.filter.camino' | 'trips.filter.pilgrimage' | 'trips.filter.travel'
  | 'trips.nothing' | 'trips.viewAll'
  | 'trip.legs' | 'trip.start' | 'trip.end' | 'trip.type' | 'trip.legsCount'
  | 'trip.upcoming' | 'trip.emptyLog' | 'trip.readLog'
  | 'leg.logEntries' | 'leg.departed' | 'leg.arrived' | 'leg.entries'
  | 'leg.prevLeg' | 'leg.nextLeg' | 'leg.emptyLog' | 'leg.readEntry'
  | 'entry.backToLeg' | 'entry.prevEntry' | 'entry.nextEntry'
  | 'map.theChart' | 'map.whereArtemisa' | 'map.allRoutes'
  | 'about.retired' | 'about.tagline'
  | 'footer.tagline' | 'footer.navigate' | 'footer.allTrips'
  | 'type.sailing' | 'type.camino' | 'type.pilgrimage' | 'type.travel'
  | 'comments.title' | 'comments.noComments' | 'comments.leave'
  | 'comments.name' | 'comments.email' | 'comments.emailNote'
  | 'comments.message' | 'comments.placeholder' | 'comments.submit'
  | 'comments.submitting' | 'comments.thanks' | 'comments.privacy'
  | 'comments.count'

const ui: Record<UIKey, { en: string; es: string }> = {
  'nav.trips':             { en: 'Trips',       es: 'Viajes' },
  'nav.sailing':           { en: 'Sailing',     es: 'Vela' },
  'nav.caminos':           { en: 'Caminos',     es: 'Caminos' },
  'nav.map':               { en: 'Map',         es: 'Mapa' },
  'nav.about':             { en: 'About',       es: 'Quién soy' },

  'home.latest':           { en: 'Latest entry',         es: 'Última entrada' },
  'home.readLog':          { en: 'Read the log',         es: 'Leer el diario' },
  'home.allTrips':         { en: 'All trips',            es: 'Todos los viajes' },
  'home.everyVoyage':      { en: 'Every voyage, every Camino', es: 'Cada travesía, cada Camino' },
  'home.theLog':           { en: 'The log',              es: 'El diario' },
  'home.retired':          { en: 'Retired in May 2025.', es: 'Jubilado en mayo de 2025.' },
  'home.adventureStarted': { en: 'The adventure started immediately.', es: 'La aventura empezó de inmediato.' },
  'home.aboutRicardo':     { en: 'About Ricardo',        es: 'Sobre Ricardo' },

  'trips.theLog':          { en: 'The log',              es: 'El diario' },
  'trips.everyVoyage':     { en: 'Every voyage,',        es: 'Cada travesía,' },
  'trips.filter.all':      { en: 'All',                  es: 'Todos' },
  'trips.filter.sailing':  { en: 'Sailing',              es: 'Vela' },
  'trips.filter.camino':   { en: 'Camino',               es: 'Camino' },
  'trips.filter.pilgrimage':{ en: 'Pilgrimage',          es: 'Romería' },
  'trips.filter.travel':   { en: 'Travel',               es: 'Viaje' },
  'trips.nothing':         { en: 'Nothing here yet. The horizon is still ahead.', es: 'Nada aquí todavía. El horizonte sigue adelante.' },
  'trips.viewAll':         { en: 'View all →',           es: 'Ver todos →' },

  'trip.legs':             { en: 'The legs',             es: 'Las etapas' },
  'trip.start':            { en: 'Start',                es: 'Salida' },
  'trip.end':              { en: 'End',                  es: 'Llegada' },
  'trip.type':             { en: 'Type',                 es: 'Tipo' },
  'trip.legsCount':        { en: 'Legs',                 es: 'Etapas' },
  'trip.upcoming':         { en: 'Upcoming',             es: 'Próximo' },
  'trip.emptyLog':         { en: "The log is empty. This voyage hasn't started yet.", es: 'El diario está vacío. Este viaje aún no ha comenzado.' },
  'trip.readLog':          { en: 'Read the log',         es: 'Leer el diario' },

  'leg.logEntries':        { en: 'Log entries',          es: 'Entradas del diario' },
  'leg.departed':          { en: 'Departed',             es: 'Salida' },
  'leg.arrived':           { en: 'Arrived',              es: 'Llegada' },
  'leg.entries':           { en: 'Entries',              es: 'Entradas' },
  'leg.prevLeg':           { en: '← Previous leg',      es: '← Etapa anterior' },
  'leg.nextLeg':           { en: 'Next leg →',           es: 'Etapa siguiente →' },
  'leg.emptyLog':          { en: 'Log entries coming soon.', es: 'Entradas del diario próximamente.' },
  'leg.readEntry':         { en: 'Read entry →',            es: 'Leer entrada →' },

  'entry.backToLeg':       { en: '← Back to log',           es: '← Volver al diario' },
  'entry.prevEntry':       { en: '← Previous entry',        es: '← Entrada anterior' },
  'entry.nextEntry':       { en: 'Next entry →',            es: 'Siguiente entrada →' },

  'map.theChart':          { en: 'The chart',            es: 'La carta náutica' },
  'map.whereArtemisa':     { en: "Where Artemisa has been.\nWhere we are going.", es: "Donde ha estado Artemisa.\nAdónde vamos." },
  'map.allRoutes':         { en: 'Every route sailed, every Camino walked.', es: 'Cada ruta navegada, cada Camino caminado.' },

  'about.retired':         { en: 'Retired. Spanish. Perpetually underway.', es: 'Jubilado. Español. Perpetuamente en ruta.' },
  'about.tagline':         { en: 'Ricardo Perez',        es: 'Ricardo Pérez' },

  'footer.tagline':        { en: 'The wake left behind, and the wandering ahead.', es: 'La estela que dejamos, y la erranza que nos espera.' },
  'footer.navigate':       { en: 'Navigate',             es: 'Navegar' },
  'footer.allTrips':       { en: 'All Trips',            es: 'Todos los viajes' },

  'type.sailing':          { en: 'Sailing',              es: 'Vela' },
  'type.camino':           { en: 'Camino',               es: 'Camino' },
  'type.pilgrimage':       { en: 'Pilgrimage',           es: 'Romería' },
  'type.travel':           { en: 'Travel',               es: 'Viaje' },

  'comments.title':        { en: 'Comments',             es: 'Comentarios' },
  'comments.count':        { en: 'comment',              es: 'comentario' },
  'comments.noComments':   { en: 'Be the first to comment.', es: 'Sé el primero en comentar.' },
  'comments.leave':        { en: 'Leave a comment',      es: 'Deja un comentario' },
  'comments.name':         { en: 'Name',                 es: 'Nombre' },
  'comments.email':        { en: 'Email',                es: 'Email' },
  'comments.emailNote':    { en: 'optional — for your avatar only, never shown', es: 'opcional — solo para tu avatar, nunca se muestra' },
  'comments.message':      { en: 'Comment',              es: 'Comentario' },
  'comments.placeholder':  { en: 'Share your thoughts…', es: 'Comparte tus ideas…' },
  'comments.submit':       { en: 'Post Comment',         es: 'Publicar' },
  'comments.submitting':   { en: 'Posting…',             es: 'Publicando…' },
  'comments.thanks':       { en: 'Comment posted — thank you!', es: '¡Comentario publicado — gracias!' },
  'comments.privacy':      { en: 'No account needed. Email, if provided, is only used for your avatar.', es: 'Sin cuenta necesaria. El email, si lo proporcionas, solo se usa para tu avatar.' },
}

export function useT() {
  const { lang } = useLang()
  return (key: UIKey) => ui[key][lang]
}
