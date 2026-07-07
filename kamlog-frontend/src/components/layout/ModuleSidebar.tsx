'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModuleTheme } from '../../hooks/useModuleTheme';
import { useSettings } from './SettingsProvider';

export type ModuleType = 'admin' | 'master-data' | 'transport' | 'finance' | 'magasin' | 'parc' | 'audit' | 'dashboard';

interface NavItem {
  labelKey: string;
  href: string;
  icon: string;
  badge?: string;
}

interface ModuleSidebarProps {
  isCollapsed?: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

const SIDEBAR_I18N: Record<string, Record<string, string>> = {
  fr: {
    global_overview: 'Vue d\'Ensemble',
    transport_module: 'K-Transport',
    finance_module: 'K-Finance',
    magasin_module: 'K-Magasin',
    parc_module: 'K-Parc',
    audit_module: 'K-Audit',
    master_data: 'Master Data',
    admin_module: 'Administration',
    users: 'Utilisateurs',
    roles: 'Rôles & Permissions',
    health: 'Santé Système',
    audit: 'Traces d\'Audit',
    security: 'Configuration MFA',
    tiers: 'Tiers (Général)',
    suppliers: 'Fournisseurs',
    purchases: 'Fiches de Besoin',
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
    fleet_management: 'Gestion Flotte',
    gate_in: 'Gate In',
    gate_out: 'Gate Out',
    settings: 'Paramètres',
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
    audit_settings: 'Paramètres Audit',
    maintenance: 'Maintenance',
  },
  en: {
    global_overview: 'System Overview',
    transport_module: 'K-Transport',
    finance_module: 'K-Finance',
    magasin_module: 'K-Magasin',
    parc_module: 'K-Parc',
    audit_module: 'K-Audit',
    master_data: 'Master Data',
    admin_module: 'Administration',
    users: 'User Management',
    roles: 'Roles & Permissions',
    health: 'System Health',
    audit: 'Audit Trails',
    security: 'MFA Configuration',
    tiers: 'Partners (General)',
    clients: 'Customers',
    suppliers: 'Suppliers',
    purchases: 'Purchase Requisitions',
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
    fleet_management: 'Fleet Management',
    gate_in: 'Gate In',
    gate_out: 'Gate Out',
    settings: 'Settings',
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
    audit_settings: 'Audit Settings',
    maintenance: 'Maintenance',
  }
};

const NAVIGATION_CONFIG: Record<ModuleType, NavItem[]> = {
  dashboard: [
    { labelKey: 'global_overview', href: '/dashboard/global', icon: 'dashboard' },
    { labelKey: 'transport_module', href: '/transport/control', icon: 'local_shipping' },
    { labelKey: 'finance_module', href: '/finance/overview', icon: 'account_balance' },
    { labelKey: 'magasin_module', href: '/magasin/dashboard', icon: 'warehouse' },
    { labelKey: 'parc_module', href: '/parc/zones', icon: 'directions_car' },
    { labelKey: 'audit_module', href: '/admin/audit/system-health', icon: 'shield' },
    { labelKey: 'master_data', href: '/master-data/tiers', icon: 'category' },
    { labelKey: 'admin_module', href: '/admin/user-management/listing', icon: 'manage_accounts' },
  ],
  admin: [
    { labelKey: 'users', href: '/admin/user-management/listing', icon: 'group' },
    { labelKey: 'roles', href: '/admin/configuration-des-roles-rbac', icon: 'verified_user' },
    { labelKey: 'health', href: '/admin/audit/system-health', icon: 'monitoring' },
    { labelKey: 'audit', href: '/admin/audit/operation-trace', icon: 'history' },
    { labelKey: 'security', href: '/admin/security/mfa', icon: 'enhanced_encryption' },
  ],
  'master-data': [
    { labelKey: 'tiers', href: '/master-data/tiers', icon: 'hub' },
    { labelKey: 'suppliers', href: '/master-data/tiers?type=supplier', icon: 'handshake' },
    { labelKey: 'articles', href: '/master-data/articles', icon: 'inventory_2' },
  ],
  transport: [
    { labelKey: 'fleet', href: '/transport/control', icon: 'local_shipping' },
    { labelKey: 'dispatch', href: '/transport/dispatch', icon: 'route' },
    { labelKey: 'goods', href: '/transport/goods-declaration', icon: 'description' },
    { labelKey: 'drivers', href: '/transport/drivers', icon: 'badge' },
    { labelKey: 'maintenance', href: '/transport/maintenance', icon: 'build_circle' },
    { labelKey: 'fuel', href: '/transport/fuel/ticket', icon: 'gas_meter' },
    { labelKey: 'map', href: '/transport/map', icon: 'map' },
  ],
  finance: [
    { labelKey: 'overview', href: '/finance/overview', icon: 'query_stats' },
    // { labelKey: 'analytics', href: '/finance/analytics', icon: 'analytics' }, // Disabled until created
    { labelKey: 'billing', href: '/finance/factures', icon: 'receipt_long' },
    { labelKey: 'purchases', href: '/finance/requisitions', icon: 'shopping_bag' },
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
    { labelKey: 'reception', href: '/magasin/reception-mag3', icon: 'download_done', badge: 'Mag3' },
    { labelKey: 'removal', href: '/magasin/removal-slip', icon: 'assignment_return', badge: 'Mag3' },
    { labelKey: 'stock', href: '/magasin/stocks', icon: 'inventory' },
    { labelKey: 'mag_stocks_search', href: '/magasin/stocks/search', icon: 'search' },
    { labelKey: 'inventory', href: '/magasin/inventory/physical', icon: 'checklist' },
    { labelKey: 'manual', href: '/magasin/mouvement-de-stock-manuel', icon: 'sync_alt' },
    { labelKey: 'mag_capacity', href: '/magasin/capacity', icon: 'warehouse' },
    { labelKey: 'mag_history', href: '/magasin/history', icon: 'history' },
    { labelKey: 'mag_transactions', href: '/magasin/transactions', icon: 'receipt_long' },
    { labelKey: 'analytics', href: '/magasin/analytics', icon: 'analytics' },
  ],
  parc: [
    { labelKey: 'overview', href: '/parc/zones', icon: 'dashboard' },
    { labelKey: 'gate_in', href: '/parc/gate', icon: 'login' },
    { labelKey: 'fleet_management', href: '/parc/gestion-de-la-flotte', icon: 'local_shipping' },
    { labelKey: 'workshop', href: '/parc/workshop', icon: 'build' },
    { labelKey: 'orders', href: '/parc/work-orders/create', icon: 'handyman' },
  ],
  audit: [
    { labelKey: 'audit_health', href: '/audit/dashboard/health', icon: 'monitoring' },
    { labelKey: 'audit_trace', href: '/admin/audit/operation-trace', icon: 'history' },
    { labelKey: 'audit_alerts', href: '/security/alert-monitoring', icon: 'security' },
    { labelKey: 'audit_notifications', href: '/security/notifications', icon: 'notifications' },
    { labelKey: 'audit_reports', href: '/security/reports', icon: 'assessment' },
    { labelKey: 'audit_settings', href: '/settings/system/audit-health', icon: 'settings' },
  ],
};

/** Module icon per module key */
const MODULE_ICONS: Record<ModuleType, string> = {
  magasin: 'warehouse',
  transport: 'conversion_path',
  audit: 'shield',
  finance: 'account_balance',
  parc: 'directions_car',
  admin: 'admin_panel_settings',
  'master-data': 'hub',
  dashboard: 'dashboard',
};

export default function ModuleSidebar({
  isCollapsed = false,
  isMobile = false,
  isOpen = false,
  onClose,
  onToggle,
}: ModuleSidebarProps) {
  const pathname = usePathname();
  const baseModule = pathname.split('/')[1] as ModuleType;

  const items = NAVIGATION_CONFIG[baseModule] || [];
  const validModule = NAVIGATION_CONFIG[baseModule] ? baseModule : 'magasin';
  const { theme } = useModuleTheme(validModule);
  const { language } = useSettings();

  const t = (key: string) => SIDEBAR_I18N[language]?.[key] || key;

  if (!items.length) return null;

  const moduleIcon = MODULE_ICONS[baseModule] || 'rocket_launch';
  const moduleName = baseModule?.replace('-', ' ') || '';

  /* ─────────────────────────────────────────────────────────
   * On mobile  : fixed overlay drawer (z-[60])
   * On desktop : shrinks/expands in the CSS-grid column (z-20)
   * ───────────────────────────────────────────────────────── */
  const mobileClasses = `
    fixed inset-y-0 left-0 z-[60] h-full w-[280px] max-w-[85vw]
    shadow-2xl transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  const desktopClasses = `
    relative z-20 h-full
    sidebar-smooth
    ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}
  `;

  return (
    <aside
      className={`
        flex flex-col bg-slate-950 text-slate-100 border-r border-slate-800/90
        ${isMobile ? mobileClasses : desktopClasses}
      `}
    >
      {/* ── Brand / Module header ── */}
      <div className="h-16 flex items-center px-3 border-b border-slate-800 justify-between shrink-0 gap-2">
        <div className="flex items-center gap-3 overflow-hidden min-w-0">
          {/* Module icon badge */}
          <div
            className={`
              flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
              ${theme.sidebar.brandIconBg} ${theme.sidebar.brandIconText}
              transition-transform duration-200 hover:scale-110
            `}
          >
            <span
              className="material-symbols-outlined text-white"
              style={{ fontSize: '18px' }}
            >
              {moduleIcon}
            </span>
          </div>

          {/* Module name — fades out when collapsed */}
          <div
            className={`
              overflow-hidden transition-all duration-280
              ${isCollapsed && !isMobile ? 'w-0 opacity-0' : 'w-full opacity-100'}
            `}
          >
            <span className="block font-bold text-white tracking-tight uppercase text-sm whitespace-nowrap">
              {moduleName}
            </span>
            <span className="block text-[10px] text-slate-400 whitespace-nowrap">KAMLOG ERP</span>
          </div>
        </div>

        {/* Toggle / Close button */}
        <button
          onClick={isMobile ? onClose : onToggle}
          className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label={
            isMobile ? 'Fermer le menu' : isCollapsed ? 'Déplier le menu' : 'Réduire le menu'
          }
        >
          <span className="material-symbols-outlined text-[20px]">
            {isMobile ? 'close' : isCollapsed ? 'menu' : 'menu_open'}
          </span>
        </button>
      </div>

      {/* ── Navigation items ── */}
      <nav
        className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto scrollbar-sidebar"
        aria-label="Navigation principale"
      >
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const label = t(item.labelKey);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => { if (isMobile) onClose?.(); }}
              title={isCollapsed && !isMobile ? label : undefined}
              className={`
                group relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl
                transition-all duration-150 min-w-0 overflow-hidden
                ${isActive
                  ? `${theme.sidebar.activeAccent} ${theme.sidebar.activeBgSubtle} font-semibold`
                  : `text-slate-400 border-transparent hover:text-slate-100 ${theme.sidebar.hoverBg} hover:bg-slate-800/80`
                }
              `}
            >
              {/* Active left border indicator */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-current"
                  aria-hidden="true"
                />
              )}

              {/* Icon */}
              <span
                className="material-symbols-outlined flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
                style={{ fontSize: '20px', fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>

              {/* Label — hidden when collapsed on desktop */}
              {(!isCollapsed || isMobile) && (
                <span className="truncate text-[13px] leading-tight flex-1">
                  {label}
                </span>
              )}

              {/* Badge (e.g. Mag3) */}
              {(!isCollapsed || isMobile) && item.badge && (
                <span
                  className={`
                    flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide
                    ${isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-700/70 text-slate-400'
                    }
                  `}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip on collapsed desktop */}
              {isCollapsed && !isMobile && (
                <div
                  className="
                    pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2
                    z-[70] px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap
                    bg-slate-800 text-slate-100 border border-slate-700 shadow-xl
                    opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                    transition-all duration-150 origin-left
                  "
                  role="tooltip"
                >
                  {label}
                  {item.badge && (
                    <span className="ml-1.5 text-[9px] px-1 py-0.5 rounded bg-slate-700 text-slate-300 uppercase">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom: Settings & Logout ── */}
      <div className="shrink-0 p-2 border-t border-slate-800 space-y-0.5">
        <Link
          href="/settings"
          onClick={() => { if (isMobile) onClose?.(); }}
          title={isCollapsed && !isMobile ? t('settings') : undefined}
          className="group relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span
            className="material-symbols-outlined flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
            style={{ fontSize: '20px' }}
          >
            settings
          </span>
          {(!isCollapsed || isMobile) && (
            <span className="text-xs truncate">{t('settings')}</span>
          )}
          {isCollapsed && !isMobile && (
            <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[70] px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap bg-slate-800 text-slate-100 border border-slate-700 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-left">
              {t('settings')}
            </div>
          )}
        </Link>

        <Link
          href="/logout"
          onClick={() => { if (isMobile) onClose?.(); }}
          title={isCollapsed && !isMobile ? t('logout') : undefined}
          className="group relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span
            className="material-symbols-outlined flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
            style={{ fontSize: '20px' }}
          >
            logout
          </span>
          {(!isCollapsed || isMobile) && (
            <span className="text-xs truncate">{t('logout')}</span>
          )}
          {isCollapsed && !isMobile && (
            <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[70] px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap bg-slate-800 text-slate-100 border border-slate-700 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-left">
              {t('logout')}
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
