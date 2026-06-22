// src/app/(auth)/login/page.tsx
// 100% fidèle à ERP/login_kamlog_erp/code.html
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { RoleBadges } from '@/components/auth/RoleBadges'

// ── Schéma Zod ─────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email obligatoire')
    .email('Format email invalide'),
  password: z
    .string()
    .min(1, 'Mot de passe obligatoire')
    .min(6, 'Minimum 6 caractères'),
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
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  // ── Micro-interactions fidèles au HTML original ─────────
  useEffect(() => {
    const inputs = document.querySelectorAll<HTMLInputElement>('input[type="email"], input[type="password"]')
    inputs.forEach((input) => {
      const handleFocus = () => {
        const label = input.parentElement?.parentElement?.querySelector('label') as HTMLElement | null
        if (label) label.style.color = '#3B82F6'
      }
      const handleBlur = () => {
        const label = input.parentElement?.parentElement?.querySelector('label') as HTMLElement | null
        if (label) label.style.color = ''
      }
      input.addEventListener('focus', handleFocus)
      input.addEventListener('blur', handleBlur)
      return () => {
        input.removeEventListener('focus', handleFocus)
        input.removeEventListener('blur', handleBlur)
      }
    })
  }, [])

  // ── Soumission ────────────────────────────────────────────
  const onSubmit = async (formData: LoginFormData) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })
      if (result?.error) {
        setErrorMessage('Identifiants incorrects. Veuillez réessayer.')
        setIsLoading(false)
        return
      }
      if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setErrorMessage('Une erreur est survenue. Réessayez.')
      setIsLoading(false)
    }
  }

  const handleRoleSelect = (email: string, password: string) => {
    setValue('email', email)
    setValue('password', password)
    setErrorMessage(null)
  }

  // ── Rendu — fidèle pixel-perfect au code.html ─────────────
  return (
    // body équivalent exact : bg-surface-container-low min-h-screen flex items-center justify-center overflow-y-auto relative
    <div
      className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex flex-col items-center justify-center overflow-y-auto relative py-12"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0">
        {/* Gradient identique au HTML original */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low via-white to-surface-container-highest" />
        {/* Texture overlay */}
        <div className="absolute inset-0 logistics-overlay" />
        {/* Image fond port — opacity-10 comme dans le design */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3F047r3gYJ87S3A35ak4dIOIGqHlksQbCPpUlVQ9vzeVWDfPBYIsS1-J0MTQ9hZvKJAmbrnAYlmm3-ppAXOhAndHlGzivtl9VPHTj8VML1Wbf7MIAshXa5PCgYR8-lLGVUBSlC9vdyEDdCz62_JQU91TuJVRfwE8oKBOJkHTLfyCcTYJhzzqwJoSOseWKiawHRC8myzlInZFL1fwnsC2PjL2ayMm-MVJ3iAiIHWL6f6uK8IZa0Wp1uebXZ6G0B5GfrtQB6X6Qkic"
            alt="Terminal portuaire KAMLOG"
          />
        </div>
      </div>

      {/* ── Main Content Container — max-w-md px-md comme le HTML ── */}
      <main className="relative z-10 w-full max-w-md px-md">

        {/* ── Header / Branding — mb-xl ── */}
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center p-xs bg-white rounded-lg shadow-sm border border-outline-variant mb-md">
            <span
              className="material-symbols-outlined text-auth-blue text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              precision_manufacturing
            </span>
          </div>
          <h1 className="text-headline-sm font-headline-sm text-primary tracking-tight">
            KAMLOG EM-ERP
          </h1>
          <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest mt-xxs">
            Operational Control Systems
          </p>
        </div>

        {/* ── Login Card — bg-white border rounded-lg p-lg ── */}
        <div className="bg-white border border-outline-variant rounded-lg p-lg auth-card">
          <div className="mb-lg">
            <h2 className="text-title-lg font-title-lg text-on-surface mb-xxs">
              System Authentication
            </h2>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Please enter your credentials to access the terminal.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">

            {/* Email Field */}
            <div className="space-y-xs">
              <label className="text-label-md font-label-md text-on-surface-variant" htmlFor="email">
                Institutional Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  alternate_email
                </span>
                <input
                  {...register('email')}
                  className="w-full pl-10 pr-md py-sm bg-surface rounded border border-outline-variant text-body-md focus-ring transition-all placeholder:text-outline"
                  id="email"
                  placeholder="user@kamlog.com"
                  type="email"
                />
              </div>
              {errors.email && (
                <p className="text-error text-label-sm mt-xxs">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-xs">
              <div className="flex justify-between items-center">
                <label className="text-label-md font-label-md text-on-surface-variant" htmlFor="password">
                  Security Key
                </label>
                <a className="text-label-md font-label-md text-auth-blue hover:underline" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  lock
                </span>
                <input
                  {...register('password')}
                  className="w-full pl-10 pr-md py-sm bg-surface rounded border border-outline-variant text-body-md focus-ring transition-all"
                  id="password"
                  placeholder="••••••••••••"
                  type="password"
                />
              </div>
              {errors.password && (
                <p className="text-error text-label-sm mt-xxs">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-xs py-xxs">
              <input
                {...register('remember')}
                className="w-4 h-4 rounded border-outline-variant text-auth-blue focus:ring-auth-blue"
                id="remember"
                type="checkbox"
              />
              <label
                className="text-body-sm font-body-sm text-on-surface-variant select-none cursor-pointer"
                htmlFor="remember"
              >
                Remember session for 12 hours
              </label>
            </div>

            {/* CTA Button */}
            <button
              className="w-full py-sm px-md bg-auth-blue text-white font-title-md text-title-md rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-xs shadow-md"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Initialize Access</span>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {errorMessage && !isLoading && (
            <div className="mt-md flex items-center gap-xs p-sm bg-error-container border border-error rounded-lg text-on-error-container text-body-sm">
              <span className="material-symbols-outlined text-[16px]">cancel</span>
              <span className="flex-1">{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-on-error-container hover:text-error"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          )}

          {/* Footer Info — mt-xl pt-lg border-t */}
          <div className="mt-xl pt-lg border-t border-outline-variant">
            <div className="flex flex-col gap-sm">
              <div className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-outline text-[18px]">verified_user</span>
                <p className="text-label-sm font-label-sm">Secured by EM-ERP Multi-Factor Authentication</p>
              </div>
              <div className="flex items-center gap-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-outline text-[18px]">gavel</span>
                <p className="text-label-sm font-label-sm leading-tight">
                  Access monitored by Audit Module. Authorized personnel only.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── System Footer — mt-lg ── */}
        <div className="mt-lg flex flex-col items-center gap-xs">
          <p className="text-label-sm font-label-sm text-outline">
            v4.8.2-stable | © 2026 KAMLOG LOGISTICS GROUP
          </p>
          <div className="flex gap-md">
            <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-auth-blue" href="#">Network Status</a>
            <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-auth-blue" href="#">Legal</a>
            <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-auth-blue" href="#">Support</a>
          </div>
        </div>

        {/* ── RoleBadges (dev helper) — dans le flux, après le footer ── */}
        <div className="mt-8 pb-0 flex justify-center w-full">
          <RoleBadges onRoleSelect={handleRoleSelect} />
        </div>

      </main>

      {/* ── Floating Decorative Elements — hidden xl:block opacity-20 ── */}
      <div className="absolute bottom-10 left-10 hidden xl:block opacity-20 transform -rotate-6">
        <div className="bg-white p-md rounded border border-outline-variant flex gap-sm items-center">
          <span className="material-symbols-outlined text-auth-blue text-3xl">local_shipping</span>
          <div>
            <p className="text-label-sm font-label-sm uppercase font-bold text-outline">Active Fleet</p>
            <p className="text-headline-sm font-headline-sm text-primary">1,284</p>
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-10 hidden xl:block opacity-20 transform rotate-3">
        <div className="bg-white p-md rounded border border-outline-variant flex gap-sm items-center">
          <span className="material-symbols-outlined text-auth-blue text-3xl">inventory_2</span>
          <div>
            <p className="text-label-sm font-label-sm uppercase font-bold text-outline">Parc Capacity</p>
            <p className="text-headline-sm font-headline-sm text-primary">94.2%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
