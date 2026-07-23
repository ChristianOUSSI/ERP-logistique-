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
import { ComingSoonProvider } from '@/contexts/ComingSoonContext';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { KeyboardShortcutHandler } from '@/components/shared/KeyboardShortcutHandler';
import SubModuleOrbitalBubble from '@/components/layout/SubModuleOrbitalBubble';

export default function AppLayout({

  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ComingSoonProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </ComingSoonProvider>
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

  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  /* ────────────────────────────────────────────
   * Responsive breakpoint detection
   * lg = 1024px threshold (Tailwind default)
   * ──────────────────────────────────────────── */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');

    const sync = (e?: MediaQueryList | MediaQueryListEvent) => {
      const mobile = e ? (e as MediaQueryListEvent).matches : mq.matches;
      setIsMobileViewport(mobile);
      // Close mobile drawer when resizing to desktop
      if (!mobile) setIsMobileSidebarOpen(false);
    };

    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Prevent body scroll when mobile drawer is open */
  useEffect(() => {
    if (isMobileViewport && isMobileSidebarOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isMobileViewport, isMobileSidebarOpen]);

  /* ────────────────────────────────────────────
   * Auth guard
   * ──────────────────────────────────────────── */
  useEffect(() => {
    if (!loading && !user && pathname !== '/logout') {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  /* ────────────────────────────────────────────
   * RBAC route guard
   * ──────────────────────────────────────────── */
  const isAuthorized = () => {
    if (!user) return false;
    const userRoles = user.roles.map(r => r.toUpperCase());
    if (userRoles.includes('ADMIN') || userRoles.includes('MANAGER')) return true;

    const baseModule = pathname.split('/')[1];
    const commonPages = ['dashboard', 'profile', 'support', 'logout', 'settings', 'chauffeur', 'acconage', 'qhse', 'transit', 'maintenance', 'rh', 'cotations', 'tracking', 'fuel-guard', 'procurement', 'compliance', 'bi'];
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
        case 'CLIENT':
        case 'CLIENT_B2B':
          return ['client-portal', 'documents', 'reports'].includes(baseModule);
        default:
          return false;
      }
    });
  };


  /* ────────────────────────────────────────────
   * Loading / Auth states
   * ──────────────────────────────────────────── */
  if (loading) return <FullScreenLoader />;
  if (!user && pathname !== '/logout') return null;

  if (!isAuthorized()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center text-on-background">
        <div className="rounded-2xl border border-outline bg-surface p-8 shadow-xl max-w-md w-full">
          <span className="material-symbols-outlined text-error text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          <h2 className="text-2xl font-bold text-error mb-2">Accès Refusé</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Votre profil ({user.roles?.join(', ')}) ne vous permet pas d&apos;accéder à ce module.
          </p>
          <button
            onClick={() => router.push(getRouteForRole(user.roles))}
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-on-primary transition hover:opacity-90"
          >
            Retourner à mon espace
          </button>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────────
   * CSS Grid layout
   *
   * Desktop:
   *   Header (sticky, z-30, h-16, full width)
   *   ┌──────────────┬──────────────────────────┐
   *   │  Sidebar     │  Main content             │
   *   │  (z-20)      │  (overflow-y-auto)        │
   *   └──────────────┴──────────────────────────┘
   *
   * Mobile:
   *   Header (sticky, z-30)
   *   Main content (full width)
   *   Sidebar overlay (fixed, z-[60], above everything)
   *
   * Z-index hierarchy:
   *   Header          z-30
   *   Desktop sidebar z-20 (within flow, no overlap)
   *   Mobile overlay  z-[55] (backdrop) / z-[60] (drawer)
   *   Header dropdowns z-50 (above sidebar, below mobile drawer)
   *   Notifications drawer z-[60]
   *   Session modal   z-[9999]
   * ──────────────────────────────────────────── */

  const sidebarWidth = isSidebarCollapsed ? '72px' : '260px';

  return (
    <div className="flex min-h-screen flex-col bg-surface-container-low overflow-x-hidden">
      <Toaster position="top-right" richColors theme={uiTheme === 'system' ? 'system' : uiTheme} />
      <CommandPalette />
      <KeyboardShortcutHandler />
      <SubModuleOrbitalBubble />

      {/* ── Sticky Header (full width) ── */}

      <ModuleHeader
        currentModule={currentModule}
        onMenuClick={() => {
          if (isMobileViewport) {
            setIsMobileSidebarOpen((prev) => !prev);
          } else {
            setIsSidebarCollapsed((prev) => !prev);
          }
        }}
      />

      {/* ── Body row: sidebar + main ── */}
      <div className="relative flex flex-1 min-h-[calc(100vh-64px)]">

        {/* Mobile backdrop overlay */}
        {isMobileViewport && isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar
            — on mobile: fixed drawer (handled entirely inside ModuleSidebar)
            — on desktop: inline in flex row, shrinks/expands */}
        <div
          className={`
            flex-shrink-0 transition-[width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isMobileViewport ? 'w-0 overflow-visible' : ''}
          `}
          style={isMobileViewport ? undefined : { width: sidebarWidth }}
        >
          <ModuleSidebar
            isCollapsed={isSidebarCollapsed}
            isMobile={isMobileViewport}
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
            onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
          />
        </div>

        {/* Main content */}
        <main
          className={`min-w-0 flex-1 overflow-x-hidden px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 ${theme.mainBackground}`}
        >
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
