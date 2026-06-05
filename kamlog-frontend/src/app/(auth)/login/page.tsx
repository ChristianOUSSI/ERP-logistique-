// src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { 
  Mail, Lock, Eye, EyeOff, 
  ArrowRight, Loader2, XCircle 
} from 'lucide-react'
import { RoleBadges } from '@/components/auth/RoleBadges'
import { useAuthStore } from '@/stores/authStore'

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

// ── Page Login ──────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter()
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)

  // États locaux
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // React Hook Form + Zod
  const {
    register,
    handleSubmit,
    setValue,         // Pour remplir depuis les RoleBadges
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  // ── Soumission du formulaire ──────────────────────────────
  const onSubmit = async (formData: LoginFormData) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,   // On gère le redirect manuellement
      })

      if (result?.error) {
        // Erreur d'authentification → état 1B
        setErrorMessage('Identifiants incorrects. Veuillez réessayer.')
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        // Succès → redirect dashboard
        router.push('/dashboard')
        router.refresh()
      }

    } catch {
      setErrorMessage('Une erreur est survenue. Réessayez.')
      setIsLoading(false)
    }
  }

  // ── Remplissage rapide par rôle ───────────────────────────
  const handleRoleSelect = (email: string, password: string) => {
    setValue('email', email)
    setValue('password', password)
    setErrorMessage(null)
  }

  // ── Rendu ─────────────────────────────────────────────────
  return (
    <div className="w-full">

      {/* Titre */}
      <div className="text-center mb-8">
        <h1 className="text-[#1e293b] text-3xl font-bold">
          Connexion
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          Accédez à votre espace de travail
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* ── Champ Email ──────────────────────────────── */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1e293b] mb-2">
            Adresse email
          </label>
          <div className="relative">
            {/* Icône gauche */}
            <Mail 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 
                         text-muted-foreground" 
            />
            <input
              {...register('email')}
              type="email"
              placeholder="votre@kamlog.cm"
              disabled={isLoading}
              className={`
                w-full h-11 pl-10 pr-4 rounded-lg border text-sm
                text-[#1e293b] placeholder:text-[#cbd5e1]
                outline-none transition-all duration-150
                disabled:opacity-60 disabled:cursor-not-allowed
                ${errors.email || errorMessage
                  ? 'border-red-400 bg-red-50 focus:border-red-500' 
                  : 'border-[#e2e8f0] bg-white focus:border-[#06b6d4]'
                }
                focus:ring-2 focus:ring-[#06b6d4]/20
              `}
            />
          </div>
          {/* Message erreur champ */}
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* ── Champ Mot de passe ────────────────────── */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#1e293b]">
              Mot de passe
            </label>
            <a
              href="/forgot-password"
              className="text-xs text-[#06b6d4] hover:underline 
                         transition-colors"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <div className="relative">
            {/* Icône cadenas gauche */}
            <Lock 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 
                         text-muted-foreground" 
            />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={isLoading}
              className={`
                w-full h-11 pl-10 pr-12 rounded-lg border text-sm
                text-[#1e293b] placeholder:text-[#cbd5e1]
                outline-none transition-all duration-150
                disabled:opacity-60 disabled:cursor-not-allowed
                ${errors.password || errorMessage
                  ? 'border-red-400 bg-red-50 focus:border-red-500' 
                  : 'border-[#e2e8f0] bg-white focus:border-[#06b6d4]'
                }
                focus:ring-2 focus:ring-[#06b6d4]/20
              `}
            />
            {/* Toggle œil droite */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 
                         text-muted-foreground hover:text-[#1e293b] 
                         transition-colors"
            >
              {showPassword 
                ? <EyeOff size={18} /> 
                : <Eye size={18} />
              }
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* ── Se souvenir de moi ────────────────────── */}
        <div className="flex items-center gap-2 mb-6">
          <input
            {...register('remember')}
            type="checkbox"
            id="remember"
            disabled={isLoading}
            className="w-4 h-4 rounded border-[#e2e8f0] 
                       accent-[#06b6d4] cursor-pointer"
          />
          <label 
            htmlFor="remember" 
            className="text-sm text-[#64748b] cursor-pointer"
          >
            Se souvenir de moi
          </label>
        </div>

        {/* ── Bouton Submit ─────────────────────────── */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full h-11 rounded-lg font-medium text-sm text-white
            flex items-center justify-center gap-2
            transition-all duration-150
            ${isLoading
              ? 'bg-[#06b6d4]/70 cursor-not-allowed'
              : 'bg-[#06b6d4] hover:bg-[#0891b2] active:scale-[0.99]'
            }
          `}
        >
          {isLoading ? (
            // État chargement (1C)
            <>
              <Loader2 size={18} className="animate-spin" />
              Connexion en cours...
            </>
          ) : (
            // État normal (1A)
            <>
              Se connecter
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* ── Message erreur global (1B) ────────────── */}
        {errorMessage && !isLoading && (
          <div className="mt-4 flex items-center gap-2 p-3 
                          bg-red-50 border border-red-200 
                          rounded-lg text-red-600 text-sm">
            <XCircle size={16} className="shrink-0" />
            <span className="flex-1">{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-600"
            >
              <XCircle size={14} />
            </button>
          </div>
        )}

      </form>

      {/* ── Pills rôles rapides ───────────────────────────── */}
      <RoleBadges onRoleSelect={handleRoleSelect} />

    </div>
  )
}