// src/app/(app)/transport/containers/declaration/page.tsx - KT10 Déclaration de Conteneur K-Transport - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ContainerDeclaration() {
  const router = useRouter()
  const [containerNumber, setContainerNumber] = useState('')
  const [blNumber, setBlNumber] = useState('')
  const [containerType, setContainerType] = useState('20dry')
  const [incoterm, setIncoterm] = useState('')
  const [vgm, setVgm] = useState('')
  const [observations, setObservations] = useState('')

  const handleClear = () => {
    setContainerNumber('')
    setBlNumber('')
    setContainerType('20dry')
    setIncoterm('')
    setVgm('')
    setObservations('')
  }

  const handleSave = () => {
    // Save container declaration - will be connected to backend
    router.push('/transport/containers')
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .material-symbols-outlined[data-weight="fill"] {
          font-variation-settings: 'FILL 1, wght 400, GRAD 0, opsz 24';
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f0f3ff;
        }
        ::-webkit-scrollbar-thumb {
          background: #c2c6d6;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #727785;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface antialiased flex overflow-hidden h-screen selection:bg-tertiary selection:text-on-tertiary">
        <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest flex flex-col p-[1rem] border-r border-outline-variant shadow-sm z-50">
          <div className="px-[1rem] py-[1.5rem] border-b border-outline-variant/50">
            <div className="flex items-center gap-[0.5rem]">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary font-bold">K</div>
              <div>
                <h1 className="font-headline-md text-headline-md text-primary font-bold leading-none">KAMLOG ERP</h1>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-[0.25rem]">Port Operations</p>
              </div>
            </div>
          </div>
          <div className="px-[1rem] py-[1rem]">
            <button className="w-full flex items-center justify-center gap-[0.25rem] bg-primary text-on-primary font-label-md text-label-md py-[0.5rem] rounded hover:bg-primary-fixed-variant transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nouvelle Opération
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-[0.25rem] py-[0.5rem] flex flex-col gap-[0.25rem] font-label-caps text-label-caps">
            <a onClick={() => router.push('/dashboard')} className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
              <span className="material-symbols-outlined">dashboard</span>
              Tableau de bord
            </a>
            <a onClick={() => router.push('/transport')} className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded text-primary bg-secondary-container font-bold active:scale-95 duration-150 relative cursor-pointer">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-primary rounded-r-full"></div>
              <span className="material-symbols-outlined" data-weight="fill">local_shipping</span>
              Transport
            </a>
            <a onClick={() => router.push('/finance')} className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
              <span className="material-symbols-outlined">payments</span>
              Finances
            </a>
            <a onClick={() => router.push('/parc')} className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
              <span className="material-symbols-outlined">minor_crash</span>
              Parc Automobile
            </a>
            <a onClick={() => router.push('/settings')} className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
              <span className="material-symbols-outlined">settings</span>
              Paramètres
            </a>
          </nav>
          <div className="border-t border-outline-variant/50 p-[0.25rem] mt-auto font-label-caps text-label-caps">
            <a onClick={() => router.push('/support')} className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded text-secondary hover:bg-surface-container-high transition-colors cursor-pointer">
              <span className="material-symbols-outlined">help_outline</span>
              Support
            </a>
            <a onClick={() => router.push('/logout')} className="flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] rounded text-error hover:bg-error-container transition-colors cursor-pointer">
              <span className="material-symbols-outlined">logout</span>
              Déconnexion
            </a>
          </div>
        </aside>
        <div className="flex-1 flex flex-col ml-[260px] min-w-0 h-full relative">
          <header className="sticky top-0 w-full z-40 bg-surface border-b border-outline-variant flex justify-between items-center h-[64px] px-[1rem] font-body-base text-body-base">
            <div className="flex items-center gap-[1.5rem]">
              <span className="font-title-sm text-title-sm text-on-surface font-black tracking-tight">KAMLOG EM-ERP</span>
              <nav className="hidden lg:flex gap-[1.5rem]">
                <a onClick={() => router.push('/master-data/articles')} className="text-on-surface-variant hover:text-primary transition-all py-4 font-label-md text-label-md cursor-pointer">Articles</a>
                <a onClick={() => router.push('/master-data/tiers')} className="text-on-surface-variant hover:text-primary transition-all py-4 font-label-md text-label-md cursor-pointer">Clients</a>
                <a onClick={() => router.push('/magasin')} className="text-on-surface-variant hover:text-primary transition-all py-4 font-label-md text-label-md cursor-pointer">Stocks</a>
                <a onClick={() => router.push('/reports')} className="text-on-surface-variant hover:text-primary transition-all py-4 font-label-md text-label-md cursor-pointer">Rapports</a>
              </nav>
            </div>
            <div className="flex items-center gap-[1rem]">
              <div className="relative hidden md:block w-64 focus-within:ring-2 focus-within:ring-primary rounded">
                <span className="material-symbols-outlined absolute left-[0.5rem] top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                <input className="w-full h-9 pl-10 pr-[0.5rem] bg-surface-container rounded border-none text-body-sm focus:ring-0 placeholder:text-on-surface-variant/70" placeholder="Rechercher T-Code ou ID..." type="text"/>
                <div className="absolute right-[0.25rem] top-1/2 -translate-y-1/2 bg-surface border border-outline-variant rounded px-1 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-on-surface-variant">⌘K</span>
                </div>
              </div>
              <div className="flex items-center gap-[0.25rem] text-on-surface-variant">
                <button className="p-[0.25rem] hover:bg-surface-container-high rounded-full transition-colors relative">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                </button>
                <button onClick={() => router.push('/security')} className="p-[0.25rem] hover:bg-surface-container-high rounded-full transition-colors text-tertiary">
                  <span className="material-symbols-outlined">verified_user</span>
                </button>
                <div className="w-px h-6 bg-outline-variant mx-[0.25rem]"></div>
                <button onClick={() => router.push('/profile')} className="p-[0.25rem] hover:bg-surface-container-high rounded-full transition-colors flex items-center gap-[0.25rem]">
                  <img alt="User profile with MFA status" className="w-8 h-8 rounded-full border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjFMFBe_rOAQdD64isoaSVyFJpOIiUGqAZ1921PMsxnwb0pdJoWGAyc505ZK7CNyB9rWf0z_mFhM68r98TCCfKJDCVEHS4yNAT8brZ8Pdb9zkqmV7oJXEjEEF3xcMPGyk6xFxrBwtr2wm9z63S_ltinoUcNgdmVlO-A678Ao1UFY4KdklET-o5GMJVOYRJylIPhdH03ycbpOwNZm3pBjYIgY-h6_pIgyJUSD08VWsS6hpca77JsaU9nxj1AJEHqOF0v3Rwa1zWpk0"/>
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-[1rem] lg:p-[2rem] bg-surface-container-low">
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-[1.5rem] flex flex-col gap-[0.25rem]">
                <nav className="flex items-center gap-[0.25rem] font-label-sm text-label-sm text-on-surface-variant">
                  <a onClick={() => router.push('/transport')} className="hover:text-primary transition-colors cursor-pointer">Transport</a>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <a onClick={() => router.push('/transport/containers')} className="hover:text-primary transition-colors cursor-pointer">Opérations</a>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-on-surface font-medium">Déclaration</span>
                </nav>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[1rem]">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Déclaration de Conteneur</h2>
                    <span className="bg-tertiary text-on-tertiary px-[0.5rem] py-[0.25rem] rounded font-data-tabular text-data-tabular font-bold tracking-widest shadow-sm">KT10</span>
                  </div>
                  <div className="flex gap-[0.5rem]">
                    <button onClick={handleClear} className="px-[1rem] py-[0.5rem] border border-outline-variant text-on-surface font-label-md text-label-md rounded hover:bg-surface-container transition-colors bg-surface-container-lowest">
                      Effacer
                    </button>
                    <button onClick={handleSave} className="px-[1rem] py-[0.5rem] bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-primary-container transition-colors shadow-sm flex items-center gap-[0.25rem]">
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-[1.5rem] items-start">
                <div className="xl:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm">
                  <div className="border-b border-outline-variant px-[1.5rem] py-[1rem] bg-surface-container-lowest rounded-t-lg flex items-center justify-between">
                    <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-[0.25rem]">
                      <span className="material-symbols-outlined text-tertiary text-[20px]">inventory_2</span>
                      Données de Manutention
                    </h3>
                    <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed px-[0.25rem] py-[0.25rem] rounded">Brouillon</span>
                  </div>
                  <form className="p-[1.5rem] grid grid-cols-2 gap-x-[1.5rem] gap-y-[2rem]">
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-[0.25rem] relative">
                      <label className="font-label-md text-label-md text-on-surface-variant flex justify-between">
                        Numéro de Conteneur
                        <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          className="w-full h-10 px-[1rem] font-data-tabular text-data-tabular bg-surface border border-outline-variant rounded focus:ring-2 focus:ring-tertiary focus:border-tertiary uppercase placeholder:normal-case placeholder:font-body-md transition-shadow" 
                          placeholder="Ex: HLBU 123456 7" 
                          type="text"
                          value={containerNumber}
                          onChange={(e) => setContainerNumber(e.target.value.toUpperCase())}
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary" type="button">
                          <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                        </button>
                      </div>
                      <p className="font-body-sm text-body-sm text-outline absolute -bottom-6">Format standard ISO 6346 requis</p>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-[0.25rem]">
                      <label className="font-label-md text-label-md text-on-surface-variant flex justify-between">
                        Manifeste / Bill of Lading (BL)
                        <span className="text-error">*</span>
                      </label>
                      <div className="relative flex">
                        <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-outline-variant bg-surface-container text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">description</span>
                        </span>
                        <input 
                          className="flex-1 h-10 px-[0.5rem] font-data-tabular text-data-tabular bg-surface border border-outline-variant rounded-r focus:ring-2 focus:ring-tertiary focus:border-tertiary transition-shadow" 
                          placeholder="Rechercher BL..." 
                          type="text"
                          value={blNumber}
                          onChange={(e) => setBlNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-span-2 flex flex-col gap-[0.25rem] mt-[1rem]">
                      <label className="font-label-md text-label-md text-on-surface-variant">Type de Conteneur</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-[0.5rem]">
                        <label className="cursor-pointer">
                          <input checked={containerType === '20dry'} className="peer sr-only" name="container_type" type="radio" value="20dry" onChange={() => setContainerType('20dry')}/>
                          <div className="h-full border border-outline-variant rounded-lg p-[0.5rem] bg-surface hover:bg-surface-container transition-colors peer-checked:border-tertiary peer-checked:bg-tertiary-fixed/30 peer-checked:ring-1 peer-checked:ring-tertiary flex flex-col items-center justify-center gap-[0.25rem] text-center">
                            <span className="font-title-md text-title-md text-on-surface">20' Dry</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">Standard</span>
                          </div>
                        </label>
                        <label className="cursor-pointer">
                          <input checked={containerType === '40hc'} className="peer sr-only" name="container_type" type="radio" value="40hc" onChange={() => setContainerType('40hc')}/>
                          <div className="h-full border border-outline-variant rounded-lg p-[0.5rem] bg-surface hover:bg-surface-container transition-colors peer-checked:border-tertiary peer-checked:bg-tertiary-fixed/30 peer-checked:ring-1 peer-checked:ring-tertiary flex flex-col items-center justify-center gap-[0.25rem] text-center">
                            <span className="font-title-md text-title-md text-on-surface">40' HC</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">High Cube</span>
                          </div>
                        </label>
                        <label className="cursor-pointer">
                          <input checked={containerType === '20reefer'} className="peer sr-only" name="container_type" type="radio" value="20reefer" onChange={() => setContainerType('20reefer')}/>
                          <div className="h-full border border-outline-variant rounded-lg p-[0.5rem] bg-surface hover:bg-surface-container transition-colors peer-checked:border-tertiary peer-checked:bg-tertiary-fixed/30 peer-checked:ring-1 peer-checked:ring-tertiary flex flex-col items-center justify-center gap-[0.25rem] text-center">
                            <span className="font-title-md text-title-md text-on-surface">20' Reefer</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant text-primary">Réfrigéré</span>
                          </div>
                        </label>
                        <label className="cursor-pointer">
                          <input checked={containerType === '40ot'} className="peer sr-only" name="container_type" type="radio" value="40ot" onChange={() => setContainerType('40ot')}/>
                          <div className="h-full border border-outline-variant rounded-lg p-[0.5rem] bg-surface hover:bg-surface-container transition-colors peer-checked:border-tertiary peer-checked:bg-tertiary-fixed/30 peer-checked:ring-1 peer-checked:ring-tertiary flex flex-col items-center justify-center gap-[0.25rem] text-center">
                            <span className="font-title-md text-title-md text-on-surface">40' OT</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant text-tertiary">Open Top</span>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-[0.25rem]">
                      <label className="font-label-md text-label-md text-on-surface-variant">Incoterm</label>
                      <div className="relative">
                        <select 
                          className="w-full h-10 px-[1rem] appearance-none bg-surface border border-outline-variant rounded focus:ring-2 focus:ring-tertiary focus:border-tertiary font-body-md text-on-surface cursor-pointer"
                          value={incoterm}
                          onChange={(e) => setIncoterm(e.target.value)}
                        >
                          <option disabled selected value="">Sélectionner...</option>
                          <option value="FOB">FOB - Free On Board</option>
                          <option value="CIF">CIF - Cost, Insurance, Freight</option>
                          <option value="EXW">EXW - Ex Works</option>
                          <option value="DDP">DDP - Delivered Duty Paid</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">arrow_drop_down</span>
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-[0.25rem]">
                      <label className="font-label-md text-label-md text-on-surface-variant">Poids Déclaré (VGM)</label>
                      <div className="relative flex">
                        <input 
                          className="flex-1 h-10 px-[1rem] font-data-tabular text-data-tabular bg-surface border border-outline-variant border-r-0 rounded-l focus:ring-2 focus:ring-tertiary focus:border-tertiary transition-shadow text-right" 
                          placeholder="0.00" 
                          type="number"
                          value={vgm}
                          onChange={(e) => setVgm(e.target.value)}
                        />
                        <span className="inline-flex items-center px-3 rounded-r border border-outline-variant bg-surface-container text-on-surface-variant font-label-md">
                          KG
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 border-t border-outline-variant pt-[1.5rem] mt-[0.5rem] flex flex-col gap-[0.25rem]">
                      <label className="font-label-md text-label-md text-on-surface-variant">Observations / Scellés</label>
                      <textarea 
                        className="w-full p-[1rem] bg-surface border border-outline-variant rounded focus:ring-2 focus:ring-tertiary focus:border-tertiary font-body-md text-on-surface resize-none placeholder:text-outline" 
                        placeholder="Numéros de scellés, dommages visibles..." 
                        rows="2"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                      ></textarea>
                    </div>
                  </form>
                </div>
                <div className="xl:col-span-4 sticky top-[88px] flex flex-col gap-[1rem]">
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-tertiary-fixed-dim/20 to-transparent pointer-events-none rounded-tr-lg"></div>
                    <div className="p-[1.5rem] border-b border-outline-variant/50">
                      <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-[0.5rem]">Aperçu du Scénario</h4>
                      <div className="flex items-center gap-[1rem]">
                        <div className="w-16 h-16 bg-surface-container rounded border border-outline-variant flex items-center justify-center shadow-inner relative overflow-hidden">
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#151c27_1px,transparent_1px)] [background-size:8px_8px]"></div>
                          <span className="material-symbols-outlined text-[32px] text-tertiary">view_in_ar</span>
                        </div>
                        <div>
                          <div className="font-data-tabular text-title-lg font-bold text-on-surface tracking-wide">{containerNumber || '-- --'}</div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-outline"></span>
                            {containerNumber ? 'En cours de saisie' : 'En attente de saisie'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-surface p-[1.5rem] flex flex-col gap-[0.5rem]">
                      <div className="flex justify-between items-center py-[0.25rem] border-b border-outline-variant/50 border-dashed">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Type</span>
                        <span className="font-data-tabular text-data-tabular font-medium text-on-surface">
                          {containerType === '20dry' ? '20\' Dry' : containerType === '40hc' ? '40\' HC' : containerType === '20reefer' ? '20\' Reefer' : containerType === '40ot' ? '40\' OT' : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-[0.25rem] border-b border-outline-variant/50 border-dashed">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Incoterm</span>
                        <span className="font-data-tabular text-data-tabular font-medium text-on-surface">{incoterm || '--'}</span>
                      </div>
                      <div className="flex justify-between items-center py-[0.25rem] border-b border-outline-variant/50 border-dashed">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Manifeste Lié</span>
                        <span className="font-data-tabular text-data-tabular font-medium text-outline">{blNumber || 'Aucun'}</span>
                      </div>
                      <div className="flex justify-between items-center py-[0.25rem]">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Poids Total</span>
                        <span className="font-data-tabular text-data-tabular font-medium text-on-surface">{vgm ? `${vgm} KG` : '-- KG'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container-high rounded-lg p-[1rem] flex items-start gap-[0.5rem] border border-outline-variant/50">
                    <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">info</span>
                    <div>
                      <h5 className="font-label-md text-label-md text-on-surface">Contrôle de conformité</h5>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">Assurez-vous que le numéro de conteneur respecte la clé de contrôle ISO avant validation. Le manifeste doit être apuré par la douane.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
