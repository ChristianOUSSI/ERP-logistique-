'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Simulate logout - will be connected to backend
    setTimeout(() => {
      router.push('/auth/login')
    }, 1000)
  }, [router])

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-body-md text-on-surface-variant">Déconnexion en cours...</p>
      </div>
    </div>
  )
}
