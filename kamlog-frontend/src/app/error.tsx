'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/hooks/useI18n'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useI18n()
  useEffect(() => { console.error('Application error:', error) }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-block relative mb-8">
          <div className="text-[120px] font-bold text-error opacity-10 leading-none select-none">500</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-error" style={{ fontSize: 64 }}>warning</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-on-background mb-3">{t.errors.serverErrorTitle}</h1>
        <p className="text-on-surface-variant text-base mb-4">{t.errors.serverErrorMessage}</p>
        {error.message && (
          <p className="text-sm text-on-surface-variant bg-surface-container p-3 rounded-lg mb-6 font-mono">{error.message}</p>
        )}

        <div className="space-y-3">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary text-on-primary font-semibold text-sm transition hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            {t.errors.tryAgain}
          </button>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-outline text-on-surface font-semibold text-sm transition hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            {t.errors.backToHome}
          </Link>
        </div>

        <p className="mt-8 text-sm text-on-surface-variant">
          {t.errors.helpPersists}
          <a href="mailto:support@evo-log.cm" className="text-primary hover:underline">support@evo-log.cm</a>
        </p>
        <p className="mt-10 text-xs text-on-surface-variant/50">{t.errors.confidentialFooter}</p>
      </div>
    </div>
  )
}
