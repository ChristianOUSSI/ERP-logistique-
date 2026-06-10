'use client'

import { Button } from '@/components/ui/button'
import { Home, RefreshCw, Search } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        {/* Illustration 404 */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="text-[120px] font-bold text-[#06b6d4] opacity-20">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 text-[#06b6d4]" />
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Page non trouvée
          </h1>
          <p className="text-gray-600 text-lg">
            La page que vous recherchez n'existe pas ou a été déplacée.
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
