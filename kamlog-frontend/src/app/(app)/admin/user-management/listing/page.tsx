// src/app/(app)/admin/user-management/listing/page.tsx - Listing User - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'

export default function UserListing() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{ name: string; dept: string; role: string }>({ name: '', dept: '', role: '' })

  const toggleDrawer = (isOpen: boolean, name = '', dept = '', role = '') => {
    if (isOpen) {
      setSelectedUser({ name, dept, role })
      setDrawerOpen(true)
    } else {
      setDrawerOpen(false)
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
          display: inline-block;
          vertical-align: middle;
        }
        .icon-fill {
          font-variation-settings: 'FILL 1';
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
        .drawer-transition { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
      <div className="bg-surface-container-low text-on-surface antialiased overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant flex flex-col p-4 z-50">
          <div className="mb-8 px-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded">
              <span className="material-symbols-outlined text-on-primary icon-fill">terminal</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold leading-tight">KAMLOG ERP</h1>
              <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Port Operations</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <a className="flex items-center gap-3 px-3 py-2.5 text-secondary transition-colors hover:bg-surface-container-high font-medium rounded-lg" href="/dashboard/global">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-md text-label-md">Tableau de bord</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 text-secondary transition-colors hover:bg-surface-container-high font-medium rounded-lg" href="/transport/control">
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="font-label-md text-label-md">Transport</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 text-secondary transition-colors hover:bg-surface-container-high font-medium rounded-lg" href="/finance/overview">
              <span className="material-symbols-outlined">payments</span>
              <span className="font-label-md text-label-md">Finances</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 text-secondary transition-colors hover:bg-surface-container-high font-medium rounded-lg" href="/parc/overview">
              <span className="material-symbols-outlined">minor_crash</span>
              <span className="font-label-md text-label-md">Parc Automobile</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 text-primary bg-secondary-container font-bold rounded-lg" href="/settings/system/audit-health">
              <span className="material-symbols-outlined icon-fill">settings</span>
              <span className="font-label-md text-label-md">Paramètres</span>
            </a>
          </nav>
          <button className="mb-6 w-full py-2.5 px-4 bg-primary text-on-primary font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined">add</span>
            <span className="font-label-md text-label-md">Nouvelle Opération</span>
          </button>
          <div className="border-t border-outline-variant pt-4 space-y-1">
            <a className="flex items-center gap-3 px-3 py-2 text-secondary hover:bg-surface-container-high rounded-lg transition-colors" href="/support">
              <span className="material-symbols-outlined">help_outline</span>
              <span className="font-label-md text-label-md">Support</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-secondary hover:bg-surface-container-high rounded-lg transition-colors" href="/login">
              <span className="material-symbols-outlined text-error">logout</span>
              <span className="font-label-md text-label-md">Déconnexion</span>
            </a>
          </div>
        </aside>
        {/* Main Content Stage */}
        <main className="ml-[260px] h-screen flex flex-col relative overflow-hidden">
          {/* Top Navbar */}
          <header className="sticky top-0 w-full h-[64px] bg-surface border-b border-outline-variant px-[1rem] flex justify-between items-center z-40">
            <div className="flex items-center gap-4">
              <div className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</div>
              <div className="h-6 w-[1px] bg-outline-variant"></div>
              <nav className="hidden md:flex gap-6">
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Articles</a>
                <a className="font-body-base text-body-base text-primary border-b-2 border-primary pb-1" href="#">Utilisateurs</a>
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Stocks</a>
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Rapports</a>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <TCodeSearch />
              <div className="flex items-center gap-3">
                <button className="material-symbols-outlined text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-high transition-all">notifications</button>
                <button className="material-symbols-outlined text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-high transition-all">verified_user</button>
                <div className="flex items-center gap-2 pl-2 border-l border-outline-variant">
                  <img alt="User profile with MFA status" className="w-8 h-8 rounded-full border border-outline-variant object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtmnCuQbcdMIqvAGREH1NAFzz30DaKDxS741I7Lnb5w_cHuyEu2AvIvDGngjt5XVgNfc6GXy68z4XuKdZdCwBWzGSaNxFXCGG9comOD9PoG87VceEia1O4DsBI9_LYcRVVdusF6DTA6IKLycOFsI1TZHViKAiigo4dtx1lhh7fjbc92i8RtUs5BbZuYGzEDfcL9qqlCYdu06i_dvHBRGPXh2D82F4ribePsppPZONQRc6NTLQJOIeJSSRTvGnlTrDZ2leGhuykoQ"/>
                  <div className="flex flex-col">
                    <span className="text-label-sm font-label-sm leading-none">M. Admin</span>
                    <span className="text-[10px] text-primary font-bold uppercase">Root Access</span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {/* User Management Content */}
          <section className="flex-1 p-6 overflow-hidden flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <div>
                <nav className="flex gap-2 text-[11px] font-medium text-outline mb-1">
                  <a className="hover:text-primary transition-all" href="#">Administration</a>
                  <span>/</span>
                  <span className="text-on-surface">Gestion des Utilisateurs</span>
                </nav>
                <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">Utilisateurs du Système</h2>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-primary font-medium rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-all">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  <span className="font-label-md text-label-md">Filtres Avancés</span>
                </button>
                <button className="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                  <span className="font-label-md text-label-md">Nouvel Utilisateur</span>
                </button>
              </div>
            </div>
            {/* Bento Grid Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <div>
                  <p className="text-label-sm font-label-sm text-outline">Utilisateurs Totaux</p>
                  <p className="text-headline-sm font-headline-sm font-bold">1,284</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="text-label-sm font-label-sm text-outline">Utilisateurs Actifs</p>
                  <p className="text-headline-sm font-headline-sm font-bold">1,102</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4">
                <div className="w-12 h-12 bg-tertiary/10 rounded-lg flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">lock_reset</span>
                </div>
                <div>
                  <p className="text-label-sm font-label-sm text-outline">En attente MFA</p>
                  <p className="text-headline-sm font-headline-sm font-bold">42</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4">
                <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">person_off</span>
                </div>
                <div>
                  <p className="text-label-sm font-label-sm text-outline">Inactifs</p>
                  <p className="text-headline-sm font-headline-sm font-bold">140</p>
                </div>
              </div>
            </div>
            {/* Main Table Container */}
            <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
              <div className="overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-surface-container-low z-10 border-b border-outline-variant">
                    <tr>
                      <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider w-12">
                        <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/>
                      </th>
                      <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">Utilisateur</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">Département</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">Rôle ERP</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">Dernière Connexion</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {/* User Row 1 */}
                    <tr className="hover:bg-primary-fixed/30 cursor-pointer group transition-all" onClick={() => toggleDrawer(true, 'Jean Dupont', 'Directeur Logistique', 'Dispatcher')}>
                      <td className="px-6 py-3.5"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">JD</div>
                          <div>
                            <div className="font-body-md text-body-md text-on-surface font-semibold">Jean Dupont</div>
                            <div className="text-[11px] text-outline">jean.dupont@kamlog.cm</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-body-sm font-body-sm text-on-surface-variant">Logistique Portuaire</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2 py-0.5 bg-on-primary-fixed/5 text-on-primary-fixed text-[11px] font-bold rounded border border-on-primary-fixed/10">DISPATCHER</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-secondary-container/20 text-secondary text-[11px] font-bold rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> ACTIF
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-body-sm font-body-sm text-on-surface-variant">Aujourd'hui, 09:42</td>
                      <td className="px-6 py-3.5 text-right">
                        <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">edit</button>
                      </td>
                    </tr>
                    {/* User Row 2 */}
                    <tr className="hover:bg-primary-fixed/30 cursor-pointer group transition-all" onClick={() => toggleDrawer(true, 'Marie Claire', 'Finance & Contrôle', 'Finance')}>
                      <td className="px-6 py-3.5"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-tertiary/10 flex items-center justify-center font-bold text-tertiary text-xs">MC</div>
                          <div>
                            <div className="font-body-md text-body-md text-on-surface font-semibold">Marie Claire</div>
                            <div className="text-[11px] text-outline">m.claire@kamlog.cm</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-body-sm font-body-sm text-on-surface-variant">Finance & Facturation</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2 py-0.5 bg-tertiary-container/10 text-tertiary-fixed-dim text-[11px] font-bold rounded border border-tertiary/10">FINANCE</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-tertiary-container/10 text-tertiary text-[11px] font-bold rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> PENDING MFA
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-body-sm font-body-sm text-on-surface-variant">Hier, 14:15</td>
                      <td className="px-6 py-3.5 text-right">
                        <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">edit</button>
                      </td>
                    </tr>
                    {/* User Row 3 */}
                    <tr className="hover:bg-primary-fixed/30 cursor-pointer group transition-all" onClick={() => toggleDrawer(true, 'Ahmed Traoré', 'Maintenance Parc', 'Fleet Manager')}>
                      <td className="px-6 py-3.5"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary text-xs">AT</div>
                          <div>
                            <div className="font-body-md text-body-md text-on-surface font-semibold">Ahmed Traoré</div>
                            <div className="text-[11px] text-outline">ahmed.t@kamlog.cm</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-body-sm font-body-sm text-on-surface-variant">Maintenance Véhicules</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2 py-0.5 bg-secondary-fixed/20 text-on-secondary-fixed-variant text-[11px] font-bold rounded border border-secondary/10">FLEET MANAGER</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-secondary-container/20 text-secondary text-[11px] font-bold rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> ACTIF
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-body-sm font-body-sm text-on-surface-variant">12 Oct. 2023, 11:00</td>
                      <td className="px-6 py-3.5 text-right">
                        <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">edit</button>
                      </td>
                    </tr>
                    {/* User Row 4 */}
                    <tr className="hover:bg-primary-fixed/30 cursor-pointer group transition-all" onClick={() => toggleDrawer(true, 'Sophie Ngassa', 'Admin IT', 'SysAdmin')}>
                      <td className="px-6 py-3.5"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-error/10 flex items-center justify-center font-bold text-error text-xs">SN</div>
                          <div>
                            <div className="font-body-md text-body-md text-on-surface font-semibold">Sophie Ngassa</div>
                            <div className="text-[11px] text-outline">s.ngassa@kamlog.cm</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-body-sm font-body-sm text-on-surface-variant">Systèmes Information</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2 py-0.5 bg-error-container text-on-error-container text-[11px] font-bold rounded border border-error/10">SYSADMIN</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-error-container text-error text-[11px] font-bold rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-error"></span> INACTIF
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-body-sm font-body-sm text-on-surface-variant">02 Oct. 2023, 16:30</td>
                      <td className="px-6 py-3.5 text-right">
                        <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">edit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-surface border-t border-outline-variant flex justify-between items-center">
                <span className="text-body-sm font-body-sm text-outline">Affichage de 1-10 sur 1,284 utilisateurs</span>
                <div className="flex gap-1">
                  <button className="p-1.5 border border-outline-variant rounded hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
                  <button className="px-3 py-1.5 bg-primary text-on-primary rounded font-bold text-xs">1</button>
                  <button className="px-3 py-1.5 border border-outline-variant rounded hover:bg-surface-container-high transition-colors text-xs">2</button>
                  <button className="px-3 py-1.5 border border-outline-variant rounded hover:bg-surface-container-high transition-colors text-xs">3</button>
                  <span className="px-2 py-1.5 text-outline">...</span>
                  <button className="px-3 py-1.5 border border-outline-variant rounded hover:bg-surface-container-high transition-colors text-xs">129</button>
                  <button className="p-1.5 border border-outline-variant rounded hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
                </div>
              </div>
            </div>
          </section>
          {/* Right Side Permission Panel (Drawer) */}
          <div className={`fixed inset-0 bg-on-background/40 z-[60] ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`} onClick={() => toggleDrawer(false)}></div>
          <aside className={`fixed right-0 top-0 h-full w-[420px] bg-surface shadow-2xl z-[70] drawer-transition flex flex-col border-l border-outline-variant ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Édition Utilisateur</h3>
                <p className="text-body-sm font-body-sm text-outline">{selectedUser.name || 'Chargement...'}</p>
              </div>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant" onClick={() => toggleDrawer(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              {/* User Profile Intro */}
              <div className="flex items-center gap-4 bg-primary-fixed/20 p-4 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-xl font-bold">{getInitials(selectedUser.name)}</div>
                <div>
                  <div className="text-xs text-primary font-black uppercase tracking-wider mb-1">Détails Profil</div>
                  <div className="font-body-lg text-body-lg text-on-surface font-bold">{selectedUser.name}</div>
                  <div className="text-body-sm text-on-surface-variant">{selectedUser.dept} • {selectedUser.role}</div>
                </div>
              </div>
              {/* Module Permissions Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-widest">Accès aux Modules</h4>
                  <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">HÉRITÉ DU RÔLE</span>
                </div>
                <div className="space-y-2">
                  {/* Module K-Transport */}
                  <div className="p-4 border border-outline-variant rounded-xl bg-surface-container-lowest hover:border-primary transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined">local_shipping</span>
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-bold text-on-surface">K-Transport</p>
                        <p className="text-[11px] text-outline">Gestion des flux et flottes</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input checked className="sr-only peer" type="checkbox"/>
                      <div className="w-10 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  {/* Module K-Magasin */}
                  <div className="p-4 border border-outline-variant rounded-xl bg-surface-container-lowest hover:border-primary transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-secondary/10 text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined">inventory_2</span>
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-bold text-on-surface">K-Magasin</p>
                        <p className="text-[11px] text-outline">Stocks & Entreposage</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox"/>
                      <div className="w-10 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  {/* Module K-Finance */}
                  <div className="p-4 border border-outline-variant rounded-xl bg-surface-container-lowest hover:border-primary transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-tertiary/10 text-tertiary flex items-center justify-center">
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-bold text-on-surface">K-Finance</p>
                        <p className="text-[11px] text-outline">Facturation & Reporting</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input checked className="sr-only peer" type="checkbox"/>
                      <div className="w-10 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
              {/* T-Code Access List */}
              <div className="space-y-4">
                <h4 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-widest">Autorisations T-Code</h4>
                <div className="bg-surface-container-low rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-body-sm font-medium">
                    <code className="px-2 py-1 bg-surface-container-highest rounded text-primary font-mono text-xs">TR_DISP_01</code>
                    <span className="text-on-surface-variant">Attribution Camion</span>
                    <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm font-medium">
                    <code className="px-2 py-1 bg-surface-container-highest rounded text-primary font-mono text-xs">TR_EDIT_04</code>
                    <span className="text-on-surface-variant">Modification Trajet</span>
                    <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm font-medium opacity-40">
                    <code className="px-2 py-1 bg-surface-container-highest rounded text-primary font-mono text-xs">ADM_SYS_01</code>
                    <span className="text-on-surface-variant">Configuration Racine</span>
                    <span className="material-symbols-outlined text-outline text-sm">cancel</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-outline-variant bg-surface flex gap-3">
              <button className="flex-1 py-2.5 px-4 bg-surface-container-lowest border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container-high transition-all" onClick={() => toggleDrawer(false)}>Annuler</button>
              <button className="flex-1 py-2.5 px-4 bg-primary text-on-primary font-bold rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all" onClick={() => toggleDrawer(false)}>Enregistrer</button>
            </div>
          </aside>
        </main>
      </div>
    </>
  )
}
