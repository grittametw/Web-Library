import { useFavoriteContext } from '@/context/FavoriteContext'
import { Book } from '@/types/book'
import { useAuth } from '@/hooks/useAuth'

export function useFavorite() {
    const { favorites, setFavorites, favoriteBooks, setFavoriteBooks } = useFavoriteContext()
    const { user } = useAuth()

    const syncWithServer = async (method: 'POST' | 'DELETE', bookId: number) => {
        if (!user?.id) return
        await fetch(`/api/users/${user.id}/favorites`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book_id: bookId }),
        })
    }

    const toggleFavorite = async (bookId: number, book?: Book) => {
        if (favorites.includes(bookId)) {
            setFavorites((prev) => prev.filter((id) => id !== bookId))
            setFavoriteBooks((prev) => prev.filter((b) => b.id !== bookId))
            if (user) await syncWithServer('DELETE', bookId)
        } else {
            if (book) {
                setFavoriteBooks((prev) => {
                    if (!prev.find((b) => b.id === bookId)) {
                        return [...prev, book]
                    }
                    return prev
                })
            }
            setFavorites((prev) => [...prev, bookId])
            if (user) await syncWithServer('POST', bookId)
        }
    }

    const isFavorite = (bookId: number) => favorites.includes(bookId)

    const clearFavorites = async () => {
        setFavorites([])
        setFavoriteBooks([])
        if (user) {
            for (const fav of favorites) {
                await syncWithServer('DELETE', fav)
            }
        }
    }

    return {
        favorites,
        setFavorites,
        favoriteBooks,
        setFavoriteBooks,
        toggleFavorite,
        isFavorite,
        clearFavorites,
    }
}