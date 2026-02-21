// src/components/ui/PrivateRoute.jsx
// Protège les routes admin – redirige vers /admin/login si non authentifié

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-brand-gray-600 border-t-brand-red rounded-full animate-spin" />
          <span className="text-brand-gray-400 font-body tracking-widest uppercase text-sm">
            Vérification...
          </span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}

export default PrivateRoute