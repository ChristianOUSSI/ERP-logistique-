'use client'

import { Button } from '@/components/ui/button'
import { Home, RefreshCw, ShieldX } from 'lucide-react'
import Link from 'next/link'

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        {/* Illustration 403 */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="text-[120px] font-bold text-orange-500 opacity-20">
              403
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldX className="w-16 h-16 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Accès refusé
          </h1>
          <p className="text-gray-600 text-lg">
            Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/dashboard">
            <Button className="w-full bg-[#06b6d4] hover:bg-[#0891b2] text-white">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.history.back()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Page précédente
          </Button>
        </div>

        {/* Aide */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Besoin d'aide ?{' '}
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
