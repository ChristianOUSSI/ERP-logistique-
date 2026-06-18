// src/app/(app)/auth/create-account/page.tsx - Create Account KAMLOG ERP - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateAccount() {
  const router = useRouter()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(1)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    // Calculate password strength
    let strength = 0
    if (value.length >= 8) strength++
    if (/[A-Z]/.test(value)) strength++
    if (/[0-9]/.test(value)) strength++
    if (/[^A-Za-z0-9]/.test(value)) strength++
    setPasswordStrength(strength)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!termsAccepted) {
      alert('Veuillez accepter les conditions d\'utilisation')
      return
    }
    setLoading(true)
    // Simulate API call - will be connected to backend
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    router.push('/auth/login')
  }

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return 'Très faible'
    if (passwordStrength === 1) return 'Faible'
    if (passwordStrength === 2) return 'Moyen'
    if (passwordStrength === 3) return 'Fort'
    return 'Très fort'
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
      `}</style>
      <div className="bg-surface-container-low min-h-screen flex items-center justify-center p-md font-body-md text-on-surface">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          {/* Left Panel: Brand/Hero */}
          <div className="hidden md:flex flex-col justify-between p-xl bg-primary relative overflow-hidden" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuApcGLHTpk-l5c2MLcyFrRwOiT3JfuNUChaNLiDKBLKZoVEaDscJyrdVqPrvJrWFRdg1xRlLpY6vf0ivOx6Z2cLjq97gjipcLnSS5lQRjqb_8cdVIxKf2q5IWI3POgCygrwhklKtciifA6ilPqH_XquwRB6IfNWgFAdpLPGK-sNjIBApltmP6_mCCiXdNFjqEc7_x1TmaVYhoq29dxnuD37QksF6zL33vObP1p1EvFeosq5Y-MPha1WDufAtBSIhjiruXCKX2nfn_0")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'multiply'}}>
            <div className="relative z-10">
              <h1 className="font-headline-lg text-headline-lg text-on-primary mb-sm">KAMLOG ERP</h1>
              <p className="font-body-lg text-body-lg text-on-primary opacity-90 max-w-sm">Système de gestion intégrée pour les opérations portuaires et la logistique de précision.</p>
            </div>
            <div className="relative z-10 bg-surface-container-lowest/10 backdrop-blur-md p-md rounded-lg border border-on-primary/20">
              <p className="font-body-sm text-body-sm text-on-primary">"L'efficacité au cœur de chaque transaction. Bienvenue dans la nouvelle ère de la logistique connectée."</p>
              <p className="font-label-sm text-label-sm text-on-primary mt-xs opacity-70">Support Technique: 24/7 Disponible</p>
            </div>
          </div>
          {/* Right Panel: Registration Form */}
          <div className="p-xl flex flex-col justify-center bg-surface-container-lowest">
            <div className="max-w-sm w-full mx-auto">
              <div className="mb-lg">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Créer un compte</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Accédez aux modules opérationnels KAMLOG.</p>
              </div>
              <form className="space-y-md" onSubmit={handleSubmit}>
                {/* Prénom & Nom */}
                <div className="grid grid-cols-2 gap-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="firstName">Prénom</label>
                    <input 
                      className="w-full h-10 px-sm border border-outline-variant rounded bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-body-sm" 
                      id="firstName" 
                      placeholder="Jean" 
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="lastName">Nom</label>
                    <input 
                      className="w-full h-10 px-sm border border-outline-variant rounded bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-body-sm" 
                      id="lastName" 
                      placeholder="Dupont" 
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {/* Email Institutionnel */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="email">Email institutionnel</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-sm pointer-events-none material-symbols-outlined text-outline">mail</span>
                    <input 
                      className="w-full h-10 pl-10 pr-sm border border-outline-variant rounded bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-body-sm" 
                      id="email" 
                      placeholder="prenom.nom@kamlog.com" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {/* Département */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="department">Département d'affectation</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-sm pointer-events-none material-symbols-outlined text-outline">business_center</span>
                    <select 
                      className="w-full h-10 pl-10 pr-sm border border-outline-variant rounded bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-body-sm appearance-none" 
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    >
                      <option disabled selected value="">Sélectionner un département</option>
                      <option value="transport">Transport & Flotte</option>
                      <option value="finance">Finances & Facturation</option>
                      <option value="magasin">Magasin & Stocks</option>
                      <option value="operations">Opérations Portuaires</option>
                      <option value="rh">Ressources Humaines</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-sm pointer-events-none material-symbols-outlined text-outline">arrow_drop_down</span>
                  </div>
                </div>
                {/* Mot de passe */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="password">Mot de passe</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-sm pointer-events-none material-symbols-outlined text-outline">lock</span>
                    <input 
                      className="w-full h-10 pl-10 pr-10 border border-outline-variant rounded bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-body-sm" 
                      id="password" 
                      placeholder="••••••••" 
                      type={passwordVisible ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                    />
                    <button 
                      className="absolute inset-y-0 right-0 flex items-center pr-sm text-outline hover:text-primary transition-colors" 
                      type="button" 
                      onClick={togglePasswordVisibility}
                    >
                      <span className="material-symbols-outlined">{passwordVisible ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {/* Password Strength Meter */}
                  <div className="mt-xs flex gap-1">
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 1 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 2 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 3 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength >= 4 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                  </div>
                  <p className="font-label-sm text-label-sm text-outline mt-1">Niveau de sécurité : {getStrengthLabel()}</p>
                </div>
                {/* Conditions */}
                <div className="flex items-start gap-xs mt-sm">
                  <input 
                    className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface cursor-pointer" 
                    id="terms" 
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                  <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="terms">
                    J'accepte les <a className="text-primary hover:underline font-medium" href="#">conditions d'utilisation</a> et la politique de confidentialité de KAMLOG ERP.
                  </label>
                </div>
                {/* Actions */}
                <div className="pt-sm space-y-md">
                  <button 
                    className="w-full h-10 bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-md text-label-md rounded shadow-sm transition-all active:scale-95 flex items-center justify-center gap-xs disabled:opacity-50 disabled:cursor-not-allowed" 
                    type="submit"
                    disabled={loading || !termsAccepted}
                  >
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                        Traitement...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        Finaliser l'inscription
                      </>
                    )}
                  </button>
                  <div className="text-center font-body-sm text-body-sm text-on-surface-variant">
                    Déjà un compte ? 
                    <button 
                      type="button"
                      onClick={() => router.push('/auth/login')}
                      className="text-primary hover:underline font-medium ml-1"
                    >
                      Retour à la connexion
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
