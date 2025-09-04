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

  const getFavoriteKeys = () => {
    if (user?.id && user?.role) {
      return {
        favoritesKey: `favorites_${user.role}_${user.id}`,
        favoriteBooksKey: `favorite_books_${user.role}_${user.id}`
      }
    }
    return {
      favoritesKey: 'favorites_guest',
      favoriteBooksKey: 'favorite_books_guest'
    }
  }

  useEffect(() => {
    const { favoritesKey, favoriteBooksKey } = getFavoriteKeys()
    
    const savedFavorites = localStorage.getItem(favoritesKey)
    const savedFavoriteBooks = localStorage.getItem(favoriteBooksKey)
    
    setFavorites(savedFavorites ? JSON.parse(savedFavorites) : [])
    setFavoriteBooks(savedFavoriteBooks ? JSON.parse(savedFavoriteBooks) : [])
  }, [user?.id, user?.role])

  useEffect(() => {
    const { favoritesKey } = getFavoriteKeys()
    localStorage.setItem(favoritesKey, JSON.stringify(favorites))
  }, [favorites, user?.id, user?.role])

  useEffect(() => {
    const { favoriteBooksKey } = getFavoriteKeys()
    localStorage.setItem(favoriteBooksKey, JSON.stringify(favoriteBooks))
  }, [favoriteBooks, user?.id, user?.role])

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