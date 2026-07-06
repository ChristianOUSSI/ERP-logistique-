'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/layout/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { getRouteForRole } from '@/lib/role-routes';

import ModuleSidebar from '@/components/layout/ModuleSidebar';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { SettingsProvider, useSettings } from '@/components/layout/SettingsProvider';
import { useModuleTheme } from '@/hooks/useModuleTheme';
import { FullScreenLoader } from '@/components/ui/Loaders';
import { Toaster } from 'sonner';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SettingsProvider>
  );
}

function AppLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, currentModule } = useModuleTheme();
  const { theme: uiTheme } = useSettings();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auto-collapse based on screen size (Standard Tablet/Mobile breakpoint)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false); 
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Route Guard Logic
  const isAuthorized = () => {
    if (!user) return false;
    const userRoles = user.roles.map(r => r.toUpperCase());
    if (userRoles.includes('ADMIN') || userRoles.includes('MANAGER')) return true; // Admin has full access

    // Extract base module from pathname (e.g. '/magasin/dashboard' -> 'magasin')
    const baseModule = pathname.split('/')[1];

    // Pages accessibles à tous les rôles authentifiés
    const commonPages = ['dashboard', 'profile', 'support', 'logout', 'settings', 'chauffeur'];
    if (commonPages.includes(baseModule)) return true;

    return userRoles.some(role => {
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
    });
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return null; 
  }

  if (!isAuthorized()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 gap-4">
        <h2 className="text-2xl font-bold text-red-600">Accès Refusé</h2>
        <p>Votre profil ({user.roles?.join(', ')}) ne vous permet pas d'accéder à ce module.</p>
        <button 
          onClick={() => router.push(getRouteForRole(user.roles))}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retourner à mon espace
        </button>
      </div>
    );
  }

  // Maintainable sidebar width variables
  const sidebarWidth = isSidebarCollapsed ? '80px' : '260px';
  const iconSize = isSidebarCollapsed ? '24px' : '22px';

  const containerStyle = {
    '--sidebar-width': sidebarWidth,
    '--sidebar-icon-size': iconSize,
  } as React.CSSProperties;

  return (
    <div style={containerStyle} className="min-h-screen bg-surface-container-low">
      <Toaster position="top-right" richColors theme={uiTheme === 'system' ? 'system' : uiTheme} />

      {/* Mobile Overlay */}
      {!isSidebarCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity" 
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      {/* Header global */}
      <ModuleHeader currentModule={currentModule} />
      
      <div className="flex">
        {/* Sidebar responsive */}
        <ModuleSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        
        {/* Contenu principal */}
        <main 
          className={`flex-1 p-6 transition-all duration-300 min-h-[calc(100vh-64px)] ${theme.mainBackground}`}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}



