// src/hooks/useModuleTheme.ts - Hook pour gérer le thème par module
import { useState, useEffect, useCallback } from 'react';
import { getModuleColor, ModuleColorConfig } from '@/config/moduleColors';

export const useModuleTheme = (module: string) => {
  const [theme, setTheme] = useState<ModuleColorConfig>(getModuleColor(module));
  const [currentModule, setCurrentModule] = useState(module);

  useEffect(() => {
    const newTheme = getModuleColor(module);
    setTheme(newTheme);
    setCurrentModule(module);

    // Appliquer les couleurs CSS variables
    const root = document.documentElement;
    root.style.setProperty('--module-primary', newTheme.primary);
    root.style.setProperty('--module-primary-light', newTheme.primaryLight);
    root.style.setProperty('--module-primary-dark', newTheme.primaryDark);
    root.style.setProperty('--module-secondary', newTheme.secondary);
    root.style.setProperty('--module-accent', newTheme.accent);
    root.style.setProperty('--module-background', newTheme.background);
    root.style.setProperty('--module-text', newTheme.text);
  }, [module]);

  const changeModule = useCallback((newModule: string) => {
    setCurrentModule(newModule);
  }, []);

  return {
    theme,
    currentModule,
    changeModule,
  };
};
