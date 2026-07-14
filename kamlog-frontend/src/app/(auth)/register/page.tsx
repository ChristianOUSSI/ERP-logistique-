// src/app/(auth)/register/page.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'

const registerSchema = z.object({
  firstName: z.string().min(1, 'Prénom obligatoire'),
  lastName: z.string().min(1, 'Nom obligatoire'),
  email: z.string().min(1, 'Email obligatoire').email('Format email invalide'),
  department: z.string().min(1, 'Département obligatoire'),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Une majuscule requise')
    .regex(/[0-9]/, 'Un chiffre requis')
    .regex(/[^A-Za-z0-9]/, 'Un caractère spécial requis'),
  terms: z.literal(true, { error: 'Vous devez accepter les conditions' }),
})

type RegisterFormData = z.infer<typeof registerSchema>

function getPasswordStrength(pwd: string) {
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 1) return { score, label: 'Faible', color: 'bg-red-500' }
  if (score === 2) return { score, label: 'Moyen', color: 'bg-amber-400' }
  if (score === 3) return { score, label: 'Fort', color: 'bg-blue-500' }
  return { score, label: 'Très fort', color: 'bg-emerald-500' }
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
    // Fixe l'écran  aucun scroll body possible
    <div
      className="fixed inset-0 flex items-center justify-center bg-slate-900"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Fond: dégradé + grille décorative */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950" />
        <div
          className="absolute inset-0 opacity-8 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuApcGLHTpk-l5c2MLcyFrRwOiT3JfuNUChaNLiDKBLKZoVEaDscJyrdVqPrvJrWFRdg1xRlLpY6vf0ivOx6Z2cLjq97gjipcLnSS5lQRjqb_8cdVIxKf2q5IWI3POgCygrwhklKtciifA6ilPqH_XquwRB6IfNWgFAdpLPGK-sNjIBApltmP6_mCCiXdNFjqEc7_x1TmaVYhoq29dxnuD37QksF6zL33vObP1p1EvFeosq5Y-MPha1WDufAtBSIhjiruXCKX2nfn_0')`
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* ── Carte deux colonnes ── */}
      <div className="relative z-10 w-full max-w-5xl mx-4 flex h-auto max-h-[95vh] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden border border-white/10">

        {/* ══ Panneau gauche : Brand ══ */}
        <div
          className="hidden md:flex flex-col justify-between w-[42%] shrink-0 p-8 relative"
          style={{
            background: 'linear-gradient(145deg, #1e40af 0%, #1e3a5f 60%, #0f172a 100%)',
          }}
        >
          {/* Overlay image subtil */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuApcGLHTpk-l5c2MLcyFrRwOiT3JfuNUChaNLiDKBLKZoVEaDscJyrdVqPrvJrWFRdg1xRlLpY6vf0ivOx6Z2cLjq97gjipcLnSS5lQRjqb_8cdVIxKf2q5IWI3POgCygrwhklKtciifA6ilPqH_XquwRB6IfNWgFAdpLPGK-sNjIBApltmP6_mCCiXdNFjqEc7_x1TmaVYhoq29dxnuD37QksF6zL33vObP1p1EvFeosq5Y-MPha1WDufAtBSIhjiruXCKX2nfn_0')`,
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}
          />
          {/* Contenu gauche */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
              </div>
              <div>
                <p className="text-white font-black text-base leading-tight">KAMLOG ERP</p>
                <p className="text-blue-200 text-xs font-medium">Logistics Platform</p>
              </div>
            </div>

            <h2 className="text-white font-black text-2xl leading-snug mb-3">
              Rejoignez la plateforme de gestion logistique
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed opacity-80">
              Système intégré pour les opérations portuaires, la gestion de flotte et la logistique de précision.
            </p>
          </div>

          {/* Stats cards en bas */}
          <div className="relative z-10 space-y-3">
            {[
              { icon: 'local_shipping', label: 'Véhicules gérés', value: '1,284' },
              { icon: 'inventory_2', label: 'Taux d\'utilisation', value: '94.2%' },
              { icon: 'group', label: 'Utilisateurs actifs', value: '340+' },
            ].map((stat) => (
              <div key={stat.icon} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/10">
                <span className="material-symbols-outlined text-blue-300 text-[18px]">{stat.icon}</span>
                <div>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider leading-none">{stat.label}</p>
                  <p className="text-white font-black text-base leading-tight">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ Panneau droit : Formulaire ══ */}
        <div className="flex-1 bg-white dark:bg-slate-800 flex flex-col min-h-0">
          {/* Header fixe du panneau */}
          <div className="px-7 pt-7 pb-4 shrink-0 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">Créer un compte</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Accédez aux modules opérationnels KAMLOG</p>
              </div>
              {/* Lien retour connexion  toujours visible */}
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors shrink-0 ml-4"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span className="hidden sm:inline">Connexion</span>
              </Link>
            </div>
          </div>

          {/* Formulaire scrollable uniquement dans le panneau */}
          <div className="flex-1 overflow-y-auto px-7 py-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

              {/* Prénom & Nom */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="firstName">
                    Prénom
                  </label>
                  <input
                    {...register('firstName')}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="firstName"
                    placeholder="Jean"
                    type="text"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="lastName">
                    Nom
                  </label>
                  <input
                    {...register('lastName')}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="lastName"
                    placeholder="Dupont"
                    type="text"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="email">
                  Email institutionnel
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] select-none">
                    mail
                  </span>
                  <input
                    {...register('email')}
                    className="w-full h-10 pl-9 pr-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="email"
                    placeholder="prenom.nom@kamlog.com"
                    type="email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Département */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="department">
                  Département d'affectation
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] select-none pointer-events-none">
                    business_center
                  </span>
                  <select
                    {...register('department')}
                    className="w-full h-10 pl-9 pr-8 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    id="department"
                  >
                    <option disabled value="">Sélectionner un département</option>
                    <option value="transport">Transport & Flotte</option>
                    <option value="finance">Finances & Facturation</option>
                    <option value="magasin">Magasin & Stocks</option>
                    <option value="operations">Opérations Portuaires</option>
                    <option value="rh">Ressources Humaines</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] select-none pointer-events-none">
                    expand_more
                  </span>
                </div>
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="password">
                  Mot de passe
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] select-none pointer-events-none">
                    lock
                  </span>
                  <input
                    {...register('password')}
                    className="w-full h-10 pl-9 pr-10 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {/* Indicateur de force */}
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
                {watchPassword.length > 0 && (
                  <p className="text-xs text-slate-400 mt-1">Sécurité : <span className="font-semibold text-slate-600">{strength.label}</span></p>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Conditions */}
              <div className="flex items-start gap-3">
                <input
                  {...register('terms')}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                  id="terms"
                  type="checkbox"
                />
                <label className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer leading-relaxed" htmlFor="terms">
                  J'accepte les{' '}
                  <a className="text-blue-600 hover:underline font-semibold cursor-pointer" onClick={() => toast.info('Conditions en cours de rédaction')}>conditions d'utilisation</a>
                  {' '}et la politique de confidentialité de KAMLOG ERP.
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}

              {/* Bouton */}
              <button
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                    <span>Inscription en cours...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    <span>Finaliser l'inscription</span>
                  </>
                )}
              </button>

              <p className="text-center text-sm text-slate-500 pb-2">
                Déjà un compte ?{' '}
                <Link className="text-blue-600 font-semibold hover:underline" href="/login">
                  Retour à la connexion
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
