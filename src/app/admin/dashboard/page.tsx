'use client'

import { useEffect, useState } from 'react'
import { Box, Typography, Grid2, Avatar, Skeleton } from '@mui/material'
import { Paid, Inventory2, InventoryOutlined, Groups, TrendingUpOutlined } from '@mui/icons-material'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import '@/styles/admin.css'

interface DashboardStats {
    totalRevenue: string
    totalProducts: number
    totalOrders: number
    totalCustomers: number
}

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: '$0',
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0
    })
    
    const { cartCount } = useCart()

    useEffect(() => {
        fetchDashboardStats()
    }, [])

    const fetchDashboardStats = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/dashboard')
            const data = await response.json()
            
            if (data.success) {
                setStats(data.data)
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const dashboardItems = [
        {
            icon: <Avatar sx={{ bgcolor: 'orange' }}><Paid /></Avatar>,
            title: 'Total Revenue',
            amount: stats.totalRevenue,
            statistic: <TrendingUpOutlined sx={{ fontSize: '72px', color: 'green' }} />,
            href: 'revenue'
        },
        {
            icon: <Avatar sx={{ bgcolor: 'purple' }}><Inventory2 /></Avatar>,
            title: 'Total Products',
            amount: stats.totalProducts,
            statistic: <TrendingUpOutlined sx={{ fontSize: '72px', color: 'green' }} />,
            href: 'products'
        },
        {
            icon: <Avatar sx={{ bgcolor: 'green' }}><InventoryOutlined /></Avatar>,
            title: 'Total Orders',
            amount: stats.totalOrders,
            statistic: <TrendingUpOutlined sx={{ fontSize: '72px', color: 'green' }} />,
            href: 'orders'
        },
        {
            icon: <Avatar sx={{ bgcolor: 'blue' }}><Groups /></Avatar>,
            title: 'Total Customers',
            amount: stats.totalCustomers,
            statistic: <TrendingUpOutlined sx={{ fontSize: '72px', color: 'green' }} />,
            href: 'customers'
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
                            className="d-flex flex-column p-4 gap-3"
                            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                        >
                            <Typography fontWeight={600} fontSize={20}>Dashboard</Typography>

                            <Grid2 className="d-flex justify-content-between gap-4">
                                {dashboardItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={`/admin/${item.href}`}
                                        className="link-admin d-flex justify-content-between align-items-center p-4 shadow"
                                    >
                                        <Grid2 className="d-flex flex-column gap-2">
                                            {item.icon}
                                            {loading ? (
                                                <Skeleton variant="text" width={60} height={40} />
                                            ) : (
                                                <Typography fontWeight={600} fontSize={24}>
                                                    {item.amount}
                                                </Typography>
                                            )}
                                            <Typography color='text.secondary'>{item.title}</Typography>
                                        </Grid2>
                                        {item.statistic}
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