'use client'

import { useEffect, useState } from 'react'
import { Box, Grid2, Typography } from '@mui/material'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import Cartbar from '@/view/components/Cartbar'
import FavoriteComponent from '@/view/components/Favorite'

export default function FavoritePage() {
  const [isCartOpen, setCartOpen] = useState(false)
  const {
    cart,
    handleIncrease,
    handleDecrease,
    getCartQuantity,
    totalPrice,
    cartCount,
  } = useCart()

  useEffect(() => {
    if (cart.length > 0) {
      setCartOpen(true)
    } else {
      setCartOpen(false)
    }
  }, [cart])

  return (
    <Box className="d-flex">
      <Box sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 300,
        height: '100vh',
        zIndex: 10
      }}>
        <Sidebar cartCount={cartCount} />
      </Box>
      <Grid2
        className="content-area d-flex flex-column"
        sx={{
          marginLeft: '280px',
          width: '100%',
          paddingRight: isCartOpen ? '280px' : '0',
          transition: 'padding-right 0.3s ease'
        }}>
        <Navbar />
        <Grid2 className="d-flex" sx={{ overflowY: 'auto' }}>
          <Box className="d-flex flex-column m-4 p-4 gap-2" sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px' }}>
            <Typography fontWeight={600} fontSize={20}>My Favorites</Typography>
            <FavoriteComponent />
          </Box>
          <Cartbar
            cart={cart}
            isCartOpen={isCartOpen}
            totalPrice={totalPrice}
            getCartQuantity={getCartQuantity}
            handleIncrease={handleIncrease}
            handleDecrease={handleDecrease}
          />
        </Grid2>
      </Grid2>
    </Box>
  )
}