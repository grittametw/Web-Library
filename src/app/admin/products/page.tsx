'use client'

import { useState, useEffect } from 'react'
import {
    Box, Typography, Paper, Grid2, TextField, TableContainer, Table, TableHead, TableRow,
    TableCell, TableBody, CircularProgress, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, IconButton, Alert, TablePagination, Snackbar, SnackbarCloseReason
} from '@mui/material'
import { Search, Info, Edit, Delete, Add, Close, Check } from '@mui/icons-material'
import { Book } from '@/types/book'
import Image from 'next/image'
import Navbar from '@/view/components/Navbar'
import Sidebar from '@/view/components/Sidebar'

type BookOption = Book['options'][0]

export default function AdminProductsPage() {
    const [open, setOpen] = useState(false)
    const [deletingOptionId, setDeletingOptionId] = useState<number | null>(null)
    const [books, setBooks] = useState<Book[]>([])
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [openDetail, setOpenDetail] = useState(false)
    const [openForm, setOpenForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<Book>({
        id: 0,
        name: '',
        author: '',
        image: '',
        rate: 0,
        genre: '',
        description: '',
        options: []
    })
    const [openOptionForm, setOpenOptionForm] = useState(false)
    const [isEditingOption, setIsEditingOption] = useState(false)
    const [optionData, setOptionData] = useState<BookOption>({
        id: 0,
        type: '',
        price: 0,
        stock: 0
    })

    useEffect(() => {
        fetchBooks()
    }, [])

    useEffect(() => {
        filterBooks()
    }, [searchTerm, books])

    const fetchBooks = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/books')
            if (!response.ok) throw new Error('Failed to fetch books')
            const data = await response.json()
            setBooks(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch books')
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    const filterBooks = () => {
        const filtered = books.filter(book =>
            book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredBooks(filtered)
        setPage(0)
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value)
    }

    const handleOpenDetail = (book: Book) => {
        setSelectedBook(book)
        setOpenDetail(true)
    }

    const handleCloseDetail = () => {
        setOpenDetail(false)
        setSelectedBook(null)
    }

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
    }

    const handleAddProduct = () => {
        setFormData({
            id: 0,
            name: '',
            author: '',
            image: '',
            rate: 0,
            genre: '',
            description: '',
            options: []
        })
        setIsEditing(false)
        setOpenForm(true)
    }

    const handleEditProduct = (book: Book) => {
        setFormData(book)
        setIsEditing(true)
        setOpenDetail(false)
        setOpenForm(true)
    }

    // const handleDeleteProduct = async (bookId: number) => {
    //     if (!window.confirm('คุณแน่ใจหรือว่าต้องการลบสินค้านี้?')) return

    //     try {
    //         const response = await fetch(`/api/books/${bookId}`, { method: 'DELETE' })
    //         if (!response.ok) throw new Error('Failed to delete book')

    //         fetchBooks()
    //         handleCloseDetail()
    //     } catch (err) {
    //         setError(err instanceof Error ? err.message : 'Failed to delete book')
    //     }
    // }

    const handleSaveProduct = async () => {
        if (!formData.name || !formData.author || !formData.genre) {
            setError('กรุณากรอกข้อมูลที่จำเป็น')
            return
        }

        try {
            const method = isEditing ? 'PUT' : 'POST'
            const url = isEditing ? `/api/books/${formData.id}` : '/api/books'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    author: formData.author,
                    image: formData.image,
                    rate: formData.rate,
                    genre: formData.genre,
                    description: formData.description
                })
            })

            if (!response.ok) throw new Error('Failed to save book')

            fetchBooks()
            setOpenForm(false)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save book')
        }
    }

    const handleAddOption = () => {
        setOptionData({ id: 0, type: '', price: 0, stock: 0 })
        setIsEditingOption(false)
        setOpenOptionForm(true)
    }

    const handleEditOption = (option: BookOption) => {
        setOptionData(option)
        setIsEditingOption(true)
        setOpenOptionForm(true)
    }

    const handleDeleteOption = async (optionId: number) => {
        try {
            const response = await fetch(`/api/book-options/${optionId}`, { method: 'DELETE' })
            if (!response.ok) throw new Error('Failed to delete option')

            if (selectedBook) {
                const updated = { ...selectedBook, options: selectedBook.options.filter(o => o.id !== optionId) }
                setSelectedBook(updated)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete option')
        }
    }

    const handleSaveOption = async () => {
        if (!optionData.type || optionData.price < 0 || optionData.stock < 0) {
            setError('กรุณากรอกข้อมูล option ให้ถูกต้อง')
            return
        }

        try {
            const bookId = selectedBook?.id || formData.id
            const method = isEditingOption ? 'PUT' : 'POST'
            const url = isEditingOption ? `/api/book-options/${optionData.id}` : '/api/book-options'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...optionData,
                    book_id: bookId
                })
            })

            if (!response.ok) throw new Error('Failed to save option')

            if (selectedBook) {
                fetchBooks()
                handleOpenDetail(selectedBook)
            }

            setOpenOptionForm(false)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save option')
        }
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const paginatedBooks = filteredBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
        <Box className="d-flex" sx={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar cartCount={0} />
            <Box className="content-area d-flex flex-column" sx={{ width: '100%' }}>
                <Navbar />
                <Box className="scrollbar" sx={{ overflowY: 'auto', flex: 1 }}>
                    <Box className="m-4">
                        <Box
                            className="d-flex flex-column p-4 gap-3"
                            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
                        >
                            <Box className="d-flex justify-content-between align-items-center">
                                <Typography fontWeight={600} fontSize={20}>Products</Typography>

                                <Grid2 className="d-flex gap-2">
                                    <TextField
                                        placeholder="Search products..."
                                        size="small"
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        InputProps={{
                                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                                        }}
                                        sx={{ width: '300px' }}
                                    />

                                    <Button variant="contained" startIcon={<Add />} onClick={handleAddProduct}>
                                        Add New Product
                                    </Button>
                                </Grid2>
                            </Box>

                            {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <Paper sx={{ borderRadius: '8px' }}>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                        <TableCell><strong>ID</strong></TableCell>
                                                        <TableCell><strong>Product name</strong></TableCell>
                                                        <TableCell><strong>Author</strong></TableCell>
                                                        <TableCell><strong>Category</strong></TableCell>
                                                        <TableCell><strong>Price</strong></TableCell>
                                                        <TableCell><strong>Rating</strong></TableCell>
                                                        <TableCell align="center"><strong>Action</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {paginatedBooks.length > 0 ? (
                                                        paginatedBooks.map((book) => (
                                                            <TableRow key={book.id}>
                                                                <TableCell>#{book.id}</TableCell>
                                                                <TableCell className="d-flex align-items-center gap-2">
                                                                    <Image src={book.image} alt={book.name} width={35} height={50} />
                                                                    {book.name}
                                                                </TableCell>
                                                                <TableCell>{book.author}</TableCell>
                                                                <TableCell>{book.genre}</TableCell>
                                                                <TableCell>
                                                                    {book.options.length > 0
                                                                        ? `฿${Math.min(...book.options.map(o => o.price))}`
                                                                        : '-'
                                                                    }
                                                                </TableCell>
                                                                <TableCell>{book.rate || '-'}</TableCell>
                                                                <TableCell align="center">
                                                                    <Button
                                                                        size="small"
                                                                        sx={{ minWidth: 'auto', p: 0.5 }}
                                                                        onClick={() => handleOpenDetail(book)}
                                                                    >
                                                                        <Info fontSize="small" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                                                No products found
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={filteredBooks.length}
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
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Product details
                    <IconButton onClick={handleCloseDetail}><Close /></IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
                    {selectedBook && (
                        <>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Image src={selectedBook.image} alt={selectedBook.name} width={100} height={150} />
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Product name: {selectedBook.name}</Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Author: {selectedBook.author}</Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Category: {selectedBook.genre}</Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Rating: {selectedBook.rate}</Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Description: {selectedBook.description}</Typography>
                                </Box>
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography sx={{ fontWeight: 600 }}>Options</Typography>
                                    <Button variant="outlined" size="small" startIcon={<Add />} onClick={handleAddOption} sx={{ textTransform: 'none' }} >
                                        Add Option
                                    </Button>
                                </Box>
                                {selectedBook.options.map(option => (
                                    <Box key={option.id} sx={{ display: 'flex' }}>
                                        <Box sx={{ width: '100%', p: 1.5, mb: 1, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography variant="body2"><strong>{option.type}</strong></Typography>
                                                    <Typography variant="body2">Price: ฿{option.price}</Typography>
                                                    <Typography variant="body2">Stock: {option.stock}</Typography>
                                                </Box>
                                                <Box>
                                                    <IconButton size="small" onClick={() => handleEditOption(option)}>
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => setDeletingOptionId(option.id)}>
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                        {deletingOptionId === option.id && (
                                            <Box sx={{ display: 'flex', mb: 1, transition: 'width 0.3s ease' }}>
                                                <Button
                                                    onClick={() => handleDeleteOption(option.id)}
                                                    sx={{
                                                        backgroundColor: 'success.main',
                                                        color: '#fff',
                                                        '&:hover': { backgroundColor: 'success.dark' }
                                                    }}
                                                >
                                                    <Check />
                                                </Button>
                                                <Button
                                                    onClick={() => setDeletingOptionId(null)}
                                                    sx={{
                                                        backgroundColor: 'error.main',
                                                        color: '#fff',
                                                        '&:hover': { backgroundColor: 'error.dark' }
                                                    }}
                                                >
                                                    <Close />
                                                </Button>
                                                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                                    <Alert
                                                        onClose={handleClose}
                                                        severity="success"
                                                        variant="filled"
                                                        sx={{ width: '100%' }}
                                                    >
                                                        This is a success Alert inside a Snackbar!
                                                    </Alert>
                                                </Snackbar>
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button variant="outlined" onClick={handleCloseDetail}>Close</Button>
                    <Button variant="contained" onClick={() => handleEditProduct(selectedBook!)}>Edit</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isEditing ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogContent dividers sx={{ gap: 2, display: 'flex', flexDirection: 'column', pt: 2 }}>
                    <TextField
                        label="Product name"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                        label="Author"
                        fullWidth
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                    <TextField
                        label="Category"
                        fullWidth
                        value={formData.genre}
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    />
                    <TextField
                        label="Rating"
                        fullWidth
                        type="number"
                        inputProps={{ step: '0.1', min: '0', max: '5' }}
                        value={formData.rate}
                        onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                    />
                    <TextField
                        label="URL Image"
                        fullWidth
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenForm(false)}>Close</Button>
                    <Button variant="contained" onClick={handleSaveProduct}>{isEditing ? 'Save' : 'Add'}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openOptionForm} onClose={() => setOpenOptionForm(false)} maxWidth="xs" fullWidth>
                <DialogTitle>
                    {isEditingOption ? 'Edit Option' : 'Add Option'}
                </DialogTitle>
                <DialogContent dividers sx={{ gap: 2, display: 'flex', flexDirection: 'column', pt: 2 }}>
                    <TextField
                        label="Format (ex. paperback, hardcover)"
                        fullWidth
                        value={optionData.type}
                        onChange={(e) => setOptionData({ ...optionData, type: e.target.value })}
                    />
                    <TextField
                        label="Price"
                        fullWidth
                        type="number"
                        inputProps={{ step: '0.01', min: '0' }}
                        value={optionData.price}
                        onChange={(e) => setOptionData({ ...optionData, price: parseFloat(e.target.value) })}
                    />
                    <TextField
                        label="Stock"
                        fullWidth
                        type="number"
                        inputProps={{ min: '0' }}
                        value={optionData.stock}
                        onChange={(e) => setOptionData({ ...optionData, stock: parseInt(e.target.value) })}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenOptionForm(false)}>Close</Button>
                    <Button variant="contained" onClick={handleSaveOption}>{isEditingOption ? 'Save' : 'Add'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}