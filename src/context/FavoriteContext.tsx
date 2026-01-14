'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Book } from '@/types/book'
import { useAuth } from '@/hooks/useAuth'

interface FavoriteContextType {
  favorites: number[]
  favoriteBooks: Book[]
  setFavorites: React.Dispatch<React.SetStateAction<number[]>>
  setFavoriteBooks: React.Dispatch<React.SetStateAction<Book[]>>
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined)

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<number[]>([])
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([])

  useEffect(() => {
    if (!user?.id) {
      const savedFavorites = localStorage.getItem('guest_favorites')
      const savedFavoriteBooks = localStorage.getItem('guest_favorite_books')

      setFavorites(savedFavorites ? JSON.parse(savedFavorites) : [])
      setFavoriteBooks(savedFavoriteBooks ? JSON.parse(savedFavoriteBooks) : [])
    } else if (user?.role === 'user') {
      fetch(`/api/users/${user!.id}/favorites`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const favs = data.favorites.map((f: Book) => f.id)
            setFavorites(favs)
            setFavoriteBooks(data.favorites)
          }
        })
    }
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) {
      localStorage.setItem('guest_favorites', JSON.stringify(favorites))
    }
  }, [favorites, user?.id])

  useEffect(() => {
    if (!user?.id) {
      localStorage.setItem('guest_favorite_books', JSON.stringify(favoriteBooks))
    }
  }, [favoriteBooks, user?.id])

  const value: FavoriteContextType = {
    favorites,
    favoriteBooks,
    setFavorites,
    setFavoriteBooks
  }

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  )
}

export const useFavoriteContext = () => {
  const context = useContext(FavoriteContext)
  if (context === undefined) {
    throw new Error('useFavoriteContext must be used within a FavoriteProvider')
  }
  return context
}