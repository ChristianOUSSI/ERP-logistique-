import {
  Package,
  Truck,
  DollarSign,
  ShieldAlert,
  Building,
  Globe,
  Settings,
  Tag,
  Radio,
  Fuel,
  ShoppingCart,
  Landmark,
  BarChart3,
  Users,
  UserCheck,
  LayoutDashboard,
  Layers,
  FileText,
  Boxes,
  MapPin,
  ClipboardList,
  ArrowRightLeft,
  Bot,
  RotateCcw,
  Navigation,
  FileCheck,
  Wrench,
  Compass,
  Zap,
  Activity,
  BookOpen,
  CreditCard
} from "lucide-react";

export interface SubModuleItem {
  label: string;
  path: string;
  icon: any;
  badge?: string;
  requiredRoles?: string[];
}

export interface ModuleNavConfig {
  key: string;
  title: string;
  path: string;
  icon: any;
  color: string;
  glow: string;
  bgGradient: string;
  requiredRoles?: string[];
  subModules: SubModuleItem[];
}

export const NAVIGATION_REGISTRY: Record<string, ModuleNavConfig> = {
  dashboard: {
    key: "dashboard",
    title: "Vue Globale ERP",
    path: "/dashboard/global",
    icon: Compass,
    color: "#6366f1",
    glow: "shadow-indigo-500/50 border-indigo-500/60",
    bgGradient: "from-indigo-600 to-blue-600",
    subModules: [
      { label: "Vue d'Ensemble Executive", path: "/dashboard/global", icon: LayoutDashboard, badge: "Main" },
      { label: "Alertes & Incidents Live", path: "/security/notifications", icon: Zap, badge: "Live" },
      { label: "Indicateurs Clés BI", path: "/bi", icon: BarChart3, badge: "KPIs" },
      { label: "Dernières Transactions WMS", path: "/magasin/transactions", icon: Activity },
      { label: "Control Tower Transport", path: "/transport/control", icon: Truck },
    ]
  },

  admin: {
    key: "admin",
    title: "Administration ERP",
    path: "/admin",
    icon: ShieldAlert,
    color: "#6366f1",
    glow: "shadow-indigo-500/50 border-indigo-500/60",
    bgGradient: "from-indigo-600 to-violet-600",
    requiredRoles: ["ADMIN"],
    subModules: [
      { label: "Utilisateurs & RBAC", path: "/admin", icon: Users, badge: "Admin" },
      { label: "Configuration des Rôles", path: "/admin/configuration-des-roles-rbac", icon: ShieldAlert },
      { label: "Agences Portuaires", path: "/admin/agencies", icon: Building },
      { label: "Journal d'Audit Système", path: "/admin/journal", icon: Activity },
      { label: "Alertes & Sécurité", path: "/admin/alerts", icon: Zap },
      { label: "Paramètres Globaux", path: "/settings", icon: Settings },
    ]
  },

  transport: {
    key: "transport",
    title: "K-Transport & Flotte",
    path: "/transport/control",
    icon: Truck,
    color: "#06b6d4",
    glow: "shadow-cyan-500/50 border-cyan-500/60",
    bgGradient: "from-cyan-600 to-blue-500",
    requiredRoles: ["ADMIN", "DISPATCHER", "TRANSPORT", "MANAGER"],
    subModules: [
      { label: "Poste de Contrôle Live", path: "/transport/control", icon: LayoutDashboard, badge: "Live" },
      { label: "Missions & Dispatch", path: "/transport/dispatch", icon: Navigation, badge: "Planning" },
      { label: "Flotte Camions & Tracteurs", path: "/transport/flotte", icon: Truck },
      { label: "Gestion Chauffeurs", path: "/transport/drivers", icon: Users },
      { label: "Tracking Live & e-POD", path: "/transport/epod", icon: Radio, badge: "e-POD" },
      { label: "Carte GPS Temps Réel", path: "/transport/carte-live", icon: MapPin },
      { label: "ChatOps Missions", path: "/transport/chatops", icon: Bot },
      { label: "Tickets Carburant", path: "/transport/saisie-ticket-carburant", icon: Fuel, badge: "Fuel" },
      { label: "Déclarations de Fret", path: "/transport/goods-declaration", icon: FileCheck },
      { label: "Gestion des Conteneurs", path: "/transport/containers", icon: Boxes },
    ]
  },

  magasin: {
    key: "magasin",
    title: "K-Magasin WMS",
    path: "/magasin/dashboard",
    icon: Package,
    color: "#f59e0b",
    glow: "shadow-amber-500/50 border-amber-500/60",
    bgGradient: "from-amber-600 to-yellow-500",
    requiredRoles: ["ADMIN", "MAGASINIER", "MAGASIN", "MANAGER"],
    subModules: [
      { label: "Dashboard WMS", path: "/magasin/dashboard", icon: LayoutDashboard, badge: "Main" },
      { label: "Réception MAG3", path: "/magasin/reception-mag3", icon: Boxes, badge: "MAG3" },
      { label: "Bons d'Enlèvement (BL)", path: "/magasin/removal-slip", icon: FileText, badge: "BL" },
      { label: "Assistant IA Chat", path: "/magasin/ia-chat", icon: Bot, badge: "IA" },
      { label: "Saisie Inventaire Physique", path: "/magasin/saisie-inventaire-physique", icon: ClipboardList },
      { label: "Ordres de Transfert", path: "/magasin/ordres-transfert", icon: ArrowRightLeft },
      { label: "Mouvement Stock Manuel", path: "/magasin/mouvement-de-stock-manuel", icon: RotateCcw },
      { label: "Emplacements WMS", path: "/magasin/wms-slots", icon: MapPin },
      { label: "Bandes de Livraison", path: "/magasin/bandes-livraison", icon: Layers },
      { label: "Log Transactions Stock", path: "/magasin/transactions", icon: Activity },
      { label: "Rapports & Stats WMS", path: "/magasin/rapports", icon: BarChart3 },
      { label: "Catalogue Articles", path: "/master-data/articles", icon: Package, badge: "Articles" },
    ]
  },

  finance: {
    key: "finance",
    title: "K-Finance & Comptabilité",
    path: "/finance/overview",
    icon: DollarSign,
    color: "#10b981",
    glow: "shadow-emerald-500/50 border-emerald-500/60",
    bgGradient: "from-emerald-600 to-teal-500",
    requiredRoles: ["ADMIN", "FINANCE", "MANAGER"],
    subModules: [
      { label: "Vue d'Ensemble Finance", path: "/finance/overview", icon: LayoutDashboard },
      { label: "Factures & Recettes", path: "/finance/factures", icon: FileText, badge: "Compta" },
      { label: "Gestion Encaissements", path: "/finance/encaissements", icon: DollarSign },
      { label: "Requisitions & Achats", path: "/finance/requisitions", icon: ShoppingCart },
      { label: "Saisie Transactions Bancaires", path: "/finance/saisie-transaction-bancaire", icon: CreditCard },
      { label: "Grilles Tarifaires", path: "/finance/tarifs", icon: Tag },
      { label: "Simulateur Cotations & Devis", path: "/cotations", icon: Tag, badge: "Fret" },
      { label: "Répertoire Tiers & Clients", path: "/master-data/tiers", icon: Users },
    ]
  },

  acconage: {
    key: "acconage",
    title: "K-Acconage & Quai",
    path: "/acconage",
    icon: Building,
    color: "#3b82f6",
    glow: "shadow-blue-500/50 border-blue-500/60",
    bgGradient: "from-blue-600 to-cyan-500",
    requiredRoles: ["ADMIN", "DISPATCHER", "ACCONAGE", "MANAGER"],
    subModules: [
      { label: "Dashboard Acconage", path: "/acconage", icon: LayoutDashboard },
      { label: "Manifestes de Quai", path: "/transport/goods-declaration", icon: FileText },
      { label: "Dossiers Transit Portuaire", path: "/transit", icon: Globe },
      { label: "Contrôle Porte Gate", path: "/parc/gate", icon: Navigation },
    ]
  },

  qhse: {
    key: "qhse",
    title: "K-QHSE & Sécurité",
    path: "/qhse",
    icon: ShieldAlert,
    color: "#ef4444",
    glow: "shadow-red-500/50 border-red-500/60",
    bgGradient: "from-red-600 to-rose-500",
    requiredRoles: ["ADMIN", "QHSE", "MANAGER"],
    subModules: [
      { label: "Inspections Portuaires QHSE", path: "/qhse", icon: ShieldAlert, badge: "Port" },
      { label: "Centre Incidents & Alertes", path: "/security/notifications", icon: Zap, badge: "Alertes" },
      { label: "Audit & Normes ISPS", path: "/compliance", icon: Landmark, badge: "Normes" },
      { label: "Rapports & Registres Sécurité", path: "/security/reports", icon: BookOpen },
    ]
  },

  transit: {
    key: "transit",
    title: "K-Transit & Douane",
    path: "/transit",
    icon: Globe,
    color: "#0284c7",
    glow: "shadow-sky-500/50 border-sky-500/60",
    bgGradient: "from-sky-600 to-blue-600",
    requiredRoles: ["ADMIN", "DOUANE", "TRANSIT", "MANAGER"],
    subModules: [
      { label: "Dossiers Transit CEMAC", path: "/transit", icon: Globe, badge: "CEMAC" },
      { label: "Gestion Acconage Port", path: "/acconage", icon: Building },
      { label: "Conformité Douanière", path: "/compliance", icon: Landmark },
      { label: "Déclarations Fret", path: "/transport/goods-declaration", icon: FileText },
    ]
  },

  maintenance: {
    key: "maintenance",
    title: "K-Maintenance & Atelier",
    path: "/maintenance",
    icon: Wrench,
    color: "#f97316",
    glow: "shadow-orange-500/50 border-orange-500/60",
    bgGradient: "from-orange-600 to-amber-500",
    requiredRoles: ["ADMIN", "MAINTENANCE", "PARC", "MANAGER"],
    subModules: [
      { label: "Ordres de Réparation Workshop", path: "/maintenance", icon: Wrench, badge: "Atelier" },
      { label: "Work Orders Parc", path: "/parc/work-orders", icon: ClipboardList },
      { label: "Télémétrie FuelGuard", path: "/fuel-guard", icon: Fuel },
      { label: "Pièces & Procurement PO", path: "/procurement", icon: ShoppingCart },
    ]
  },

  cotations: {
    key: "cotations",
    title: "K-Cotations & Devis",
    path: "/cotations",
    icon: Tag,
    color: "#eab308",
    glow: "shadow-yellow-500/50 border-yellow-500/60",
    bgGradient: "from-yellow-600 to-amber-500",
    requiredRoles: ["ADMIN", "FINANCE", "TRANSIT", "MANAGER"],
    subModules: [
      { label: "Simulateur Tarifs & Devis Fret", path: "/cotations", icon: Tag, badge: "Fret" },
      { label: "Commandes Procurement", path: "/procurement", icon: ShoppingCart },
      { label: "Répertoire Tiers", path: "/master-data/tiers", icon: Users },
    ]
  },

  tracking: {
    key: "tracking",
    title: "K-Tracking & e-POD",
    path: "/tracking",
    icon: Radio,
    color: "#06b6d4",
    glow: "shadow-cyan-500/50 border-cyan-500/60",
    bgGradient: "from-cyan-600 to-teal-500",
    requiredRoles: ["ADMIN", "DISPATCHER", "TRANSPORT", "MANAGER"],
    subModules: [
      { label: "Suivi des Expéditions e-POD", path: "/tracking", icon: Radio, badge: "Live" },
      { label: "Carte GPS Flotte Live", path: "/transport/carte-live", icon: MapPin },
      { label: "ChatOps Missions", path: "/transport/chatops", icon: Bot },
    ]
  },

  "fuel-guard": {
    key: "fuel-guard",
    title: "K-FuelGuard Télémétrie",
    path: "/fuel-guard",
    icon: Fuel,
    color: "#f97316",
    glow: "shadow-orange-500/50 border-orange-500/60",
    bgGradient: "from-orange-600 to-amber-600",
    requiredRoles: ["ADMIN", "PARC", "TRANSPORT", "MANAGER"],
    subModules: [
      { label: "Télémétrie Carburant Live", path: "/fuel-guard", icon: Fuel, badge: "Live" },
      { label: "Saisie Tickets Carburant", path: "/transport/saisie-ticket-carburant", icon: FileText },
      { label: "Flotte Camions", path: "/transport/flotte", icon: Truck },
    ]
  },

  procurement: {
    key: "procurement",
    title: "K-Procurement & Achats",
    path: "/procurement",
    icon: ShoppingCart,
    color: "#10b981",
    glow: "shadow-emerald-500/50 border-emerald-500/60",
    bgGradient: "from-emerald-600 to-green-500",
    requiredRoles: ["ADMIN", "FINANCE", "MAGASIN", "MANAGER"],
    subModules: [
      { label: "Achats & Requisitions PO", path: "/procurement", icon: ShoppingCart, badge: "PO" },
      { label: "Catalogue Fournisseurs", path: "/suppliers", icon: Building },
      { label: "Cotations Fret", path: "/cotations", icon: Tag },
    ]
  },

  compliance: {
    key: "compliance",
    title: "K-Compliance & Douane",
    path: "/compliance",
    icon: Landmark,
    color: "#14b8a6",
    glow: "shadow-teal-500/50 border-teal-500/60",
    bgGradient: "from-teal-600 to-emerald-500",
    requiredRoles: ["ADMIN", "DOUANE", "QHSE", "MANAGER"],
    subModules: [
      { label: "Compliance Douane & Normes", path: "/compliance", icon: Landmark, badge: "ISPS" },
      { label: "Centre Incidents & Sécurité", path: "/security/notifications", icon: Zap },
      { label: "Inspections Portuaires", path: "/qhse", icon: ShieldAlert },
    ]
  },

  bi: {
    key: "bi",
    title: "K-Analytics BI Executive",
    path: "/bi",
    icon: BarChart3,
    color: "#8b5cf6",
    glow: "shadow-violet-500/50 border-violet-500/60",
    bgGradient: "from-violet-600 to-purple-600",
    requiredRoles: ["ADMIN", "MANAGER", "AUDITOR"],
    subModules: [
      { label: "Tableau de Bord BI Executive", path: "/bi", icon: BarChart3, badge: "KPIs" },
      { label: "Journal d'Audit Système", path: "/admin/journal", icon: Activity },
      { label: "Statistiques WMS", path: "/magasin/dashboard", icon: LayoutDashboard },
      { label: "Statistiques Transport", path: "/transport/control", icon: Truck },
    ]
  },

  "master-data": {
    key: "master-data",
    title: "Données Maîtres ERP",
    path: "/master-data/tiers",
    icon: Users,
    color: "#ec4899",
    glow: "shadow-pink-500/50 border-pink-500/60",
    bgGradient: "from-pink-600 to-purple-600",
    requiredRoles: ["ADMIN", "MANAGER", "MAGASIN", "FINANCE"],
    subModules: [
      { label: "Répertoire Tiers & Clients", path: "/master-data/tiers", icon: Users, badge: "Tiers" },
      { label: "Catalogue Articles & Stock", path: "/master-data/articles", icon: Package, badge: "Articles" },
      { label: "Emplacements WMS", path: "/magasin/wms-slots", icon: MapPin },
    ]
  },

  rh: {
    key: "rh",
    title: "Ressources Humaines",
    path: "/rh/dashboard",
    icon: UserCheck,
    color: "#ec4899",
    glow: "shadow-pink-500/50 border-pink-500/60",
    bgGradient: "from-pink-600 to-rose-500",
    requiredRoles: ["ADMIN", "RH", "MANAGER"],
    subModules: [
      { label: "Dashboard Ressources Humaines", path: "/rh/dashboard", icon: LayoutDashboard, badge: "RH" },
      { label: "Mon Espace RH & Demandes", path: "/rh/mon-espace", icon: UserCheck },
      { label: "Gestion de la Paie", path: "/finance/payroll", icon: DollarSign, badge: "Paie" },
      { label: "Annuaire du Personnel", path: "/master-data/tiers", icon: Users },
      { label: "Affectation & Permis Chauffeurs", path: "/transport/drivers", icon: Truck, badge: "Flotte" },
    ]
  },

  "client-portal": {
    key: "client-portal",
    title: "Portail Client B2B",
    path: "/client-portal",
    icon: Globe,
    color: "#0284c7",
    glow: "shadow-sky-500/50 border-sky-500/60",
    bgGradient: "from-sky-600 to-indigo-600",
    requiredRoles: ["ADMIN", "CLIENT", "CLIENT_B2B", "MANAGER"],
    subModules: [
      { label: "Tableau de Bord Client B2B", path: "/client-portal", icon: LayoutDashboard },
      { label: "Suivi des Expéditions", path: "/tracking", icon: Radio },
      { label: "Documents & Factures Client", path: "/finance/factures", icon: FileText },
    ]
  },

  settings: {
    key: "settings",
    title: "Paramètres & Profil",
    path: "/settings",
    icon: Settings,
    color: "#64748b",
    glow: "shadow-slate-500/50 border-slate-500/60",
    bgGradient: "from-slate-600 to-slate-800",
    subModules: [
      { label: "Mon Profil Utilisateur", path: "/settings", icon: Settings },
      { label: "Paramètres de Sécurité & Thème", path: "/settings/system/audit-health", icon: ShieldAlert },
    ]
  }
};

/**
 * Fonction d'orchestration RBAC Senior
 * Filtre dynamiquement les modules et les sous-modules autorisés selon le profil utilisateur.
 */
export function getFilteredNavigationForUser(user: { roles?: string[]; modulesAllowed?: string[] } | null): ModuleNavConfig[] {
  if (!user) return Object.values(NAVIGATION_REGISTRY);

  const userRoles = (user.roles || []).map(r => r.toUpperCase());
  const isAdmin = userRoles.includes("ADMIN");
  const userModules = user.modulesAllowed || [];

  return Object.values(NAVIGATION_REGISTRY).map(moduleConfig => {
    // Si l'utilisateur est Admin, il a accès à tout
    if (isAdmin) return moduleConfig;

    // Vérifier si le module principal est autorisé
    const isModuleAllowed =
      moduleConfig.key === "dashboard" ||
      moduleConfig.key === "settings" ||
      userModules.includes(moduleConfig.key) ||
      (moduleConfig.requiredRoles && moduleConfig.requiredRoles.some(role => userRoles.includes(role)));

    if (!isModuleAllowed) return null;

    // Filtrer les sous-modules pour cet utilisateur métier
    const filteredSubModules = moduleConfig.subModules.filter(sub => {
      if (!sub.requiredRoles || sub.requiredRoles.length === 0) return true;
      return sub.requiredRoles.some(r => userRoles.includes(r.toUpperCase()));
    });

    return {
      ...moduleConfig,
      subModules: filteredSubModules
    };
  }).filter(Boolean) as ModuleNavConfig[];
}
