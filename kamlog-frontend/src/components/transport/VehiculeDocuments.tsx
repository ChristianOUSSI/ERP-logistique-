import { useState, useEffect } from 'react'
import { transportAPI } from '@/lib/api-client'

export default function VehiculeDocuments({ vehicule, onClose }: { vehicule: any, onClose: () => void }) {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newDoc, setNewDoc] = useState({ type_document: 'ASSURANCE', numero: '', date_emission: '', date_expiration: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchDocs = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/transport/camions/${vehicule.id}/documents`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.ok) {
        const data = await res.json()
        setDocuments(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [vehicule.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
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
      })
      if (res.ok) {
        fetchDocs()
        setNewDoc({ type_document: 'ASSURANCE', numero: '', date_emission: '', date_expiration: '' })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-surface w-full max-w-2xl rounded-DEFAULT shadow-lg flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center">
          <div>
            <h3 className="font-title-lg text-on-surface">Documents Conformité</h3>
            <p className="text-secondary text-sm">Véhicule: {vehicule.immatriculation}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-4 rounded border border-outline-variant">
            <h4 className="font-title-sm mb-3">Ajouter un document</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-secondary mb-1">Type de Document</label>
                <select className="w-full border rounded p-2 text-sm" value={newDoc.type_document} onChange={e => setNewDoc({...newDoc, type_document: e.target.value})}>
                  <option value="ASSURANCE">Assurance</option>
                  <option value="VISITE_TECHNIQUE">Visite Technique</option>
                  <option value="CARTE_GRISE">Carte Grise</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1">Numéro de document</label>
                <input required type="text" className="w-full border rounded p-2 text-sm" value={newDoc.numero} onChange={e => setNewDoc({...newDoc, numero: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1">Date d'émission</label>
                <input required type="date" className="w-full border rounded p-2 text-sm" value={newDoc.date_emission} onChange={e => setNewDoc({...newDoc, date_emission: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1">Date d'expiration</label>
                <input required type="date" className="w-full border rounded p-2 text-sm" value={newDoc.date_expiration} onChange={e => setNewDoc({...newDoc, date_expiration: e.target.value})} />
              </div>
            </div>
            <button disabled={submitting} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm w-full hover:bg-blue-700">
              {submitting ? 'Enregistrement...' : 'Enregistrer le document'}
            </button>
          </form>

          <div>
            <h4 className="font-title-sm mb-3">Documents Existants</h4>
            {loading ? <p>Chargement...</p> : documents.length === 0 ? <p className="text-secondary text-sm">Aucun document enregistré.</p> : (
              <div className="flex flex-col gap-2">
                {documents.map(doc => {
                  const expired = new Date(doc.date_expiration) < new Date()
                  return (
                    <div key={doc.id} className={`p-3 border rounded flex justify-between items-center ${expired ? 'border-red-500 bg-red-50' : 'border-outline-variant bg-surface-container-lowest'}`}>
                      <div>
                        <span className="font-medium text-sm block">{doc.type_document} - {doc.numero}</span>
                        <span className="text-xs text-secondary">Émis: {doc.date_emission} | Expire: {doc.date_expiration}</span>
                      </div>
                      {expired ? (
                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">Expiré</span>
                      ) : (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Valide</span>
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
