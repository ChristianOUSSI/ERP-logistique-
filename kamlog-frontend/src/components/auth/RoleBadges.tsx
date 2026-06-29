'use client'

interface RoleBadgesProps {
  onRoleSelect: (email: string, password: string) => void
}

const ROLES_TEST = [
  { 
    label: 'Admin', 
    email: 'admin@kamlog.cm', 
    password: 'admin123',
    color: 'border-red-400 text-red-600 hover:bg-red-50'
  },
  { 
    label: 'Dispatcher', 
    email: 'dispatcher@kamlog.cm', 
    password: 'dispatcher123',
    color: 'border-blue-400 text-blue-600 hover:bg-blue-50'
  },
  { 
    label: 'Finance', 
    email: 'finance@kamlog.cm', 
    password: 'finance123',
    color: 'border-green-400 text-green-600 hover:bg-green-50'
  },
  { 
    label: 'Douane', 
    email: 'douane@kamlog.cm', 
    password: 'douane123',
    color: 'border-orange-400 text-orange-600 hover:bg-orange-50'
  },
  { 
    label: 'Agent Guérite', 
    email: 'gate@kamlog.cm', 
    password: 'gate123',
    color: 'border-gray-400 text-gray-600 hover:bg-gray-50'
  },
  { 
    label: 'Magasinier', 
    email: 'magasin@kamlog.cm', 
    password: 'magasin123',
    color: 'border-purple-400 text-purple-600 hover:bg-purple-50'
  },
  { 
    label: 'Auditeur', 
    email: 'auditor@kamlog.cm', 
    password: 'auditor123',
    color: 'border-teal-400 text-teal-600 hover:bg-teal-50'
  },
]

export function RoleBadges({ onRoleSelect }: RoleBadgesProps) {
  return (
    <div className="mt-6">
      {/* Séparateur */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-[#e2e8f0]" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Accès rapide par rôle
        </span>
        <div className="flex-1 h-px bg-[#e2e8f0]" />
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {ROLES_TEST.map((role) => (
          <button
            key={role.label}
            type="button"
            onClick={() => onRoleSelect(role.email, role.password)}
            className={`
              px-3 py-1 text-xs font-medium rounded-full border 
              transition-colors duration-150 cursor-pointer
              ${role.color}
            `}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  )
}