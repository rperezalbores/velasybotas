'use client'

import { useLang } from './i18n'
import type { Trip, Leg, Entry } from '@/types'

export function useLocalizedEntry(entry: Entry) {
  const { lang } = useLang()
  return {
    ...entry,
    title:   lang === 'es' && entry.titleEs   ? entry.titleEs   : entry.title,
    excerpt: lang === 'es' && entry.excerptEs ? entry.excerptEs : entry.excerpt,
    content: lang === 'es' && entry.contentEs ? entry.contentEs : entry.content,
  }
}

export function useLocalizedLeg(leg: Leg) {
  const { lang } = useLang()
  return {
    ...leg,
    title:   lang === 'es' && leg.titleEs   ? leg.titleEs   : leg.title,
    summary: lang === 'es' && leg.summaryEs ? leg.summaryEs : leg.summary,
  }
}

export function useLocalizedTrip(trip: Trip) {
  const { lang } = useLang()
  return {
    ...trip,
    title:    lang === 'es' && trip.titleEs    ? trip.titleEs    : trip.title,
    subtitle: lang === 'es' && trip.subtitleEs ? trip.subtitleEs : trip.subtitle,
    summary:  lang === 'es' && trip.summaryEs  ? trip.summaryEs  : trip.summary,
  }
}
