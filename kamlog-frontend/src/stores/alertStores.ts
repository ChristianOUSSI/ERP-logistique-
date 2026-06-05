// src/stores/alertStore.ts — Store alertes globales KAMLOG
import { create } from 'zustand'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

export interface Alert {
  id: string
  type: AlertType
  title: string
  message?: string
  duration?: number  // ms, défaut 5000
}

interface AlertState {
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, 'id'>) => void
  removeAlert: (id: string) => void
  clearAll: () => void
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],

  addAlert: (alert) => {
    const id = `alert_${Date.now()}_${Math.random()}`
    set((state) => ({
      alerts: [...state.alerts, { ...alert, id }],
    }))

    // Auto-suppression après durée
    const duration = alert.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== id),
        }))
      }, duration)
    }
  },

  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),

  clearAll: () => set({ alerts: [] }),
}))

// Hook helper pour les alertes rapides
export const useAlert = () => {
  const addAlert = useAlertStore((s) => s.addAlert)

  return {
    success: (title: string, message?: string) =>
      addAlert({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      addAlert({ type: 'error', title, message, duration: 8000 }),
    warning: (title: string, message?: string) =>
      addAlert({ type: 'warning', title, message }),
    info: (title: string, message?: string) =>
      addAlert({ type: 'info', title, message }),
  }
}