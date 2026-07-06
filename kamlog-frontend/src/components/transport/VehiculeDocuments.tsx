import React, { useState, useEffect } from 'react';
import { FileText, ShieldAlert, CheckCircle2, Calendar, Plus, X } from 'lucide-react';

export default function VehiculeDocuments({ vehicule, onClose }: { vehicule: any, onClose: () => void }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDoc, setNewDoc] = useState({ type_document: 'ASSURANCE', numero: '', date_emission: '', date_expiration: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchDocs = async () => {
    try {
      // Direct fetch if transportAPI.getVehiculeDocuments is not yet defined in api-client.ts
      const res = await fetch(`http://localhost:8000/api/transport/camions/${vehicule.id}/documents`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [vehicule.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8000/api/transport/camions/${vehicule.id}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          vehicule_id: vehicule.id,
          ...newDoc
        })
      });
      if (res.ok) {
        fetchDocs();
        setNewDoc({ type_document: 'ASSURANCE', numero: '', date_emission: '', date_expiration: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Documents & Conformité</h3>
              <p className="text-sm text-slate-500 font-medium">Véhicule: {vehicule.immatriculation} ({vehicule.marque})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8 custom-scrollbar">
          
          <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Ajouter / Renouveler un document
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Type de Document</label>
                <select className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" value={newDoc.type_document} onChange={e => setNewDoc({...newDoc, type_document: e.target.value})}>
                  <option value="ASSURANCE">Assurance Transport</option>
                  <option value="VISITE_TECHNIQUE">Visite Technique</option>
                  <option value="CARTE_GRISE">Carte Grise</option>
                  <option value="PATENTE">Patente / Licence</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Numéro de pièce</label>
                <input required type="text" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" value={newDoc.numero} onChange={e => setNewDoc({...newDoc, numero: e.target.value})} placeholder="Ex: AS-90234-A" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Date d'émission</label>
                <input required type="date" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" value={newDoc.date_emission} onChange={e => setNewDoc({...newDoc, date_emission: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Date d'expiration</label>
                <input required type="date" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" value={newDoc.date_expiration} onChange={e => setNewDoc({...newDoc, date_expiration: e.target.value})} />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button disabled={submitting} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                {submitting ? 'Enregistrement...' : <><CheckCircle2 className="w-4 h-4" /> Enregistrer le document</>}
              </button>
            </div>
          </form>

          <div>
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-500" /> Dossier Légal Actif
            </h4>
            {loading ? (
              <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
            ) : documents.length === 0 ? (
              <p className="text-center text-slate-500 py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">Aucun document enregistré pour ce véhicule.</p>
            ) : (
              <div className="grid gap-3">
                {documents.map(doc => {
                  const expired = isExpired(doc.date_expiration);
                  return (
                    <div key={doc.id} className={`flex items-center justify-between p-4 rounded-xl border ${expired ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${expired ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {expired ? <ShieldAlert className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{doc.type_document.replace('_', ' ')} <span className="text-slate-400 font-normal ml-2">N° {doc.numero}</span></p>
                          <div className="flex items-center gap-4 mt-1 text-xs">
                            <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Émis: {new Date(doc.date_emission).toLocaleDateString()}</span>
                            <span className={`font-bold flex items-center gap-1 ${expired ? 'text-red-600' : 'text-slate-600'}`}>
                              <Calendar className="w-3.5 h-3.5" /> Expire: {new Date(doc.date_expiration).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {expired && (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse">EXPIRÉ</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
