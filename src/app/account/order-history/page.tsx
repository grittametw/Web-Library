'use client'

import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress, Alert, Snackbar } from '@mui/material'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { Order } from '@/types/order'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import ConfirmDialog from '@/view/components/ConfirmDialog'

type OrderFilter = 'All' | 'To Pay' | 'To Ship' | 'To Receive' | 'Completed' | 'Cancelled'

export default function OrderHistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>('All')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [completing, setCompleting] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const { cartCount } = useCart()
  const { user, isLoggedIn } = useAuth()

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [isLoggedIn, user])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${user?.id}/orders`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCompleteClick = (orderId: number) => {
    setSelectedOrderId(orderId)
    setConfirmDialogOpen(true)
  }

  const handleConfirmComplete = async () => {
    if (!selectedOrderId) return

    setCompleting(true)
    try {
      const response = await fetch(`/api/users/${user?.id}/orders/${selectedOrderId}/complete`, {
        method: 'PUT'
      })

      const data = await response.json()

      if (data.success) {
        setSnackbarMessage('Order completed successfully!')
        setSnackbarOpen(true)
        await fetchOrders() // Refresh orders
      } else {
        setSnackbarMessage(data.error || 'Failed to complete order')
        setSnackbarOpen(true)
      }
    } catch (error) {
      console.error('Failed to complete order:', error)
      setSnackbarMessage('An error occurred')
      setSnackbarOpen(true)
    } finally {
      setCompleting(false)
      setConfirmDialogOpen(false)
      setSelectedOrderId(null)
    }
  }

  const handleCancelConfirm = () => {
    setConfirmDialogOpen(false)
    setSelectedOrderId(null)
  }

  const getStatusLabel = (order: Order): string => {
    if (order.payment_status === 'pending') return 'To Pay'
    if (order.order_status === 'cancelled') return 'Cancelled'
    if (order.order_status === 'processing') return 'To Ship'
    if (order.order_status === 'shipped') return 'To Receive'
    if (order.order_status === 'delivered') return 'Completed'
    return 'Unknown'
  }

  const getStatusColor = (order: Order): string => {
    const status = getStatusLabel(order)
    switch (status) {
      case 'To Pay': return '#ff9800'
      case 'To Ship': return '#2196f3'
      case 'To Receive': return '#9c27b0'
      case 'Completed': return '#4caf50'
      case 'Cancelled': return '#f44336'
      default: return '#757575'
    }
  }

  const filterOrders = (orders: Order[]): Order[] => {
    if (selectedFilter === 'All') return orders

    return orders.filter(order => {
      const status = getStatusLabel(order)
      return status === selectedFilter
    })
  }

  const filteredOrders = filterOrders(orders)

  return (
    <Box className="d-flex" sx={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar cartCount={cartCount} />
      <Box className="content-area d-flex flex-column" sx={{ width: '100%' }}>
        <Navbar />
        <Box className="scrollbar" sx={{ overflowY: 'auto' }}>
          <Box className="m-4">
            <Box className="d-flex align-items-center" sx={{ backgroundColor: '#fff', borderRadius: '8px', mb: 3 }}>
              {(['All', 'To Pay', 'To Ship', 'To Receive', 'Completed', 'Cancelled'] as OrderFilter[]).map(filter => (
                <Button
                  key={filter}
                  sx={{
                    width: '100%',
                    height: '50px',
                    color: '#000',
                    borderBottom: '2px solid',
                    borderColor: selectedFilter === filter ? '#1976d2' : '#999',
                    borderRadius: '0',
                    textTransform: 'none',
                    fontWeight: selectedFilter === filter ? 600 : 400
                  }}
                  onClick={() => setSelectedFilter(filter)}
                >
                  <Typography>{filter}</Typography>
                </Button>
              ))}
            </Box>

            <Box className="d-flex flex-column gap-3">
              {!isLoggedIn ? (
                <Box
                  className="d-flex flex-column justify-content-center align-items-center p-5"
                  sx={{ backgroundColor: '#fff', borderRadius: '8px', minHeight: '400px', gap: 3 }}
                >
                  <Typography fontSize={20} fontWeight={600} color="text.secondary">
                    Please log in to view your order history.
                  </Typography>
                  <Link
                    href="#"
                    onClick={e => {
                      e.preventDefault()
                      window.location.href = '/login'
                    }}
                    style={{ textDecoration: 'none' }}>
                    <Button variant="contained" size="large">
                      Go to Login
                    </Button>
                  </Link>
                </Box>
              ) : loading ? (
                <Box className="d-flex justify-content-center align-items-center p-4" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                  <CircularProgress />
                </Box>
              ) : filteredOrders.length === 0 ? (
                <Box
                  className="d-flex justify-content-center align-items-center p-4"
                  sx={{ backgroundColor: '#fff', borderRadius: '8px', minHeight: '200px' }}
                >
                  <Typography color="text.secondary" fontSize={18}>
                    {selectedFilter === 'All' ? 'No orders yet' : `No orders in "${selectedFilter}"`}
                  </Typography>
                </Box>
              ) : (
                filteredOrders.map(order => (
                  <Box
                    key={order.id}
                    className="d-flex flex-column p-4"
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <Box className="d-flex justify-content-between align-items-center pb-3" sx={{ borderBottom: '1px solid #e0e0e0' }}>
                      <Box className="d-flex align-items-center gap-3">
                        <Typography fontWeight={600} fontSize={16}>
                          Order #{order.id}
                        </Typography>
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          sx={{
                            color: getStatusColor(order),
                            backgroundColor: `${getStatusColor(order)}20`,
                            px: 2,
                            py: 0.5,
                            borderRadius: '12px'
                          }}
                        >
                          {getStatusLabel(order)}
                        </Typography>
                      </Box>
                      <Typography fontWeight={600} fontSize={18} color="primary">
                        Total: ฿{order.total_price}
                      </Typography>
                    </Box>

                    <Link
                      href={`/account/order-history/order/${order.id}`}
                      className="d-flex flex-column"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {order.items.map((item, index) => (
                        <Box
                          key={`${item.book_id}-${item.book_option_id}-${index}`}
                          className="d-flex gap-4 py-2"
                          sx={{ borderBottom: '1px solid #e0e0e0' }}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={120}
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                          />
                          <Box className="d-flex flex-column justify-content-between" sx={{ flex: 1 }}>
                            <Box>
                              <Typography fontWeight={600} fontSize={16}>
                                {item.name}
                              </Typography>
                              <Typography fontSize={14} color="text.secondary">
                                Format: {item.option_type}
                              </Typography>
                            </Box>
                            <Box className="d-flex justify-content-between align-items-center">
                              <Typography fontSize={14}>
                                x{item.quantity}
                              </Typography>
                              <Typography fontWeight={600} fontSize={16}>
                                ฿{item.price * item.quantity}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Link>

                    {order.order_status === 'shipped' && (
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 2 }}
                        onClick={() => handleCompleteClick(order.id)}
                      >
                        Item received
                      </Button>
                    )}
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Confirm Item Receipt"
        message="Are you sure you received the item?"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleConfirmComplete}
        onCancel={handleCancelConfirm}
        loading={completing}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}