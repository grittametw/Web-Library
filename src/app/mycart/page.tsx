'use client'

import { useEffect, useState } from 'react'
import { Box, Grid2, Typography } from '@mui/material'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { ShippingAddress } from '@/types/address'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import QuantityButton from '@/view/components/QuantityButton'
import ShippingAddressSection from '@/view/components/ShippingAddressSection'
import '@/styles/mycart.css'

export default function MycartPage() {
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const { user, isLoggedIn } = useAuth()
  const { cart, totalPrice, cartCount, handleIncrease, handleDecrease, getAvailableStock, setCart } = useCart()

  const userId = user?.id
  const userEmail = user?.email
  const canProceedToCheckout = cart.length > 0 && shippingAddress

  useEffect(() => {
    if (!isLoggedIn || !userId || user?.role !== 'user') return
    fetch(`/api/users/${userId}/carts`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCart(data.cart)
      })
      .catch(err => console.error('Failed to fetch cart', err))
  }, [isLoggedIn, userId])

  const handleAddressChange = (address: ShippingAddress | null) => {
    setShippingAddress(address)

    if (!address) {
      localStorage.removeItem('selected_address_id')
      localStorage.removeItem('guest_shipping_address')
      return
    }

    if (isLoggedIn && address.id) {
      localStorage.setItem('selected_address_id', address.id.toString())
    } else {
      localStorage.setItem('guest_shipping_address', JSON.stringify(address))
    }
  }

  return (
    <Box className="d-flex" sx={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar cartCount={cartCount} />
      <Box className="content-area d-flex flex-column" sx={{ width: '100%' }}>
        <Navbar />
        <Box className="scrollbar" sx={{ overflowY: 'auto' }}>
          <Box className="d-flex m-4 gap-4">
            <Box
              className="d-flex flex-column p-4"
              sx={{ width: '100%', height: 'fit-content', backgroundColor: '#fff', borderRadius: '8px' }}
            >
              <Grid2 sx={{ borderBottom: '2px solid #ccc' }}>
                <Typography fontWeight={600} fontSize={20}>Shopping Cart</Typography>
                <Typography fontWeight={600} fontSize={16} className="text-secondary d-flex justify-content-end">Price</Typography>
              </Grid2>

              <Box className="d-flex flex-column">
                {cart.length === 0 ? (
                  <Typography color="text.secondary">No items in cart.</Typography>
                ) : (
                  cart.map((item) => {
                    const availableStock = getAvailableStock(item.book_id, item.book_option_id, item.stock)
                    return (
                      <Box
                        key={item.id}
                        className="d-flex justify-content-between align-items-center py-4"
                        sx={{ borderBottom: '1px solid #ccc' }}
                      >
                        <Grid2 className="d-flex gap-4">
                          <Image src={item.image} alt={item.name} width={100} height={150} />
                          <Grid2 className="d-flex flex-column justify-content-around">
                            <Grid2>
                              <Link
                                href={`/${item.name}`}
                                className="text-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                              >
                                <Typography fontWeight={600} fontSize={16}>{item.name}</Typography>
                              </Link>
                              <Typography>Format: {item.option_type}</Typography>
                              {availableStock === 0 && (
                                <Typography fontSize={12} color="error" sx={{ mt: 0.5 }}>
                                  Available stock: {availableStock}
                                </Typography>
                              )}
                            </Grid2>
                            <Grid2 sx={{ width: '200px' }}>
                              <QuantityButton
                                quantity={item.quantity}
                                onIncrease={() => handleIncrease(item.book_id, item.book_option_id)}
                                onDecrease={() => handleDecrease(item.book_id, item.book_option_id)}
                              />
                            </Grid2>
                          </Grid2>
                        </Grid2>
                        <Typography fontWeight={600} fontSize={16}>฿{item.price * item.quantity}</Typography>
                      </Box>
                    )
                  })
                )}
              </Box>

              <Grid2 className="d-flex justify-content-end mt-4">
                <Typography fontWeight={600} fontSize={18}>Total: ฿{totalPrice}</Typography>
              </Grid2>
            </Box>

            <Box className="d-flex flex-column gap-4">
              <Box
                className="d-flex justify-content-center align-items-center flex-column p-4 gap-2"
                sx={{ width: '350px', height: '200px', backgroundColor: '#fff', borderRadius: '8px' }}
              >
                <Typography fontWeight={600} fontSize={18}>
                  Total ({cartCount} item{cartCount !== 1 ? 's' : ''}): ฿{totalPrice}
                </Typography>
                <Link
                  href={canProceedToCheckout ? "/checkout" : "#"}
                  className={`checkoutButton d-flex justify-content-center p-2 text-decoration-none ${!canProceedToCheckout ? 'disabled' : ''}`}
                  style={{
                    width: '100%',
                    color: '#fff',
                    borderRadius: '18px',
                    opacity: canProceedToCheckout ? 1 : 0.6,
                    pointerEvents: canProceedToCheckout ? 'auto' : 'none'
                  }}
                  onClick={(e) => {
                    if (!canProceedToCheckout) {
                      e.preventDefault()
                    }
                  }}
                >
                  <Typography fontSize={14}>
                    {!shippingAddress ? 'Add Shipping Address' : 'Proceed to Checkout'}
                  </Typography>
                </Link>
                {!shippingAddress && (
                  <Typography fontSize={12} color="text.secondary" sx={{ textAlign: 'center' }}>
                    Please add your shipping address to continue
                  </Typography>
                )}
              </Box>

              <Box
                className="d-flex justify-content-center align-items-center flex-column p-4 gap-4"
                sx={{ width: '350px', height: 'auto', backgroundColor: '#fff', borderRadius: '8px' }}
              >

                <Typography fontWeight={600} fontSize={18}>
                  Shipping Address {!isLoggedIn && <Typography component="span" variant="body2" color="text.secondary">(Guest)</Typography>}
                </Typography>
                <ShippingAddressSection
                  isLoggedIn={isLoggedIn}
                  userId={userId}
                  userEmail={userEmail}
                  onAddressChange={handleAddressChange}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}