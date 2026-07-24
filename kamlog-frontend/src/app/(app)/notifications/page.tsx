"use client";

import React, { useState, useEffect } from "react";
import {
  Bell, CheckCheck, Trash2, Search, Filter, BellOff,
  AlertTriangle, CheckCircle, Info, XCircle, Truck,
  Package, DollarSign, Shield, Wrench, Globe, Users,
  RefreshCw, X
} from "lucide-react";

interface Notification {
  id: number;
  titre: string;
  message: string;
  type: "SUCCESS" | "WARNING" | "ERROR" | "INFO";
  module: string;
  lu: boolean;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://kamlog-backend-production.up.railway.app";

const moduleIconMap: Record<string, React.ReactNode> = {
  TRANSPORT: <Truck size={14} />,
  MAGASIN: <Package size={14} />,
  FINANCE: <DollarSign size={14} />,
  SECURITE: <Shield size={14} />,
  MAINTENANCE: <Wrench size={14} />,
  TRANSIT: <Globe size={14} />,
  RH: <Users size={14} />,
  QHSE: <Shield size={14} />,
  SYSTEME: <Info size={14} />,
};

const typeConfig = {
  SUCCESS: { icon: <CheckCircle size={16} />, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30" },
  WARNING: { icon: <AlertTriangle size={16} />, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30" },
  ERROR: { icon: <XCircle size={16} />, color: "text-red-400", bg: "bg-red-400/10 border-red-400/30" },
  INFO: { icon: <Info size={16} />, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
};

const moduleColors: Record<string, string> = {
  TRANSPORT: "text-cyan-400 bg-cyan-400/10",
  MAGASIN: "text-amber-400 bg-amber-400/10",
  FINANCE: "text-emerald-400 bg-emerald-400/10",
  SECURITE: "text-red-400 bg-red-400/10",
  MAINTENANCE: "text-orange-400 bg-orange-400/10",
  TRANSIT: "text-sky-400 bg-sky-400/10",
  RH: "text-pink-400 bg-pink-400/10",
  QHSE: "text-rose-400 bg-rose-400/10",
  SYSTEME: "text-slate-400 bg-slate-400/10",
};

const FALLBACK_NOTIFS: Notification[] = [
  { id: 1, titre: "Nouvelle Mission Dispatch", message: "Mission OT-2026-00401 créée – Chauffeur MVONDO Jean-Marc affecté vers N'Djamena", type: "SUCCESS", module: "TRANSPORT", lu: false, created_at: new Date().toISOString() },
  { id: 2, titre: "Stock Critique MAG3", message: "Niveau critique atteint pour MAT-SOUDURE-006 – Réapprovisionnement requis immédiatement", type: "WARNING", module: "MAGASIN", lu: false, created_at: new Date().toISOString() },
  { id: 3, titre: "Pneus Usés DLA-TRK-001", message: "Usure pneumatiques avant à 90%. Remplacement recommandé avant prochaine mission.", type: "WARNING", module: "MAINTENANCE", lu: false, created_at: new Date().toISOString() },
  { id: 4, titre: "Ticket Carburant Validé", message: "Ticket #FUEL-2026-088 validé – 450L TotalEnergies Port Douala", type: "INFO", module: "TRANSPORT", lu: true, created_at: new Date().toISOString() },
  { id: 5, titre: "Rapport QHSE Soumis", message: "Inspection #QHSE-2026-012 soumise par NGUEMA Patrick – En attente validation", type: "INFO", module: "QHSE", lu: false, created_at: new Date().toISOString() },
  { id: 6, titre: "Paiement Reçu", message: "Facture FAC-2026-0234 réglée par CFAO LOGISTICS – 4.850.000 XAF", type: "SUCCESS", module: "FINANCE", lu: true, created_at: new Date().toISOString() },
  { id: 7, titre: "Dossier Transit CEMAC Approuvé", message: "Dossier CEMAC-2026-089 approuvé par Direction Douanes de Douala", type: "SUCCESS", module: "TRANSIT", lu: false, created_at: new Date().toISOString() },
  { id: 8, titre: "Accès Non Autorisé", message: "Tentative d'accès zone sécurisée YARD-A01 sans badge à 23h47", type: "ERROR", module: "SECURITE", lu: false, created_at: new Date().toISOString() },
];

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}j`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(FALLBACK_NOTIFS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("TOUS");
  const [filterModule, setFilterModule] = useState("TOUS");
  const [filterLu, setFilterLu] = useState("TOUS");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/notifications/`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.notifications?.length > 0) setNotifications(data.notifications);
      }
    } catch { /* fallback to demo data */ }
    finally { setLoading(false); }
  };

  const markAllRead = async () => {
    try {
      await fetch(`${API_BASE}/api/v1/notifications/mark-all-read`, { method: "PATCH", credentials: "include" });
    } catch {}
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
  };

  const markOneRead = async (id: number) => {
    try {
      await fetch(`${API_BASE}/api/v1/notifications/${id}/read`, { method: "PATCH", credentials: "include" });
    } catch {}
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
  };

  const deleteNotif = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const modules = [...new Set(notifications.map(n => n.module))];

  const filtered = notifications.filter(n => {
    const matchSearch = search === "" || n.titre.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "TOUS" || n.type === filterType;
    const matchModule = filterModule === "TOUS" || n.module === filterModule;
    const matchLu = filterLu === "TOUS" || (filterLu === "NON_LU" ? !n.lu : n.lu);
    return matchSearch && matchType && matchModule && matchLu;
  });

  const nonLues = notifications.filter(n => !n.lu).length;

  return (
    <div className="min-h-screen p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="text-indigo-400" size={28} />
            {nonLues > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {nonLues}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Centre de Notifications</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {nonLues} non lue{nonLues > 1 ? "s" : ""} sur {notifications.length} notifications
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchNotifications}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm hover:bg-accent transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            <CheckCheck size={16} />
            Tout marquer lu
          </button>
        </div>
      </div>

      {/* Stats par type */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["SUCCESS", "WARNING", "ERROR", "INFO"] as const).map((type) => {
          const cfg = typeConfig[type];
          const count = notifications.filter(n => n.type === type).length;
          const labels = { SUCCESS: "Succès", WARNING: "Avertissements", ERROR: "Erreurs", INFO: "Informations" };
          return (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? "TOUS" : type)}
              className={`rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] ${cfg.bg} ${filterType === type ? "ring-2 ring-current" : ""}`}
            >
              <div className={`${cfg.color} mb-2`}>{cfg.icon}</div>
              <div className={`text-2xl font-bold ${cfg.color}`}>{count}</div>
              <div className={`text-xs mt-0.5 ${cfg.color} opacity-80`}>{labels[type]}</div>
            </button>
          );
        })}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder:text-muted-foreground"
            placeholder="Rechercher une notification..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" value={filterModule} onChange={(e) => setFilterModule(e.target.value)}>
          <option value="TOUS">Tous les modules</option>
          {modules.map(m => <option key={m}>{m}</option>)}
        </select>
        <select className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" value={filterLu} onChange={(e) => setFilterLu(e.target.value)}>
          <option value="TOUS">Toutes</option>
          <option value="NON_LU">Non lues</option>
          <option value="LU">Lues</option>
        </select>
      </div>

      {/* Liste notifications */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <BellOff size={48} className="mx-auto text-muted-foreground opacity-30 mb-4" />
            <p className="text-muted-foreground font-medium">Aucune notification correspondante</p>
            <p className="text-sm text-muted-foreground opacity-60 mt-1">Modifiez vos filtres ou revenez plus tard</p>
          </div>
        )}
        {filtered.map((n) => {
          const cfg = typeConfig[n.type];
          const modColor = moduleColors[n.module] || "text-slate-400 bg-slate-400/10";
          const modIcon = moduleIconMap[n.module] || <Info size={14} />;
          return (
            <div
              key={n.id}
              onClick={() => markOneRead(n.id)}
              className={`group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${
                n.lu
                  ? "bg-card border-border opacity-70 hover:opacity-100"
                  : "bg-card border-border shadow-sm ring-1 ring-indigo-500/20"
              }`}
            >
              {/* Indicateur non lu */}
              <div className="mt-1 flex-shrink-0">
                {!n.lu ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-transparent border border-border" />
                )}
              </div>

              {/* Icône type */}
              <div className={`mt-0.5 flex-shrink-0 ${cfg.color}`}>{cfg.icon}</div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-semibold text-sm ${n.lu ? "text-muted-foreground" : "text-foreground"}`}>
                      {n.titre}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">{timeAgo(n.created_at)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${modColor}`}>
                    {modIcon}
                    {n.module}
                  </span>
                  {!n.lu && (
                    <span className="text-xs text-indigo-400 font-medium">Nouveau</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
