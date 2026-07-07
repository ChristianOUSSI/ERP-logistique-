'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { ModuleType } from '@/components/layout/ModuleSidebar';

// Validating list of modules for type guarding
const VALID_MODULES: ModuleType[] = ['admin', 'master-data', 'transport', 'finance', 'magasin', 'parc', 'audit', 'dashboard'];

interface ModuleThemeConfig {
  mainBackground: string; // Background for the main content area
  /** CSS utility class using --module-* CSS vars — fully dark-aware */
  headerClasses: string;
  sidebar: {
    activeAccent: string;    // Signature color for borders/text
    activeBgSubtle: string;  // 10% opacity background for active state
    hoverBg: string;         // Background for sidebar item on hover
    brandIconBg: string;     // Background for the module icon in the sidebar brand area
    brandIconText: string;   // Text color for the module icon in the sidebar brand area
  };
}

/**
 * All headerClasses now use CSS custom properties defined in globals.css
 * (.module-badge-*) — these automatically adapt to dark/light mode via
 * separate --module-*-bg / --module-*-text variables per theme.
 */
const MODULE_THEME_CONFIG: Record<ModuleType, ModuleThemeConfig> = {
  admin: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-admin',
    sidebar: {
      activeAccent: 'text-blue-400 border-blue-400',
      activeBgSubtle: 'bg-blue-500/10',
      hoverBg: 'hover:bg-slate-800',
      brandIconBg: 'bg-blue-600',
      brandIconText: 'text-white',
    },
  },
  'master-data': {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-master-data',
    sidebar: {
      activeAccent: 'text-emerald-400 border-emerald-400',
      activeBgSubtle: 'bg-emerald-500/10',
      hoverBg: 'hover:bg-slate-800',
      brandIconBg: 'bg-emerald-600',
      brandIconText: 'text-white',
    },
  },
  transport: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-transport',
    sidebar: {
      activeAccent: 'text-orange-400 border-orange-400',
      activeBgSubtle: 'bg-orange-500/10',
      hoverBg: 'hover:bg-slate-800',
      brandIconBg: 'bg-orange-600',
      brandIconText: 'text-white',
    },
  },
  finance: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-finance',
    sidebar: {
      activeAccent: 'text-violet-400 border-violet-400',
      activeBgSubtle: 'bg-violet-500/10',
      hoverBg: 'hover:bg-slate-800',
      brandIconBg: 'bg-violet-600',
      brandIconText: 'text-white',
    },
  },
  magasin: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-magasin',
    sidebar: {
      activeAccent: 'text-red-400 border-red-400',
      activeBgSubtle: 'bg-red-500/10',
      hoverBg: 'hover:bg-slate-800',
      brandIconBg: 'bg-red-600',
      brandIconText: 'text-white',
    },
  },
  parc: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-parc',
    sidebar: {
      activeAccent: 'text-cyan-400 border-cyan-400',
      activeBgSubtle: 'bg-cyan-500/10',
      hoverBg: 'hover:bg-slate-800',
      brandIconBg: 'bg-cyan-600',
      brandIconText: 'text-white',
    },
  },
  audit: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-audit',
    sidebar: {
      activeAccent: 'text-teal-400 border-teal-400',
      activeBgSubtle: 'bg-teal-500/10',
      hoverBg: 'hover:bg-slate-800',
      brandIconBg: 'bg-teal-600',
      brandIconText: 'text-white',
    },
  },
  dashboard: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-dashboard',
    sidebar: {
      activeAccent: 'text-blue-400 border-blue-400',
      activeBgSubtle: 'bg-blue-500/10',
      hoverBg: 'hover:bg-slate-800',
      brandIconBg: 'bg-blue-600',
      brandIconText: 'text-white',
    },
  },
};

export function useModuleTheme(moduleProp?: ModuleType) {
  const pathname = usePathname();

  const currentModule = useMemo((): ModuleType => {
    if (moduleProp) return moduleProp;
    const firstSegment = pathname.split('/')[1] as ModuleType;
    if (VALID_MODULES.includes(firstSegment)) return firstSegment;
    return 'admin';
  }, [pathname, moduleProp]);

  return useMemo(() => ({
    currentModule,
    theme: MODULE_THEME_CONFIG[currentModule] || MODULE_THEME_CONFIG.admin,
  }), [currentModule]);
}