'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/layout/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { getRouteForRole } from '@/lib/role-routes';

import ModuleSidebar from '@/components/layout/ModuleSidebar';
import { LayoutDashboard, Settings, UserCircle, LogOut } from 'lucide-react';

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

    // Pages accessibles à tous les rôles authentifiés
    const commonPages = ['dashboard', 'profile', 'support', 'logout', 'settings'];
    if (commonPages.includes(baseModule)) return true;

    switch (role) {
      case 'MAGASINIER':
      case 'MAGASIN':
        return ['magasin', 'master-data', 'reports', 'documents'].includes(baseModule);
      case 'FINANCE':
        return ['finance', 'reports', 'documents', 'tiers'].includes(baseModule);
      case 'TRANSPORT':
      case 'DISPATCHER':
        return ['transport', 'magasin', 'tiers', 'reports', 'documents', 'master-data'].includes(baseModule);
      case 'PARC':
      case 'GATE':
      case 'GATE_AGENT':
        return ['parc', 'magasin'].includes(baseModule);
      case 'DOUANE':
        return ['documents', 'magasin', 'tiers'].includes(baseModule);
      case 'AUDITOR':
        return ['audit', 'security', 'reports', 'admin', 'magasin', 'finance', 'transport', 'parc', 'documents', 'tiers'].includes(baseModule);
      default:
        return false;
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
    <div className="min-h-screen bg-background text-on-background flex h-screen overflow-hidden antialiased font-body-base">
      <ModuleSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-surface border-b border-outline-variant sticky top-0 w-full z-40 flex justify-between items-center h-[64px] px-gutter">
          <div className="flex items-center gap-6">
            {/* The sidebar takes care of the logo, but we can put breadcrumbs or module name here later */}
            <span className="font-title-sm text-title-sm text-on-surface font-black ml-10 lg:ml-0 md:hidden">KAMLOG EM-ERP</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-secondary">
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors hidden sm:block">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                  {(user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-semibold text-on-surface leading-tight">{user?.fullName || user?.email}</span>
                  <span className="text-xs text-secondary capitalize leading-tight">{user?.role?.replace('_', ' ')}</span>
                </div>
                <button 
                  onClick={() => logout()} 
                  className="text-sm text-red-600 hover:text-red-800 font-medium ml-2 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
