import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Check, X, Loader2, AlertTriangle, Sparkles } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminSupplementsPage() {
  const [supplements, setSupplements] = useState([])
  const [loading, setLoading]         = useState(true)
  const [editingId, setEditingId]     = useState(null)
  const [editForm, setEditForm]       = useState({ name: '', price: '' })
  const [showAdd, setShowAdd]         = useState(false)
  const [newForm, setNewForm]         = useState({ name: '', price: '100' })
  const [saving, setSaving]           = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting]       = useState(null)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await api.get('/supplements')
      setSupplements(res.data || [])
    } catch { toast.error('Erreur chargement') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  // ── Ajouter ──
  const handleAdd = async () => {
    if (!newForm.name.trim()) return toast.error('Nom requis')
    if (!newForm.price || Number(newForm.price) < 0) return toast.error('Prix invalide')
    setSaving(true)
    try {
      const res = await api.post('/supplements', { name: newForm.name.trim(), price: Number(newForm.price) })
      setSupplements(prev => [...prev, res.data])
      setNewForm({ name: '', price: '100' })
      setShowAdd(false)
      toast.success('Supplément ajouté ✅')
    } catch (err) { toast.error(err?.response?.data?.message || 'Erreur') }
    finally { setSaving(false) }
  }

  // ── Modifier ──
  const startEdit = (sup) => {
    setEditingId(sup._id)
    setEditForm({ name: sup.name, price: String(sup.price) })
  }

  const handleSaveEdit = async (id) => {
    if (!editForm.name.trim()) return toast.error('Nom requis')
    setSaving(true)
    try {
      const res = await api.put(`/supplements/${id}`, { name: editForm.name.trim(), price: Number(editForm.price) })
      setSupplements(prev => prev.map(s => s._id === id ? res.data : s))
      setEditingId(null)
      toast.success('Modifié ✅')
    } catch (err) { toast.error(err?.response?.data?.message || 'Erreur') }
    finally { setSaving(false) }
  }

  // ── Supprimer ──
  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await api.delete(`/supplements/${id}`)
      setSupplements(prev => prev.filter(s => s._id !== id))
      setDeleteConfirm(null)
      toast.success('Supprimé')
    } catch { toast.error('Erreur suppression') }
    finally { setDeleting(null) }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-pink-main/60 mb-1">Gestion</p>
          <h1 className="text-3xl font-extrabold text-text-dark">Suppléments</h1>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-pink-main text-white font-bold px-5 py-3 rounded-full shadow-md hover:bg-pink-main/90 transition-all active:scale-95 text-sm">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Formulaire ajout */}
      {showAdd && (
        <div className="bg-white rounded-2xl shadow-card p-5 border-2 border-pink-100">
          <p className="font-bold text-text-dark mb-4">Nouveau supplément</p>
          <div className="flex gap-3 flex-wrap">
            <input
              type="text" value={newForm.name} placeholder="Nom du supplément"
              onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))}
              className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border-2 border-pink-100 text-sm text-text-dark outline-none focus:border-pink-main transition-all"
            />
            <div className="relative w-32">
              <input
                type="number" value={newForm.price} min="0" placeholder="Prix"
                onChange={e => setNewForm(p => ({ ...p, price: e.target.value }))}
                className="w-full px-4 py-2.5 pr-10 rounded-xl border-2 border-pink-100 text-sm text-text-dark outline-none focus:border-pink-main transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">DA</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleAdd} disabled={saving}
              className="flex-1 bg-pink-main text-white font-bold py-2.5 rounded-xl text-sm hover:bg-pink-main/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Ajouter
            </button>
            <button onClick={() => { setShowAdd(false); setNewForm({ name: '', price: '100' }) }}
              className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-200 transition-all">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-pink-main" />
        </div>
      ) : supplements.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-card">
          <Sparkles size={32} className="text-pink-main/40 mx-auto mb-3" />
          <p className="text-gray-400 font-semibold">Aucun supplément</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {supplements.map((sup, i) => (
            <div key={sup._id}
              className={`flex items-center gap-3 px-5 py-4 ${i !== 0 ? 'border-t border-gray-100' : ''}`}>

              {editingId === sup._id ? (
                <>
                  <input
                    type="text" value={editForm.name}
                    onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-xl border-2 border-pink-100 text-sm text-text-dark outline-none focus:border-pink-main"
                    autoFocus
                  />
                  <div className="relative w-28">
                    <input
                      type="number" value={editForm.price} min="0"
                      onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))}
                      className="w-full px-3 py-2 pr-8 rounded-xl border-2 border-pink-100 text-sm text-text-dark outline-none focus:border-pink-main"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">DA</span>
                  </div>
                  <button onClick={() => handleSaveEdit(sup._id)} disabled={saving}
                    className="w-8 h-8 bg-teal-main rounded-full flex items-center justify-center text-white hover:opacity-90 transition-all disabled:opacity-50">
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={13} />}
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-all">
                    <X size={13} />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-lg">✨</span>
                  <span className="flex-1 font-semibold text-text-dark text-sm">{sup.name}</span>
                  <span className="text-pink-main font-extrabold text-sm whitespace-nowrap">
                    +{sup.price.toLocaleString('fr-DZ')} DA
                  </span>
                  <button onClick={() => startEdit(sup)}
                    className="w-8 h-8 rounded-full border-2 border-teal-main/30 text-teal-main flex items-center justify-center hover:bg-teal-main hover:text-white transition-all">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => setDeleteConfirm(sup)}
                    className="w-8 h-8 rounded-full border-2 border-gray-100 text-gray-300 flex items-center justify-center hover:border-red-300 hover:text-red-400 transition-all">
                    <Trash2 size={12} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Note info */}
      <div className="bg-pink-50 rounded-2xl p-4 flex items-start gap-3">
        <Sparkles size={16} className="text-pink-main flex-shrink-0 mt-0.5" />
        <p className="text-text-dark/60 text-xs leading-relaxed">
          Les prix des suppléments sont ajoutés automatiquement au total de la commande du client.
          Modifiez les prix ici et ils seront appliqués immédiatement sur le site.
        </p>
      </div>

      {/* Modal suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <h3 className="font-extrabold text-text-dark">Supprimer ce supplément ?</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              <span className="font-bold text-text-dark">{deleteConfirm.name}</span>
              <br/>Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm._id)} disabled={deleting === deleteConfirm._id}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-2xl text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {deleting === deleteConfirm._id && <Loader2 size={14} className="animate-spin" />}
                Supprimer
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 rounded-2xl text-sm hover:bg-gray-200 transition-all">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}