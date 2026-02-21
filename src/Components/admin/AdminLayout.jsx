import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ClipboardList, LogOut, Menu, X, ChevronRight, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Produits', icon: Package },
  { to: '/admin/orders', label: 'Commandes', icon: ClipboardList },
  { to: '/admin/supplements', label: 'Suppléments', icon: Sparkles },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Déconnecté')
    navigate('/admin/login', { replace: true })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo Made By Marie */}
      <div className="flex flex-col items-center px-6 py-6 border-b border-pink-100">
        <img
          src="/images/logo.jpeg"
          alt="Made By Marie"
          className="w-20 h-20 object-contain mb-2"
        />
        <p className="text-pink-main font-extrabold text-base leading-tight text-center">Made By Marie</p>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-0.5">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
               ${isActive
                 ? 'bg-pink-main/10 text-pink-main border-l-2 border-pink-main'
                 : 'text-gray-500 hover:bg-pink-main/5 hover:text-pink-main border-l-2 border-transparent'
               }`
            }
          >
            <Icon size={16} />
            <span className="font-semibold text-sm flex-1">{label}</span>
            <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Déconnexion */}
      <div className="px-4 py-4 border-t border-pink-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400
                     hover:text-pink-main hover:bg-pink-main/5 transition-colors rounded-xl font-semibold text-sm"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-sky-soft flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-pink-100 flex-shrink-0 fixed h-full z-30 shadow-card">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-pink-main z-10"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-pink-100 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400 hover:text-pink-main">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <img src="/images/logo.jpeg" alt="Made By Marie" className="w-8 h-8 object-contain" />
            <span className="text-pink-main font-extrabold text-sm">Made By Marie</span>
          </div>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


