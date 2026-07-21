'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn, getSession } from 'next-auth/react'
import { getRouteForRole } from '@/lib/role-routes'
import { useI18n } from '@/hooks/useI18n'
import { useSettings, ThemePreference } from '@/components/layout/SettingsProvider'
import { Sparkles, Ship, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(6),
  remember: z.boolean().optional(),
})
type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const t = useI18n()
  const { theme: uiTheme, setTheme, language, setLanguage } = useSettings()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const cycleTheme = () => {
    const themes: ThemePreference[] = ['light', 'dark', 'system']
    setTheme(themes[(themes.indexOf(uiTheme) + 1) % themes.length])
  }

  const onSubmit = async (formData: LoginFormData) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (res?.error) {
        setErrorMessage(t.auth.invalidCredentials)
        return
      }

      const session = await getSession()
      const roles = (session?.user as any)?.roles || []

      if (roles.includes('CHAUFFEUR')) {
        router.push('/chauffeur')
      } else {
        router.push(getRouteForRole(roles))
        router.refresh()
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.detail || 'Une erreur est survenue. Réessayez.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950 text-white font-sans select-none overflow-hidden">
      {/* Background Layer with Cargo Ship Port Wallpaper */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/cargo_ship_port_bg.png"
          alt="Cargo Ship Port Background"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 border-none"
        />
        {/* Deep Gradient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/60 backdrop-blur-[2px]" />
      </div>

      {/* Top Navbar Bar Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-slate-900/80 px-3 py-1.5 text-xs font-bold uppercase text-amber-300 backdrop-blur-md transition hover:bg-slate-800 cursor-pointer shadow-lg"
        >
          🌐 {language}
        </button>
        <button
          onClick={cycleTheme}
          className="rounded-xl border border-amber-500/30 bg-slate-900/80 p-2 text-amber-300 backdrop-blur-md transition hover:bg-slate-800 cursor-pointer shadow-lg"
        >
          {uiTheme === 'light' ? '☀️' : uiTheme === 'dark' ? '🌙' : '💻'}
        </button>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[440px] mx-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-6">
          {/* Logo Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 rounded-2xl shadow-xl shadow-amber-500/20 mb-3 border border-amber-300/40">
            <Ship className="w-8 h-8 text-slate-950" />
          </div>

          <div className="inline-block">
            <span className="text-xs font-black tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-1 inline-block">
              CADC • Code Axis Digital Cameroun
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight">KAMLOG EM-ERP</h1>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
            Système d'Accès Sécurisé Logistique & Portuaire
          </p>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/80 border border-slate-800 p-8 text-white">
          <div className="mb-6 pb-4 border-b border-slate-800/80">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Authentification Institutionnelle
            </h2>
            <p className="text-xs text-slate-400 mt-1">Saisissez vos identifiants d'entreprise certifiés.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2" htmlFor="email">
                Adresse Email Institutionnelle
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="agent@kamlog.cm"
                  className="w-full h-12 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider" htmlFor="password">
                  Mot de Passe
                </label>
                <Link href="/reset-password" className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 select-none cursor-pointer">
                <input
                  {...register('remember')}
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                />
                Mémoriser la session
              </label>

              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> MFA Activé
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs font-semibold animate-in fade-in duration-200">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                'Connexion en cours...'
              ) : (
                <>
                  Se Connecter à l'ERP <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 font-mono mt-6">
          © 2026 Code Axis Digital Cameroun (CADC) • All rights reserved
        </p>
      </div>
    </div>
  )
}
