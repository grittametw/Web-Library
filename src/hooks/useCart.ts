import { useCartContext } from '@/context/CartContext';

interface Book {
  id: number
  name: string
  author: string
  image: string
  rate: number
  genre: string
  description: string
  options: {
    id: number
    type: string
    price: number
    stock: number
  }[]
}

export interface CartItem {
  id: number
  name: string
  author: string
  image: string
  rate: number
  genre: string
  option_id: number
  option_type: string
  price: number
  stock: number
  quantity: number
}

export interface AddToCartResult {
  success: boolean
  isUpdate: boolean
  error?: string
  maxStock?: number
}

export function useCart() {
  const { cart, setCart } = useCartContext()

  const handleAddToCart = (book: Book, optionId: number, quantity: number): AddToCartResult => {
    const option = book.options.find(o => o.id === optionId)
    if (!option) return { success: false, isUpdate: false, error: "Option not found" }

    const currentCartItem = cart.find(item => item.id === book.id && item.option_id === optionId)
    const currentQuantity = currentCartItem ? currentCartItem.quantity : 0
    const totalQuantity = currentQuantity + quantity

    if (totalQuantity > option.stock) {
      return {
        success: false,
        isUpdate: !!currentCartItem,
        error: `Cannot add ${quantity} items. Only ${option.stock - currentQuantity} items available in stock.`,
        maxStock: option.stock
      }
    }

    let isUpdate = false

    setCart((prevCart) => {
      const foundIndex = prevCart.findIndex(item => item.id === book.id && item.option_id === optionId)

      if (foundIndex !== -1) {
        isUpdate = true
        const updatedCart = [...prevCart]
        updatedCart[foundIndex] = {
          ...updatedCart[foundIndex],
          quantity: updatedCart[foundIndex].quantity + quantity
        }
        return updatedCart
      }

      return [
        ...prevCart,
        {
          id: book.id,
          name: book.name,
          author: book.author,
          image: book.image,
          rate: book.rate,
          genre: book.genre,
          option_id: option.id,
          option_type: option.type,
          price: option.price,
          stock: option.stock,
          quantity: quantity
        }
      ]
    })
    return { success: true, isUpdate }
  }

  const handleIncrease = (bookId: number, optionId: number): AddToCartResult => {
    const currentItem = cart.find(item => item.id === bookId && item.option_id === optionId)
    if (!currentItem) return { success: false, isUpdate: false, error: "Item not found in cart" }

    if (currentItem.quantity >= currentItem.stock) {
      return {
        success: false,
        isUpdate: true,
        error: `Cannot add more items. Maximum stock is ${currentItem.stock}.`,
        maxStock: currentItem.stock
      }
    }

    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === bookId && item.option_id === optionId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )

    return { success: true, isUpdate: true }
  }

  const handleDecrease = (bookId: number, optionId: number) => {
    setCart((prevCart) =>
      prevCart
        .map(item =>
          item.id === bookId && item.option_id === optionId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const getCartQuantity = (bookId: number, optionId: number) => {
    const found = cart.find(item => item.id === bookId && item.option_id === optionId)
    return found ? found.quantity : 0
  }

  const getAvailableStock = (bookId: number, optionId: number, totalStock: number) => {
    const currentQuantity = getCartQuantity(bookId, optionId)
    return Math.max(0, totalStock - currentQuantity)
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
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