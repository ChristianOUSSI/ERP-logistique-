// src/components/layout/ModuleLayout.tsx - Layout principal unifié avec thème par module
'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useModuleTheme } from '@/hooks/useModuleTheme';
import { ModuleSidebar } from './ModuleSidebar';
import { ModuleHeader } from './ModuleHeader';

interface ModuleLayoutProps {
  children: ReactNode;
  module: string;
}

export function ModuleLayout({ children, module }: ModuleLayoutProps) {
  const { theme, currentModule } = useModuleTheme(module);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header global */}
      <ModuleHeader currentModule={currentModule} />
      
      <div className="flex">
        {/* Sidebar colorée par module */}
        <ModuleSidebar currentModule={currentModule} />
        
        {/* Contenu principal */}
        <main 
          className="flex-1 p-6 transition-all duration-300"
          style={{
            backgroundColor: theme.background,
          }}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
