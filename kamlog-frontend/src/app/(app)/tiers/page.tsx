// src/app/(app)/tiers/page.tsx - Master Data Tiers - Fidèle au HTML original
'use client'

import { useEffect, useState } from 'react'
import { tiersAPI } from '@/lib/api-client'
import { Tiers } from '@/types'

export default function TiersPage() {
  const [tiers, setTiers] = useState<Tiers[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<Tiers | null>(null)

  useEffect(() => {
    loadTiers()
  }, [])

  const loadTiers = async () => {
    try {
      const response = await tiersAPI.getTiers()
      setTiers(response.data)
    } catch (error) {
      console.error('Error loading tiers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  return (
    <div className="bg-surface-container-low text-on-surface min-h-screen flex">
      {/* SideNavBar */}
      <aside className="bg-surface-container-lowest border-r border-outline-variant shadow-sm fixed left-0 top-0 h-full w-[260px] flex flex-col p-stack-md z-50">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl">
            K
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-primary font-bold">KAMLOG ERP</h1>
            <p className="font-label-caps text-label-caps text-secondary">Master Data</p>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full bg-primary text-on-primary py-2 px-4 rounded-lg font-title-sm text-title-sm mb-6 hover:bg-primary-container transition-colors flex items-center justify-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nouveau Tiers
        </button>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Tableau de bord
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            Transport
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">payments</span>
            Finances
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-primary bg-secondary-container font-bold" href="#">
            <span className="material-symbols-outlined text-[20px]">business</span>
            Tiers
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Paramètres
          </a>
        </nav>

        {/* Footer Links */}
        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant pt-4">
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
            Support
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors text-error" href="#">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Déconnexion
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        {/* TopNavBar */}
        <header className="bg-surface sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center h-[64px] px-gutter">
          <div className="flex items-center gap-6">
            <h2 className="font-title-sm text-title-sm text-on-surface font-black tracking-tight">KAMLOG EM-ERP</h2>
            <nav className="hidden md:flex gap-6">
              <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Clients</a>
              <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Fournisseurs</a>
              <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Partenaires</a>
              <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Rapports</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative focus-within:ring-2 focus-within:ring-primary rounded-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
              <input 
                className="pl-10 pr-4 py-2 border border-outline-variant rounded-md text-sm w-64 bg-surface-container-lowest focus:outline-none font-mono-data text-mono-data" 
                placeholder="Rechercher Tiers..." 
                type="text"
              />
            </div>
            {/* Trailing Icons */}
            <div className="flex items-center gap-2 border-l border-outline-variant pl-4">
              <button className="text-secondary hover:text-primary transition-colors p-1 relative">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button className="text-secondary hover:text-primary transition-colors p-1">
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </button>
              <button className="text-secondary hover:text-primary transition-colors p-1">
                <div className="w-8 h-8 rounded-full bg-outline-variant flex items-center justify-center text-xs font-bold text-primary">
                  JD
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Canvas */}
        <main className="flex-1 p-container-margin overflow-y-auto bg-background">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-display-lg text-display-lg text-on-surface mb-2">Master Data Tiers</h2>
              <p className="font-body-base text-body-base text-secondary">Gestion des clients, fournisseurs et partenaires.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filtrer
              </button>
              <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-body-sm text-body-sm shadow-sm hover:bg-primary-container flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Nouveau Tiers
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Tiers List */}
            <div className="col-span-8">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden">
                <div className="p-5 border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Liste des Tiers</h3>
                  <div className="flex gap-2">
                    <select className="border-outline-variant rounded-md text-sm py-1 px-3 bg-surface-container-lowest">
                      <option>Tous les types</option>
                      <option>Clients</option>
                      <option>Fournisseurs</option>
                      <option>Partenaires</option>
                    </select>
                    <select className="border-outline-variant rounded-md text-sm py-1 px-3 bg-surface-container-lowest">
                      <option>Tous les statuts</option>
                      <option>Actif</option>
                      <option>Bloqué</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-lowest border-b border-outline-variant">
                        <th className="p-3 font-label-caps text-label-caps text-secondary sticky top-0">Code</th>
                        <th className="p-3 font-label-caps text-label-caps text-secondary sticky top-0">Raison Sociale</th>
                        <th className="p-3 font-label-caps text-label-caps text-secondary sticky top-0">NIU</th>
                        <th className="p-3 font-label-caps text-label-caps text-secondary sticky top-0">Type</th>
                        <th className="p-3 font-label-caps text-label-caps text-secondary sticky top-0">Statut</th>
                        <th className="p-3 font-label-caps text-label-caps text-secondary sticky top-0 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tiers.map((tier) => (
                        <tr 
                          key={tier.id} 
                          className="border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                          onClick={() => setSelectedTier(tier)}
                        >
                          <td className="p-3 font-mono-data text-mono-data text-primary">{tier.code_tiers}</td>
                          <td className="p-3 font-body-sm text-body-sm text-on-surface font-medium">{tier.raison_sociale}</td>
                          <td className="p-3 font-mono-data text-mono-data text-on-surface">{tier.niu}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold bg-surface-container text-secondary">
                              {tier.type_tiers}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold ${
                              tier.statut === 'ACTIF' ? 'bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]' :
                              tier.statut === 'BLOQUE' ? 'bg-error-container text-error border border-[#fecaca]' :
                              'bg-surface-container text-secondary'
                            }`}>
                              {tier.statut}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button className="text-secondary hover:text-primary transition-all">
                              <span className="material-symbols-outlined text-[18px]">more_vert</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick View Panel */}
            <div className="col-span-4">
              {selectedTier ? (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-title-sm text-title-sm text-on-surface">Détails du Tiers</h3>
                    <button onClick={() => setSelectedTier(null)} className="text-secondary hover:text-primary">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-label-caps text-label-caps text-secondary text-xs mb-1">Code Tiers</p>
                      <p className="font-mono-data text-mono-data text-primary font-medium">{selectedTier.code_tiers}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-secondary text-xs mb-1">Raison Sociale</p>
                      <p className="font-body-sm text-body-sm text-on-surface font-medium">{selectedTier.raison_sociale}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-secondary text-xs mb-1">NIU</p>
                      <p className="font-mono-data text-mono-data text-on-surface">{selectedTier.niu}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-secondary text-xs mb-1">Type</p>
                      <p className="font-body-sm text-body-sm text-on-surface">{selectedTier.type_tiers}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-secondary text-xs mb-1">Statut</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold ${
                        selectedTier.statut === 'ACTIF' ? 'bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]' :
                        selectedTier.statut === 'BLOQUE' ? 'bg-error-container text-error border border-[#fecaca]' :
                        'bg-surface-container text-secondary'
                      }`}>
                        {selectedTier.statut}
                      </span>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-secondary text-xs mb-2">Services Autorisés</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTier.autorise_transport && <span className="px-2 py-1 bg-surface-container rounded text-xs">Transport</span>}
                        {selectedTier.autorise_transit && <span className="px-2 py-1 bg-surface-container rounded text-xs">Transit</span>}
                        {selectedTier.autorise_acconage && <span className="px-2 py-1 bg-surface-container rounded text-xs">Acconage</span>}
                        {selectedTier.autorise_magasinage && <span className="px-2 py-1 bg-surface-container rounded text-xs">Magasinage</span>}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-outline-variant">
                      <button className="w-full py-2 bg-primary text-on-primary rounded-lg font-body-sm text-body-sm hover:bg-primary-container transition-colors">
                        Modifier
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow p-8 text-center">
                  <span className="material-symbols-outlined text-6xl text-outline mb-4">business</span>
                  <p className="font-body-sm text-body-sm text-secondary">Sélectionnez un tiers pour voir les détails</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
