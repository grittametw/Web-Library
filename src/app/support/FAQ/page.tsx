'use client'

import { useState } from 'react'
import { Box, Typography, Grid2, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import { ExpandMore, ShoppingCart, Payment, LocalShipping, AccountCircle, LibraryBooks, Security } from '@mui/icons-material'

export default function FAQPage() {
    const [expanded, setExpanded] = useState<string | false>(false)
    const { cartCount } = useCart()

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false)
    }

    const faqCategories = [
        {
            id: 'ordering',
            icon: <ShoppingCart sx={{ fontSize: 40, color: '#1976d2' }} />,
            title: 'Ordering',
            color: '#e7f1fe',
            questions: [
                {
                    question: 'How do I place an order?',
                    answer: 'Select your desired book → Choose format (Hardcover/Paperback/E-book) → Click "Add to cart" → Go to cart → Click "Checkout" → Complete payment'
                },
                {
                    question: 'Can I modify my order after placing it?',
                    answer: 'You can modify your order before payment by adjusting quantities or removing items from your cart. Once payment is complete, orders cannot be modified.'
                },
                {
                    question: 'Do I need to create an account to purchase?',
                    answer: 'Yes, you must register and log in before making a purchase. This allows you to track your orders and view your order history.'
                },
                {
                    question: 'How many books can I order at once?',
                    answer: 'There is no limit on the number of books you can order, subject to available stock at the time of purchase.'
                }
            ]
        },
        {
            id: 'payment',
            icon: <Payment sx={{ fontSize: 40, color: '#1976d2' }} />,
            title: 'Payment',
            color: '#fff3e0',
            questions: [
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We only accept payment via QR Code PromptPay. It is convenient, fast, and 100% secure.'
                },
                {
                    question: 'How long do I have to complete payment?',
                    answer: 'Please complete payment within 15 minutes after creating your order. Otherwise, your order will be automatically cancelled.'
                },
                {
                    question: 'Will I receive a receipt?',
                    answer: 'You will receive a receipt via email immediately after successful payment. You can also view it in "Your Account" → "Order History".'
                },
                {
                    question: 'Can I get a refund?',
                    answer: 'E-books are non-refundable. For physical books, you can request a refund within 7 days if the product is defective.'
                }
            ]
        },
        {
            id: 'shipping',
            icon: <LocalShipping sx={{ fontSize: 40, color: '#1976d2' }} />,
            title: 'Shipping & Delivery',
            color: '#e8f5e9',
            questions: [
                {
                    question: 'How long does delivery take?',
                    answer: 'E-books: Instant delivery after payment | Physical books: 3-5 business days (Bangkok & surrounding areas) or 5-7 business days (other provinces)'
                },
                {
                    question: 'How much is shipping?',
                    answer: 'E-books: Free | Physical books: 50 THB (nationwide) or free for orders over 500 THB'
                },
                {
                    question: 'How can I track my order?',
                    answer: 'Go to "Your Account" → "Order History" to view your order status and tracking number.'
                },
                {
                    question: 'Can I change my shipping address?',
                    answer: 'You can change your address before the item ships by contacting our Support team with your order number.'
                }
            ]
        },
        {
            id: 'about-books',
            icon: <LibraryBooks sx={{ fontSize: 40, color: '#1976d2' }} />,
            title: 'About Books',
            color: '#fce4ec',
            questions: [
                {
                    question: 'What book formats are available?',
                    answer: 'We offer 3 formats: Hardcover, Paperback, and E-book (digital format).'
                },
                {
                    question: 'What devices can I read E-books on?',
                    answer: 'E-books can be read on PC, Mac, Tablet, and Smartphone using any standard PDF Reader or E-book Reader.'
                },
                {
                    question: 'Can I preview books before buying?',
                    answer: 'Click on the book title to view details, descriptions, and reviews from other readers. (Book preview pages are currently under development)'
                },
                {
                    question: 'When will out-of-stock books be available?',
                    answer: 'Click the "Notify Me" button to receive an email notification when the book is back in stock.'
                }
            ]
        },
        {
            id: 'account',
            icon: <AccountCircle sx={{ fontSize: 40, color: '#1976d2' }} />,
            title: 'Account',
            color: '#f3e5f5',
            questions: [
                {
                    question: 'What if I forget my password?',
                    answer: 'Click "Forgot Password" on the Login page and enter your email. We will send you a password reset link.'
                },
                {
                    question: 'Can I change my email address?',
                    answer: 'Yes, go to "Your Account" → "Settings" → "Change Email" to update your email address.'
                },
                {
                    question: 'How secure is my personal information?',
                    answer: 'All data is encrypted with SSL and we never share your information with third parties. See our Privacy Policy for more details.'
                },
                {
                    question: 'Can I delete my account?',
                    answer: 'Contact our Support team to request account deletion. Please note that all data will be permanently deleted and cannot be recovered.'
                }
            ]
        },
        {
            id: 'others',
            icon: <Security sx={{ fontSize: 40, color: '#1976d2' }} />,
            title: 'Others',
            color: '#e0f2f1',
            questions: [
                {
                    question: 'Do you offer promotions or discounts?',
                    answer: 'Follow special promotions on our homepage and through our Newsletter sent via email.'
                },
                {
                    question: 'Can I purchase books as gifts?',
                    answer: 'Yes, you can specify a different recipient address from the billing address and include a gift message. (Gift message feature is under development)'
                },
                {
                    question: 'How do I contact Support?',
                    answer: 'Contact us through the Support page or email us at support@weblibrary.com. We are available 24/7.'
                },
                {
                    question: 'Is there a mobile app?',
                    answer: 'Not yet, but our website is fully responsive and works perfectly on mobile devices.'
                }
            ]
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
                                Frequently Asked Questions
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Find answers to common questions about our service
                            </Typography>
                        </Box>

                        {faqCategories.map((category, categoryIndex) => (
                            <Box
                                key={categoryIndex}
                                id={category.id}
                                className="p-4 mb-4"
                                sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                            >
                                <Box
                                    className="d-flex align-items-center gap-3 mb-3 p-3"
                                    sx={{
                                        backgroundColor: category.color,
                                        borderRadius: '8px'
                                    }}
                                >
                                    {category.icon}
                                    <Typography variant="h5" fontWeight={600}>
                                        {category.title}
                                    </Typography>
                                </Box>

                                <Box className="d-flex flex-column gap-2">
                                    {category.questions.map((faq, faqIndex) => (
                                        <Accordion
                                            key={faqIndex}
                                            expanded={expanded === `panel${categoryIndex}-${faqIndex}`}
                                            onChange={handleChange(`panel${categoryIndex}-${faqIndex}`)}
                                            sx={{
                                                borderRadius: '8px !important',
                                                '&:before': { display: 'none' },
                                                boxShadow: 1
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMore />}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5'
                                                    }
                                                }}
                                            >
                                                <Typography fontWeight={600} fontSize={16}>
                                                    {faq.question}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ backgroundColor: '#fafafa' }}>
                                                <Typography color="text.secondary" fontSize={14}>
                                                    {faq.answer}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </Box>
                            </Box>
                        ))}

                        <Box
                            className="p-5 text-center"
                            sx={{
                                backgroundColor: '#e7f1fe',
                                borderRadius: '8px'
                            }}
                        >
                            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                                Still have questions?
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                Our team is here to help you 24/7
                            </Typography>
                            <Grid2 container spacing={2} justifyContent="center">
                                <Grid2>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 3,
                                            borderRadius: '8px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4
                                            }
                                        }}
                                        onClick={() => window.location.href = '/support/live-chat'}
                                    >
                                        <Typography fontWeight={600} fontSize={18} sx={{ mb: 1 }}>
                                            💬 Live Chat
                                        </Typography>
                                        <Typography color="text.secondary" fontSize={14}>
                                            Chat with us now
                                        </Typography>
                                    </Paper>
                                </Grid2>
                                <Grid2>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 3,
                                            borderRadius: '8px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4
                                            }
                                        }}
                                        onClick={() => window.location.href = '/support/ticket'}
                                    >
                                        <Typography fontWeight={600} fontSize={18} sx={{ mb: 1 }}>
                                            🎟️ Track Ticket
                                        </Typography>
                                        <Typography color="text.secondary" fontSize={14}>
                                            Send us a ticket
                                        </Typography>
                                    </Paper>
                                </Grid2>
                            </Grid2>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}