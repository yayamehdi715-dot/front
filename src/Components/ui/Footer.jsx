import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useLang } from '../../context/LanguageContext'

function AdminSecretAccess() {
  const [clicks, setClicks] = useState(0)
  const [showInput, setShowInput] = useState(false)
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const handleClick = () => {
    const next = clicks + 1
    setClicks(next)
    if (next >= 3) { setShowInput(true); setClicks(0) }
  }

  const handleChange = (e) => {
    const val = e.target.value
    setValue(val)
    if (val.toLowerCase() === 'admin') {
      setShowInput(false); setValue(''); navigate('/admin/login')
    }
  }

  return (
    <div className="relative inline-block">
      <span onClick={handleClick} className="text-text-dark/30 text-xs cursor-default select-none">©</span>
      {showInput && (
        <input autoFocus type="text" value={value} onChange={handleChange}
          onBlur={() => { setShowInput(false); setValue(''); setClicks(0) }}
          className="absolute bottom-6 right-0 w-24 bg-white border border-pink-main/30
                     text-text-dark text-xs px-2 py-1 rounded-lg outline-none shadow-card"
          placeholder="..." />
      )}
    </div>
  )
}

function InstagramIcon({ size = 14 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  )
}

const FOOTER_TRANSLATIONS = {
  fr: {
    collections: 'Collections',
    info: 'Informations',
    history: 'Notre Histoire',
    delivery: 'Livraison Algérie',
    returns: 'Retour sous 7 jours',
    tagline: "Des fleurs d'exception pour des êtres d'exception",
    madeWith: 'Fait avec',
    cats: ['Bouquets Géants', 'Bouquets de Mariage', 'Bouquets Papillon', 'Décoration'],
  },
  en: {
    collections: 'Collections',
    info: 'Information',
    history: 'Our Story',
    delivery: 'Delivery in Algeria',
    returns: 'Returns within 7 days',
    tagline: 'Exceptional flowers for exceptional people',
    madeWith: 'Made with',
    cats: ['Giant Bouquets', 'Wedding Bouquets', 'Butterfly Bouquets', 'Decoration'],
  },
  ar: {
    collections: 'المجموعات',
    info: 'معلومات',
    history: 'قصتنا',
    delivery: 'التوصيل في الجزائر',
    returns: 'إرجاع خلال 7 أيام',
    tagline: 'زهور استثنائية لأشخاص استثنائيين',
    madeWith: 'صنع بـ',
    cats: ['باقات عملاقة', 'باقات الزفاف', 'باقات الفراشة', 'الديكور'],
  },
}

const CAT_KEYS = ['Bouquets Géants', 'Bouquets de Mariage', 'Bouquets Papillon', 'Décoration']

export default function Footer() {
  const { lang } = useLang()
  const ft = FOOTER_TRANSLATIONS[lang] || FOOTER_TRANSLATIONS.fr

  return (
    <footer className="bg-white border-t border-gray-100 pb-28">
      <div className="max-w-lg mx-auto px-6 py-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <svg width="40" height="30" viewBox="0 0 36 28" fill="none" className="mb-2">
            <ellipse cx="9" cy="10" rx="8" ry="6" fill="#4db8d4" opacity="0.8"/>
            <ellipse cx="27" cy="10" rx="8" ry="6" fill="#e8609a" opacity="0.8"/>
            <ellipse cx="10" cy="20" rx="7" ry="5" fill="#4db8d4" opacity="0.6"/>
            <ellipse cx="26" cy="20" rx="7" ry="5" fill="#e8609a" opacity="0.6"/>
            <line x1="18" y1="4" x2="18" y2="24" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <img src="/images/logo.jpeg" alt="Made By Marie" className="w-16 h-16 object-contain mb-2" />
          <p className="text-pink-main font-extrabold text-lg">Made By Marie</p>
          <p className="text-text-dark/50 text-xs mt-1">{ft.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-pink-main font-bold text-xs uppercase tracking-widest mb-3">{ft.collections}</p>
            <ul className="space-y-2">
              {CAT_KEYS.map((cat, i) => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`}
                    className="text-text-dark/60 text-xs hover:text-pink-main transition-colors">
                    {ft.cats[i]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-pink-main font-bold text-xs uppercase tracking-widest mb-3">{ft.info}</p>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-text-dark/60 text-xs hover:text-pink-main transition-colors">{ft.history}</Link></li>
              <li className="text-text-dark/60 text-xs">{ft.delivery}</li>
              <li className="text-text-dark/60 text-xs">{ft.returns}</li>
            </ul>
          </div>
        </div>

        {/* Instagram */}
        <div className="flex justify-center mb-5">
          <a href="https://www.instagram.com/madeby_mariee/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-pink-100
                       text-pink-main hover:bg-pink-50 transition-all text-xs font-bold">
            <InstagramIcon size={14} />
            @madeby_mariee
          </a>
        </div>

        {/* Bottom */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-center gap-1 text-text-dark/30 text-xs">
            <AdminSecretAccess />
            {' '}{new Date().getFullYear()} Made By Marie. {ft.madeWith}{' '}
            <Heart size={10} className="text-pink-main fill-pink-main" />
          </div>
          <div className="flex items-center justify-center">
            <a href="https://www.instagram.com/cvkdev/" target="_blank" rel="noopener noreferrer"
              className="text-text-dark/25 text-[10px] hover:text-text-dark/50 transition-colors">
              Developed by cvkDev
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
