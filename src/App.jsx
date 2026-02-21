import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { useCart } from './context/CartContext'
import { useLang } from './context/LanguageContext'
import Navbar from './Components/ui/Navbar'
import OrderStatusBanner from './Components/public/OrderStatusBanner'
import Footer from './Components/ui/Footer'
import PrivateRoute from './Components/ui/PrivateRoute'
import AdminLayout from './Components/admin/AdminLayout'
import HomePage from './pages/public/HomePage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import CartPage from './pages/public/CartPage'
import ConfirmationPage from './pages/public/ConfirmationPage'
import AboutPage from './pages/public/AboutPage'
import TagProductsPage from './pages/public/TagProductsPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'
import AdminSupplementsPage from './pages/admin/AdminSupplementsPage'

/* ── Bottom Navigation Bar ── */
function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { itemCount } = useCart()
  const { t } = useLang()
  const path = location.pathname

  const tabs = [
    {
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#e8609a' : 'none'}
          stroke={active ? '#e8609a' : '#94a3b8'} strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      label: t.nav.home, href: '/'
    },
    {
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke={active ? '#e8609a' : '#94a3b8'} strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
      label: t.nav.explore, href: '/products'
    },
    {
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke={active ? '#e8609a' : '#94a3b8'} strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="8" strokeWidth="3" strokeLinecap="round"/>
          <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round"/>
        </svg>
      ),
      label: t.nav.about, href: '/about'
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-6 pb-6 pt-3 flex justify-around items-center shadow-lg">
      {tabs.map(({ icon, label, href }) => {
        const isActive = path === href || (href !== '/' && path.startsWith(href.split('?')[0]))
        return (
          <a key={href} href={href} className="flex flex-col items-center gap-1">
            {icon(isActive)}
            <span className={`text-[10px] font-semibold ${isActive ? 'text-pink-main' : 'text-slate-400'}`}>
              {label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-sky-soft">
      <Navbar />
      <OrderStatusBanner />
      <main className="flex-1 pb-24">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
          <AuthProvider>
        <CartProvider>
          <Toaster position="top-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#1a1a2e',
                border: '1px solid rgba(232,96,154,0.3)',
                borderRadius: '12px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#e8609a', secondary: '#fff' } },
              error: { iconTheme: { primary: '#e8609a', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
            <Route path="/products/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
            <Route path="/tag/:tag" element={<PublicLayout><TagProductsPage /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
            <Route path="/confirmation" element={<PublicLayout><ConfirmationPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="supplements" element={<AdminSupplementsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
          </LanguageProvider>
    </BrowserRouter>
  )
}