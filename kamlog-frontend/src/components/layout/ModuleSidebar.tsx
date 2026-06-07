// src/components/layout/ModuleSidebar.tsx - Sidebar colorée par module
'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getModuleColor, getModuleIcon, getModuleName, MODULE_NAMES, MODULE_ICONS } from '@/config/moduleColors';

interface ModuleSidebarProps {
  currentModule: string;
}

interface NavItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  module: string;
}

export function ModuleSidebar({ currentModule }: ModuleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const theme = getModuleColor(currentModule);

  const navItems: NavItem[] = [
    { id: 'auth', name: MODULE_NAMES.auth, icon: MODULE_ICONS.auth, path: '/auth', module: 'auth' },
    { id: 'tiers', name: MODULE_NAMES.tiers, icon: MODULE_ICONS.tiers, path: '/tiers', module: 'tiers' },
    { id: 'transport', name: MODULE_NAMES.transport, icon: MODULE_ICONS.transport, path: '/transport', module: 'transport' },
    { id: 'finance', name: MODULE_NAMES.finance, icon: MODULE_ICONS.finance, path: '/finance', module: 'finance' },
    { id: 'magasin', name: MODULE_NAMES.magasin, icon: MODULE_ICONS.magasin, path: '/magasin', module: 'magasin' },
    { id: 'parc', name: MODULE_NAMES.parc, icon: MODULE_ICONS.parc, path: '/parc', module: 'parc' },
    { id: 'documents', name: MODULE_NAMES.documents, icon: MODULE_ICONS.documents, path: '/documents', module: 'documents' },
    { id: 'alerts', name: MODULE_NAMES.alerts, icon: MODULE_ICONS.alerts, path: '/alerts', module: 'alerts' },
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{
        backgroundColor: theme.primary,
      }}
    >
      <div className="h-full flex flex-col">
        {/* Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-4 text-white hover:bg-white/10 transition"
          style={{ color: theme.text }}
        >
          <svg
            className={`h-6 w-6 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation items */}
        <nav className="flex-1 px-2 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const itemTheme = getModuleColor(item.module);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white shadow-lg transform scale-105'
                    : 'hover:bg-white/20'
                }`}
                style={{
                  backgroundColor: isActive ? 'white' : undefined,
                  color: isActive ? itemTheme.primary : 'white',
                }}
              >
                <span className="text-2xl">{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          {!isCollapsed && (
            <p className="text-xs text-white/70 text-center">
              KAMLOG EM-ERP v1.0
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
