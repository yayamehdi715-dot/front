import { useState, useCallback } from 'react'
import { ChevronDown, AlertTriangle, ShoppingBag, Instagram, Copy } from 'lucide-react'
import wilayas from '../../data/wilayas'
import { markDmSent } from './OrderStatusBanner'

const isValidInstagram = (val) => /^[a-zA-Z0-9._]{1,30}$/.test(val.replace(/^@/, ''))

export function InstagramRedirectModal({ orderInfo, onClose }) {
  const [copied, setCopied] = useState(false)

  const buildMessage = (info) => {
    const lines = [
      '📦 Nouvelle commande',
      `👤 Nom : ${info.firstName} ${info.lastName}`,
      `📞 Téléphone : ${info.phone}`,
      `📍 Wilaya : ${info.wilaya}`,
      `🏘️ Commune : ${info.commune}`,
    ]
    if (info.instagram) lines.push(`📸 Instagram : @${info.instagram.replace(/^@/, '')}`)
    if (info.productName) lines.push(`🌸 Produit : ${info.productName}`)
    if (info.quantity) lines.push(`🔢 Quantité : ${info.quantity}`)
    if (info.supplements && info.supplements.length > 0)
      lines.push(`✨ Suppléments : ${info.supplements.join(', ')}`)
    if (info.total) lines.push(`💰 Total : ${info.total.toLocaleString('fr-DZ')} DA`)
    return lines.join('\n')
  }

  const message = buildMessage(orderInfo)

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(message) } catch {}
    setCopied(true)
  }

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7">

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
            <Instagram size={28} color="white" />
          </div>
        </div>

        <h3 className="text-center font-extrabold text-text-dark text-lg mb-1">
          Commande enregistrée ! 🎉
        </h3>
        <p className="text-center text-text-dark/60 text-sm mb-5 leading-relaxed">
          Pour procéder au paiement, veuillez m'envoyer un message en privé sur Instagram.
          Vos informations ont été copiées dans le presse-papier, collez-les dans la discussion. À bientôt ! 🌸
        </p>

        <div className="bg-gray-50 rounded-2xl px-4 py-3 mb-5 text-xs text-text-dark/70 space-y-0.5 font-mono leading-relaxed">
          {message.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </div>

        {!copied ? (
          <button onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm transition-all active:scale-95 mb-3"
            style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
            <Copy size={16} /> Copier mes informations
          </button>
        ) : (
          <a href="https://www.instagram.com/madeby_mariee/" target="_blank" rel="noopener noreferrer"
            onClick={() => { markDmSent(); onClose() }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm transition-all active:scale-95 mb-3 text-center"
            style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
            <Instagram size={16} /> Ouvrir Instagram →
          </a>
        )}

        <button onClick={onClose}
          className="w-full bg-gray-100 text-gray-500 font-bold py-3 rounded-2xl text-sm hover:bg-gray-200 transition-all">
          Fermer
        </button>
      </div>
    </div>
  )
}

function CheckoutForm({ onSubmit, loading, orderInfo = {} }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', wilaya: '', commune: '', instagram: ''
  })
  const [errors, setErrors] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [showInstagram, setShowInstagram] = useState(false)
  const [pendingData, setPendingData] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Prénom requis'
    if (!form.lastName.trim()) e.lastName = 'Nom requis'
    if (!form.phone.trim()) e.phone = 'Téléphone requis'
    else if (!/^(0)(5|6|7)\d{8}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Numéro invalide (ex: 0551234567)'
    if (!form.wilaya) e.wilaya = 'Wilaya requise'
    if (!form.commune.trim()) e.commune = 'Commune requise'
    if (!form.instagram.trim()) e.instagram = 'Pseudo Instagram requis'
    else if (!isValidInstagram(form.instagram))
      e.instagram = 'Pseudo invalide (lettres, chiffres, . et _ uniquement, max 30 caractères)'
    return e
  }

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setPendingData(form)
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    setShowConfirm(false)
    await onSubmit(pendingData)
    setShowInstagram(true)
  }

  const igValue = form.instagram.replace(/^@/, '')
  const igValid = igValue.length > 0 && isValidInstagram(igValue)
  const igError = !!errors.instagram

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sf-text-soft text-xs font-600 uppercase tracking-wider mb-2">Prénom</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
              placeholder="Amina" autoComplete="given-name"
              className={`sf-input ${errors.firstName ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
            {errors.firstName && <p className="mt-1 text-red-400 text-xs">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block font-body text-sf-text-soft text-xs font-600 uppercase tracking-wider mb-2">Nom</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
              placeholder="Benali" autoComplete="family-name"
              className={`sf-input ${errors.lastName ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
            {errors.lastName && <p className="mt-1 text-red-400 text-xs">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="block font-body text-sf-text-soft text-xs font-600 uppercase tracking-wider mb-2">Téléphone</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange}
            placeholder="0551234567" autoComplete="tel" inputMode="numeric"
            className={`sf-input ${errors.phone ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
          {errors.phone && <p className="mt-1 text-red-400 text-xs">{errors.phone}</p>}
        </div>

        <div>
          <label className="block font-body text-sf-text-soft text-xs font-600 uppercase tracking-wider mb-2">Wilaya</label>
          <div className="relative">
            <select name="wilaya" value={form.wilaya} onChange={handleChange}
              className={`sf-select ${errors.wilaya ? 'border-red-300 ring-2 ring-red-100' : ''}`}>
              <option value="">Sélectionner une wilaya</option>
              {wilayas.map((w) => (
                <option key={w.code} value={w.name}>{w.code} — {w.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-sf-text-soft pointer-events-none" />
          </div>
          {errors.wilaya && <p className="mt-1 text-red-400 text-xs">{errors.wilaya}</p>}
        </div>

        <div>
          <label className="block font-body text-sf-text-soft text-xs font-600 uppercase tracking-wider mb-2">Commune</label>
          <input type="text" name="commune" value={form.commune} onChange={handleChange}
            placeholder="Votre commune" autoComplete="address-level2"
            className={`sf-input ${errors.commune ? 'border-red-300 ring-2 ring-red-100' : ''}`} />
          {errors.commune && <p className="mt-1 text-red-400 text-xs">{errors.commune}</p>}
        </div>

        {/* Pseudo Instagram */}
        <div>
          <label className="block font-body text-sf-text-soft text-xs font-600 uppercase tracking-wider mb-2">
            Pseudo Instagram *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-main font-bold text-sm pointer-events-none select-none">@</span>
            <input
              type="text" name="instagram" value={form.instagram} onChange={handleChange}
              placeholder="votre_pseudo" autoCapitalize="none" autoCorrect="off" spellCheck="false"
              className={`sf-input pl-8 ${
                igError ? 'border-red-300 ring-2 ring-red-100'
                : igValid ? 'border-green-400 ring-2 ring-green-100'
                : ''
              }`}
            />
            {igValid && !igError && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>
            )}
          </div>
          {igError && <p className="mt-1 text-red-400 text-xs">{errors.instagram}</p>}
          {igValid && !igError && (
            <p className="mt-1 text-green-500 text-xs">Pseudo valide ✓</p>
          )}
          {!igValid && !igError && form.instagram.length > 0 && (
            <p className="mt-1 text-amber-500 text-xs">Seuls les lettres, chiffres, . et _ sont autorisés</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-4">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-sf-text/20 border-t-sf-text rounded-full animate-spin" />
              Traitement...
            </span>
          ) : '🛍️ Confirmer la commande'}
        </button>
      </form>

      {/* Modale confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center">
                <ShoppingBag size={28} className="text-pink-main" />
              </div>
            </div>
            <h3 className="text-center font-extrabold text-text-dark text-lg mb-2">Confirmer votre commande ?</h3>
            <p className="text-center text-text-dark/60 text-sm mb-4">Vérifiez bien vos informations avant de valider.</p>
            <div className="bg-gray-50 rounded-2xl px-4 py-3 mb-4 text-sm space-y-1">
              <p className="text-text-dark/70"><span className="font-bold text-text-dark">Nom :</span> {pendingData?.firstName} {pendingData?.lastName}</p>
              <p className="text-text-dark/70"><span className="font-bold text-text-dark">Tél :</span> {pendingData?.phone}</p>
              <p className="text-text-dark/70"><span className="font-bold text-text-dark">Wilaya :</span> {pendingData?.wilaya}</p>
              <p className="text-text-dark/70"><span className="font-bold text-text-dark">Commune :</span> {pendingData?.commune}</p>
              <p className="text-text-dark/70"><span className="font-bold text-text-dark">Instagram :</span> @{pendingData?.instagram?.replace(/^@/, '')}</p>
            </div>
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6">
              <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 text-xs leading-relaxed">
                <span className="font-bold">Commande sérieuse uniquement.</span> Les fausses commandes nuisent directement au vendeur. Merci de votre respect.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleConfirm} disabled={loading}
                className="flex-1 bg-pink-main text-white font-bold py-3 rounded-2xl text-sm hover:bg-pink-main/90 transition-all active:scale-95 disabled:opacity-60">
                ✅ Oui, je confirme
              </button>
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 rounded-2xl text-sm hover:bg-gray-200 transition-all">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Instagram */}
      {showInstagram && (
        <InstagramRedirectModal
          orderInfo={{ ...pendingData, ...orderInfo }}
          onClose={() => setShowInstagram(false)}
        />
      )}
    </>
  )
}

export default CheckoutForm