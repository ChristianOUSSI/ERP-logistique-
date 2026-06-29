// src/app/(app)/finance/overview/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { financeAPI } from '@/lib/api-client'
import { useAuth } from '@/components/layout/AuthProvider'

export default function KFinanceOverview() {
  const { user } = useAuth();
  const [factures, setFactures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const facturesRes = await financeAPI.getFactures().catch(() => ({ data: [] }));
        setFactures(facturesRes.data || []);
      } catch (err) {
        console.error("Failed to fetch finance data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute KPIs
  const caMois = factures
    .filter(f => f.statut === 'PAYEE')
    .reduce((acc, f) => acc + (parseFloat(f.montant_ttc) || 0), 0);
  
  const impayes = factures
    .filter(f => f.statut === 'IMPAYEE' || f.statut === 'EN_ATTENTE')
    .reduce((acc, f) => acc + (parseFloat(f.montant_ttc) || 0), 0);
    
  const impayesCount = factures.filter(f => f.statut === 'IMPAYEE' || f.statut === 'EN_ATTENTE').length;
  
  // Dummy data for others
  const depenses = caMois * 0.3; // Dummy 30% of CA
  const tresorerie = caMois - depenses;

  const recentFactures = [...factures].sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime()).slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAYEE': return <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">Payé</span>;
      case 'EN_ATTENTE': return <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold bg-[#fffbeb] text-[#b45309] border border-[#fde68a]">En Attente</span>;
      case 'IMPAYEE': return <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold bg-finance-error-container text-finance-error border border-[#fecaca]">En Retard</span>;
      default: return <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="bg-finance-background text-finance-on-background font-body-base antialiased min-h-screen flex">
      {/* SideNavBar */}
      <aside className="bg-finance-surface-container-lowest border-r border-finance-outline-variant shadow-sm fixed left-0 top-0 h-full w-[260px] flex flex-col p-stack-md z-50">
        <div className="mb-8 flex items-center gap-3 mt-16 md:mt-0">
          <div className="w-10 h-10 rounded bg-finance-primary-container text-finance-on-primary-container flex items-center justify-center font-bold text-xl">K</div>
          <div>
            <h1 className="font-headline-md text-headline-md text-finance-primary font-bold">KAMLOG ERP</h1>
            <p className="font-label-caps text-label-caps text-finance-secondary">Port Operations</p>
          </div>
        </div>

        <button className="w-full bg-finance-primary text-finance-on-primary py-2 px-4 rounded-lg font-title-sm text-title-sm mb-6 hover:bg-finance-primary-container transition-colors flex items-center justify-center gap-2 shadow-sm text-white">
          <span className="material-symbols-outlined">add</span>
          Nouvelle Opération
        </button>

        <nav className="flex-1 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-finance-secondary hover:bg-finance-surface-container-high transition-colors" href="/dashboard/global">
            <span className="material-symbols-outlined">dashboard</span>
            Tableau de bord
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-finance-secondary hover:bg-finance-surface-container-high transition-colors" href="/transport/control">
            <span className="material-symbols-outlined">local_shipping</span>
            Transport
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-finance-primary bg-finance-primary/10 font-bold" href="/finance/overview">
            <span className="material-symbols-outlined">payments</span>
            Finances
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-finance-secondary hover:bg-finance-surface-container-high transition-colors" href="/parc/overview">
            <span className="material-symbols-outlined">minor_crash</span>
            Parc Automobile
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-finance-secondary hover:bg-finance-surface-container-high transition-colors" href="/magasin/dashboard">
            <span className="material-symbols-outlined">warehouse</span>
            Magasin
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        <header className="bg-finance-surface sticky top-0 w-full z-40 border-b border-finance-outline-variant flex justify-between items-center h-[64px] px-gutter">
          <div className="flex items-center gap-6">
            <h2 className="font-title-sm text-title-sm text-finance-on-surface font-black tracking-tight ml-10 lg:ml-0">KAMLOG EM-ERP</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-finance-outline-variant flex items-center justify-center text-xs font-bold text-finance-primary">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-container-margin overflow-y-auto bg-finance-background">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-display-lg text-display-lg text-finance-on-surface mb-2">K-Finance Overview</h2>
              <p className="font-body-base text-body-base text-finance-secondary">Aperçu global de la santé financière et des opérations en cours.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-finance-primary text-white rounded-lg font-body-sm text-body-sm shadow-sm hover:opacity-90 flex items-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Créer Facture
              </button>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center items-center h-64">
               <span className="text-finance-primary font-bold">Chargement des données financières...</span>
             </div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              {/* KPIs (Bento style) */}
              <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
                <div className="bg-finance-surface-container-lowest rounded-xl p-5 border border-finance-outline-variant shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-label-caps text-finance-secondary">Chiffre d'Affaires</span>
                    <div className="text-finance-primary bg-finance-primary/10 p-2 rounded-lg">
                      <span className="material-symbols-outlined">trending_up</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-display-lg text-[28px] font-bold text-finance-on-surface">{caMois.toLocaleString()} FCFA</div>
                  </div>
                </div>

                <div className="bg-finance-surface-container-lowest rounded-xl p-5 border border-finance-outline-variant shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-label-caps text-finance-secondary">Dépenses Est.</span>
                    <div className="text-finance-secondary bg-finance-surface-container p-2 rounded-lg">
                      <span className="material-symbols-outlined">account_balance_wallet</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-display-lg text-[28px] font-bold text-finance-on-surface">{depenses.toLocaleString()} FCFA</div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-5 border border-red-100 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-label-caps text-red-600">Paiements en Retard</span>
                    <div className="text-red-600 bg-white p-2 rounded-lg">
                      <span className="material-symbols-outlined">warning</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-display-lg text-[28px] font-bold text-red-600">{impayes.toLocaleString()} FCFA</div>
                    <div className="font-body-sm text-body-sm text-red-500 mt-1">{impayesCount} factures échues ou en attente.</div>
                  </div>
                </div>

                <div className="bg-finance-surface-container-lowest rounded-xl p-5 border border-finance-outline-variant shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-caps text-label-caps text-finance-secondary">Trésorerie Disponible</span>
                    <div className="text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                      <span className="material-symbols-outlined">savings</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-display-lg text-[28px] font-bold text-finance-on-surface">{tresorerie.toLocaleString()} FCFA</div>
                  </div>
                </div>
              </div>

              {/* Main Content Left Column */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                <div className="bg-finance-surface-container-lowest rounded-xl border border-finance-outline-variant shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-finance-outline-variant flex justify-between items-center">
                    <h3 className="font-title-sm text-title-sm text-finance-on-surface">Factures Récentes</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-finance-surface-container-lowest border-b border-finance-outline-variant">
                          <th className="p-3 font-label-caps text-label-caps text-finance-secondary">Facture #</th>
                          <th className="p-3 font-label-caps text-label-caps text-finance-secondary">Client ID</th>
                          <th className="p-3 font-label-caps text-label-caps text-finance-secondary">Montant</th>
                          <th className="p-3 font-label-caps text-label-caps text-finance-secondary">Date</th>
                          <th className="p-3 font-label-caps text-label-caps text-finance-secondary">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentFactures.length === 0 ? (
                          <tr><td colSpan={5} className="p-4 text-center text-finance-secondary">Aucune facture récente.</td></tr>
                        ) : (
                          recentFactures.map((f, i) => (
                            <tr key={i} className="border-b border-finance-outline-variant hover:bg-finance-surface-container-low transition-colors">
                              <td className="p-3 font-mono-data text-mono-data text-finance-primary font-bold">{f.reference || `FAC-${f.id}`}</td>
                              <td className="p-3 font-body-sm text-body-sm text-finance-on-surface">{f.client_id}</td>
                              <td className="p-3 font-mono-data text-mono-data text-finance-on-surface">{parseFloat(f.montant_ttc).toLocaleString()} FCFA</td>
                              <td className="p-3 font-body-sm text-body-sm text-finance-secondary">{new Date(f.date_creation).toLocaleDateString()}</td>
                              <td className="p-3">{getStatusBadge(f.statut)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column (Notifications & Alerts) */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                {/* Gateway Notifications */}
                <div className="bg-finance-surface-container-lowest rounded-xl border border-finance-outline-variant shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-finance-outline-variant bg-finance-surface-container-low flex items-center gap-2">
                    <span className="material-symbols-outlined text-finance-primary">sync_alt</span>
                    <h3 className="font-title-sm text-title-sm text-finance-on-surface">Gateway Inter-Module</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-finance-secondary text-center">Aucune notification inter-module récente.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
