export function PortIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
    >
      <defs>
        {/* Dégradé ciel */}
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe"/>
          <stop offset="100%" stopColor="#bae6fd"/>
        </linearGradient>
        
        {/* Dégradé eau */}
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9"/>
        </linearGradient>
        
        {/* Dégradé navire */}
        <linearGradient id="shipGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3a5f"/>
          <stop offset="50%" stopColor="#0c4a6e"/>
          <stop offset="100%" stopColor="#1e3a5f"/>
        </linearGradient>
        
        {/* Dégradé conteneurs */}
        <linearGradient id="containerRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444"/>
          <stop offset="100%" stopColor="#dc2626"/>
        </linearGradient>
        <linearGradient id="containerBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#2563eb"/>
        </linearGradient>
        <linearGradient id="containerGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e"/>
          <stop offset="100%" stopColor="#16a34a"/>
        </linearGradient>
        <linearGradient id="containerYellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eab308"/>
          <stop offset="100%" stopColor="#ca8a04"/>
        </linearGradient>
        
        {/* Ombre 3D */}
        <filter id="shadow3d" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="3" dy="5" stdDeviation="4" floodOpacity="0.25"/>
        </filter>
        
        {/* Ombre légère */}
        <filter id="lightShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.15"/>
        </filter>
      </defs>
      
      {/* Ciel */}
      <rect x="0" y="0" width="400" height="180" fill="url(#skyGradient)"/>
      
      {/* Soleil */}
      <circle cx="320" cy="50" r="25" fill="#fbbf24" opacity="0.9" filter="url(#lightShadow)"/>
      <circle cx="320" cy="50" r="30" fill="#fbbf24" opacity="0.3"/>
      
      {/* Oiseaux en vol (style minimaliste) */}
      <path d="M50 40 Q55 35 60 40 Q65 35 70 40" stroke="#1e3a5f" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M80 55 Q85 50 90 55 Q95 50 100 55" stroke="#1e3a5f" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M120 35 Q125 30 130 35 Q135 30 140 35" stroke="#1e3a5f" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <path d="M280 45 Q285 40 290 45 Q295 40 300 45" stroke="#1e3a5f" strokeWidth="1.5" fill="none" opacity="0.5"/>
      
      {/* Eau */}
      <rect x="0" y="180" width="400" height="120" fill="url(#waterGradient)"/>
      
      {/* Vagues subtiles */}
      <path d="M0 190 Q50 185 100 190 Q150 195 200 190 Q250 185 300 190 Q350 195 400 190" 
            stroke="#bae6fd" strokeWidth="1" opacity="0.4" fill="none"/>
      <path d="M0 210 Q60 205 120 210 Q180 215 240 210 Q300 205 360 210 Q380 212 400 210" 
            stroke="#bae6fd" strokeWidth="1" opacity="0.3" fill="none"/>
      
      {/* Quai */}
      <rect x="0" y="165" width="400" height="18" fill="#374151" filter="url(#shadow3d)"/>
      <rect x="0" y="165" width="400" height="5" fill="#4b5563"/>
      
      {/* Conteneurs sur le quai (rangée arrière) */}
      <rect x="20" y="125" width="35" height="40" fill="url(#containerRed)" rx="2" filter="url(#lightShadow)"/>
      <rect x="60" y="125" width="35" height="40" fill="url(#containerBlue)" rx="2" filter="url(#lightShadow)"/>
      <rect x="100" y="125" width="35" height="40" fill="url(#containerGreen)" rx="2" filter="url(#lightShadow)"/>
      
      {/* Conteneurs sur le quai (rangée avant) */}
      <rect x="30" y="135" width="35" height="30" fill="url(#containerYellow)" rx="2" filter="url(#shadow3d)"/>
      <rect x="70" y="135" width="35" height="30" fill="url(#containerRed)" rx="2" filter="url(#shadow3d)"/>
      <rect x="110" y="135" width="35" height="30" fill="url(#containerBlue)" rx="2" filter="url(#shadow3d)"/>
      
      {/* Détails sur les conteneurs */}
      <rect x="32" y="140" width="31" height="2" fill="#ffffff" opacity="0.3" rx="1"/>
      <rect x="72" y="140" width="31" height="2" fill="#ffffff" opacity="0.3" rx="1"/>
      <rect x="112" y="140" width="31" height="2" fill="#ffffff" opacity="0.3" rx="1"/>
      
      {/* Navire */}
      {/* Coque principale */}
      <path d="M160 165 L180 140 L320 140 L340 165 L330 175 L170 175 Z" 
            fill="url(#shipGradient)" stroke="#0c4a6e" strokeWidth="2" filter="url(#shadow3d)"/>
      
      {/* Cabine du navire */}
      <rect x="210" y="110" width="70" height="32" fill="#1e3a5f" rx="3" filter="url(#shadow3d)"/>
      <rect x="220" y="95" width="50" height="18" fill="#0c4a6e" stroke="#1e3a5f" strokeWidth="1.5" rx="2" filter="url(#lightShadow)"/>
      
      {/* Fenêtres du navire */}
      <rect x="215" y="118" width="12" height="10" fill="#0ea5e9" opacity="0.8" rx="1"/>
      <rect x="232" y="118" width="12" height="10" fill="#0ea5e9" opacity="0.8" rx="1"/>
      <rect x="249" y="118" width="12" height="10" fill="#0ea5e9" opacity="0.8" rx="1"/>
      <rect x="266" y="118" width="12" height="10" fill="#0ea5e9" opacity="0.8" rx="1"/>
      
      {/* Cheminée du navire */}
      <rect x="275" y="75" width="12" height="22" fill="#374151" rx="2" filter="url(#lightShadow)"/>
      <rect x="277" y="70" width="8" height="8" fill="#6b7280" rx="1"/>
      
      {/* Conteneurs sur le navire */}
      <rect x="185" y="125" width="25" height="15" fill="url(#containerGreen)" rx="1" filter="url(#lightShadow)"/>
      <rect x="213" y="125" width="25" height="15" fill="url(#containerYellow)" rx="1" filter="url(#lightShadow)"/>
      <rect x="241" y="125" width="25" height="15" fill="url(#containerRed)" rx="1" filter="url(#lightShadow)"/>
      
      {/* Reflet du navire sur l'eau */}
      <ellipse cx="250" cy="195" rx="70" ry="8" fill="#0ea5e9" opacity="0.2"/>
      
      {/* Oiseaux posés sur le quai */}
      <path d="M150 160 L152 155 L154 160" stroke="#1e3a5f" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <circle cx="152" cy="157" r="2" fill="#1e3a5f" opacity="0.7"/>
      
      <path d="M165 158 L167 153 L169 158" stroke="#1e3a5f" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <circle cx="167" cy="155" r="2" fill="#1e3a5f" opacity="0.6"/>
    </svg>
  )
}
