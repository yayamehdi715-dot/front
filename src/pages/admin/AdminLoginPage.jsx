import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      toast.error('Identifiants requis')
      return
    }
    setLoading(true)
    try {
      await login(form.username, form.password)
      toast.success('Connexion réussie 🌸')
      navigate(from, { replace: true })
    } catch {
      toast.error('Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sky-soft flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/images/logo.jpeg"
            alt="Made By Marie"
            className="w-24 h-24 object-contain mb-3"
          />
          <h1 className="text-pink-main text-2xl font-extrabold">Made By Marie</h1>
          <p className="text-gray-400 text-sm mt-1">Espace administrateur</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-3xl shadow-card p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-text-dark text-sm font-bold mb-2">Identifiant</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                className="w-full bg-sky-soft border border-pink-100 rounded-xl px-4 py-3 text-sm
                           outline-none focus:border-pink-main focus:ring-2 focus:ring-pink-main/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-text-dark text-sm font-bold mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-sky-soft border border-pink-100 rounded-xl px-4 py-3 pr-10 text-sm
                             outline-none focus:border-pink-main focus:ring-2 focus:ring-pink-main/20 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-main">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-pink-main text-white font-bold rounded-full py-3.5 text-sm
                         shadow-md hover:bg-pink-main/90 transition-all active:scale-95
                         disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}