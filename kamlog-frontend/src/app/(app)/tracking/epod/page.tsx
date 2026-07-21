'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trackingAPI } from '@/lib/api-client';
import { FileCheck, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function EPodCapturePage() {
  const queryClient = useQueryClient();
  const [missionRef, setMissionRef] = useState('OT-2026-00402');
  const [destinataire, setDestinataire] = useState('Jean-Paul EKANI');

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await trackingAPI.createEpod(payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Preuve de livraison e-POD enregistrée !');
      queryClient.invalidateQueries({ queryKey: ['epods'] });
    },
    onError: () => {
      toast.error('Erreur lors de la capture de l\'e-POD');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      reference_mission: missionRef,
      nom_destinataire: destinataire,
      signature_url: '/signatures/sig_latest.png',
      photo_livraison_url: '/photos/delivery_latest.jpg',
      longitude: 9.7042,
      latitude: 4.0511
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 text-white animate-in fade-in duration-500">
      <Link href="/tracking" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour au tracking
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-800 mb-6">
          <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center border border-sky-500/20">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Numérisation e-POD Chauffeur</h1>
            <p className="text-sm text-slate-400">Prise de signature électronique et coordonnées GPS.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">N° Ordre de Transport (OT)</label>
            <input
              type="text"
              required
              value={missionRef}
              onChange={(e) => setMissionRef(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nom du Réceptionnaire / Destinataire</label>
            <input
              type="text"
              required
              value={destinataire}
              onChange={(e) => setDestinataire(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
            />
          </div>

          <div className="p-6 border-2 border-dashed border-slate-800 rounded-2xl text-center bg-slate-950/50">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Pad de Signature Tactile</p>
            <p className="text-sm text-slate-500 italic">Simulé • Signature enregistrée automatiquement au clic</p>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition-all"
          >
            <Send className="w-4 h-4" /> {createMutation.isPending ? 'Enregistrement...' : 'Valider l\'e-POD'}
          </button>
        </form>
      </div>
    </div>
  );
}
