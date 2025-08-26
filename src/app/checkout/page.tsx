'use client';

import { useState } from 'react';
import { Box, Grid2 } from '@mui/material';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/view/components/Navbar';
import Sidebar from '@/view/components/Sidebar';

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
  const { cartCount } = useCart()

  return (
    <Box className="d-flex">
      <Sidebar cartCount={cartCount} />
      <Grid2 className="content-area d-flex flex-column" sx={{ width: '100%', overflow: 'hidden' }}>
        <Navbar onSearch={setSearch} books={books} />
      </Grid2>
    </Box>
  );
}
