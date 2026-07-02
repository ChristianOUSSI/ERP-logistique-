'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirige vers la page de connexion après 3 secondes
    const timer = setTimeout(() => {
      router.push('/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface">
      <style jsx global>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(var(--primary-rgb, 17, 42, 70), 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(var(--primary-rgb, 17, 42, 70), 0); }
          100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(var(--primary-rgb, 17, 42, 70), 0); }
        }
        .logo-pulse {
          animation: pulse-ring 2s infinite;
        }
      `}</style>
      
      <div className="relative flex flex-col items-center animate-fade-in">
        {/* Logo or Icon */}
        <div className="w-24 h-24 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-lg logo-pulse mb-8 relative z-10">
          <span className="material-symbols-outlined text-5xl font-light">local_shipping</span>
        </div>
        
        <h1 className="text-display-md font-display-md text-on-surface mb-2 animate-slide-up">Bienvenue sur KAMLOG</h1>
        <p className="text-body-lg text-on-surface-variant font-body-lg text-center max-w-md animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          La plateforme d'entreprise premium pour la gestion logistique.
        </p>
        
        <div className="mt-12 flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-label-sm font-label-sm text-outline mt-4 tracking-widest uppercase">Chargement du système...</span>
        </div>
      </div>
    </div>
  )
}
