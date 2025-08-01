'use client'

import { useEffect, useState } from 'react';
import Sidebar from '@/view/components/Sidebar';
import Navbar from '@/view/components/Navbar';
import '@/styles/home.css';
import { Box, Grid2, Typography, Button, Paper, Rating, IconButton, InputLabel, FormControl, Select, MenuItem } from '@mui/material';
import { Sort, FavoriteBorder, Favorite } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';

interface Book {
  id: number
  name: string
  author: string
  image: string
  price: number
  rate: number
  genre: string
}

interface CartItem extends Book {
  quantity: number
}

export default function HomePage() {

  const [search, setSearch] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setCartOpen] = useState(false)
  const [sortType, setSortType] = useState<string>('Featured')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

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
        return a.price - b.price
      case 'Price: High to Low':
        return b.price - a.price
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

  const handleAddToCart = (book: Book) => {
    setCart((prevCart) => {
      const found = prevCart.find(item => item.id === book.id)
      if (found) return prevCart
      return [...prevCart, { ...book, quantity: 1 }]
    })
  }

  const handleIncrease = (bookId: number) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === bookId ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const handleDecrease = (bookId: number) => {
    setCart((prevCart) =>
      prevCart
        .map(item =>
          item.id === bookId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const getCartQuantity = (bookId: number) => {
    const found = cart.find(item => item.id === bookId)
    return found ? found.quantity : 0
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Box className="d-flex" sx={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar cartCount={cartCount} />
      <Grid2 className="content-area d-flex flex-column" sx={{ width: '100%', overflow: 'hidden' }}>
        <Navbar onSearch={setSearch} books={books} />
        <Grid2 className="home-area d-flex" sx={{ overflowY: 'auto' }}>
          <Grid2 className="d-flex flex-column gap-4 my-4" sx={{ width: '100%' }}>
            <Box className="d-flex flex-column mx-4 p-2 px-4" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
              <Typography fontWeight={600} fontSize={20}>Recommended</Typography>
            </Box>
            <Box className="d-flex flex-column mx-4 p-2 px-4 gap-2" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
              <Grid2 className="d-flex justify-content-between align-items-center">
                <Typography fontWeight={600} fontSize={20}>Categories</Typography>

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
              <Grid2 className="d-flex gap-4" sx={{ overflowX: 'auto' }}>
                {sortedBooks.map((book) => {
                  const quantity = getCartQuantity(book.id)
                  return (
                    <Paper key={book.id} className="d-flex flex-column" sx={{ width: 'auto', marginBottom: '16px', borderRadius: '8px' }}>
                      <Grid2 className="d-flex justify-content-end pt-2 px-2">
                        <IconButton disableRipple onClick={() => toggleFavorite(book.id)}>
                          {favorites.includes(book.id) ? <Favorite color="error" /> : <FavoriteBorder />}
                        </IconButton>
                      </Grid2>
                      <Grid2 className="d-flex gap-4 p-4 pt-0">
                        <Image src={book.image} alt={book.name} width={100} height={150} />
                        <Box className="d-flex flex-column justify-content-between" sx={{ width: 'auto' }}>
                          <Grid2>
                            <Link
                              href="/"
                              className="text-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                              <Typography fontWeight={600} fontSize={16} width={160}>
                                {book.name}
                              </Typography>
                            </Link>
                            <Typography fontSize={14}>Author: {book.author}</Typography>
                            <Typography fontSize={14}>Price: ฿{book.price}</Typography>
                            <Typography fontSize={14} className="d-flex">
                              Rate:
                              <Rating
                                name="rate-feedback"
                                value={book.rate}
                                readOnly size="small"
                                precision={0.5} />
                            </Typography>
                          </Grid2>
                          <Grid2 className="d-flex align-items-center gap-3">
                            {quantity === 0 ? (
                              <Button
                                onClick={() => handleAddToCart(book)}
                                variant="contained"
                                sx={{ width: '100%', borderRadius: '8px', textTransform: 'none' }}>
                                <Typography fontSize={14}>Add to cart</Typography>
                              </Button>
                            ) : (
                              <>
                                <Button
                                  onClick={() => handleDecrease(book.id)}
                                  variant="contained"
                                  sx={{ width: 'auto', borderRadius: '8px' }}>
                                  <Typography fontSize={14}>-</Typography>
                                </Button>
                                <Typography fontSize={14}>{quantity}</Typography>
                                <Button
                                  onClick={() => handleIncrease(book.id)}
                                  variant="contained"
                                  sx={{ width: 'auto', borderRadius: '8px' }}>
                                  <Typography fontSize={14}>+</Typography>
                                </Button>
                              </>
                            )}
                          </Grid2>
                        </Box>
                      </Grid2>
                    </Paper>
                  )
                })}
              </Grid2>
            </Box>
          </Grid2>
          <Box className={`Cartbar ${isCartOpen ? 'cart-open' : ''}`} sx={{ backgroundColor: '#fff' }}>
            {isCartOpen && (
              <>
                <Box className="d-flex flex-column align-items-center" sx={{ borderBottom: 'solid 1px #ccc', width: '100%', paddingBottom: '16px' }}>
                  <Typography>Total</Typography>
                  <Typography>฿ {totalPrice}</Typography>
                  <Button sx={{ width: '160px', marginTop: '8px', border: 'solid 1px #000', borderRadius: '8px', textTransform: 'none' }}>
                    <Typography fontSize={14} color='#000'>Go to cart</Typography>
                  </Button>
                </Box>
                <Box className="d-flex flex-column align-items-center" sx={{ borderBottom: 'solid 1px #ccc', width: '100%' }}>
                  {cart.map(item => {
                    const quantity = getCartQuantity(item.id)
                    return (
                      <Box key={item.id} className="d-flex flex-column align-items-center p-2">
                        <Grid2 className="d-flex justify-content-between align-items-center gap-2" sx={{ width: '100%' }}>
                          <Image src={item.image} alt={item.name} width={48} height={72} />
                          <Typography fontSize={14}>{item.name}</Typography>
                          <Typography fontSize={14}>x{item.quantity}</Typography>
                          <Typography fontSize={14}>฿{item.price * item.quantity}</Typography>
                        </Grid2>
                        <Box
                          className="d-flex justify-content-center align-items-center gap-4 mt-2"
                          sx={{ border: 'solid 1px #ccc', borderRadius: '8px' }}>
                          <Button
                            onClick={() => handleDecrease(item.id)}
                            sx={{ width: 'auto', borderRadius: '0px', borderRight: '1px solid #ccc' }}>
                            <Typography fontSize={14}>-</Typography>
                          </Button>
                          <Typography fontSize={14}>{quantity}</Typography>
                          <Button
                            onClick={() => handleIncrease(item.id)}
                            sx={{ width: 'auto', borderRadius: '0px', borderLeft: '1px solid #ccc' }}>
                            <Typography fontSize={14}>+</Typography>
                          </Button>
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              </>
            )}
          </Box>
        </Grid2>

      </Grid2>
    </Box>
  );
}
