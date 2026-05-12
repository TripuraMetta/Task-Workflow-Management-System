import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fd_token'))
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('fd_user')) } catch { return null }
  })

  function login(token, userData) {
    setToken(token)
    setUser(userData)
    localStorage.setItem('fd_token', token)
    localStorage.setItem('fd_user', JSON.stringify(userData))
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('fd_token')
    localStorage.removeItem('fd_user')
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
