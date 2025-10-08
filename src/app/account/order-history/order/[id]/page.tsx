'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Grid2, Stepper, Step, StepLabel, CircularProgress, Button } from '@mui/material'
import { ReceiptOutlined, PaidOutlined, LocalShippingOutlined, ArchiveOutlined, ArrowBackIos } from '@mui/icons-material'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { styled } from '@mui/material/styles'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { Order } from '@/types/order'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import ConfirmDialog from '@/view/components/ConfirmDialog'

interface RouteParams {
    params: { id: string }
}

export default function OrderDetailPage({ params }: RouteParams) {
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [orderId, setOrderId] = useState<string | null>(null)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [completing, setCompleting] = useState(false)
    const { cartCount } = useCart()
    const { user, isLoggedIn, loading: authLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const fetchParams = async () => {
            const resolvedParams = await params
            setOrderId(resolvedParams.id)
        }
        fetchParams()
    }, [params])

    useEffect(() => {
        if (authLoading) return

        if (!isLoggedIn) {
            router.push('/login')
            return
        }

        if (user?.id && orderId) {
            fetchOrderDetail()
        }
    }, [authLoading, isLoggedIn, user, orderId])

    const fetchOrderDetail = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/users/${user?.id}/orders/${orderId}`)
            const data = await response.json()

            if (!data.success || response.status === 404) {
                router.push('/account/order-history')
                return
            }

            setOrder(data.order)
        } catch (error) {
            console.error('Failed to fetch order detail:', error)
            router.push('/account/order-history')
        } finally {
            setLoading(false)
        }
    }

    const handleCompleteClick = () => {
        setConfirmDialogOpen(true)
    }

    const handleConfirmComplete = async () => {
        setCompleting(true)
        try {
            const response = await fetch(`/api/users/${user?.id}/orders/${orderId}/complete`, {
                method: 'PUT'
            })

            const data = await response.json()

            if (data.success) {
                // Refresh order detail
                await fetchOrderDetail()
            }
        } catch (error) {
            console.error('Failed to complete order:', error)
        } finally {
            setCompleting(false)
            setConfirmDialogOpen(false)
        }
    }

    const handleCancelConfirm = () => {
        setConfirmDialogOpen(false)
    }

    const getActiveStep = (): number => {
        if (!order) return 0
        if (order.order_status === 'cancelled') return -1
        if (order.order_status === 'delivered') return 3
        if (order.order_status === 'shipped') return 2
        if (order.payment_status === 'successful') return 1
        if (order.order_status === 'pending') return 0

        return 0
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (): string => {
        if (!order) return '#757575'
        if (order.order_status === 'cancelled') return '#f44336'
        if (order.payment_status === 'pending') return '#ff9800'
        if (order.order_status === 'processing') return '#2196f3'
        if (order.order_status === 'shipped') return '#9c27b0'
        if (order.order_status === 'delivered') return '#4caf50'
        return '#757575'
    }

    const getStatusText = (): string => {
        if (!order) return 'Unknown'
        if (order.order_status === 'cancelled') return 'Cancelled'
        if (order.payment_status === 'pending') return 'To Pay'
        if (order.order_status === 'processing') return 'To Ship'
        if (order.order_status === 'shipped') return 'To Receive'
        if (order.order_status === 'delivered') return 'Completed'
        return 'Unknown'
    }

    const activeStep = getActiveStep()

    const steps = [
        { label: 'Order Placed', icon: ReceiptOutlined },
        { label: 'Order Paid', icon: PaidOutlined },
        { label: 'Order Shipped Out', icon: LocalShippingOutlined },
        { label: 'Order Received', icon: ArchiveOutlined },
    ]

    const CustomStepConnector = styled(StepConnector)(() => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                borderColor: '#4caf50',
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                borderColor: '#4caf50',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#999',
            borderTopWidth: 3,
            borderRadius: 1,
        },
    }))

    if (loading) {
        return (
            <Box className="d-flex" sx={{ height: '100vh' }}>
                <Sidebar cartCount={cartCount} />
                <Box className="content-area d-flex flex-column" sx={{ width: '100%', overflow: 'hidden' }}>
                    <Navbar />
                    <Box className="d-flex justify-content-center align-items-center" sx={{ height: '100%' }}>
                        <CircularProgress />
                    </Box>
                </Box>
            </Box>
        )
    }

    if (!order) return null

    return (
        <Box className="d-flex" sx={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar cartCount={cartCount} />
            <Box className="content-area d-flex flex-column" sx={{ width: '100%' }}>
                <Navbar />
                <Box className="scrollbar" sx={{ overflowY: 'auto' }}>
                    <Box className="d-flex flex-column m-4 gap-2">
                        <Box className="d-flex align-items-center p-4" sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                            <Grid2 className="d-flex justify-content-between align-items-center" sx={{ width: '100%' }}>
                                <Link href="/account/order-history" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Box className="d-flex align-items-center gap-1" sx={{ cursor: 'pointer', '&:hover': { color: '#1976d2' } }}>
                                        <ArrowBackIos sx={{ fontSize: 16 }} />
                                        <Typography>Back</Typography>
                                    </Box>
                                </Link>
                                <Grid2 className="d-flex align-items-center gap-4">
                                    <Typography fontWeight={600}>ORDER ID. #{order.id}</Typography>
                                    <Typography>|</Typography>
                                    <Typography color={getStatusColor()} fontWeight={600}>
                                        {getStatusText()}
                                    </Typography>
                                    {order.order_status === 'shipped' && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                onClick={handleCompleteClick}
                                            >
                                                Item received
                                            </Button>
                                        </>
                                    )}
                                </Grid2>
                            </Grid2>
                        </Box>

                        <Box
                            className="d-flex justify-content-center align-items-center p-4"
                            sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px', minHeight: '200px' }}
                        >
                            {order.order_status === 'cancelled' ? (
                                <Typography fontSize={32} fontWeight={600} color="#f44336">
                                    Order canceled
                                </Typography>
                            ) : (
                                <Box sx={{ width: '100%' }}>
                                    <Stepper activeStep={activeStep} alternativeLabel connector={<CustomStepConnector />}>
                                        {steps.map((step, index) => {
                                            const IconComponent = step.icon
                                            return (
                                                <Step key={index}>
                                                    <StepLabel
                                                        icon={
                                                            <IconComponent
                                                                sx={{
                                                                    fontSize: '64px',
                                                                    color: activeStep >= index ? '#4caf50' : '#999',
                                                                    border: '4px solid',
                                                                    borderRadius: 8,
                                                                    p: 1,
                                                                    zIndex: 1,
                                                                    backgroundColor: '#fff'
                                                                }}
                                                            />
                                                        }
                                                    >
                                                        <Typography fontWeight={activeStep >= index ? 600 : 400}>
                                                            {step.label}
                                                        </Typography>
                                                        {index === 0 && (
                                                            <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
                                                                {formatDate(order.created_at)}
                                                            </Typography>
                                                        )}
                                                    </StepLabel>
                                                </Step>
                                            )
                                        })}
                                    </Stepper>
                                </Box>
                            )}
                        </Box>

                        <Grid2 className="d-flex gap-2">
                            {order.shipping_address && (
                                <Box className="d-flex flex-column p-4 gap-2" sx={{ width: '30%', backgroundColor: '#fff', borderRadius: '8px' }}>
                                    <Typography fontWeight={600} fontSize={20}>Delivery Address</Typography>
                                    <Box sx={{ pl: 2, pt: 2 }}>
                                        <Typography fontWeight={600}>
                                            {order.shipping_address.firstName} {order.shipping_address.lastName}
                                        </Typography>
                                        <Typography color="text.secondary" sx={{ mt: 1 }}>{order.shipping_address.phoneNumber}</Typography>
                                        <Typography color="text.secondary">
                                            {order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                                        </Typography>
                                        <Typography color="text.secondary">{order.shipping_address.country}</Typography>
                                    </Box>
                                </Box>
                            )}

                            <Box
                                className="d-flex flex-column p-4"
                                sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px' }}
                            >
                                <Typography
                                    fontWeight={600}
                                    fontSize={20}
                                    sx={{ borderBottom: '1px solid #e0e0e0', pb: 1 }}
                                >
                                    Item{order.items.length !== 1 ? 's' : ''}
                                </Typography>

                                {order.items.map((item, index) => (
                                    <Box
                                        key={`${item.book_id}-${item.book_option_id}-${index}`}
                                        className="d-flex gap-4 py-2"
                                        sx={{ borderBottom: index < order.items.length - 1 ? '1px solid #e0e0e0' : 'none' }}
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={80}
                                            height={120}
                                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                        <Link
                                            href={`/${item.name}`}
                                            className="d-flex flex-column justify-content-between"
                                            style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
                                        >
                                            <Box>
                                                <Typography fontWeight={600} fontSize={16}>
                                                    {item.name}
                                                </Typography>
                                                <Typography fontSize={14} color="text.secondary">
                                                    Format: {item.option_type}
                                                </Typography>
                                            </Box>
                                            <Box className="d-flex justify-content-between align-items-center">
                                                <Typography fontSize={14} color="text.secondary">
                                                    x{item.quantity}
                                                </Typography>
                                                <Typography fontWeight={600} fontSize={16}>
                                                    ฿{item.price * item.quantity}
                                                </Typography>
                                            </Box>
                                        </Link>
                                    </Box>
                                ))}

                                <Box className="d-flex flex-column pt-4 gap-2" borderTop={"1px solid #e0e0e0"}>
                                    <Box className="d-flex align-items-center">
                                        <Typography
                                            color="text.secondary"
                                            width={"90%"}
                                            textAlign={"end"}
                                        >
                                            Payment Method:
                                        </Typography>
                                        <Typography
                                            width={"10%"}
                                            textAlign={"end"}
                                        >
                                            PromptPay
                                        </Typography>
                                    </Box>
                                    <Box className="d-flex align-items-center">
                                        <Typography
                                            color="text.secondary"
                                            width={"90%"}
                                            textAlign={"end"}
                                        >
                                            Total:
                                        </Typography>
                                        <Typography
                                            fontSize={20}
                                            fontWeight={600}
                                            color="primary"
                                            width={"10%"}
                                            textAlign={"end"}
                                        >
                                            ฿{order.total_price}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid2>
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
        </Box>
    )
}