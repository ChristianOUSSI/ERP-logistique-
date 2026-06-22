// src/app/(auth)/forgot-password/page.tsx
// Design: carte centrée sur fond ERP (identique au style login)
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, 'Email obligatoire')
    .email('Format email invalide'),
})

type ForgotFormData = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true)
    try {
      await apiClient.post('/api/auth/forgot-password', {
        email: data.email,
      })
      setSubmittedEmail(data.email)
      setIsSuccess(true)
    } catch {
      // Toujours afficher le succès (ne pas révéler si l'email existe)
      setSubmittedEmail(data.email)
      setIsSuccess(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex flex-col items-center justify-center overflow-y-auto relative py-12"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low via-white to-surface-container-highest" />
        <div className="absolute inset-0 logistics-overlay" />
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3F047r3gYJ87S3A35ak4dIOIGqHlksQbCPpUlVQ9vzeVWDfPBYIsS1-J0MTQ9hZvKJAmbrnAYlmm3-ppAXOhAndHlGzivtl9VPHTj8VML1Wbf7MIAshXa5PCgYR8-lLGVUBSlC9vdyEDdCz62_JQU91TuJVRfwE8oKBOJkHTLfyCcTYJhzzqwJoSOseWKiawHRC8myzlInZFL1fwnsC2PjL2ayMm-MVJ3iAiIHWL6f6uK8IZa0Wp1uebXZ6G0B5GfrtQB6X6Qkic"
            alt="Terminal portuaire KAMLOG"
          />
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="relative z-10 w-full max-w-md px-md">

        {/* ── Header / Branding ── */}
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

        {/* ── Card ── */}
        <div className="bg-white border border-outline-variant rounded-lg p-lg auth-card">

          {isSuccess ? (
            /* ── État succès ── */
            <div className="text-center">
              <div className="flex justify-center mb-lg">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
              </div>

              <h2 className="text-title-lg font-title-lg text-on-surface mb-xs">
                Email envoyé !
              </h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-xxs">
                Un lien de réinitialisation a été envoyé à
              </p>
              <p className="text-body-md font-title-md text-on-surface mb-lg">
                {submittedEmail}
              </p>

              <div className="flex items-center gap-xs p-sm bg-surface-container rounded border border-outline-variant/30 mb-lg text-left">
                <span className="material-symbols-outlined text-outline text-[18px] shrink-0">info</span>
                <p className="text-label-sm font-label-sm text-on-surface-variant leading-tight">
                  Vérifiez aussi vos spams. Le lien expire dans 30 minutes.
                </p>
              </div>

              <Link
                href="/login"
                className="w-full py-sm px-md bg-primary text-on-primary font-title-md text-title-md rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-xs shadow-md"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                <span>Retour à la connexion</span>
              </Link>
            </div>
          ) : (
            /* ── État formulaire ── */
            <>
              <div className="mb-lg">
                <div className="flex justify-center mb-md">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      lock_reset
                    </span>
                  </div>
                </div>
                <h2 className="text-title-lg font-title-lg text-on-surface mb-xxs text-center">
                  Mot de passe oublié ?
                </h2>
                <p className="text-body-sm font-body-sm text-on-surface-variant text-center">
                  Entrez votre adresse email, nous vous enverrons un lien de réinitialisation.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-md" noValidate>
                {/* Email Field */}
                <div className="space-y-xs">
                  <label className="text-label-md font-label-md text-on-surface-variant" htmlFor="email">
                    Email institutionnel
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
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-error text-label-sm mt-xxs">{errors.email.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  className="w-full py-sm px-md bg-primary text-on-primary font-title-md text-title-md rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-xs shadow-md disabled:opacity-70"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer le lien</span>
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </>
                  )}
                </button>
              </form>

              {/* Retour */}
              <div className="mt-lg pt-md border-t border-outline-variant text-center">
                <Link
                  href="/login"
                  className="text-body-sm font-body-sm text-primary hover:underline inline-flex items-center gap-xxs"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </div>

        {/* ── System Footer ── */}
        <div className="mt-lg flex flex-col items-center gap-xs">
          <p className="text-label-sm font-label-sm text-outline">
            v4.8.2-stable | © 2026 KAMLOG LOGISTICS GROUP
          </p>
        </div>
      </main>
    </div>
  )
}