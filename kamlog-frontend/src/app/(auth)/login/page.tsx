'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api-client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn, getSession } from 'next-auth/react'
import { getRouteForRole } from '@/lib/role-routes'
import { useI18n } from '@/hooks/useI18n'
import { useSettings } from '@/components/layout/SettingsProvider'
import { ThemePreference } from '@/components/layout/SettingsProvider'

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
      await authAPI.login({ username: formData.email, password: formData.password })
      const result = await signIn('credentials', { email: formData.email, password: formData.password, redirect: false })
      if (result?.error) { setErrorMessage('Identifiants incorrects.'); setIsLoading(false); return }
      if (result?.ok) {
        const session = await getSession()
        const roles = (session?.user as any)?.roles || [(session?.user as any)?.role]
        router.push(getRouteForRole(roles)); router.refresh()
      }
    } catch { setErrorMessage('Une erreur est survenue. Réessayez.') }
    finally { setIsLoading(false) }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950" />
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Theme + Lang toggles */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} className="flex items-center gap-1 rounded border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-bold uppercase text-white/70 backdrop-blur transition hover:bg-white/20">
          <span className="material-symbols-outlined text-[14px]">language</span>{language}
        </button>
        <button onClick={cycleTheme} className="rounded border border-white/20 bg-white/10 p-1.5 text-white/70 backdrop-blur transition hover:bg-white/20">
          <span className="material-symbols-outlined text-[16px]">{uiTheme === 'light' ? 'light_mode' : uiTheme === 'dark' ? 'dark_mode' : 'settings_brightness'}</span>
        </button>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px] mx-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/40 mb-4">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">KAMLOG EM-ERP</h1>
          <p className="text-xs font-bold text-blue-300 uppercase tracking-[0.2em] mt-1">Operational Control Systems</p>
        </div>

        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 border border-white/20 dark:border-white/10 p-7">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t.auth.systemAuthenticationTitle}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t.auth.systemAuthenticationSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="email">{t.auth.emailInstitutionalLabel}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">alternate_email</span>
                <input {...register('email')} id="email" type="email" placeholder="user@kamlog.com"
                  className="w-full h-11 pl-9 pr-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="password">{t.auth.passwordLabel}</label>
                <Link href="/forgot-password" className="text-xs text-blue-500 hover:underline font-medium">{t.auth.forgotPassword}</Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">lock</span>
                <input {...register('password')} id="password" type="password" placeholder="••••••••••••"
                  className="w-full h-11 pl-9 pr-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input {...register('remember')} id="remember" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <label className="text-sm text-slate-600 dark:text-slate-300 select-none cursor-pointer" htmlFor="remember">{t.auth.rememberMeLabel}</label>
            </div>

            {errorMessage && !isLoading && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/40 rounded-lg text-red-700 dark:text-red-300 text-sm">
                <span className="material-symbols-outlined text-[16px] shrink-0">cancel</span>
                <span className="flex-1 text-xs">{errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage(null)}><span className="material-symbols-outlined text-[14px]">close</span></button>
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70">
              {isLoading ? (
                <><span className="material-symbols-outlined animate-spin text-[20px]">sync</span><span>{t.auth.loginVerifying}</span></>
              ) : (
                <><span>{t.auth.loginCta}</span><span className="material-symbols-outlined text-[20px]">login</span></>
              )}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              {t.auth.alreadyAccount}{' '}
              <Link href="/register" className="text-blue-500 font-semibold hover:underline">{t.auth.createAccount}</Link>
            </p>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <p className="text-xs">{t.auth.mfaSecuredLabel}</p>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <p className="text-xs">{t.auth.auditAccessLabel}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/30 mt-4">v4.8.2-stable · © 2026 KAMLOG LOGISTICS GROUP</p>
      </div>
    </div>
  )
}
