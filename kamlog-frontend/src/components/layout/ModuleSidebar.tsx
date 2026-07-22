"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  BarChart3
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
  | "bi";

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

  const navItems = [
    { label: "Vue Globale", path: "/dashboard/global", icon: LayoutDashboard },
    { label: "Administration ERP", path: "/admin", icon: ShieldAlert },
    { label: "K-Transport", path: "/transport/control", icon: Truck },
    { label: "K-Magasin", path: "/magasin/dashboard", icon: Package },
    { label: "K-Finance", path: "/finance/overview", icon: DollarSign },
    { label: "K-Acconage", path: "/acconage", icon: Building },
    { label: "K-QHSE", path: "/qhse", icon: ShieldAlert },
    { label: "K-Transit", path: "/transit", icon: Globe },
    { label: "K-Maintenance", path: "/maintenance", icon: Settings },
    { label: "K-Cotation", path: "/cotations", icon: Tag },
    { label: "K-Tracking & e-POD", path: "/tracking", icon: Radio },
    { label: "K-FuelGuard", path: "/fuel-guard", icon: Fuel },
    { label: "K-Procurement", path: "/procurement", icon: ShoppingCart },
    { label: "K-Compliance", path: "/compliance", icon: Landmark },
    { label: "K-Analytics BI", path: "/bi", icon: BarChart3 },
    { label: "Gestion des Tiers", path: "/master-data/tiers", icon: Users },
    { label: "Ressources Humaines", path: "/rh/dashboard", icon: UserCheck },
    { label: "Portail Client B2B", path: "/client-portal", icon: Globe },
    { label: "Paramètres & Profil", path: "/settings", icon: Settings },
  ];

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
              <span className="text-[10px] text-slate-400 font-mono block">Enterprise v2.0</span>
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
          const Icon = item.icon;

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
