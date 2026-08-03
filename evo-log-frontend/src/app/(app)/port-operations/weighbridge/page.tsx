"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scale,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  Search,
  Filter,
  Smartphone,
  Truck,
  Zap,
  TrendingDown
} from "lucide-react";

export default function WeighbridgeTallyingPage() {
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [showTallyModal, setShowTallyModal] = useState(false);

  // Weighbridge tickets state
  const [tickets, setTickets] = useState([
    {
      id: "DPWS-2026-8801",
      plate: "LT-8490-AB",
      grossKg: 44800,
      tareKg: 14800,
      netKg: 30000,
      manifestedKg: 30000,
      variancePct: 0.0,
      isDisputed: false,
      weighmaster: "Inspecteur DPWS Gate 3",
      time: "2026-08-04 05:30"
    },
    {
      id: "DPWS-2026-8802",
      plate: "LT-9921-BA",
      grossKg: 46200,
      tareKg: 15100,
      netKg: 31100,
      manifestedKg: 31000,
      variancePct: 0.32,
      isDisputed: false,
      weighmaster: "Inspecteur DPWS Gate 3",
      time: "2026-08-04 05:15"
    },
    {
      id: "DPWS-2026-8803",
      plate: "LT-7712-CC",
      grossKg: 48500,
      tareKg: 15000,
      netKg: 33500,
      manifestedKg: 31000, // Discrepancy > 0.5% (2.5T / 8.06% diff!)
      variancePct: 8.06,
      isDisputed: true,
      weighmaster: "Inspecteur DPWS Gate 3",
      time: "2026-08-04 04:50"
    }
  ]);

  // Capture Form State
  const [form, setForm] = useState({
    plate: "LT-5511-DD",
    grossKg: "45000",
    tareKg: "15000",
    manifestedKg: "30000",
    weighmaster: "Agent DPWS scale #2"
  });

  // Mobile Tally Sheets state
  const [tallySheets, setTallySheets] = useState([
    {
      id: "TALLY-2026-041",
      tallier: "Pointeur Mvogo",
      plate: "LT-8490-AB",
      cargo: "Riz Vrac 5%",
      bagsEst: "600 SACS",
      hopper: "Trémie #1",
      status: "DISPATCHED_TO_SCALE",
      time: "05:10"
    },
    {
      id: "TALLY-2026-042",
      tallier: "Pointeur Bikoko",
      plate: "LT-9921-BA",
      cargo: "Riz Vrac 5%",
      bagsEst: "620 SACS",
      hopper: "Trémie #2",
      status: "DISPATCHED_TO_SCALE",
      time: "05:25"
    }
  ]);

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gross = parseFloat(form.grossKg) || 0;
    const tare = parseFloat(form.tareKg) || 0;
    const net = gross - tare;
    const manifest = parseFloat(form.manifestedKg) || net;
    const varPct = Math.abs(((net - manifest) / (manifest || 1)) * 100);
    const isDisp = varPct > 0.5;

    const newTicket = {
      id: `DPWS-2026-${Math.floor(8800 + Math.random() * 1000)}`,
      plate: form.plate,
      grossKg: gross,
      tareKg: tare,
      netKg: net,
      manifestedKg: manifest,
      variancePct: parseFloat(varPct.toFixed(2)),
      isDisputed: isDisp,
      weighmaster: form.weighmaster,
      time: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    setTickets([newTicket, ...tickets]);
    setShowCaptureModal(false);
  };

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
          <div className="p-2.5 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                Sub-Module C • Emerald Theme
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Port Weighbridge & Tallying Automation (DPWS Scales)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTallyModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Fiche Pointage Mobile</span>
          </button>
          <button
            onClick={() => setShowCaptureModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg shadow-emerald-600/20 hover:brightness-110"
          >
            <Plus className="w-4 h-4" />
            <span>Saisir Ticket Bascule</span>
          </button>
        </div>
      </div>

      {/* Discrepancy KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Tolérance Écart Tolérée</span>
          <div className="text-2xl font-black text-emerald-400">0.50 % Max</div>
          <span className="text-[11px] text-slate-500">Formule : (Manifesté - Net) / Manifesté</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Litiges Écart Détectés</span>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {tickets.filter((t) => t.isDisputed).length} Tickets Flagged
          </div>
          <span className="text-[11px] text-slate-500">Bascule DPWS Gate 3</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Tonnage Total Net Pesé</span>
          <div className="text-2xl font-black text-white font-mono">
            {(tickets.reduce((acc, t) => acc + t.netKg, 0) / 1000).toFixed(1)} MT
          </div>
          <span className="text-[11px] text-slate-500">M/V PACIFIC RICE</span>
        </div>
      </div>

      {/* DPWS Scale Tickets Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <span>Tickets de Pesée Pont-Bascule DPWS en Temps Réel</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">{tickets.length} enregistrements</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">N° Ticket DPWS</th>
                <th className="p-3">Plaque Camion</th>
                <th className="p-3">Poids Brut (Brut)</th>
                <th className="p-3">Tare (Vide)</th>
                <th className="p-3">Poids Net</th>
                <th className="p-3">Écart Manifesté</th>
                <th className="p-3">Statut Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-emerald-400">{t.id}</td>
                  <td className="p-3 font-mono font-bold text-white">{t.plate}</td>
                  <td className="p-3 font-mono">{(t.grossKg / 1000).toFixed(2)} MT</td>
                  <td className="p-3 font-mono text-slate-400">{(t.tareKg / 1000).toFixed(2)} MT</td>
                  <td className="p-3 font-mono font-bold text-white text-sm font-mono">
                    {(t.netKg / 1000).toFixed(2)} MT
                  </td>
                  <td className="p-3 font-mono">
                    <span className={t.variancePct > 0.5 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                      {t.variancePct}%
                    </span>
                  </td>
                  <td className="p-3">
                    {t.isDisputed ? (
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        ÉCART &gt; 0.5% (DISPUTÉ)
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        CONFORME
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quayside Tally Sheet Mobile Logs */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <span>Pointage Quai Mobile (Dispatch vers Pont-Bascule)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tallySheets.map((ts) => (
            <div key={ts.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-emerald-400">{ts.id}</span>
                <span className="text-[10px] text-slate-400">{ts.time}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>Pointeur: <strong className="text-white">{ts.tallier}</strong></div>
                <div>Camion: <strong className="text-white font-mono">{ts.plate}</strong></div>
                <div>Trémie / Crane: <span className="text-slate-300">{ts.hopper}</span></div>
                <div>Estimé: <span className="text-emerald-300 font-bold">{ts.bagsEst}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scale Capture Modal */}
      {showCaptureModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Capture Pont-Bascule DPWS</h3>

            <form onSubmit={handleCaptureSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Plaque Camion</label>
                <input
                  type="text"
                  value={form.plate}
                  onChange={(e) => setForm({ ...form, plate: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Poids Brut (kg)</label>
                  <input
                    type="number"
                    value={form.grossKg}
                    onChange={(e) => setForm({ ...form, grossKg: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tare (kg)</label>
                  <input
                    type="number"
                    value={form.tareKg}
                    onChange={(e) => setForm({ ...form, tareKg: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Poids Manifesté Inclus (kg)</label>
                <input
                  type="number"
                  value={form.manifestedKg}
                  onChange={(e) => setForm({ ...form, manifestedKg: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCaptureModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500"
                >
                  Enregistrer Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
