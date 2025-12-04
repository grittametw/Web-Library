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
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser')
    const storedToken = localStorage.getItem('authToken')
    
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    if (storedToken) {
      setToken(storedToken)
    }
    
    setLoading(false)
  }, [])

  const login = (userData: AuthUser, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('authUser', JSON.stringify(userData))
    localStorage.setItem('authToken', authToken)
    localStorage.removeItem('guest_shipping_address')
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authUser')
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
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
    token,
    isLoggedIn: !!user,
    login,
    logout,
    updateUser,
    loading
  }
}