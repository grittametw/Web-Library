import { useFavoriteContext } from '@/context/FavoriteContext'
import { Book } from '@/types/book'

export function useFavorite() {
    const { favorites, setFavorites } = useFavoriteContext()
    const { favoriteBooks, setFavoriteBooks } = useFavoriteContext()

    const toggleFavorite = (bookId: number, book?: Book) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(bookId)) {
                setFavoriteBooks(prev => prev.filter(b => b.id !== bookId))
                return prevFavorites.filter((id) => id !== bookId)
            } else {
                if (book) {
                    setFavoriteBooks(prev => {
                        if (!prev.find(b => b.id === bookId)) {
                            return [...prev, book]
                        }
                        return prev
                    })
                }
                return [...prevFavorites, bookId]
            }
        })
    }

    const isFavorite = (bookId: number) => {
        return favorites.includes(bookId)
    }

    const clearFavorites = () => {
        setFavorites([])
        setFavoriteBooks([])
    }

    return {
        favorites,
        setFavorites,
        favoriteBooks,
        setFavoriteBooks,
        toggleFavorite,
        isFavorite,
        clearFavorites
    }
}