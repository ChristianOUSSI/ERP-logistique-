'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { ModuleType } from '@/components/layout/ModuleSidebar';

// Validating list of modules for type guarding
const VALID_MODULES: ModuleType[] = [
  'admin',
  'master-data',
  'transport',
  'finance',
  'magasin',
  'parc',
  'audit',
  'dashboard',
  'rh',
  'acconage',
  'qhse',
  'transit',
  'maintenance',
  'client-portal',
  'cotations',
  'tracking',
  'fuel-guard',
  'procurement',
  'compliance',
  'bi',
];

interface ModuleThemeConfig {
  mainBackground: string;
  headerClasses: string;
  sidebar: {
    activeAccent: string;
    activeBgSubtle: string;
    hoverBg: string;
    brandIconBg: string;
    brandIconText: string;
  };
}

const DEFAULT_THEME: ModuleThemeConfig = {
  mainBackground: 'bg-surface-container-low',
  headerClasses: 'module-badge-admin',
  sidebar: {
    activeAccent: 'text-blue-400 border-blue-400',
    activeBgSubtle: 'bg-blue-500/10',
    hoverBg: 'hover:bg-slate-800',
    brandIconBg: 'bg-blue-600',
    brandIconText: 'text-white',
  },
};

const MODULE_THEME_CONFIG: Record<string, ModuleThemeConfig> = {
  admin: DEFAULT_THEME,
  'master-data': {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-master-data',
    sidebar: { activeAccent: 'text-emerald-400 border-emerald-400', activeBgSubtle: 'bg-emerald-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-emerald-600', brandIconText: 'text-white' },
  },
  transport: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-transport',
    sidebar: { activeAccent: 'text-orange-400 border-orange-400', activeBgSubtle: 'bg-orange-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-orange-600', brandIconText: 'text-white' },
  },
  finance: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-finance',
    sidebar: { activeAccent: 'text-violet-400 border-violet-400', activeBgSubtle: 'bg-violet-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-violet-600', brandIconText: 'text-white' },
  },
  magasin: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-magasin',
    sidebar: { activeAccent: 'text-red-400 border-red-400', activeBgSubtle: 'bg-red-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-red-600', brandIconText: 'text-white' },
  },
  parc: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-parc',
    sidebar: { activeAccent: 'text-cyan-400 border-cyan-400', activeBgSubtle: 'bg-cyan-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-cyan-600', brandIconText: 'text-white' },
  },
  audit: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-audit',
    sidebar: { activeAccent: 'text-teal-400 border-teal-400', activeBgSubtle: 'bg-teal-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-teal-600', brandIconText: 'text-white' },
  },
  dashboard: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-dashboard',
    sidebar: { activeAccent: 'text-blue-400 border-blue-400', activeBgSubtle: 'bg-blue-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-blue-600', brandIconText: 'text-white' },
  },
  rh: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-rh',
    sidebar: { activeAccent: 'text-pink-400 border-pink-400', activeBgSubtle: 'bg-pink-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-pink-600', brandIconText: 'text-white' },
  },
  acconage: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-acconage',
    sidebar: { activeAccent: 'text-cyan-400 border-cyan-400', activeBgSubtle: 'bg-cyan-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-cyan-600', brandIconText: 'text-white' },
  },
  qhse: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-qhse',
    sidebar: { activeAccent: 'text-rose-400 border-rose-400', activeBgSubtle: 'bg-rose-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-rose-600', brandIconText: 'text-white' },
  },
  transit: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-transit',
    sidebar: { activeAccent: 'text-blue-400 border-blue-400', activeBgSubtle: 'bg-blue-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-blue-600', brandIconText: 'text-white' },
  },
  maintenance: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-maintenance',
    sidebar: { activeAccent: 'text-amber-400 border-amber-400', activeBgSubtle: 'bg-amber-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-amber-600', brandIconText: 'text-white' },
  },
  'client-portal': {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-client-portal',
    sidebar: { activeAccent: 'text-indigo-400 border-indigo-400', activeBgSubtle: 'bg-indigo-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-indigo-600', brandIconText: 'text-white' },
  },
  cotations: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-cotations',
    sidebar: { activeAccent: 'text-emerald-400 border-emerald-400', activeBgSubtle: 'bg-emerald-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-emerald-600', brandIconText: 'text-white' },
  },
  tracking: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-tracking',
    sidebar: { activeAccent: 'text-sky-400 border-sky-400', activeBgSubtle: 'bg-sky-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-sky-600', brandIconText: 'text-white' },
  },
  'fuel-guard': {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-fuel-guard',
    sidebar: { activeAccent: 'text-orange-400 border-orange-400', activeBgSubtle: 'bg-orange-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-orange-600', brandIconText: 'text-white' },
  },
  procurement: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-procurement',
    sidebar: { activeAccent: 'text-violet-400 border-violet-400', activeBgSubtle: 'bg-violet-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-violet-600', brandIconText: 'text-white' },
  },
  compliance: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-compliance',
    sidebar: { activeAccent: 'text-teal-400 border-teal-400', activeBgSubtle: 'bg-teal-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-teal-600', brandIconText: 'text-white' },
  },
  bi: {
    mainBackground: 'bg-surface-container-low',
    headerClasses: 'module-badge-bi',
    sidebar: { activeAccent: 'text-fuchsia-400 border-fuchsia-400', activeBgSubtle: 'bg-fuchsia-500/10', hoverBg: 'hover:bg-slate-800', brandIconBg: 'bg-fuchsia-600', brandIconText: 'text-white' },
  },
};

export function useModuleTheme(moduleProp?: ModuleType) {
  const pathname = usePathname();

  const currentModule = useMemo((): ModuleType => {
    if (moduleProp && VALID_MODULES.includes(moduleProp)) return moduleProp;
    const firstSegment = pathname.split('/')[1] as ModuleType;
    if (VALID_MODULES.includes(firstSegment)) return firstSegment;
    return 'admin';
  }, [pathname, moduleProp]);

  const themeConfig = MODULE_THEME_CONFIG[currentModule] || DEFAULT_THEME;

  return useMemo(() => ({
    currentModule,
    theme: themeConfig,
  }), [currentModule, themeConfig]);
}