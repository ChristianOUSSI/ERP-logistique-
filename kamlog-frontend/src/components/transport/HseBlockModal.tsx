import { useState } from 'react'

export default function HseBlockModal({ vehicule, onClose, onRefresh }: { vehicule: any, onClose: () => void, onRefresh: () => void }) {
  const [motif, setMotif] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`http://localhost:8000/api/transport/camions/${vehicule.id}/hse-block?motif=${encodeURIComponent(motif)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (res.ok) {
        onRefresh()
        onClose()
      } else {
        const data = await res.json()
        setError(data.detail || 'Erreur lors du blocage')
      }
    } catch (err) {
      setError('Erreur réseau')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-surface w-full max-w-md rounded-DEFAULT shadow-lg flex flex-col">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-red-50 rounded-t-DEFAULT">
          <div>
            <h3 className="font-title-lg text-red-700 flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              Blocage HSE / Maintenance
            </h3>
            <p className="text-red-600/80 text-sm">Véhicule: {vehicule.immatriculation}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-100 rounded text-red-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleBlock} className="p-6 flex flex-col gap-4">
          <p className="text-sm text-secondary">
            En bloquant ce véhicule, il ne pourra plus être affecté à aucun Ordre de Transport tant que la maintenance ne l'aura pas débloqué.
          </p>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-1">Motif du blocage</label>
            <textarea 
              required 
              rows={4}
              className="w-full border rounded p-2 text-sm focus:border-red-500 focus:outline-none"
              placeholder="Ex: Pneus lisses, Fuite d'huile, Extincteur périmé..."
              value={motif}
              onChange={e => setMotif(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-secondary hover:bg-surface-container-low text-sm">
              Annuler
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center gap-2">
              {submitting ? 'En cours...' : 'Confirmer le blocage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
