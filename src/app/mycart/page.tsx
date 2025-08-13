'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/view/components/Navbar';
import Sidebar from '@/view/components/Sidebar';
import { Box, Grid2, Typography } from '@mui/material';

interface Book {
  id: number
  name: string
  author: string
  image: string
  price: number
  rate: number
  genre: string
}

export default function MycartPage() {
  const [search, setSearch] = useState('')
  const [books, setBooks] = useState<Book[]>([])

  return (
    <Box className="d-flex">
      <Sidebar />
      <Grid2 className="content-area d-flex flex-column" sx={{ width: '100%', overflow: 'hidden' }}>
        <Navbar onSearch={setSearch} books={books} />
        <Grid2 className="home-area d-flex" sx={{ overflowY: 'auto' }}>
          <Grid2 className="d-flex flex-column gap-4 my-4" sx={{ width: '100%' }}>
            <Box className="d-flex flex-column mx-4 p-2 px-4" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
              <Typography fontWeight={600} fontSize={20}>Shopping Cart</Typography>
            </Box>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
}
