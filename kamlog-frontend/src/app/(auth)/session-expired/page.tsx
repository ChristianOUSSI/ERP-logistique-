// src/app/(auth)/session-expired/page.tsx
// Design: carte centrée sur fond ERP — session expirée
import Link from 'next/link'

export default function SessionExpiredPage() {
  return (
    <div
      className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex flex-col items-center justify-center overflow-y-auto relative py-12"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low via-white to-surface-container-highest" />
        <div className="absolute inset-0 logistics-overlay" />
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3F047r3gYJ87S3A35ak4dIOIGqHlksQbCPpUlVQ9vzeVWDfPBYIsS1-J0MTQ9hZvKJAmbrnAYlmm3-ppAXOhAndHlGzivtl9VPHTj8VML1Wbf7MIAshXa5PCgYR8-lLGVUBSlC9vdyEDdCz62_JQU91TuJVRfwE8oKBOJkHTLfyCcTYJhzzqwJoSOseWKiawHRC8myzlInZFL1fwnsC2PjL2ayMm-MVJ3iAiIHWL6f6uK8IZa0Wp1uebXZ6G0B5GfrtQB6X6Qkic"
            alt="Terminal portuaire KAMLOG"
          />
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="relative z-10 w-full max-w-md px-md">

        {/* ── Header / Branding ── */}
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center p-xs bg-white rounded-lg shadow-sm border border-outline-variant mb-md">
            <span
              className="material-symbols-outlined text-auth-blue text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              precision_manufacturing
            </span>
          </div>
          <h1 className="text-headline-sm font-headline-sm text-primary tracking-tight">
            KAMLOG EM-ERP
          </h1>
          <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest mt-xxs">
            Operational Control Systems
          </p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white border border-outline-variant rounded-lg p-lg auth-card">

          <div className="text-center mb-lg">
            <div className="flex justify-center mb-md">
              <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  timer_off
                </span>
              </div>
            </div>
            <h2 className="text-title-lg font-title-lg text-on-surface mb-xxs">
              Session expirée
            </h2>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Votre session a expiré pour des raisons de sécurité.
              Veuillez vous reconnecter pour continuer.
            </p>
          </div>

          {/* Info box */}
          <div className="flex items-start gap-xs p-sm bg-surface-container rounded border border-outline-variant/30 mb-lg text-left">
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">info</span>
            <p className="text-label-sm font-label-sm text-on-surface-variant leading-tight">
              Vos données non sauvegardées ont été perdues.
              Reconnectez-vous pour reprendre votre travail.
            </p>
          </div>

          {/* Bouton principal */}
          <Link
            href="/login"
            className="w-full py-sm px-md bg-primary text-on-primary font-title-md text-title-md rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-xs shadow-md"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>Se reconnecter</span>
          </Link>

          {/* Footer info */}
          <div className="mt-lg pt-md border-t border-outline-variant">
            <div className="flex items-center gap-sm text-on-surface-variant justify-center">
              <span className="material-symbols-outlined text-outline text-[18px]">verified_user</span>
              <p className="text-label-sm font-label-sm">Secured by EM-ERP Access Control</p>
            </div>
          </div>
        </div>

        {/* ── System Footer ── */}
        <div className="mt-lg flex flex-col items-center gap-xs">
          <p className="text-label-sm font-label-sm text-outline">
            v4.8.2-stable | © 2026 KAMLOG LOGISTICS GROUP
          </p>
        </div>
      </main>
    </div>
  )
}