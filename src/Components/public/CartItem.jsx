import { Trash2 } from 'lucide-react'
import QuantitySelector from './QuantitySelector'
import { useCart } from '../../context/CartContext'

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-soft">
      <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-sf-beige flex-shrink-0">
        {item.image
          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full" />}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="font-body text-sf-text-light text-xs mb-0.5">{item.brand}</p>
          <h4 className="font-display text-sf-text text-lg leading-tight">{item.name}</h4>
          <span className="inline-block mt-1 bg-sf-rose-soft text-sf-rose-dark
                           text-xs font-body font-600 px-2 py-0.5 rounded-full">
            Taille {item.size}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <QuantitySelector value={item.quantity} min={1} max={item.maxStock}
            onChange={(qty) => updateQuantity(item.key, qty)} />
          <div className="flex items-center gap-4">
            <span className="font-body font-700 text-sf-text">
              {(item.price * item.quantity).toLocaleString('fr-DZ')} DA
            </span>
            <button onClick={() => removeFromCart(item.key)}
              className="p-1.5 text-sf-text-light hover:text-red-400 transition-colors
                         hover:bg-red-50 rounded-lg">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem