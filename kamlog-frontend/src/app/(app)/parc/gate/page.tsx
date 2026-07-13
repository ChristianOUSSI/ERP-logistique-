'use client';

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { ScanText, Truck } from 'lucide-react';
import { parcAPI } from '@/lib/api-client';
import { EmplacementParc } from '@/types/parc';
import { toast } from 'sonner';

export default function GateOperationsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<'IN' | 'OUT'>('IN');
  const [emplacements, setEmplacements] = useState<EmplacementParc[]>([]);
  
  const [form, setForm] = useState({
    numero_conteneur: '',
    type_conteneur: '20DRY',
    etat: 'BON_ETAT',
    poids_tare_kg: 2200,
    emplacement_id: 0
  });

  useEffect(() => {
    parcAPI.getEmplacements().then(data => {
      setEmplacements(data.filter(e => e.statut === 'LIBRE'));
    }).catch(console.error);
  }, []);



  const handleGateIn = async () => {
    if (!form.numero_conteneur || !form.emplacement_id) {
      toast.error("Veuillez remplir le numéro de conteneur et choisir un emplacement.");
      return;
    }
    setSubmitting(true);
    try {
      await parcAPI.gateIn({
        numero_conteneur: form.numero_conteneur,
        type_conteneur: form.type_conteneur,
        etat: form.etat,
        poids_tare_kg: form.poids_tare_kg,
        emplacement_id: form.emplacement_id
      });
      toast.success("Gate In validé avec succès !");
      setForm({
        numero_conteneur: '',
        type_conteneur: '20DRY',
        etat: 'BON_ETAT',
        poids_tare_kg: 2200,
        emplacement_id: 0
      });
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du Gate In");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGateOut = async () => {
    if (!form.numero_conteneur) {
      toast.error("Veuillez remplir le numéro de conteneur.");
      return;
    }
    setSubmitting(true);
    try {
      await parcAPI.gateOut({
        numero_conteneur: form.numero_conteneur,
      });
      toast.success("Gate Out validé avec succès !");
      setForm({
        ...form,
        numero_conteneur: '',
      });
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du Gate Out");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModuleLayout module="parc">
      <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <ScanText className="w-8 h-8 text-blue-600" />
              Gate Operations & IA (OCR)
            </h1>
            <p className="text-sm text-slate-500 mt-2">Reconnaissance optique des documents d'entrée/sortie du parc.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setMode('IN')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'IN' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Gate IN</button>
            <button onClick={() => setMode('OUT')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'OUT' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Gate OUT</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Form Section */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden md:col-span-2 max-w-2xl mx-auto w-full">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <Truck className="w-48 h-48" />
            </div>
            
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
              <ScanText className="w-5 h-5 text-blue-400" />
              Saisie d'Opération Gate {mode}
            </h2>

            <div className="space-y-4 relative z-10 animate-in slide-in-from-right duration-300">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">N° Conteneur</label>
                <input type="text" value={form.numero_conteneur} onChange={e => setForm({...form, numero_conteneur: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" placeholder="Ex: MSKU1234567" />
              </div>
              
              {mode === 'IN' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Type</label>
                      <select value={form.type_conteneur} onChange={e => setForm({...form, type_conteneur: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none">
                        <option value="20DRY">20' DRY</option>
                        <option value="40DRY">40' DRY</option>
                        <option value="20REEFER">20' REEFER</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Etat</label>
                      <select value={form.etat} onChange={e => setForm({...form, etat: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none">
                        <option value="BON_ETAT">Bon état</option>
                        <option value="ENDOMMAGE">Endommagé</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Emplacement (Cour)</label>
                    <select value={form.emplacement_id} onChange={e => setForm({...form, emplacement_id: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none">
                      <option value={0}>Sélectionnez un emplacement libre...</option>
                      {emplacements.map(e => (
                        <option key={e.id} value={e.id}>{e.code_emplacement}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <button 
                onClick={mode === 'IN' ? handleGateIn : handleGateOut}
                disabled={submitting}
                className={`mt-8 w-full py-3 rounded-xl font-bold text-white transition-colors disabled:opacity-50 ${mode === 'IN' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'}`}
              >
                {submitting ? 'Validation...' : `Valider le Gate ${mode}`}
              </button>
            </div>
          </div>

        </div>

      </div>
    </ModuleLayout>
  );
}
