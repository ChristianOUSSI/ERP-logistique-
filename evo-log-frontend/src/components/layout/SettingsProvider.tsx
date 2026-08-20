'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <SettingsContext.Provider value={{ theme, toggleTheme, language, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
