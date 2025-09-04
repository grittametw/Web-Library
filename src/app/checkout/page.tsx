'use client';

import { Box, Grid2 } from '@mui/material';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/view/components/Navbar';
import Sidebar from '@/view/components/Sidebar';

export default function CheckoutPage() {
  const { cartCount } = useCart()

  return (
    <Box className="d-flex">
      <Sidebar cartCount={cartCount} />
      <Grid2 className="content-area d-flex flex-column" sx={{ width: '100%', overflow: 'hidden' }}>
        <Navbar />
      </Grid2>
    </Box>
  );
}
