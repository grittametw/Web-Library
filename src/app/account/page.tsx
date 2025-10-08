'use client'

import { Box } from '@mui/material'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'

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
                            className="d-flex justify-content-center align-items-center p-4"
                            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                        >
                            <Link
                                href="/account/order-history"
                                className="p-4"
                                style={{ color: '#000', border: '1px solid #999' }}>Your Orders</Link>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}