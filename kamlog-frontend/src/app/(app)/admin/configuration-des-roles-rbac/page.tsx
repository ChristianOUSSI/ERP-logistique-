"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminAPI, DbRole, Permission } from '@/lib/api/admin';

export default function ConfigurationDesRolesRbacPage() {
  const [roles, setRoles] = useState<DbRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<DbRole | null>(null);
  
  // Form fields
  const [roleCode, setRoleCode] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [rolesData, permsData] = await Promise.all([
          adminAPI.getDbRoles(),
          adminAPI.getPermissions()
        ]);
        setRoles(rolesData || []);
        setPermissions(permsData || []);
        
        // Auto-select first role if available
        if (rolesData && rolesData.length > 0) {
          selectRole(rolesData[0]);
        }
      } catch (err) {
        console.error('Error fetching RBAC configuration:', err);
        setErrorMessage('Erreur lors du chargement des configurations de rôles');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectRole = (role: DbRole) => {
    setSelectedRole(role);
    setRoleCode(role.code);
    setRoleName(role.name);
    setRoleDescription(role.description || '');
    setSelectedPermissions(new Set(role.permissions.map(p => p.code)));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const initNewRole = () => {
    setSelectedRole(null);
    setRoleCode('');
    setRoleName('');
    setRoleDescription('');
    setSelectedPermissions(new Set());
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handlePermissionToggle = (permCode: string) => {
    const updated = new Set(selectedPermissions);
    if (updated.has(permCode)) {
      updated.delete(permCode);
    } else {
      updated.add(permCode);
    }
    setSelectedPermissions(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setErrorMessage('Le nom du rôle est obligatoire');
      return;
    }
    if (!selectedRole && !roleCode.trim()) {
      setErrorMessage('Le code du rôle est obligatoire pour la création');
      return;
    }

    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      if (selectedRole) {
        // Update existing role
        const updated = await adminAPI.updateDbRole(selectedRole.code, {
          name: roleName,
          description: roleDescription,
          permission_codes: Array.from(selectedPermissions)
        });
        setRoles(roles.map(r => r.code === selectedRole.code ? updated : r));
        setSelectedRole(updated);
        setSuccessMessage('Rôle mis à jour avec succès');
      } else {
        // Create new role
        const created = await adminAPI.createDbRole({
          code: roleCode.trim().toLowerCase(),
          name: roleName,
          description: roleDescription,
          permission_codes: Array.from(selectedPermissions)
        });
        setRoles([...roles, created]);
        setSelectedRole(created);
        setSuccessMessage('Rôle créé avec succès');
      }
    } catch (err: any) {
      console.error('Error saving role:', err);
      setErrorMessage(err.response?.data?.detail || 'Une erreur est survenue lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const module = perm.module || 'autre';
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-body-lg text-outline animate-pulse">Chargement de la configuration RBAC...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
      <main className="flex-1 overflow-hidden p-margin-desktop">
        <div className="max-w-max-width mx-auto flex flex-col md:flex-row gap-lg h-full">
          {/* Left Panel: Roles List */}
          <section className="w-full md:w-80 bg-white border border-outline-variant rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-md border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
              <h2 className="font-title-md text-title-md text-on-surface flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                Rôles Système
              </h2>
              <button 
                onClick={initNewRole}
                className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all"
                title="Créer un nouveau rôle"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-xs space-y-xxs">
              {roles.map((r) => (
                <button
                  key={r.code}
                  onClick={() => selectRole(r)}
                  className={`w-full text-left p-sm rounded-lg border transition-all flex flex-col gap-xxs ${
                    selectedRole?.code === r.code
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-transparent hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span className="font-title-sm text-title-sm font-bold flex items-center justify-between">
                    {r.name}
                    <span className="text-[10px] uppercase font-mono bg-surface-variant px-xs rounded text-on-surface-variant">
                      {r.code}
                    </span>
                  </span>
                  <span className="text-body-sm text-on-surface-variant line-clamp-2">
                    {r.description || 'Aucune description.'}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Right Panel: Role Edition / Creation */}
          <section className="flex-1 bg-white border border-outline-variant rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <form onSubmit={handleSave} className="flex flex-col h-full">
              {/* Header */}
              <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
                <h2 className="font-title-md text-title-md text-on-surface flex items-center gap-xs">
                  <span className="material-symbols-outlined text-secondary text-[20px]">security</span>
                  {selectedRole ? `Édition : ${selectedRole.name}` : 'Nouveau Rôle RBAC'}
                </h2>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-xl py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {saving ? 'Sauvegarde...' : 'Enregistrer'}
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-lg space-y-lg">
                {successMessage && (
                  <div className="bg-secondary-container/20 text-secondary border border-secondary/20 p-md rounded-lg flex items-center gap-xs text-body-md font-semibold">
                    <span className="material-symbols-outlined">check_circle</span>
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="bg-error-container text-error border border-error/20 p-md rounded-lg flex items-center gap-xs text-body-md font-semibold">
                    <span className="material-symbols-outlined">error</span>
                    {errorMessage}
                  </div>
                )}

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter bg-surface-container-low p-md rounded-xl border border-outline-variant">
                  <div className="col-span-1 md:col-span-4 flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant font-bold" htmlFor="role-code">
                      Code du Rôle <span className="text-error">*</span>
                    </label>
                    <input
                      className="w-full h-10 px-3 bg-white border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md text-on-surface font-body-md transition-shadow disabled:bg-surface-variant disabled:text-outline"
                      id="role-code"
                      type="text"
                      disabled={!!selectedRole}
                      value={roleCode}
                      onChange={(e) => setRoleCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      placeholder="par exemple: coordinateur_magasin"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-8 flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant font-bold" htmlFor="role-name">
                      Nom d'Affichage <span className="text-error">*</span>
                    </label>
                    <input
                      className="w-full h-10 px-3 bg-white border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md text-on-surface font-body-md transition-shadow"
                      id="role-name"
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="par exemple: Coordinateur Magasin"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-12 flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant font-bold" htmlFor="role-desc">
                      Description
                    </label>
                    <input
                      className="w-full h-10 px-3 bg-white border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md text-on-surface font-body-md transition-shadow"
                      id="role-desc"
                      type="text"
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      placeholder="par exemple: Gestion et coordination des flux de stocks magasin."
                    />
                  </div>
                </div>

                {/* Permissions matrix */}
                <div className="space-y-md">
                  <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-xs">
                    <span className="material-symbols-outlined text-outline">checklist</span>
                    Permissions Associées
                  </h3>
                  
                  <div className="space-y-lg">
                    {Object.entries(groupedPermissions).map(([module, perms]) => (
                      <div key={module} className="border border-outline-variant rounded-xl overflow-hidden shadow-xs bg-white">
                        <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant">
                          <h4 className="font-title-sm text-title-sm font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[18px]">folder</span>
                            Module {module.toUpperCase()}
                          </h4>
                        </div>
                        <div className="p-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm">
                          {perms.map((p) => (
                            <label
                              key={p.code}
                              className={`flex items-start gap-sm p-sm rounded-lg border transition-all cursor-pointer ${
                                selectedPermissions.has(p.code)
                                  ? 'border-secondary bg-secondary/5'
                                  : 'border-outline-variant/60 hover:bg-surface-container-lowest'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedPermissions.has(p.code)}
                                onChange={() => handlePermissionToggle(p.code)}
                                className="w-4 h-4 mt-xxs rounded border-outline-variant text-secondary focus:ring-secondary"
                              />
                              <div className="flex flex-col gap-xxs">
                                <span className="font-body-md text-body-md font-semibold text-on-surface">
                                  {p.name}
                                </span>
                                <span className="font-mono text-[10px] text-outline">
                                  {p.code}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
