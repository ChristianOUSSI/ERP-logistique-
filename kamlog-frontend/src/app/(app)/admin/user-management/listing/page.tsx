// src/app/(app)/admin/user-management/listing/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { adminAPI } from '@/lib/api/admin'
import type { User } from '@/lib/api/admin'
import { TCodeSearch } from '@/components/ui/TCodeSearch'

export default function UserListing() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await adminAPI.getUsers()
        setUsers(data || [])
      } catch (err) {
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const toggleDrawer = (isOpen: boolean, user: User | null = null) => {
    if (isOpen && user) {
      setSelectedUser(user)
      setDrawerOpen(true)
    } else {
      setDrawerOpen(false)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    return parts.map(n => n[0]).join('').substring(0, 2).toUpperCase()
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
        {/* Main Content Stage */}
        <main className="h-screen flex flex-col relative overflow-hidden bg-[#F8FAFC]">
          {/* Top Navbar */}
          <header className="sticky top-0 w-full h-[64px] bg-surface border-b border-outline-variant px-[1rem] flex justify-between items-center z-40">
            <div className="flex items-center gap-4">
              <div className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</div>
              <div className="h-6 w-[1px] bg-outline-variant"></div>
              <nav className="hidden md:flex gap-6">
                <a className="font-body-base text-body-base text-primary border-b-2 border-primary pb-1 font-semibold" href="#">Utilisateurs</a>
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="/admin/permissions">Permissions</a>
                <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="/admin/journal">Journal d'Audit</a>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <TCodeSearch />
              <div className="flex items-center gap-3">
                <button className="material-symbols-outlined text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-high transition-all">notifications</button>
                <div className="flex items-center gap-2 pl-2 border-l border-outline-variant">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">AD</div>
                  <div className="flex flex-col">
                    <span className="text-label-sm font-label-sm leading-none">Admin</span>
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
                <a href="/admin/user-management/create" className="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                  <span className="font-label-md text-label-md">Nouvel Utilisateur</span>
                </a>
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
                  <p className="text-headline-sm font-headline-sm font-bold">{users.length}</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="text-label-sm font-label-sm text-outline">Utilisateurs Actifs</p>
                  <p className="text-headline-sm font-headline-sm font-bold">{users.filter(u => u.is_active).length}</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4">
                <div className="w-12 h-12 bg-tertiary/10 rounded-lg flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">lock_reset</span>
                </div>
                <div>
                  <p className="text-label-sm font-label-sm text-outline">MFA Actif</p>
                  <p className="text-headline-sm font-headline-sm font-bold">{users.filter(u => u.mfa_enabled).length}</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4">
                <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">person_off</span>
                </div>
                <div>
                  <p className="text-label-sm font-label-sm text-outline">Inactifs</p>
                  <p className="text-headline-sm font-headline-sm font-bold">{users.filter(u => !u.is_active).length}</p>
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
                      <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">Rôle ERP</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">MFA</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Chargement...</td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Aucun utilisateur trouvé.</td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-primary-fixed/30 cursor-pointer group transition-all" onClick={() => toggleDrawer(true, user)}>
                          <td className="px-6 py-3.5"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">{getInitials(user.username)}</div>
                              <div>
                                <div className="font-body-md text-body-md text-on-surface font-semibold">{user.username}</div>
                                <div className="text-[11px] text-outline">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className="px-2 py-0.5 bg-on-primary-fixed/5 text-on-primary-fixed text-[11px] font-bold rounded border border-on-primary-fixed/10 uppercase">{user.role}</span>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold rounded-full ${user.is_active ? 'bg-secondary-container/20 text-secondary' : 'bg-error-container text-error'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-secondary' : 'bg-error'}`}></span> {user.is_active ? 'ACTIF' : 'INACTIF'}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold rounded-full ${user.mfa_enabled ? 'bg-secondary-container/20 text-secondary' : 'bg-outline-variant text-on-surface-variant'}`}>
                              {user.mfa_enabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">edit</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-surface border-t border-outline-variant flex justify-between items-center">
                <span className="text-body-sm font-body-sm text-outline">Affichage de {users.length} utilisateurs</span>
              </div>
            </div>
          </section>
          {/* Right Side Permission Panel (Drawer) */}
          <div className={`fixed inset-0 bg-on-background/40 z-[60] ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`} onClick={() => toggleDrawer(false)}></div>
          <aside className={`fixed right-0 top-0 h-full w-[420px] bg-surface shadow-2xl z-[70] drawer-transition flex flex-col border-l border-outline-variant ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface font-bold">Édition Utilisateur</h3>
                <p className="text-body-sm font-body-sm text-outline">{(selectedUser as any)?.fullName || (selectedUser as any)?.username || (selectedUser as any)?.email || 'Chargement...'}</p>
              </div>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant" onClick={() => toggleDrawer(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {selectedUser && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* User Profile Intro */}
                <div className="flex items-center gap-4 bg-primary-fixed/20 p-4 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-xl font-bold">{getInitials(selectedUser.username)}</div>
                  <div>
                    <div className="text-xs text-primary font-black uppercase tracking-wider mb-1">Détails Profil</div>
                    <div className="font-body-lg text-body-lg text-on-surface font-bold">{selectedUser.username}</div>
                    <div className="text-body-sm text-on-surface-variant">{selectedUser.email}</div>
                  </div>
                </div>
                {/* Information and Roles */}
                <div className="space-y-4">
                  <h4 className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-widest">Informations</h4>
                  <div className="space-y-2">
                    <p className="text-body-sm text-on-surface-variant"><strong>Rôle:</strong> {selectedUser.role.toUpperCase()}</p>
                    <p className="text-body-sm text-on-surface-variant"><strong>MFA:</strong> {selectedUser.mfa_enabled ? 'Activé' : 'Désactivé'}</p>
                    <p className="text-body-sm text-on-surface-variant"><strong>Statut:</strong> {selectedUser.is_active ? 'Actif' : 'Inactif'}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="p-6 border-t border-outline-variant bg-surface flex gap-3">
              <button className="flex-1 py-2.5 px-4 bg-surface-container-lowest border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container-high transition-all" onClick={() => toggleDrawer(false)}>Fermer</button>
            </div>
          </aside>
        </main>
      </div>
    </>
  )
}
