'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/layout/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { getRouteForRole } from '@/lib/role-routes';
import Link from 'next/link';

import ModuleSidebar from '@/components/layout/ModuleSidebar';
import { FullScreenLoader } from '@/components/ui/Loaders';
import { notificationsAPI } from '@/lib/api-client';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch notification count dynamically
  useEffect(() => {
    if (!user) return;
    const fetchNotifCount = async () => {
      try {
        const res = await notificationsAPI.getStats();
        setNotifCount(res.data?.total_unread ?? 0);
      } catch {
        // Silently fail — not critical
      }
    };
    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const userInitial = (user?.fullName || user?.email || 'U').charAt(0).toUpperCase();
  const displayRole = user?.roles?.join(', ')?.replace(/_/g, ' ') || '';
  const isAdmin = user?.roles?.some(r => r.toUpperCase() === 'ADMIN' || r.toUpperCase() === 'MANAGER');

  return (
    <div className="min-h-screen bg-background text-on-background flex h-screen overflow-hidden antialiased font-body-base relative">
      
      {/* Mobile Overlay */}
      {!isSidebarCollapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity" 
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      <ModuleSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        <header className="bg-surface border-b border-outline-variant sticky top-0 w-full z-30 flex justify-between items-center h-[64px] px-gutter shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="md:hidden p-1 hover:bg-slate-100 rounded-md text-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <span className="font-title-sm text-title-sm text-on-surface font-black md:hidden truncate">KAMLOG EM-ERP</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell with dynamic badge */}
            <Link href="/security/notifications" className="relative p-2 hover:bg-surface-container-high rounded-full transition-colors text-secondary hidden sm:flex items-center justify-center" title="Notifications">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {notifCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-sm">
                  {notifCount > 99 ? '99+' : notifCount}
                </span>
              )}
            </Link>

            {/* User Menu Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20 shrink-0">
                  {userInitial}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-on-surface leading-tight truncate max-w-[120px]">{user?.fullName || user?.email}</span>
                  <span className="text-xs text-secondary capitalize leading-tight truncate max-w-[120px]">{displayRole}</span>
                </div>
                <span className={`material-symbols-outlined text-[16px] text-slate-400 transition-transform duration-200 hidden md:block ${userMenuOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Dropdown Panel */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Header */}
                  <div className="px-4 py-3 bg-gradient-to-br from-slate-50 to-blue-50/50 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName || user?.email}</p>
                    <p className="text-xs text-slate-500 capitalize truncate">{displayRole}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1.5">
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">account_circle</span>
                      Mon Profil
                    </Link>
                    <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">settings</span>
                      Paramètres
                    </Link>
                    <Link href="/security/notifications" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">notifications</span>
                      <span className="flex-1">Notifications</span>
                      {notifCount > 0 && (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{notifCount}</span>
                      )}
                    </Link>
                    {isAdmin && (
                      <Link href="/dashboard/global" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-[18px] text-slate-400">dashboard</span>
                        Dashboard Global
                      </Link>
                    )}
                    {isAdmin && (
                      <Link href="/admin/user-management/listing" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-[18px] text-slate-400">manage_accounts</span>
                        Administration
                      </Link>
                    )}
                  </div>

                  {/* Separator + Logout */}
                  <div className="border-t border-slate-100 py-1.5">
                    <button
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto w-full bg-slate-50/30 relative">
          {children}
        </main>
      </div>
    </div>
  );
}


