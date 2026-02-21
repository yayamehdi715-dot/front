import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, X, Menu } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useLang } from '../../context/LanguageContext'
import { LANGUAGES } from '../../i18n/translations'

export default function Navbar() {
  const { itemCount } = useCart()
  const { lang, t, changeLang } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const NAV_LINKS = [
    { to: '/products?category=Bouquets Géants',       label: t.nav.bouquetsGeants },
    { to: '/products?category=Bouquets de Mariage',   label: t.nav.bouquetsMariage },
    { to: '/products?category=Bouquets Papillon',     label: t.nav.bouquetsPapillon },
    { to: '/products?category=Bouquets Anniversaire', label: t.nav.bouquetsAnniversaire },
    { to: '/products?category=Bouquets Fiançailles',  label: t.nav.bouquetsFinancailles },
    { to: '/products?category=Décoration',            label: t.nav.decoration },
    { to: '/products?category=Mini Bouquet',          label: t.nav.miniBouquet },
    { to: '/about',                                    label: t.nav.notreHistoire },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-pink-100 px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between max-w-lg mx-auto">

          <button onClick={() => setMenuOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-text-dark">
            <Menu size={22} />
          </button>

          <Link to="/" className="flex flex-col items-center">
            <img src="/images/logo.jpeg" alt="Made By Marie" className="h-12 w-12 object-contain" />
            <span className="text-pink-main text-[10px] font-bold leading-none -mt-0.5">Made By Marie</span>
          </Link>

          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5 bg-gray-50 rounded-full px-1.5 py-1 border border-gray-100">
              {LANGUAGES.map(({ code, label }) => (
                <button key={code} onClick={() => changeLang(code)}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all
                    ${lang === code ? 'bg-pink-main text-white' : 'text-gray-400 hover:text-pink-main'}`}>
                  {label}
                </button>
              ))}
            </div>

            <button onClick={() => navigate('/cart')}
              className="relative w-9 h-9 flex items-center justify-center text-pink-main">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-main text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 animate-fade-in" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className={`absolute top-0 bottom-0 w-72 bg-white flex flex-col p-8 shadow-xl
              ${t.dir === 'rtl' ? 'right-0' : 'left-0'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="/images/logo.jpeg" alt="Made By Marie" className="w-10 h-10 object-contain" />
                <span className="text-pink-main font-extrabold">Made By Marie</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-pink-main">
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-2 mb-4 pb-4 border-b border-gray-100">
              {LANGUAGES.map(({ code, label, flag }) => (
                <button key={code} onClick={() => { changeLang(code); setMenuOpen(false) }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all
                    ${lang === code ? 'bg-pink-main text-white border-pink-main' : 'text-gray-400 border-gray-200 hover:border-pink-main hover:text-pink-main'}`}>
                  {flag} {label}
                </button>
              ))}
            </div>

            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                className="text-text-dark font-semibold text-base py-4 border-b border-gray-100 hover:text-pink-main transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
