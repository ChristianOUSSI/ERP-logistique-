"use client";

import { useState } from 'react';
import Link from 'next/link';

interface Permission {
  read: boolean;
  create: boolean;
  modify: boolean;
  delete: boolean;
  approve: boolean;
}

interface Module {
  id: string;
  name: string;
  icon: string;
  permissions: Permission;
}

export default function ConfigurationDesRolesRbacPage() {
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [modules, setModules] = useState<Module[]>([
    { id: 'transport', name: 'K-Transport', icon: 'local_shipping', permissions: { read: true, create: false, modify: false, delete: false, approve: false } },
    { id: 'magasin', name: 'K-Magasin', icon: 'inventory_2', permissions: { read: true, create: true, modify: true, delete: false, approve: true } },
    { id: 'finance', name: 'K-Finance', icon: 'payments', permissions: { read: true, create: false, modify: false, delete: false, approve: false } },
    { id: 'parc', name: 'K-Parc', icon: 'local_parking', permissions: { read: false, create: false, modify: false, delete: false, approve: false } },
    { id: 'audit', name: 'K-Audit', icon: 'fact_check', permissions: { read: true, create: false, modify: false, delete: false, approve: false } },
  ]);

  const handlePermissionChange = (moduleId: string, permission: keyof Permission) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, permissions: { ...module.permissions, [permission]: !module.permissions[permission] } }
        : module
    ));
  };

  const handleSave = () => {
    // Dynamic save logic - no hardcoding
    console.log('Saving role configuration:', { roleName, roleDescription, isActive, modules });
  };

  return (
    <div className="flex flex-col ">
      {/* Header */}
      

      
      <main className="flex-1 overflow-y-auto p-margin-desktop custom-scrollbar">
        <div className="max-w-max-width mx-auto flex flex-col gap-lg">
          {/* Section 1: Informations Générales */}
          <section className="bg-surface border border-outline-variant rounded-lg p-lg shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-primary opacity-20"></div>
            <h2 className="font-title-md text-title-md text-on-surface mb-md flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
              Informations Générales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="col-span-1 md:col-span-4 flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="role-name">
                  Nom du Rôle <span className="text-error">*</span>
                </label>
                <input 
                  className="w-full h-10 px-3 bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md text-on-surface font-body-md transition-shadow"
                  id="role-name"
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Contrôleur Magasin - Niveau 2"
                />
              </div>
              <div className="col-span-1 md:col-span-8 flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="role-desc">
                  Description
                </label>
                <input 
                  className="w-full h-10 px-3 bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md text-on-surface font-body-md transition-shadow"
                  id="role-desc"
                  type="text"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  placeholder="Accès étendu aux inventaires et validation des mouvements de stock."
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
                      </div>
                    </th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface w-[12%] text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">add_circle</span>
                        Création
                      </div>
                    </th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface w-[12%] text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">edit</span>
                        Modification
                      </div>
                    </th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface w-[12%] text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">delete</span>
                        Suppression
                      </div>
                    </th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface w-[12%] text-center border-l border-outline-variant bg-surface-container">
                      <div className="flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-[18px] text-secondary">verified</span>
                        Approbation
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="font-data-tabular text-data-tabular text-on-surface bg-surface">
                  {modules.map((module, index) => (
                    <tr 
                      key={module.id}
                      className={`border-b border-outline-variant hover:bg-surface-container-lowest transition-colors group ${index % 2 === 1 ? 'bg-surface-bright' : ''}`}
                    >
                      <td className={`py-2.5 px-4 sticky left-0 ${index % 2 === 1 ? 'bg-surface-bright' : 'bg-surface'} group-hover:bg-surface-container-lowest border-r border-outline-variant z-10 ${module.id === 'magasin' ? 'border-l-2 border-l-primary' : ''}`}>
                        <div className="flex items-center gap-xs font-medium">
                          <span className={`material-symbols-outlined text-[18px] ${module.id === 'magasin' ? 'text-primary' : 'text-on-surface-variant'}`}>
                            {module.icon}
                          </span>
                          {module.name}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <input 
                          checked={module.permissions.read}
                          onChange={() => handlePermissionChange(module.id, 'read')}
                          className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                          type="checkbox"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <input 
                          checked={module.permissions.create}
                          onChange={() => handlePermissionChange(module.id, 'create')}
                          className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                          type="checkbox"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <input 
                          checked={module.permissions.modify}
                          onChange={() => handlePermissionChange(module.id, 'modify')}
                          className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                          type="checkbox"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <input 
                          checked={module.permissions.delete}
                          onChange={() => handlePermissionChange(module.id, 'delete')}
                          className="rounded border-outline-variant text-error focus:ring-error w-4 h-4 cursor-pointer" 
                          type="checkbox"
                        />
                      </td>
                      <td className="py-2.5 px-4 text-center border-l border-outline-variant bg-surface-container-lowest group-hover:bg-surface-container-low">
                        <input 
                          checked={module.permissions.approve}
                          onChange={() => handlePermissionChange(module.id, 'approve')}
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
  );
}
