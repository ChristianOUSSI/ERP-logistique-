// src/config/moduleColors.ts - Configuration des couleurs par module
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
    primary: '#3B82F6',      // Bleu
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    secondary: '#93C5FD',
    accent: '#DBEAFE',
    background: '#EFF6FF',
    text: '#1E40AF',
  },
  tiers: {
    primary: '#10B981',      // Vert
    primaryLight: '#34D399',
    primaryDark: '#059669',
    secondary: '#6EE7B7',
    accent: '#D1FAE5',
    background: '#ECFDF5',
    text: '#065F46',
  },
  transport: {
    primary: '#F59E0B',      // Orange
    primaryLight: '#FBBF24',
    primaryDark: '#D97706',
    secondary: '#FCD34D',
    accent: '#FEF3C7',
    background: '#FFFBEB',
    text: '#92400E',
  },
  finance: {
    primary: '#8B5CF6',      // Violet
    primaryLight: '#A78BFA',
    primaryDark: '#7C3AED',
    secondary: '#C4B5FD',
    accent: '#EDE9FE',
    background: '#F5F3FF',
    text: '#5B21B6',
  },
  magasin: {
    primary: '#EF4444',      // Rouge
    primaryLight: '#F87171',
    primaryDark: '#DC2626',
    secondary: '#FCA5A5',
    accent: '#FEE2E2',
    background: '#FEF2F2',
    text: '#991B1B',
  },
  parc: {
    primary: '#06B6D4',      // Cyan
    primaryLight: '#22D3EE',
    primaryDark: '#0891B2',
    secondary: '#67E8F9',
    accent: '#CFFAFE',
    background: '#ECFEFF',
    text: '#155E75',
  },
  documents: {
    primary: '#6B7280',      // Gris
    primaryLight: '#9CA3AF',
    primaryDark: '#4B5563',
    secondary: '#D1D5DB',
    accent: '#F3F4F6',
    background: '#F9FAFB',
    text: '#374151',
  },
  alerts: {
    primary: '#F97316',      // Orange foncé
    primaryLight: '#FB923C',
    primaryDark: '#EA580C',
    secondary: '#FDBA74',
    accent: '#FFEDD5',
    background: '#FFF7ED',
    text: '#9A3412',
  },
};

export const MODULE_ICONS: Record<string, string> = {
  auth: '🔐',
  tiers: '👥',
  transport: '🚛',
  finance: '💰',
  magasin: '📦',
  parc: '🚗',
  documents: '📄',
  alerts: '🔔',
};

export const MODULE_NAMES: Record<string, string> = {
  auth: 'Authentification',
  tiers: 'Master Data',
  transport: 'K-Transport',
  finance: 'K-Finance',
  magasin: 'K-Magasin',
  parc: 'K-Parc',
  documents: 'Documents',
  alerts: 'Alertes',
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
