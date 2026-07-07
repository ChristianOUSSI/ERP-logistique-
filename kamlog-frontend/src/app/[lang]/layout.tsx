import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '../globals.css'
import Providers from '@/components/shared/Providers'
import { DICTIONARIES, type AppLanguage } from '@/i18n/dictionary'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }]
}

export function generateMetadata({ params }: { params: { lang: AppLanguage } }): Metadata {
  const lang = params.lang
  return {
    title: 'KAMLOG EM-ERP',
    description:
      DICTIONARIES[lang]?.home?.welcomeSubtitle ??
      'Système de Gestion Logistique Intégré  Port de Douala',
    icons: { icon: '/logo-kamlog.svg' },
  }
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: AppLanguage }
}) {
  const lang = params.lang

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

