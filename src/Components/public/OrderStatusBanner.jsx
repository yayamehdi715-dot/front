// src/Components/public/OrderStatusBanner.jsx
// Banner persistant affiché au retour du client après une commande

import { useState, useEffect } from 'react'
import { X, Instagram, CheckCircle, Bell } from 'lucide-react'

const STORAGE_KEY = 'mbm_pending_order'
const EXPIRE_DAYS = 7

// ── Fonctions utilitaires localStorage ──────────────────────────────────────
export function saveOrder(orderData) {
  const data = {
    ...orderData,
    dmSent: false,
    timestamp: Date.now(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function markDmSent() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  const data = JSON.parse(raw)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, dmSent: true }))
}

export function clearOrder() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getPendingOrder() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    // Expirer après EXPIRE_DAYS jours
    if (Date.now() - data.timestamp > EXPIRE_DAYS * 24 * 60 * 60 * 1000) {
      clearOrder()
      return null
    }
    return data
  } catch {
    return null
  }
}

// ── Composant Banner ─────────────────────────────────────────────────────────
export default function OrderStatusBanner() {
  const [order, setOrder] = useState(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const data = getPendingOrder()
    if (data) {
      setOrder(data)
      // Délai léger pour l'animation d'entrée
      setTimeout(() => setVisible(true), 300)
    }
  }, [])

  if (!order || dismissed) return null

  const handleMarkDmSent = () => {
    markDmSent()
    setOrder((prev) => ({ ...prev, dmSent: true }))
  }

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(() => {
      setDismissed(true)
      clearOrder()
    }, 300)
  }

  // ── Banner : commande enregistrée, DM envoyé ──
  if (order.dmSent) {
    return (
      <div className={`mx-3 mt-3 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-green-800 font-bold text-sm">Commande enregistrée ✅</p>
            <p className="text-green-600 text-xs mt-0.5 leading-relaxed">
              Votre commande <span className="font-bold">{order.productName}</span> est bien reçue.
              On revient vers vous très bientôt. 🌸
            </p>
          </div>
          <button onClick={handleDismiss} className="text-green-400 hover:text-green-600 flex-shrink-0 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
    )
  }

  // ── Banner : rappel d'envoyer le DM Instagram ──
  return (
    <div className={`mx-3 mt-3 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
      <div className="bg-white border-2 border-pink-200 rounded-2xl shadow-card overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
              <Bell size={13} color="white" />
            </div>
            <p className="text-text-dark font-extrabold text-sm">Commande enregistrée ✅</p>
          </div>
          <button onClick={handleDismiss} className="text-gray-300 hover:text-gray-500 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Contenu */}
        <div className="px-4 pb-4">
          <p className="text-text-dark/70 text-xs leading-relaxed mb-3">
            Votre commande{' '}
            <span className="font-bold text-pink-main">{order.productName}</span>
            {' '}({order.total?.toLocaleString('fr-DZ')} DA) est bien enregistrée. 🌸
            <br />
            <span className="text-amber-600 font-semibold">
              ⚠️ Pour confirmer, envoyez-nous un message en privé sur Instagram si ce n'est pas encore fait !
            </span>
          </p>

          <div className="flex gap-2">
            {/* Bouton Instagram */}
            <a
              href="https://www.instagram.com/madeby_mariee/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleMarkDmSent}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-xs font-bold transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
            >
              <Instagram size={13} /> Envoyer le message
            </a>

            {/* Bouton "déjà envoyé" */}
            <button
              onClick={handleMarkDmSent}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 border-green-200 text-green-600 hover:bg-green-50 transition-all active:scale-95"
            >
              ✅ Déjà envoyé
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
