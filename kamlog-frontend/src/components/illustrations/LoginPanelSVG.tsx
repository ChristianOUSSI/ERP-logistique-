// src/components/illustrations/LoginPanelSVG.tsx
// SVG Component for Login Panel - Port-themed vector art
export default function LoginPanelSVG() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0f3ff" />
          <stop offset="100%" stopColor="#e7eefe" />
        </linearGradient>
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0058be" />
          <stop offset="100%" stopColor="#004395" />
        </linearGradient>
      </defs>

      {/* Sky background */}
      <rect width="1200" height="600" fill="url(#bgGradient)" />

      {/* Water/Sea */}
      <rect x="0" y="400" width="1200" height="200" fill="url(#waterGradient)" opacity="0.3" />

      {/* Port infrastructure */}
      <rect x="100" y="350" width="300" height="50" fill="#424754" />
      <rect x="450" y="350" width="300" height="50" fill="#424754" />
      <rect x="800" y="350" width="300" height="50" fill="#424754" />

      {/* Containers */}
      <rect x="120" y="280" width="60" height="70" fill="#0058be" rx="2" />
      <rect x="190" y="280" width="60" height="70" fill="#006c49" rx="2" />
      <rect x="260" y="280" width="60" height="70" fill="#825100" rx="2" />
      <rect x="330" y="280" width="60" height="70" fill="#ba1a1a" rx="2" />

      <rect x="470" y="280" width="60" height="70" fill="#0058be" rx="2" />
      <rect x="540" y="280" width="60" height="70" fill="#006c49" rx="2" />
      <rect x="610" y="280" width="60" height="70" fill="#825100" rx="2" />
      <rect x="680" y="280" width="60" height="70" fill="#ba1a1a" rx="2" />

      <rect x="820" y="280" width="60" height="70" fill="#0058be" rx="2" />
      <rect x="890" y="280" width="60" height="70" fill="#006c49" rx="2" />
      <rect x="960" y="280" width="60" height="70" fill="#825100" rx="2" />
      <rect x="1030" y="280" width="60" height="70" fill="#ba1a1a" rx="2" />

      {/* Ship */}
      <path d="M200 450 L300 450 L320 480 L180 480 Z" fill="#424754" />
      <rect x="220" y="420" width="40" height="30" fill="#424754" />
      <rect x="230" y="400" width="20" height="20" fill="#0058be" />

      {/* Cranes */}
      <rect x="150" y="200" width="10" height="150" fill="#727785" />
      <rect x="130" y="200" width="50" height="10" fill="#727785" />
      <line x1="155" y1="200" x2="155" y2="350" stroke="#727785" strokeWidth="2" />

      <rect x="500" y="200" width="10" height="150" fill="#727785" />
      <rect x="480" y="200" width="50" height="10" fill="#727785" />
      <line x1="505" y1="200" x2="505" y2="350" stroke="#727785" strokeWidth="2" />

      <rect x="850" y="200" width="10" height="150" fill="#727785" />
      <rect x="830" y="200" width="50" height="10" fill="#727785" />
      <line x1="855" y1="200" x2="855" y2="350" stroke="#727785" strokeWidth="2" />

      {/* Statistics cards */}
      <rect x="50" y="50" width="200" height="80" fill="white" rx="8" opacity="0.9" />
      <text x="70" y="80" fontFamily="Inter" fontSize="14" fill="#424754">Dossiers Actifs</text>
      <text x="70" y="110" fontFamily="Inter" fontSize="24" fontWeight="bold" fill="#0058be">1,284</text>

      <rect x="280" y="50" width="200" height="80" fill="white" rx="8" opacity="0.9" />
      <text x="300" y="80" fontFamily="Inter" fontSize="14" fill="#424754">Conteneurs</text>
      <text x="300" y="110" fontFamily="Inter" fontSize="24" fontWeight="bold" fill="#006c49">8,542</text>

      <rect x="510" y="50" width="200" height="80" fill="white" rx="8" opacity="0.9" />
      <text x="530" y="80" fontFamily="Inter" fontSize="14" fill="#424754">Clients</text>
      <text x="530" y="110" fontFamily="Inter" fontSize="24" fontWeight="bold" fill="#825100">342</text>

      {/* Logo */}
      <circle cx="1100" cy="100" r="40" fill="#0058be" />
      <text x="1100" y="110" fontFamily="Inter" fontSize="32" fontWeight="bold" fill="white" textAnchor="middle">K</text>
    </svg>
  )
}
