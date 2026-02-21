import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import CartItem from '../../Components/public/CartItem'
import CheckoutForm, { InstagramRedirectModal } from '../../Components/public/CheckoutForm'
import api from '../../utils/api'
import { saveOrder } from '../../Components/public/OrderStatusBanner'
import toast from 'react-hot-toast'
import { useState } from 'react'

function CartPage() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [showInstagram, setShowInstagram] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)

  const handleOrder = async (customerInfo) => {
    if (items.length === 0) { toast.error('Votre panier est vide'); return }
    setSubmitting(true)
    try {
      await api.post('/orders', {
        customerInfo,
        items: items.map((item) => ({
          product: item.productId, name: item.name, size: item.size,
          quantity: item.quantity, price: item.price,
        })),
        total,
      })
      const orderData = { customerInfo, items: [...items], total }
      setLastOrder(orderData)
      // Sauvegarder pour le banner de retour
      saveOrder({
        productName: items.length === 1 ? items[0].name : `${items.length} articles`,
        total,
        instagram: customerInfo.instagram,
      })
      clearCart()
      setShowInstagram(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande.')
    } finally { setSubmitting(false) }
  }

  if (items.length === 0 && !showInstagram) return (
    <div className="min-h-screen bg-sf-cream pt-20 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-24 h-24 bg-sf-rose-soft rounded-full flex items-center
                        justify-center mx-auto mb-6 text-4xl">
          🛒
        </div>
        <h2 className="font-display text-sf-text text-3xl mb-2">Panier vide</h2>
        <p className="font-body text-sf-text-soft mb-8">
          Découvrez notre belle sélection
        </p>
        <Link to="/products" className="btn-primary">
          <ShoppingBag size={16} /> Découvrir la boutique
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-sf-cream pt-20">
      <div className="bg-gradient-to-r from-sf-rose-soft to-sf-cream border-b
                      border-sf-beige-dark py-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <button onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-sf-text-soft hover:text-sf-text
                       transition-colors text-sm font-body mb-4 group">
            <ArrowLeft size={14}
              className="group-hover:-translate-x-1 transition-transform" />
            Continuer mes achats
          </button>
          <p className="sf-label mb-2">Récapitulatif</p>
          <h1 className="font-display text-sf-text text-4xl">
            Mon panier 🛍️
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Articles */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="font-body text-sf-text-soft text-sm">
                {items.length} article{items.length !== 1 ? 's' : ''}
              </p>
              <button onClick={clearCart}
                className="flex items-center gap-1 text-sf-text-light hover:text-red-400
                           transition-colors text-xs font-body">
                <Trash2 size={12} /> Vider
              </button>
            </div>
            {items.map((item) => <CartItem key={item.key} item={item} />)}
          </div>

          {/* Résumé */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <p className="sf-label mb-4">Total</p>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.key} className="flex justify-between text-sm font-body">
                      <span className="text-sf-text-soft truncate mr-4 flex-1">
                        {item.name} ×{item.quantity}
                      </span>
                      <span className="text-sf-text whitespace-nowrap font-600">
                        {(item.price * item.quantity).toLocaleString('fr-DZ')} DA
                      </span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-sf-beige mb-4" />
                <div className="flex justify-between items-center">
                  <span className="font-body text-sf-text-soft text-sm">Total</span>
                  <span className="font-display text-sf-text text-3xl">
                    {total.toLocaleString('fr-DZ')} DA
                  </span>
                </div>
                <p className="text-sf-text-light text-xs font-body mt-1 text-right">
                  Paiement à la livraison
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-6">
                <p className="sf-label mb-5">Informations de livraison</p>
                <CheckoutForm onSubmit={handleOrder} loading={submitting} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modale Instagram après commande */}
      {showInstagram && lastOrder && (
        <InstagramRedirectModal
          orderInfo={{
            ...lastOrder.customerInfo,
            total: lastOrder.total,
            productName: lastOrder.items.map(i => `${i.name} ×${i.quantity}`).join(', '),
          }}
          onClose={() => { setShowInstagram(false); navigate('/products') }}
        />
      )}
    </div>
  )
}

export default CartPage