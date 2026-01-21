'use client'

import { useEffect, useState } from 'react'
import {
    Box, Typography, Grid2, FormControl, FormLabel, TextField, Button, Avatar,
    CircularProgress, Snackbar, Alert, Input
} from '@mui/material'
import { Person } from '@mui/icons-material'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { UserProfile } from '@/types/user'
import Link from 'next/link'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'
import '@/styles/account.css'

export default function ProfilePage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
    const [userData, setUserData] = useState<UserProfile>({
        id: 0,
        username: '',
        email: '',
        profilePicture: null
    })

    const { cartCount } = useCart()
    const { user, updateUser, isLoggedIn } = useAuth()
    const userId = user?.id

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchUserData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/users/${userId}/profile`)
                if (!response.ok) throw new Error('Failed to fetch user profile')

                const data = await response.json()
                setUserData(data)
            } catch (err) {
                console.error('Error fetching user data:', err)
                setSnackbarMessage('Unable to load profile data.')
                setSnackbarSeverity('error')
                setOpenSnackbar(true)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [userId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        if (!userId) return

        try {
            setSaving(true)
            const response = await fetch(`/api/users/${userId}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userData.username
                }),
            })

            if (!response.ok) throw new Error('Failed to update profile')

            updateUser({
                name: userData.username
            })

            setSnackbarMessage('Profile updated successfully')
            setSnackbarSeverity('success')
            setOpenSnackbar(true)
        } catch (err) {
            console.error('Error saving profile:', err)
            setSnackbarMessage('Unable to save data. Please try again.')
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
        } finally {
            setSaving(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setSnackbarMessage('Image upload is not yet available.')
        setSnackbarSeverity('error')
        setOpenSnackbar(true)
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
                                    Please log in to view your profile.
                                </Typography>
                                <Link
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault()
                                        window.location.href = '/login'
                                    }}
                                    style={{ textDecoration: 'none' }}>
                                    <Button variant="contained" size="large">
                                        Go to Login
                                    </Button>
                                </Link>
                            </Box>
                        ) : loading ? (
                            <Box
                                className="d-flex justify-content-center align-items-center p-4"
                                sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box
                                className="d-flex flex-column p-4"
                                sx={{ backgroundColor: '#fff', borderRadius: '8px' }}>
                                <Typography fontWeight={600} fontSize={20} sx={{ pb: 3, borderBottom: '2px solid #ccc' }}>
                                    My Profile
                                </Typography>

                                <Snackbar
                                    open={openSnackbar}
                                    autoHideDuration={3000}
                                    onClose={() => setOpenSnackbar(false)}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                >
                                    <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>
                                        {snackbarMessage}
                                    </Alert>
                                </Snackbar>

                                <Grid2 className="d-flex justify-content-between p-5" sx={{ width: '100%' }}>
                                    <Grid2 className="d-flex flex-column gap-4 px-5" sx={{ width: '100%' }}>
                                        <Grid2 className="d-flex align-items-center">
                                            <FormLabel sx={{ width: '150px' }}>Username</FormLabel>
                                            <FormControl fullWidth>
                                                <TextField
                                                    name="username"
                                                    id="username"
                                                    type="text"
                                                    variant="outlined"
                                                    defaultValue={user?.name}
                                                    onChange={handleInputChange}
                                                />
                                            </FormControl>
                                        </Grid2>
                                        <Grid2 className="d-flex align-items-center">
                                            <FormLabel sx={{ width: '150px' }}>Email</FormLabel>
                                            <FormControl fullWidth>
                                                <TextField
                                                    name="email"
                                                    id="email"
                                                    type="email"
                                                    variant="outlined"
                                                    defaultValue={user?.email}
                                                    onChange={handleInputChange}
                                                    disabled
                                                />
                                            </FormControl>
                                        </Grid2>

                                        <Grid2 className="d-flex justify-content-end mt-3">
                                            <Button
                                                variant="contained"
                                                onClick={handleSave}
                                                disabled={saving}
                                            >
                                                {saving ? 'Saving...' : 'Save'}
                                            </Button>
                                        </Grid2>
                                    </Grid2>

                                    <Grid2 className="d-flex flex-column justify-content-between align-items-center px-5" sx={{ borderLeft: '2px solid #ccc' }}>
                                        <Avatar
                                            src={user?.profilePicture || undefined}
                                            alt={user?.name}
                                            sx={{ width: 'auto', height: 150 }}
                                        >
                                            {!user?.profilePicture && <Person sx={{ fontSize: 150 }} />}
                                        </Avatar>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            sx={{ width: '200px' }}
                                        >
                                            <Typography>Change Picture</Typography>
                                            <Input
                                                type="file"
                                                hidden
                                                onChange={handleImageUpload}
                                            />
                                        </Button>
                                    </Grid2>
                                </Grid2>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}