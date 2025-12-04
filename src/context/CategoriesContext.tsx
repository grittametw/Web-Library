'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Category {
  id: number
  name: string
  published: boolean
}

interface CategoriesContextType {
  categories: Category[]
  addCategory: (name: string) => void
  updateCategory: (id: number, name: string, published: boolean) => void
  deleteCategory: (id: number) => void
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined)

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('categories')
    if (saved) {
      setCategories(JSON.parse(saved))
    } else {
      const defaults: Category[] = [
        { id: 1, name: 'Sci-Fi', published: true },
        { id: 2, name: 'Fantasy', published: true },
        { id: 3, name: 'Drama', published: true },
        { id: 4, name: 'Horror', published: true },
        { id: 5, name: 'Historical', published: true },
      ]
      setCategories(defaults)
      localStorage.setItem('categories', JSON.stringify(defaults))
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('categories', JSON.stringify(categories))
    }
  }, [categories, isLoaded])

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Math.max(...categories.map(c => c.id), 0) + 1,
      name,
      published: true,
    }
    setCategories([...categories, newCategory])
  }

  const updateCategory = (id: number, name: string, published: boolean) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, name, published } : cat
    ))
  }

  const deleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id))
  }

  return (
    <CategoriesContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoriesContext)
  if (context === undefined) {
    throw new Error('useCategories must be used within CategoriesProvider')
  }
  return context
}