// src/app/(auth)/reset-password/page.tsx
// Design: carte centrée sur fond ERP  réinitialisation de mot de passe
'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Minimum 8 caractères')
      .regex(/[A-Z]/, 'Une majuscule requise')
      .regex(/[0-9]/, 'Un chiffre requis')
      .regex(/[^A-Za-z0-9]/, 'Un caractère spécial requis'),
    confirm: z.string().min(1, 'Confirmation requise'),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm'],
  })

type ResetFormData = z.infer<typeof resetSchema>

function getPasswordStrength(pwd: string) {
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 1) return { score, label: 'Faible', color: 'bg-error' }
  if (score === 2) return { score, label: 'Moyen', color: 'bg-tertiary-container' }
  if (score === 3) return { score, label: 'Fort', color: 'bg-primary' }
  return { score, label: 'Très fort', color: 'bg-secondary' }
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirm: '' },
  })

  const watchPassword = watch('password') || ''
  const watchConfirm = watch('confirm') || ''
  const strength = getPasswordStrength(watchPassword)

  const rules = [
    { label: '8 caractères minimum', ok: watchPassword.length >= 8 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(watchPassword) },
    { label: 'Un caractère spécial', ok: /[^A-Za-z0-9]/.test(watchPassword) },
    { label: 'Un chiffre', ok: /[0-9]/.test(watchPassword) },
  ]

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true)
    try {
      await apiClient.post('/api/auth/reset-password', {
        token,
        password: data.password,
      })
      router.push('/login?reset=success')
    } catch {
      // handle error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="bg-slate-900 text-on-surface font-body-md min-h-screen flex flex-col items-center justify-center overflow-y-auto relative py-12"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
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
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-7">

          <div className="mb-lg">
            <div className="flex justify-center mb-md">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  password
                </span>
              </div>
            </div>
            <h2 className="text-title-lg font-title-lg text-slate-800 dark:text-slate-100 mb-xxs text-center">
              Nouveau mot de passe
            </h2>
            <p className="text-body-sm font-body-sm text-slate-500 dark:text-slate-400 text-center">
              Choisissez un mot de passe sécurisé pour votre compte.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-md" noValidate>

            {/* Nouveau mot de passe */}
            <div className="space-y-xs">
              <label className="text-label-md font-label-md text-on-surface-variant" htmlFor="password">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  lock
                </span>
                <input
                  {...register('password')}
                  className="w-full pl-10 pr-12 py-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Strength Meter */}
            {watchPassword.length > 0 && (
              <div>
                <div className="flex gap-1 mb-xxs">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        i <= strength.score ? strength.color : 'bg-surface-variant'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-label-sm font-label-sm text-on-surface-variant">
                  Niveau de sécurité : {strength.label}
                </p>
              </div>
            )}

            {/* Confirmer */}
            <div className="space-y-xs">
              <label className="text-label-md font-label-md text-on-surface-variant" htmlFor="confirm">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  lock
                </span>
                <input
                  {...register('confirm')}
                  className={`w-full pl-10 pr-12 py-sm bg-slate-50 dark:bg-slate-700 border rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.confirm ? 'border-red-400' : watchConfirm && watchConfirm === watchPassword ? 'border-green-400' : 'border-slate-200 dark:border-slate-600'
                  }`}
                  id="confirm"
                  placeholder="••••••••"
                  type={showConfirm ? 'text' : 'password'}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-xxs">
                  {watchConfirm && watchConfirm === watchPassword && (
                    <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-outline hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirm ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
              {errors.confirm && (
                <p className="text-error text-label-sm mt-xxs">{errors.confirm.message}</p>
              )}
            </div>

            {/* Password Rules */}
            <div className="grid grid-cols-2 gap-xs">
              {rules.map((rule) => (
                <div key={rule.label} className="flex items-center gap-xxs">
                  <span className={`material-symbols-outlined text-[14px] ${rule.ok ? 'text-secondary' : 'text-outline'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {rule.ok ? 'check_circle' : 'cancel'}
                  </span>
                  <span className={`text-label-sm ${rule.ok ? 'text-secondary' : 'text-on-surface-variant'}`}>
                    {rule.label}
                  </span>
                </div>
              ))}
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
                  <span>Réinitialisation...</span>
                </>
              ) : (
                <>
                  <span>Réinitialiser le mot de passe</span>
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
