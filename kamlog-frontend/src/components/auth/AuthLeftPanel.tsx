import { Ship, Package, Users } from 'lucide-react'
import { PortIllustration } from '@/components/illustrations/PortIllustration'

export function AuthLeftPanel() {
  return (
    <div 
      className="hidden lg:flex lg:w-[55%] flex-col"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* ── Logo ── */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          {/* Icône K */}
          <div 
            className="w-10 h-10 rounded-lg flex items-center 
                       justify-center font-bold text-white text-xl"
            style={{ backgroundColor: '#06b6d4' }}
          >
            K
          </div>
          {/* Texte logo */}
          <div>
            <p className="text-white font-bold text-base leading-tight">
              KAMLOG EM-ERP
            </p>
            <p className="text-[#06b6d4] text-xs">
              Enterprise Management
            </p>
          </div>
        </div>
      </div>

      {/* ── Illustration port ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        
        {/* SVG Illustration  Port de Douala */}
        <PortIllustration />

        {/* Textes sous illustration */}
        <div className="text-center mt-8">
          <h2 className="text-white font-semibold text-xl leading-snug">
            Système de Gestion Logistique Intégré
          </h2>
          <p className="text-[#06b6d4] text-sm mt-2">
            Port Autonome de Douala - Cameroun
          </p>
        </div>
      </div>

      {/* ── Stats en bas ── */}
      <div className="p-8">
        <div 
          className="grid grid-cols-3 gap-4 p-4 rounded-xl"
          style={{ backgroundColor: '#1e293b' }}
        >
          {/* Stat 1 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Package size={14} className="text-muted-foreground" />
            </div>
            <p className="text-white font-bold text-lg">247</p>
            <p className="text-muted-foreground text-xs">Dossiers Actifs</p>
          </div>

          {/* Stat 2 */}
          <div className="text-center border-x border-[#334155]">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Ship size={14} className="text-muted-foreground" />
            </div>
            <p className="text-white font-bold text-lg">1,854</p>
            <p className="text-muted-foreground text-xs">Conteneurs</p>
          </div>

          {/* Stat 3 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users size={14} className="text-muted-foreground" />
            </div>
            <p className="text-white font-bold text-lg">89</p>
            <p className="text-muted-foreground text-xs">Clients</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <PortIllustration className="w-full max-w-sm opacity-90" />
      </div>

    </div>
  )
}