'use client'
import { useSettings } from '@/components/layout/SettingsProvider'
import { DICTIONARIES } from '@/i18n/dictionary'

export function useI18n() {
  const { language } = useSettings()
  return DICTIONARIES[language]
}
