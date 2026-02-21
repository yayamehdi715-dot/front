import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import api from '../../utils/api'
import ProductCard from '../../Components/public/ProductCard'
import { useLang } from '../../context/LanguageContext'

const CATEGORY_KEYS = [
  'all',
  'Bouquets Géants',
  'Bouquets de Mariage',
  'Bouquets Papillon',
  'Bouquets Anniversaire',
  'Bouquets Fiançailles',
  'Décoration',
  'Mini Bouquet',
  'Soutenance',
]

export default function ProductsPage() {
  const { t } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const activeCategory = searchParams.get('category') || 'all'

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => products.filter((p) => {
    const matchCat = activeCategory === 'all' || activeCategory === 'Tous' || p.category === activeCategory
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  }), [products, activeCategory, search])

  const setCategory = (cat) => {
    if (cat === 'all') searchParams.delete('category')
    else searchParams.set('category', cat)
    setSearchParams(searchParams)
  }

  const count = filtered.length
  const countLabel = `${count} ${count !== 1 ? t.products.articles : t.products.article}`

  // Titre de la page
  const pageTitle = activeCategory === 'all' || activeCategory === 'Tous'
    ? t.products.title
    : (t.categories[activeCategory] || activeCategory)

  return (
    <div className="min-h-screen bg-sky-soft font-display">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-text-dark text-2xl font-extrabold mb-1">{pageTitle}</h1>
        <p className="text-text-dark/50 text-sm">{loading ? '...' : countLabel}</p>
      </div>

      <div className="sticky top-[60px] z-40 bg-sky-soft/95 backdrop-blur-sm px-4 py-2 border-b border-white/50">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORY_KEYS.map((key) => {
            const label = key === 'all' ? t.categories.all : (t.categories[key] || key)
            const isActive = key === 'all'
              ? (activeCategory === 'all' || activeCategory === 'Tous')
              : activeCategory === key
            return (
              <button key={key} onClick={() => setCategory(key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all
                  ${isActive ? 'bg-pink-main text-white shadow-md' : 'bg-white text-text-dark/70 hover:bg-pink-light hover:text-pink-main'}`}>
                {label}
              </button>
            )
          })}
        </div>

        <div className="relative mt-2">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t.products.searchPlaceholder}
            className="w-full bg-white border border-white rounded-full text-text-dark text-sm pl-8 pr-8 py-2.5 outline-none focus:border-pink-main/50 transition-all" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-5">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-pink-light border-t-pink-main rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-text-dark/40 text-sm">Aucun article trouvé.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
