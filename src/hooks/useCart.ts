import { useState } from 'react';

export interface CartItem {
  id: number
  name: string
  author: string
  image: string
  price: number
  rate: number
  genre: string
  quantity: number
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  const handleAddToCart = (book: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const found = prevCart.find(item => item.id === book.id)
      if (found) return prevCart
      return [...prevCart, { ...book, quantity: 1 }]
    })
  }

  const handleIncrease = (bookId: number) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === bookId ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const handleDecrease = (bookId: number) => {
    setCart((prevCart) =>
      prevCart
        .map(item =>
          item.id === bookId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const getCartQuantity = (bookId: number) => {
    const found = cart.find(item => item.id === bookId)
    return found ? found.quantity : 0
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return {
    cart,
    handleAddToCart,
    handleIncrease,
    handleDecrease,
    getCartQuantity,
    totalPrice,
    cartCount,
    setCart,
  }
}