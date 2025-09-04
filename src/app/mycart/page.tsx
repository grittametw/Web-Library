'use client';

import { Box, Grid2, Typography } from '@mui/material';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/view/components/Navbar';
import Sidebar from '@/view/components/Sidebar';
import QuantityButton from '@/view/components/QuantityButton';
import '@/styles/mycart.css';

export default function MycartPage() {
  const { cart, totalPrice, cartCount, handleIncrease, handleDecrease } = useCart()

  return (
    <Box className="d-flex">
      <Sidebar cartCount={cartCount} />
      <Grid2 className="content-area d-flex flex-column" sx={{ width: '100%', overflow: 'hidden' }}>
        <Navbar />
        <Grid2 className="d-flex" sx={{ overflowY: 'auto' }}>
          <Grid2 className="d-flex m-4 gap-4" sx={{ width: '100%' }}>
            <Box className="d-flex flex-column p-4" sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px' }}>
              <Box sx={{ borderBottom: '2px solid #ccc' }}>
                <Typography fontWeight={600} fontSize={20}>Shopping Cart</Typography>
                <Typography fontWeight={600} fontSize={16} className="text-secondary d-flex justify-content-end">Price</Typography>
              </Box>
              <Box className="d-flex flex-column">
                {cart.length === 0 ? (
                  <Typography color="text.secondary">No items in cart.</Typography>
                ) : (
                  cart.map((item) => (
                    <Box key={item.id} className="d-flex justify-content-between align-items-center py-4" sx={{ borderBottom: '1px solid #ccc' }}>
                      <Grid2 className="d-flex gap-4">
                        <Image src={item.image} alt={item.name} width={100} height={150} />
                        <Grid2 className="d-flex flex-column justify-content-around">
                          <Grid2>
                            <Link
                              href={`/${item.name}`}
                              className="text-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                              <Typography fontWeight={600} fontSize={16}>{item.name}</Typography>
                            </Link>
                            <Typography>Format: {item.option_type}</Typography>
                          </Grid2>
                          <Grid2 sx={{ width: '200px' }}>
                            <QuantityButton
                              quantity={item.quantity}
                              onIncrease={() => handleIncrease(item.id, item.option_id)}
                              onDecrease={() => handleDecrease(item.id, item.option_id)}
                            />
                          </Grid2>
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
            <Box className="d-flex justify-content-center align-items-center flex-column p-4 gap-2" sx={{ width: '350px', height: '200px', backgroundColor: '#fff', borderRadius: '8px' }}>
              <Typography fontWeight={600} fontSize={18}>Total ({cartCount} items): ฿{totalPrice}</Typography>
              <Link
                href="/checkout"
                className="checkoutButton d-flex justify-content-center p-2 text-decoration-none"
                style={{ width: '100%', color: '#fff', borderRadius: '18px' }}>
                <Typography fontSize={14}>Proceed to Checkout</Typography>
              </Link>
            </Box>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
}
