import { useEffect, useState } from 'react';

export interface AuthUser {
  id: number
  email: string
  name: string
  role: 'user' | 'admin'
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('authUser')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = (user: AuthUser) => {
    setUser(user)
    localStorage.setItem('authUser', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authUser')
  }

  return { user, login, logout }
}