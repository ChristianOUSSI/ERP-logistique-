// src/app/(app)/admin/user-management/create/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminAPI } from '@/lib/api/admin'
import { TCodeSearch } from '@/components/ui/TCodeSearch'
import { useAuth } from '@/components/layout/AuthProvider'

export default function UserManagementCreate() {
  const router = useRouter()
  const { logout } = useAuth()
  const [inputFocused, setInputFocused] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    agency_id: 1, // Default to agency 1 for now
  })

  const handleInputFocus = (id: string) => setInputFocused(id)
  const handleInputBlur = () => setInputFocused(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      const payload = {
        username: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`,
        email: formData.email,
        password: formData.password,
        full_name: `${formData.firstName} ${formData.lastName}`,
        role: formData.role,
        agency_id: Number(formData.agency_id)
      }
      await adminAPI.createUser(payload)
      router.push('/admin/user-management/listing')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Une erreur est survenue lors de la création.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-fill {
          font-variation-settings: 'FILL 1';
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="bg-surface-container-low text-on-surface selection:bg-primary-fixed-dim min-h-screen">
        
        <div className="flex flex-col min-h-screen">
          {/* TopNavBar Anchor */}
          
          {/* Main Content Area */}
          <main className="flex-1 p-[1.5rem] w-full max-w-[1600px] mx-auto bg-[#F8FAFC]">
            {/* Breadcrumbs */}
            
            
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-end mb-xl">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-background">Create New User</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Configure profile, security, and access duration for the employee.</p>
                </div>
                <div className="flex gap-sm">
                  <button type="button" onClick={() => router.push('/admin/user-management/listing')} className="px-lg py-sm bg-surface border border-outline text-on-surface font-label-md text-label-md rounded hover:bg-surface-container-high transition-all">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-lg py-sm bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-primary-container transition-all flex items-center gap-xs shadow-sm disabled:opacity-50">
                    <span className="material-symbols-outlined">{isSubmitting ? 'sync' : 'save'}</span>
                    {isSubmitting ? 'Saving...' : 'Save User'}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 flex items-center gap-2">
                  <span className="material-symbols-outlined">error</span>
                  {errorMsg}
                </div>
              )}

              {/* Split Layout Form */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1rem]">
                {/* Left Column: General & Security */}
                <div className="lg:col-span-8 space-y-[1rem]">
                  {/* General Information Card */}
                  <section className="bg-white border border-outline-variant p-lg rounded-lg shadow-sm">
                    <div className="flex items-center gap-sm mb-lg border-b border-surface-container-highest pb-sm">
                      <span className="material-symbols-outlined text-primary">person</span>
                      <h3 className="font-title-md text-title-md font-bold">General Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                      <div className={`flex flex-col gap-xxs transition-transform ${inputFocused === 'firstName' ? 'scale-[1.01]' : ''}`}>
                        <label className="font-label-md text-label-md text-on-surface-variant">First Name *</label>
                        <input 
                          required
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="border border-outline-variant rounded p-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-low" 
                          placeholder="e.g. Jean" 
                          type="text"
                          onFocus={() => handleInputFocus('firstName')}
                          onBlur={handleInputBlur}
                        />
                      </div>
                      <div className={`flex flex-col gap-xxs transition-transform ${inputFocused === 'lastName' ? 'scale-[1.01]' : ''}`}>
                        <label className="font-label-md text-label-md text-on-surface-variant">Last Name *</label>
                        <input 
                          required
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="border border-outline-variant rounded p-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-low" 
                          placeholder="e.g. Dupont" 
                          type="text"
                          onFocus={() => handleInputFocus('lastName')}
                          onBlur={handleInputBlur}
                        />
                      </div>
                      <div className={`flex flex-col gap-xxs transition-transform ${inputFocused === 'email' ? 'scale-[1.01]' : ''}`}>
                        <label className="font-label-md text-label-md text-on-surface-variant">Email Address *</label>
                        <input 
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="border border-outline-variant rounded p-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-low" 
                          placeholder="j.dupont@kamlog.com" 
                          type="email"
                          onFocus={() => handleInputFocus('email')}
                          onBlur={handleInputBlur}
                        />
                      </div>
                      <div className={`flex flex-col gap-xxs transition-transform ${inputFocused === 'role' ? 'scale-[1.01]' : ''}`}>
                        <label className="font-label-md text-label-md text-on-surface-variant">Role / Department *</label>
                        <select 
                          required
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="border border-outline-variant rounded p-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-low"
                          onFocus={() => handleInputFocus('role')}
                          onBlur={handleInputBlur}
                        >
                          <option value="">Select Role</option>
                          <option value="admin">Admin</option>
                          <option value="dispatcher">Dispatcher (K-Transport)</option>
                          <option value="finance">Finance (K-Finance)</option>
                          <option value="douane">Douane</option>
                          <option value="gate_agent">Gate Agent (Magasin)</option>
                        </select>
                      </div>
                    </div>
                  </section>
                  {/* Security Settings Card */}
                  <section className="bg-white border border-outline-variant p-lg rounded-lg shadow-sm">
                    <div className="flex items-center gap-sm mb-lg border-b border-surface-container-highest pb-sm">
                      <span className="material-symbols-outlined text-primary">security</span>
                      <h3 className="font-title-md text-title-md font-bold">Security Settings</h3>
                    </div>
                    <div className="space-y-lg">
                      <div className={`flex flex-col gap-xxs transition-transform ${inputFocused === 'password' ? 'scale-[1.01]' : ''}`}>
                        <label className="font-label-md text-label-md text-on-surface-variant">Initial Password *</label>
                        <input 
                          required
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="border border-outline-variant rounded p-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-low" 
                          placeholder="Min. 8 characters" 
                          type="password"
                          onFocus={() => handleInputFocus('password')}
                          onBlur={handleInputBlur}
                        />
                      </div>
                    </div>
                  </section>
                </div>
                {/* Right Column: Access & Summary */}
                <div className="lg:col-span-4 space-y-[1rem]">
                  {/* Profile Preview/Quick Info */}
                  <section className="bg-primary text-on-primary p-lg rounded-lg shadow-md relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 opacity-10">
                      <span className="material-symbols-outlined text-[120px]">shield_person</span>
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-title-md text-title-md font-bold mb-md">System Policy Notice</h3>
                      <p className="font-body-sm text-body-sm mb-lg opacity-90">Creating a new user requires administrator validation. All access logs are recorded for compliance with international port security standards.</p>
                      <div className="bg-white/10 p-sm rounded border border-white/20">
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-[20px]">info</span>
                          <span className="font-label-sm text-label-sm">Role will be assigned after profile creation.</span>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </>
  )
}
