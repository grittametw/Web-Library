import { useState } from 'react'
import { Box, Grid2, Typography, Button, Paper, Rating, IconButton, FormControl, Select, MenuItem } from '@mui/material'
import { Favorite, Delete } from '@mui/icons-material'
import { useCart } from '@/hooks/useCart'
import { useFavorite } from '@/hooks/useFavorite'
import Image from 'next/image'
import Link from 'next/link'

interface FavoriteProps {
  search?: string
}

export default function FavoriteComponent({ search = '' }: FavoriteProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<{ [bookId: number]: number }>({})
  const { favoriteBooks, toggleFavorite, clearFavorites } = useFavorite()
  const {
    handleAddToCart,
    handleIncrease,
    handleDecrease,
    getCartQuantity,
    getAvailableStock
  } = useCart()

  const searchedBooks = search
    ? favoriteBooks.filter(book =>
      book.name.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.genre.toLowerCase().includes(search.toLowerCase())
    )
    : favoriteBooks

  if (favoriteBooks.length === 0) {
    return (
      <Box className="d-flex flex-column align-items-center justify-content-center" sx={{ minHeight: '400px' }}>
        <Typography fontSize={18} color="text.secondary" className="mb-3">
          No favorite books yet
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          Start adding books to your favorites by clicking the heart icon
        </Typography>
      </Box>
    )
  }

  if (searchedBooks.length === 0 && search) {
    return (
      <Box className="d-flex flex-column align-items-center justify-content-center" sx={{ minHeight: '400px' }}>
        <Typography fontSize={18} color="text.secondary" className="mb-3">
          No favorites match your search
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          Try searching with different keywords
        </Typography>
      </Box>
    )
  }

  return (
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
        {searchedBooks.map((book) => {
          const optionId = selectedOptionIds[book.id] ?? book.options[0]?.id
          const selectedOption = book.options.find(opt => opt.id === optionId)
          const selectedOptionPrice = selectedOption?.price ?? 0
          const selectedOptionStock = selectedOption?.stock ?? 0
          const availableStock = getAvailableStock(book.id, optionId, selectedOptionStock)
          const quantity = optionId ? getCartQuantity(book.id, optionId) : 0

          return (
            <Paper
              key={book.id}
              className="d-flex flex-column"
              sx={{ width: 'auto', marginBottom: '16px', borderRadius: '8px' }}
              elevation={3}
            >
              <Grid2 className="d-flex justify-content-end pt-2 px-2">
                <IconButton
                  disableRipple
                  onClick={() => toggleFavorite(book.id)}
                  color="error"
                >
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
                      <Rating
                        name="rate-feedback"
                        value={book.rate}
                        readOnly
                        size="small"
                        precision={0.5}
                      />
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
                              [book.id]: Number(e.target.value),
                            }))
                          }}
                          sx={{ height: 24, fontSize: 14 }}
                        >
                          {book.options.map(option => (
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
                        onClick={() => handleAddToCart({ ...book, description: book.description ?? '' }, optionId, 1)}
                        variant="contained"
                        disabled={availableStock === 0}
                        sx={{
                          width: '100%',
                          borderRadius: '8px',
                          textTransform: 'none',
                          backgroundColor: availableStock === 0 ? '#ccc' : undefined
                        }}
                      >
                        <Typography fontSize={14}>
                          {availableStock === 0 ? "Out of Stock" : "Add to cart"}
                        </Typography>
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleDecrease(book.id, optionId)}
                          variant="contained"
                          sx={{ width: 'auto', borderRadius: '8px' }}
                        >
                          <Typography fontSize={14}>-</Typography>
                        </Button>
                        <Typography fontSize={14}>{quantity}</Typography>
                        <Button
                          onClick={() => handleIncrease(book.id, optionId)}
                          variant="contained"
                          sx={{
                            width: 'auto',
                            borderRadius: '8px',
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
  )
}