'use client'

import { useEffect, useState } from 'react'
import { Box, Grid2, Typography, Button, Paper, Rating, IconButton, FormControl, Select, MenuItem } from '@mui/material'
import { Favorite, Delete } from '@mui/icons-material'
import { useCart } from '@/hooks/useCart'
import { useFavorite } from '@/hooks/useFavorite'
import { Book } from '@/types/book'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import Cartbar from '@/view/components/Cartbar'
import Image from 'next/image'
import Link from 'next/link'

export default function FavoritePage() {
  const [isCartOpen, setCartOpen] = useState(false)
  const [selectedOptionIds, setSelectedOptionIds] = useState<{ [bookId: number]: number }>({})
  const { favoriteBooks, toggleFavorite, clearFavorites } = useFavorite()
  const {
    cart,
    handleIncrease,
    handleDecrease,
    getCartQuantity,
    totalPrice,
    cartCount,
    handleAddToCart,
    getAvailableStock
  } = useCart()

  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setCartOpen(cart.length > 0)
  }, [cart])

  const searchedBooks = search
    ? favoriteBooks.filter(
      (book) =>
        book.name.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.genre.toLowerCase().includes(search.toLowerCase())
    )
    : favoriteBooks

  return (
    <Box className="d-flex">
      <Box sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 300,
        height: '100vh',
        zIndex: 10
      }}>
        <Sidebar cartCount={cartCount} />
      </Box>

      <Grid2
        className="content-area d-flex flex-column"
        sx={{
          marginLeft: '280px',
          width: '100%',
          paddingRight: isCartOpen ? '280px' : '0',
          transition: 'padding-right 0.3s ease'
        }}>
        <Navbar />
        <Grid2 className="d-flex" sx={{ overflowY: 'auto' }}>
          <Box className="d-flex flex-column m-4 p-4 gap-2" sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px' }}>
            <Typography fontWeight={600} fontSize={20}>My Favorites</Typography>
            {favoriteBooks.length === 0 ? (
              <Box className="d-flex flex-column align-items-center justify-content-center" sx={{ minHeight: 400 }}>
                <Typography fontSize={18} color="text.secondary" className="mb-3">
                  No favorite books yet
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  Start adding books to your favorites by clicking the heart icon
                </Typography>
              </Box>
            ) : (
              <Box className="d-flex flex-column gap-3">
                <Box className="d-flex justify-content-between align-items-center">
                  <Typography fontSize={14} color="text.secondary">
                    {searchedBooks.length} favorite{searchedBooks.length !== 1 ? 's' : ''} found
                  </Typography>
                  {favoriteBooks.length > 0 && (
                    <Button
                      onClick={clearFavorites}
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Delete />}
                      sx={{ textTransform: 'none' }}
                    >
                      Clear All
                    </Button>
                  )}
                </Box>

                <Grid2 container spacing={4} rowSpacing={2} className="d-flex p-2">
                  {searchedBooks.map((book: Book) => {
                    const optionId = selectedOptionIds[book.id] ?? book.options[0]?.id
                    const selectedOption = book.options.find((opt) => opt.id === optionId)
                    const selectedOptionPrice = selectedOption?.price ?? 0
                    const selectedOptionStock = selectedOption?.stock ?? 0
                    const availableStock = getAvailableStock(book.id, optionId, selectedOptionStock)
                    const quantity = optionId ? getCartQuantity(book.id, optionId) : 0

                    return (
                      <Paper
                        key={book.id}
                        className="d-flex flex-column"
                        sx={{ width: 'auto', marginBottom: 2, borderRadius: 2 }}
                        elevation={3}
                      >
                        <Grid2 className="d-flex justify-content-end pt-2 px-2">
                          <IconButton disableRipple onClick={() => toggleFavorite(book.id)} color="error">
                            <Favorite />
                          </IconButton>
                        </Grid2>

                        <Box className="d-flex gap-4 p-4 pt-0">
                          <Image src={book.image} alt={book.name} width={130} height={200} />

                          <Grid2 className="d-flex flex-column justify-content-between" sx={{ width: 'auto' }}>
                            <Grid2>
                              <Link
                                href={`/${book.name}`}
                                className="text-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                              >
                                <Typography fontWeight={600} fontSize={16} width={160}>
                                  {book.name}
                                </Typography>
                              </Link>
                              <Typography color="text.secondary">by {book.author}</Typography>

                              <Typography fontSize={14} className="d-flex">
                                Rate:
                                <Rating name="rate-feedback" value={book.rate} readOnly size="small" precision={0.5} />
                              </Typography>

                              <Grid2 className="d-flex align-items-center gap-1">
                                <Typography fontSize={14}>Price:</Typography>
                                <Typography fontSize={16}>฿{selectedOptionPrice}</Typography>
                              </Grid2>

                              <Grid2 className="d-flex gap-1">
                                <Typography fontSize={14}>Format:</Typography>
                                <FormControl variant="standard">
                                  <Select
                                    labelId={`book-option-select-label-${book.id}`}
                                    id={`book-option-select-${book.id}`}
                                    value={optionId ?? ''}
                                    onChange={(e) => {
                                      setSelectedOptionIds((prev) => ({
                                        ...prev,
                                        [book.id]: Number(e.target.value)
                                      }))
                                    }}
                                    sx={{ height: 24, fontSize: 14 }}
                                  >
                                    {book.options.map((option) => (
                                      <MenuItem key={option.id} value={option.id}>
                                        {option.type}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid2>

                              {availableStock === 0 && (
                                <Typography fontSize={12} color="error" sx={{ mt: 0.5 }}>
                                  Available stock: {availableStock}
                                </Typography>
                              )}
                            </Grid2>

                            <Grid2 className="d-flex align-items-center gap-3">
                              {quantity === 0 ? (
                                <Button
                                  onClick={() => handleAddToCart(book, optionId, 1)}
                                  variant="contained"
                                  disabled={availableStock === 0}
                                  sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    backgroundColor: availableStock === 0 ? '#ccc' : undefined
                                  }}
                                >
                                  <Typography fontSize={14}>
                                    {availableStock === 0 ? 'Out of Stock' : 'Add to cart'}
                                  </Typography>
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    onClick={() => handleDecrease(book.id, optionId)}
                                    variant="contained"
                                    sx={{ width: 'auto', borderRadius: 2 }}
                                  >
                                    <Typography fontSize={14}>-</Typography>
                                  </Button>
                                  <Typography fontSize={14}>{quantity}</Typography>
                                  <Button
                                    onClick={() => handleIncrease(book.id, optionId)}
                                    variant="contained"
                                    sx={{
                                      width: 'auto',
                                      borderRadius: 2,
                                      backgroundColor: availableStock === 0 ? '#ccc' : undefined
                                    }}
                                  >
                                    <Typography fontSize={14}>+</Typography>
                                  </Button>
                                </>
                              )}
                            </Grid2>
                          </Grid2>
                        </Box>
                      </Paper>
                    )
                  })}
                </Grid2>
              </Box>
            )}
          </Box>
          <Cartbar
            cart={cart}
            isCartOpen={isCartOpen}
            totalPrice={totalPrice}
            getCartQuantity={getCartQuantity}
            handleIncrease={handleIncrease}
            handleDecrease={handleDecrease}
          />
        </Grid2>
      </Grid2>
    </Box>
  )
}