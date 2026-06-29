// src/app/(app)/admin/permissions/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { adminAPI } from '@/lib/api/admin'
import type { Role } from '@/lib/api/admin'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/layout/AuthProvider'

export default function Permissions() {
  const router = useRouter()
  const { logout } = useAuth()
  const [searchFocused, setSearchFocused] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRoles() {
      try {
        const data = await adminAPI.getRoles()
        setRoles(data || [])
        if (data && data.length > 0) {
          setSelectedRole(data[0])
        }
      } catch (err) {
        console.error('Error fetching roles:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRoles()
  }, [])

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
      <div className="bg-surface-container-low font-body-md text-on-surface min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        
        {/* Main Content Stage */}
        <main className="flex-1 p-[1.5rem]">
          {/* Breadcrumbs & Header */}
          <div className="mb-lg">
            
            <div className="flex justify-between items-end">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Matrice de Sécurité</h2>
                <p className="text-body-md text-on-surface-variant mt-1">Définissez les privilèges d'accès granulaires pour les modules ERP.</p>
              </div>
              <div className="flex gap-sm">
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
                {loading ? (
                  <div className="text-body-sm text-on-surface-variant">Chargement...</div>
                ) : (
                  <>
                    <div className="text-[32px] font-black text-on-surface">{roles.length}</div>
                    <div className="mt-md space-y-xs">
                      {roles.map(r => (
                        <div key={r.id} className="flex justify-between items-center text-body-sm">
                          <span className="flex items-center gap-xs text-xs truncate" title={r.description}>
                            <span className="w-2 h-2 rounded-full bg-primary"></span> {r.name.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Main Permission Matrix */}
            <div className="col-span-12 lg:col-span-9">
              {/* Role Selection Slider/Pills */}
              <div className="mb-lg">
                <h3 className="font-title-md text-title-md mb-md">Configuration par Rôle</h3>
                <div className="flex gap-sm overflow-x-auto pb-xs custom-scrollbar">
                  {loading ? (
                     <div className="text-sm text-on-surface-variant">Chargement des rôles...</div>
                  ) : (
                    roles.map(role => (
                      <button 
                        key={role.id}
                        onClick={() => setSelectedRole(role)}
                        className={`flex-shrink-0 px-md py-sm rounded-full flex items-center gap-xs transition-all ${selectedRole?.id === role.id ? 'border-2 border-primary bg-primary/5 text-primary font-bold' : 'border border-outline text-on-surface-variant font-medium hover:border-primary/50'}`}
                      >
                        {role.name.toUpperCase()}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {selectedRole && (
                <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                    <div className="flex gap-md">
                      <span className="font-bold text-body-md">Droits d'accès pour : {selectedRole.description}</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-surface-container-low sticky top-0 z-10">
                          <th className="p-md font-bold text-label-md border-b border-outline-variant w-64">MODULE / ACTION GLOBALE</th>
                          <th className="p-md font-bold text-label-md border-b border-outline-variant text-center">LIRE</th>
                          <th className="p-md font-bold text-label-md border-b border-outline-variant text-center">ÉCRIRE / CRÉER</th>
                          <th className="p-md font-bold text-label-md border-b border-outline-variant text-center">MODIFIER</th>
                          <th className="p-md font-bold text-label-md border-b border-outline-variant text-center">SUPPRIMER</th>
                          <th className="p-md font-bold text-label-md border-b border-outline-variant text-center">APPROUVER</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {/* Simulate modules based on the selected role's generic permissions */}
                        <tr className="bg-surface-container-lowest matrix-cell group">
                          <td className="p-md">
                            <div className="flex items-center gap-sm">
                              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                              </div>
                              <div>
                                <div className="font-bold text-body-md">Droits Généraux ({selectedRole.name.toUpperCase()})</div>
                                <div className="text-label-sm text-on-surface-variant">Permissions héritées du système</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-md text-center">
                            <input 
                              checked={selectedRole.permissions.read}
                              readOnly
                              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                              type="checkbox"
                            />
                          </td>
                          <td className="p-md text-center">
                            <input 
                              checked={selectedRole.permissions.create}
                              readOnly
                              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                              type="checkbox"
                            />
                          </td>
                          <td className="p-md text-center">
                            <input 
                              checked={selectedRole.permissions.modify}
                              readOnly
                              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                              type="checkbox"
                            />
                          </td>
                          <td className="p-md text-center">
                            <input 
                              checked={selectedRole.permissions.delete}
                              readOnly
                              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                              type="checkbox"
                            />
                          </td>
                          <td className="p-md text-center">
                            <input 
                              checked={selectedRole.permissions.approve}
                              readOnly
                              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" 
                              type="checkbox"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
