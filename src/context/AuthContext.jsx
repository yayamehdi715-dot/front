// src/contexts/AuthContext.jsx
// Contexte d'authentification admin avec JWT

import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Vérification du token au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken')
    if (storedToken) {
      verifyToken(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (tkn) => {
    try {
      const res = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${tkn}` },
      })
      setToken(tkn)
      setUser(res.data.user || { role: 'admin' })
    } catch {
      localStorage.removeItem('adminToken')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password })
    const { token: newToken, user: newUser } = res.data
    localStorage.setItem('adminToken', newToken)
    setToken(newToken)
    setUser(newUser || { role: 'admin' })
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, user, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext