"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ship,
  CheckCircle2,
  Clock,
  Shield,
  Anchor,
  FileText,
  Plus,
  Search,
  ArrowLeft,
  ChevronRight,
  UserCheck,
  Building,
  AlertCircle
} from "lucide-react";

export default function VesselConsignmentPage() {
  const [activeTab, setActiveTab] = useState<"calls" | "husbandry" | "dps_passes">("calls");
  const [searchTerm, setSearchTerm] = useState("");
  const [showGatePassModal, setShowGatePassModal] = useState(false);

  // Form State for DPS Gate Pass
  const [passForm, setPassForm] = useState({
    applicantName: "SMAP Ops Douala",
    entityName: "Transporteur CADC",
    purpose: "Évacuation Riz Vrac Quai 15",
    vehiclePlate: "LT-8490-AB",
    driverName: "Kamga Jean",
    driverId: "NIN-2026-88"
  });

  const [gatePasses, setGatePasses] = useState([
    {
      id: "DPS-PASS-2026-001",
      plate: "LT-8490-AB",
      driver: "Kamga Jean",
      entity: "Transporteur CADC",
      purpose: "Évacuation Riz Vrac",
      status: "APPROVED",
      ref: "DPS-AUT-9912",
      validity: "2026-08-04 18:00"
    },
    {
      id: "DPS-PASS-2026-002",
      plate: "LT-9921-BA",
      driver: "Chauffeur Njoya",
      entity: "Logistique ETG",
      purpose: "Transfert Usine Bonabéri",
      status: "APPROVED",
      ref: "DPS-AUT-9913",
      validity: "2026-08-04 18:00"
    }
  ]);

  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    const newPass = {
      id: `DPS-PASS-2026-${String(gatePasses.length + 1).padStart(3, "0")}`,
      plate: passForm.vehiclePlate,
      driver: passForm.driverName,
      entity: passForm.entityName,
      purpose: passForm.purpose,
      status: "APPROVED",
      ref: `DPS-AUT-${Math.floor(1000 + Math.random() * 9000)}`,
      validity: "2026-08-05 18:00"
    };
    setGatePasses([newPass, ...gatePasses]);
    setShowGatePassModal(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/port-operations"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="p-2.5 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
            <Ship className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded-full border border-blue-800">
                Sub-Module A • Sapphire Theme
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Vessel Consignment & Husbandry Management
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowGatePassModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Créer Pass Porte DPS</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("calls")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === "calls"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Escales & Suivi Navires (Calls)
        </button>
        <button
          onClick={() => setActiveTab("husbandry")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === "husbandry"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Workflows RDR & PAD Berth Application
        </button>
        <button
          onClick={() => setActiveTab("dps_passes")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === "dps_passes"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Passes Porte DPS (Accès Sécurisé)
        </button>
      </div>

      {/* Tab Content 1: Vessel Calls */}
      {activeTab === "calls" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Ship className="w-5 h-5 text-blue-400" />
                <span>Navires en Escale au Port Autonome de Douala</span>
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Rechercher navire, IMO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Navire & IMO</th>
                    <th className="p-3">Consignataire</th>
                    <th className="p-3">Quai Assigned</th>
                    <th className="p-3">Cargaison</th>
                    <th className="p-3">Tonnage</th>
                    <th className="p-3">ETA / ETD</th>
                    <th className="p-3">Statut Escale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">
                      M/V PACIFIC RICE
                      <span className="block text-[10px] font-mono text-slate-400">IMO 9876543 • Pavillon Panama</span>
                    </td>
                    <td className="p-3">Consignataire SMAP Douala</td>
                    <td className="p-3 font-mono font-bold text-blue-400">QUAI-15 (PAD)</td>
                    <td className="p-3">Bulk White Rice 5%</td>
                    <td className="p-3 font-mono">25,000 MT</td>
                    <td className="p-3 font-mono text-[11px]">
                      <div>ETA: 2026-08-02</div>
                      <div className="text-slate-400">ETD: 2026-08-07</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        WORKING / EN DÉCHARGEMENT
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">
                      M/V GRAIN LEADER
                      <span className="block text-[10px] font-mono text-slate-400">IMO 9123881 • Pavillon Liberia</span>
                    </td>
                    <td className="p-3">Shipping Agent MID GULF</td>
                    <td className="p-3 font-mono font-bold text-blue-400">QUAI-14 (PAD)</td>
                    <td className="p-3">Bulk Wheat Grain</td>
                    <td className="p-3 font-mono">32,000 MT</td>
                    <td className="p-3 font-mono text-[11px]">
                      <div>ETA: 2026-08-06</div>
                      <div className="text-slate-400">ETD: 2026-08-12</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        AT ANCHORAGE / MOUILLAGE
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Husbandry Workflows */}
      {activeTab === "husbandry" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* RDR Tugging */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Anchor className="w-5 h-5 text-blue-400" />
              <span>Services RDR (Remorquage & Pilotage)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Demande de Pilotage Bouée de Base</div>
                  <div className="text-slate-400 font-mono text-[11px]">Pilote RDR affecté: Capt. Ndombe</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">APPROVED</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Affectation Remorqueur RDR</div>
                  <div className="text-slate-400 font-mono text-[11px]">Tugboat: 'Le Wouri' (2500 HP)</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">ASSIGNED</span>
              </div>
            </div>
          </div>

          {/* PAD Berth Application */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              <span>Demande d'Accostage PAD (Port Autonome)</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Réf Approbation Accostage:</span>
                <span className="font-mono font-bold text-blue-400">PAD-BERTH-2026-9901</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Poste à Quai Autorisé:</span>
                <span className="font-bold text-white">QUAI-15 (Profondeur 9.5m)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tirant d'Eau Navire (Draft):</span>
                <span className="font-mono text-white">8.90 mètres</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: DPS Gate Passes */}
      {activeTab === "dps_passes" && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Passes d'Accès Sécurisé DPS (Douala Port Security)</span>
            </h3>
            <button
              onClick={() => setShowGatePassModal(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
            >
              + Nouveau Pass Camion
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gatePasses.map((gp) => (
              <div key={gp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-mono font-bold text-blue-400">{gp.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    {gp.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-slate-400">Immatriculation:</span> <strong className="text-white font-mono">{gp.plate}</strong></div>
                  <div><span className="text-slate-400">Chauffeur:</span> <strong className="text-white">{gp.driver}</strong></div>
                  <div><span className="text-slate-400">Entité:</span> <span className="text-slate-300">{gp.entity}</span></div>
                  <div><span className="text-slate-400">Réf DPS:</span> <span className="font-mono text-cyan-400">{gp.ref}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal DPS Gate Pass */}
      {showGatePassModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Nouveau Pass Porte DPS</h3>

            <form onSubmit={handleCreatePass} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Plaque d'Immatriculation Camion</label>
                <input
                  type="text"
                  value={passForm.vehiclePlate}
                  onChange={(e) => setPassForm({ ...passForm, vehiclePlate: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nom du Chauffeur</label>
                <input
                  type="text"
                  value={passForm.driverName}
                  onChange={(e) => setPassForm({ ...passForm, driverName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Entreprise / Transporteur</label>
                <input
                  type="text"
                  value={passForm.entityName}
                  onChange={(e) => setPassForm({ ...passForm, entityName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGatePassModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500"
                >
                  Valider Autorisation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
