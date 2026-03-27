import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { LangProvider } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Velas y Botas',
  description: 'Ricardo Perez — sailing blue water, walking Caminos, living well.',
  openGraph: {
    title: 'Velas y Botas',
    description: 'Ricardo Perez — sailing blue water, walking Caminos, living well.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <LangProvider>
          <Header />
          <main style={{ paddingTop: '64px' }}>{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  )
}
