'use client'

import { Box, Typography, Grid2 } from '@mui/material'
import { Inventory, Business, Person } from '@mui/icons-material';
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import '@/styles/account.css'

export default function AccountPage() {
    const { cartCount } = useCart()

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
                            <Typography fontWeight={600} fontSize={20}>My Account</Typography>
                            <Grid2 className="d-flex justify-content-center gap-4">
                                <Link
                                    href="/account/order-history"
                                    className="account-link d-flex justify-content-center align-items-center p-4 gap-3"
                                    style={{
                                        width: '250px',
                                        color: '#000',
                                        textDecoration: 'none',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px'
                                    }}>
                                    <Inventory sx={{ fontSize: '48px', backgroundColor: '#e7f1fe', borderRadius: '24px', p: 1 }} />
                                    <Typography>Your Orders</Typography>
                                </Link>
                                <Link
                                    href="/account/addresses"
                                    className="account-link d-flex justify-content-center align-items-center p-4 gap-3"
                                    style={{
                                        width: '250px',
                                        color: '#000',
                                        textDecoration: 'none',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px',
                                    }}>
                                    <Business sx={{ fontSize: '48px', backgroundColor: '#e7f1fe', borderRadius: '24px', p: 1 }} />
                                    <Typography>Your Addresses</Typography>
                                </Link>
                                <Link
                                    href="/account/profile"
                                    className="account-link d-flex justify-content-center align-items-center p-4 gap-3"
                                    style={{
                                        width: '250px',
                                        color: '#000',
                                        textDecoration: 'none',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px'
                                    }}>
                                    <Person sx={{ fontSize: '48px', backgroundColor: '#e7f1fe', borderRadius: '24px', p: 1 }} />
                                    <Typography>Your Profile</Typography>
                                </Link>
                            </Grid2>
                        </Box>
                    </Box>

                </Box>
            </Box>
        </Box >
    )
}