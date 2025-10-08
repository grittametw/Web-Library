import { useCartContext } from '@/context/CartContext'
import { useAuth } from '@/hooks/useAuth'
import { Book } from '@/types/book'

export interface AddToCartResult {
  success: boolean
  isUpdate: boolean
  error?: string
  maxStock?: number
}

export function useCart() {
  const { cart, setCart, refreshCart } = useCartContext()
  const { user } = useAuth()

  const isLoggedIn = !!user?.id

  const handleAddToCart = async (book: Book, optionId: number, quantity: number): Promise<AddToCartResult> => {
    const option = book.options.find(o => o.id === optionId)
    if (!option) return { success: false, isUpdate: false, error: 'Option not found' }

    const currentCartItem = cart.find(item => item.book_id === book.id && item.book_option_id === optionId)
    const currentQuantity = currentCartItem ? currentCartItem.quantity : 0
    const totalQuantity = currentQuantity + quantity

    if (totalQuantity > option.stock) {
      return {
        success: false,
        isUpdate: !!currentCartItem,
        error: `Cannot add ${quantity} items. Only ${option.stock - currentQuantity} left.`,
        maxStock: option.stock,
      }
    }

    if (isLoggedIn) {
      await fetch(`/api/users/${user!.id}/carts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: book.id,
          book_option_id: option.id,
          quantity, totalQuantity,
        }),
      })
      await refreshCart()
      return { success: true, isUpdate: !!currentCartItem }
    } else {
      let isUpdate = false
      setCart((prevCart) => {
        const foundIndex = prevCart.findIndex(item => item.book_id === book.id && item.book_option_id === optionId)

        if (foundIndex !== -1) {
          isUpdate = true
          const updatedCart = [...prevCart]
          updatedCart[foundIndex] = {
            ...updatedCart[foundIndex],
            quantity: updatedCart[foundIndex].quantity + quantity,
          }
          return updatedCart
        }

        return [
          ...prevCart,
          {
            book_id: book.id,
            book_option_id: option.id,
            quantity,
            name: book.name,
            author: book.author,
            image: book.image,
            rate: book.rate,
            genre: book.genre,
            option_type: option.type,
            price: option.price,
            stock: option.stock,
          },
        ]
      })

      return { success: true, isUpdate }
    }
  }

  const handleIncrease = async (bookId: number, optionId: number): Promise<AddToCartResult> => {
    const currentItem = cart.find(item => item.book_id === bookId && item.book_option_id === optionId)
    if (!currentItem) return { success: false, isUpdate: false, error: 'Item not found in cart' }

    if (currentItem.stock && currentItem.quantity >= currentItem.stock) {
      return {
        success: false,
        isUpdate: true,
        error: `Cannot add more. Max stock is ${currentItem.stock}.`,
        maxStock: currentItem.stock,
      }
    }

    if (isLoggedIn) {
      await fetch(`/api/users/${user!.id}/carts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentItem.id, quantity: currentItem.quantity + 1 }),
      })
      await refreshCart()
    } else {
      setCart((prevCart) =>
        prevCart.map(item =>
          item.book_id === bookId && item.book_option_id === optionId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    }

    return { success: true, isUpdate: true }
  }

  const handleDecrease = async (bookId: number, optionId: number) => {
    const currentItem = cart.find(item => item.book_id === bookId && item.book_option_id === optionId)
    if (!currentItem) return

    if (isLoggedIn) {
      const newQuantity = currentItem.quantity - 1
      if (newQuantity > 0) {
        await fetch(`/api/users/${user!.id}/carts`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentItem.id, quantity: newQuantity }),
        })
      } else {
        await fetch(`/api/users/${user!.id}/carts?cartId=${currentItem.id}`, { method: 'DELETE' })
      }
      await refreshCart()
    } else {
      setCart((prevCart) =>
        prevCart
          .map(item =>
            item.book_id === bookId && item.book_option_id === optionId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter(item => item.quantity > 0)
      )
    }
  }

  const getCartQuantity = (bookId: number, optionId: number) => {
    const found = cart.find(item => item.book_id === bookId && item.book_option_id === optionId)
    return found ? found.quantity : 0
  }

  const getAvailableStock = (bookId: number, optionId: number, totalStock: number) => {
    const currentQuantity = getCartQuantity(bookId, optionId)
    return Math.max(0, totalStock - currentQuantity)
  }

  const totalPrice = cart.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return {
    cart,
    handleAddToCart,
    handleIncrease,
    handleDecrease,
    getCartQuantity,
    getAvailableStock,
    totalPrice,
    cartCount,
    setCart,
  }
}