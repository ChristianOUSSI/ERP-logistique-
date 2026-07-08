'use client'

import Link from 'next/link'
import { useI18n } from '@/hooks/useI18n'
import { Construction, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const t = useI18n()
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative px-4 overflow-hidden">
      {/* Decorative blurred background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0 pointer-events-none" />
      
      <div className="bg-surface border border-outline w-full max-w-md rounded-2xl shadow-2xl p-6 z-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Construction className="w-8 h-8 text-primary animate-pulse" />
        </div>
        
        <h2 className="text-xl font-bold text-on-surface mb-2">
          {t.errors.notFoundTitle || 'Page Introuvable'}
        </h2>
        
        <p className="text-on-surface-variant text-sm mb-6">
          La page que vous recherchez n'existe pas ou est actuellement en cours d'intégration dans le cadre d'un nouveau module. 
        </p>
        
        <div className="w-full space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Home className="w-5 h-5" />
            {t.errors.backToHome || 'Retour au tableau de bord'}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-outline text-on-surface font-bold text-sm hover:bg-surface-container transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.errors.previousPage || 'Page précédente'}
          </button>
        </div>
        
        <p className="mt-8 text-xs text-on-surface-variant/50">
          {t.errors.help || "Besoin d'aide ?"} <a href="mailto:support@kamlog.cm" className="text-primary hover:underline">support@kamlog.cm</a>
        </p>
      </div>
    </div>
  )
}
