import { useEffect, useState } from 'react'

export interface AuthUser {
  id: number
  email: string
  name: string
  role: 'user' | 'admin'
  profilePicture?: string | null
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('authUser')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = (user: AuthUser) => {
    setUser(user)
    localStorage.setItem('authUser', JSON.stringify(user))
    localStorage.removeItem('guest_shipping_address')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authUser')
  }

  const updateUser = (updatedData: Partial<AuthUser>) => {
    if (user) {
      const newUser = { ...user, ...updatedData }
      setUser(newUser)
      localStorage.setItem('authUser', JSON.stringify(newUser))
    }
  }

  return {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    updateUser,
    loading
  }
}