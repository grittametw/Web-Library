'use client'

import { useState } from 'react'
import {
    Box, Typography, Grid2, TextField, Button, Paper, TableContainer,
    Table, TableHead, TableRow, TableCell, TableBody, Switch, Dialog,
    DialogTitle, DialogContent, DialogActions, IconButton, TablePagination
} from '@mui/material'
import { Search, Add, Edit, Delete } from '@mui/icons-material'
import { useCart } from '@/hooks/useCart'
import { useCategories } from '@/context/CategoriesContext'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'

export default function AdminCategoriesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState({ name: '', published: true })
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const { cartCount } = useCart()
    const { categories, addCategory, updateCategory, deleteCategory } = useCategories()

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleOpenDialog = (category?: typeof categories[0]) => {
        if (category) {
            setEditingId(category.id)
            setFormData({ name: category.name, published: category.published })
        } else {
            setEditingId(null)
            setFormData({ name: '', published: true })
        }
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setEditingId(null)
        setFormData({ name: '', published: true })
    }

    const handleSave = () => {
        if (!formData.name.trim()) return

        if (editingId !== null) {
            updateCategory(editingId, formData.name, formData.published)
        } else {
            addCategory(formData.name)
        }

        handleCloseDialog()
    }

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategory(id)
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
                                <Typography fontWeight={600} fontSize={20}>Categories</Typography>

                                <Grid2 className="d-flex gap-2">
                                    <TextField
                                        placeholder="Search categories..."
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
                                        Add New Category
                                    </Button>
                                </Grid2>
                            </Box>

                            <Paper sx={{ borderRadius: '8px' }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell><strong>ID</strong></TableCell>
                                                <TableCell><strong>Category Name</strong></TableCell>
                                                <TableCell><strong>Published</strong></TableCell>
                                                <TableCell align="center"><strong>Action</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredCategories.length > 0 ? (
                                                filteredCategories.map((cat, index) => (
                                                    <TableRow key={cat.id}>
                                                        <TableCell>#{index + 1}</TableCell>
                                                        <TableCell>{cat.name}</TableCell>
                                                        <TableCell>
                                                            <Switch
                                                                checked={cat.published}
                                                                onChange={(e) =>
                                                                    updateCategory(cat.id, cat.name, e.target.checked)
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenDialog(cat)}
                                                                sx={{ color: '#1976d2' }}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDelete(cat.id)}
                                                                sx={{ color: '#d32f2f' }}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                                        <Typography color="text.secondary">
                                                            No categories found
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
                                    count={filteredCategories.length}
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
                    {editingId !== null ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Category Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Sci-Fi, Fantasy"
                        margin="normal"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <Typography>Published:</Typography>
                        <Switch
                            checked={formData.published}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={!formData.name.trim()}
                    >
                        {editingId !== null ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}