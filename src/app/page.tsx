'use client'

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import '@/styles/home.css';
import { Box, Grid2, Typography, Button, Paper, Rating, IconButton } from '@mui/material';
import { Sort, FavoriteBorder, Favorite } from '@mui/icons-material';
import Image from 'next/image';

interface Book {
  id: number
  name: string
  author: string
  image: string
  price: number
  rate: number
}

export default function Home() {

  const [books, setBooks] = useState<Book[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [value, setValue] = useState<number | null>()
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    fetch('/api/books')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching books:', error))
  }, [])

  const toggleFavorite = (bookId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(bookId)
        ? prevFavorites.filter((id) => id !== bookId)
        : [...prevFavorites, bookId]
    )
  }

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <Box className="d-flex">
      <Sidebar />
      <Grid2 className="d-flex flex-column" sx={{ width: '100%' }}>
        <Navbar />
        <Grid2 className="d-flex">
          <Grid2 className="d-flex flex-column gap-4 my-4" sx={{ width: '100%' }}>
            <Box className="d-flex flex-column mx-4 p-2 px-4" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
              <Typography fontWeight={600} fontSize={20}>Recommended</Typography>
            </Box>
            <Box className="d-flex flex-column mx-4 p-2 px-4 gap-2" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
              <Grid2 className="d-flex justify-content-between align-items-center">
                <Typography fontWeight={600} fontSize={20}>Categories</Typography>
                <Button sx={{ minWidth: '20px', backgroundColor: '#e7f1fe', borderRadius: '8px' }}>
                  <Sort sx={{ fontSize: '20px' }} />
                </Button>
              </Grid2>
              <Grid2 className="d-flex gap-2 mb-2" sx={{ overflowX: 'auto' }}>
                <Button
                  variant="contained"
                  sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                  <Typography>All</Typography>
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{ backgroundColor: '#e7f1fe', borderRadius: '8px', textTransform: 'none' }}
                >
                  <Typography sx={{ color: '#000' }}>Sci-Fi</Typography>
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{ backgroundColor: '#e7f1fe', borderRadius: '8px', textTransform: 'none' }}
                >
                  <Typography sx={{ color: '#000' }}>Fantasy</Typography>
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{ backgroundColor: '#e7f1fe', borderRadius: '8px', textTransform: 'none' }}
                >
                  <Typography sx={{ color: '#000' }}>Drama</Typography>
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{ backgroundColor: '#e7f1fe', borderRadius: '8px', textTransform: 'none' }}
                >
                  <Typography sx={{ color: '#000' }}>Horror</Typography>
                </Button>
              </Grid2>
              <Grid2 className="d-flex gap-4" sx={{ overflowX: 'auto' }}>
                {books.map((book) => (
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
                          <Typography fontWeight={600} fontSize={16} width={160}>{book.name}</Typography>
                          <Typography fontSize={14}>Author: {book.author}</Typography>
                          <Typography fontSize={14}>Price: ฿{book.price}</Typography>
                          <Typography fontSize={14} className="d-flex">
                            Rate: <Rating name="read-only" value={value} readOnly size="small" />{book.rate}
                          </Typography>
                        </Grid2>
                        <Grid2 className="d-flex align-items-center gap-3">
                          <Button variant="contained" sx={{ width: 'auto', borderRadius: '8px', textTransform: 'none' }}>
                            <Typography fontSize={14}>-</Typography>
                          </Button>
                          <Typography fontSize={14}>0</Typography>
                          <Button variant="contained" sx={{ width: 'auto', borderRadius: '8px', textTransform: 'none' }}>
                            <Typography fontSize={14}>+</Typography>
                          </Button>
                        </Grid2>
                      </Box>
                    </Grid2>
                  </Paper>
                ))}
              </Grid2>
            </Box>
          </Grid2>
          <Box className="cart d-flex flex-column align-items-center p-2" sx={{ backgroundColor: '#fff' }}>
            <Box className="d-flex flex-column align-items-center" sx={{ borderBottom: 'solid 1px #ccc', width: '100%', paddingBottom: '16px' }}>
              <Typography>Total</Typography>
              <Typography>฿ </Typography>
              <Button sx={{ width: '160px', marginTop: '8px', border: 'solid 1px #000', borderRadius: '8px', textTransform: 'none' }}>
                <Typography fontSize={14} color='#000'>Go to cart</Typography>
              </Button>
            </Box>
            <Box className="d-flex flex-column align-items-center" sx={{ borderBottom: 'solid 1px #ccc', width: '100%', paddingBottom: '16px' }}>
              <Image src="/icon_web.png" alt="" width={48} height={48} />
              <Button sx={{ width: '160px', marginTop: '8px', border: 'solid 1px #000', borderRadius: '8px', textTransform: 'none' }}>
                <Typography fontSize={14} color='#000'>sss</Typography>
              </Button>
            </Box>
          </Box>
        </Grid2>

      </Grid2>
    </Box>
  );
}
