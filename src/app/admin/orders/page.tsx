'use client'

import { useState, useEffect } from 'react'
import {
    Box, Typography, Grid2, Paper, Button, 
    TextField, Select, MenuItem, FormControl, InputLabel,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Chip, Divider, CircularProgress, TablePagination
} from '@mui/material'
import { Search, Chat, Info } from '@mui/icons-material'
import { useCart } from '@/hooks/useCart'
import { OrderItem } from '@/types/order'
import { AddressRow } from '@/types/address'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'

type OrderFilter = 'All' | 'Unpaid' | 'Paid' | 'Shipping' | 'Completed' | 'Cancelled'

interface Order {
    id: number
    customer_name: string
    payment_status: string
    order_status: string
    total_price: number
    items_count: number
    created_at: string
}

interface OrderDetail {
    id: number
    customer_name: string
    payment_status: string
    order_status: string
    total_price: number
    payment_method: string
    created_at: string
    items: OrderItem[]
    shipping_address: AddressRow | null
}

export default function AdminOrdersPage() {
    const [selectedFilter, setSelectedFilter] = useState<OrderFilter>('All')
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [editedPaymentStatus, setEditedPaymentStatus] = useState('')
    const [editedOrderStatus, setEditedOrderStatus] = useState('')
    const [updating, setUpdating] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const { cartCount } = useCart()

    useEffect(() => {
        fetchOrders(searchTerm || undefined, selectedFilter)
    }, [selectedFilter])
    
    const filteredOrders = orders.filter(order =>
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const fetchOrders = async (search?: string, filter?: OrderFilter) => {
        try {
            setLoading(true)
            const url = search 
                ? `/api/orders?search=${encodeURIComponent(search)}`
                : '/api/orders'
            const response = await fetch(url)
            const data = await response.json()
            
            if (data.success) {
                let filteredOrders = data.orders
                
                if (filter && filter !== 'All') {
                    filteredOrders = filteredOrders.filter((order: Order) => {
                        const status = getStatusDisplay(order)
                        return status === filter
                    })
                }
                
                setOrders(filteredOrders)
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        if (value.trim()) {
            fetchOrders(value)
        } else {
            fetchOrders()
        }
    }

    const getStatusDisplay = (order: Order) => {
        if (order.payment_status === 'pending') return 'Unpaid'
        if (order.order_status === 'cancelled') return 'Cancelled'
        if (order.order_status === 'processing') return 'Paid'
        if (order.order_status === 'shipped') return 'Shipping'
        if (order.order_status === 'delivered') return 'Completed'
        return 'Unknown'
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Unpaid': return 'warning'
            case 'Cancelled': return 'error'
            case 'Paid': return 'info'
            case 'Shipping': return 'primary'
            case 'Completed': return 'success'
            default: return 'default'
        }
    }

    const handleOpenDetail = async (orderId: number) => {
        try {
            setLoadingDetail(true)
            setOpenDialog(true)
            
            const response = await fetch(`/api/orders/${orderId}`)
            const data = await response.json()
            
            if (data.success) {
                setSelectedOrder(data.order)
                setEditedPaymentStatus(data.order.payment_status)
                setEditedOrderStatus(data.order.order_status)
            }
        } catch (error) {
            console.error('Error fetching order details:', error)
        } finally {
            setLoadingDetail(false)
        }
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setSelectedOrder(null)
        setEditedPaymentStatus('')
        setEditedOrderStatus('')
    }

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return

        try {
            setUpdating(true)
            
            const response = await fetch(`/api/orders/${selectedOrder.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payment_status: editedPaymentStatus,
                    order_status: editedOrderStatus
                })
            })

            const data = await response.json()

            if (data.success) {
                fetchOrders(searchTerm || undefined)
                setSelectedOrder({
                    ...selectedOrder,
                    payment_status: editedPaymentStatus,
                    order_status: editedOrderStatus
                })
            }
        } catch (error) {
            console.error('Error updating order:', error)
        } finally {
            setUpdating(false)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    return (
        <Box className="d-flex" sx={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar cartCount={cartCount} />
            <Box className="content-area d-flex flex-column" sx={{ width: '100%' }}>
                <Navbar />
                <Box className="scrollbar" sx={{ overflowY: 'auto' }}>
                    <Box className="m-4">
                        <Box
                            className="d-flex flex-column p-4 gap-3"
                            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                        >
                            <Typography fontWeight={600} fontSize={20}>Orders</Typography>

                            <Paper sx={{ borderRadius: '8px' }}>
                                <Box
                                    className="d-flex justify-content-between align-items-center"
                                    sx={{ borderBottom: '1px solid #e0e0e0' }}
                                >
                                    <Box className="d-flex align-items-center" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                                        {(['All', 'Unpaid', 'Paid', 'Shipping', 'Completed', 'Cancelled'] as OrderFilter[]).map(filter => (
                                            <Button
                                                key={filter}
                                                sx={{
                                                    width: '100px',
                                                    color: selectedFilter === filter ? 'primary.main' : '#000',
                                                    borderBottom: '2px solid',
                                                    borderColor: selectedFilter === filter ? 'primary.main' : 'transparent',
                                                    borderRadius: '0',
                                                    textTransform: 'none',
                                                    fontWeight: selectedFilter === filter ? 600 : 400,
                                                    paddingY: '12px'
                                                }}
                                                onClick={() => setSelectedFilter(filter)}
                                            >
                                                <Typography>{filter}</Typography>
                                            </Button>
                                        ))}
                                    </Box>

                                    <Grid2 className="d-flex align-items-center px-2">
                                        <TextField
                                            placeholder="Search orders..."
                                            size="small"
                                            value={searchTerm}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            InputProps={{
                                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                                            }}
                                            sx={{ width: '300px' }}
                                        />
                                    </Grid2>
                                </Box>

                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell><strong>Order ID</strong></TableCell>
                                                <TableCell><strong>Customer Name</strong></TableCell>
                                                <TableCell><strong>Date</strong></TableCell>
                                                <TableCell><strong>Items</strong></TableCell>
                                                <TableCell><strong>Total</strong></TableCell>
                                                <TableCell><strong>Status</strong></TableCell>
                                                <TableCell align="center"><strong>Action</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                        <CircularProgress />
                                                    </TableCell>
                                                </TableRow>
                                            ) : orders.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                        <Typography color="text.secondary">No orders found</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                orders.map((order) => (
                                                    <TableRow key={order.id}>
                                                        <TableCell>#{order.id}</TableCell>
                                                        <TableCell>{order.customer_name}</TableCell>
                                                        <TableCell>{formatDate(order.created_at)}</TableCell>
                                                        <TableCell>{order.items_count}</TableCell>
                                                        <TableCell>฿{order.total_price}</TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={getStatusDisplay(order)} 
                                                                color={getStatusColor(getStatusDisplay(order))}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                                <Button
                                                                    size="small"
                                                                    sx={{ minWidth: 'auto', p: 0.5 }}
                                                                >
                                                                    <Chat fontSize="small" />
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    sx={{ minWidth: 'auto', p: 0.5 }}
                                                                    onClick={() => handleOpenDetail(order.id)}
                                                                >
                                                                    <Info fontSize="small" />
                                                                </Button>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={filteredOrders.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    sx={{
                                        '.MuiTablePagination-selectLabel': {
                                            margin: 0,
                                            display: 'flex',
                                            alignItems: 'center'
                                        },
                                        '.MuiTablePagination-displayedRows': {
                                            margin: 0,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }
                                    }}
                                />
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography fontSize={20} fontWeight={600}>
                        Order Details #{selectedOrder?.id}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {loadingDetail ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : selectedOrder ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Customer
                                </Typography>
                                <Typography variant="body1">{selectedOrder.customer_name}</Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Items
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                                    {selectedOrder.items.map((item, index) => (
                                        <Box 
                                            key={index} 
                                            sx={{ 
                                                display: 'flex', 
                                                gap: 2,
                                                alignItems: 'center',
                                                p: 2,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={item.image}
                                                alt={item.name}
                                                sx={{
                                                    width: 60,
                                                    height: 80,
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    ({item.option_type}) x{item.quantity}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" fontWeight={500}>
                                                ฿{(item.price * item.quantity)}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Total Price
                                </Typography>
                                <Typography fontSize={20} fontWeight={600} color="primary">
                                    ฿{selectedOrder.total_price}
                                </Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Payment Method
                                </Typography>
                                <Typography variant="body1">{selectedOrder.payment_method}</Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Shipping Address
                                </Typography>
                                {selectedOrder.shipping_address ? (
                                    <Box>
                                        <Typography variant="body1">
                                            {selectedOrder.shipping_address.first_name} {selectedOrder.shipping_address.last_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedOrder.shipping_address.address}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedOrder.shipping_address.country}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Tel: {selectedOrder.shipping_address.phone_number}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No shipping address
                                    </Typography>
                                )}
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Order Status
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Payment Status</InputLabel>
                                        <Select
                                            value={editedPaymentStatus}
                                            label="Payment Status"
                                            onChange={(e) => setEditedPaymentStatus(e.target.value)}
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="successful">Successful</MenuItem>
                                            <MenuItem value="failed">Failed</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Order Status</InputLabel>
                                        <Select
                                            value={editedOrderStatus}
                                            label="Order Status"
                                            onChange={(e) => setEditedOrderStatus(e.target.value)}
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="processing">Processing</MenuItem>
                                            <MenuItem value="shipped">Shipped</MenuItem>
                                            <MenuItem value="delivered">Delivered</MenuItem>
                                            <MenuItem value="cancelled">Cancelled</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Box>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleUpdateStatus}
                        disabled={updating || !selectedOrder}
                    >
                        {updating ? <CircularProgress size={24} /> : 'Update Status'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}