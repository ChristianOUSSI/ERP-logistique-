'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/layout/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { getRouteForRole } from '@/lib/role-routes';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Route Guard Logic
  const isAuthorized = () => {
    if (!user) return false;
    const role = user.role.toUpperCase();
    if (role === 'ADMIN' || role === 'MANAGER') return true; // Admin has full access

    // Extract base module from pathname (e.g. '/magasin/dashboard' -> 'magasin')
    const baseModule = pathname.split('/')[1];

    switch (role) {
      case 'MAGASINIER':
      case 'MAGASIN':
        return baseModule === 'magasin' || baseModule === 'dashboard';
      case 'FINANCE':
        return baseModule === 'finance' || baseModule === 'dashboard';
      case 'TRANSPORT':
      case 'DISPATCHER':
        return baseModule === 'transport' || baseModule === 'dashboard';
      case 'PARC':
      case 'GATE':
      case 'GATE_AGENT':
        return baseModule === 'parc' || baseModule === 'dashboard';
      case 'AUDITOR':
        return ['audit', 'security', 'reports', 'dashboard'].includes(baseModule);
      default:
        // By default, assume standard access, or we can be strict and deny.
        // Let's allow access to global dashboard to everyone to avoid breaking things, but restrict specifics.
        return baseModule === 'dashboard'; 
    }
  };

  // Show nothing or a loader while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Chargement...
      </div>
    );
  }

  // If not loading and no user, we are redirecting
  if (!user) {
    return null; 
  }

  if (!isAuthorized()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 gap-4">
        <h2 className="text-2xl font-bold text-red-600">Accès Refusé</h2>
        <p>Votre rôle ({user.role}) ne vous permet pas d'accéder à ce module.</p>
        <button 
          onClick={() => router.push(getRouteForRole(user.role))}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retourner à mon espace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">KAMLOG EM-ERP</h1>
            <button
              onClick={() => logout()}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Déconnexion ({user.fullName || user.email})
            </button>
          </div>
        </div>
      </header>
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
