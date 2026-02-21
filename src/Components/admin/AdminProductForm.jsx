import { useState, useEffect } from 'react'
import { Loader2, ImagePlus, X } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const CATEGORIES = [
  'Bouquets Géants',
  'Bouquets de Mariage',
  'Bouquets Papillon',
  'Bouquets Anniversaire',
  'Bouquets Fiançailles',
  'Décoration',
  'Mini Bouquet',
  'Soutenance',
]

const SUPPLEMENTS_FALLBACK = [
  'Petite couronne', 'Couronne royale', 'Papillon doré',
  "Papillon d'argent", 'Lettre', 'Prénom complet',
  'Écriture sur ruban', 'Lumière blanche', 'Lumière jaune',
]

export default function AdminProductForm({ initialData, onSuccess, onCancel }) {
  const isEdit = !!initialData
  const [supplements, setSupplements] = useState(SUPPLEMENTS_FALLBACK)

  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    price: '',
    stock: '',
    supplements: [],
    images: [],
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Charger les suppléments depuis l'API
  useEffect(() => {
    api.get('/supplements')
      .then(res => {
        if (res.data?.length > 0) {
          setSupplements(res.data.map(s => s.name))
        }
      })
      .catch(() => {}) // garde le fallback si erreur
  }, [])

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? '',
        category: initialData.category ?? CATEGORIES[0],
        price: initialData.price ?? '',
        stock: initialData.stock ?? '',
        supplements: initialData.supplements ?? [],
        images: initialData.images ?? [],
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const toggleSupplement = (sup) => {
    setForm((prev) => ({
      ...prev,
      supplements: prev.supplements.includes(sup)
        ? prev.supplements.filter((s) => s !== sup)
        : [...prev.supplements, sup],
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      const data = new FormData()
      files.forEach((file) => data.append('images', file))
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const uploaded = res.data.urls ?? []
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }))
      toast.success('Image(s) uploadée(s)')
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Le nom est requis')
    if (!form.price || Number(form.price) < 0) return toast.error('Prix invalide')
    if (form.stock === '' || Number(form.stock) < 0) return toast.error('Stock invalide')

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      supplements: form.supplements,
      images: form.images,
    }

    setSaving(true)
    try {
      if (isEdit) {
        await api.put('/products/' + initialData._id, payload)
        toast.success('Bouquet modifié')
      } else {
        await api.post('/products', payload)
        toast.success('Bouquet créé')
      }
      onSuccess()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur serveur')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <h2 className="text-xl font-extrabold text-text-dark mb-5">
        {isEdit ? 'Modifier le bouquet' : 'Nouveau bouquet'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Nom *</label>
          <input
            type="text" name="name" value={form.name} onChange={handleChange}
            placeholder="Ex: Bouquet Géant Rose"
            className="w-full px-4 py-3 rounded-2xl border-2 border-pink-100 text-sm text-text-dark outline-none focus:border-pink-main transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Catégorie *</label>
          <select
            name="category" value={form.category} onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl border-2 border-pink-100 text-sm text-text-dark outline-none focus:border-pink-main transition-all bg-white"
          >
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Prix (DA) *</label>
            <input
              type="number" name="price" value={form.price} onChange={handleChange}
              min="0" placeholder="2500"
              className="w-full px-4 py-3 rounded-2xl border-2 border-pink-100 text-sm text-text-dark outline-none focus:border-pink-main transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Stock *</label>
            <input
              type="number" name="stock" value={form.stock} onChange={handleChange}
              min="0" placeholder="10"
              className="w-full px-4 py-3 rounded-2xl border-2 border-pink-100 text-sm text-text-dark outline-none focus:border-pink-main transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Images</label>
          <label className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-pink-200 text-pink-main text-sm font-semibold cursor-pointer hover:bg-pink-50 transition-all">
            {uploading ? <><Loader2 size={16} className="animate-spin" /> Chargement...</> : <><ImagePlus size={16} /> Ajouter des photos</>}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Suppléments</label>
          <div className="flex flex-wrap gap-2">
            {supplements.map((sup) => {
              const active = form.supplements.includes(sup)
              return (
                <button key={sup} type="button" onClick={() => toggleSupplement(sup)}
                  className={"text-xs px-3 py-1.5 rounded-full font-semibold border-2 transition-all " + (active ? 'bg-pink-main text-white border-pink-main' : 'bg-white text-gray-400 border-gray-200 hover:border-pink-main hover:text-pink-main')}>
                  {sup}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving || uploading}
            className="flex-1 bg-pink-main text-white font-bold py-3 rounded-2xl text-sm hover:bg-pink-main/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95">
            {saving && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? 'Enregistrer' : 'Créer le bouquet'}
          </button>
          <button type="button" onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 rounded-2xl text-sm hover:bg-gray-200 transition-all">
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}