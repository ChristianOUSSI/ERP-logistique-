const ROLE_ROUTES: Record<string, string> = {
  ADMIN: '/dashboard/global',
  MANAGER: '/dashboard/global',
  USER: '/dashboard/global',
  DISPATCHER: '/transport/control',
  TRANSPORT: '/transport/control',
  FINANCE: '/finance/overview',
  GATE_AGENT: '/parc/overview',
  GATE: '/parc/overview',
  PARC: '/parc/overview',
  DOUANE: '/dashboard/global',
  MAGASIN: '/magasin/dashboard',
  MAGASINIER: '/magasin/dashboard',
  AUDITOR: '/audit/dashboard/health',
};

const ROLE_ALIASES: Record<string, string> = {
  admin: 'ADMIN',
  manager: 'MANAGER',
  user: 'USER',
  dispatcher: 'DISPATCHER',
  transport: 'TRANSPORT',
  finance: 'FINANCE',
  gate_agent: 'GATE_AGENT',
  gate: 'GATE',
  parc: 'PARC',
  douane: 'DOUANE',
  magasin: 'MAGASIN',
  magasinier: 'MAGASINIER',
  auditor: 'AUDITOR',
};

export function normalizeRole(role?: string | null): string {
  if (!role) {
    return 'USER';
  }

  const trimmedRole = role.trim();
  if (!trimmedRole) {
    return 'USER';
  }

  const normalizedKey = trimmedRole.toLowerCase();
  return ROLE_ALIASES[normalizedKey] ?? trimmedRole.toUpperCase();
}

export function getRouteForRole(role?: string | null): string {
  const normalizedRole = normalizeRole(role);
  return ROLE_ROUTES[normalizedRole] ?? '/dashboard';
}
