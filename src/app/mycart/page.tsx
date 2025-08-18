'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/view/components/Navbar';
import Sidebar from '@/view/components/Sidebar';
import { Box, Grid2, Typography } from '@mui/material';
import { useCart } from '@/hooks/useCart';

export default function MycartPage() {
  const [search, setSearch] = useState('')
  const { cart, totalPrice } = useCart()
  const { cartCount } = useCart()

  return (
    <Box className="d-flex">
      <Sidebar cartCount={cartCount} />
      <Grid2 className="content-area d-flex flex-column" sx={{ width: '100%', overflow: 'hidden' }}>
        <Navbar onSearch={setSearch} books={[]} />
        <Grid2 className="home-area d-flex" sx={{ overflowY: 'auto' }}>
          <Grid2 className="d-flex flex-column gap-4 my-4" sx={{ width: '100%' }}>
            <Box className="d-flex flex-column mx-4 p-4 px-4" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
              <Box className="" sx={{ borderBottom: '1px solid #ccc' }}>
                <Typography fontWeight={600} fontSize={20}>Shopping Cart</Typography>
                <Typography fontWeight={600} fontSize={16} className="text-secondary d-flex justify-content-end">Price</Typography>
              </Box>
              <Box className="d-flex flex-column gap-2 mt-4">
                {cart.length === 0 ? (
                  <Typography color="text.secondary">No items in cart.</Typography>
                ) : (
                  cart.map((item) => (
                    <Box key={item.id} className="d-flex justify-content-between align-items-center">
                      <Typography fontWeight={600} fontSize={16}>{item.name} x{item.quantity}</Typography>
                      <Typography fontWeight={600} fontSize={16}>฿{item.price * item.quantity}</Typography>
                    </Box>
                  ))
                )}
              </Box>


              <Box className="d-flex justify-content-end mt-4">
                <Typography fontWeight={600} fontSize={18}>Total: ฿{totalPrice}</Typography>
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
}
