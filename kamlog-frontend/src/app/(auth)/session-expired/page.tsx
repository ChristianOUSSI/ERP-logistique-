// src/app/(auth)/session-expired/page.tsx
// Page standalone  PAS dans le layout split (fond sombre centré)
import Link from 'next/link'
import { AlertTriangle, Info } from 'lucide-react'

export default function SessionExpiredPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Card centrale blanche */}
      <div className="bg-white rounded-2xl shadow-2xl p-12 
                      w-full max-w-md text-center">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#06b6d4] 
                          flex items-center justify-center 
                          text-white font-bold text-sm">
            K
          </div>
          <span className="font-bold text-[#1e293b]">KAMLOG EM-ERP</span>
        </div>

        {/* Icône warning */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-orange-100 
                          flex items-center justify-center">
            <AlertTriangle size={36} className="text-orange-500" />
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-[#1e293b] text-2xl font-bold mb-3">
          Session expirée
        </h1>
        <p className="text-[#64748b] text-sm leading-relaxed mb-6">
          Votre session a expiré pour des raisons de sécurité. 
          Veuillez vous reconnecter pour continuer.
        </p>

        {/* Info box */}
        <div className="flex items-start gap-3 p-4 rounded-lg 
                        bg-blue-50 border border-blue-200 
                        text-left mb-8">
          <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-blue-700 text-xs leading-relaxed">
            Vos données non sauvegardées ont été perdues. 
            Reconnectez-vous pour reprendre votre travail.
          </p>
        </div>

        {/* Bouton principal */}
        <Link
          href="/login"
          className="w-full h-11 rounded-lg bg-[#06b6d4] 
                     text-white font-medium text-sm 
                     flex items-center justify-center
                     hover:bg-[#0891b2] transition-colors mb-4"
        >
          Se reconnecter
        </Link>

        {/* Lien secondaire */}
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-[#64748b] 
                     transition-colors"
        >
          Retour à l'accueil
        </Link>

      </div>
    </div>
  )
}