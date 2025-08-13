'use client';

import { useState } from 'react';
import Navbar from '@/view/components/Navbar';
import Sidebar from '@/view/components/Sidebar';
import { Box, Grid2 } from '@mui/material';

interface Book {
  id: number
  name: string
  author: string
  image: string
  price: number
  rate: number
  genre: string
}

export default function FavoritePage() {
  const [search, setSearch] = useState('')
  const [books, setBooks] = useState<Book[]>([])

  return (
    <Box className="d-flex">
      <Sidebar />
      <Grid2 className="content-area d-flex flex-column" sx={{ width: '100%', overflow: 'hidden' }}>
        <Navbar onSearch={setSearch} books={books} />
      </Grid2>
    </Box>
  );
}
