'use client'

import { Box, Typography } from '@mui/material'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import '@/styles/account.css'

export default function SupportPage() {
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
                            <Typography fontWeight={600} fontSize={20}>SupportPage</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}