'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Book } from '@/types/book'

interface BooksContextType {
  books: Book[]
  loading: boolean
  error: string | null
}

const BooksContext = createContext<BooksContextType>({
  books: [],
  loading: true,
  error: null
})

interface BooksProviderProps {
  children: ReactNode
}

export function BooksProvider({ children }: BooksProviderProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/books')
      .then((response) => response.json())
      .then((data) => {
        setBooks(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching books:", error)
        setError("Failed to fetch books")
        setLoading(false)
      })
  }, [])

  return (
    <BooksContext.Provider value={{ books, loading, error }}>
      {children}
    </BooksContext.Provider>
  )
}

export function useBooks() {
  const context = useContext(BooksContext)
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider')
  }
  return context
}