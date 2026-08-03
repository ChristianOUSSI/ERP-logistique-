"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Anchor,
  Ship,
  Scale,
  Truck,
  FileText,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Boxes,
  Users,
  Shield,
  RefreshCw,
  Plus
} from "lucide-react";

export default function PortOperationsMainDashboard() {
  const [loading, setLoading] = useState(false);

  // Mock initial state for live quayside control tower
  const [stats, setStats] = useState({
    vesselName: "M/V PACIFIC RICE",
    imoNumber: "IMO9876543",
    berthAssigned: "QUAI-15 (PAD)",
    totalTonnage: 25000,
    handledTonnage: 12850,
    completionPercentage: 51.4,
    dischargeRateMtHr: 342.5,
    targetRateMtHr: 350.0,
    activeHolds: 4,
    activeGangs: 4,
    activeHoppers: 2,
    weightVarianceTonnes: -15.4,
    shrinkagePercentage: 0.12,
    discrepancyAlert: false,
    avgTatMinutes: 28.5,
    trucksProcessed: 418,
    activeIncidents: 1
  });

  const subModules = [
    {
      id: "consignment",
      title: "Consignation & Husbandry",
      subtitle: "Escales, Accostage, Services RDR & Passes DPS",
      path: "/port-operations/vessel-consignment",
      icon: Ship,
      colorHex: "#2563eb",
      badge: "Sub-Module A",
      gradient: "from-blue-600 to-indigo-600",
      borderGlow: "border-blue-500/30 hover:border-blue-500/60 shadow-blue-500/10",
      statLabel: "Agent Consignataire",
      statValue: "Consignataire SMAP"
    },
    {
      id: "stevedoring",
      title: "Manutention & Opérations Cales",
      subtitle: "Déchargement Cales, Trémies, Docks UEMC & Rendement",
      path: "/port-operations/stevedoring",
      icon: Anchor,
      colorHex: "#f59e0b",
      badge: "Sub-Module B",
      gradient: "from-amber-600 to-orange-600",
      borderGlow: "border-amber-500/30 hover:border-amber-500/60 shadow-amber-500/10",
      statLabel: "Cadence Déchargement",
      statValue: `${stats.dischargeRateMtHr} MT/h`
    },
    {
      id: "weighbridge",
      title: "Pont-Bascule DPWS & Pointage",
      subtitle: "Capture Poids Brut/Tare/Net, Écarts & Pointage Mobile",
      path: "/port-operations/weighbridge",
      icon: Scale,
      colorHex: "#10b981",
      badge: "Sub-Module C",
      gradient: "from-emerald-600 to-teal-600",
      borderGlow: "border-emerald-500/30 hover:border-emerald-500/60 shadow-emerald-500/10",
      statLabel: "Camions Pesés",
      statValue: `${stats.trucksProcessed} Tickets`
    },
    {
      id: "drayage",
      title: "Camionnage Quai & File d'Attente",
      subtitle: "Rotation Camions, Chrono TAT & Fluidité Portuaire",
      path: "/port-operations/drayage",
      icon: Truck,
      colorHex: "#8b5cf6",
      badge: "Sub-Module D",
      gradient: "from-purple-600 to-indigo-600",
      borderGlow: "border-purple-500/30 hover:border-purple-500/60 shadow-purple-500/10",
      statLabel: "Temps Moyen TAT",
      statValue: `${stats.avgTatMinutes} min`
    },
    {
      id: "incidents",
      title: "Paperless Docs, SOF & Litiges",
      subtitle: "e-POD, Constats d'Avarie & Statement of Facts",
      path: "/port-operations/incidents",
      icon: FileText,
      colorHex: "#e11d48",
      badge: "Sub-Module E",
      gradient: "from-rose-600 to-red-600",
      borderGlow: "border-rose-500/30 hover:border-rose-500/60 shadow-rose-500/10",
      statLabel: "Incidents Actifs",
      statValue: `${stats.activeIncidents} Logged`
    }
  ];

  return (
    <div className="p-6 space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400">
              <Anchor className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800">
                  PAD Douala Operations
                </span>
                <span className="text-xs text-slate-400 font-mono">SMAP S.A Bulk Module</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                Port-Stevedoring & Vessel Operations
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLoading(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Actualiser Live</span>
          </button>

          <Link
            href="/port-operations/vessel-consignment"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 text-white font-bold shadow-lg shadow-cyan-600/20 hover:brightness-110 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Escale Navire</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Cards Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Vessel Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Navire en Déchargement</span>
            <Ship className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{stats.vesselName}</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">{stats.imoNumber} • {stats.berthAssigned}</div>
          </div>
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Progression Déchargement</span>
              <span className="font-bold text-cyan-400">{stats.completionPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${stats.completionPercentage}%` }}></div>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              {stats.handledTonnage.toLocaleString()} MT / {stats.totalTonnage.toLocaleString()} MT
            </div>
          </div>
        </div>

        {/* Discharge Rate Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/40 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Cadence Quai (MT/h)</span>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-3xl font-black text-amber-400">{stats.dischargeRateMtHr} <span className="text-sm font-normal text-slate-400">MT/h</span></div>
            <div className="text-xs text-slate-400 mt-0.5">Objectif Trémies : {stats.targetRateMtHr} MT/h</div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Cales Actives : <strong className="text-white">{stats.activeHolds}</strong></span>
            <span className="text-slate-400">Docks UEMC : <strong className="text-white">{stats.activeGangs} gangs</strong></span>
          </div>
        </div>

        {/* DPWS Weighbridge & Discrepancy Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pont-Bascule DPWS</span>
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400">{stats.trucksProcessed} <span className="text-sm font-normal text-slate-400">Camions</span></div>
            <div className="text-xs text-slate-400 mt-0.5">Écart Manifeste : <span className="text-emerald-300 font-bold">{stats.weightVarianceTonnes} MT</span> ({stats.shrinkagePercentage}%)</div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Conforme au seuil tolérance 0.5%</span>
          </div>
        </div>

        {/* Drayage Queue & TAT Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/40 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Chrono TAT Portuaire</span>
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-3xl font-black text-purple-400">{stats.avgTatMinutes} <span className="text-sm font-normal text-slate-400">Min</span></div>
            <div className="text-xs text-slate-400 mt-0.5">Moyenne Gate-In vers Gate-Out</div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Trémies Quai 15 : <strong className="text-white">Fluidité Forte</strong></span>
          </div>
        </div>
      </div>

      {/* 5 Core Sub-Modules Section Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Sous-Modules Intégrés</span>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">5 Modules</span>
          </h2>
          <span className="text-xs text-slate-400">Palette Couleurs Métiers & RBAC Inclus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subModules.map((sm) => {
            const IconComponent = sm.icon;
            return (
              <Link
                key={sm.id}
                href={sm.path}
                className={`group p-6 rounded-2xl bg-slate-900/80 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${sm.borderGlow}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${sm.gradient} text-white shadow-md shadow-black/40`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                    {sm.badge}
                  </span>
                </div>

                <div className="mt-5 space-y-1">
                  <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition">
                    {sm.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {sm.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">{sm.statLabel}</span>
                    <span className="text-slate-200 font-bold font-mono">{sm.statValue}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-slate-400 group-hover:text-white transition">
                    <span>Accéder</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
