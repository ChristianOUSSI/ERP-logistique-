'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { ModuleType } from '@/components/layout/ModuleSidebar';

// Validating list of modules for type guarding
const VALID_MODULES: ModuleType[] = ['admin', 'master-data', 'transport', 'finance', 'magasin', 'parc', 'audit'];

interface ModuleThemeConfig {
  mainBackground: string; // Background for the main content area
  headerClasses: string; // Classes for the module badge in the header
  sidebar: {
    activeAccent: string; // Signature color for borders/text
    activeBgSubtle: string; // 10% opacity background for active state
    hoverBg: string; // Background for sidebar item on hover
    brandIconBg: string; // Background for the module icon in the sidebar brand area
    brandIconText: string; // Text color for the module icon in the sidebar brand area
  };
}

const MODULE_THEME_CONFIG: Record<ModuleType, ModuleThemeConfig> = {
  admin: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'text-blue-600 bg-blue-50',
    sidebar: { activeAccent: 'text-blue-500 border-blue-500', activeBgSubtle: 'bg-blue-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-blue-600', brandIconText: 'text-white' },
  },
  'master-data': {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'text-emerald-600 bg-emerald-50',
    sidebar: { activeAccent: 'text-emerald-500 border-emerald-500', activeBgSubtle: 'bg-emerald-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-emerald-600', brandIconText: 'text-white' },
  },
  transport: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'text-orange-600 bg-orange-50',
    sidebar: { activeAccent: 'text-orange-500 border-orange-500', activeBgSubtle: 'bg-orange-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-orange-600', brandIconText: 'text-white' },
  },
  finance: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'text-violet-600 bg-violet-50',
    sidebar: { activeAccent: 'text-violet-500 border-violet-500', activeBgSubtle: 'bg-violet-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-violet-600', brandIconText: 'text-white' },
  },
  magasin: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'text-red-600 bg-red-50',
    sidebar: { activeAccent: 'text-red-500 border-red-500', activeBgSubtle: 'bg-red-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-red-600', brandIconText: 'text-white' },
  },
  parc: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'text-cyan-600 bg-cyan-50',
    sidebar: { activeAccent: 'text-cyan-500 border-cyan-500', activeBgSubtle: 'bg-cyan-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-cyan-600', brandIconText: 'text-white' },
  },
  audit: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'text-teal-600 bg-teal-50',
    sidebar: { activeAccent: 'text-teal-500 border-teal-500', activeBgSubtle: 'bg-teal-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-teal-600', brandIconText: 'text-white' },
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
    theme: MODULE_THEME_CONFIG[currentModule] || MODULE_THEME_CONFIG.admin, // Fallback for safety
  }), [currentModule]);
}