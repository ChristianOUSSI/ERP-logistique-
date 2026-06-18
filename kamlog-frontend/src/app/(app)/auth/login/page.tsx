// src/app/(app)/auth/login/page.tsx - Login KAMLOG ERP - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'

export default function Login() {
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
          vertical-align: middle;
        }
        .icon-fill {
          font-variation-settings: 'FILL 1';
        }
        .logistics-overlay {
          background-image: url("https://www.transparenttextures.com/patterns/cubes.png");
          opacity: 0.03;
        }
        .auth-card {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .focus-ring:focus {
          outline: none;
          box-shadow: 0 0 0 2px #3B82F6;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex items-center justify-center overflow-hidden relative">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low via-white to-surface-container-highest"></div>
          <div className="absolute inset-0 logistics-overlay"></div>
          {/* Background Imagery */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img className="w-full h-full object-cover" alt="Logistics terminal background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3F047r3gYJ87S3A35ak4dIOIGqHlksQbCPpUlVQ9vzeVWDfPBYIsS1-J0MTQ9hZvKJAmbrnAYlmm3-ppAXOhAndHlGzivtl9VPHTj8VML1Wbf7MIAshXa5PCgYR8-lLGVUBSlC9vdyEDdCz62_JQU91TuJVRfwE8oKBOJkHTLfyCcTYJhzzqwJoSOseWKiawHRC8myzlInZFL1fwnsC2PjL2ayMm-MVJ3iAiIHWL6f6uK8IZa0Wp1uebXZ6G0B5GfrtQB6X6Qkic"/>
          </div>
        </div>
        {/* Main Content Container */}
        <main className="relative z-10 w-full max-w-md px-md">
          {/* Header/Branding */}
          <div className="text-center mb-xl">
            <div className="inline-flex items-center justify-center p-xs bg-white rounded-lg shadow-sm border border-outline-variant mb-md">
              <span className="material-symbols-outlined text-[#3B82F6] text-4xl icon-fill">precision_manufacturing</span>
            </div>
            <h1 className="text-headline-sm font-headline-sm text-primary tracking-tight">KAMLOG EM-ERP</h1>
            <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest mt-xxs">Operational Control Systems</p>
          </div>
          {/* Login Card */}
          <div className="bg-white border border-outline-variant rounded-lg p-lg auth-card">
            <div className="mb-lg">
              <h2 className="text-title-lg font-title-lg text-on-surface mb-xxs">System Authentication</h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Please enter your credentials to access the terminal.</p>
            </div>
            <form className="space-y-md" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-xs">
                <label className={`text-label-md font-label-md ${emailFocused ? 'text-[#3B82F6]' : 'text-on-surface-variant'}`} htmlFor="email">Institutional Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">alternate_email</span>
                  <input 
                    className="w-full pl-10 pr-md py-sm bg-surface rounded border border-outline-variant text-body-md focus-ring transition-all placeholder:text-outline" 
                    id="email" 
                    name="email" 
                    placeholder="user@kamlog.com" 
                    required 
                    type="email"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </div>
              </div>
              {/* Password Field */}
              <div className="space-y-xs">
                <div className="flex justify-between items-center">
                  <label className={`text-label-md font-label-md ${passwordFocused ? 'text-[#3B82F6]' : 'text-on-surface-variant'}`} htmlFor="password">Security Key</label>
                  <a className="text-label-md font-label-md text-[#3B82F6] hover:underline" href="#">Forgot password?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                  <input 
                    className="w-full pl-10 pr-md py-sm bg-surface rounded border border-outline-variant text-body-md focus-ring transition-all" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••••••" 
                    required 
                    type="password"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                </div>
              </div>
              {/* Remember Me */}
              <div className="flex items-center space-x-xs py-xxs">
                <input className="w-4 h-4 rounded border-outline-variant text-[#3B82F6] focus:ring-[#3B82F6]" id="remember" name="remember" type="checkbox"/>
                <label className="text-body-sm font-body-sm text-on-surface-variant select-none cursor-pointer" htmlFor="remember">Remember session for 12 hours</label>
              </div>
              {/* CTA Button */}
              <button 
                className={`w-full py-sm px-md ${success ? 'bg-secondary' : 'bg-[#3B82F6] hover:bg-blue-700'} text-white font-title-md text-title-md rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-xs shadow-md`} 
                type="submit"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    <span>Verifying...</span>
                  </>
                ) : success ? (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>Access Granted</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Access</span>
                    <span className="material-symbols-outlined text-[20px]">login</span>
                  </>
                )}
              </button>
            </form>
            {/* Footer Info */}
            <div className="mt-xl pt-lg border-t border-outline-variant">
              <div className="flex flex-col gap-sm">
                <div className="flex items-center gap-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-outline text-[18px]">verified_user</span>
                  <p className="text-label-sm font-label-sm">Secured by EM-ERP Multi-Factor Authentication</p>
                </div>
                <div className="flex items-center gap-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-outline text-[18px]">gavel</span>
                  <p className="text-label-sm font-label-sm leading-tight">Access monitored by Audit Module. Authorized personnel only.</p>
                </div>
              </div>
            </div>
          </div>
          {/* System Footer */}
          <div className="mt-lg flex flex-col items-center gap-xs">
            <p className="text-label-sm font-label-sm text-outline">v4.8.2-stable | © 2026 KAMLOG LOGISTICS GROUP</p>
            <div className="flex gap-md">
              <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-[#3B82F6]" href="#">Network Status</a>
              <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-[#3B82F6]" href="#">Legal</a>
              <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-[#3B82F6]" href="#">Support</a>
            </div>
          </div>
        </main>
        {/* Floating Background Decorative Elements */}
        <div className="absolute bottom-10 left-10 hidden xl:block opacity-20 transform -rotate-6">
          <div className="bg-white p-md rounded border border-outline-variant flex gap-sm items-center">
            <span className="material-symbols-outlined text-[#3B82F6] text-3xl">local_shipping</span>
            <div>
              <p className="text-label-sm font-label-sm uppercase font-bold text-outline">Active Fleet</p>
              <p className="text-headline-sm font-headline-sm text-primary">1,284</p>
            </div>
          </div>
        </div>
        <div className="absolute top-20 right-10 hidden xl:block opacity-20 transform rotate-3">
          <div className="bg-white p-md rounded border border-outline-variant flex gap-sm items-center">
            <span className="material-symbols-outlined text-[#3B82F6] text-3xl">inventory_2</span>
            <div>
              <p className="text-label-sm font-label-sm uppercase font-bold text-outline">Parc Capacity</p>
              <p className="text-headline-sm font-headline-sm text-primary">94.2%</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
