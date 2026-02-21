import ProductCard from './ProductCard.jsx'

function ProductGrid({ products, loading, emptyMessage = 'Aucun article trouvé.' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-soft">
            <div className="aspect-[3/4] bg-sf-beige animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-sf-beige animate-pulse rounded-full w-1/2" />
              <div className="h-4 bg-sf-beige animate-pulse rounded-full w-3/4" />
              <div className="h-4 bg-sf-beige animate-pulse rounded-full w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-sf-rose-soft rounded-full flex items-center
                        justify-center mb-6">
          <span className="text-3xl">🛍️</span>
        </div>
        <p className="font-display text-sf-text text-2xl mb-2">Aucun article</p>
        <p className="font-body text-sf-text-soft text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, i) => (
        <div key={product._id} className="animate-fade-up"
          style={{ animationDelay: `${i * 60}ms` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductGrid