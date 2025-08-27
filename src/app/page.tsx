'use client'

import { useEffect, useState } from 'react';
import { Box, Grid2, Typography, Button, Paper, Rating, IconButton, InputLabel, FormControl, Select, MenuItem } from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/view/components/Sidebar';
import Navbar from '@/view/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Cartbar from '@/view/components/Cartbar';

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

export default function HomePage() {

  const [search, setSearch] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [isCartOpen, setCartOpen] = useState(false)
  const [sortType, setSortType] = useState<string>('Featured')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedOptionIds, setSelectedOptionIds] = useState<{ [bookId: number]: number }>({})
  const { user } = useAuth()
  const {
    cart,
    handleAddToCart,
    handleIncrease,
    handleDecrease,
    getCartQuantity,
    totalPrice,
    cartCount,
  } = useCart()

  useEffect(() => {
    fetch('/api/books')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching books:', error))
  }, [])

  useEffect(() => {
    if (cart.length > 0) {
      setCartOpen(true)
    } else {
      setCartOpen(false)
    }
  }, [cart])

  const filteredBooks = selectedCategory === 'All'
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
      case 'Price: Low to High':
        return a.options[0].price - b.options[0].price
      case 'Price: High to Low':
        return b.options[0].price - a.options[0].price
      case 'Avg. Customer Review':
        return b.rate - a.rate
      case 'Featured':
      default:
        return 0
    }
  })

  const toggleFavorite = (bookId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(bookId)
        ? prevFavorites.filter((id) => id !== bookId)
        : [...prevFavorites, bookId]
    )
  }

  return (
    <Box className="d-flex" sx={{ height: '100vh' }}>
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
          marginLeft: '300px',
          width: '100%',
          paddingRight: isCartOpen ? '300px' : '0',
          transition: 'padding-right 0.3s ease'
        }}
      >
        <Navbar onSearch={setSearch} books={books} />
        <Grid2 className="home-area d-flex" sx={{ overflowY: 'auto' }}>
          <Grid2 className="d-flex flex-column gap-4 my-4" sx={{ width: '100%' }}>
            {/* // Recommended feature under development
            <Box className="d-flex flex-column mx-4 p-2 px-4" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
              <Typography fontWeight={600} fontSize={20}>Recommended</Typography>
            </Box> */}
            <Box className="d-flex flex-column mx-4 p-2 px-4 gap-2" sx={{ height: '100%', backgroundColor: '#fff', borderRadius: '8px' }}>
              <Grid2 className="d-flex justify-content-between align-items-center">
                <Typography fontWeight={600} fontSize={20}>Categories</Typography>
                {user?.role === 'admin' && (
                  <Button variant="contained">Add Item</Button>
                )}
                <Box sx={{ minWidth: '100px', backgroundColor: '#e7f1fe', borderRadius: '8px' }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
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
              <Grid2 container className="d-flex gap-4 p-4" sx={{ overflow: 'auto' }}>
                {sortedBooks.map((book) => {
                  const optionId = selectedOptionIds[book.id] ?? book.options[0]?.id
                  const quantity = optionId ? getCartQuantity(book.id, optionId) : 0
                  return (
                    <Paper key={book.id} className="d-flex flex-column" sx={{ width: 'auto', marginBottom: '16px', borderRadius: '8px' }} elevation={3}>
                      <Grid2 className="d-flex justify-content-end pt-2 px-2">
                        <IconButton disableRipple onClick={() => toggleFavorite(book.id)}>
                          {favorites.includes(book.id) ? <Favorite color="error" /> : <FavoriteBorder />}
                        </IconButton>
                      </Grid2>
                      <Box className="d-flex gap-4 p-4 pt-0">
                        <Image src={book.image} alt={book.name} width={130} height={180} />
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
                              <Typography fontSize={16}>฿{book.options.find(opt => opt.id === (selectedOptionIds[book.id] ?? book.options[0]?.id))?.price ?? '-'}</Typography>
                            </Grid2>
                            <Grid2 className="d-flex gap-1">
                              <Typography fontSize={14}>Format:</Typography>
                              <FormControl variant="standard">
                                <Select
                                  labelId={`book-option-select-label-${book.id}`}
                                  id={`book-option-select-${book.id}`}
                                  value={selectedOptionIds[book.id] ?? book.options[0]?.id ?? ''}
                                  onChange={(e) =>
                                    setSelectedOptionIds((prev) => ({
                                      ...prev,
                                      [book.id]: Number(e.target.value),
                                    }))
                                  }
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
                          </Grid2>
                          <Grid2 className="d-flex align-items-center gap-3">
                            {quantity === 0 ? (
                              <Button
                                onClick={() => {
                                  if (optionId) handleAddToCart({ ...book, description: book.description ?? '' }, optionId, 1)
                                }}
                                variant="contained"
                                sx={{ width: '100%', borderRadius: '8px', textTransform: 'none' }}>
                                <Typography fontSize={14}>Add to cart</Typography>
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
                                  onClick={() => handleIncrease(book.id, optionId)}
                                  variant="contained"
                                  sx={{ width: 'auto', borderRadius: '8px' }}>
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