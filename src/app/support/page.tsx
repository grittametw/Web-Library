'use client'

import { useState } from 'react'
import { Box, Typography, InputBase, Grid2, Paper, List, ListItem, ListItemButton, Chip } from '@mui/material'
import { Search, Extension, LiveHelp, Forum, People, ConfirmationNumber, TrendingUp } from '@mui/icons-material'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import Link from 'next/link'
import '@/styles/support.css'

interface SearchResult {
    question: string
    answer: string
    category: string
    categoryId: string
}

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showAutocomplete, setShowAutocomplete] = useState(false)
    const { cartCount } = useCart()

    const faqData: SearchResult[] = [
        {
            question: 'How do I place an order?',
            answer: 'Select → Choose format → Add to cart → Checkout → Complete payment',
            category: 'Ordering',
            categoryId: 'ordering'
        },
        {
            question: 'Can I modify my order after placing it?',
            answer: 'You can modify before payment. After payment, orders cannot be modified.',
            category: 'Ordering',
            categoryId: 'ordering'
        },
        {
            question: 'Do I need to create an account to purchase?',
            answer: 'Yes, you must register and log in before making a purchase.',
            category: 'Ordering',
            categoryId: 'ordering'
        },
        {
            question: 'How many books can I order at once?',
            answer: 'No limit, subject to available stock.',
            category: 'Ordering',
            categoryId: 'ordering'
        },

        {
            question: 'What payment methods do you accept?',
            answer: 'QR Code PromptPay only. Convenient, fast, and 100% secure.',
            category: 'Payment',
            categoryId: 'payment'
        },
        {
            question: 'How long do I have to complete payment?',
            answer: 'Please complete payment within 15 minutes.',
            category: 'Payment',
            categoryId: 'payment'
        },
        {
            question: 'Will I receive a receipt?',
            answer: 'Yes, via email immediately after successful payment.',
            category: 'Payment',
            categoryId: 'payment'
        },
        {
            question: 'Can I get a refund?',
            answer: 'E-books: non-refundable. Physical books: 7 days if defective.',
            category: 'Payment',
            categoryId: 'payment'
        },

        {
            question: 'How long does delivery take?',
            answer: 'E-books: Instant | Physical: 3-5 days (BKK) or 5-7 days (provinces)',
            category: 'Shipping',
            categoryId: 'shipping'
        },
        {
            question: 'How much is shipping?',
            answer: 'E-books: Free | Physical: 50 THB or free over 500 THB',
            category: 'Shipping',
            categoryId: 'shipping'
        },
        {
            question: 'How can I track my order?',
            answer: 'Go to Your Account → Order History',
            category: 'Shipping',
            categoryId: 'shipping'
        },
        {
            question: 'Can I change my shipping address?',
            answer: 'Yes, contact Support before shipping with your order number.',
            category: 'Shipping',
            categoryId: 'shipping'
        },
        {
            question: 'What book formats are available?',
            answer: 'Hardcover, Paperback, and E-book',
            category: 'About Books',
            categoryId: 'about-books'
        },
        {
            question: 'What devices can I read E-books on?',
            answer: 'PC, Mac, Tablet, Smartphone with PDF/E-book Reader',
            category: 'About Books',
            categoryId: 'about-books'
        },
        {
            question: 'Can I preview books before buying?',
            answer: 'View details, descriptions, and reviews on book pages',
            category: 'About Books',
            categoryId: 'about-books'
        },
        {
            question: 'When will out-of-stock books be available?',
            answer: 'Click "Notify Me" for email notification',
            category: 'About Books',
            categoryId: 'about-books'
        },
        {
            question: 'What if I forget my password?',
            answer: 'Click "Forgot Password" on Login page',
            category: 'Account',
            categoryId: 'account'
        },
        {
            question: 'Can I change my email address?',
            answer: 'Yes, go to Your Account → Settings → Change Email',
            category: 'Account',
            categoryId: 'account'
        },
        {
            question: 'How secure is my personal information?',
            answer: 'Encrypted with SSL, never shared with third parties',
            category: 'Account',
            categoryId: 'account'
        },
        {
            question: 'Can I delete my account?',
            answer: 'Contact Support team to request account deletion',
            category: 'Account',
            categoryId: 'account'
        },
        {
            question: 'Do you offer promotions or discounts?',
            answer: 'Follow homepage and Newsletter for special promotions',
            category: 'Others',
            categoryId: 'others'
        },
        {
            question: 'Can I purchase books as gifts?',
            answer: 'Yes, specify different recipient address',
            category: 'Others',
            categoryId: 'others'
        },
        {
            question: 'How do I contact Support?',
            answer: 'Support page or email support@weblibrary.com',
            category: 'Others',
            categoryId: 'others'
        },
        {
            question: 'Is there a mobile app?',
            answer: 'Not yet, but website is fully responsive',
            category: 'Others',
            categoryId: 'others'
        },
    ]

    const popularSearches = [
        'How do I place an order',
        'Payment methods',
        'How long does delivery take',
        'Track my order',
        'Refund',
        'E-book',
        'Forget password',
        'Contact support'
    ]

    const filteredResults = faqData.filter(item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        setShowAutocomplete(query.trim().length > 0)
    }

    const handleResultClick = (categoryId: string) => {
        setShowAutocomplete(false)
        setSearchQuery('')
        window.location.href = `/support/FAQ#${categoryId}`
    }

    const handlePopularSearch = (query: string) => {
        setSearchQuery(query)
        setShowAutocomplete(true)
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Ordering': return '🛒'
            case 'Payment': return '💳'
            case 'Shipping': return '📦'
            case 'About Books': return '📚'
            case 'Account': return '👤'
            case 'Others': return '❔'
            default: return '📄'
        }
    }

    return (
        <Box className="d-flex" sx={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar cartCount={cartCount} />
            <Box className="content-area d-flex flex-column" sx={{ width: '100%' }}>
                <Navbar />
                <Box className="scrollbar" sx={{ overflowY: 'auto' }}>
                    <Box className="m-4">
                        <Box
                            className="d-flex flex-column align-items-center gap-5"
                            sx={{ backgroundColor: '#fff', borderRadius: '8px', paddingY: 10 }}
                        >
                            <Typography fontWeight={600} fontSize={32}>How can we help?</Typography>

                            <Box sx={{ position: 'relative', width: 600 }}>
                                <Box
                                    className="d-flex align-items-center"
                                    sx={{ backgroundColor: '#f0f5ff', borderRadius: '8px' }}
                                >
                                    <Search sx={{ margin: '10px', cursor: 'pointer' }} />
                                    <InputBase
                                        placeholder="Search... (e.g., How to order, Payment, Shipping)"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onFocus={() => searchQuery && setShowAutocomplete(true)}
                                        onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                                        sx={{ width: '100%', py: 1 }}
                                    />
                                </Box>

                                {showAutocomplete && filteredResults.length > 0 && (
                                    <Paper
                                        sx={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            mt: 1,
                                            maxHeight: 400,
                                            overflowY: 'auto',
                                            zIndex: 1000,
                                            boxShadow: 3
                                        }}
                                    >
                                        <List sx={{ p: 0 }}>
                                            {filteredResults.slice(0, 10).map((result, index) => (
                                                <ListItem key={index} disablePadding>
                                                    <ListItemButton
                                                        onClick={() => handleResultClick(result.categoryId)}
                                                        sx={{
                                                            '&:hover': {
                                                                backgroundColor: '#e3f2fd'
                                                            }
                                                        }}
                                                    >
                                                        <Box sx={{ width: '100%' }}>
                                                            <Box className="d-flex align-items-center gap-2 mb-1">
                                                                <Typography fontSize={20}>
                                                                    {getCategoryIcon(result.category)}
                                                                </Typography>
                                                                <Typography fontWeight={500} fontSize={15}>
                                                                    {result.question}
                                                                </Typography>
                                                                <Chip
                                                                    label={result.category}
                                                                    size="small"
                                                                    sx={{ ml: 'auto', height: 20, fontSize: 11 }}
                                                                />
                                                            </Box>
                                                            <Typography fontSize={13} color="text.secondary" sx={{ pl: 4 }}>
                                                                {result.answer}
                                                            </Typography>
                                                        </Box>
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                )}

                                {showAutocomplete && searchQuery && filteredResults.length === 0 && (
                                    <Paper
                                        sx={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            mt: 1,
                                            p: 3,
                                            textAlign: 'center',
                                            zIndex: 1000,
                                            boxShadow: 3
                                        }}
                                    >
                                        <Typography fontSize={14} color="text.secondary">
                                            No results found for "{searchQuery}"
                                        </Typography>
                                        <Typography fontSize={13} color="text.secondary" sx={{ mt: 1 }}>
                                            Try different keywords or browse categories below
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>

                            <Box>
                                <Box className="d-flex align-items-center gap-2 mb-3 justify-content-center">
                                    <TrendingUp sx={{ color: '#1976d2', fontSize: 20 }} />
                                    <Typography fontWeight={600} fontSize={14} color="text.secondary">
                                        Popular Searches
                                    </Typography>
                                </Box>
                                <Box className="d-flex gap-2 flex-wrap justify-content-center">
                                    {popularSearches.map((search, index) => (
                                        <Chip
                                            key={index}
                                            label={search}
                                            onClick={() => handlePopularSearch(search)}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: '#e3f2fd'
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            <Typography>Or choose a Category to quickly find the help you need</Typography>

                            <Grid2 className="d-flex gap-4">
                                {[
                                    {
                                        icon: <Extension sx={{ fontSize: 48, color: '#1976d2', backgroundColor: '#e7f1fe', borderRadius: '24px', p: 1 }} />,
                                        title: 'Getting Started',
                                        description: 'Learn the basics to get up and running quickly.',
                                        href: 'getting-started'
                                    },
                                    {
                                        icon: <LiveHelp sx={{ fontSize: 48, color: '#1976d2', backgroundColor: '#e7f1fe', borderRadius: '24px', p: 1 }} />,
                                        title: 'FAQ',
                                        description: 'Browse common questions and quick solutions.',
                                        href: 'FAQ'
                                    },
                                    {
                                        icon: <Forum sx={{ fontSize: 48, color: '#1976d2', backgroundColor: '#e7f1fe', borderRadius: '24px', p: 1 }} />,
                                        title: 'Live Chat',
                                        description: 'Chat with our support team in real time.',
                                        href: 'live-chat'
                                    },
                                    {
                                        icon: <People sx={{ fontSize: 48, color: '#1976d2', backgroundColor: '#e7f1fe', borderRadius: '24px', p: 1 }} />,
                                        title: 'Community',
                                        description: 'Get help from our user community.',
                                        href: 'community'
                                    },
                                    {
                                        icon: <ConfirmationNumber sx={{ fontSize: 48, color: '#1976d2', backgroundColor: '#e7f1fe', borderRadius: '24px', p: 1 }} />,
                                        title: 'Track Ticket',
                                        description: 'Check the status of your support requests.',
                                        href: 'ticket'
                                    }
                                ].map((item, index) => (
                                    <Link
                                        key={index}
                                        href={`/support/${item.href}`}
                                        className="link-support d-flex flex-column justify-content-center align-items-center p-4 gap-3"
                                    >
                                        {item.icon}
                                        <Typography fontWeight={600} fontSize={16}>
                                            {item.title}
                                        </Typography>
                                        <Typography fontSize={12} textAlign="center" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                    </Link>
                                ))}
                            </Grid2>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}