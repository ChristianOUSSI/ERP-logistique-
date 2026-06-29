'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModuleTheme } from '../../hooks/useModuleTheme';
import { useSettings } from './SettingsProvider';

export type ModuleType = 'admin' | 'master-data' | 'transport' | 'finance' | 'magasin' | 'parc' | 'audit';

interface NavItem {
  labelKey: string;
  href: string;
  icon: string;
  badge?: string;
}

interface ModuleSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const SIDEBAR_I18N: Record<string, Record<string, string>> = {
  fr: {
    users: 'Utilisateurs',
    roles: 'Rôles & Permissions',
    health: 'Santé Système',
    audit: 'Traces d\'Audit',
    security: 'Configuration MFA',
    tiers: 'Tiers (Général)',
    clients: 'Clients',
    suppliers: 'Fournisseurs',
    articles: 'Articles',
    incoterms: 'Incoterms',
    units: 'Unités de Mesure',
    fleet: 'Contrôle Flotte',
    dispatch: 'Planification',
    goods: 'Décl. Marchandises',
    drivers: 'Nouveau Chauffeur',
    fuel: 'Gestion Carburant',
    map: 'Cartographie',
    overview: 'Tableau de Bord',
    analytics: 'Analytique & Cashflow',
    billing: 'Facturation Client',
    reconciliation: 'Rapprochement Bancaire',
    gateway: 'Passerelle Monitor',
    transactions: 'Saisie Transaction',
    stock: 'Gestion des Stocks',
    removal: 'Bons d\'Enlèvement',
    reception: 'Réceptions Mag3',
    receptions_list: 'Réceptions',
    inventory: 'Inventaire Physique',
    manual: 'Mouvement Manuel',
    workshop: 'Atelier (Workshop)',
    orders: 'Ordres de Travail',
    gate_in: 'Gate In',
    gate_out: 'Gate Out',
    settings: 'Paramètres Module',
    logout: 'Déconnexion',
    mag_articles: 'Articles',
    mag_clients: 'Clients Magasin',
    mag_commandes: 'Commandes',
    mag_declarations: 'Déclarations (BL)',
    mag_stocks_search: 'Recherche Stock',
    mag_capacity: 'Capacité Magasin',
    mag_history: 'Historique',
    mag_transactions: 'Transactions',
    audit_health: 'Santé Système',
    audit_trace: 'Traces d\'Opérations',
    audit_alerts: 'Alertes Sécurité',
    audit_reports: 'Rapports',
    audit_notifications: 'Notifications',
    audit_settings: 'Paramètres Audit'
  },
  en: {
    users: 'User Management',
    roles: 'Roles & Permissions',
    health: 'System Health',
    audit: 'Audit Trails',
    security: 'MFA Configuration',
    tiers: 'Partners (General)',
    clients: 'Customers',
    suppliers: 'Suppliers',
    articles: 'Materials/Items',
    incoterms: 'Incoterms',
    units: 'Units of Measure',
    fleet: 'Fleet Control',
    dispatch: 'Dispatching',
    goods: 'Goods Declaration',
    drivers: 'New Driver',
    fuel: 'Fuel Management',
    map: 'Mapping/GIS',
    overview: 'Executive Overview',
    analytics: 'Analytics & Cashflow',
    billing: 'Customer Billing',
    reconciliation: 'Bank Reconciliation',
    gateway: 'Gateway Monitor',
    transactions: 'Transaction Entry',
    stock: 'Stock Management',
    removal: 'Removal Slips',
    reception: 'Mag3 Receptions',
    receptions_list: 'Receptions',
    inventory: 'Physical Inventory',
    manual: 'Manual Movement',
    workshop: 'Maintenance Shop',
    orders: 'Work Orders',
    gate_in: 'Gate In',
    gate_out: 'Gate Out',
    settings: 'Module Settings',
    logout: 'Sign Out',
    mag_articles: 'Articles',
    mag_clients: 'Warehouse Clients',
    mag_commandes: 'Orders',
    mag_declarations: 'Declarations (BL)',
    mag_stocks_search: 'Stock Search',
    mag_capacity: 'Warehouse Capacity',
    mag_history: 'History',
    mag_transactions: 'Transactions',
    audit_health: 'System Health',
    audit_trace: 'Operation Traces',
    audit_alerts: 'Security Alerts',
    audit_reports: 'Reports',
    audit_notifications: 'Notifications',
    audit_settings: 'Audit Settings'
  }
};

const NAVIGATION_CONFIG: Record<ModuleType, NavItem[]> = {
  admin: [
    { labelKey: 'users', href: '/admin/user-management/listing', icon: 'group' },
    { labelKey: 'roles', href: '/admin/configuration-des-roles-rbac', icon: 'verified_user' },
    { labelKey: 'health', href: '/admin/audit/system-health', icon: 'monitoring' },
    { labelKey: 'audit', href: '/admin/audit/operation-trace', icon: 'history' },
    { labelKey: 'security', href: '/admin/security/mfa', icon: 'enhanced_encryption' },
  ],
  'master-data': [
    { labelKey: 'tiers', href: '/master-data/tiers', icon: 'hub' },
    { labelKey: 'clients', href: '/master-data/clients/create', icon: 'person_add' },
    { labelKey: 'suppliers', href: '/master-data/suppliers/create', icon: 'conveyor_belt' },
    { labelKey: 'articles', href: '/master-data/article-creation', icon: 'inventory_2' },
    { labelKey: 'incoterms', href: '/master-data/incoterms', icon: 'gavel' },
    { labelKey: 'units', href: '/master-data/units', icon: 'straighten' },
  ],
  transport: [
    { labelKey: 'fleet', href: '/transport/control', icon: 'local_shipping' },
    { labelKey: 'dispatch', href: '/transport/dispatch', icon: 'route' },
    { labelKey: 'goods', href: '/transport/goods-declaration', icon: 'description' },
    { labelKey: 'drivers', href: '/transport/drivers/new', icon: 'person_add' },
    { labelKey: 'fuel', href: '/transport/fuel/ticket', icon: 'gas_meter' },
    { labelKey: 'map', href: '/transport/map', icon: 'map' },
  ],
  finance: [
    { labelKey: 'overview', href: '/finance/overview', icon: 'query_stats' },
    { labelKey: 'analytics', href: '/finance/analytics', icon: 'analytics' },
    { labelKey: 'billing', href: '/finance/billing', icon: 'receipt_long' },
    { labelKey: 'reconciliation', href: '/finance/banking/reconciliation', icon: 'account_balance' },
    { labelKey: 'gateway', href: '/finance/gateway', icon: 'settings_input_component' },
    { labelKey: 'transactions', href: '/finance/saisie-transaction-bancaire', icon: 'add_card' },
  ],
  magasin: [
    { labelKey: 'overview', href: '/magasin/dashboard', icon: 'dashboard' },
    { labelKey: 'mag_articles', href: '/magasin/articles', icon: 'category' },
    { labelKey: 'mag_clients', href: '/magasin/clients', icon: 'people' },
    { labelKey: 'mag_commandes', href: '/magasin/commandes', icon: 'shopping_cart' },
    { labelKey: 'mag_declarations', href: '/magasin/declarations', icon: 'description' },
    { labelKey: 'receptions_list', href: '/magasin/receptions', icon: 'move_to_inbox' },
    { labelKey: 'stock', href: '/magasin/stocks', icon: 'inventory' },
    { labelKey: 'mag_stocks_search', href: '/magasin/search', icon: 'search' },
    { labelKey: 'reception', href: '/magasin/reception-mag3', icon: 'download_done', badge: 'Mag3' },
    { labelKey: 'removal', href: '/magasin/removal-slip', icon: 'assignment_return', badge: 'Mag3' },
    { labelKey: 'inventory', href: '/magasin/inventory/physical', icon: 'checklist' },
    { labelKey: 'manual', href: '/magasin/mouvement-de-stock-manuel', icon: 'sync_alt' },
    { labelKey: 'mag_capacity', href: '/magasin/capacity', icon: 'warehouse' },
    { labelKey: 'mag_history', href: '/magasin/history', icon: 'history' },
    { labelKey: 'mag_transactions', href: '/magasin/transactions', icon: 'receipt_long' },
    { labelKey: 'analytics', href: '/magasin/analytics', icon: 'analytics' },
  ],
  parc: [
    { labelKey: 'overview', href: '/parc/overview', icon: 'directions_car' },
    { labelKey: 'gate_in', href: '/parc/gate-in', icon: 'login' },
    { labelKey: 'gate_out', href: '/parc/gate-out', icon: 'logout' },
    { labelKey: 'workshop', href: '/parc/workshop', icon: 'build' },
    { labelKey: 'orders', href: '/parc/creation-ordre-de-travail', icon: 'handyman' },
  ],
  audit: [
    { labelKey: 'audit_health', href: '/audit/dashboard/health', icon: 'monitoring' },
    { labelKey: 'audit_trace', href: '/admin/audit/operation-trace', icon: 'history' },
    { labelKey: 'audit_alerts', href: '/security/alert-monitoring', icon: 'security' },
    { labelKey: 'audit_notifications', href: '/security/notifications', icon: 'notifications' },
    { labelKey: 'audit_reports', href: '/reports/custom', icon: 'assessment' },
    { labelKey: 'audit_settings', href: '/settings/system/audit-health', icon: 'settings' },
  ],
};

export default function ModuleSidebar({ isCollapsed = false, onToggle }: ModuleSidebarProps) {
  const pathname = usePathname();
  const baseModule = pathname.split('/')[1] as ModuleType;
  
  // Si le module n'est pas dans NAVIGATION_CONFIG, on ne rend pas la sidebar (ou on affiche un fallback)
  const items = NAVIGATION_CONFIG[baseModule] || [];
  const validModule = NAVIGATION_CONFIG[baseModule] ? baseModule : 'magasin'; // fallback theme
  const { theme } = useModuleTheme(validModule);
  const { language } = useSettings();

  const t = (key: string) => SIDEBAR_I18N[language][key] || key;
  
  if (!items.length) return null; // Ne pas afficher de sidebar sur les pages sans module (ex: dashboard)

  return (
    <aside
      className="layout-sidebar flex flex-col transition-all duration-300 overflow-hidden"
      style={{ width: 'var(--sidebar-width)' } as React.CSSProperties}
    >
      {/* Brand Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800 justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`w-8 h-8 rounded-lg ${theme.sidebar.brandIconBg} ${theme.sidebar.brandIconText} flex items-center justify-center`}>
            <span 
              className="material-symbols-outlined text-white transition-all duration-300"
              style={{ fontSize: 'var(--sidebar-icon-size)' } as React.CSSProperties}
            >
              {baseModule === 'magasin' ? 'warehouse' : baseModule === 'transport' ? 'conversion_path' : baseModule === 'audit' ? 'shield' : 'rocket_launch'}
            </span>
          </div>
          {!isCollapsed && (
            <span className="font-bold text-white tracking-tight uppercase text-sm truncate">
              {baseModule}
            </span>
          )}
        </div>
        
        <button 
          onClick={onToggle}
          className="p-1 hover:bg-slate-800 rounded-md text-slate-400 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isCollapsed ? 'menu' : 'menu_open'}
          </span>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center justify-between px-3 py-2.5 rounded-r-lg transition-all duration-200 border-l-4
                ${isActive 
                  ? `${theme.sidebar.activeAccent} ${theme.sidebar.activeBgSubtle}` 
                  : `text-slate-400 border-transparent ${theme.sidebar.hoverBg} hover:text-slate-200`}
              `}
              title={isCollapsed ? t(item.labelKey) : ''}
            >
              <div className="flex items-center gap-3">
                <span 
                  className="material-symbols-outlined transition-all duration-300"
                  style={{ fontSize: 'var(--sidebar-icon-size)' } as React.CSSProperties}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="text-[13px] font-medium">
                    {t(item.labelKey)}
                  </span>
                )}
              </div>
              
              {!isCollapsed && item.badge && (
                <span className={`
                  text-[10px] px-1.5 py-0.5 rounded font-bold uppercase flex-shrink-0
                  ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}
                `}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile / Settings */}
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors"
        >
          <span 
            className="material-symbols-outlined flex-shrink-0 transition-all duration-300"
            style={{ fontSize: 'var(--sidebar-icon-size)' } as React.CSSProperties}
          >settings</span>
          {!isCollapsed && <span className="text-xs">{t('settings')}</span>}
        </Link>
        <Link
          href="/logout"
          className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 transition-colors"
        >
          <span 
            className="material-symbols-outlined flex-shrink-0 transition-all duration-300"
            style={{ fontSize: 'var(--sidebar-icon-size)' } as React.CSSProperties}
          >logout</span>
          {!isCollapsed && <span className="text-xs">{t('logout')}</span>}
        </Link>
      </div>
    </aside>
  );
}