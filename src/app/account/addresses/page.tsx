'use client'

import { useEffect, useState } from 'react'
import { Box, Grid2, Typography, Button, CircularProgress } from '@mui/material'
import { Add, EditOutlined } from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { ShippingAddress, DbUserAddress } from '@/types/address'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import Link from 'next/link'
import AddressFormModal from '@/view/components/AddressFormModal'

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<ShippingAddress[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null)
    const { cartCount } = useCart()
    const { user, isLoggedIn } = useAuth()

    const userId = user?.id
    const userEmail = user?.email

    useEffect(() => {
        if (isLoggedIn && userId && user?.role === 'user') {
            loadAddresses()
        } else {
            setLoading(false)
        }
    }, [isLoggedIn, userId])

    const dbToFormAddress = (dbAddr: DbUserAddress & { email: string }): ShippingAddress => ({
        id: dbAddr.id,
        firstName: dbAddr.first_name,
        lastName: dbAddr.last_name,
        address: dbAddr.address,
        city: dbAddr.city,
        state: dbAddr.state,
        zipCode: dbAddr.postal_code,
        country: dbAddr.country,
        phoneNumber: dbAddr.phone_number,
        isDefault: dbAddr.is_default,
        email: dbAddr.email,
        label: `${dbAddr.first_name} ${dbAddr.last_name}`
    })

    const loadAddresses = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/users/${userId}/addresses`)
            if (response.ok) {
                const data = await response.json()
                const addresses: ShippingAddress[] = data.addresses?.map((addr: DbUserAddress) => ({
                    ...dbToFormAddress({ ...addr, email: userEmail || '' })
                })) || []
                setAddresses(addresses)
            } else {
                console.error('Failed to load addresses:', response.statusText)
                setAddresses([])
            }
        } catch (error) {
            console.error('Error loading addresses:', error)
            setAddresses([])
        } finally {
            setLoading(false)
        }
    }

    const handleAddNewAddress = () => {
        setSelectedAddress(null)
        setShowAddressForm(true)
    }

    const handleEditAddress = (address: ShippingAddress) => {
        setSelectedAddress(address)
        setShowAddressForm(true)
    }

    const handleCloseAddressForm = () => {
        setShowAddressForm(false)
        setSelectedAddress(null)
    }

    const handleSaveAddress = () => {
        loadAddresses()
    }

    const formatAddressDisplay = (address: ShippingAddress): string => {
        return `${address.firstName} ${address.lastName}${address.phoneNumber ? ' | ' + address.phoneNumber : ''}\n${address.country}, ${address.address}, ${address.city}, ${address.state}, ${address.zipCode}`
    }

    return (
        <Box className="d-flex" sx={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar cartCount={cartCount} />
            <Box className="content-area d-flex flex-column" sx={{ width: '100%' }}>
                <Navbar />
                <Box className="scrollbar" sx={{ overflowY: 'auto' }}>
                    <Box className="m-4">
                        {!isLoggedIn ? (
                            <Box
                                className="d-flex flex-column justify-content-center align-items-center p-5"
                                sx={{ backgroundColor: '#fff', borderRadius: '8px', minHeight: '400px', gap: 3 }}
                            >
                                <Typography fontSize={20} fontWeight={600} color="text.secondary">
                                    Please log in to view your addresses.
                                </Typography>
                                <Link
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        window.location.href = '/login'
                                    }}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Button variant="contained" size="large">
                                        Go to Login
                                    </Button>
                                </Link>
                            </Box>
                        ) : loading ? (
                            <Box className="d-flex justify-content-center align-items-center p-4">
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box
                                className="d-flex flex-column p-4"
                                sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px' }}
                            >
                                <Grid2
                                    className="d-flex justify-content-between pb-4"
                                    sx={{ borderBottom: '2px solid #ccc' }}
                                >
                                    <Typography fontWeight={600} fontSize={20}>My Addresses</Typography>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        startIcon={<Add />}
                                        onClick={handleAddNewAddress}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Add New Address
                                    </Button>
                                </Grid2>

                                {addresses.length === 0 ? (
                                    <Typography
                                        fontSize={16}
                                        color="text.secondary"
                                        textAlign="center"
                                        sx={{ mt: 4 }}
                                    >
                                        You don't have any saved addresses yet.
                                    </Typography>
                                ) : (
                                    <Grid2 className="d-flex flex-column mt-3 gap-3">
                                        {addresses.map((address) => (
                                            <Box
                                                key={address.id}
                                                className="d-flex justify-content-between align-items-center p-3"
                                                sx={{
                                                    border: '1px solid #ccc',
                                                    borderRadius: '8px',
                                                    backgroundColor: address.isDefault ? '#f8f9fa' : '#fff'
                                                }}
                                            >
                                                <Box>
                                                    <Typography
                                                        fontSize={14}
                                                        sx={{ whiteSpace: 'pre-line' }}
                                                    >
                                                        {formatAddressDisplay(address)}
                                                    </Typography>
                                                    {address.isDefault ? (
                                                        <Typography
                                                            fontSize={12}
                                                            fontWeight={600}
                                                            color="primary"
                                                            sx={{ mt: 0.5 }}
                                                        >
                                                            Default Address
                                                        </Typography>
                                                    ) : null}
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    sx={{ height: 'fit-content', textTransform: 'none', px: 2 }}
                                                    startIcon={<EditOutlined />}
                                                    onClick={() => handleEditAddress(address)}
                                                >
                                                    Edit
                                                </Button>
                                            </Box>
                                        ))}
                                    </Grid2>
                                )}
                            </Box>
                        )}

                        <AddressFormModal
                            isOpen={showAddressForm}
                            onClose={handleCloseAddressForm}
                            onSave={handleSaveAddress}
                            address={selectedAddress}
                            isLoggedIn={isLoggedIn}
                            userId={userId}
                            userEmail={userEmail}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}