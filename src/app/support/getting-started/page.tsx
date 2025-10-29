'use client'

import { Box, Typography, Grid2, Paper, Button } from '@mui/material'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import {
    SearchOutlined, ShoppingCartOutlined, PaymentOutlined, LocalShippingOutlined,
    FavoriteBorder, AutoStoriesOutlined, TipsAndUpdates, HelpOutline, SupportAgentOutlined
} from '@mui/icons-material'

export default function GettingStartedPage() {
    const { cartCount } = useCart()

    const steps = [
        {
            number: '1',
            title: 'Browse & Search',
            description: 'Find books you love through categories or use the Search Bar',
            icon: <SearchOutlined sx={{ fontSize: 40, color: '#1976d2' }} />
        },
        {
            number: '2',
            title: 'Add to Cart',
            description: 'Choose your preferred format (Hardcover/Paperback/E-book) and add to cart',
            icon: <ShoppingCartOutlined sx={{ fontSize: 40, color: '#1976d2' }} />
        },
        {
            number: '3',
            title: 'Checkout',
            description: 'Review your order and complete payment via QR Code',
            icon: <PaymentOutlined sx={{ fontSize: 40, color: '#1976d2' }} />
        },
        {
            number: '4',
            title: 'Get Your Books',
            description: 'Receive physical books at home or download E-books instantly',
            icon: <LocalShippingOutlined sx={{ fontSize: 40, color: '#1976d2' }} />
        }
    ]

    const features = [
        {
            icon: <AutoStoriesOutlined sx={{ fontSize: 36 }} />,
            title: 'Multiple Formats',
            description: 'Choose from Hardcover, Paperback, or E-book'
        },
        {
            icon: <FavoriteBorder sx={{ fontSize: 36 }} />,
            title: 'Favorite List',
            description: 'Save books you love for later purchase'
        },
        {
            icon: <PaymentOutlined sx={{ fontSize: 36 }} />,
            title: 'Easy Payment',
            description: 'Pay easily with QR Code'
        }
    ]

    const tips = [
        {
            title: 'Use Favorite List',
            description: 'Click the heart icon to save books you\'re interested in and come back later'
        },
        {
            title: 'Check Stock Before Buying',
            description: 'View remaining stock before making a decision to avoid out-of-stock items'
        },
        {
            title: 'Choose the Right Format',
            description: 'E-book for instant access, Paperback for affordability, Hardcover for collecting'
        },
        {
            title: 'Use Category Filters',
            description: 'Click category buttons to filter books by genre you\'re interested in'
        }
    ]

    return (
        <Box className="d-flex" sx={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar cartCount={cartCount} />
            <Box className="content-area d-flex flex-column" sx={{ width: '100%' }}>
                <Navbar />
                <Box className="scrollbar" sx={{ overflowY: 'auto' }}>
                    <Box className="m-4">
                        <Box
                            className="d-flex flex-column align-items-center p-5 mb-4"
                            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                        >
                            <Typography
                                variant="h3"
                                fontWeight={700}
                                sx={{ mb: 2, color: '#1976d2' }}
                            >
                                Welcome to Web Library
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                textAlign="center"
                                sx={{ mb: 3 }}
                            >
                                Your digital bookstore for discovering and collecting books across all genres
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => window.location.href = '/'}
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                <Typography fontSize={18}>Start Shopping</Typography>
                            </Button>
                        </Box>

                        <Box
                            className="p-4 mb-4"
                            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{ mb: 4, textAlign: 'center' }}
                            >
                                How to Shop
                            </Typography>
                            <Grid2 container spacing={3}>
                                {steps.map((step, index) => (
                                    <Grid2 key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                p: 3,
                                                height: '100%',
                                                borderRadius: '8px',
                                                textAlign: 'center',
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: 4
                                                }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#e7f1fe',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 16px',
                                                    fontWeight: 700,
                                                    fontSize: 24,
                                                    color: '#1976d2'
                                                }}
                                            >
                                                {step.number}
                                            </Box>
                                            <Box sx={{ mb: 2 }}>{step.icon}</Box>
                                            <Typography
                                                fontWeight={600}
                                                fontSize={18}
                                                sx={{ mb: 1 }}
                                            >
                                                {step.title}
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                fontSize={14}
                                            >
                                                {step.description}
                                            </Typography>
                                        </Paper>
                                    </Grid2>
                                ))}
                            </Grid2>
                        </Box>

                        <Box
                            className="p-4 mb-4"
                            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{ mb: 4, textAlign: 'center' }}
                            >
                                Key Features
                            </Typography>
                            <Grid2 container spacing={3}>
                                {features.map((feature, index) => (
                                    <Grid2 key={index} size={{ xs: 12, md: 4 }}>
                                        <Box
                                            sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                borderRadius: '8px',
                                                backgroundColor: '#f5f5f5'
                                            }}
                                        >
                                            <Box sx={{ color: '#1976d2', mb: 2 }}>
                                                {feature.icon}
                                            </Box>
                                            <Typography fontWeight={600} fontSize={18} sx={{ mb: 1 }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography color="text.secondary" fontSize={14}>
                                                {feature.description}
                                            </Typography>
                                        </Box>
                                    </Grid2>
                                ))}
                            </Grid2>
                        </Box>

                        <Box
                            className="p-4 mb-4"
                            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                        >
                            <Box className="d-flex align-items-center justify-content-center gap-2 mb-4">
                                <TipsAndUpdates sx={{ color: '#1976d2', fontSize: 32 }} />
                                <Typography
                                    variant="h5"
                                    fontWeight={600}
                                >
                                    Quick Tips for New Users
                                </Typography>
                            </Box>
                            <Grid2 container spacing={2}>
                                {tips.map((tip, index) => (
                                    <Grid2 key={index} size={{ xs: 12, md: 6 }}>
                                        <Paper
                                            elevation={1}
                                            sx={{
                                                p: 3,
                                                borderRadius: '8px',
                                                borderLeft: '4px solid #1976d2',
                                                height: '100%'
                                            }}
                                        >
                                            <Typography fontWeight={600} fontSize={16} sx={{ mb: 1 }}>
                                                💡 {tip.title}
                                            </Typography>
                                            <Typography color="text.secondary" fontSize={14}>
                                                {tip.description}
                                            </Typography>
                                        </Paper>
                                    </Grid2>
                                ))}
                            </Grid2>
                        </Box>

                        <Box
                            className="p-4 mb-4"
                            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{ mb: 3, textAlign: 'center' }}
                            >
                                Popular Categories
                            </Typography>
                            <Grid2 container spacing={2} justifyContent="center">
                                {['Sci-Fi', 'Fantasy', 'Drama', 'Horror', 'Historical'].map((category) => (
                                    <Grid2 key={category}>
                                        <Button
                                            variant="contained"
                                            onClick={() => window.location.href = '/'}
                                            sx={{
                                                backgroundColor: '#e7f1fe',
                                                color: '#000',
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                px: 3,
                                                py: 1,
                                                '&:hover': {
                                                    backgroundColor: '#1976d2',
                                                    color: '#fff'
                                                }
                                            }}
                                        >
                                            <Typography fontSize={16}>{category}</Typography>
                                        </Button>
                                    </Grid2>
                                ))}
                            </Grid2>
                        </Box>

                        <Box
                            className="p-4 mb-4"
                            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight={600}
                                sx={{ mb: 3 }}
                            >
                                Payment & Delivery
                            </Typography>
                            <Grid2 container spacing={3}>
                                <Grid2 size={{ xs: 12, md: 6 }}>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 3,
                                            borderRadius: '8px',
                                            backgroundColor: '#f0f5ff'
                                        }}
                                    >
                                        <Typography fontWeight={600} fontSize={18} sx={{ mb: 2 }}>
                                            💳 Payment Method
                                        </Typography>
                                        <Typography color="text.secondary" fontSize={14} sx={{ mb: 1 }}>
                                            • Payment via QR Code PromptPay only
                                        </Typography>
                                        <Typography color="text.secondary" fontSize={14}>
                                            • Convenient, fast, and 100% secure
                                        </Typography>
                                    </Paper>
                                </Grid2>
                                <Grid2 size={{ xs: 12, md: 6 }}>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 3,
                                            borderRadius: '8px',
                                            backgroundColor: '#f0f5ff'
                                        }}
                                    >
                                        <Typography fontWeight={600} fontSize={18} sx={{ mb: 2 }}>
                                            📦 Delivery Options
                                        </Typography>
                                        <Typography color="text.secondary" fontSize={14} sx={{ mb: 1 }}>
                                            • E-book: Instant delivery after payment
                                        </Typography>
                                        <Typography color="text.secondary" fontSize={14}>
                                            • Physical Book: Kerry Express / Thailand Post
                                        </Typography>
                                    </Paper>
                                </Grid2>
                            </Grid2>
                        </Box>

                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <Box
                                    className="p-4 text-center"
                                    sx={{
                                        backgroundColor: '#e7f1fe',
                                        borderRadius: '8px',
                                        height: '100%'
                                    }}
                                >
                                    <HelpOutline sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                                    <Typography fontWeight={600} fontSize={18} sx={{ mb: 2 }}>
                                        Have Questions?
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                                        Check out frequently asked questions
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => window.location.href = '/support/FAQ'}
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            px: 4
                                        }}
                                    >
                                        <Typography fontSize={16}>View FAQ</Typography>
                                    </Button>
                                </Box>
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <Box
                                    className="p-4 text-center"
                                    sx={{
                                        backgroundColor: '#fff3e0',
                                        borderRadius: '8px',
                                        height: '100%'
                                    }}
                                >
                                    <SupportAgentOutlined sx={{ fontSize: 48, color: '#f57c00', mb: 2 }} />
                                    <Typography fontWeight={600} fontSize={18} sx={{ mb: 2 }}>
                                        Need More Help?
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                                        Contact our team 24/7
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => window.location.href = '/support'}
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            px: 4,
                                            backgroundColor: '#f57c00',
                                            '&:hover': {
                                                backgroundColor: '#e65100'
                                            }
                                        }}
                                    >
                                        <Typography fontSize={16}>Contact Support</Typography>
                                    </Button>
                                </Box>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}