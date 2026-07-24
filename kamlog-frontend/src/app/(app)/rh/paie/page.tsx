"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign, Download, Plus, Search, Filter, FileText,
  CheckCircle, Clock, AlertTriangle, TrendingUp, ChevronDown
} from "lucide-react";

interface BulletinPaie {
  id: number;
  matricule: string;
  nom_complet: string;
  poste: string;
  departement: string;
  mois: string;
  annee: number;
  salaire_brut_xaf: number;
  cotisations_xaf: number;
  impot_xaf: number;
  salaire_net_xaf: number;
  statut: "GENERE" | "VALIDE" | "VIRE";
}

const DEMO_BULLETINS: BulletinPaie[] = [
  { id: 1, matricule: "EMP-001", nom_complet: "Jean-Marc MVONDO", poste: "Chauffeur Principal", departement: "Transport", mois: "Juillet", annee: 2026, salaire_brut_xaf: 450000, cotisations_xaf: 49500, impot_xaf: 35000, salaire_net_xaf: 365500, statut: "VIRE" },
  { id: 2, matricule: "EMP-002", nom_complet: "Marie-Claire NGUEMA", poste: "Responsable RH", departement: "Ressources Humaines", mois: "Juillet", annee: 2026, salaire_brut_xaf: 850000, cotisations_xaf: 93500, impot_xaf: 95000, salaire_net_xaf: 661500, statut: "VALIDE" },
  { id: 3, matricule: "EMP-003", nom_complet: "Patrick EBANG", poste: "Responsable Financier", departement: "Finance", mois: "Juillet", annee: 2026, salaire_brut_xaf: 1200000, cotisations_xaf: 132000, impot_xaf: 180000, salaire_net_xaf: 888000, statut: "VALIDE" },
  { id: 4, matricule: "EMP-004", nom_complet: "Paul KAMGA", poste: "Magasinier Chef", departement: "Magasin WMS", mois: "Juillet", annee: 2026, salaire_brut_xaf: 380000, cotisations_xaf: 41800, impot_xaf: 25000, salaire_net_xaf: 313200, statut: "GENERE" },
  { id: 5, matricule: "EMP-005", nom_complet: "Sarah MVONGO", poste: "Agent de Transit", departement: "Transit & Douane", mois: "Juillet", annee: 2026, salaire_brut_xaf: 520000, cotisations_xaf: 57200, impot_xaf: 52000, salaire_net_xaf: 410800, statut: "GENERE" },
];

const statutConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  GENERE: { label: "Généré", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", icon: <Clock size={12} /> },
  VALIDE: { label: "Validé", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", icon: <CheckCircle size={12} /> },
  VIRE: { label: "Viré", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", icon: <CheckCircle size={12} /> },
};

const fmtXAF = (v: number) => new Intl.NumberFormat("fr-FR").format(v) + " XAF";

export default function RHPaiePage() {
  const [bulletins, setBulletins] = useState<BulletinPaie[]>(DEMO_BULLETINS);
  const [search, setSearch] = useState("");
  const [filterMois, setFilterMois] = useState("Juillet");
  const [filterStatut, setFilterStatut] = useState("TOUS");

  const filtered = bulletins.filter((b) => {
    const matchSearch = search === "" || b.nom_complet.toLowerCase().includes(search.toLowerCase()) || b.matricule.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === "TOUS" || b.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const totalMasse = filtered.reduce((s, b) => s + b.salaire_brut_xaf, 0);
  const totalNet = filtered.reduce((s, b) => s + b.salaire_net_xaf, 0);
  const totalCotisations = filtered.reduce((s, b) => s + b.cotisations_xaf, 0);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="text-pink-500" size={28} />
            Gestion de la Paie
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Bulletins de paie, masse salariale et virements — Juillet 2026
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm hover:bg-accent transition-colors">
            <Download size={16} />
            Exporter Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium transition-colors">
            <Plus size={16} />
            Générer Bulletins
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Masse Salariale Brute", value: fmtXAF(bulletins.reduce((s, b) => s + b.salaire_brut_xaf, 0)), icon: <TrendingUp size={20} />, color: "text-pink-400", bg: "from-pink-500/10 to-rose-500/10 border-pink-500/20" },
          { label: "Total Net à Payer", value: fmtXAF(bulletins.reduce((s, b) => s + b.salaire_net_xaf, 0)), icon: <DollarSign size={20} />, color: "text-emerald-400", bg: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20" },
          { label: "Cotisations Sociales", value: fmtXAF(bulletins.reduce((s, b) => s + b.cotisations_xaf, 0)), icon: <FileText size={20} />, color: "text-blue-400", bg: "from-blue-500/10 to-cyan-500/10 border-blue-500/20" },
          { label: "Bulletins Générés", value: `${bulletins.length} / ${bulletins.length}`, icon: <CheckCircle size={20} />, color: "text-amber-400", bg: "from-amber-500/10 to-yellow-500/10 border-amber-500/20" },
        ].map((kpi, i) => (
          <div key={i} className={`rounded-2xl border bg-gradient-to-br ${kpi.bg} p-5 flex items-center gap-4`}>
            <div className={`${kpi.color} opacity-80`}>{kpi.icon}</div>
            <div>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className="text-base font-bold text-foreground mt-0.5">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30 placeholder:text-muted-foreground"
            placeholder="Rechercher par nom, matricule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30"
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
        >
          <option value="TOUS">Tous les statuts</option>
          <option value="GENERE">Généré</option>
          <option value="VALIDE">Validé</option>
          <option value="VIRE">Viré</option>
        </select>
        <select
          className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30"
          value={filterMois}
          onChange={(e) => setFilterMois(e.target.value)}
        >
          {["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"].map(m => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Table Bulletins */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                {["Matricule", "Employé", "Poste", "Salaire Brut", "Cotisations", "Impôts", "Net à Payer", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => {
                const cfg = statutConfig[b.statut];
                return (
                  <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{b.matricule}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{b.nom_complet}</div>
                      <div className="text-xs text-muted-foreground">{b.departement}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{b.poste}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{new Intl.NumberFormat("fr-FR").format(b.salaire_brut_xaf)}</td>
                    <td className="px-4 py-3 text-red-400">{new Intl.NumberFormat("fr-FR").format(b.cotisations_xaf)}</td>
                    <td className="px-4 py-3 text-red-400">{new Intl.NumberFormat("fr-FR").format(b.impot_xaf)}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{new Intl.NumberFormat("fr-FR").format(b.salaire_net_xaf)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="px-3 py-1 rounded-lg text-xs bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500/20 transition-colors">
                          <FileText size={12} className="inline mr-1" />
                          Bulletin
                        </button>
                        {b.statut === "GENERE" && (
                          <button
                            onClick={() => setBulletins(prev => prev.map(x => x.id === b.id ? { ...x, statut: "VALIDE" } : x))}
                            className="px-3 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                          >
                            Valider
                          </button>
                        )}
                        {b.statut === "VALIDE" && (
                          <button
                            onClick={() => setBulletins(prev => prev.map(x => x.id === b.id ? { ...x, statut: "VIRE" } : x))}
                            className="px-3 py-1 rounded-lg text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                          >
                            Virer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-muted/40 border-t-2 border-border">
              <tr>
                <td colSpan={3} className="px-4 py-3 font-bold text-sm text-foreground">TOTAUX ({filtered.length} bulletins)</td>
                <td className="px-4 py-3 font-bold text-foreground">{new Intl.NumberFormat("fr-FR").format(totalMasse)}</td>
                <td className="px-4 py-3 font-bold text-red-400">{new Intl.NumberFormat("fr-FR").format(totalCotisations)}</td>
                <td className="px-4 py-3 font-bold text-red-400">{new Intl.NumberFormat("fr-FR").format(filtered.reduce((s, b) => s + b.impot_xaf, 0))}</td>
                <td className="px-4 py-3 font-bold text-emerald-400">{new Intl.NumberFormat("fr-FR").format(totalNet)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
