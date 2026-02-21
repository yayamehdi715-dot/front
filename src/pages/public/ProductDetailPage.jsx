import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, ChevronLeft, ChevronRight, ArrowLeft, Plus, Minus, Zap, X, ChevronDown, AlertTriangle } from 'lucide-react'
import api from '../../utils/api'
import { useCart } from '../../context/CartContext'
import { useLang } from '../../context/LanguageContext'
import toast from 'react-hot-toast'
import wilayas from '../../data/wilayas'
import { InstagramRedirectModal } from '../../Components/public/CheckoutForm'
import { saveOrder, markDmSent } from '../../Components/public/OrderStatusBanner'

const SUPPLEMENT_ICONS = {
  'Petite couronne': '👑',
  'Couronne royale': '🏆',
  'Papillon doré': '🦋',
  "Papillon d'argent": '🪽',
  'Lettre': '🔤',
  'Prénom complet': '✍️',
  'Écriture sur ruban': '🎀',
  'Lumière blanche': '💡',
  'Lumière jaune': '✨',
}

function DirectBuyForm({ product, quantity, supplements, suppPrices = {}, onClose }) {
  const { t } = useLang()
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', wilaya: '', commune: '', instagram: '' })
  const isValidInstagram = (val) => /^[a-zA-Z0-9._]{1,30}$/.test(val.replace(/^@/, ''))
  const [errors, setErrors] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [showInstagram, setShowInstagram] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [pendingData, setPendingData] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = t.form.errors.firstName
    if (!form.lastName.trim()) e.lastName = t.form.errors.lastName
    if (!form.phone.trim()) e.phone = t.form.errors.phone
    else if (!/^(0)(5|6|7)\d{8}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = t.form.errors.phoneInvalid
    if (!form.wilaya) e.wilaya = t.form.errors.wilaya
    if (!form.commune.trim()) e.commune = t.form.errors.commune
    if (!form.instagram.trim()) e.instagram = t.form.errors.instagram
    else if (!/^[a-zA-Z0-9._]{1,30}$/.test(form.instagram.replace(/^@/, '')))
      e.instagram = t.form.errors.instagramInvalid
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setPendingData(form)
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      await api.post('/orders', {
        customerInfo: pendingData,
        items: [{
          product: product._id,
          name: product.name,
          size: supplements.length > 0 ? `+ ${supplements.join(', ')}` : 'Unique',
          quantity,
          price: product.price,
        }],
        total: (product.price + supplements.reduce((sum, s) => sum + (suppPrices[s] || 0), 0)) * quantity,
      })
      setShowConfirm(false)
      // Sauvegarder la commande dans localStorage pour le banner de retour
      saveOrder({
        productName: product.name,
        total: (product.price + supplements.reduce((sum, s) => sum + (suppPrices[s] || 0), 0)) * quantity,
        instagram: pendingData.instagram,
      })
      setShowInstagram(true)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la commande')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-2xl border-2 text-sm text-text-dark outline-none transition-all ${errors[field] ? 'border-red-300 ring-2 ring-red-100' : 'border-pink-100 focus:border-pink-main'}`

  return (
    <>
      <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/50 backdrop-blur-sm">
        <div className="bg-white w-full rounded-t-3xl shadow-2xl flex flex-col" style={{maxHeight: 'calc(100dvh - 80px)'}}>
          <div className="flex-shrink-0 bg-white rounded-t-3xl px-6 pt-6 pb-3 flex items-center justify-between border-b border-gray-100">
            <div>
              <p className="text-xs text-pink-main font-bold uppercase tracking-widest">{t.detail.directBuy}</p>
              <h3 className="font-extrabold text-text-dark text-lg">{product.name}</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all">
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1" style={{paddingBottom: '2rem'}}>
            <div className="flex items-center gap-3 bg-pink-50 rounded-2xl p-3">
              {product.images?.[0] && <img src={product.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text-dark text-sm truncate">{product.name}</p>
                <p className="text-text-dark/50 text-xs">Qté : {quantity} • {(product.price * quantity).toLocaleString('fr-DZ')} DA</p>
                {supplements.length > 0 && <p className="text-pink-main text-xs truncate">✨ {supplements.join(', ')}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.form.firstName}</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Amina" className={inputClass('firstName')} />
                {errors.firstName && <p className="mt-1 text-red-400 text-xs">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.form.lastName}</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Benali" className={inputClass('lastName')} />
                {errors.lastName && <p className="mt-1 text-red-400 text-xs">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.form.phone}</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="0551234567" inputMode="numeric" className={inputClass('phone')} />
              {errors.phone && <p className="mt-1 text-red-400 text-xs">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.form.wilaya}</label>
              <div className="relative">
                <select name="wilaya" value={form.wilaya} onChange={handleChange} className={inputClass('wilaya') + ' appearance-none'}>
                  <option value="">{t.form.selectWilaya}</option>
                  {wilayas.map((w) => <option key={w.code} value={w.name}>{w.code} — {w.name}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.wilaya && <p className="mt-1 text-red-400 text-xs">{errors.wilaya}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.form.commune}</label>
              <input type="text" name="commune" value={form.commune} onChange={handleChange} placeholder={t.form.communePlaceholder} className={inputClass('commune')} />
              {errors.commune && <p className="mt-1 text-red-400 text-xs">{errors.commune}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t.form.instagramPseudo}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-main font-bold text-sm pointer-events-none">@</span>
                <input type="text" name="instagram" value={form.instagram} onChange={handleChange}
                  placeholder="votre_pseudo" autoCapitalize="none" autoCorrect="off" spellCheck="false"
                  className={inputClass('instagram') + ' pl-8'} />
                {form.instagram && isValidInstagram(form.instagram) && !errors.instagram && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>
                )}
              </div>
              {errors.instagram && <p className="mt-1 text-red-400 text-xs">{errors.instagram}</p>}
            </div>

            <button onClick={handleSubmit}
              className="w-full bg-pink-main text-white font-bold py-4 rounded-2xl text-sm hover:bg-pink-main/90 transition-all active:scale-95 flex items-center justify-center gap-2">
              <Zap size={16} /> {t.detail.orderNow}
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7">
            <h3 className="text-center font-extrabold text-text-dark text-lg mb-2">{t.detail.confirmOrder}</h3>
            <p className="text-center text-text-dark/60 text-sm mb-4">{t.detail.confirmSub}</p>
            <div className="bg-gray-50 rounded-2xl px-4 py-3 mb-4 text-sm space-y-1">
              <p><span className="font-bold">{t.detail.name} :</span> {pendingData?.firstName} {pendingData?.lastName}</p>
              <p><span className="font-bold">{t.detail.phone} :</span> {pendingData?.phone}</p>
              <p><span className="font-bold">{t.detail.wilaya} :</span> {pendingData?.wilaya}</p>
              <p><span className="font-bold">{t.detail.commune} :</span> {pendingData?.commune}</p>
              <p><span className="font-bold">{t.detail.instagram} :</span> @{pendingData?.instagram?.replace(/^@/, '')}</p>
            </div>
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5">
              <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 text-xs leading-relaxed">
                <span className="font-bold">{t.detail.warningFake}</span> {t.detail.warningFakeSub}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleConfirm} disabled={submitting}
                className="flex-1 bg-pink-main text-white font-bold py-3 rounded-2xl text-sm hover:bg-pink-main/90 transition-all active:scale-95 disabled:opacity-60">
                {t.detail.yesConfirm}
              </button>
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 rounded-2xl text-sm hover:bg-gray-200 transition-all">
                {t.detail.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {showInstagram && (
        <InstagramRedirectModal
          orderInfo={{
            ...pendingData,
            productName: product.name,
            quantity,
            supplements,
            total: (product.price + supplements.reduce((sum, s) => sum + (suppPrices[s] || 0), 0)) * quantity,
          }}
          onClose={() => { setShowInstagram(false); onClose() }}
        />
      )}
    </>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { t } = useLang()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedSupplements, setSelectedSupplements] = useState([])
  const [showBuyForm, setShowBuyForm] = useState(false)
  const [suppPrices, setSuppPrices] = useState({})

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  useEffect(() => {
    api.get('/supplements').then(r => {
      const map = {}
      r.data.forEach(s => { map[s.name] = s.price })
      setSuppPrices(map)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-sky-soft flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-pink-light border-t-pink-main rounded-full animate-spin" />
    </div>
  )
  if (!product) return null

  const maxStock = product.stock ?? product.sizes?.[0]?.stock ?? 1
  const images = product.images?.length > 0 ? product.images : ['/placeholder.jpg']
  const supplements = product.supplements || []
  const purchaseCount = product.purchaseCount ?? 0

  const toggleSupplement = (s) => {
    setSelectedSupplements((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  const handleAddToCart = () => {
    const sizeLabel = selectedSupplements.length > 0
      ? `+ ${selectedSupplements.join(', ')}`
      : 'Unique'
    addToCart({ ...product, supplements: selectedSupplements }, sizeLabel, quantity, suppPrices)
    toast.success(`${product.name} ajouté au panier ! 🌸`)
  }

  return (
    <div className="min-h-screen bg-sky-soft font-display">
      <div className="px-4 pt-4 pb-2">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-400 hover:text-pink-main transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> {t.detail.back}
        </button>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-10">

        {/* Galerie */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-card mb-4 group">
          <img src={images[currentImage]} alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />

          {images.length > 1 && (
            <>
              <button onClick={() => setCurrentImage((i) => (i === 0 ? images.length - 1 : i - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-card hover:bg-white transition-colors">
                <ChevronLeft size={16} className="text-text-dark" />
              </button>
              <button onClick={() => setCurrentImage((i) => (i === images.length - 1 ? 0 : i + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-card hover:bg-white transition-colors">
                <ChevronRight size={16} className="text-text-dark" />
              </button>
            </>
          )}

          <div className="absolute top-3 left-3">
            <span className="bg-white/95 rounded-full px-3 py-1 text-xs font-bold text-pink-main shadow-sm">
              {t.categories[product.category] || product.category}
            </span>
          </div>

          {/* Compteur d'achats sur l'image */}
          {purchaseCount > 0 && (
            <div className="absolute top-3 right-3">
              <span className="bg-white/95 rounded-full px-3 py-1 text-xs font-bold text-teal-600 shadow-sm">
                🔥 {purchaseCount} {t.detail.timesPurchased}
              </span>
            </div>
          )}

          {maxStock <= 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-white font-bold text-gray-500 px-4 py-2 rounded-full shadow">{t.detail.outOfStock}</span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mb-4">
            {images.map((img, i) => (
              <button key={i} onClick={() => setCurrentImage(i)}
                className={`aspect-square w-14 rounded-xl overflow-hidden border-2 transition-all
                  ${i === currentImage ? 'border-pink-main' : 'border-transparent opacity-50'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Carte info */}
        <div className="bg-white rounded-3xl shadow-card p-5 flex flex-col gap-5">

          <div>
            <h1 className="text-text-dark text-2xl font-extrabold leading-tight mb-2">{product.name}</h1>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-pink-main font-extrabold text-2xl">
                  {((product.price ?? 0) + selectedSupplements.reduce((s, n) => s + (suppPrices[n] || 0), 0)).toLocaleString('fr-DZ')} DA
                </span>
                {selectedSupplements.length > 0 && (
                  <p className="text-gray-400 text-xs mt-0.5">
                    {(product.price ?? 0).toLocaleString('fr-DZ')} DA + {selectedSupplements.reduce((s, n) => s + (suppPrices[n] || 0), 0).toLocaleString('fr-DZ')} DA {t.detail.supplements}
                  </p>
                )}
              </div>
              {maxStock > 0 && (
                <span className="text-xs text-gray-400 font-semibold">{maxStock} {t.detail.inStock}</span>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Suppléments */}
          {supplements.length > 0 && (
            <div>
              <p className="text-text-dark text-sm font-bold mb-3">
                {t.detail.personalize}
                {selectedSupplements.length > 0 && (
                  <span className="ml-2 text-pink-main">
                    ({selectedSupplements.length} {selectedSupplements.length > 1 ? t.detail.chosens : t.detail.chosen})
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {supplements.map((s) => (
                  <button key={s} onClick={() => toggleSupplement(s)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border-2 transition-all
                      ${selectedSupplements.includes(s)
                        ? 'bg-pink-main text-white border-pink-main shadow-sm scale-105'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-pink-main hover:text-pink-main'
                      }`}>
                    <span>{SUPPLEMENT_ICONS[s] || '✨'}</span>
                    {s}
                  </button>
                ))}
              </div>
              {selectedSupplements.length > 0 && (
                <button onClick={() => setSelectedSupplements([])}
                  className="mt-2 text-xs text-gray-400 hover:text-pink-main transition-colors underline">
                  {t.detail.deselectAll}
                </button>
              )}
            </div>
          )}

          {/* Quantité */}
          <div>
            <p className="text-text-dark text-sm font-bold mb-3">{t.detail.quantity}</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-pink-main hover:text-pink-main transition-all">
                <Minus size={14} />
              </button>
              <span className="text-text-dark font-extrabold text-xl w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-pink-main hover:text-pink-main transition-all">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <button onClick={() => setShowBuyForm(true)} disabled={maxStock <= 0}
              className="flex-1 bg-pink-main text-white font-bold rounded-full py-4 text-sm shadow-md hover:bg-pink-main/90 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Zap size={16} />
              {maxStock <= 0 ? t.detail.outOfStock : t.detail.buy}
            </button>
            <button onClick={handleAddToCart} disabled={maxStock <= 0}
              className="flex-1 bg-white text-pink-main border-2 border-pink-main font-bold rounded-full py-4 text-sm hover:bg-pink-50 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart size={16} />
              {t.detail.addToCart}
            </button>
          </div>

          {/* Livraison */}
          <div className="bg-sky-soft rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">🚚</span>
            <div>
              <p className="font-bold text-text-dark text-sm">{t.detail.delivery}</p>
              <p className="text-gray-400 text-xs mt-0.5">{t.detail.deliverySub}</p>
            </div>
          </div>
        </div>
      </div>

      {showBuyForm && (
        <DirectBuyForm
          product={product}
          quantity={quantity}
          supplements={selectedSupplements}
          suppPrices={suppPrices}
          onClose={() => setShowBuyForm(false)}
        />
      )}
    </div>
  )
}
