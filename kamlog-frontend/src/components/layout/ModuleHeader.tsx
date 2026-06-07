// src/components/layout/ModuleHeader.tsx - Header global avec auth unifiée
'use client';

import { User } from '@/types/auth';
import { getModuleIcon, getModuleName } from '@/config/moduleColors';

interface ModuleHeaderProps {
  currentModule: string;
}

export function ModuleHeader({ currentModule }: ModuleHeaderProps) {
  const moduleIcon = getModuleIcon(currentModule);
  const moduleName = getModuleName(currentModule);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et nom du projet */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">KAMLOG</span>
              <span className="text-sm text-gray-500">EM-ERP</span>
            </div>
            
            {/* Séparateur */}
            <div className="h-6 w-px bg-gray-300" />
            
            {/* Module actuel */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
              <span className="text-xl">{moduleIcon}</span>
              <span className="text-sm font-medium text-gray-700">{moduleName}</span>
            </div>
          </div>

          {/* Navigation utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Profil utilisateur */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@kamlog.cm</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>

            {/* Bouton déconnexion */}
            <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
