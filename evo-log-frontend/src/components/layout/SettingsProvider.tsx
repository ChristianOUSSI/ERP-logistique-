'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

interface SettingsContextType {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemePreference>('light');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  };

  return (
    <SettingsContext.Provider value={{ theme, setTheme, toggleTheme, language, setLanguage }}>
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
