'use client'

import { Box, Typography, Grid2 } from '@mui/material'
import { InventoryOutlined, Business, Person } from '@mui/icons-material'
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
                                {[
                                    {
                                        icon: <InventoryOutlined sx={{ fontSize: '48px', color: '#1976d2', backgroundColor: '#e7f1fe', borderRadius: '24px', p: 1 }} />,
                                        title: 'Your Orders',
                                        href: 'order-history'
                                    },
                                    {
                                        icon: <Business sx={{ fontSize: '48px', color: '#1976d2', backgroundColor: '#e7f1fe', borderRadius: '24px', p: 1 }} />,
                                        title: 'Your Addresses',
                                        href: 'addresses'
                                    },
                                    {
                                        icon: <Person sx={{ fontSize: '48px', color: '#1976d2', backgroundColor: '#e7f1fe', borderRadius: '24px', p: 1 }} />,
                                        title: 'Your Profile',
                                        href: 'profile'
                                    }
                                ].map((item, index) => (
                                    <Link
                                        key={index}
                                        href={`/account/${item.href}`}
                                        className="link-account d-flex flex-column justify-content-center align-items-center p-4 gap-3 shadow"
                                    >
                                        {item.icon}
                                        <Typography fontWeight={600} fontSize={16}>
                                            {item.title}
                                        </Typography>
                                    </Link>
                                ))}
                            </Grid2>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}