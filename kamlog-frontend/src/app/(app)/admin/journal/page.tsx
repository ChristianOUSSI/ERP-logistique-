// src/app/(app)/admin/journal/page.tsx - Journal d'Activité Administrative - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'

export default function Journal() {
  const [inputFocused, setInputFocused] = useState<string | null>(null)

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
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #dce2f3; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #727785; }
        
        .erp-table tr:nth-child(even) { background-color: #f9f9ff; }
        .erp-table tr:hover { background-color: #f0f3ff; transition: background-color 0.15s ease; }
        
        .severity-critical { color: #ba1a1a; background-color: rgba(186, 26, 26, 0.1); }
        .severity-warning { color: #825100; background-color: rgba(130, 81, 0, 0.1); }
        .severity-info { color: #0058be; background-color: rgba(0, 88, 190, 0.1); }
      `}</style>
      <div className="bg-surface-container-low font-body-md text-on-surface antialiased overflow-hidden h-screen flex">
        
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
          
          
          {/* Activity Log Content Stage */}
          <section className="flex-1 overflow-y-auto p-[1rem] space-y-lg relative">
            {/* Background Decorative Element */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
            {/* Dashboard Header & Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-lg">
              <div>
                
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Journaux d'Activité de Sécurité</h2>
                <p className="text-body-md text-outline">Surveillance en temps réel des accès, privilèges et modifications critiques du système.</p>
              </div>
              <div className="flex items-center gap-sm">
                <button className="px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-label-md font-bold flex items-center gap-xs hover:bg-surface-container-high transition-all">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Exporter CSV</span>
                </button>
                <button className="px-md py-sm bg-primary text-on-primary rounded-lg text-label-md font-bold flex items-center gap-xs hover:bg-primary-container transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  <span>Rafraîchir</span>
                </button>
              </div>
            </div>
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-[1rem]">
              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-sm">
                  <div className="p-xs bg-error-container text-on-error-container rounded-lg">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <span className="text-label-sm text-error font-bold">+12% vs hier</span>
                </div>
                <p className="text-label-md text-outline uppercase tracking-wider">Alertes Critiques</p>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">24</h3>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-sm">
                  <div className="p-xs bg-secondary-container text-on-secondary-container rounded-lg">
                    <span className="material-symbols-outlined">key</span>
                  </div>
                </div>
                <p className="text-label-md text-outline uppercase tracking-wider">Réinitialisations Password</p>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">142</h3>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-sm">
                  <div className="p-xs bg-primary-fixed text-on-primary-fixed rounded-lg">
                    <span className="material-symbols-outlined icon-fill">shield</span>
                  </div>
                </div>
                <p className="text-label-md text-outline uppercase tracking-wider">Activations MFA</p>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">98%</h3>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-sm">
                  <div className="p-xs bg-surface-variant text-on-surface-variant rounded-lg">
                    <span className="material-symbols-outlined">lock_reset</span>
                  </div>
                </div>
                <p className="text-label-md text-outline uppercase tracking-wider">Comptes Verrouillés</p>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">5</h3>
              </div>
            </div>
            {/* Filters Bar */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-md items-end">
                <div className={`space-y-xxs transition-transform ${inputFocused === 'period' ? 'scale-[1.01]' : ''}`}>
                  <label className="text-label-sm font-bold text-on-surface-variant">Période</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs text-body-sm focus:ring-primary" 
                      type="date"
                      onFocus={() => handleInputFocus('period')}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>
                <div className={`space-y-xxs transition-transform ${inputFocused === 'admin' ? 'scale-[1.01]' : ''}`}>
                  <label className="text-label-sm font-bold text-on-surface-variant">Administrateur</label>
                  <select 
                    className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs text-body-sm focus:ring-primary"
                    onFocus={() => handleInputFocus('admin')}
                    onBlur={handleInputBlur}
                  >
                    <option>Tous les admins</option>
                    <option>Admin_SYSTEM</option>
                    <option>Audit_User_01</option>
                  </select>
                </div>
                <div className={`space-y-xxs transition-transform ${inputFocused === 'user' ? 'scale-[1.01]' : ''}`}>
                  <label className="text-label-sm font-bold text-on-surface-variant">Utilisateur Affecté</label>
                  <input 
                    className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs text-body-sm focus:ring-primary" 
                    placeholder="ID ou Email..." 
                    type="text"
                    onFocus={() => handleInputFocus('user')}
                    onBlur={handleInputBlur}
                  />
                </div>
                <div className={`space-y-xxs transition-transform ${inputFocused === 'eventType' ? 'scale-[1.01]' : ''}`}>
                  <label className="text-label-sm font-bold text-on-surface-variant">Type d'Évènement</label>
                  <select 
                    className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-xs text-body-sm focus:ring-primary"
                    onFocus={() => handleInputFocus('eventType')}
                    onBlur={handleInputBlur}
                  >
                    <option>Tous</option>
                    <option>Roles</option>
                    <option>MFA</option>
                    <option>Locks</option>
                  </select>
                </div>
                <div className="flex gap-sm">
                  <button className="flex-1 h-[34px] bg-primary-fixed text-on-primary-fixed-variant rounded-lg text-label-md font-bold hover:bg-primary-fixed-dim transition-all">Filtrer</button>
                  <button className="p-xs border border-outline-variant rounded-lg hover:bg-surface-container-high" title="Effacer les filtres">
                    <span className="material-symbols-outlined text-[20px]">filter_alt_off</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Activity Table Container */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full erp-table text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container border-b border-outline-variant text-label-md text-outline uppercase tracking-wider">
                      <th className="px-lg py-md font-bold">Horodatage</th>
                      <th className="px-lg py-md font-bold">Sévérité</th>
                      <th className="px-lg py-md font-bold">Évènement</th>
                      <th className="px-lg py-md font-bold">Admin</th>
                      <th className="px-lg py-md font-bold">Cible</th>
                      <th className="px-lg py-md font-bold text-right">Détails</th>
                    </tr>
                  </thead>
                  <tbody className="text-body-sm">
                    {/* Entry 1: Critical */}
                    <tr className="border-b border-outline-variant">
                      <td className="px-lg py-md font-data-tabular">2023-11-24 14:22:05</td>
                      <td className="px-lg py-md">
                        <span className="px-xs py-0.5 rounded-full text-[10px] font-bold uppercase severity-critical border border-error">Critical</span>
                      </td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[18px]">lock</span>
                          <span>Account Lockout (3 Failed MFA)</span>
                        </div>
                      </td>
                      <td className="px-lg py-md">System_Daemon</td>
                      <td className="px-lg py-md font-bold">kam_transport_04</td>
                      <td className="px-lg py-md text-right">
                        <button className="p-xs hover:bg-surface-container-high rounded-lg text-primary">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </td>
                    </tr>
                    {/* Entry 2: Warning */}
                    <tr className="border-b border-outline-variant">
                      <td className="px-lg py-md font-data-tabular">2023-11-24 13:45:12</td>
                      <td className="px-lg py-md">
                        <span className="px-xs py-0.5 rounded-full text-[10px] font-bold uppercase severity-warning border border-tertiary">Warning</span>
                      </td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                          <span>Role Escalation (Admin)</span>
                        </div>
                      </td>
                      <td className="px-lg py-md">Admin_SYSTEM</td>
                      <td className="px-lg py-md font-bold">j.marcel@kamlog.cm</td>
                      <td className="px-lg py-md text-right">
                        <button className="p-xs hover:bg-surface-container-high rounded-lg text-primary">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </td>
                    </tr>
                    {/* Entry 3: Info */}
                    <tr className="border-b border-outline-variant">
                      <td className="px-lg py-md font-data-tabular">2023-11-24 13:02:44</td>
                      <td className="px-lg py-md">
                        <span className="px-xs py-0.5 rounded-full text-[10px] font-bold uppercase severity-info border border-primary">Info</span>
                      </td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[18px]">password</span>
                          <span>Password Reset Requested</span>
                        </div>
                      </td>
                      <td className="px-lg py-md">Self-Service</td>
                      <td className="px-lg py-md font-bold">k.loic@kamlog.cm</td>
                      <td className="px-lg py-md text-right">
                        <button className="p-xs hover:bg-surface-container-high rounded-lg text-primary">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </td>
                    </tr>
                    {/* Entry 4: Info */}
                    <tr className="border-b border-outline-variant">
                      <td className="px-lg py-md font-data-tabular">2023-11-24 12:40:18</td>
                      <td className="px-lg py-md">
                        <span className="px-xs py-0.5 rounded-full text-[10px] font-bold uppercase severity-info border border-primary">Info</span>
                      </td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[18px]">domain_verification</span>
                          <span>MFA Activation Success</span>
                        </div>
                      </td>
                      <td className="px-lg py-md">Audit_User_01</td>
                      <td className="px-lg py-md font-bold">a.ndoumbe@kamlog.cm</td>
                      <td className="px-lg py-md text-right">
                        <button className="p-xs hover:bg-surface-container-high rounded-lg text-primary">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </td>
                    </tr>
                    {/* Entry 5: Critical */}
                    <tr className="border-b border-outline-variant">
                      <td className="px-lg py-md font-data-tabular">2023-11-24 11:15:30</td>
                      <td className="px-lg py-md">
                        <span className="px-xs py-0.5 rounded-full text-[10px] font-bold uppercase severity-critical border border-error">Critical</span>
                      </td>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[18px]">dangerous</span>
                          <span>Manual Account Suspension</span>
                        </div>
                      </td>
                      <td className="px-lg py-md">Admin_SYSTEM</td>
                      <td className="px-lg py-md font-bold">external_vendor_88</td>
                      <td className="px-lg py-md text-right">
                        <button className="p-xs hover:bg-surface-container-high rounded-lg text-primary">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="p-md bg-surface border-t border-outline-variant flex justify-between items-center">
                <p className="text-label-sm text-outline">Affichage de 1-5 sur 482 entrées</p>
                <div className="flex items-center gap-xs">
                  <button className="p-xs rounded border border-outline-variant hover:bg-surface-container-high disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 bg-primary text-on-primary rounded font-bold text-label-md">1</button>
                  <button className="w-8 h-8 hover:bg-surface-container-high rounded font-bold text-label-md">2</button>
                  <button className="w-8 h-8 hover:bg-surface-container-high rounded font-bold text-label-md">3</button>
                  <span className="px-xs text-outline">...</span>
                  <button className="w-8 h-8 hover:bg-surface-container-high rounded font-bold text-label-md">97</button>
                  <button className="p-xs rounded border border-outline-variant hover:bg-surface-container-high">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Detail Pane / Side Sheet */}
            <div className="hidden lg:grid grid-cols-3 gap-[1rem]">
              <div className="col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
                <div className="flex items-center justify-between mb-md">
                  <h3 className="font-title-lg text-title-lg font-bold">Analyses de Fréquence</h3>
                  <span className="text-label-sm text-outline">7 derniers jours</span>
                </div>
                <div className="h-48 w-full bg-surface-container-low rounded-lg flex items-end justify-between p-md gap-xs">
                  {/* Chart Mockup */}
                  <div className="w-full bg-primary/20 h-1/2 rounded-t-sm relative group">
                    <div className="absolute inset-0 bg-primary h-0 group-hover:h-full transition-all duration-500"></div>
                  </div>
                  <div className="w-full bg-primary/20 h-3/4 rounded-t-sm relative group">
                    <div className="absolute inset-0 bg-primary h-0 group-hover:h-full transition-all duration-500"></div>
                  </div>
                  <div className="w-full bg-primary/20 h-2/3 rounded-t-sm relative group">
                    <div className="absolute inset-0 bg-primary h-0 group-hover:h-full transition-all duration-500"></div>
                  </div>
                  <div className="w-full bg-primary/20 h-1/4 rounded-t-sm relative group">
                    <div className="absolute inset-0 bg-primary h-0 group-hover:h-full transition-all duration-500"></div>
                  </div>
                  <div className="w-full bg-primary/20 h-4/5 rounded-t-sm relative group">
                    <div className="absolute inset-0 bg-primary h-0 group-hover:h-full transition-all duration-500"></div>
                  </div>
                  <div className="w-full bg-primary/20 h-1/2 rounded-t-sm relative group">
                    <div className="absolute inset-0 bg-primary h-0 group-hover:h-full transition-all duration-500"></div>
                  </div>
                  <div className="w-full bg-primary/20 h-full rounded-t-sm relative group">
                    <div className="absolute inset-0 bg-primary h-0 group-hover:h-full transition-all duration-500"></div>
                  </div>
                </div>
              </div>
              <div className="bg-primary p-lg rounded-xl shadow-lg text-on-primary flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <span className="material-symbols-outlined text-[160px]">verified</span>
                </div>
                <div>
                  <h4 className="font-title-md text-title-md font-bold mb-xs">Conformité Audit</h4>
                  <p className="text-body-sm opacity-80">Votre instance ERP respecte les standards ISO/IEC 27001 pour la journalisation des accès.</p>
                </div>
                <div className="mt-lg">
                  <div className="flex items-center gap-sm mb-xs">
                    <div className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-4/5"></div>
                    </div>
                    <span className="text-label-sm font-bold">85%</span>
                  </div>
                  <p className="text-label-sm uppercase font-black">Score de Sécurité Global</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
