'use client';

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole, canAccessTCode } from '@/utils/tcodeLookup';
import { useRouter } from 'next/navigation';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  tcode?: string;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ children, requiredRoles, tcode, fallback }: PermissionGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div className="p-8 text-center animate-pulse">Chargement des permissions...</div>;

  if (!user) {
    router.push('/login');
    return null;
  }

  let hasPermission = true;

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    hasPermission = false;
  }

  if (tcode && !canAccessTCode(user.role, tcode)) {
    hasPermission = false;
  }

  if (!hasPermission) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-slate-50 border border-slate-200 rounded-xl m-4">
        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">lock_person</span>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Accès Non Autorisé</h3>
        <p className="text-slate-600 max-w-md">
          Votre profil ({user.role}) ne possède pas les privilèges requis pour accéder à cette transaction ou ce module.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}