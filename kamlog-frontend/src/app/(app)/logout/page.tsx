'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/layout/AuthProvider'

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [isLoggedOut, setIsLoggedOut] = useState(false)

  useEffect(() => {
    // Perform logout on mount
    const performLogout = async () => {
      try {
        await logout()
      } catch (error) {
        console.error("Logout error", error)
      } finally {
        setIsLoggedOut(true)
      }
    }
    
    performLogout()
  }, [logout])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl text-center flex flex-col items-center">
          
          <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-6 ring-4 ring-blue-500/10">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Déconnexion réussie</h1>
          
          <p className="text-slate-400 mb-8 font-medium">
            <span className="text-blue-400 font-semibold">Code Axis Digital Cameroun</span> vous remercie de votre visite sur la plateforme KAMLOG EM-ERP.
          </p>

          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={() => router.push('/login')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              Retour à la connexion
            </button>
            
            <button 
              onClick={() => router.push('/register')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-700/50 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-600 transition-all hover:border-slate-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Créer un nouveau compte
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} KAMLOG EM-ERP. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}
