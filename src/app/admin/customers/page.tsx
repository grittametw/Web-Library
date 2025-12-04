'use client'

import { useEffect, useState } from 'react'
import {
    Box, Typography, Grid2, TextField, Button, Paper, TableContainer,
    Table, TableHead, TableRow, TableCell, TableBody, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TablePagination,
    Alert, Snackbar
} from '@mui/material'
import { Search, Add, Edit, Delete } from '@mui/icons-material'
import { useCart } from '@/hooks/useCart'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'

interface User {
    id: number
    name: string
    email: string
    status: string
    created_at: string
}

interface SnackbarState {
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
}

export default function AdminCustomersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [openDialog, setOpenDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null)
    const [formData, setFormData] = useState({ name: '', email: '' })
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [submitting, setSubmitting] = useState(false)
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    })

    const { cartCount } = useCart()

    useEffect(() => {
        fetchUsers()
    }, [])

    const showSnackbar = (message: string, severity: SnackbarState['severity']) => {
        setSnackbar({ open: true, message, severity })
    }

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/users')
            const data = await response.json()
            
            if (data.success) {
                setUsers(data.data)
            } else {
                showSnackbar(data.error || 'Failed to fetch users', 'error')
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            showSnackbar('Error connecting to server', 'error')
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const paginatedUsers = filteredUsers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    )

    const handleOpenDialog = (user?: User) => {
        if (user) {
            setEditingUser(user)
            setFormData({ name: user.name, email: user.email })
        } else {
            setEditingUser(null)
            setFormData({ name: '', email: '' })
        }
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setEditingUser(null)
        setFormData({ name: '', email: '' })
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSave = async () => {
        if (!formData.name.trim()) {
            showSnackbar('Please enter a name', 'warning')
            return
        }

        if (!formData.email.trim()) {
            showSnackbar('Please enter an email', 'warning')
            return
        }

        if (!validateEmail(formData.email)) {
            showSnackbar('Please enter a valid email address', 'warning')
            return
        }

        setSubmitting(true)

        try {
            const method = editingUser ? 'PUT' : 'POST'
            const body = editingUser 
                ? { id: editingUser.id, name: formData.name, email: formData.email }
                : { name: formData.name, email: formData.email }

            const response = await fetch('/api/users', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const data = await response.json()

            if (data.success) {
                showSnackbar(
                    editingUser ? 'Customer updated successfully' : 'Customer added successfully',
                    'success'
                )
                fetchUsers()
                handleCloseDialog()
            } else {
                showSnackbar(data.error || 'Operation failed', 'error')
            }
        } catch (error) {
            console.error('Error saving user:', error)
            showSnackbar('Error connecting to server', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    const handleOpenDeleteDialog = (userId: number) => {
        setDeleteUserId(userId)
        setOpenDeleteDialog(true)
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
        setDeleteUserId(null)
    }

    const handleDelete = async () => {
        if (!deleteUserId) return

        setSubmitting(true)

        try {
            const response = await fetch('/api/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deleteUserId })
            })

            const data = await response.json()

            if (data.success) {
                showSnackbar('Customer deleted successfully', 'success')
                fetchUsers()
                handleCloseDeleteDialog()
                setPage(0)
            } else {
                showSnackbar(data.error || 'Failed to delete customer', 'error')
            }
        } catch (error) {
            console.error('Error deleting user:', error)
            showSnackbar('Error connecting to server', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

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
                            <Box className="d-flex justify-content-between align-items-center">
                                <Typography fontWeight={600} fontSize={20}>Customers</Typography>

                                <Grid2 className="d-flex gap-2">
                                    <TextField
                                        placeholder="Search customers..."
                                        size="small"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        InputProps={{
                                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                                        }}
                                        sx={{ width: '300px' }}
                                    />

                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => handleOpenDialog()}
                                    >
                                        Add New Customer
                                    </Button>
                                </Grid2>
                            </Box>

                            <Paper sx={{ borderRadius: '8px' }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell><strong>ID</strong></TableCell>
                                                <TableCell><strong>Name</strong></TableCell>
                                                <TableCell><strong>Email</strong></TableCell>
                                                <TableCell><strong>Status</strong></TableCell>
                                                <TableCell><strong>Created at</strong></TableCell>
                                                <TableCell align="center"><strong>Action</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                        <Typography color="text.secondary">Loading...</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : paginatedUsers.length > 0 ? (
                                                paginatedUsers.map((user, index) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell>#{index + 1 + page * rowsPerPage}</TableCell>
                                                        <TableCell>{user.name}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="outlined"
                                                                color={user.status === 'Active' ? 'success' : 'error'}
                                                                sx={{ 
                                                                    borderRadius: '16px', 
                                                                    textTransform: 'none',
                                                                    pointerEvents: 'none'
                                                                }}
                                                                size="small"
                                                            >
                                                                {user.status}
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell>{user.created_at}</TableCell>
                                                        <TableCell align="center">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenDialog(user)}
                                                                sx={{ color: '#1976d2' }}
                                                                title="Edit customer"
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenDeleteDialog(user.id)}
                                                                sx={{ color: '#d32f2f', ml: 1 }}
                                                                title="Delete customer"
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                        <Typography color="text.secondary">
                                                            {searchTerm ? 'No customers found matching your search' : 'No customers found'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={filteredUsers.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    sx={{
                                        '.MuiTablePagination-selectLabel': {
                                            margin: 0,
                                            display: 'flex',
                                            alignItems: 'center'
                                        },
                                        '.MuiTablePagination-displayedRows': {
                                            margin: 0,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }
                                    }}
                                />
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingUser ? 'Edit Customer' : 'Add New Customer'}
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter customer name"
                        margin="normal"
                        required
                        autoFocus
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="customer@example.com"
                        margin="normal"
                        required
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={!formData.name.trim() || !formData.email.trim() || submitting}
                    >
                        {submitting ? 'Saving...' : (editingUser ? 'Update' : 'Add')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this customer? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDeleteDialog} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        color="error" 
                        variant="contained"
                        disabled={submitting}
                    >
                        {submitting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}