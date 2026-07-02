// src/app/(auth)/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api-client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn, getSession } from 'next-auth/react'
import { getRouteForRole } from '@/lib/role-routes'

const loginSchema = z.object({
  email: z.string().min(1, 'Email obligatoire').email('Format email invalide'),
  password: z.string().min(1, 'Mot de passe obligatoire').min(6, 'Minimum 6 caractères'),
  remember: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const onSubmit = async (formData: LoginFormData) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      await authAPI.login({ username: formData.email, password: formData.password })
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })
      if (result?.error) {
        setErrorMessage(result.error === 'CredentialsSignin' ? 'Identifiants incorrects.' : result.error)
        setIsLoading(false)
        return
      }
      if (result?.ok) {
        const session = await getSession()
        const roles = (session?.user as any)?.roles || [(session?.user as any)?.role]
        router.push(getRouteForRole(roles))
        router.refresh()
        return
      }
    } catch {
      setErrorMessage('Une erreur est survenue. Réessayez.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // Fixe l'écran — aucun scroll possible sur body
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* ── Fond: gradient + image overlay ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950" />
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3F047r3gYJ87S3A35ak4dIOIGqHlksQbCPpUlVQ9vzeVWDfPBYIsS1-J0MTQ9hZvKJAmbrnAYlmm3-ppAXOhAndHlGzivtl9VPHTj8VML1Wbf7MIAshXa5PCgYR8-lLGVUBSlC9vdyEDdCz62_JQU91TuJVRfwE8oKBOJkHTLfyCcTYJhzzqwJoSOseWKiawHRC8myzlInZFL1fwnsC2PjL2ayMm-MVJ3iAiIHWL6f6uK8IZa0Wp1uebXZ6G0B5GfrtQB6X6Qkic')`
          }}
        />
        {/* Grille décorative fine — pas de fond blanc */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* ── Éléments flottants décoratifs ── */}
      <div className="absolute bottom-8 left-8 hidden xl:flex opacity-25 -rotate-3 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 flex gap-3 items-center">
          <span className="material-symbols-outlined text-blue-300 text-2xl">local_shipping</span>
          <div>
            <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Flotte Active</p>
            <p className="text-xl font-black text-white">1,284</p>
          </div>
        </div>
      </div>
      <div className="absolute top-16 right-8 hidden xl:flex opacity-25 rotate-2 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 flex gap-3 items-center">
          <span className="material-symbols-outlined text-blue-300 text-2xl">inventory_2</span>
          <div>
            <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Parc Capacity</p>
            <p className="text-xl font-black text-white">94.2%</p>
          </div>
        </div>
      </div>

      {/* ── Carte de connexion centrée ── */}
      <div className="relative z-10 w-full max-w-[420px] mx-4">

        {/* Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/40 mb-4">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              precision_manufacturing
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">KAMLOG EM-ERP</h1>
          <p className="text-xs font-bold text-blue-300 uppercase tracking-[0.2em] mt-1">Operational Control Systems</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 border border-white/20 p-7">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800">System Authentication</h2>
            <p className="text-sm text-slate-500 mt-0.5">Entrez vos identifiants pour accéder au terminal.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="email">
                Email Institutionnel
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  alternate_email
                </span>
                <input
                  {...register('email')}
                  className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  id="email"
                  placeholder="user@kamlog.com"
                  type="email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="password">
                  Mot de passe
                </label>
                <a className="text-xs text-blue-600 hover:underline font-medium" href="#">Mot de passe oublié?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  lock
                </span>
                <input
                  {...register('password')}
                  className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  id="password"
                  placeholder="••••••••••••"
                  type="password"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input
                {...register('remember')}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                id="remember"
                type="checkbox"
              />
              <label className="text-sm text-slate-600 select-none cursor-pointer" htmlFor="remember">
                Rester connecté 12 heures
              </label>
            </div>

            {/* Error */}
            {errorMessage && !isLoading && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <span className="material-symbols-outlined text-[16px] shrink-0">cancel</span>
                <span className="flex-1 text-xs">{errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage(null)}>
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            )}

            {/* CTA */}
            <button
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-500">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                Créer un compte
              </Link>
            </p>
          </form>

          {/* Footer sécurité */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <p className="text-xs">Sécurisé par EM-ERP Multi-Factor Authentication</p>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <p className="text-xs">Accès surveillé par le Module Audit. Personnel autorisé uniquement.</p>
            </div>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-white/30 mt-4">v4.8.2-stable · © 2026 KAMLOG LOGISTICS GROUP</p>
      </div>
    </div>
  )
}
