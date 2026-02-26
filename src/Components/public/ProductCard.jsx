import { Link } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'

// ✅ Demande à Cloudinary une version redimensionnée via l'URL (pas de crédit supplémentaire)
// Remplace /upload/ par /upload/w_400,q_auto:good,f_auto/ → image 4x plus légère pour les cards
function getOptimizedUrl(url, width = 400) {
  if (!url || !url.includes('cloudinary.com')) return url
  return url.replace('/upload/', `/upload/w_${width},q_auto:good,f_auto/`)
}

export default function ProductCard({ product }) {
  const { t } = useLang()
  const stock = product.stock ?? product.sizes?.[0]?.stock ?? 0
  const hasStock = stock > 0
  const imageUrl = getOptimizedUrl(product.images?.[0]) || '/placeholder.jpg'
  const hasSupplements = product.supplements?.length > 0
  const purchaseCount = product.purchaseCount ?? 0

  return (
    <Link to={`/products/${product._id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <img src={imageUrl} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy" />

          <div className="absolute top-2 left-2">
            <span className="bg-white/95 rounded-full px-2 py-0.5 text-[10px] font-bold text-pink-main shadow-sm">
              {t.categories[product.category] || product.category}
            </span>
          </div>

          {!hasStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-white font-bold text-gray-400 text-xs px-3 py-1 rounded-full shadow">
                {t.products.outOfStock}
              </span>
            </div>
          )}

          {hasSupplements && hasStock && (
            <div className="absolute bottom-2 right-2">
              <span className="bg-pink-main text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                {t.products.customizable}
              </span>
            </div>
          )}

          {/* Compteur d'achats */}
          {purchaseCount > 0 && (
            <div className="absolute top-2 right-2">
              <span className="bg-white/95 rounded-full px-2 py-0.5 text-[9px] font-bold text-teal-600 shadow-sm flex items-center gap-0.5">
                🔥 {purchaseCount} {t.products.timesPurchased}
              </span>
            </div>
          )}
        </div>

        <div className="p-3 text-center">
          <p className="text-pink-main font-bold text-sm leading-tight mb-1 line-clamp-2">{product.name}</p>
          <p className="text-text-dark/70 text-xs font-bold mb-2">
            {(product.price ?? 0).toLocaleString('fr-DZ')} DA
          </p>
          <div className="inline-block bg-teal-main text-white text-xs font-bold rounded-full px-4 py-1.5
                          group-hover:bg-teal-main/90 transition-all">
            {t.products.viewBouquet}
          </div>
        </div>
      </div>
    </Link>
  )
}
