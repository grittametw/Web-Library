'use client';

import { useEffect, useState } from 'react';
import { Box, Grid2, Typography, FormControl, Select, MenuItem } from '@mui/material';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import Navbar from '@/view/components/Navbar';
import Sidebar from '@/view/components/Sidebar';
import QuantityButton from '@/view/components/QuantityButton';

export default function MycartPage() {
  const [search, setSearch] = useState('')
  const [sortType, setSortType] = useState<string>('1')
  const { cart, totalPrice, cartCount, handleIncrease, handleDecrease } = useCart()

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
                      <Grid2 className="d-flex align-items-center gap-2">
                        <Image src={item.image} alt={item.name} width={100} height={150} />
                        <Grid2>
                          <Typography fontWeight={600} fontSize={16}>{item.name}</Typography>
                          <Box sx={{ minWidth: '100px', border: 'solid 1px #000', borderRadius: '8px' }}>
                            <FormControl fullWidth>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={sortType}
                                onChange={(e) => setSortType(e.target.value)}
                              >
                                <MenuItem value="1">ปกอ่อน (฿ {item.price})</MenuItem>
                                <MenuItem value="2">test-2</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                          <QuantityButton
                            quantity={item.quantity}
                            onIncrease={() => handleIncrease(item.id)}
                            onDecrease={() => handleDecrease(item.id)}
                          />
                        </Grid2>
                      </Grid2>
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
