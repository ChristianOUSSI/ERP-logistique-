// src/stores/authStore.ts — Store Zustand Auth KAMLOG
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserKamlog, RoleKamlog } from '@/types/auth'

interface AuthState {
  // State
  user: UserKamlog | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: UserKamlog) => void
  logout: () => void
  setLoading: (loading: boolean) => void

  // Helpers RBAC
  hasRole: (role: RoleKamlog) => boolean
  hasPermission: (permission: string) => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // State initial
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Setter tokens
      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      // Setter user
      setUser: (user) => set({ user }),

      // Logout — reset complet
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      // Loading state
      setLoading: (isLoading) => set({ isLoading }),

      // Vérifier le rôle
      hasRole: (role) => {
        const { user } = get()
        return user?.role === role || user?.role === 'admin'
      },

      // Vérifier une permission
      hasPermission: (permission) => {
        const { user } = get()
        if (!user) return false
        if (user.role === 'admin') return true

        const { ROLE_PERMISSIONS } = require('@/types/auth')
        const perms: string[] = ROLE_PERMISSIONS[user.role] || []
        return perms.includes(permission) || perms.includes('*')
      },

      // Helper admin
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'kamlog-auth',               // Clé localStorage
      storage: createJSONStorage(() => localStorage),
      // Ne persister que les tokens et user (pas isLoading)
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)