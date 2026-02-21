import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import api from '../../utils/api'
import ProductGrid from '../../Components/public/ProductGrid'

const TAG_INFO = {
  'look-bebe-printemps': {
    title: 'Look Bébé Printemps',
    description: 'Des tenues douces et printanières pour bébé',
    emoji: '🌸',
    color: 'bg-sf-rose-soft',
  },
  'look-femme-casual': {
    title: 'Look Femme Casual',
    description: 'Des ensembles décontractés et élégants',
    emoji: '🌿',
    color: 'bg-sf-sage-soft',
  },
  'idees-de-cadeaux': {
    title: 'Idées de cadeaux',
    description: 'Sélection spéciale cadeaux pour toute la famille',
    emoji: '🎁',
    color: 'bg-amber-50',
  },
}

function TagProductsPage() {
  const { tag } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const tagInfo = TAG_INFO[tag]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!tagInfo) {
      navigate('/')
      return
    }

    setLoading(true)
    api.get('/products')
      .then((res) => {
        const tagName = tagInfo.title
        const filtered = (res.data || []).filter(p => 
          p.tags && p.tags.includes(tagName)
        )
        setProducts(filtered)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [tag, tagInfo, navigate])

  if (!tagInfo) return null

  return (
    <div className="min-h-screen bg-sf-cream">
      {/* Header */}
      <section className={`${tagInfo.color} py-16 sm:py-24`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 mb-6 text-sf-text-soft 
                     hover:text-sf-text transition-colors font-body"
          >
            <ArrowLeft size={18} />
            Retour à l'accueil
          </button>
          
          <div className="max-w-3xl">
            <span className="text-6xl sm:text-7xl block mb-6 animate-fade-up">
              {tagInfo.emoji}
            </span>
            <h1 className="font-display text-sf-text text-4xl sm:text-5xl md:text-6xl mb-4 animate-fade-up"
                style={{ animationDelay: '100ms' }}>
              {tagInfo.title}
            </h1>
            <p className="font-body text-sf-text-soft text-lg sm:text-xl animate-fade-up"
               style={{ animationDelay: '200ms' }}>
              {tagInfo.description}
            </p>
            {!loading && (
              <p className="font-body text-sf-text mt-4 font-semibold animate-fade-up"
                 style={{ animationDelay: '300ms' }}>
                {products.length} produit{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        {loading ? (
          <ProductGrid products={[]} loading={true} />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-6">🔍</p>
            <h2 className="font-display text-sf-text text-2xl mb-3">
              Aucun produit trouvé
            </h2>
            <p className="font-body text-sf-text-soft mb-8">
              Cette collection est en cours de préparation
            </p>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Découvrir tous les produits
            </button>
          </div>
        ) : (
          <ProductGrid products={products} loading={false} />
        )}
      </section>
    </div>
  )
}

export default TagProductsPage