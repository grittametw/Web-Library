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

export function useCart() {
  const { cart, setCart } = useCartContext()

  const handleAddToCart = (book: Book, optionId: number, quantity: number): boolean => {
    const option = book.options.find(o => o.id === optionId)
    if (!option) return false

    let isUpdate = false

    setCart((prevCart) => {
      const foundIndex = prevCart.findIndex(item => item.id === book.id && item.option_id === optionId)

      if (foundIndex !== -1) {
        isUpdate = true
        const updatedCart = [...prevCart]
        updatedCart[foundIndex] = {
          ...updatedCart[foundIndex],
          quantity: updatedCart[foundIndex].quantity + quantity
        };
        return updatedCart;
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

    return isUpdate
  }

  const handleIncrease = (bookId: number, optionId: number) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === bookId && item.option_id === optionId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
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