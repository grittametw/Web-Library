'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { CartItem } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'

interface CartContextType {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])

  const getCartKey = () => {
    if (user?.id && user?.role) return `cart_${user.role}_${user.id}`
    return 'cart_guest'
  }

  useEffect(() => {
    const key = getCartKey()
    const saved = localStorage.getItem(key)
    setCart(saved ? JSON.parse(saved) : [])
  }, [user?.id, user?.role])

  useEffect(() => {
    const key = getCartKey()
    localStorage.setItem(key, JSON.stringify(cart))
  }, [cart, user?.id, user?.role])

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCartContext must be used within CartProvider')
  return context
}