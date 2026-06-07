// src/app/(auth)/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Mail, ArrowLeft, Send, 
  Loader2, CheckCircle 
} from 'lucide-react'
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
        email: data.email 
      })
      setSubmittedEmail(data.email)
      setIsSuccess(true)
    } catch {
      // On affiche toujours le succès (sécurité  pas révéler si email existe)
      setSubmittedEmail(data.email)
      setIsSuccess(true)
    } finally {
      setIsLoading(false)
    }
  }

  // ── État Succès (2B) ────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="w-full text-center">

        {/* Retour */}
        <div className="text-left mb-8">
          <Link 
            href="/login"
            className="inline-flex items-center gap-1 text-sm 
                       text-[#06b6d4] hover:underline"
          >
            <ArrowLeft size={16} />
            Retour à la connexion
          </Link>
        </div>

        {/* Checkmark vert */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 
                          flex items-center justify-center">
            <CheckCircle size={48} className="text-green-500" />
          </div>
        </div>

        <h1 className="text-[#1e293b] text-2xl font-bold mb-3">
          Email envoyé !
        </h1>
        <p className="text-[#64748b] text-sm mb-2">
          Un lien de réinitialisation a été envoyé à
        </p>
        <p className="text-[#1e293b] font-medium text-sm mb-6">
          {submittedEmail}
        </p>
        <p className="text-muted-foreground text-xs">
          Vérifiez aussi vos spams. Le lien expire dans 30 min.
        </p>

        {/* Bouton retour */}
        <Link
          href="/login"
          className="mt-8 w-full h-11 rounded-lg border-2 
                     border-[#06b6d4] text-[#06b6d4] font-medium 
                     text-sm flex items-center justify-center
                     hover:bg-[#06b6d4]/5 transition-colors"
        >
          Retour à la connexion
        </Link>

      </div>
    )
  }

  // ── État Formulaire (2A) ────────────────────────────────
  return (
    <div className="w-full">

      {/* Retour */}
      <div className="mb-8">
        <Link 
          href="/login"
          className="inline-flex items-center gap-1 text-sm 
                     text-[#06b6d4] hover:underline"
        >
          <ArrowLeft size={16} />
          Retour à la connexion
        </Link>
      </div>

      {/* Icône cadenas */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#e0f7fa] 
                          flex items-center justify-center shadow-lg">
            {/* Cadenas avec ? */}
            <svg viewBox="0 0 60 60" className="w-12 h-12">
              <defs>
                <linearGradient id="lockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4"/>
                  <stop offset="100%" stopColor="#0891b2"/>
                </linearGradient>
                <linearGradient id="lockBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.5"/>
                </linearGradient>
                <filter id="lockShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodOpacity="0.3"/>
                </filter>
              </defs>
              {/* Corps du cadenas avec effet 3D */}
              <rect x="10" y="28" width="40" height="28" 
                    rx="4" fill="url(#lockBodyGradient)" 
                    stroke="url(#lockGradient)" strokeWidth="2.5" filter="url(#lockShadow)"/>
              {/* Anneau du cadenas avec dégradé */}
              <path d="M20 28 V20 A10 10 0 0 1 40 20 V28" 
                    stroke="url(#lockGradient)" strokeWidth="3" 
                    fill="none" strokeLinecap="round" filter="url(#lockShadow)"/>
              {/* Point d'interrogation stylisé */}
              <text x="30" y="47" textAnchor="middle" 
                    fill="url(#lockGradient)" fontSize="16" fontWeight="bold"
                    filter="url(#lockShadow)">
                ?
              </text>
              {/* Reflet sur le corps du cadenas */}
              <rect x="12" y="30" width="36" height="8" 
                    fill="#06b6d4" opacity="0.15" rx="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Titre */}
      <div className="text-center mb-8">
        <h1 className="text-[#1e293b] text-2xl font-bold">
          Mot de passe oublié ?
        </h1>
        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
          Entrez votre adresse email, nous vous enverrons 
          un lien de réinitialisation.
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        <div className="mb-6">
          <label className="block text-sm font-medium 
                            text-[#1e293b] mb-2">
            Adresse email
          </label>
          <div className="relative">
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
                disabled:opacity-60
                ${errors.email
                  ? 'border-red-400 bg-red-50' 
                  : 'border-[#e2e8f0] focus:border-[#06b6d4]'
                }
                focus:ring-2 focus:ring-[#06b6d4]/20
              `}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-lg bg-[#06b6d4] 
                     hover:bg-[#0891b2] text-white font-medium 
                     text-sm flex items-center justify-center gap-2
                     transition-colors disabled:opacity-70
                     disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              Envoyer le lien
              <Send size={16} />
            </>
          )}
        </button>

      </form>
    </div>
  )
}