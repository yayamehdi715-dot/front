import { useState } from 'react'
import { Check, Loader2, Instagram, Phone, MapPin, Package, Calendar, X, ShoppingBag, Trash2, AlertTriangle } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = [
  { value: 'en attente',   label: 'En attente',   bg: 'bg-gray-500/20 text-gray-300 border-gray-500/40' },
  { value: 'confirmé',     label: 'Confirmé',     bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { value: 'en livraison', label: 'En livraison', bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
  { value: 'livré',        label: 'Livré',        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { value: 'retour',       label: 'Retour',       bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
  { value: 'annulé',       label: 'Annulé',       bg: 'bg-red-500/20 text-red-300 border-red-500/40' },
]

function OrderDetailModal({ order, onClose, onUpdated, onDeleted }) {
  const [status, setStatus]           = useState(order.status || 'en attente')
  const [saving, setSaving]           = useState(false)
  const [dirty, setDirty]             = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting]       = useState(false)

  const c  = order.customerInfo || {}
  const ig = c.instagram?.replace(/^@/, '')

  const createdAt = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const statusInfo = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0]

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put(`/orders/${order._id}`, { status })
      toast.success('Statut mis à jour')
      setDirty(false)
      onUpdated?.({ ...order, status })
    } catch {
      toast.error('Erreur mise à jour')
      setStatus(order.status)
      setDirty(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/orders/${order._id}`)
      toast.success('Commande supprimée')
      onDeleted?.(order._id)
      onClose()
    } catch {
      toast.error('Erreur suppression')
    } finally { setDeleting(false) }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: '#12122a', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
              Détail commande
            </p>
            <h2 style={{ color: '#ffffff', fontSize: 20, fontWeight: 800 }}>
              {c.firstName} {c.lastName}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{createdAt}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.bg}`}>
              {statusInfo.label}
            </span>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <X size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Infos client */}
          <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
              Informations client
            </p>

            <div className="flex items-center gap-3">
              <Phone size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <a href={`tel:${c.phone}`} style={{ color: '#ffffff', fontSize: 14, fontWeight: 600 }}
                className="hover:text-pink-400 transition-colors">
                {c.phone}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span style={{ color: '#ffffff', fontSize: 14 }}>{c.wilaya} — {c.commune}</span>
            </div>

            {ig ? (
              <div className="flex items-center gap-3">
                <Instagram size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <a href={`https://www.instagram.com/${ig}/`} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-bold hover:opacity-80 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  @{ig} ↗
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Instagram size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Pas de pseudo Instagram</span>
              </div>
            )}
          </div>

          {/* Articles */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Articles ({order.items?.length || 0})
            </p>
            <div className="space-y-3">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-3"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  {item.product?.images?.[0] ? (
                    <img src={item.product.images[0]} alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                      <ShoppingBag size={20} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p style={{ color: '#ffffff', fontSize: 14, fontWeight: 600 }} className="truncate">{item.name}</p>
                    {item.size && item.size !== 'Unique' && (
                      <p style={{ color: '#f472b6', fontSize: 11, marginTop: 2 }} className="truncate">
                        ✨ {item.size.replace(/^\+ /, '')}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Qté : {item.quantity}</span>
                      <span style={{ color: '#ffffff', fontSize: 14, fontWeight: 700 }}>
                        {(item.price * item.quantity).toLocaleString('fr-DZ')} DA
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>Total</span>
            <span style={{ color: '#ffffff', fontSize: 26, fontWeight: 800 }}>
              {(order.total ?? 0).toLocaleString('fr-DZ')}
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>DA</span>
            </span>
          </div>

          {/* Changer statut */}
          <div className="space-y-2">
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
              Changer le statut
            </p>
            <div className="flex gap-2">
              <select value={status} onChange={(e) => { setStatus(e.target.value); setDirty(e.target.value !== order.status) }}
                className="flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold outline-none cursor-pointer"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff' }}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ backgroundColor: '#12122a' }}>{opt.label}</option>
                ))}
              </select>
              {dirty && (
                <button onClick={handleSave} disabled={saving}
                  className="px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: '#e8609a', color: '#ffffff' }}>
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Sauver
                </button>
              )}
            </div>
          </div>

          {/* Supprimer */}
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all"
              style={{ border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', backgroundColor: 'rgba(239,68,68,0.08)' }}>
              <Trash2 size={15} /> Supprimer cette commande
            </button>
          ) : (
            <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} style={{ color: '#f87171' }} />
                <p style={{ color: '#f87171', fontSize: 13, fontWeight: 700 }}>Confirmer la suppression ?</p>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Cette action est irréversible.</p>
              <div className="flex gap-2">
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Supprimer
                </button>
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2.5 rounded-lg font-bold text-sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                  Annuler
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function AdminOrderRow({ order, onUpdated, onDeleted }) {
  const [status, setStatus]     = useState(order.status || 'en attente')
  const [saving, setSaving]     = useState(false)
  const [dirty, setDirty]       = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const statusInfo = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0]

  const handleStatusChange = (e) => {
    e.stopPropagation()
    setStatus(e.target.value)
    setDirty(e.target.value !== order.status)
  }

  const handleSave = async (e) => {
    e.stopPropagation()
    setSaving(true)
    try {
      await api.put(`/orders/${order._id}`, { status })
      toast.success('Statut mis à jour')
      setDirty(false)
      onUpdated?.({ ...order, status })
    } catch {
      toast.error('Erreur mise à jour')
      setStatus(order.status)
      setDirty(false)
    } finally { setSaving(false) }
  }

  const handleUpdatedFromModal = (updated) => {
    setStatus(updated.status)
    onUpdated?.(updated)
  }

  const createdAt = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })

  const ig = order.customerInfo?.instagram?.replace(/^@/, '')

  return (
    <>
      <tr className="table-row cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setShowDetail(true)}>
        <td className="px-4 py-3">
          <p className="font-heading font-semibold text-brand-white text-sm">
            {order.customerInfo?.firstName} {order.customerInfo?.lastName}
          </p>
          <p className="text-brand-gray-500 text-xs mt-0.5">{order.customerInfo?.phone}</p>
          {ig && <p className="text-pink-400 text-xs mt-0.5">@{ig}</p>}
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <p className="text-brand-gray-300 text-sm">{order.customerInfo?.wilaya}</p>
          <p className="text-brand-gray-500 text-xs">{order.customerInfo?.commune}</p>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <div className="space-y-1 max-w-[180px]">
            {order.items?.map((item, i) => (
              <p key={i} className="text-brand-gray-400 text-xs truncate">
                {item.quantity}× {item.name}
              </p>
            ))}
          </div>
        </td>
        <td className="px-4 py-3 text-right whitespace-nowrap">
          <span className="font-display text-lg text-brand-white">
            {(order.total ?? 0).toLocaleString('fr-DZ')}
            <span className="text-xs text-brand-gray-500 font-body ml-1">DA</span>
          </span>
        </td>
        <td className="px-4 py-3 hidden sm:table-cell text-brand-gray-500 text-xs whitespace-nowrap">
          {createdAt}
        </td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <select value={status} onChange={handleStatusChange}
              className="bg-brand-gray-900 border border-brand-gray-600 text-brand-white
                         text-xs font-heading font-semibold tracking-wider uppercase
                         pl-2 pr-6 py-1.5 outline-none focus:border-brand-red appearance-none cursor-pointer">
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {dirty && (
              <button onClick={handleSave} disabled={saving}
                className="w-7 h-7 bg-brand-red flex items-center justify-center
                           hover:bg-white hover:text-brand-black transition-colors disabled:opacity-50">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              </button>
            )}
          </div>
        </td>
      </tr>

      {showDetail && (
        <OrderDetailModal
          order={{ ...order, status }}
          onClose={() => setShowDetail(false)}
          onUpdated={handleUpdatedFromModal}
          onDeleted={onDeleted}
        />
      )}
    </>
  )
}

export default AdminOrderRow