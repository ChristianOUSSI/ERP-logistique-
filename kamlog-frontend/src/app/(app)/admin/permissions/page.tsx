// src/app/(app)/admin/permissions/page.tsx - Permissions - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'

export default function Permissions() {
  const [searchFocused, setSearchFocused] = useState(false)
  const [checkboxStates, setCheckboxStates] = useState<Record<string, boolean>>({})

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckboxStates(prev => ({ ...prev, [id]: checked }))
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .matrix-cell:hover { background-color: rgba(0, 88, 190, 0.05); }
      `}</style>
      <div className="bg-surface-container-low font-body-md text-on-surface">
        {/* Primary Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col p-[1.5rem] z-50">
          <div className="px-[1.5rem] py-xl">
            <h1 className="font-headline-md text-headline-md text-primary font-bold">KAMLOG ERP</h1>
            <p className="font-label-caps text-label-caps text-secondary uppercase tracking-widest text-[10px] mt-1">Port Operations</p>
          </div>
          <button className="mx-[1.5rem] mb-lg bg-primary text-on-primary py-sm px-md rounded-lg flex items-center justify-center gap-xs font-bold active:scale-95 duration-150 transition-all">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="font-label-md text-label-md">Nouvelle Opération</span>
          </button>
          <nav className="flex-1 px-xs space-y-xxs">
            <a className="flex items-center gap-sm px-[1.5rem] py-sm rounded-lg text-secondary hover:bg-surface-container-high transition-colors group" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-caps text-label-caps">Tableau de bord</span>
            </a>
            <a className="flex items-center gap-sm px-[1.5rem] py-sm rounded-lg text-secondary hover:bg-surface-container-high transition-colors group" href="#">
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="font-label-caps text-label-caps">Transport</span>
            </a>
            <a className="flex items-center gap-sm px-[1.5rem] py-sm rounded-lg text-secondary hover:bg-surface-container-high transition-colors group" href="#">
              <span className="material-symbols-outlined">payments</span>
              <span className="font-label-caps text-label-caps">Finances</span>
            </a>
            <a className="flex items-center gap-sm px-[1.5rem] py-sm rounded-lg text-secondary hover:bg-surface-container-high transition-colors group" href="#">
              <span className="material-symbols-outlined">minor_crash</span>
              <span className="font-label-caps text-label-caps">Parc Automobile</span>
            </a>
            <a className="flex items-center gap-sm px-[1.5rem] py-sm rounded-lg text-primary bg-secondary-container font-bold transition-colors group" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-caps text-label-caps">Paramètres</span>
            </a>
          </nav>
          <div className="mt-auto p-[1.5rem] border-t border-outline-variant">
            <a className="flex items-center gap-sm px-[1.5rem] py-sm rounded-lg text-secondary hover:bg-surface-container-high transition-colors" href="#">
              <span className="material-symbols-outlined">help_outline</span>
              <span className="font-label-caps text-label-caps">Support</span>
            </a>
            <a className="flex items-center gap-sm px-[1.5rem] py-sm rounded-lg text-secondary hover:bg-surface-container-high transition-colors" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-caps text-label-caps">Déconnexion</span>
            </a>
          </div>
        </aside>
        {/* Top Navigation Bar */}
        <header className="sticky top-0 ml-[260px] bg-surface border-b border-outline-variant z-40">
          <div className="flex justify-between items-center h-[64px] px-[1.5rem]">
            <div className="flex items-center gap-xl">
              <span className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</span>
              <nav className="hidden md:flex items-center gap-lg">
                <a className="text-on-surface-variant font-body-base hover:text-primary transition-all" href="#">Articles</a>
                <a className="text-on-surface-variant font-body-base hover:text-primary transition-all" href="#">Clients</a>
                <a className="text-on-surface-variant font-body-base hover:text-primary transition-all" href="#">Stocks</a>
                <a className="text-on-surface-variant font-body-base hover:text-primary transition-all" href="#">Rapports</a>
              </nav>
            </div>
            <div className="flex items-center gap-md">
              <div className={`relative group ${searchFocused ? 'ring-2 ring-primary rounded-lg' : ''}`}>
                <input 
                  className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 w-64 focus:ring-0 transition-all text-body-sm" 
                  placeholder="Rechercher T-Code" 
                  type="text"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">search</span>
              </div>
              <div className="flex items-center gap-sm border-l border-outline-variant pl-md">
                <button className="p-xs hover:bg-surface-container-high rounded-full transition-colors relative">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                </button>
                <button className="p-xs hover:bg-surface-container-high rounded-full transition-colors">
                  <span className="material-symbols-outlined">verified_user</span>
                </button>
                <img alt="User profile with MFA status" className="w-8 h-8 rounded-full border border-outline shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTxVCyrn3mLDbBJ3EC4n_Ik42xncgFaI87XM5_DARIo3XLU9BsOC-IkRBod4OivERp31PN0FYHOb1MM4PgsHpjKe37q-QAdlmRHnuChTIZaRDzgx_FIAJ-ZtNmarXGeUNyDLmaOi7x3rkD-LHJl3SSdXSVC9MMqJ26IIYAfZ69fCUACXkHM7g1OvndJrS0AS-h9gWR3F-7RDXDZZYtVfq7hlE-1zkKXOb0WnM8-_1pG_WGao9BLqxdodgPuynMCx4obhHQaur7KA"/>
              </div>
            </div>
          </div>
        </header>
        {/* Main Content Stage */}
        <main className="ml-[260px] p-[1.5rem] min-h-[calc(100vh-64px)]">
          {/* Breadcrumbs & Header */}
          <div className="mb-lg">
            <nav className="flex items-center gap-xs text-on-surface-variant font-label-md mb-xs">
              <span>Administration</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-bold">Rôles & Permissions</span>
            </nav>
            <div className="flex justify-between items-end">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Matrice de Sécurité</h2>
                <p className="text-body-md text-on-surface-variant mt-1">Définissez les privilèges d'accès granulaires pour les modules ERP.</p>
              </div>
              <div className="flex gap-sm">
                <button className="px-md py-sm border border-outline text-primary font-bold rounded-lg flex items-center gap-xs hover:bg-primary-fixed transition-colors">
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  Audit Logs
                </button>
                <button className="px-md py-sm bg-primary text-on-primary font-bold rounded-lg flex items-center gap-xs shadow-sm hover:bg-primary-container transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Appliquer les Changements
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-[1rem]">
            {/* Bento Stats / Info Section */}
            <div className="col-span-12 lg:col-span-3 space-y-[1rem]">
              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm">
                <div className="flex items-center justify-between mb-sm">
                  <h3 className="font-title-md text-title-md">Rôles Actifs</h3>
                  <span className="material-symbols-outlined text-primary">groups</span>
                </div>
                <div className="text-[32px] font-black text-on-surface">14</div>
                <div className="text-body-sm text-on-surface-variant mt-1">+2 créés ce mois-ci</div>
                <div className="mt-md space-y-xs">
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="flex items-center gap-xs"><span className="w-2 h-2 rounded-full bg-primary"></span> Administrateurs</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="flex items-center gap-xs"><span className="w-2 h-2 rounded-full bg-secondary"></span> Opérateurs</span>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="flex items-center gap-xs"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Finance</span>
                    <span className="font-bold">3</span>
                  </div>
                </div>
              </div>
              {/* Special Approvers Section */}
              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm">
                <div className="flex items-center justify-between mb-sm">
                  <h3 className="font-title-md text-title-md">Approbateurs Spéciaux</h3>
                  <span className="material-symbols-outlined text-tertiary">verified</span>
                </div>
                <p className="text-body-sm text-on-surface-variant mb-md">Utilisateurs habilités pour les transactions &gt; 50M FCFA.</p>
                <div className="space-y-sm">
                  <div className="flex items-center gap-md p-xs hover:bg-surface-container rounded-lg transition-colors cursor-pointer">
                    <img alt="Approver Avatar" className="w-10 h-10 rounded-full bg-surface-container-high" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUo6S36vgUeIDaD7scJt1BOn--eFH_NTHwhypelW9fzhLeBVX379QNyAVkHBoCUFxZIO7gO37rqQt8ouHZO-W3_txpevpohL-1ZIsBT5LF5_en8gvFW4MvOanXZs4jYjUSk-skh4iGdbo8JV3h5xv1386x7pOqI61MhsEUSqdEbcyGbseMDJTRQRAZiA1qjjxWmmU41rdtYXluwwgzp6p8HyMSb4xXOkdgOn8rHHZqJCPTXco3kpXAZh6T1HR4fx6iLjcNxMVjhg"/>
                    <div>
                      <div className="font-bold text-body-md">Marc Ebongue</div>
                      <div className="text-label-sm text-on-surface-variant">Direction Financière</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-md p-xs hover:bg-surface-container rounded-lg transition-colors cursor-pointer border-l-2 border-primary bg-primary-fixed/20">
                    <img alt="Approver Avatar" className="w-10 h-10 rounded-full bg-surface-container-high" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGmLAxG3YGJtGipRlcceaURmbsgAYzNA1oDmkZpmyx2kZ1qxOmqT8QbWcjUiyT548yLtTrmyuvbTKfP8CzTL3AAHF0uJGbk4gLdcHqgl0fSLeQ_MgPHGnh2hlL8Jox8bxHEu7KeIu9fpP_JEpE0X15afdpFiESzH2_Clnz6eAclLlMvMxRTMPuim93bV3j47dh-sp4zINHxowX8b7cPpkXQOQwUHrNMr09l2qDgHJXlHFJjytjxdWXMGP4b2VqXA5d-JDojknWuA"/>
                    <div>
                      <div className="font-bold text-body-md">Sarah Kameni</div>
                      <div className="text-label-sm text-on-surface-variant">Chef d'Exploitation</div>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-lg py-xs border-2 border-dashed border-outline-variant rounded-lg text-on-surface-variant font-label-md flex items-center justify-center gap-xs hover:border-primary hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  Ajouter un Approbateur
                </button>
              </div>
            </div>
            {/* Main Permission Matrix */}
            <div className="col-span-12 lg:col-span-9">
              <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                  <div className="flex gap-md">
                    <button className="px-sm py-xs bg-primary-fixed text-primary font-bold rounded text-body-sm">Tous les Modules</button>
                    <button className="px-sm py-xs hover:bg-surface-container rounded text-on-surface-variant text-body-sm">Finance</button>
                    <button className="px-sm py-xs hover:bg-surface-container rounded text-on-surface-variant text-body-sm">Logistique</button>
                    <button className="px-sm py-xs hover:bg-surface-container rounded text-on-surface-variant text-body-sm">Ressources Humaines</button>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="text-label-sm text-on-surface-variant uppercase">Visualisation :</span>
                    <div className="flex bg-surface-container-low p-xxs rounded">
                      <button className="p-xs bg-white shadow-sm rounded"><span className="material-symbols-outlined text-[18px]">grid_on</span></button>
                      <button className="p-xs"><span className="material-symbols-outlined text-[18px]">list</span></button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-surface-container-low sticky top-0 z-10">
                        <th className="p-md font-bold text-label-md border-b border-outline-variant w-64">MODULE / ROLE</th>
                        <th className="p-md font-bold text-label-md border-b border-outline-variant text-center">LIRE</th>
                        <th className="p-md font-bold text-label-md border-b border-outline-variant text-center">ÉCRIRE</th>
                        <th className="p-md font-bold text-label-md border-b border-outline-variant text-center">SUPPRIMER</th>
                        <th className="p-md font-bold text-label-md border-b border-outline-variant text-center">APPROUVER</th>
                        <th className="p-md font-bold text-label-md border-b border-outline-variant text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {/* Module Finance */}
                      <tr className="bg-surface-container-lowest matrix-cell group">
                        <td className="p-md">
                          <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                            </div>
                            <div>
                              <div className="font-bold text-body-md">K-Finance</div>
                              <div className="text-label-sm text-on-surface-variant">Facturation & Audit</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-md text-center">
                          <input 
                            checked 
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange('finance-read', e.target.checked)}
                          />
                        </td>
                        <td className="p-md text-center">
                          <input 
                            checked 
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange('finance-write', e.target.checked)}
                          />
                        </td>
                        <td className="p-md text-center">
                          <input 
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange('finance-delete', e.target.checked)}
                          />
                        </td>
                        <td className="p-md text-center">
                          <input 
                            checked 
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange('finance-approve', e.target.checked)}
                          />
                        </td>
                        <td className="p-md text-right">
                          <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined">edit</span></button>
                        </td>
                      </tr>
                      {/* Module Transport */}
                      <tr className="bg-white matrix-cell group">
                        <td className="p-md">
                          <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary">
                              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                            </div>
                            <div>
                              <div className="font-bold text-body-md">K-Transport</div>
                              <div className="text-label-sm text-on-surface-variant">Gestion de Flotte</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-md text-center">
                          <input 
                            checked 
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange('transport-read', e.target.checked)}
                          />
                        </td>
                        <td className="p-md text-center">
                          <input 
                            checked 
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange('transport-write', e.target.checked)}
                          />
                        </td>
                        <td className="p-md text-center">
                          <input 
                            checked 
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange('transport-delete', e.target.checked)}
                          />
                        </td>
                        <td className="p-md text-center">
                          <input 
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange('transport-approve', e.target.checked)}
                          />
                        </td>
                        <td className="p-md text-right">
                          <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined">edit</span></button>
                        </td>
                      </tr>
                      {/* Module Parc */}
                      <tr className="bg-surface-container-lowest matrix-cell group">
                        <td className="p-md">
                          <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 rounded bg-tertiary/10 flex items-center justify-center text-tertiary">
                              <span className="material-symbols-outlined text-[20px]">warehouse</span>
                            </div>
                            <div>
                              <div className="font-bold text-body-md">K-Parc</div>
                              <div className="text-label-sm text-on-surface-variant">Maintenance Automobile</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-md text-center">
                          <input 
                            checked 
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange('parc-read', e.target.checked)}
                          />
                        </td>
                        <td className="p-md text-center">
                          <input 
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange('parc-write', e.target.checked)}
                          />
                        </td>
                        <td className="p-md text-center">
                          <input 
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange('parc-delete', e.target.checked)}
                          />
                        </td>
                        <td className="p-md text-center">
                          <input 
                            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange('parc-approve', e.target.checked)}
                          />
                        </td>
                        <td className="p-md text-right">
                          <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined">edit</span></button>
                        </td>
                      </tr>
                      {/* Module Admin */}
                      <tr className="bg-white matrix-cell group">
                        <td className="p-md">
                          <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 rounded bg-on-primary-fixed/10 flex items-center justify-center text-on-primary-fixed">
                              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                            </div>
                            <div>
                              <div className="font-bold text-body-md">K-Admin</div>
                              <div className="text-label-sm text-on-surface-variant">Système & Utilisateurs</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-md text-center">
                          <input checked className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary opacity-50" disabled type="checkbox"/>
                        </td>
                        <td className="p-md text-center">
                          <input checked className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary opacity-50" disabled type="checkbox"/>
                        </td>
                        <td className="p-md text-center">
                          <input checked className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary opacity-50" disabled type="checkbox"/>
                        </td>
                        <td className="p-md text-center">
                          <input checked className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary opacity-50" disabled type="checkbox"/>
                        </td>
                        <td className="p-md text-right">
                          <span className="material-symbols-outlined text-on-surface-variant/40">lock</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-md bg-surface-container-lowest border-t border-outline-variant flex justify-between items-center">
                  <div className="text-label-md text-on-surface-variant">Affichage de 1-4 sur 12 modules</div>
                  <div className="flex gap-xs">
                    <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high disabled:opacity-50" disabled><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary font-bold rounded">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high">2</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high">3</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                  </div>
                </div>
              </div>
              {/* Role Selection Slider/Pills */}
              <div className="mt-lg">
                <h3 className="font-title-md text-title-md mb-md">Configuration par Rôle</h3>
                <div className="flex gap-sm overflow-x-auto pb-xs custom-scrollbar">
                  <button className="flex-shrink-0 px-md py-sm rounded-full border-2 border-primary bg-primary/5 text-primary font-bold flex items-center gap-xs transition-all">
                    Chef de Service
                  </button>
                  <button className="flex-shrink-0 px-md py-sm rounded-full border border-outline text-on-surface-variant font-medium flex items-center gap-xs hover:border-primary/50 transition-all">
                    Contrôleur de Gestion
                  </button>
                  <button className="flex-shrink-0 px-md py-sm rounded-full border border-outline text-on-surface-variant font-medium flex items-center gap-xs hover:border-primary/50 transition-all">
                    Agent de Quai
                  </button>
                  <button className="flex-shrink-0 px-md py-sm rounded-full border border-outline text-on-surface-variant font-medium flex items-center gap-xs hover:border-primary/50 transition-all">
                    Superviseur Logistique
                  </button>
                  <button className="flex-shrink-0 px-md py-sm rounded-full border border-outline text-on-surface-variant font-medium flex items-center gap-xs hover:border-primary/50 transition-all">
                    Agent Transit
                  </button>
                  <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-outline text-on-surface-variant hover:bg-primary hover:text-white transition-all">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* System Alerts / Notifications Footer inside main */}
          <div className="mt-xl grid grid-cols-1 md:grid-cols-2 gap-[1rem]">
            <div className="bg-error-container text-on-error-container p-md rounded-xl flex items-start gap-md">
              <span className="material-symbols-outlined">warning</span>
              <div>
                <div className="font-bold text-body-md">Alerte de Sécurité</div>
                <p className="text-body-sm opacity-90 mt-1">Le rôle 'Agent de Quai' possède actuellement des permissions d'écriture sur K-Finance. Veuillez vérifier cette anomalie.</p>
              </div>
            </div>
            <div className="bg-secondary-container text-on-secondary-container p-md rounded-xl flex items-start gap-md">
              <span className="material-symbols-outlined">info</span>
              <div>
                <div className="font-bold text-body-md">Mise à jour Système</div>
                <p className="text-body-sm opacity-90 mt-1">De nouvelles colonnes 'Archiver' et 'Exporter' seront disponibles dans la prochaine mise à jour (v2.4).</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
