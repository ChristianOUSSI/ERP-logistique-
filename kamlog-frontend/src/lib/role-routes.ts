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
  CLIENT_B2B: '/client-portal',
  CLIENT: '/client-portal',
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
  client_b2b: 'CLIENT_B2B',
  client: 'CLIENT',
};


export function normalizeRole(role?: string | string[] | null): string {
  if (!role) {
    return 'USER';
  }

  const roleStr = Array.isArray(role) ? (role[0] || '') : role;
  const trimmedRole = roleStr.trim();
  if (!trimmedRole) {
    return 'USER';
  }

  const normalizedKey = trimmedRole.toLowerCase();
  return ROLE_ALIASES[normalizedKey] ?? trimmedRole.toUpperCase();
}

export function getRouteForRole(role?: string | string[] | null): string {
  if (Array.isArray(role) && role.length > 0) {
    // If admin is in the roles, return global dashboard
    if (role.some(r => r.toLowerCase() === 'admin')) return ROLE_ROUTES['ADMIN'];
    // Otherwise return route for first role
    const normalizedRole = normalizeRole(role[0]);
    return ROLE_ROUTES[normalizedRole] ?? '/dashboard';
  }
  
  const normalizedRole = normalizeRole(role as string | null);
  return ROLE_ROUTES[normalizedRole] ?? '/dashboard';
}
