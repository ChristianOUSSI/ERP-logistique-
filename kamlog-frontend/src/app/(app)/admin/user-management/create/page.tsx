// src/app/(app)/admin/user-management/create/page.tsx - User Management Creation/Modification - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'

export default function UserManagementCreate() {
  const [inputFocused, setInputFocused] = useState<string | null>(null)
  const [tCodeFocused, setTCodeFocused] = useState(false)

  const handleInputFocus = (id: string) => {
    setInputFocused(id)
  }

  const handleInputBlur = () => {
    setInputFocused(null)
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
      <div className="bg-surface-container-low text-on-surface selection:bg-primary-fixed-dim">
        {/* SideNavBar Anchor */}
        <aside className="h-screen w-60 fixed left-0 top-0 bg-surface-container-low flex flex-col border-r border-outline-variant z-50">
          <div className="px-lg py-xl">
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary">KAMLOG ERP</h1>
            <p className="font-label-md text-label-md text-on-surface-variant">Admin Suite</p>
          </div>
          <nav className="flex-1 overflow-y-auto no-scrollbar">
            <div className="flex flex-col gap-xxs">
              <a className="flex items-center gap-md px-lg py-sm cursor-pointer hover:bg-surface-container-highest transition-all text-on-surface-variant" href="/dashboard/global">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="font-label-md text-label-md">Dashboard</span>
              </a>
              <a className="flex items-center gap-md px-lg py-sm cursor-pointer text-primary font-bold border-l-4 border-primary bg-surface-container-high transition-all" href="#">
                <span className="material-symbols-outlined icon-fill">group</span>
                <span className="font-label-md text-label-md">User Management</span>
              </a>
              <a className="flex items-center gap-md px-lg py-sm cursor-pointer hover:bg-surface-container-highest transition-all text-on-surface-variant" href="#">
                <span className="material-symbols-outlined">local_shipping</span>
                <span className="font-label-md text-label-md">Logistics</span>
              </a>
              <a className="flex items-center gap-md px-lg py-sm cursor-pointer hover:bg-surface-container-highest transition-all text-on-surface-variant" href="#">
                <span className="material-symbols-outlined">inventory_2</span>
                <span className="font-label-md text-label-md">Inventory</span>
              </a>
              <a className="flex items-center gap-md px-lg py-sm cursor-pointer hover:bg-surface-container-highest transition-all text-on-surface-variant" href="/finance/overview">
                <span className="material-symbols-outlined">payments</span>
                <span className="font-label-md text-label-md">Finance</span>
              </a>
            </div>
          </nav>
          <div className="mt-auto border-t border-outline-variant p-sm flex flex-col gap-xxs">
            <a className="flex items-center gap-md px-lg py-sm cursor-pointer hover:bg-surface-container-highest transition-all text-on-surface-variant" href="/support">
              <span className="material-symbols-outlined">contact_support</span>
              <span className="font-label-md text-label-md">Support</span>
            </a>
            <a className="flex items-center gap-md px-lg py-sm cursor-pointer hover:bg-surface-container-highest transition-all text-on-surface-variant" href="/login">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-md text-label-md">Logout</span>
            </a>
          </div>
        </aside>
        {/* Main Content Wrapper */}
        <div className="ml-60 flex flex-col min-h-screen">
          {/* TopNavBar Anchor */}
          <header className="w-full h-16 bg-surface border-b border-outline-variant z-40 sticky top-0">
            <div className="flex items-center justify-between px-[1.5rem] w-full max-w-[1600px] mx-auto h-full">
              <div className="flex items-center gap-lg">
                <span className="text-headline-sm font-headline-sm text-primary">KAMLOG EM-ERP</span>
                <div className={`hidden md:flex bg-surface-container-low rounded-lg px-sm py-xs items-center gap-sm border ${tCodeFocused ? 'border-primary shadow-md' : 'border-outline-variant'} transition-all`}>
                  <span className="material-symbols-outlined text-outline">search</span>
                  <input 
                    className="bg-transparent border-none focus:ring-0 text-body-sm w-48" 
                    placeholder="T-Code Search..." 
                    type="text"
                    onFocus={() => setTCodeFocused(true)}
                    onBlur={() => setTCodeFocused(false)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-md">
                <button className="p-xs hover:bg-surface-container-highest transition-colors rounded-full cursor-pointer">
                  <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                </button>
                <button className="p-xs hover:bg-surface-container-highest transition-colors rounded-full cursor-pointer">
                  <span className="material-symbols-outlined text-on-surface-variant">help</span>
                </button>
                <button className="p-xs hover:bg-surface-container-highest transition-colors rounded-full cursor-pointer">
                  <span className="material-symbols-outlined text-on-surface-variant">settings</span>
                </button>
                <div className="h-8 w-8 rounded-full overflow-hidden border border-outline ml-sm">
                  <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuFOyoGmtBAU67siF5vTrMPPDwhsprQVary-BlFLWwVLWD3e1BTNFOedOtK1AsLwVZV7Dfbkbmfr1pUe00hvh_2pwBinu7Wk6Lm424kFFJBpBgM4wk9lCqTKKKRgoDbvn7TSBsnNDk8wgYCrD9fND29KVaCins1kq9WsnGnnSfk4g-QpyqN0ScNq242UXJKFklYz3hhutsSvknyp7V_aSNoy8rc7NgcarVsKhPN184VYR1r-z9PdkF3szMzQEMFZTec0nOonFUvQ"/>
                </div>
              </div>
            </div>
          </header>
          {/* Main Content Area */}
          <main className="flex-1 p-[1.5rem] w-full max-w-[1600px] mx-auto">
            {/* Breadcrumbs */}
            <nav className="mb-lg">
              <ol className="flex items-center gap-xxs text-label-md font-label-md text-on-surface-variant">
                <li><a className="hover:text-primary" href="#">Admin</a></li>
                <li><span className="material-symbols-outlined text-[14px]">chevron_right</span></li>
                <li><a className="hover:text-primary" href="#">User Management</a></li>
                <li><span className="material-symbols-outlined text-[14px]">chevron_right</span></li>
                <li className="text-primary font-bold">New User</li>
              </ol>
            </nav>
            <div className="flex justify-between items-end mb-xl">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-background">Create New User</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Configure profile, security, and access duration for the employee.</p>
              </div>
              <div className="flex gap-sm">
                <button className="px-lg py-sm bg-surface border border-outline text-on-surface font-label-md text-label-md rounded hover:bg-surface-container-high transition-all">Cancel</button>
                <button className="px-lg py-sm bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-primary-container transition-all flex items-center gap-xs shadow-sm">
                  <span className="material-symbols-outlined">save</span>
                  Save User
                </button>
              </div>
            </div>
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
                      <label className="font-label-md text-label-md text-on-surface-variant">First Name</label>
                      <input 
                        className="border border-outline-variant rounded p-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-low" 
                        placeholder="e.g. Jean" 
                        type="text"
                        onFocus={() => handleInputFocus('firstName')}
                        onBlur={handleInputBlur}
                      />
                    </div>
                    <div className={`flex flex-col gap-xxs transition-transform ${inputFocused === 'lastName' ? 'scale-[1.01]' : ''}`}>
                      <label className="font-label-md text-label-md text-on-surface-variant">Last Name</label>
                      <input 
                        className="border border-outline-variant rounded p-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-low" 
                        placeholder="e.g. Dupont" 
                        type="text"
                        onFocus={() => handleInputFocus('lastName')}
                        onBlur={handleInputBlur}
                      />
                    </div>
                    <div className={`flex flex-col gap-xxs transition-transform ${inputFocused === 'email' ? 'scale-[1.01]' : ''}`}>
                      <label className="font-label-md text-label-md text-on-surface-variant">Email Address</label>
                      <input 
                        className="border border-outline-variant rounded p-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-low" 
                        placeholder="j.dupont@kamlog.com" 
                        type="email"
                        onFocus={() => handleInputFocus('email')}
                        onBlur={handleInputBlur}
                      />
                    </div>
                    <div className={`flex flex-col gap-xxs transition-transform ${inputFocused === 'department' ? 'scale-[1.01]' : ''}`}>
                      <label className="font-label-md text-label-md text-on-surface-variant">Department</label>
                      <select 
                        className="border border-outline-variant rounded p-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-low"
                        onFocus={() => handleInputFocus('department')}
                        onBlur={handleInputBlur}
                      >
                        <option value="">Select Department</option>
                        <option value="logistics">K-Logistics</option>
                        <option value="finance">K-Finance</option>
                        <option value="magasin">K-Magasin</option>
                        <option value="it">IT Administration</option>
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
                    <div>
                      <div className="flex justify-between items-center mb-xs">
                        <label className="font-label-md text-label-md text-on-surface-variant">Password Strength</label>
                        <span className="font-label-sm text-label-sm text-secondary font-bold">Compliant</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-secondary"></div>
                      </div>
                      <p className="text-label-sm font-label-sm text-outline mt-xs">Passwords must contain at least 12 characters, including special symbols.</p>
                    </div>
                    <div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg border border-outline-variant">
                      <div className="flex items-center gap-md">
                        <span className="material-symbols-outlined text-on-surface-variant">vibration</span>
                        <div>
                          <p className="font-title-md text-title-md font-bold">Multi-Factor Authentication (MFA)</p>
                          <p className="text-body-sm font-body-sm text-on-surface-variant">Require mobile app verification for every login.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input checked className="sr-only peer" type="checkbox" value=""/>
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </section>
              </div>
              {/* Right Column: Access & Summary */}
              <div className="lg:col-span-4 space-y-[1rem]">
                {/* Access Duration Card */}
                <section className="bg-white border border-outline-variant p-lg rounded-lg shadow-sm">
                  <div className="flex items-center gap-sm mb-lg border-b border-surface-container-highest pb-sm">
                    <span className="material-symbols-outlined text-primary">event_available</span>
                    <h3 className="font-title-md text-title-md font-bold">Access Duration</h3>
                  </div>
                  <div className="space-y-lg">
                    <div className={`flex flex-col gap-xxs transition-transform ${inputFocused === 'startDate' ? 'scale-[1.01]' : ''}`}>
                      <label className="font-label-md text-label-md text-on-surface-variant">Start Date</label>
                      <div className="relative">
                        <input 
                          className="w-full border border-outline-variant rounded p-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-low" 
                          type="date"
                          onFocus={() => handleInputFocus('startDate')}
                          onBlur={handleInputBlur}
                        />
                      </div>
                    </div>
                    <div className={`flex flex-col gap-xxs transition-transform ${inputFocused === 'endDate' ? 'scale-[1.01]' : ''}`}>
                      <label className="font-label-md text-label-md text-on-surface-variant">End Date (Optional)</label>
                      <div className="relative">
                        <input 
                          className="w-full border border-outline-variant rounded p-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-low" 
                          type="date"
                          onFocus={() => handleInputFocus('endDate')}
                          onBlur={handleInputBlur}
                        />
                      </div>
                      <p className="text-label-sm font-label-sm text-outline">Account will automatically deactivate on this date.</p>
                    </div>
                  </div>
                </section>
                {/* Profile Preview/Quick Info */}
                <section className="bg-primary text-on-primary p-lg rounded-lg shadow-md relative overflow-hidden">
                  {/* Decorative background element */}
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
                {/* Bento-style Helper Cards */}
                <div className="grid grid-cols-2 gap-sm">
                  <div className="bg-surface-container-high p-sm rounded border border-outline-variant flex flex-col gap-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">help_center</span>
                    <span className="font-label-sm text-label-sm font-bold">Policy Guide</span>
                  </div>
                  <div className="bg-surface-container-high p-sm rounded border border-outline-variant flex flex-col gap-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                    <span className="font-label-sm text-label-sm font-bold">Audit Logs</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Form Help Section */}
            <div className="mt-xl grid grid-cols-1 md:grid-cols-3 gap-lg border-t border-outline-variant pt-lg">
              <div className="flex items-start gap-md">
                <div className="bg-surface-container p-xs rounded-full">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md font-bold">Role-Based Access</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Access levels are inherited from department settings automatically.</p>
                </div>
              </div>
              <div className="flex items-start gap-md">
                <div className="bg-surface-container p-xs rounded-full">
                  <span className="material-symbols-outlined text-primary">sync</span>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md font-bold">Directory Sync</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Profile data syncs with corporate AD every 4 hours.</p>
                </div>
              </div>
              <div className="flex items-start gap-md">
                <div className="bg-surface-container p-xs rounded-full">
                  <span className="material-symbols-outlined text-primary">gpp_good</span>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md font-bold">Secure Provisioning</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Encrypted credential delivery via secure company portal.</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
