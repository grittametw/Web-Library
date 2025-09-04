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

export type { Book }