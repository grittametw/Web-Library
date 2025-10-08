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

interface BookRow {
  id: number
  name: string
  author: string
  image: string
  rate: number
  genre: string
  description: string
  option_id: number | null
  option_type: string | null
  price: number | null
  stock: number | null
}

export type { Book, BookRow }