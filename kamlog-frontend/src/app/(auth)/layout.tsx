import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      
      {/* ── Panneau GAUCHE (55%) ── */}
      <AuthLeftPanel />

      {/* ── Panneau DROIT (45%) ── */}
      {/* children = le formulaire de chaque page */}
      <div className="flex-1 flex flex-col items-center justify-center 
                      bg-white px-8 py-12 min-h-screen">
        
        {/* Logo KAMLOG en haut à droite */}
        <div className="absolute top-6 right-8">
          <span className="text-[#1e293b] font-bold text-lg tracking-wide">
            KAMLOG
          </span>
        </div>

        {/* Contenu de la page (login form, forgot form...) */}
        <div className="w-full max-w-100">
          {children}
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-xs text-muted-foreground text-center">
          © 2026 CADC - KAMLOG EM-ERP • Confidentiel
        </p>
      </div>

    </div>
  )
}