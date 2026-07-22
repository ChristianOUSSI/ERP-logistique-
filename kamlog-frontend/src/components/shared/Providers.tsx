// src/components/shared/Providers.tsx
'use client'
import { SessionProvider, useSession } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { AuthProvider as CustomAuthProvider } from '@/components/layout/AuthProvider'
import { SettingsProvider } from '@/components/layout/SettingsProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@/components/theme-provider'

function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    if (session?.user) {
      const token = session.user.accessToken;
      const refreshToken = session.user.refreshToken;
      
      if (token) {
        localStorage.setItem('access_token', token);
        localStorage.setItem('kamlog_token', token);
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      
      setTokens(token || '', refreshToken || '');
      setUser({
        id: session.user.id || '',
        email: session.user.email || '',
        nom: session.user.nom || '',
        prenom: session.user.prenom || '',
        role: (session.user as any).role || '',
        roles: (session.user as any).roles || ['user'],
        is_active: session.user.is_active ?? true,
      });
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('kamlog_token');
      localStorage.removeItem('refresh_token');
      logout();
    }
  }, [session, setTokens, setUser, logout]);

  return <>{children}</>;
}

import PwaInstallPrompt from '@/components/shared/PwaInstallPrompt'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute par défaut
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AuthSync>
          <CustomAuthProvider>
            <SettingsProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
                <PwaInstallPrompt />
              </ThemeProvider>
            </SettingsProvider>
          </CustomAuthProvider>
        </AuthSync>
        <Toaster />
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}