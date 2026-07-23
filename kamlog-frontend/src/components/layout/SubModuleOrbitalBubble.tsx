"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Sparkles,
  X,
  Compass,
  Zap,
  Activity,
  Award,
  BookOpen
} from "lucide-react";

export interface SubModuleItem {
  label: string;
  path: string;
  icon: any;
  badge?: string;
  color?: string;
}

export interface ModuleOrbitConfig {
  key: string;
  title: string;
  icon: any;
  color: string; // Tailwind color class or hex
  glow: string;  // Glow class
  bgGradient: string;
  items: SubModuleItem[];
}

const MODULE_ORBITS: Record<string, ModuleOrbitConfig> = {
  magasin: {
    key: "magasin",
    title: "K-Magasin WMS",
    icon: Package,
    color: "#f59e0b",
    glow: "shadow-amber-500/50 border-amber-500/60",
    bgGradient: "from-amber-600 to-yellow-500",
    items: [
      { label: "Dashboard WMS", path: "/magasin/dashboard", icon: LayoutDashboard, badge: "Main" },
      { label: "Réception MAG3", path: "/magasin/reception-mag3", icon: Boxes, badge: "Mag3" },
      { label: "Bons d'Enlèvement (BL)", path: "/magasin/removal-slip", icon: FileText, badge: "BL" },
      { label: "Assistant IA Chat", path: "/magasin/ia-chat", icon: Bot, badge: "IA" },
      { label: "Saisie Inventaire", path: "/magasin/saisie-inventaire-physique", icon: ClipboardList },
      { label: "Ordres de Transfert", path: "/magasin/ordres-transfert", icon: ArrowRightLeft },
      { label: "Mouvement Stock Manuel", path: "/magasin/mouvement-de-stock-manuel", icon: RotateCcw },
      { label: "Emplacements WMS", path: "/magasin/wms-slots", icon: MapPin },
      { label: "Bandes Livraison", path: "/magasin/bandes-livraison", icon: Layers },
      { label: "Log Transactions", path: "/magasin/transactions", icon: Activity },
      { label: "Rapports WMS", path: "/magasin/rapports", icon: BarChart3 },
      { label: "Catalogue Articles", path: "/master-data/articles", icon: Package, badge: "Stock" },
    ]
  },
  transport: {
    key: "transport",
    title: "K-Transport & Flotte",
    icon: Truck,
    color: "#06b6d4",
    glow: "shadow-cyan-500/50 border-cyan-500/60",
    bgGradient: "from-cyan-600 to-blue-500",
    items: [
      { label: "Poste de Contrôle", path: "/transport/control", icon: LayoutDashboard, badge: "Live" },
      { label: "Missions & Dispatch", path: "/transport/dispatch", icon: Navigation, badge: "Planning" },
      { label: "Flotte Camions", path: "/transport/flotte", icon: Truck },
      { label: "Chauffeurs", path: "/transport/drivers", icon: Users },
      { label: "Tracking Live & POD", path: "/transport/epod", icon: Radio, badge: "e-POD" },
      { label: "Carte Live GPS", path: "/transport/carte-live", icon: MapPin },
      { label: "ChatOps Mission", path: "/transport/chatops", icon: Bot },
      { label: "Tickets Carburant", path: "/transport/saisie-ticket-carburant", icon: Fuel, badge: "Fuel" },
      { label: "Déclarations Fret", path: "/transport/goods-declaration", icon: FileCheck },
      { label: "Gestion Conteneurs", path: "/transport/containers", icon: Boxes },
    ]
  },
  finance: {
    key: "finance",
    title: "K-Finance & Devis",
    icon: DollarSign,
    color: "#10b981",
    glow: "shadow-emerald-500/50 border-emerald-500/60",
    bgGradient: "from-emerald-600 to-teal-500",
    items: [
      { label: "Vue d'ensemble", path: "/finance/overview", icon: LayoutDashboard },
      { label: "Factures & Recettes", path: "/finance/factures", icon: FileText, badge: "Compta" },
      { label: "Encaissements", path: "/finance/encaissements", icon: DollarSign },
      { label: "Requisitions Achats", path: "/finance/requisitions", icon: ShoppingCart },
      { label: "Transaction Bancaire", path: "/finance/saisie-transaction-bancaire", icon: Activity },
      { label: "Grille Tarifaire", path: "/finance/tarifs", icon: Tag },
      { label: "K-Cotations & Devis", path: "/cotations", icon: Tag, badge: "Fret" },
      { label: "Répertoire Tiers", path: "/master-data/tiers", icon: Users },
    ]
  },
  qhse: {
    key: "qhse",
    title: "K-QHSE & Sécurité",
    icon: ShieldAlert,
    color: "#ef4444",
    glow: "shadow-red-500/50 border-red-500/60",
    bgGradient: "from-red-600 to-rose-500",
    items: [
      { label: "Inspections QHSE", path: "/qhse", icon: ShieldAlert, badge: "Port" },
      { label: "Centre Incidents", path: "/security/notifications", icon: Zap, badge: "Alertes" },
      { label: "Audit & Compliance", path: "/compliance", icon: Landmark, badge: "Normes" },
      { label: "Rapports Sécurité", path: "/security/reports", icon: BookOpen },
    ]
  },
  parc: {
    key: "parc",
    title: "K-Parc & Gate",
    icon: Building,
    color: "#8b5cf6",
    glow: "shadow-purple-500/50 border-purple-500/60",
    bgGradient: "from-purple-600 to-indigo-500",
    items: [
      { label: "Accès Gate Porte", path: "/parc/gate", icon: Navigation, badge: "Gate" },
      { label: "Carte 3D du Parc", path: "/parc/yard-map", icon: MapPin },
      { label: "Zones de Stockage", path: "/parc/zones", icon: Boxes },
      { label: "Gestion Flotte", path: "/parc/gestion-de-la-flotte", icon: Truck },
      { label: "Work Orders Atelier", path: "/parc/work-orders", icon: Wrench },
    ]
  },
  admin: {
    key: "admin",
    title: "Administration ERP",
    icon: ShieldAlert,
    color: "#6366f1",
    glow: "shadow-indigo-500/50 border-indigo-500/60",
    bgGradient: "from-indigo-600 to-violet-600",
    items: [
      { label: "Utilisateurs & RBAC", path: "/admin", icon: Users, badge: "Admin" },
      { label: "Configuration Rôles", path: "/admin/configuration-des-roles-rbac", icon: ShieldAlert },
      { label: "Agences Portuaires", path: "/admin/agencies", icon: Building },
      { label: "Journal d'Audit", path: "/admin/journal", icon: Activity },
      { label: "Alertes Système", path: "/admin/alerts", icon: Zap },
      { label: "Paramètres Système", path: "/settings", icon: Settings },
    ]
  },
  acconage: {
    key: "acconage",
    title: "K-Acconage & Quai",
    icon: Building,
    color: "#3b82f6",
    glow: "shadow-blue-500/50 border-blue-500/60",
    bgGradient: "from-blue-600 to-cyan-500",
    items: [
      { label: "Dashboard Acconage", path: "/acconage", icon: LayoutDashboard },
      { label: "Manifestes Quai", path: "/transport/goods-declaration", icon: FileText },
      { label: "Dossiers Transit", path: "/transit", icon: Globe },
      { label: "Accès Porte Gate", path: "/parc/gate", icon: Navigation },
    ]
  },
  transit: {
    key: "transit",
    title: "K-Transit & Douane",
    icon: Globe,
    color: "#0284c7",
    glow: "shadow-sky-500/50 border-sky-500/60",
    bgGradient: "from-sky-600 to-blue-600",
    items: [
      { label: "Dossiers Transit", path: "/transit", icon: Globe, badge: "CEMAC" },
      { label: "Acconage Port", path: "/acconage", icon: Building },
      { label: "Compliance Douane", path: "/compliance", icon: Landmark },
      { label: "Déclarations Fret", path: "/transport/goods-declaration", icon: FileText },
    ]
  },
  maintenance: {
    key: "maintenance",
    title: "K-Maintenance",
    icon: Wrench,
    color: "#f97316",
    glow: "shadow-orange-500/50 border-orange-500/60",
    bgGradient: "from-orange-600 to-amber-500",
    items: [
      { label: "Ordres de Réparations", path: "/maintenance", icon: Wrench, badge: "Atelier" },
      { label: "Work Orders Parc", path: "/parc/work-orders", icon: ClipboardList },
      { label: "Télémétrie FuelGuard", path: "/fuel-guard", icon: Fuel },
      { label: "Pièces & Procurement", path: "/procurement", icon: ShoppingCart },
    ]
  },
  rh: {
    key: "rh",
    title: "Ressources Humaines",
    icon: UserCheck,
    color: "#ec4899",
    glow: "shadow-pink-500/50 border-pink-500/60",
    bgGradient: "from-pink-600 to-rose-500",
    items: [
      { label: "Dashboard RH", path: "/rh/dashboard", icon: LayoutDashboard },
      { label: "Mon Espace RH", path: "/rh/mon-espace", icon: UserCheck },
      { label: "Gestion Chauffeurs", path: "/transport/drivers", icon: Users },
    ]
  },
  cotations: {
    key: "cotations",
    title: "K-Cotations & Devis",
    icon: Tag,
    color: "#eab308",
    glow: "shadow-yellow-500/50 border-yellow-500/60",
    bgGradient: "from-yellow-600 to-amber-500",
    items: [
      { label: "Simulateur Devis", path: "/cotations", icon: Tag, badge: "Fret" },
      { label: "Commandes Procurement", path: "/procurement", icon: ShoppingCart },
      { label: "Répertoire Tiers", path: "/master-data/tiers", icon: Users },
    ]
  },
  "fuel-guard": {
    key: "fuel-guard",
    title: "K-FuelGuard",
    icon: Fuel,
    color: "#f97316",
    glow: "shadow-orange-500/50 border-orange-500/60",
    bgGradient: "from-orange-600 to-amber-600",
    items: [
      { label: "Télémétrie Carburant", path: "/fuel-guard", icon: Fuel, badge: "Live" },
      { label: "Tickets Carburant", path: "/transport/saisie-ticket-carburant", icon: FileText },
      { label: "Flotte Camions", path: "/transport/flotte", icon: Truck },
    ]
  },
  procurement: {
    key: "procurement",
    title: "K-Procurement",
    icon: ShoppingCart,
    color: "#10b981",
    glow: "shadow-emerald-500/50 border-emerald-500/60",
    bgGradient: "from-emerald-600 to-green-500",
    items: [
      { label: "Achats & Requisitions", path: "/procurement", icon: ShoppingCart, badge: "PO" },
      { label: "Catalogue Fournisseurs", path: "/suppliers", icon: Building },
      { label: "Cotations Fret", path: "/cotations", icon: Tag },
    ]
  },
  compliance: {
    key: "compliance",
    title: "K-Compliance",
    icon: Landmark,
    color: "#14b8a6",
    glow: "shadow-teal-500/50 border-teal-500/60",
    bgGradient: "from-teal-600 to-emerald-500",
    items: [
      { label: "Compliance & Douane", path: "/compliance", icon: Landmark, badge: "ISPS" },
      { label: "Centre Incidents", path: "/security/notifications", icon: Zap },
      { label: "Inspections Portuaires", path: "/qhse", icon: ShieldAlert },
    ]
  },
  bi: {
    key: "bi",
    title: "K-Analytics BI",
    icon: BarChart3,
    color: "#8b5cf6",
    glow: "shadow-violet-500/50 border-violet-500/60",
    bgGradient: "from-violet-600 to-purple-600",
    items: [
      { label: "Tableau BI Executive", path: "/bi", icon: BarChart3, badge: "KPIs" },
      { label: "Journal d'Audit", path: "/admin/journal", icon: Activity },
      { label: "Dashboard WMS", path: "/magasin/dashboard", icon: LayoutDashboard },
      { label: "Poste de Contrôle", path: "/transport/control", icon: Truck },
    ]
  },
  "master-data": {
    key: "master-data",
    title: "Données Maîtres",
    icon: Users,
    color: "#ec4899",
    glow: "shadow-pink-500/50 border-pink-500/60",
    bgGradient: "from-pink-600 to-purple-600",
    items: [
      { label: "Répertoire Tiers", path: "/master-data/tiers", icon: Users, badge: "Tiers" },
      { label: "Catalogue Articles", path: "/master-data/articles", icon: Package, badge: "Articles" },
      { label: "Emplacements WMS", path: "/magasin/wms-slots", icon: MapPin },
    ]
  },
  dashboard: {
    key: "dashboard",
    title: "ERP Vue Globale",
    icon: Compass,
    color: "#6366f1",
    glow: "shadow-indigo-500/50 border-indigo-500/60",
    bgGradient: "from-indigo-600 to-blue-600",
    items: [
      { label: "K-Magasin WMS", path: "/magasin/dashboard", icon: Package, badge: "WMS" },
      { label: "K-Transport", path: "/transport/control", icon: Truck, badge: "Flotte" },
      { label: "K-Finance", path: "/finance/overview", icon: DollarSign, badge: "Compta" },
      { label: "K-QHSE", path: "/qhse", icon: ShieldAlert, badge: "Port" },
      { label: "K-Parc Gate", path: "/parc/gate", icon: Building, badge: "Gate" },
      { label: "K-Acconage", path: "/acconage", icon: Building, badge: "Quai" },
      { label: "K-Transit", path: "/transit", icon: Globe, badge: "Douane" },
      { label: "K-Maintenance", path: "/maintenance", icon: Wrench, badge: "Atelier" },
      { label: "Ressources Humaines", path: "/rh/dashboard", icon: UserCheck, badge: "RH" },
      { label: "Administration", path: "/admin", icon: Settings, badge: "Admin" },
    ]
  }
};

export default function SubModuleOrbitalBubble() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 180 }); // Distance relative du bord droit
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({ startX: 0, startY: 0, posX: 0, posY: 0 });

  // Résolution du module actif à partir du pathname
  let activeModuleKey = Object.keys(MODULE_ORBITS).find(k => k !== "dashboard" && pathname.startsWith(`/${k}`));
  if (!activeModuleKey) {
    if (pathname.startsWith('/dashboard') || pathname === '/') {
      activeModuleKey = "dashboard";
    } else if (pathname.startsWith('/master-data') || pathname.startsWith('/suppliers') || pathname.startsWith('/tiers')) {
      activeModuleKey = "master-data";
    } else if (pathname.startsWith('/security')) {
      activeModuleKey = "qhse";
    } else {
      activeModuleKey = "magasin";
    }
  }
  const activeOrbit = MODULE_ORBITS[activeModuleKey] || MODULE_ORBITS.magasin;

  // Gestion du Dragging (Souris & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(false);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = dragStartRef.current.startX - moveEvent.clientX;
      const deltaY = moveEvent.clientY - dragStartRef.current.startY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        setIsDragging(true);
      }
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 70, dragStartRef.current.posX + deltaX)),
        y: Math.max(80, Math.min(window.innerHeight - 80, dragStartRef.current.posY + deltaY))
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      posX: position.x,
      posY: position.y
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      const deltaX = dragStartRef.current.startX - moveTouch.clientX;
      const deltaY = moveTouch.clientY - dragStartRef.current.startY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        setIsDragging(true);
      }
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 70, dragStartRef.current.posX + deltaX)),
        y: Math.max(80, Math.min(window.innerHeight - 80, dragStartRef.current.posY + deltaY))
      });
    };

    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  const MainIcon = activeOrbit.icon;
  const itemsCount = activeOrbit.items.length;
  const orbitRadius = typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 200;

  return (
    <>
      {/* --- Bulle Flottante Déplaçable (Bord Droit) --- */}
      <div
        style={{ right: `${position.x}px`, top: `${position.y}px` }}
        className="fixed z-[85] select-none cursor-grab active:cursor-grabbing transition-transform duration-100"
      >
        <button
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={() => {
            if (!isDragging) {
              setIsOpen(!isOpen);
            }
          }}
          className={`relative group w-14 h-14 rounded-full bg-slate-900 border-2 flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${activeOrbit.glow}`}
          style={{ borderColor: activeOrbit.color }}
          title={`Ouvrir les sous-modules de ${activeOrbit.title}`}
        >
          {/* Glowing Aura Effect */}
          <div
            className={`absolute inset-0 rounded-full blur-md opacity-60 animate-pulse bg-gradient-to-tr ${activeOrbit.bgGradient}`}
          />

          {/* Icon and Badge */}
          <div className={`relative w-11 h-11 rounded-full bg-gradient-to-tr ${activeOrbit.bgGradient} flex items-center justify-center text-white shadow-inner`}>
            {isOpen ? <X className="w-6 h-6 animate-in spin-in-90 duration-200" /> : <MainIcon className="w-6 h-6" />}
          </div>

          {/* Sub-module Count Badge */}
          <span className="absolute -top-1 -right-1 bg-slate-950 text-amber-400 font-black text-[10px] px-2 py-0.5 rounded-full border border-amber-500/50 shadow-md">
            {itemsCount}
          </span>
        </button>
      </div>

      {/* --- Overlay Modal Orbitale avec Animation 3D --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[90] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop Click Closes */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* Central Radial Container */}
          <div className="relative w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] flex items-center justify-center pointer-events-none">
            {/* Pulsating Orbital Ring */}
            <div className="absolute w-[300px] h-[300px] sm:w-[410px] sm:h-[410px] rounded-full border-2 border-dashed border-indigo-500/40 animate-spin-slow" />

            {/* Central Module Sphere */}
            <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-900 border-4 flex flex-col items-center justify-center p-2 text-center shadow-2xl pointer-events-auto cursor-pointer group hover:scale-105 transition-all"
                 style={{ borderColor: activeOrbit.color }}
                 onClick={() => setIsOpen(false)}>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${activeOrbit.bgGradient} text-white flex items-center justify-center shadow-lg mb-1`}>
                <MainIcon className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black text-slate-100 truncate w-full px-1">{activeOrbit.title}</span>
              <span className="text-[9px] text-amber-400 font-bold">Cliquer pour fermer</span>
            </div>

            {/* Orbiting Sub-Module Items */}
            {activeOrbit.items.map((item, index) => {
              const angle = (index / itemsCount) * 2 * Math.PI - Math.PI / 2;
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;
              const ItemIcon = item.icon;
              const isActiveRoute = pathname === item.path;

              return (
                <div
                  key={item.path}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    transitionDelay: `${index * 35}ms`
                  }}
                  className="absolute pointer-events-auto animate-in zoom-in-50 duration-300"
                >
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push(item.path);
                    }}
                    className={`group relative flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/90 border transition-all duration-300 hover:scale-125 hover:z-30 hover:bg-slate-800 ${
                      isActiveRoute
                        ? "border-amber-400 text-amber-400 shadow-xl shadow-amber-500/40 scale-110"
                        : "border-slate-700/80 text-slate-200 hover:border-indigo-400 shadow-lg"
                    }`}
                  >
                    <ItemIcon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12" />

                    {/* Tooltip Label on Hover */}
                    <div className="absolute -bottom-8 whitespace-nowrap bg-slate-950 text-slate-100 font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-xl border border-slate-800 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {item.label}
                    </div>

                    {/* Optional Badge */}
                    {item.badge && (
                      <span className="absolute -top-2 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full border border-amber-300 shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
