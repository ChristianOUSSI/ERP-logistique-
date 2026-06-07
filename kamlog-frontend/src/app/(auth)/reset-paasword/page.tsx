'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock, Loader2, Check, X } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

const resetSchema = z.object({
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
  confirm: z.string().min(1),
}).refine((data) => data.password === data.confirm, {
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
  if (score <= 1) return { score, label: 'Faible', color: '#dc2626' }
  if (score === 2) return { score, label: 'Moyen', color: '#f59e0b' }
  if (score === 3) return { score, label: 'Fort', color: '#06b6d4' }
  return { score, label: 'Tres fort', color: '#16a34a' }
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, watch, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const watchPassword = watch('password')
  const watchConfirm = watch('confirm')
  const strength = getPasswordStrength(watchPassword)

  const rules = [
    { label: '8 caracteres minimum', ok: watchPassword.length >= 8 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(watchPassword) },
    { label: 'Un caractere special', ok: /[^A-Za-z0-9]/.test(watchPassword) },
    { label: 'Un chiffre', ok: /[0-9]/.test(watchPassword) },
  ]

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true)
    try {
      await apiClient.post('/api/auth/reset-password', { token, password: data.password })
      router.push('/login?reset=success')
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-[#e0f7fa] flex items-center justify-center">
          <svg viewBox="0 0 60 60" className="w-12 h-12">
            <circle cx="20" cy="22" r="12" stroke="#06b6d4" strokeWidth="2.5" fill="none"/>
            <circle cx="20" cy="22" r="5" fill="#06b6d4" opacity="0.3"/>
            <path d="M29 29 L48 48" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-[#1e293b] text-2xl font-bold">Nouveau mot de passe</h1>
        <p className="text-muted-foreground text-sm mt-2">Choisissez un mot de passe securise pour votre compte.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-2">
          <label className="block text-sm font-medium text-[#1e293b] mb-2">Nouveau mot de passe</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full h-11 pl-10 pr-12 rounded-lg border border-[#e2e8f0] text-sm text-[#1e293b] placeholder:text-[#cbd5e1] outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#1e293b]">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {watchPassword.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full transition-all" style={{ backgroundColor: i <= strength.score ? strength.color : '#e2e8f0' }} />
              ))}
            </div>
            <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1e293b] mb-2">Confirmer le mot de passe</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input {...register('confirm')} type={showConfirm ? 'text' : 'password'} placeholder="••••••••" className={`w-full h-11 pl-10 pr-12 rounded-lg border text-sm text-[#1e293b] placeholder:text-[#cbd5e1] outline-none focus:ring-2 focus:ring-[#06b6d4]/20 transition-all ${errors.confirm ? 'border-red-400 bg-red-50' : watchConfirm && watchConfirm === watchPassword ? 'border-green-400' : 'border-[#e2e8f0] focus:border-[#06b6d4]'}`} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {watchConfirm && watchConfirm === watchPassword && <Check size={16} className="text-green-500" />}
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-muted-foreground hover:text-[#1e293b]">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {rules.map((rule) => (
            <div key={rule.label} className="flex items-center gap-2">
              {rule.ok ? <Check size={14} className="text-green-500 shrink-0" /> : <X size={14} className="text-red-400 shrink-0" />}
              <span className={`text-xs ${rule.ok ? 'text-green-600' : 'text-muted-foreground'}`}>{rule.label}</span>
            </div>
          ))}
        </div>
        <button type="submit" disabled={isLoading} className="w-full h-11 rounded-lg bg-[#06b6d4] hover:bg-[#0891b2] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Reinitialiser le mot de passe <Lock size={16} /></>}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Chargement...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
