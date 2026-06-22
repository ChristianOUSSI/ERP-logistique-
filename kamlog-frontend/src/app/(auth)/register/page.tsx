// src/app/(auth)/register/page.tsx
// 100% fidèle à ERP/create_account_kamlog_erp/code.html
// Layout: grille 2 colonnes (image gauche, formulaire droite) centrée sur fond ERP
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

const registerSchema = z.object({
  firstName: z.string().min(1, 'Prénom obligatoire'),
  lastName: z.string().min(1, 'Nom obligatoire'),
  email: z
    .string()
    .min(1, 'Email obligatoire')
    .email('Format email invalide'),
  department: z.string().min(1, 'Département obligatoire'),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Une majuscule requise')
    .regex(/[0-9]/, 'Un chiffre requis')
    .regex(/[^A-Za-z0-9]/, 'Un caractère spécial requis'),
  terms: z.literal(true, {
    error: 'Vous devez accepter les conditions',
  }),
})

type RegisterFormData = z.infer<typeof registerSchema>

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

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      password: '',
      terms: false as unknown as true,
    },
  })

  const watchPassword = watch('password') || ''
  const strength = getPasswordStrength(watchPassword)

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await apiClient.post('/api/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        department: data.department,
        password: data.password,
      })
      router.push('/login?registered=true')
    } catch {
      // handle error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex items-center justify-center overflow-y-auto relative p-md"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* ── Grande carte 2 colonnes — exactement comme le design ERP ── */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">

        {/* ══════ Left Panel: Brand/Hero ══════ */}
        <div
          className="hidden md:flex flex-col justify-between p-xl bg-primary relative overflow-hidden"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuApcGLHTpk-l5c2MLcyFrRwOiT3JfuNUChaNLiDKBLKZoVEaDscJyrdVqPrvJrWFRdg1xRlLpY6vf0ivOx6Z2cLjq97gjipcLnSS5lQRjqb_8cdVIxKf2q5IWI3POgCygrwhklKtciifA6ilPqH_XquwRB6IfNWgFAdpLPGK-sNjIBApltmP6_mCCiXdNFjqEc7_x1TmaVYhoq29dxnuD37QksF6zL33vObP1p1EvFeosq5Y-MPha1WDufAtBSIhjiruXCKX2nfn_0')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'multiply',
          }}
        >
          <div className="relative z-10">
            <h1 className="font-headline-lg text-headline-lg text-on-primary mb-sm">
              KAMLOG ERP
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary opacity-90 max-w-sm">
              Système de gestion intégrée pour les opérations portuaires et la logistique de précision.
            </p>
          </div>
          <div className="relative z-10 bg-surface-container-lowest/10 backdrop-blur-md p-md rounded-lg border border-on-primary/20">
            <p className="font-body-sm text-body-sm text-on-primary">
              &quot;L&apos;efficacité au cœur de chaque transaction. Bienvenue dans la nouvelle ère de la logistique connectée.&quot;
            </p>
            <p className="font-label-sm text-label-sm text-on-primary mt-xs opacity-70">
              Support Technique: 24/7 Disponible
            </p>
          </div>
        </div>

        {/* ══════ Right Panel: Registration Form ══════ */}
        <div className="p-xl flex flex-col justify-center bg-surface-container-lowest">
          <div className="max-w-sm w-full mx-auto">

            <div className="mb-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">
                Créer un compte
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Accédez aux modules opérationnels KAMLOG.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-md" noValidate>

              {/* Prénom & Nom */}
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="firstName">
                    Prénom
                  </label>
                  <input
                    {...register('firstName')}
                    className="w-full h-10 px-sm border border-outline-variant rounded bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-body-sm"
                    id="firstName"
                    placeholder="Jean"
                    type="text"
                  />
                  {errors.firstName && (
                    <p className="text-error text-label-sm mt-xxs">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="lastName">
                    Nom
                  </label>
                  <input
                    {...register('lastName')}
                    className="w-full h-10 px-sm border border-outline-variant rounded bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-body-sm"
                    id="lastName"
                    placeholder="Dupont"
                    type="text"
                  />
                  {errors.lastName && (
                    <p className="text-error text-label-sm mt-xxs">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email Institutionnel */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="email">
                  Email institutionnel
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-sm pointer-events-none material-symbols-outlined text-outline">
                    mail
                  </span>
                  <input
                    {...register('email')}
                    className="w-full h-10 pl-10 pr-sm border border-outline-variant rounded bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-body-sm"
                    id="email"
                    placeholder="prenom.nom@kamlog.com"
                    type="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-error text-label-sm mt-xxs">{errors.email.message}</p>
                )}
              </div>

              {/* Département */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="department">
                  Département d&apos;affectation
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-sm pointer-events-none material-symbols-outlined text-outline">
                    business_center
                  </span>
                  <select
                    {...register('department')}
                    className="w-full h-10 pl-10 pr-sm border border-outline-variant rounded bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-body-sm appearance-none"
                    id="department"
                  >
                    <option disabled value="">
                      Sélectionner un département
                    </option>
                    <option value="transport">Transport &amp; Flotte</option>
                    <option value="finance">Finances &amp; Facturation</option>
                    <option value="magasin">Magasin &amp; Stocks</option>
                    <option value="operations">Opérations Portuaires</option>
                    <option value="rh">Ressources Humaines</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-sm pointer-events-none material-symbols-outlined text-outline">
                    arrow_drop_down
                  </span>
                </div>
                {errors.department && (
                  <p className="text-error text-label-sm mt-xxs">{errors.department.message}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="password">
                  Mot de passe
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-sm pointer-events-none material-symbols-outlined text-outline">
                    lock
                  </span>
                  <input
                    {...register('password')}
                    className="w-full h-10 pl-10 pr-10 border border-outline-variant rounded bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-body-sm"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-sm text-outline hover:text-primary transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {/* Password Strength Meter */}
                <div className="mt-xs flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i <= strength.score ? strength.color : 'bg-surface-variant'
                      }`}
                    />
                  ))}
                </div>
                <p className="font-label-sm text-label-sm text-outline mt-1">
                  Niveau de sécurité : {watchPassword.length > 0 ? strength.label : '—'}
                </p>
                {errors.password && (
                  <p className="text-error text-label-sm mt-xxs">{errors.password.message}</p>
                )}
              </div>

              {/* Conditions */}
              <div className="flex items-start gap-xs mt-sm">
                <input
                  {...register('terms')}
                  className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface cursor-pointer"
                  id="terms"
                  type="checkbox"
                />
                <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="terms">
                  J&apos;accepte les{' '}
                  <a className="text-primary hover:underline font-medium" href="#">
                    conditions d&apos;utilisation
                  </a>{' '}
                  et la politique de confidentialité de KAMLOG ERP.
                </label>
              </div>
              {errors.terms && (
                <p className="text-error text-label-sm">{errors.terms.message}</p>
              )}

              {/* Actions */}
              <div className="pt-sm space-y-md">
                <button
                  className="w-full h-10 bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-md text-label-md rounded shadow-sm transition-all active:scale-95 flex items-center justify-center gap-xs disabled:opacity-70"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">person_add</span>
                  )}
                  {isLoading ? 'Inscription en cours...' : "Finaliser l'inscription"}
                </button>
                <div className="text-center font-body-sm text-body-sm text-on-surface-variant">
                  Déjà un compte ?{' '}
                  <Link className="text-primary hover:underline font-medium" href="/login">
                    Retour à la connexion
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
