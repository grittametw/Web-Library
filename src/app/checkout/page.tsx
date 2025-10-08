'use client'

import { useState, useEffect } from 'react'
import { Box, Button, Typography, Dialog, DialogContent, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { usePaymentStatus } from '@/hooks/usePayment'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'

export default function CheckoutPage() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [chargeId, setChargeId] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, isLoggedIn } = useAuth()
  const { cart, cartCount, totalPrice, setCart } = useCart()
  const router = useRouter()
  const status = usePaymentStatus(chargeId)

  const getShippingAddress = () => {
    try {
      const saved = localStorage.getItem('guest_shipping_address')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }

  const getSelectedAddressId = () => {
    try {
      const saved = localStorage.getItem('selected_address_id')
      return saved ? parseInt(saved) : null
    } catch {
      return null
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      if (cart.length === 0) {
        setError('Your cart is empty')
        setLoading(false)
        return
      }

      const shippingAddress = getShippingAddress()
      const addressId = getSelectedAddressId()

      if (!isLoggedIn && !shippingAddress) {
        setError('Please add shipping address')
        setLoading(false)
        return
      }

      if (isLoggedIn && !addressId) {
        setError('Please select shipping address')
        setLoading(false)
        return
      }

      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: isLoggedIn ? user?.id : undefined,
          addressId: isLoggedIn ? addressId : undefined,
          guestEmail: !isLoggedIn ? shippingAddress?.email : undefined,
          guestAddress: !isLoggedIn ? shippingAddress : undefined,
          cartItems: cart.map(item => ({
            book_id: item.book_id,
            book_option_id: item.book_option_id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            option_type: item.option_type
          })),
          totalPrice
        })
      })

      const orderData = await orderRes.json()

      if (!orderData.success) {
        setError(orderData.error || 'Failed to create order')
        setLoading(false)
        return
      }

      const createdOrderId = orderData.orderId
      setOrderId(createdOrderId)

      const paymentRes = await fetch("/api/payment/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice })
      })

      const paymentData = await paymentRes.json()

      if (!paymentData.success) {
        setError('Failed to create payment')
        setLoading(false)
        return
      }

      await fetch("/api/orders/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: createdOrderId,
          chargeId: paymentData.chargeId,
          paymentStatus: 'pending'
        })
      })

      setCart([])
      if (!isLoggedIn) {
        localStorage.removeItem('guest_cart')
      }

      setQrCode(paymentData.qr)
      setChargeId(paymentData.chargeId)
      setOpen(true)

    } catch (err) {
      console.error('Payment error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!orderId || !chargeId || !status) return

    if (status === 'successful' || status === 'failed') {
      fetch("/api/orders/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          chargeId,
          paymentStatus: status
        })
      })
    }
  }, [status, orderId, chargeId])

  useEffect(() => {
    if (status === 'successful' && orderId) {
      setTimeout(() => {
        router.push(`/account/order-history/order/${orderId}`)
      }, 3000)
    }
  }, [status, orderId, router])

  return (
    <Box className="d-flex" sx={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar cartCount={cartCount} />
      <Box className="content-area d-flex flex-column" sx={{ width: '100%' }}>
        <Navbar />
        <Box className="scrollbar" sx={{ overflowY: 'auto' }}>
          <Box className="m-4">
            <Box
              className="d-flex flex-column align-items-center p-4"
              sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px' }}
            >
              <Typography fontWeight={600} fontSize={32}>ชำระเงินด้วย QR PromptPay</Typography>
              <Typography fontSize={24} sx={{ mt: 2 }}>จำนวนเงิน: ฿{totalPrice}</Typography>

              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

              <Button
                onClick={handlePayment}
                variant="contained"
                disabled={loading || cart.length === 0}
                sx={{ width: '200px', mt: 4 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'สร้าง QR ชำระเงิน'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          {qrCode && (
            <>
              <Typography variant="h6" gutterBottom>
                สแกน QR เพื่อชำระเงิน
              </Typography>
              <Box sx={{ my: 3 }}>
                <img src={qrCode} alt="PromptPay QR" width={350} height={350} />
              </Box>
              <Typography variant="body1" sx={{ mt: 2 }}>
                สถานะ: {status || 'กำลังรอการชำระเงิน...'}
              </Typography>
              {status === "successful" && (
                <Typography color="green" fontWeight={600} sx={{ mt: 2 }}>
                  ✅ ชำระเงินสำเร็จ กำลังนำไปหน้า Order...
                </Typography>
              )}
              {status === "failed" && (
                <Typography color="red" fontWeight={600} sx={{ mt: 2 }}>
                  ❌ การชำระเงินล้มเหลว
                </Typography>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}