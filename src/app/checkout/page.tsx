'use client'

import { useState } from 'react'
import { Box, Button, Typography, Dialog, DialogContent } from '@mui/material'
import { useCart } from '@/hooks/useCart'
import { usePaymentStatus } from '@/hooks/usePayment'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'

export default function CheckoutPage() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [chargeId, setChargeId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const { cartCount, totalPrice } = useCart()

  const status = usePaymentStatus(chargeId)

  const handlePayment = async () => {
    const res = await fetch("/api/payment/charge", {
      method: "POST",
      body: JSON.stringify({ amount: totalPrice }),
      headers: { "Content-Type": "application/json" },
    })

    const data = await res.json()
    if (data.success) {
      setQrCode(data.qr)
      setChargeId(data.id)
      setOpen(true)
    }
  }

  return (
    <Box className="d-flex">
      <Sidebar cartCount={cartCount} />
      <Box className="content-area d-flex flex-column" sx={{ width: '100%', overflow: 'hidden' }}>
        <Navbar />
        <Box className="m-4">
          <Box className="d-flex flex-column align-items-center p-4" sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px' }}>
            <Typography fontWeight={600} fontSize={32}>ชำระเงินด้วย QR PromptPay</Typography>
            <Typography fontSize={24}>จำนวนเงิน: ฿{totalPrice}</Typography>
            <Button
              onClick={handlePayment}
              variant="contained"
              sx={{ width: '200px', mt: 4 }}
            >
              สร้าง QR ชำระเงิน
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center' }}>
          {qrCode && (
            <>
              <Typography variant="h6" gutterBottom>
                สแกน QR เพื่อชำระ
              </Typography>
              <img src={qrCode} alt="PromptPay QR" width={350} height={350} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                สถานะ: {status}
              </Typography>
              {status === "successful" && (
                <Typography color="green" fontWeight={600} sx={{ mt: 2 }}>
                  ✅ ชำระเงินสำเร็จ
                </Typography>
              )}
              {status === "failed" && (
                <Typography color="red" fontWeight={600} sx={{ mt: 2 }}>
                  ❌ การชำระล้มเหลว
                </Typography>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}