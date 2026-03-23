// src/pages/admin/AdminDashboardPage.jsx
import { useState, useEffect } from 'react'
import { TrendingUp, Package, RefreshCcw, ShoppingBag, AlertTriangle, Loader2, Clock, Truck, RotateCcw, XCircle, CheckCircle, BadgeCheck } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, color = 'text-brand-white', accent }) {
  return (
    <div className={`admin-card relative overflow-hidden ${accent ? 'border-brand-red/30' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-brand-gray-500 text-xs font-heading font-semibold tracking-widest uppercase mb-2">
            {label}
          </p>
          <p className={`font-display text-4xl leading-none ${color}`}>
            {value ?? '—'}
          </p>
        </div>
        <div className={`w-10 h-10 flex items-center justify-center border ${
          accent ? 'border-brand-red/30 text-brand-red bg-brand-red/5' : 'border-brand-gray-700 text-brand-gray-600'
        }`}>
          <Icon size={18} />
        </div>
      </div>
      {accent && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red/50" />}
    </div>
  )
}

const STATUS_CONFIG = [
  { key: 'pendingOrders',    label: 'En attente',   icon: Clock,        color: 'text-gray-300',    bar: 'bg-gray-400',    pill: 'bg-gray-500/30 text-gray-200 border border-gray-400/40' },
  { key: 'confirmedOrders',  label: 'Confirmé',     icon: BadgeCheck,   color: 'text-blue-300',    bar: 'bg-blue-400',    pill: 'bg-blue-500/30 text-blue-200 border border-blue-400/50' },
  { key: 'inDeliveryOrders', label: 'En livraison', icon: Truck,        color: 'text-yellow-300',  bar: 'bg-yellow-400',  pill: 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/50' },
  { key: 'deliveredOrders',  label: 'Livré',        icon: CheckCircle,  color: 'text-emerald-300', bar: 'bg-emerald-400', pill: 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50' },
  { key: 'returnOrders',     label: 'Retour',       icon: RotateCcw,    color: 'text-orange-300',  bar: 'bg-orange-400',  pill: 'bg-orange-500/30 text-orange-200 border border-orange-400/50' },
  { key: 'cancelledOrders',  label: 'Annulé',       icon: XCircle,      color: 'text-red-300',     bar: 'bg-red-400',     pill: 'bg-red-500/30 text-red-200 border border-red-400/50' },
]

function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/stats')
      setStats(res.data)
    } catch {
      toast.error('Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const handleReset = async () => {
    setResetting(true)
    try {
      await api.post('/admin/stats/reset')
      toast.success('Statistiques réinitialisées')
      setShowConfirm(false)
      await fetchStats()
    } catch {
      toast.error('Erreur lors de la réinitialisation')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* En-tête */}
      <div className="flex items-end justify-between">
        <div>
          <p className="section-label">Vue d'ensemble</p>
          <h1 className="font-display text-4xl text-brand-white tracking-wide">DASHBOARD</h1>
        </div>
        <button onClick={() => setShowConfirm(true)} className="btn-ghost flex items-center gap-2 text-xs">
          <RefreshCcw size={12} />
          Réinitialiser les stats
        </button>
      </div>

      {/* Stats principales */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="admin-card h-24 animate-pulse">
              <div className="h-3 bg-brand-gray-700 rounded w-2/3 mb-3" />
              <div className="h-8 bg-brand-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={TrendingUp}
            label="Gains (livrés)"
            value={stats?.totalRevenue != null ? `${stats.totalRevenue.toLocaleString('fr-DZ')} DA` : '—'}
            color="text-emerald-400"
            accent
          />
          <StatCard icon={ShoppingBag} label="Total commandes" value={stats?.totalOrders} />
          <StatCard icon={Package}     label="Livrées"         value={stats?.deliveredOrders}  color="text-emerald-400" />
          <StatCard icon={RotateCcw}   label="Retours"         value={stats?.returnOrders}     color="text-orange-400" />
        </div>
      )}

      {/* Répartition par statut */}
      {!loading && stats && (
        <div className="admin-card space-y-5">
          <p className="text-brand-gray-400 text-xs font-heading font-semibold tracking-widest uppercase">
            Répartition par statut
          </p>

          <div className="space-y-3">
            {STATUS_CONFIG.map(({ key, label, icon: Icon, color, bar, pill }) => {
              const count = stats[key] ?? 0
              const total = stats.totalOrders || 1
              const pct   = Math.round((count / total) * 100)

              return (
                <div key={key} className="flex items-center gap-4">
                  {/* Label + icône */}
                  <div className="flex items-center gap-2 w-36 flex-shrink-0">
                    <Icon size={13} className={color} />
                    <span className="text-brand-gray-300 text-xs font-heading font-semibold tracking-wide">{label}</span>
                  </div>

                  {/* Barre de progression */}
                  <div className="flex-1 h-1.5 bg-brand-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Compteur + % */}
                  <div className="flex items-center gap-2 w-20 justify-end flex-shrink-0">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pill}`}>
                      {count}
                    </span>
                    <span className="text-brand-gray-600 text-xs w-8 text-right">{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Modal confirmation reset */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-brand-gray-900 border border-brand-gray-700 p-6 max-w-md w-full animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-brand-red" />
              <h3 className="font-heading font-bold text-brand-white tracking-wider">Confirmation</h3>
            </div>
            <p className="text-brand-gray-300 font-body mb-2">
              Cette action va supprimer toutes les commandes avec le statut{' '}
              <span className="text-emerald-400 font-semibold">livré</span> et{' '}
              <span className="text-orange-400 font-semibold">retour</span>.
            </p>
            <p className="text-brand-gray-500 text-sm font-body mb-6">Cette opération est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={handleReset} disabled={resetting}
                className="btn-primary flex items-center gap-2 flex-1 justify-center">
                {resetting && <Loader2 size={14} className="animate-spin" />}
                Confirmer
              </button>
              <button onClick={() => setShowConfirm(false)} className="btn-ghost flex-1">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage
