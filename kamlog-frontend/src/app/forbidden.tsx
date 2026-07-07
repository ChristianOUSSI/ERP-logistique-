'use client'

import Link from 'next/link'
import { useI18n } from '@/hooks/useI18n'

export default function Forbidden() {
  const t = useI18n()
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-block relative mb-8">
          <div className="text-[120px] font-bold text-tertiary opacity-10 leading-none select-none">403</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 64 }}>shield_lock</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-on-background mb-3">{t.errors.forbiddenTitle}</h1>
        <p className="text-on-surface-variant text-base mb-8">{t.errors.forbiddenMessage}</p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary text-on-primary font-semibold text-sm transition hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            {t.errors.backHome}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-outline text-on-surface font-semibold text-sm transition hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            {t.errors.previousPage2}
          </button>
        </div>

        <p className="mt-10 text-xs text-on-surface-variant/50">{t.errors.confidentialFooter}</p>
      </div>
    </div>
  )
}
