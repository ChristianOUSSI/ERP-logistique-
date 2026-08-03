"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Play,
  TrendingUp,
  MapPin,
  RefreshCw,
  Navigation
} from "lucide-react";

export default function DrayageQueuePage() {
  const [rotations, setRotations] = useState([
    {
      id: "ROT-2026-001",
      plate: "LT-8490-AB",
      driver: "Kamga Jean",
      origin: "Quai 15 Hopper #1",
      destination: "Entrepôt SAKAP MAG3",
      qtyTonnes: 30.0,
      gateIn: "05:02",
      loadingComplete: "05:18",
      gateOut: "05:30",
      tatMinutes: 28,
      status: "DELIVERED"
    },
    {
      id: "ROT-2026-002",
      plate: "LT-9921-BA",
      driver: "Chauffeur Njoya",
      origin: "Quai 15 Hopper #2",
      destination: "Usine ETG Bonabéri",
      qtyTonnes: 31.1,
      gateIn: "05:10",
      loadingComplete: "05:30",
      gateOut: "05:45",
      tatMinutes: 35,
      status: "DELIVERED"
    },
    {
      id: "ROT-2026-003",
      plate: "LT-7712-CC",
      driver: "Paul Mbida",
      origin: "Quai 15 Hopper #1",
      destination: "Entrepôt MID GULF",
      qtyTonnes: 33.5,
      gateIn: "05:35",
      loadingComplete: "In Progress",
      gateOut: "Pending",
      tatMinutes: 18,
      status: "LOADING_AT_QUAY"
    }
  ]);

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/port-operations"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-800">
                Sub-Module D • Electric Purple Theme
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Quay Drayage & Fleet Queue Management (Chrono TAT)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Temps Moyen TAT:</span>
          <strong className="text-purple-400 font-mono text-base">28.5 Min</strong>
        </div>
      </div>

      {/* TAT Metric Bottleneck Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Gate-In → Chargement Quai</span>
          <div className="text-2xl font-black text-white font-mono">8.2 Min</div>
          <span className="text-[11px] text-emerald-400">Fluidité Optimale</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Chargement sous Trémie</span>
          <div className="text-2xl font-black text-purple-400 font-mono">14.5 Min</div>
          <span className="text-[11px] text-slate-400">Débit : 342.5 MT/h</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Pesée Bascule DPWS</span>
          <div className="text-2xl font-black text-white font-mono">4.1 Min</div>
          <span className="text-[11px] text-emerald-400">Sans Attente</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Sortie Porte Port (Gate-Out)</span>
          <div className="text-2xl font-black text-white font-mono">2.7 Min</div>
          <span className="text-[11px] text-slate-400">Passes DPS Validées</span>
        </div>
      </div>

      {/* Drayage Rotations Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-purple-400" />
            <span>Rotations Camions Quai-Vers-Entrepôts Client en Direct</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">{rotations.length} Rotations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">N° Rotation</th>
                <th className="p-3">Camion & Chauffeur</th>
                <th className="p-3">Origine Hopper</th>
                <th className="p-3">Destination Entrepôt</th>
                <th className="p-3">Charge MT</th>
                <th className="p-3">Gate-In / Out</th>
                <th className="p-3">Total TAT</th>
                <th className="p-3">Statut Process</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rotations.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-purple-400">{r.id}</td>
                  <td className="p-3">
                    <div className="font-bold text-white font-mono">{r.plate}</div>
                    <div className="text-[10px] text-slate-400">{r.driver}</div>
                  </td>
                  <td className="p-3 font-medium text-slate-200">{r.origin}</td>
                  <td className="p-3 font-medium text-slate-200">{r.destination}</td>
                  <td className="p-3 font-mono font-bold text-purple-300">{r.qtyTonnes} MT</td>
                  <td className="p-3 font-mono text-[11px]">
                    <div>In: {r.gateIn}</div>
                    <div className="text-slate-400">Out: {r.gateOut}</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-white text-sm">
                    {r.tatMinutes} Min
                  </td>
                  <td className="p-3">
                    {r.status === "DELIVERED" ? (
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        LIVRÉ / EXIT
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 w-fit animate-pulse">
                        CHARGEMENT QUAI
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
