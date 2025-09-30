'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { CartItem } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'

interface CartContextType {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])

  const isLoggedIn = !!user?.id

  const refreshCart = async () => {
    if (isLoggedIn) {
      const res = await fetch(`/api/users/${user!.id}/carts`)
      const data = await res.json()
      setCart(data.cart || [])
    } else {
      const saved = localStorage.getItem('cart_guest')
      setCart(saved ? JSON.parse(saved) : [])
    }
  }

  useEffect(() => {
    refreshCart()
  }, [isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('cart_guest', JSON.stringify(cart))
    }
  }, [cart, isLoggedIn])

  return (
    <CartContext.Provider value={{ cart, setCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCartContext must be used within CartProvider')
  return context
}