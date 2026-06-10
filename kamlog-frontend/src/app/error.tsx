'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        {/* Illustration erreur */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="text-[120px] font-bold text-red-500 opacity-20">
              500
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Erreur serveur
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Une erreur inattendue s'est produite. Nos équipes ont été notifiées.
          </p>
          {error.message && (
            <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg">
              {error.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-[#06b6d4] hover:bg-[#0891b2] text-white"
            onClick={reset}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
          
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        {/* Aide */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Le problème persiste ?{' '}
            <a href="mailto:support@kamlog.cm" className="text-[#06b6d4] hover:underline">
              Contactez le support
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-400">
          <p>© 2026 CADC - KAMLOG EM-ERP • Confidentiel</p>
        </div>
      </div>
    </div>
  )
}
