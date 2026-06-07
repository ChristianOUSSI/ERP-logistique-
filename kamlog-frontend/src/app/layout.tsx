// src/app/layout.tsx  RootLayout KAMLOG
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '../components/shared/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KAMLOG EM-ERP',
  description: 'Système de Gestion Logistique Intégré  Port de Douala',
  icons: { icon: '/logo-kamlog.svg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}