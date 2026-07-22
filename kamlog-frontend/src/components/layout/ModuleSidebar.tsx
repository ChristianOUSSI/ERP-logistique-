"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Truck,
  Package,
  DollarSign,
  Users,
  ShieldAlert,
  Settings,
  X,
  ChevronRight,
  Building,
  UserCheck,
  Globe,
  Tag,
  Radio,
  Fuel,
  ShoppingCart,
  Landmark,
  BarChart3,
  Lock,
  AlertTriangle
} from "lucide-react";

export type ModuleType =
  | "admin"
  | "master-data"
  | "transport"
  | "finance"
  | "magasin"
  | "parc"
  | "audit"
  | "dashboard"
  | "rh"
  | "acconage"
  | "qhse"
  | "transit"
  | "maintenance"
  | "client-portal"
  | "cotations"
  | "tracking"
  | "fuel-guard"
  | "procurement"
  | "compliance"
  | "bi"
  | "settings";

interface ModuleSidebarProps {
  isCollapsed?: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

export default function ModuleSidebar({
  isCollapsed = false,
  isMobile = false,
  isOpen = false,
  onClose,
}: ModuleSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Access Warning Modal State
  const [deniedModalItem, setDeniedModalItem] = useState<{ label: string; key: string } | null>(null);

  const userRoles: string[] = (session?.user as any)?.roles || [];
  const userModules: string[] = (session?.user as any)?.modules_allowed || [];
  const isAdmin = userRoles.some(r => r.toUpperCase() === "ADMIN");

  const navItems: { label: string; path: string; icon: any; key: ModuleType }[] = [
    { label: "Vue Globale", path: "/dashboard/global", icon: LayoutDashboard, key: "dashboard" },
    { label: "Administration ERP", path: "/admin", icon: ShieldAlert, key: "admin" },
    { label: "K-Transport", path: "/transport/control", icon: Truck, key: "transport" },
    { label: "K-Magasin", path: "/magasin/dashboard", icon: Package, key: "magasin" },
    { label: "K-Finance", path: "/finance/overview", icon: DollarSign, key: "finance" },
    { label: "K-Acconage", path: "/acconage", icon: Building, key: "acconage" },
    { label: "K-QHSE", path: "/qhse", icon: ShieldAlert, key: "qhse" },
    { label: "K-Transit", path: "/transit", icon: Globe, key: "transit" },
    { label: "K-Maintenance", path: "/maintenance", icon: Settings, key: "maintenance" },
    { label: "K-Cotation", path: "/cotations", icon: Tag, key: "cotations" },
    { label: "K-Tracking & e-POD", path: "/tracking", icon: Radio, key: "tracking" },
    { label: "K-FuelGuard", path: "/fuel-guard", icon: Fuel, key: "fuel-guard" },
    { label: "K-Procurement", path: "/procurement", icon: ShoppingCart, key: "procurement" },
    { label: "K-Compliance", path: "/compliance", icon: Landmark, key: "compliance" },
    { label: "K-Analytics BI", path: "/bi", icon: BarChart3, key: "bi" },
    { label: "Gestion des Tiers", path: "/master-data/tiers", icon: Users, key: "master-data" },
    { label: "Ressources Humaines", path: "/rh/dashboard", icon: UserCheck, key: "rh" },
    { label: "Portail Client B2B", path: "/client-portal", icon: Globe, key: "client-portal" },
    { label: "Paramètres & Profil", path: "/settings", icon: Settings, key: "settings" },
  ];

  const checkModuleAccess = (itemKey: ModuleType): boolean => {
    if (isAdmin) return true;
    if (itemKey === "dashboard" || itemKey === "settings") return true;
    if (userModules.includes(itemKey)) return true;
    return false;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 w-full select-none">
      {/* Header / Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center shadow-lg shadow-indigo-600/30">
            K
          </div>
          {!isCollapsed && (
            <div>
              <span className="font-black text-slate-100 tracking-wider text-sm block">KAMLOG ERP</span>
              <span className="text-[10px] text-slate-400 font-mono block">
                {isAdmin ? "Accès Admin Total" : `Profil : ${userRoles[0] || 'Utilisateur'}`}
              </span>
            </div>
          )}
        </div>

        {isMobile && (
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const isAllowed = checkModuleAccess(item.key);
          const Icon = item.icon;

          if (!isAllowed) {
            return (
              <div
                key={item.path}
                onClick={() => setDeniedModalItem({ label: item.label, key: item.key })}
                title={`Module ${item.label} non inclus dans votre profil. Cliquez pour voir les détails.`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold opacity-40 bg-slate-950/40 border border-slate-850 text-slate-500 cursor-not-allowed transition-all hover:opacity-65 hover:bg-slate-950/70"
              >
                <Icon className="w-5 h-5 shrink-0 text-slate-600" />
                {!isCollapsed && (
                  <span className="truncate flex-1 text-slate-500 line-through decoration-slate-600">{item.label}</span>
                )}
                {!isCollapsed && (
                  <Lock className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => isMobile && onClose && onClose()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} />
              {!isCollapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {!isCollapsed && isActive && (
                <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />
              )}
            </Link>
          );
        })}
      </div>

      {/* 🔒 Modale d'avertissement Module Non Autorisé */}
      {deniedModalItem && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-slate-100">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
                Accès Restreint CADC
              </span>
              <h3 className="text-lg font-black">Module Non Autorisé</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-950 p-3 rounded-2xl border border-slate-800">
                Accès restreint : Votre profil <b className="text-amber-400">[{userRoles.join(", ") || "Utilisateur"}]</b> n'est pas autorisé à accéder au module <b className="text-white">[{deniedModalItem.label}]</b>. Veuillez contacter l'Admin CADC.
              </p>
              <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl text-left text-xs font-mono text-slate-400 space-y-1">
                <div>• Code module : <span className="text-amber-400">{deniedModalItem.key}</span></div>
                <div>• Vos modules autorisés : <span className="text-slate-200">{userModules.length > 0 ? userModules.join(", ") : "Aucun"}</span></div>
              </div>
            </div>

            <button
              onClick={() => setDeniedModalItem(null)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-xl text-xs hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Compris / Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-y-0 left-0 z-[60] w-72 shadow-2xl">
        {sidebarContent}
      </div>
    );
  }

  return sidebarContent;
}
