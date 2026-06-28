'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { UserRole } from '@/utils/tcodeLookup';
import { useSession, signOut } from 'next-auth/react';

interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  agencyId: number;
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
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<Date | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session?.user) {
      setUser({
        id: session.user.id || '',
        email: session.user.email || '',
        role: ((session.user.role as string)?.toUpperCase() as UserRole) || UserRole.USER,
        fullName: session.user.nom || '',
        agencyId: 1, // Default fallback
      });
      // La durée de session est gérée par NextAuth (12h).
      // On met un timer local de 12h pour correspondre.
      setSessionExpiresAt(new Date(Date.now() + 12 * 3600 * 1000));
      setSessionExpired(false);
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [session, status]);

  const logout = useCallback(() => {
    setUser(null);
    setSessionExpiresAt(null);
    setSessionExpired(false);
    
    // Nettoyer le localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('kamlog_token');
    localStorage.removeItem('refresh_token');
    
    // Déconnexion NextAuth
    signOut({ callbackUrl: '/login' });
  }, []);

  const renewSession = useCallback(() => {
    if (user) {
      const newExpiry = new Date();
      newExpiry.setMinutes(newExpiry.getMinutes() + 30);
      setSessionExpiresAt(newExpiry);
      setSessionExpired(false);
      console.log('Session renewed until:', newExpiry.toLocaleTimeString());
    }
  }, [user]);

  // Monitor session expiration locally
  useEffect(() => {
    if (!sessionExpiresAt || sessionExpired) return;

    const timer = setInterval(() => {
      if (Date.now() >= sessionExpiresAt.getTime()) {
        setSessionExpired(true);
        clearInterval(timer);
      }
    }, 1000);
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