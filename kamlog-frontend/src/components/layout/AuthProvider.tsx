'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { UserRole } from '@/utils/tcodeLookup';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  agencyId: number; // Added for multi-tenancy
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  sessionExpiresAt: Date | null;
  renewSession: () => void;
  sessionExpired: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<Date | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Mode Bypass Démo pour déploiement autonome sur Vercel sans backend actif
      if (process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') {
        setUser({
          id: 'dev-demo-id',
          email: 'admin@kamlog.cm',
          role: 'admin',
          fullName: 'Super Administrateur (Démo Vercel)',
          agencyId: 1
        });
        setSessionExpiresAt(new Date(Date.now() + 24 * 3600 * 1000)); // Session 24h
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('kamlog_token')}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          // Calcul de l'expiration réelle depuis le JWT (à extraire du payload)
          const expiry = new Date(Date.now() + 3600 * 1000); // Fallback 1h
          setSessionExpiresAt(expiry);
        } else {
           setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSessionExpiresAt(null);
    setSessionExpired(false); // Reset on logout
    // In a real app, this would clear tokens and redirect to login
    window.location.href = '/login';
  }, []);

  const renewSession = useCallback(() => {
    if (user) {
      const newExpiry = new Date();
      newExpiry.setMinutes(newExpiry.getMinutes() + 30); // Extend by 30 minutes
      setSessionExpiresAt(newExpiry);
      setSessionExpired(false); // Reset expired state
      console.log('Session renewed until:', newExpiry.toLocaleTimeString());
      // In a real app, this would make an API call to refresh the token
    }
  }, [user]);

  // Monitor session expiration
  useEffect(() => {
    if (!sessionExpiresAt || sessionExpired) return;

    const timer = setInterval(() => {
      if (Date.now() >= sessionExpiresAt.getTime()) {
        setSessionExpired(true);
        clearInterval(timer);
      }
    }, 1000); // Check every second
    return () => clearInterval(timer);
  }, [sessionExpiresAt, sessionExpired, logout]);

  return (
    <AuthContext.Provider value={{ user, loading, logout, sessionExpiresAt, renewSession, sessionExpired }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};