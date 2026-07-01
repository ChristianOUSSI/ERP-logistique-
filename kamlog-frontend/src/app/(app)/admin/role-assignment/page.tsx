"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI, User, DbRole } from '@/lib/api/admin';

export default function RoleAssignmentPage() {
  const queryClient = useQueryClient();
  
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [assignedRoleCode, setAssignedRoleCode] = useState<string>('');
  
  const [userFilterText, setUserFilterText] = useState('');
  const [roleFilterText, setRoleFilterText] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch Users
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminAPI.getUsers,
  });

  // Fetch Roles
  const { data: roles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: adminAPI.getDbRoles,
  });

  const loading = loadingUsers || loadingRoles;
  const selectedUser = users.find(u => u.id === selectedUserId) || null;

  useEffect(() => {
    if (users.length > 0 && selectedUserId === null) {
      setSelectedUserId(users[0].id);
      setAssignedRoleCode(users[0].role || '');
    }
  }, [users, selectedUserId]);

  const selectUser = (user: User) => {
    setSelectedUserId(user.id);
    setAssignedRoleCode(user.role || '');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, roleCode }: { userId: number, roleCode: string }) => 
      adminAPI.updateUserRole(userId, roleCode),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['admin-users'], (old: User[]) => 
        old.map(u => u.id === updatedUser.id ? updatedUser : u)
      );
      setSuccessMessage(`Rôle "${assignedRoleCode.toUpperCase()}" affecté avec succès à ${updatedUser.username}`);
      setErrorMessage('');
    },
    onError: (err: any) => {
      console.error('Error updating user role:', err);
      setErrorMessage(err.response?.data?.detail || 'Une erreur est survenue lors de l\'affectation');
    }
  });

  const handleSave = () => {
    if (!selectedUserId) return;
    if (!assignedRoleCode) {
      setErrorMessage('Veuillez sélectionner un rôle');
      return;
    }
    setSuccessMessage('');
    setErrorMessage('');
    updateUserRoleMutation.mutate({ userId: selectedUserId, roleCode: assignedRoleCode });
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Filtering
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(userFilterText.toLowerCase()) ||
    user.email.toLowerCase().includes(userFilterText.toLowerCase())
  );

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(roleFilterText.toLowerCase()) ||
    role.code.toLowerCase().includes(roleFilterText.toLowerCase())
  );

  // Selected role permissions list
  const activeRoleData = roles.find(r => r.code === assignedRoleCode);
  const permissionsList = activeRoleData ? activeRoleData.permissions : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-body-lg text-outline animate-pulse">Chargement de la gestion des affectations...</div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
      `}</style>
      <div className="bg-[#F8FAFC] text-on-surface min-h-screen">
        <main className="p-lg space-y-lg max-w-[1600px] w-full mx-auto">
          {/* Header */}
          <div className="space-y-xxs">
            <div className="flex items-center gap-xs text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider">
              <span>Admin</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span>Gestion Utilisateurs</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-primary font-bold">Affectation des Rôles</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Affecter les Rôles Utilisateurs</h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-[1rem] items-start">
            
            {/* Left Column: User Selection List */}
            <section className="col-span-12 md:col-span-3 bg-white border border-outline-variant rounded-xl p-md shadow-sm space-y-md flex flex-col max-h-[650px] overflow-hidden">
              <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary">group</span>
                Utilisateurs
              </h3>
              
              <div className="relative">
                <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">search</span>
                <input 
                  className="w-full pl-xl pr-sm py-xxs rounded border border-outline-variant bg-[#F8FAFC] text-body-sm font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                  placeholder="Rechercher..." 
                  type="text"
                  value={userFilterText}
                  onChange={(e) => setUserFilterText(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-xxs pr-xxs">
                {filteredUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => selectUser(user)}
                    className={`w-full flex items-center gap-sm p-sm rounded-lg border transition-all text-left ${
                      selectedUser?.id === user.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-transparent hover:bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                      {getInitials(user.username)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-title-sm text-title-sm font-bold truncate">{user.username}</p>
                      <p className="text-body-sm text-on-surface-variant truncate">{user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Center Column: User Details and Role Selection */}
            <section className="col-span-12 md:col-span-6 bg-white border border-outline-variant rounded-xl shadow-sm flex flex-col min-h-[650px] overflow-hidden">
              <div className="p-lg border-b border-outline-variant bg-surface-container-lowest">
                <h3 className="font-title-md text-title-md text-on-surface">Sélection du Rôle</h3>
                {selectedUser && (
                  <p className="text-body-sm text-on-surface-variant mt-xxs">
                    Modifier le rôle de <strong>{selectedUser.username}</strong>
                  </p>
                )}
              </div>

              <div className="flex-1 p-lg overflow-y-auto custom-scrollbar space-y-md">
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

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">filter_list</span>
                  <input 
                    className="w-full pl-xl pr-sm py-xxs rounded border border-outline-variant bg-[#F8FAFC] text-body-sm font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                    placeholder="Filtrer les rôles..." 
                    type="text"
                    value={roleFilterText}
                    onChange={(e) => setRoleFilterText(e.target.value)}
                  />
                </div>

                <div className="space-y-xs pr-xxs">
                  {filteredRoles.map(role => (
                    <label 
                      key={role.code} 
                      className={`group flex items-start gap-md p-md rounded border transition-all cursor-pointer ${
                        assignedRoleCode === role.code
                          ? 'border-primary bg-primary/5'
                          : 'border-outline-variant hover:border-primary hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="mt-xxs">
                        <input 
                          type="radio" 
                          name="assigned-role"
                          checked={assignedRoleCode === role.code}
                          onChange={() => setAssignedRoleCode(role.code)}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-title-md text-title-md text-on-surface font-bold">{role.name}</span>
                          <span className="font-mono text-xs uppercase bg-surface-variant px-xs rounded text-on-surface-variant">
                            {role.code}
                          </span>
                        </div>
                        <p className="text-body-sm font-body-sm text-on-surface-variant mt-xxs">{role.description || 'Aucune description disponible.'}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-lg bg-surface-container-lowest border-t border-outline-variant flex items-center justify-end gap-md">
                <button 
                  onClick={() => setAssignedRoleCode(selectedUser?.role || '')}
                  className="px-lg py-sm text-on-surface-variant hover:bg-surface-container-high rounded font-label-md text-label-md transition-colors"
                >
                  Réinitialiser
                </button>
                <button 
                  onClick={handleSave}
                  disabled={updateUserRoleMutation.isPending || !selectedUser}
                  className="px-xl py-sm bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary-container transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {updateUserRoleMutation.isPending ? 'Enregistrement...' : 'Confirmer l\'Affectation'}
                </button>
              </div>
            </section>

            {/* Right Column: Permission Preview */}
            <section className="col-span-12 md:col-span-3 bg-white border border-outline-variant rounded-xl shadow-sm flex flex-col min-h-[650px] overflow-hidden">
              <div className="p-lg border-b border-outline-variant bg-surface-container-lowest">
                <h3 className="font-title-md text-title-md text-on-surface">Droits Associés</h3>
                <p className="text-label-sm font-label-sm text-on-surface-variant mt-xxs">Aperçu en direct des permissions pour le rôle sélectionné</p>
              </div>

              <div className="p-lg flex-1 overflow-y-auto custom-scrollbar space-y-md">
                {permissionsList.length === 0 ? (
                  <p className="text-body-sm italic text-on-surface-variant opacity-60 text-center py-xl">
                    Aucune permission associée à ce rôle.
                  </p>
                ) : (
                  <div className="space-y-xxs">
                    {permissionsList.map((perm) => (
                      <div key={perm.code} className="flex items-start gap-xs text-body-sm font-body-sm text-on-surface py-xxs border-b border-outline-variant border-dotted last:border-0">
                        <span className="material-symbols-outlined text-[16px] text-secondary mt-xxs">check_circle</span>
                        <div>
                          <div className="font-semibold">{perm.name}</div>
                          <div className="text-[10px] font-mono text-outline">{perm.code}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

          </div>
        </main>
      </div>
    </>
  );
}
