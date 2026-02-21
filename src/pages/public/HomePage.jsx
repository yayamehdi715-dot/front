import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import ProductCard from '../../Components/public/ProductCard'
import { useLang } from '../../context/LanguageContext'

const IMG = {
  hero:         '/images/hero.jpg',
  geants:       '/images/Geant.jpg',
  mariage:      '/images/mariage.jpg',
  anniversaire: '/images/aniverssaire.jpg',
  fiancailles:  '/images/fiancail.webp',
  papillon:     '/images/papillion.jpg',
  portesCles:   '/images/main.jpg',
  decorations:  '/images/decojpg.jpg',
  minibouquet:  '/images/minibouquet.jpg',
  soutenance:   '/images/soutenance.jpg',    // 📌 Ajoute cette image dans /public/images/
  histoire:     '/images/main.jpg',
}

export default function HomePage() {
  const { t } = useLang()
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  const COLLECTIONS = [
    { label: t.categories['Bouquets Géants'],        img: IMG.geants,       tag: 'Bouquets Géants' },
    { label: t.categories['Bouquets de Mariage'],    img: IMG.mariage,      tag: 'Bouquets de Mariage' },
    { label: t.categories['Bouquets Anniversaire'],  img: IMG.anniversaire, tag: 'Bouquets Anniversaire' },
    { label: t.categories['Bouquets Fiançailles'],   img: IMG.fiancailles,  tag: 'Bouquets Fiançailles' },
    { label: t.categories['Soutenance'],             img: IMG.soutenance,   tag: 'Soutenance' },
  ]

  const ACCESSORIES = [
    { label: t.categories['Décoration'],   img: IMG.decorations, tag: 'Décoration' },
    { label: t.categories['Mini Bouquet'], img: IMG.minibouquet, tag: 'Mini Bouquet' },
  ]

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts((res.data || []).slice(0, 4)))
      .catch(() => {})
  }, [])

  return (
    <div className="bg-sky-soft font-display min-h-screen">

      {/* ── HERO ── */}
      <section className="relative bg-sky-light overflow-hidden mx-3 mt-3 rounded-3xl mb-4">
        <div className="flex items-center min-h-[210px] px-5 py-6">
          <div className="flex-1 z-10 pr-3">
            <h1 className="text-text-dark text-[22px] font-extrabold leading-tight mb-3">
              {t.home.heroTitle.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h1>
            <p className="text-text-dark/70 text-xs mb-5 max-w-[180px] leading-relaxed">
              {t.home.heroSub}
            </p>
            <button onClick={() => navigate('/products')}
              className="bg-pink-main text-white font-bold rounded-full px-5 py-2.5 text-sm shadow-md hover:bg-pink-main/90 transition-all active:scale-95">
              {t.home.discoverBtn}
            </button>
          </div>
          <div className="w-[46%] flex-shrink-0 relative">
            <img src={IMG.hero} alt="Bouquet de fleurs colorées"
              className="w-full h-48 object-cover rounded-2xl shadow-card" />
          </div>
        </div>
        <span className="absolute top-4 left-[47%] text-2xl pointer-events-none select-none">🦋</span>
        <span className="absolute bottom-4 right-3 text-xl pointer-events-none select-none opacity-70">🦋</span>
      </section>

      {/* ── NOS COLLECTIONS ── */}
      <section className="px-4 py-4">
        <h2 className="text-text-dark text-2xl font-extrabold mb-4 text-center">{t.home.collections}</h2>
        <div className="grid grid-cols-2 gap-3">
          {COLLECTIONS.map(({ label, img, tag }) => (
            <div key={tag} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img src={img} alt={label}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="p-3 text-center">
                <p className="text-pink-main font-bold text-sm mb-2 leading-tight">{label}</p>
                <Link to={`/products?category=${encodeURIComponent(tag)}`}
                  className="inline-block bg-teal-main text-white text-xs font-bold rounded-full px-3 py-1.5 hover:bg-teal-main/90 transition-all active:scale-95">
                  {t.home.discoverCollection}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOUQUETS PAPILLON ── */}
      <section className="px-4 py-4">
        <div className="bg-pink-light rounded-3xl overflow-hidden relative">
          <div className="relative">
            <img src={IMG.papillon} alt="Bouquets Papillon" className="w-full h-60 object-cover" />
            <span className="absolute top-4 right-5 text-5xl pointer-events-none select-none">🦋</span>
            <span className="absolute top-20 right-20 text-3xl pointer-events-none select-none opacity-80">🦋</span>
            <span className="absolute bottom-4 left-6 text-2xl pointer-events-none select-none opacity-60">🦋</span>
          </div>
          <div className="p-5">
            <h2 className="text-text-dark text-3xl font-extrabold leading-tight mb-4">
              {t.home.papillonTitle.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
            <button onClick={() => navigate('/products?category=Bouquets Papillon')}
              className="w-full bg-pink-main text-white font-bold rounded-full px-6 py-3 text-sm shadow-md hover:bg-pink-main/90 transition-all active:scale-95">
              {t.home.explorePapillon}
            </button>
          </div>
        </div>
      </section>

      {/* ── DÉCORATION & MINI BOUQUETS ── */}
      <section className="px-4 py-4">
        <h2 className="text-text-dark text-2xl font-extrabold mb-4">{t.home.decoMini}</h2>
        <div className="grid grid-cols-1 gap-3">
          {ACCESSORIES.map(({ label, img, tag }) => (
            <Link key={tag} to={`/products?category=${encodeURIComponent(tag)}`}
              className="bg-white rounded-2xl shadow-card overflow-hidden group flex items-center gap-4 p-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={img} alt={label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div>
                <p className="text-pink-main font-bold text-base">{label}</p>
                <p className="text-text-dark/50 text-xs mt-0.5">{t.home.discoverCollection} →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HISTOIRE ── */}
      <section className="px-4 py-4">
        <h2 className="text-text-dark text-2xl font-extrabold mb-4">{t.home.history}</h2>
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <img src={IMG.histoire} alt="Atelier fleuriste" className="w-full h-40 object-cover" />
          <div className="p-5">
            <p className="text-pink-main font-extrabold text-base mb-3">Made by marie</p>
            <p className="text-text-dark/70 text-sm leading-relaxed mb-3">
              {t.home.historyP1a}{' '}
              <span className="text-pink-main font-bold">{t.home.historyP1b}</span>
              {t.home.historyP1c}
            </p>
            <p className="text-text-dark/70 text-sm leading-relaxed mb-3">
              {t.home.historyP2a}{' '}
              <span className="text-pink-main font-bold">{t.home.historyP2b}</span>
              {', '}
              {t.home.historyP2c}{' '}
              <span className="text-pink-main font-bold">{t.home.historyP2d}</span>
              {t.home.historyP2e}
            </p>
            <p className="text-text-dark/70 text-sm leading-relaxed mb-3">
              {t.home.historyP3}
            </p>
            <p className="text-text-dark/60 italic text-sm border-l-4 border-pink-main/40 pl-3 py-1 mb-4">
              "{t.home.historyQuote}"
            </p>
            <Link to="/about"
              className="inline-block bg-teal-main text-white font-bold rounded-full px-6 py-2.5 text-sm hover:bg-teal-main/90 transition-all">
              {t.nav.notreHistoire}
            </Link>
          </div>
        </div>
      </section>

      {/* ── NOUVEAUTÉS ── */}
      {products.length > 0 && (
        <section className="px-4 py-4">
          <h2 className="text-text-dark text-2xl font-extrabold mb-4">{t.home.newArrivals}</h2>
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

    </div>
  )
}
