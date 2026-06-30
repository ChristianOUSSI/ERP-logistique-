// src/app/(app)/security/notifications/page.tsx - Security Notification Settings & Escalation - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SecurityNotifications() {
  const router = useRouter()

  const accessControls = [
    { trigger: 'Multiple Failed Logins', description: 'Triggered after 5 unsuccessful attempts from same IP', email: true, sms: false, inApp: true, severity: 'High', severityColor: 'bg-error-container text-on-error-container' },
    { trigger: 'Unusual Geolocation Access', description: 'Successful login from a blacklisted or new country', email: true, sms: true, inApp: true, severity: 'Critical', severityColor: 'bg-tertiary-container text-on-tertiary-container' },
    { trigger: 'MFA Bypass Attempt', description: 'Detecting attempts to disable or skip 2FA', email: true, sms: false, inApp: true, severity: 'High', severityColor: 'bg-error-container text-on-error-container' }
  ]

  const privilegeControls = [
    { trigger: 'Privilege Escalation Detected', description: 'User assigned to Super-Admin role outside of Change Request', email: true, sms: true, inApp: true, severity: 'Critical', severityColor: 'bg-tertiary-container text-on-tertiary-container' },
    { trigger: 'Bulk Data Export', description: 'More than 500 records exported in a single session', email: true, sms: false, inApp: true, severity: 'Medium', severityColor: 'bg-primary/10 text-primary' }
  ]

  const handleSave = () => {
    // Save configuration - will be connected to backend
  }

  const handleDiscard = () => {
    router.push('/security/policies')
  }

  const handleQuickTest = () => {
    // Quick test alert - will be connected to backend
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
        }
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1rem;
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #c2c6d6; border-radius: 4px; }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md text-body-md antialiased min-h-screen flex flex-col">
        
        
        
        <aside className="fixed left-0 top-0 h-full w-60 bg-surface-container-low flex flex-col pt-14 z-40 border-r border-outline-variant">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-white">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm font-black text-secondary">K-AUDIT</h2>
                <p className="font-label-sm text-label-sm text-outline">Module: Audit & Security</p>
              </div>
            </div>
            
            <button onClick={() => router.push('/security/reports')} className="mt-8 w-full bg-secondary text-white py-3 rounded-lg font-label-md text-label-md hover:opacity-90 active:opacity-80 transition-opacity">
              Generate Forensic Report
            </button>
          </div>
          <div className="mt-auto p-6 border-t border-outline-variant">
            <a onClick={() => router.push('/settings')} className="flex items-center px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded transition-all cursor-pointer">
              <span className="material-symbols-outlined mr-3">settings</span>
              <span className="font-label-md text-label-md">Settings</span>
            </a>
            <a onClick={() => router.push('/support')} className="flex items-center px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded transition-all cursor-pointer">
              <span className="material-symbols-outlined mr-3">help</span>
              <span className="font-label-md text-label-md">Support</span>
            </a>
          </div>
        </aside>
        {/* Main Content Stage */}
        <main className="pt-14 flex-1 overflow-y-auto bg-surface-container-low">
          <div className="max-w-[1600px] mx-auto p-[1rem]">
            {/* Breadcrumbs & Header */}
            <div className="mb-8">
              
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-headline-lg text-headline-lg text-on-background">Security: Notification Settings & Escalation</h1>
                  <p className="text-on-surface-variant mt-1">Configure automated alert triggers, delivery channels, and critical response protocols.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleDiscard} className="px-4 py-2 border border-outline text-on-surface rounded font-label-md text-label-md hover:bg-surface-container-high transition-colors">Discard Changes</button>
                  <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded font-label-md text-label-md shadow-sm hover:opacity-90 active:scale-95 transition-all">Save Configuration</button>
                </div>
              </div>
            </div>
            <div className="bento-grid">
              {/* Alert Categories Section */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Brute Force & Access Control Card */}
                <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 bg-surface-container border-b border-outline-variant flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">lock_reset</span>
                      <h3 className="font-title-lg text-title-lg">Access & Brute Force Controls</h3>
                    </div>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider">Active</span>
                  </div>
                  <div className="p-0">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase">
                        <tr>
                          <th className="px-6 py-3 font-medium">Event Trigger</th>
                          <th className="px-4 py-3 font-medium text-center">Email</th>
                          <th className="px-4 py-3 font-medium text-center">SMS</th>
                          <th className="px-4 py-3 font-medium text-center">In-App</th>
                          <th className="px-6 py-3 font-medium text-right">Severity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {accessControls.map((control, index) => (
                          <tr key={index} className="hover:bg-surface-bright transition-colors group">
                            <td className="px-6 py-4">
                              <div className="font-title-md text-title-md text-on-surface">{control.trigger}</div>
                              <div className="font-body-sm text-body-sm text-on-surface-variant">{control.description}</div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <input checked={control.email} className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <input checked={control.sms} className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <input checked={control.inApp} className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`${control.severityColor} px-2 py-0.5 rounded font-label-sm text-label-sm`}>{control.severity}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Privilege & Data Card */}
                <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 bg-surface-container border-b border-outline-variant flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary">admin_panel_settings</span>
                      <h3 className="font-title-lg text-title-lg">Privilege Escalation & Modification</h3>
                    </div>
                    <span className="bg-secondary-container/20 text-secondary px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider">Active</span>
                  </div>
                  <div className="p-0">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase">
                        <tr>
                          <th className="px-6 py-3 font-medium">Event Trigger</th>
                          <th className="px-4 py-3 font-medium text-center">Email</th>
                          <th className="px-4 py-3 font-medium text-center">SMS</th>
                          <th className="px-4 py-3 font-medium text-center">In-App</th>
                          <th className="px-6 py-3 font-medium text-right">Severity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {privilegeControls.map((control, index) => (
                          <tr key={index} className="hover:bg-surface-bright transition-colors group">
                            <td className="px-6 py-4">
                              <div className="font-title-md text-title-md text-on-surface">{control.trigger}</div>
                              <div className="font-body-sm text-body-sm text-on-surface-variant">{control.description}</div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <input checked={control.email} className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <input checked={control.sms} className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <input checked={control.inApp} className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`${control.severityColor} px-2 py-0.5 rounded font-label-sm text-label-sm`}>{control.severity}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Escalation Policies & Summary Sidebar */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Escalation Policy Card */}
                <div className="bg-white border border-outline-variant rounded-xl shadow-sm h-fit">
                  <div className="p-4 border-b border-outline-variant flex items-center justify-between">
                    <h3 className="font-title-lg text-title-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">trending_up</span>
                      Escalation Policies
                    </h3>
                    <button className="p-1 hover:bg-surface-container rounded-full"><span className="material-symbols-outlined">add</span></button>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Tier 1 */}
                    <div className="p-3 border border-outline-variant rounded-lg bg-surface-bright">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">TIER 1 (Immediate)</span>
                        <span className="text-tertiary-container font-bold text-xxs px-1.5 py-0.5 rounded border border-tertiary-container">CRITICAL</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className="flex items-center gap-1.5 bg-surface-container px-2 py-1 rounded text-body-sm">
                          <img alt="Officer" className="w-4 h-4 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTykZFQSVP9VvA8Ys8lmYQgd_wqWlIIGB--DSmv2QzpocgiAvzTQwFKHGwHT1WdVelfG-mJLa1CHZ0pLFGMkCPvjTkGIYa94Wm-KMdPw12dqT2V0tdO3M-gHepDbaEPKOfQ2J0qb_rVnzvicSmMpZougQH3B4p3erKtWjNyQGOahOWy1atzQPMHtjcdLIMc6qcC6uASdJJ7mDjb9vmpkIF0PjP3-EOzl-EwYKXN4XhdEDWcvb23pc-ilyzhFQj0KUEbMsIVHy_RZU"/>
                          <span>Chief Security Off.</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-surface-container px-2 py-1 rounded text-body-sm">
                          <img alt="Admin" className="w-4 h-4 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqWmd9UlG4N8t0kbDhaOK_Q6ZkQpG0RbDnBMDznxcccHnhToRlMNTdKW1P5fxPOhuVcT4s1bQrgnyq3ADpUho3jVkBkDMLH5cNO21249iHxdnRW_kRPVTndgUxIZdDsu3HjI6uLUgbKHgUYU41wpY46ZZmJUEJFOS_KQFHlCnvySMm9DW0tkTt3UkFzds429WwSfVCLfxE_ox9w5R2sOBQ70l7Z-qnDonQSECob2jI7AvQZYExgW42vpYEm6vsQLsY5HJ8GCSFgGk"/>
                          <span>System Admin</span>
                        </div>
                      </div>
                      <p className="text-body-sm text-on-surface-variant italic">Method: Phone Call & SMS Push</p>
                    </div>
                    {/* Tier 2 */}
                    <div className="p-3 border border-outline-variant rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">TIER 2 (+30 mins)</span>
                        <span className="text-error font-bold text-xxs px-1.5 py-0.5 rounded border border-error">HIGH</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className="flex items-center gap-1.5 bg-surface-container px-2 py-1 rounded text-body-sm">
                          <img alt="Duty" className="w-4 h-4 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCi1nllZKUd9D0TY67FX0f7LyPqJSafPK24dSiM7S_E_1VAJE19t6MC0-8XSKEY5bf7snQ5J6ELci8qFJ8UOwry2WjxG7F_PPbQDp4niJaIkgJjdYYcVXbBskxN4FKjRbb9BRD_MiK333JR8bUVID0GnIOrofrJQLtr4kANJRtxVzCjOx5H3DJy4LTbamtGwEhW7i3Z-oIYb2hJR34UfsSX--158QdxzXUc99SSatXUKA9I6HXamSg_St5jtikfJLkXthfq7H1h4xc"/>
                          <span>On-Duty Supervisor</span>
                        </div>
                      </div>
                      <p className="text-body-sm text-on-surface-variant italic">Method: Email & In-App Slack Hook</p>
                    </div>
                    <div className="pt-2">
                      <button className="w-full text-center text-primary font-label-md text-label-md hover:underline">Manage Global Recipients List</button>
                    </div>
                  </div>
                </div>
                {/* Visual Context Card */}
                <div className="relative h-64 rounded-xl overflow-hidden shadow-sm group">
                  <img alt="Security Ops" className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHzDY6apWzAIPtx9ODrL7zqIPdj4chmEoKJ2U4y9Rv7DuqwC6sXN7rDatPndPhxwvUP1_tr0Gb40mG-smQDfPOCf_y1o0wFIkS5YUvbob7HlVpyUyHQzp8yeTnupJ8ALlKCVFA0F9bTxU8CH3KQPy-0HJsnzF3GP-tN3VAWYC-0fMzZMjAzh_GnwpHUqJn2IP-M205yW-wmzlQAfQvklfPh4jF1bZtsouP3Ye2qUn3BAwhxRT9WF0dXLYTyz6JtndOZnVvOJ1TfTw"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                    <h4 className="text-white font-headline-sm text-headline-sm">Operational Readiness</h4>
                    <p className="text-surface-container-highest/80 text-body-sm">Configurations are synchronized with the 24/7 Security Operations Center (SOC).</p>
                  </div>
                </div>
                {/* Global Delivery Status */}
                <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
                  <h3 className="font-title-md text-title-md mb-4 border-b pb-2">Global Delivery Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">mail</span>
                        <span className="text-body-md">Email Gateway</span>
                      </div>
                      <span className="flex items-center gap-1 text-secondary font-label-sm text-label-sm">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span> Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">sms</span>
                        <span className="text-body-md">SMS Service (Twilio)</span>
                      </div>
                      <span className="flex items-center gap-1 text-secondary font-label-sm text-label-sm">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span> Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-error">webhook</span>
                        <span className="text-body-md">External Webhooks</span>
                      </div>
                      <span className="flex items-center gap-1 text-error font-label-sm text-label-sm">
                        <span className="w-1.5 h-1.5 bg-error rounded-full"></span> Error
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* FAB for quick action */}
        <button onClick={handleQuickTest} className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-50">
          <span className="material-symbols-outlined">bolt</span>
          <span className="absolute right-full mr-4 bg-inverse-surface text-inverse-on-surface px-3 py-1 rounded text-label-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Quick Test Alert</span>
        </button>
      </div>
    </>
  )
}
