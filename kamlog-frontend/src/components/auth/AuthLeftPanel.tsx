import { Ship, Package, Users } from 'lucide-react'

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
        
        {/* SVG Illustration — Port de Douala */}
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

    </div>
  )
}

// ── Illustration SVG Port de Douala ───────────────────────
function PortIllustration() {
  return (
    <svg
      viewBox="0 0 400 250"
      className="w-full max-w-sm opacity-90"
      fill="none"
    >
      {/* Eau */}
      <rect x="0" y="180" width="400" height="70" 
            fill="#0369a1" opacity="0.3" rx="2"/>
      
      {/* Vagues eau */}
      <path d="M0 185 Q50 178 100 185 Q150 192 200 185 
               Q250 178 300 185 Q350 192 400 185" 
            stroke="#06b6d4" strokeWidth="1.5" opacity="0.5"/>
      <path d="M0 195 Q60 188 120 195 Q180 202 240 195 
               Q300 188 360 195 Q390 200 400 195" 
            stroke="#06b6d4" strokeWidth="1" opacity="0.3"/>

      {/* Quai */}
      <rect x="20" y="170" width="360" height="12" 
            fill="#1e3a5f" rx="2"/>

      {/* Grue gauche */}
      <rect x="40" y="80" width="6" height="90" fill="#0369a1"/>
      <rect x="20" y="78" width="80" height="5" fill="#0369a1"/>
      <rect x="20" y="78" width="5" height="30" fill="#0369a1"/>
      <line x1="100" y1="78" x2="46" y2="168" 
            stroke="#06b6d4" strokeWidth="1.5" opacity="0.7"/>
      <line x1="20" y1="78" x2="46" y2="168" 
            stroke="#06b6d4" strokeWidth="1" opacity="0.5"/>

      {/* Grue droite */}
      <rect x="280" y="70" width="6" height="100" fill="#0369a1"/>
      <rect x="260" y="68" width="90" height="5" fill="#0369a1"/>
      <rect x="344" y="68" width="5" height="35" fill="#0369a1"/>
      <line x1="260" y1="68" x2="283" y2="168" 
            stroke="#06b6d4" strokeWidth="1.5" opacity="0.7"/>
      <line x1="350" y1="68" x2="283" y2="168" 
            stroke="#06b6d4" strokeWidth="1" opacity="0.5"/>

      {/* Navire */}
      <path d="M100 155 L130 140 L270 140 L300 155 L290 168 L110 168 Z" 
            fill="#0c4a6e" stroke="#0369a1" strokeWidth="1.5"/>
      <rect x="160" y="120" width="80" height="22" 
            fill="#0369a1" rx="2"/>
      <rect x="175" y="108" width="50" height="14" 
            fill="#0c4a6e" stroke="#0369a1" strokeWidth="1" rx="1"/>

      {/* Fenêtres navire */}
      <rect x="168" y="126" width="8" height="6" 
            fill="#06b6d4" opacity="0.6" rx="1"/>
      <rect x="182" y="126" width="8" height="6" 
            fill="#06b6d4" opacity="0.6" rx="1"/>
      <rect x="196" y="126" width="8" height="6" 
            fill="#06b6d4" opacity="0.6" rx="1"/>
      <rect x="210" y="126" width="8" height="6" 
            fill="#06b6d4" opacity="0.6" rx="1"/>
      <rect x="224" y="126" width="8" height="6" 
            fill="#06b6d4" opacity="0.6" rx="1"/>

      {/* Conteneurs empilés sur quai */}
      {/* Rangée 1 */}
      <rect x="55" y="148" width="28" height="16" 
            fill="#0369a1" stroke="#06b6d4" strokeWidth="0.5" rx="1"/>
      <rect x="85" y="148" width="28" height="16" 
            fill="#0c4a6e" stroke="#06b6d4" strokeWidth="0.5" rx="1"/>
      <rect x="115" y="148" width="28" height="16" 
            fill="#075985" stroke="#06b6d4" strokeWidth="0.5" rx="1"/>

      {/* Rangée 2 */}
      <rect x="60" y="133" width="28" height="14" 
            fill="#0c4a6e" stroke="#06b6d4" strokeWidth="0.5" rx="1"/>
      <rect x="90" y="133" width="28" height="14" 
            fill="#0369a1" stroke="#06b6d4" strokeWidth="0.5" rx="1"/>

      {/* Conteneurs droite */}
      <rect x="305" y="148" width="28" height="16" 
            fill="#0369a1" stroke="#06b6d4" strokeWidth="0.5" rx="1"/>
      <rect x="335" y="148" width="28" height="16" 
            fill="#075985" stroke="#06b6d4" strokeWidth="0.5" rx="1"/>
      <rect x="310" y="133" width="28" height="14" 
            fill="#0c4a6e" stroke="#06b6d4" strokeWidth="0.5" rx="1"/>

      {/* Étoiles/points lumineux */}
      <circle cx="350" cy="30" r="1.5" fill="#06b6d4" opacity="0.6"/>
      <circle cx="30" cy="50" r="1" fill="#06b6d4" opacity="0.4"/>
      <circle cx="380" cy="60" r="1" fill="#06b6d4" opacity="0.5"/>
      <circle cx="200" cy="20" r="1.5" fill="#06b6d4" opacity="0.3"/>
      <circle cx="150" cy="45" r="1" fill="white" opacity="0.3"/>
    </svg>
  )
}