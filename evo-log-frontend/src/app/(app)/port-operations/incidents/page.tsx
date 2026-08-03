"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ArrowLeft,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Download,
  Plus,
  Printer,
  ShieldAlert,
  Clock,
  FileCheck
} from "lucide-react";

export default function IncidentsAndSOFPage() {
  const [activeTab, setActiveTab] = useState<"incidents" | "sof" | "epod">("incidents");
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  // Incidents state
  const [incidents, setIncidents] = useState([
    {
      id: "INC-PAD-2026-001",
      type: "CARGO_DAMAGE",
      desc: "Sacs de riz mouillés détectés au fond de la Cale #2 suite aux fortes pluies tropicales au Quai 15.",
      location: "QUAI-15 / Cale 2",
      affectedQty: "3.5 MT",
      estLoss: "1 050 000 XAF",
      severity: "MEDIUM",
      reportedBy: "Inspecteur Tally SMAP",
      resolved: false,
      photoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80"
    }
  ]);

  // Form State
  const [incForm, setIncForm] = useState({
    type: "CARGO_DAMAGE",
    desc: "Avarie sac mouillé lors du déchargement",
    location: "QUAI-15 / Cale 1",
    affectedQty: "1.2",
    estLoss: "360000",
    reportedBy: "Contrôleur QHSE SMAP"
  });

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const newInc = {
      id: `INC-PAD-2026-${String(incidents.length + 1).padStart(3, "0")}`,
      type: incForm.type,
      desc: incForm.desc,
      location: incForm.location,
      affectedQty: `${incForm.affectedQty} MT`,
      estLoss: `${parseFloat(incForm.estLoss).toLocaleString()} XAF`,
      severity: "MEDIUM",
      reportedBy: incForm.reportedBy,
      resolved: false,
      photoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80"
    };
    setIncidents([newInc, ...incidents]);
    setShowIncidentModal(false);
  };

  // Statement of Facts mockup
  const sofData = {
    vesselName: "M/V PACIFIC RICE",
    imoNumber: "IMO9876543",
    ref: "SOF-PAD-2026-088",
    master: "Capt. V. Ivanov",
    agent: "Consignataire SMAP Douala",
    berth: "QUAI-15 (PAD)",
    norTendered: "2026-08-02 14:00",
    norAccepted: "2026-08-02 16:00",
    laytimeCommenced: "2026-08-02 18:00",
    handledTonnage: 12850,
    totalTonnage: 25000,
    events: [
      { time: "2026-08-02 14:00", desc: "Arrivée Navire à la bouée de base RDR. NOR tendered." },
      { time: "2026-08-02 18:00", desc: "Accostage Quai 15 avec remorqueur RDR 'Le Wouri'. Laytime commenced." },
      { time: "2026-08-03 08:00", desc: "Début déchargement trémies Cales #1, #2, #3, #4." },
      { time: "2026-08-03 15:30", desc: "Arrêt Pluie Tropicale Forte. Fermeture des fermetures de cales (90 min downtime)." }
    ]
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
          <div className="p-2.5 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-400">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950 px-2 py-0.5 rounded-full border border-rose-800">
                Sub-Module E • Rose Theme
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Paperless Port Docs, Incidents & Statement of Facts (SOF)
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowIncidentModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold shadow-lg shadow-rose-600/20 hover:brightness-110"
        >
          <Plus className="w-4 h-4" />
          <span>Déclarer Litige / Constat</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("incidents")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === "incidents"
              ? "border-rose-500 text-rose-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Registres Avaries & Incidents Cales ({incidents.length})
        </button>
        <button
          onClick={() => setActiveTab("sof")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === "sof"
              ? "border-rose-500 text-rose-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Générateur Statement of Facts (SOF Official)
        </button>
        <button
          onClick={() => setActiveTab("epod")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === "epod"
              ? "border-rose-500 text-rose-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Bons de Livraison Numériques (e-POD Cryptographiques)
        </button>
      </div>

      {/* Tab 1: Incidents & Avaries */}
      {activeTab === "incidents" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span className="font-mono font-bold text-white">{inc.id}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {inc.type}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{inc.desc}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <div>Localisation: <strong className="text-white">{inc.location}</strong></div>
                  <div>Quantité Affectée: <strong className="text-rose-400 font-mono">{inc.affectedQty}</strong></div>
                  <div>Perte Estimée: <strong className="text-white font-mono">{inc.estLoss}</strong></div>
                  <div>Signalé par: <strong className="text-slate-200">{inc.reportedBy}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Statement of Facts (SOF) Generator */}
      {activeTab === "sof" && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-rose-400" />
                <span>Statement of Facts (SOF) Officiel - Calculations Surestaries / Laytime</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">Référence: {sofData.ref}</span>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:text-white">
                <Printer className="w-4 h-4" />
                Imprimer SOF
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500">
                <Download className="w-4 h-4" />
                Télécharger PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Navire & Capitaine</span>
              <div className="font-bold text-white text-sm">{sofData.vesselName}</div>
              <div className="text-[11px] text-slate-400">{sofData.master}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Notice of Readiness (NOR)</span>
              <div className="font-bold text-rose-400 font-mono">{sofData.norTendered}</div>
              <div className="text-[11px] text-slate-400">Acceptée: {sofData.norAccepted}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Tonnage Déchargé SOF</span>
              <div className="font-bold text-white text-sm font-mono">{sofData.handledTonnage.toLocaleString()} MT</div>
              <div className="text-[11px] text-slate-400">Sur Total {sofData.totalTonnage.toLocaleString()} MT</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200">Chronologie Officielle des Événements d'Escale</h3>
            <div className="space-y-2">
              {sofData.events.map((ev, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-rose-400 font-bold">{ev.time}</span>
                    <span className="text-slate-200">{ev.desc}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">SOF LOGGED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Incident */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Déclarer un Incident / Avarie Quai</h3>

            <form onSubmit={handleAddIncident} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Type de Litige</label>
                <select
                  value={incForm.type}
                  onChange={(e) => setIncForm({ ...incForm, type: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="CARGO_DAMAGE">Sacs Mouillés / Avarie Cargo</option>
                  <option value="SHORTAGE">Manquant / Sacs Déchirés</option>
                  <option value="EQUIPMENT_FAILURE">Panne Grue / Trémie</option>
                  <option value="WEATHER_DELAY">Arrêt Pluie Tropicale</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description de l'Incident</label>
                <textarea
                  value={incForm.desc}
                  onChange={(e) => setIncForm({ ...incForm, desc: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white h-20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Localisation Cale</label>
                  <input
                    type="text"
                    value={incForm.location}
                    onChange={(e) => setIncForm({ ...incForm, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Quantité Affectée (MT)</label>
                  <input
                    type="text"
                    value={incForm.affectedQty}
                    onChange={(e) => setIncForm({ ...incForm, affectedQty: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-500"
                >
                  Enregistrer Déclaration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
