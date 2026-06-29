// src/app/(app)/admin/roles/configuration/page.tsx - Configuration des Rôles & Permissions - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RoleConfiguration() {
  const router = useRouter()
  const [roleName, setRoleName] = useState('Contrôleur Magasin - Niveau 2')
  const [roleDesc, setRoleDesc] = useState('Accès étendu aux inventaires et validation des mouvements de stock.')
  const [isActive, setIsActive] = useState(true)

  const permissions = [
    { module: 'K-Transport', icon: 'local_shipping', read: true, create: false, edit: false, delete: false, approve: false },
    { module: 'K-Magasin', icon: 'inventory_2', read: true, create: true, edit: true, delete: false, approve: true, highlight: true },
    { module: 'K-Finance', icon: 'payments', read: true, create: false, edit: false, delete: false, approve: false },
    { module: 'K-Parc', icon: 'local_parking', read: false, create: false, edit: false, delete: false, approve: false },
    { module: 'K-Audit', icon: 'fact_check', read: true, create: false, edit: false, delete: false, approve: false }
  ]

  const handlePermissionChange = (index: number, field: string, value: boolean) => {
    // Update permission state - will be connected to backend
  }

  const handleSave = () => {
    // Save role configuration to backend
    router.push('/admin/roles')
  }

  const handleCancel = () => {
    router.push('/admin/roles')
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e7eefe;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c2c6d6;
          border-radius: 0.125rem;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #727785;
        }
      `}</style>
      <div className="bg-background text-on-background font-body-md h-screen flex flex-col overflow-hidden">
        {/* Task-Focused Header */}
        
        
        <main className="flex-1 overflow-y-auto p-[1.5rem] custom-scrollbar">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-lg">
            {/* Section 1: Informations Générales */}
            <section className="bg-surface border border-outline-variant rounded-lg p-lg shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-primary opacity-20"></div>
              <h2 className="font-title-md text-title-md text-on-surface mb-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                Informations Générales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-[1rem]">
                <div className="col-span-1 md:col-span-4 flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="role-name">Nom du Rôle <span className="text-error">*</span></label>
                  <input 
                    className="w-full h-10 px-3 bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md text-on-surface font-body-md transition-shadow" 
                    id="role-name" 
                    type="text" 
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                  />
                </div>
                <div className="col-span-1 md:col-span-8 flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="role-desc">Description</label>
                  <input 
                    className="w-full h-10 px-3 bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md text-on-surface font-body-md transition-shadow" 
                    id="role-desc" 
                    type="text" 
                    value={roleDesc}
                    onChange={(e) => setRoleDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-md flex items-center gap-sm">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer" 
                    type="checkbox" 
                  />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-fixed rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 font-label-md text-label-md text-on-surface-variant">Statut Actif</span>
                </label>
              </div>
            </section>
            {/* Section 2: Matrice des Permissions */}
            <section className="bg-surface border border-outline-variant rounded-lg shadow-sm flex flex-col flex-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary opacity-20"></div>
              <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
                <h2 className="font-title-md text-title-md text-on-surface flex items-center gap-xs">
                  <span className="material-symbols-outlined text-secondary text-[20px]">security</span>
                  Matrice des Permissions
                </h2>
                <div className="flex items-center gap-sm text-body-sm text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  Les modifications prennent effet à la prochaine session utilisateur.
                </div>
              </div>
              <div className="overflow-x-auto w-full custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-semibold sticky left-0 bg-surface-container-low z-10 border-r border-outline-variant">
                        Module Système
                      </th>
                      <th className="py-3 px-4 font-label-md text-label-md text-on-surface w-[12%] text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">visibility</span>
                          Lecture
                          <input className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 mt-1 cursor-pointer" type="checkbox"/>
                        </div>
                      </th>
                      <th className="py-3 px-4 font-label-md text-label-md text-on-surface w-[12%] text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">add_circle</span>
                          Création
                          <input className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 mt-1 cursor-pointer" type="checkbox"/>
                        </div>
                      </th>
                      <th className="py-3 px-4 font-label-md text-label-md text-on-surface w-[12%] text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">edit</span>
                          Modification
                          <input className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 mt-1 cursor-pointer" type="checkbox"/>
                        </div>
                      </th>
                      <th className="py-3 px-4 font-label-md text-label-md text-on-surface w-[12%] text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">delete</span>
                          Suppression
                          <input className="rounded border-outline-variant text-error focus:ring-error w-4 h-4 mt-1 cursor-pointer" type="checkbox"/>
                        </div>
                      </th>
                      <th className="py-3 px-4 font-label-md text-label-md text-on-surface w-[12%] text-center border-l border-outline-variant bg-surface-container">
                        <div className="flex flex-col items-center gap-1">
                          <span className="material-symbols-outlined text-[18px] text-secondary">verified</span>
                          Approbation
                          <input className="rounded border-outline-variant text-secondary focus:ring-secondary w-4 h-4 mt-1 cursor-pointer" type="checkbox"/>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-data-tabular text-data-tabular text-on-surface bg-surface">
                    {permissions.map((perm, index) => (
                      <tr 
                        key={index} 
                        className={`border-b border-outline-variant hover:bg-surface-container-lowest transition-colors group ${index % 2 === 1 ? 'bg-surface-bright' : ''}`}
                      >
                        <td className={`py-2.5 px-4 sticky left-0 ${index % 2 === 1 ? 'bg-surface-bright' : 'bg-surface'} group-hover:bg-surface-container-lowest border-r border-outline-variant z-10 ${perm.highlight ? 'border-l-2 border-l-primary' : ''}`}>
                          <div className="flex items-center gap-xs font-medium">
                            <span className={`material-symbols-outlined text-[18px] ${perm.highlight ? 'text-primary' : 'text-on-surface-variant'}`}>{perm.icon}</span>
                            {perm.module}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <input 
                            checked={perm.read}
                            onChange={(e) => handlePermissionChange(index, 'read', e.target.checked)}
                            className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                            type="checkbox"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <input 
                            checked={perm.create}
                            onChange={(e) => handlePermissionChange(index, 'create', e.target.checked)}
                            className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                            type="checkbox"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <input 
                            checked={perm.edit}
                            onChange={(e) => handlePermissionChange(index, 'edit', e.target.checked)}
                            className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                            type="checkbox"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <input 
                            checked={perm.delete}
                            onChange={(e) => handlePermissionChange(index, 'delete', e.target.checked)}
                            className="rounded border-outline-variant text-error focus:ring-error w-4 h-4 cursor-pointer" 
                            type="checkbox"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-center border-l border-outline-variant bg-surface-container-lowest group-hover:bg-surface-container-low">
                          <input 
                            checked={perm.approve}
                            onChange={(e) => handlePermissionChange(index, 'approve', e.target.checked)}
                            className="rounded border-outline-variant text-secondary focus:ring-secondary w-4 h-4 cursor-pointer" 
                            type="checkbox"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}
