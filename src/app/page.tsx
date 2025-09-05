'use client'

import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Grid2, Typography, Button, Paper, Rating, IconButton, InputLabel, FormControl, Select, MenuItem } from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useFavorite } from '@/hooks/useFavorite';
import { useBooks } from '@/context/ฺBooksContext';
import { Book } from '@/types/book';
import Sidebar from '@/view/components/Sidebar';
import Navbar from '@/view/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Cartbar from '@/view/components/Cartbar';

function SearchHandler({ setSearch }: { setSearch: (search: string) => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const searchParam = searchParams.get('search')
    if (searchParam) {
      setSearch(searchParam)
    } else {
      setSearch('')
    }
  }, [searchParams, setSearch])

  return null
}

function HomePageContent() {
  const [search, setSearch] = useState('')
  const [isCartOpen, setCartOpen] = useState(false)
  const [sortType, setSortType] = useState<string>('Featured')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedOptionIds, setSelectedOptionIds] = useState<{ [bookId: number]: number }>({})
  const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({})
  const { user } = useAuth()
  const { toggleFavorite, isFavorite } = useFavorite()
  const { books } = useBooks()
  const {
    cart,
    handleAddToCart,
    handleIncrease,
    handleDecrease,
    getCartQuantity,
    getAvailableStock,
    totalPrice,
    cartCount,
  } = useCart()

  useEffect(() => {
    if (cart.length > 0) {
      setCartOpen(true)
    } else {
      setCartOpen(false)
    }
  }, [cart])

  const filteredBooks = selectedCategory === "All"
    ? books
    : books.filter(book => book.genre === selectedCategory)

  const searchedBooks = search
    ? filteredBooks.filter(book =>
      book.name.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.genre.toLowerCase().includes(search.toLowerCase())
    )
    : filteredBooks

  const sortedBooks = [...searchedBooks].sort((a, b) => {
    switch (sortType) {
      case "Price: Low to High":
        return a.options[0].price - b.options[0].price
      case "Price: High to Low":
        return b.options[0].price - a.options[0].price
      case "Avg. Customer Review":
        return b.rate - a.rate
      case "Featured":
      default:
        return 0
    }
  })

  const handleToggleFavorite = (bookId: number, book: Book) => {
    toggleFavorite(bookId, book)
  }

  const handleIncreaseWithStockCheck = (bookId: number, optionId: number) => {
    const result = handleIncrease(bookId, optionId)
    const errorKey = `${bookId}-${optionId}`

    if (!result.success) {
      setStockErrors(prev => ({
        ...prev,
        [errorKey]: result.error || "Cannot add more items"
      }))

      setTimeout(() => {
        setStockErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[errorKey]
          return newErrors
        })
      }, 3000)
    } else {
      setStockErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  return (
    <Box className="d-flex" sx={{ height: '100vh' }}>
      <Suspense fallback={null}>
        <SearchHandler setSearch={setSearch} />
      </Suspense>
      
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
        }}
      >
        <Navbar />
        <Grid2 className="home-area d-flex" sx={{ overflowY: 'auto' }}>
          <Grid2 className="d-flex flex-column gap-4 my-4" sx={{ width: '100%' }}>
            {search && (
              <Box className="d-flex flex-column mx-4 p-2 px-4" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                <Typography fontWeight={600} fontSize={18}>
                  Search results for: "{search}" ({sortedBooks.length} books found)
                </Typography>
              </Box>
            )}
            <Box className="d-flex flex-column mx-4 p-2 px-4 gap-2" sx={{ height: '100%', backgroundColor: '#fff', borderRadius: '8px' }}>
              <Grid2 className="d-flex justify-content-between align-items-center">
                <Typography fontWeight={600} fontSize={20}>Categories</Typography>
                {user?.role === 'admin' && (
                  <Button variant="contained">Add Item</Button>
                )}
                <Box sx={{ minWidth: '100px', backgroundColor: '#e7f1fe', borderRadius: '8px' }}>
                  <FormControl fullWidth>
                    <InputLabel className="z-0" id="demo-simple-select-label">Sort by</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Sort by"
                      value={sortType}
                      onChange={(e) => setSortType(e.target.value)}
                    >
                      <MenuItem value="Featured">Featured</MenuItem>
                      <MenuItem value="Price: Low to High">Price: Low to High</MenuItem>
                      <MenuItem value="Price: High to Low">Price: High to Low</MenuItem>
                      <MenuItem value="Avg. Customer Review">Avg. Customer Review</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid2>
              <Grid2 className="d-flex gap-2 mb-2" sx={{ overflowX: 'auto' }}>
                {['All', 'Sci-Fi', 'Fantasy', 'Drama', 'Horror', 'Historical'].map(category => (
                  <Button
                    key={category}
                    variant="contained"
                    disableElevation={selectedCategory !== category}
                    sx={{
                      backgroundColor: selectedCategory === category ? '#1976d2' : '#e7f1fe',
                      color: selectedCategory === category ? '#fff' : '#000',
                      borderRadius: '8px',
                      textTransform: 'none'
                    }}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <Typography>{category}</Typography>
                  </Button>
                ))}
              </Grid2>
              <Grid2 container spacing={4} rowSpacing={2} className="d-flex p-2" sx={{ overflow: 'auto' }}>
                {sortedBooks.map((book) => {
                  const optionId = selectedOptionIds[book.id] ?? book.options[0]?.id
                  const selectedOption = book.options.find(opt => opt.id === optionId)
                  const selectedOptionPrice = selectedOption?.price ?? 0
                  const selectedOptionStock = selectedOption?.stock ?? 0
                  const availableStock = getAvailableStock(book.id, optionId, selectedOptionStock)
                  const quantity = optionId ? getCartQuantity(book.id, optionId) : 0
                  const errorKey = `${book.id}-${optionId}`
                  const hasStockError = stockErrors[errorKey]
                  return (
                    <Paper key={book.id} className="d-flex flex-column" sx={{ width: 'auto', marginBottom: '16px', borderRadius: '8px' }} elevation={3}>
                      <Grid2 className="d-flex justify-content-end pt-2 px-2">
                        <IconButton disableRipple onClick={() => handleToggleFavorite(book.id, book)}>
                          {isFavorite(book.id) ? <Favorite color="error" /> : <FavoriteBorder />}
                        </IconButton>
                      </Grid2>
                      <Box className="d-flex gap-4 p-4 pt-0">
                        <Image src={book.image} alt={book.name} width={130} height={200} />
                        <Grid2 className="d-flex flex-column justify-content-between" sx={{ width: 'auto' }}>
                          <Grid2>
                            <Link
                              href={`/${book.name}`}
                              className="text-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
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
                                readOnly size="small"
                                precision={0.5} />
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
                                    setStockErrors(prev => {
                                      const newErrors = { ...prev }
                                      delete newErrors[errorKey]
                                      return newErrors
                                    })
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
                            {hasStockError && (
                              <Typography fontSize={12} color="error" sx={{ mt: 0.5 }}>
                                Available stock: {availableStock}
                              </Typography>
                            )}
                          </Grid2>
                          <Grid2 className="d-flex align-items-center gap-3">
                            {quantity === 0 ? (
                              <Button
                                onClick={() => {
                                  if (optionId) {
                                    const result = handleAddToCart({ ...book, description: book.description ?? '' }, optionId, 1)
                                    if (!result.success) {
                                      setStockErrors(prev => ({
                                        ...prev,
                                        [errorKey]: result.error || "Cannot add to cart"
                                      }))
                                      setTimeout(() => {
                                        setStockErrors(prev => {
                                          const newErrors = { ...prev }
                                          delete newErrors[errorKey]
                                          return newErrors
                                        })
                                      }, 3000)
                                    }
                                  }
                                }}
                                variant="contained"
                                disabled={availableStock === 0}
                                sx={{
                                  width: '100%',
                                  borderRadius: '8px',
                                  textTransform: 'none',
                                  backgroundColor: availableStock === 0 ? '#ccc' : undefined
                                }}>
                                <Typography fontSize={14}>
                                  {availableStock === 0 ? "Out of Stock" : "Add to cart"}
                                </Typography>
                              </Button>
                            ) : (
                              <>
                                <Button
                                  onClick={() => handleDecrease(book.id, optionId)}
                                  variant="contained"
                                  sx={{ width: 'auto', borderRadius: '8px' }}>
                                  <Typography fontSize={14}>-</Typography>
                                </Button>
                                <Typography fontSize={14}>{quantity}</Typography>
                                <Button
                                  onClick={() => handleIncreaseWithStockCheck(book.id, optionId)}
                                  variant="contained"
                                  sx={{
                                    width: 'auto',
                                    borderRadius: '8px',
                                    backgroundColor: availableStock === 0 ? '#ccc' : undefined
                                  }}>
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
          </Grid2>
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

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}