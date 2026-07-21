// src/config/moduleColors.ts - Configuration des couleurs uniques par module K-
export interface ModuleColorConfig {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export const MODULE_COLORS: Record<string, ModuleColorConfig> = {
  auth: {
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    secondary: '#93C5FD',
    accent: '#DBEAFE',
    background: '#EFF6FF',
    text: '#1E40AF',
  },
  tiers: {
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryDark: '#059669',
    secondary: '#6EE7B7',
    accent: '#D1FAE5',
    background: '#ECFDF5',
    text: '#065F46',
  },
  transport: {
    primary: '#F59E0B',
    primaryLight: '#FBBF24',
    primaryDark: '#D97706',
    secondary: '#FCD34D',
    accent: '#FEF3C7',
    background: '#FFFBEB',
    text: '#92400E',
  },
  finance: {
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    primaryDark: '#7C3AED',
    secondary: '#C4B5FD',
    accent: '#EDE9FE',
    background: '#F5F3FF',
    text: '#5B21B6',
  },
  magasin: {
    primary: '#EF4444',
    primaryLight: '#F87171',
    primaryDark: '#DC2626',
    secondary: '#FCA5A5',
    accent: '#FEE2E2',
    background: '#FEF2F2',
    text: '#991B1B',
  },
  parc: {
    primary: '#06B6D4',
    primaryLight: '#22D3EE',
    primaryDark: '#0891B2',
    secondary: '#67E8F9',
    accent: '#CFFAFE',
    background: '#ECFEFF',
    text: '#155E75',
  },
  acconage: {
    primary: '#0891B2',
    primaryLight: '#06B6D4',
    primaryDark: '#0E7490',
    secondary: '#67E8F9',
    accent: '#CFFAFE',
    background: '#ECFEFF',
    text: '#155E75',
  },
  qhse: {
    primary: '#F43F5E',
    primaryLight: '#FB7185',
    primaryDark: '#E11D48',
    secondary: '#FDA4AF',
    accent: '#FFE4E6',
    background: '#FFF1F2',
    text: '#9F1239',
  },
  transit: {
    primary: '#2563EB',
    primaryLight: '#3B82F6',
    primaryDark: '#1D4ED8',
    secondary: '#93C5FD',
    accent: '#DBEAFE',
    background: '#EFF6FF',
    text: '#1E40AF',
  },
  maintenance: {
    primary: '#D97706',
    primaryLight: '#F59E0B',
    primaryDark: '#B45309',
    secondary: '#FCD34D',
    accent: '#FEF3C7',
    background: '#FFFBEB',
    text: '#78350F',
  },
  'client-portal': {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#C7D2FE',
    accent: '#E0E7FF',
    background: '#EEF2FF',
    text: '#3730A3',
  },
  rh: {
    primary: '#14B8A6',
    primaryLight: '#2DD4BF',
    primaryDark: '#0D9488',
    secondary: '#5EEAD4',
    accent: '#CCFBF1',
    background: '#F0FDFA',
    text: '#0F766E',
  },
  cotations: {
    primary: '#10B981',      // Menthe Émeraude
    primaryLight: '#34D399',
    primaryDark: '#059669',
    secondary: '#6EE7B7',
    accent: '#D1FAE5',
    background: '#ECFDF5',
    text: '#065F46',
  },
  tracking: {
    primary: '#0284C7',      // Azur Tracking
    primaryLight: '#38BDF8',
    primaryDark: '#0369A1',
    secondary: '#7DD3FC',
    accent: '#E0F2FE',
    background: '#F0F9FF',
    text: '#075985',
  },
  'fuel-guard': {
    primary: '#EA580C',      // Orange Brûlé
    primaryLight: '#F97316',
    primaryDark: '#C2410C',
    secondary: '#FDBA74',
    accent: '#FFEDD5',
    background: '#FFF7ED',
    text: '#9A3412',
  },
  procurement: {
    primary: '#7C3AED',      // Violet Achats
    primaryLight: '#8B5CF6',
    primaryDark: '#6D28D9',
    secondary: '#C4B5FD',
    accent: '#EDE9FE',
    background: '#F5F3FF',
    text: '#5B21B6',
  },
  compliance: {
    primary: '#0D9488',      // Teal Conformité
    primaryLight: '#14B8A6',
    primaryDark: '#0F766E',
    secondary: '#5EEAD4',
    accent: '#CCFBF1',
    background: '#F0FDFA',
    text: '#115E59',
  },
  bi: {
    primary: '#D946EF',      // Fuchsia Analytics
    primaryLight: '#E879F9',
    primaryDark: '#C026D3',
    secondary: '#F0ABFC',
    accent: '#FAE8FF',
    background: '#FDF4FF',
    text: '#86198F',
  },
};

export const MODULE_ICONS: Record<string, string> = {
  auth: '🔐',
  tiers: '👥',
  transport: '🚛',
  finance: '💰',
  magasin: '📦',
  parc: '🚗',
  acconage: '⚓',
  qhse: '🛡️',
  transit: '🌐',
  maintenance: '🔧',
  'client-portal': '💼',
  rh: '👥',
  cotations: '🏷️',
  tracking: '📡',
  'fuel-guard': '⛽',
  procurement: '🛒',
  compliance: '🏛️',
  bi: '📊',
};

export const MODULE_NAMES: Record<string, string> = {
  auth: 'Authentification',
  tiers: 'Master Data',
  transport: 'K-Transport',
  finance: 'K-Finance',
  magasin: 'K-Magasin',
  parc: 'K-Parc',
  acconage: 'K-Acconage',
  qhse: 'K-QHSE',
  transit: 'K-Transit',
  maintenance: 'K-Maintenance',
  'client-portal': 'Portail Client B2B',
  rh: 'Ressources Humaines',
  cotations: 'K-Cotation',
  tracking: 'K-Tracking & e-POD',
  'fuel-guard': 'K-FuelGuard',
  procurement: 'K-Procurement',
  compliance: 'K-Compliance',
  bi: 'K-Analytics BI',
};

export const getModuleColor = (module: string): ModuleColorConfig => {
  return MODULE_COLORS[module] || MODULE_COLORS.auth;
};

export const getModuleIcon = (module: string): string => {
  return MODULE_ICONS[module] || '📋';
};

export const getModuleName = (module: string): string => {
  return MODULE_NAMES[module] || 'Module';
};
