// src/pages/admin/AdminSettingsPage.jsx
// Page pour modifier le nom d'utilisateur et le mot de passe admin

import { useState } from 'react'
import { Eye, EyeOff, Lock, User, Check, Loader2, Shield } from 'lucide-react'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const { user, login } = useAuth()

  const [form, setForm] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [saving, setSaving] = useState(false)

  const toggleShow = (field) => setShow((p) => ({ ...p, [field]: !p[field] }))

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.currentPassword) {
      return toast.error('Entrez votre mot de passe actuel')
    }

    if (!form.newUsername && !form.newPassword) {
      return toast.error('Entrez un nouveau nom d\'utilisateur ou un nouveau mot de passe')
    }

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      return toast.error('Les mots de passe ne correspondent pas')
    }

    if (form.newPassword && form.newPassword.length < 6) {
      return toast.error('Le mot de passe doit faire au moins 6 caractères')
    }

    setSaving(true)
    try {
      const payload = { currentPassword: form.currentPassword }
      if (form.newUsername.trim()) payload.newUsername = form.newUsername.trim()
      if (form.newPassword) payload.newPassword = form.newPassword

      const res = await api.put('/auth/credentials', payload)

      // Mettre à jour le token en localStorage avec le nouveau
      localStorage.setItem('adminToken', res.data.token)

      toast.success('Identifiants mis à jour ✅')

      // Réinitialiser le formulaire
      setForm({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur serveur')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">

      {/* En-tête */}
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-pink-main/60 mb-1">Sécurité</p>
        <h1 className="text-3xl font-extrabold text-text-dark">Paramètres</h1>
      </div>

      {/* Info compte actuel */}
      <div className="bg-pink-50 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-pink-main/10 rounded-full flex items-center justify-center flex-shrink-0">
          <Shield size={18} className="text-pink-main" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Connecté en tant que</p>
          <p className="text-text-dark font-extrabold">{user?.username || '—'}</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-3xl shadow-card p-6">
        <h2 className="font-extrabold text-text-dark mb-5 text-base">Modifier les identifiants</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Mot de passe actuel */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
              Mot de passe actuel *
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={show.current ? 'text' : 'password'}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe actuel"
                className="w-full pl-9 pr-10 py-3 rounded-2xl border-2 border-pink-100 text-sm text-text-dark outline-none focus:border-pink-main transition-all"
                required
              />
              <button type="button" onClick={() => toggleShow('current')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-main transition-colors">
                {show.current ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Nouveaux identifiants (laisser vide pour ne pas modifier)
            </p>

            {/* Nouveau nom d'utilisateur */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                Nouveau nom d'utilisateur
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="newUsername"
                  value={form.newUsername}
                  onChange={handleChange}
                  placeholder={user?.username || 'Nouveau nom d\'utilisateur'}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl border-2 border-pink-100 text-sm text-text-dark outline-none focus:border-pink-main transition-all"
                />
              </div>
            </div>

            {/* Nouveau mot de passe */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={show.new ? 'text' : 'password'}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-9 pr-10 py-3 rounded-2xl border-2 border-pink-100 text-sm text-text-dark outline-none focus:border-pink-main transition-all"
                />
                <button type="button" onClick={() => toggleShow('new')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-main transition-colors">
                  {show.new ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirmer nouveau mot de passe */}
            {form.newPassword && (
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={show.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Répétez le nouveau mot de passe"
                    className={`w-full pl-9 pr-10 py-3 rounded-2xl border-2 text-sm text-text-dark outline-none transition-all
                      ${form.confirmPassword
                        ? form.confirmPassword === form.newPassword
                          ? 'border-green-300 focus:border-green-400'
                          : 'border-red-200 focus:border-red-300'
                        : 'border-pink-100 focus:border-pink-main'
                      }`}
                  />
                  <button type="button" onClick={() => toggleShow('confirm')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-main transition-colors">
                    {show.confirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  {form.confirmPassword && form.confirmPassword === form.newPassword && (
                    <Check size={14} className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-pink-main text-white font-bold py-3.5 rounded-2xl text-sm
                       hover:bg-pink-main/90 transition-all flex items-center justify-center gap-2
                       disabled:opacity-60 active:scale-[0.98] mt-2"
          >
            {saving
              ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</>
              : <><Check size={16} /> Enregistrer les modifications</>
            }
          </button>
        </form>
      </div>

      {/* Note sécurité */}
      <div className="bg-pink-50 rounded-2xl p-4 flex items-start gap-3">
        <Shield size={16} className="text-pink-main flex-shrink-0 mt-0.5" />
        <p className="text-text-dark/60 text-xs leading-relaxed">
          Après modification, vous resterez connecté avec un nouveau token mis à jour automatiquement.
          Choisissez un mot de passe fort d'au moins 8 caractères avec des chiffres et des lettres.
        </p>
      </div>

    </div>
  )
}
