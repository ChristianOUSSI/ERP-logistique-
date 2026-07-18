import React, { useEffect, useState } from 'react';
import { History, X, Clock, Link2, Unlink } from 'lucide-react';
import { transportAPI } from '@/lib/api-client';
import { CardSkeletonLoader } from '@/components/ui/Loaders';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props {
  vehicule: any;
  onClose: () => void;
}

export default function HistoriqueCouplageModal({ vehicule, onClose }: Props) {
  const [historiques, setHistoriques] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transportAPI.getHistoriqueCouplage(vehicule.id)
      .then(res => setHistoriques(res.data))
      .catch(err => console.error("Erreur historique", err))
      .finally(() => setLoading(false));
  }, [vehicule.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-xl">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Historique des Couplages</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{vehicule.immatriculation}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 custom-scrollbar">
          {loading ? (
            <CardSkeletonLoader />
          ) : historiques.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Link2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="font-bold">Aucun historique d'attelage pour ce véhicule.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
              {historiques.map((h, index) => (
                <div key={h.id} className="relative pl-6">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${!h.date_dissociation ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {vehicule.type_materiel === 'TRACTEUR' ? (
                          <>
                            <span className="font-black text-slate-800">{vehicule.immatriculation}</span>
                            <Link2 className="w-4 h-4 text-slate-400" />
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100">
                              {h.remorque_immatriculation || "Remorque Inconnue"}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold border border-slate-200">
                              {h.tracteur_immatriculation || "Tracteur Inconnu"}
                            </span>
                            <Link2 className="w-4 h-4 text-slate-400" />
                            <span className="font-black text-slate-800">{vehicule.immatriculation}</span>
                          </>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${!h.date_dissociation ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {!h.date_dissociation ? 'Attelage Actif' : 'Clôturé'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Link2 className="w-4 h-4 text-emerald-500" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Date d'association</p>
                          <p className="font-medium">{format(new Date(h.date_association), 'dd MMM yyyy à HH:mm', { locale: fr })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Unlink className={`w-4 h-4 ${h.date_dissociation ? 'text-rose-500' : 'text-slate-300'}`} />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Date de dissociation</p>
                          <p className="font-medium">
                            {h.date_dissociation ? format(new Date(h.date_dissociation), 'dd MMM yyyy à HH:mm', { locale: fr }) : <span className="italic text-slate-400">En cours...</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            Fermer l'historique
          </button>
        </div>
      </div>
    </div>
  );
}
