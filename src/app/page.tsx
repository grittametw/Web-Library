'use client'

import { useEffect, useState } from 'react';
import Sidebar from "@/components/Sidebar";
import Navbar from '@/components/Navbar';
import "@/styles/home.css";
import { Box, Grid2, Typography, Button, Paper } from '@mui/material';
import { Sort } from '@mui/icons-material';

interface Book {
  id: number
  name: string
  author: string
  story: string
  image: string
  price: number
  rate: number
}

export default function Home() {

  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch('/api/books')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching books:', error))
  }, []);

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
              <Grid2 className="d-flex gap-2">
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
              <Grid2>
                {books.map((book) => (
                  <Paper key={book.id} className="d-flex gap-4 p-4" sx={{ marginBottom: '16px', borderRadius: '8px' }}>
                    <img src={book.image} alt={book.name} style={{ width: '100px', height: '150px', objectFit: 'cover' }} />
                    <Box className="d-flex flex-column">
                      <Typography fontWeight={600} fontSize={18}>{book.name}</Typography>
                      <Typography fontSize={16}>Author: {book.author}</Typography>
                      <Typography fontSize={16}>Price: ${book.price}</Typography>
                      <Typography fontSize={16}>Rate: {book.rate}</Typography>
                      <Button variant="contained" sx={{ marginTop: '8px', borderRadius: '8px' }}>View Details</Button>
                    </Box>
                  </Paper>
                ))}
              </Grid2>
            </Box>
          </Grid2>
          <Box className="d-flex flex-column p-5" sx={{ backgroundColor: '#000' }}>

          </Box>
        </Grid2>

      </Grid2>
    </Box>
  );
}
