'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

interface CartContextType {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [lastUserId, setLastUserId] = useState<number | null>(null)

  useEffect(() => {
    if (user?.id && user?.role) {
      const key = `cart_${user.role}_${user.id}`
      const saved = localStorage.getItem(key)
      setCart(saved ? JSON.parse(saved) : [])
      setLastUserId(user.id)
    } else {
      setCart([])
      setLastUserId(null)
    }
  }, [user?.id, user?.role])

  useEffect(() => {
    if (user?.id && user?.role) {
      const key = `cart_${user.role}_${user.id}`
      localStorage.setItem(key, JSON.stringify(cart))
    }
  }, [cart, user?.id, user?.role])

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used within CartProvider')
  return ctx
}