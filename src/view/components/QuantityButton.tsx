import { useState } from 'react'
import { Box, Button, Typography, CircularProgress } from '@mui/material'

interface QuantityButtonProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
}

export default function QuantityButton({ quantity, onIncrease, onDecrease }: QuantityButtonProps) {
  const [loadingDecrease, setLoadingDecrease] = useState(false)
  const [loadingIncrease, setLoadingIncrease] = useState(false)

  const handleDecrease = async () => {
    setLoadingDecrease(true)
    await onDecrease()
    setLoadingDecrease(false)
  }

  const handleIncrease = async () => {
    setLoadingIncrease(true)
    await onIncrease()
    setLoadingIncrease(false)
  }

  return (
    <Box
      className="d-flex justify-content-center align-items-center gap-4"
      sx={{ border: 'solid 1px #ccc', borderRadius: '8px' }}>
      <Button
        onClick={handleDecrease}
        disabled={loadingDecrease}
        sx={{ width: '100%', borderRadius: '0px', borderRight: '1px solid #ccc' }}>
        {loadingDecrease ? <CircularProgress size={14} /> : <Typography fontSize={14}>-</Typography>}
      </Button>
      <Typography fontSize={14}>{quantity}</Typography>
      <Button
        onClick={handleIncrease}
        disabled={loadingIncrease}
        sx={{ width: '100%', borderRadius: '0px', borderLeft: '1px solid #ccc' }}
      >
        {loadingIncrease ? <CircularProgress size={14} /> : <Typography fontSize={14}>+</Typography>}
      </Button>
    </Box>
  )
}