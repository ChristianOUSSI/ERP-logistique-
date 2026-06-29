// src/components/layout/ModuleLayout.tsx - Layout principal unifié avec thème par module
'use client';

import { ReactNode, useState, useEffect, CSSProperties } from 'react';
import { useModuleTheme } from '../../hooks/useModuleTheme';
import ModuleSidebar, { ModuleType } from './ModuleSidebar';
import { ModuleHeader } from './ModuleHeader'; // Assuming ModuleHeader is in the same directory
import { SettingsProvider, ThemePreference, useSettings } from './SettingsProvider';
import { useAuth } from './AuthProvider';
import { Toaster } from 'sonner';

interface ModuleLayoutProps {
  children: ReactNode;
  module?: ModuleType;
}

export function ModuleLayout({ children, module = 'admin' }: ModuleLayoutProps) {
  return (
    <SettingsProvider>
      <ModuleLayoutContent module={module}>{children}</ModuleLayoutContent>
    </SettingsProvider>
  );
}

function ModuleLayoutContent({ children, module = 'admin' }: ModuleLayoutProps) {
  const { theme, currentModule } = useModuleTheme(module);
  const { theme: uiTheme } = useSettings();
  const { loading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse

  // Auto-collapse based on screen size (Standard Tablet/Mobile breakpoint)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        // Only expand if it was collapsed by screen size, not user action
        // For now, we'll just set to false, a more advanced solution would track user intent
        setIsCollapsed(false); 
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Maintainable sidebar width variables
  const sidebarWidth = isCollapsed ? '80px' : '260px';
  const iconSize = isCollapsed ? '24px' : '22px';

  const containerStyle = {
    '--sidebar-width': sidebarWidth,
    '--sidebar-icon-size': iconSize,
  } as CSSProperties;

  // Dark mode logic
  useEffect(() => {
    const htmlElement = document.documentElement;
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (currentTheme: ThemePreference) => {
      htmlElement.classList.remove('light', 'dark'); // Remove existing theme classes
      if (currentTheme === 'system') {
        if (isSystemDark.matches) {
          htmlElement.classList.add('dark');
        } else {
          htmlElement.classList.add('light'); // Explicitly add light if system is light
        }
      } else {
        htmlElement.classList.add(currentTheme);
      }
    };

    applyTheme(uiTheme); // Apply theme on initial render and theme change

    const mediaQueryListener = (e: MediaQueryListEvent) => {
      if (uiTheme === 'system') applyTheme('system'); // Re-apply theme to respect system change
    };
    isSystemDark.addEventListener('change', mediaQueryListener);
    return () => isSystemDark.removeEventListener('change', mediaQueryListener);
  }, [uiTheme]); // Re-run effect when uiTheme changes

  return (
    <div style={containerStyle} className="min-h-screen bg-surface-container-low">
      <Toaster position="top-right" richColors theme={uiTheme === 'system' ? 'system' : uiTheme} />

        {/* Header global */}
        <ModuleHeader currentModule={currentModule} />
        
        <div className="flex">
          {/* Sidebar responsive */}
          <ModuleSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
          {/* Contenu principal */}
          <main 
            className={`flex-1 p-6 transition-all duration-300 ${theme.mainBackground}`}
          >
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
}
