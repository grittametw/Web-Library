interface CartItem {
  id?: number
  book_id: number
  book_option_id: number
  quantity: number
  name: string
  author?: string
  image: string
  rate?: number
  genre?: string
  option_type?: string
  price: number
  stock: number
}

export type { CartItem }